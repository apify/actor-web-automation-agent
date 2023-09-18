import { Actor, log } from 'apify';
import { launchPuppeteer, sleep } from 'crawlee';
import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { DynamicStructuredTool } from 'langchain/tools';
import { Input } from './input.js';
import { ACTION_LIST } from './agent_actions.js';
import { createServer } from './screenshotter_server.js';
import { webAgentLog } from './utils.js';

const LIVE_VIEW_URL = process.env.ACTOR_WEB_SERVER_URL ? process.env.ACTOR_WEB_SERVER_URL : 'http://localhost:4000';

// Initialize the Apify SDK
await Actor.init();

if (!process.env.OPENAI_API_KEY) {
    await Actor.fail('OPENAI_API_KEY cannot be empty!');
    throw new Error('OPENAI_API_KEY cannot be empty!');
}

const { startUrl, instructions, proxyConfiguration } = await Actor.getInput() as Input;

log.info('Starting Actor..', { startUrl, instructions });

const initialContext = {
    role: 'system',
    content: '## OBJECTIVE ##\n'
        + 'You have been tasked with automate action on web page based on a task given by the user. '
        + 'You are connected to a web browser which you can control via function calls to navigate to pages and list elements on the page. '
        + 'You can also type into search boxes and other input fields and send forms. '
        + 'If you open or go to a page content from the page will be scraped and returned to you. '
        + 'You can do just one action in time from available actions.'
        + 'You can also click links on the page. You will behave as a human browsing the web.\n'
        + '## NOTES ##\n'
        + 'You will try to navigate directly to the most relevant web address. '
        + 'If you were given a URL, go to it directly. If you encounter a Page Not Found error, try another URL. '
        + 'If multiple URLs don\'t work, you are probably using an outdated version of the URL scheme of that website. '
        + 'In that case, try navigating to their front page and using their search bar or try navigating to the right place with links.',
};

let proxyUrl;
if (proxyConfiguration) {
    const proxy = await Actor.createProxyConfiguration(proxyConfiguration);
    if (proxy) proxyUrl = await proxy.newUrl();
}

const browser = await launchPuppeteer({
    useChrome: true,
    launchOptions: {
        headless: false,
        args: [
            '--window-size=1920,1080',
        ],
        defaultViewport: {
            width: 1920,
            height: 1080,
        },
    },
    proxyUrl,
});
const page = await browser.newPage();
log.info('Browser opened');

// Server which serves screenshots
const server = await createServer(page);
log.info(`Live view started, you can see Web Automation Agent in action on in Live View tab or ${LIVE_VIEW_URL}`);

const tools = ACTION_LIST.map((action) => {
    // TODO: Better to create a class for each action to inherit from DynamicStructuredTool
    return new DynamicStructuredTool({
        name: action.name,
        description: action.description,
        schema: action.parameters,
        func: async (args) => {
            // @ts-ignore
            return action.action({ page }, args);
        },
    });
});

const chat = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: 'gpt-4-32k',
    temperature: 0,
});

const executor = await initializeAgentExecutorWithOptions(tools, chat, {
    agentType: 'openai-functions',
    agentArgs: {
        prefix: initialContext.content,
    },
    verbose: log.getLevel() >= log.LEVELS.DEBUG,
});

const finalInstructions = startUrl
    ? `Open url ${startUrl} and continue with ${instructions}`
    : instructions;
webAgentLog.info(`Stating agent with instructions: ${finalInstructions}`);
const result = await executor.run(finalInstructions);
webAgentLog.info(`Agent finished it's work.`);
webAgentLog.info(result);

// Wait for 10 seconds to see the final page in live view.
await sleep(10000);

// Clean up
await server.destroy();
await browser.close();

log.info('Actor finished');
await Actor.exit();
