import { Actor, log } from 'apify';
import { launchPuppeteer, sleep } from 'crawlee';
import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { DynamicStructuredTool } from 'langchain/tools';
import { Input } from './input.js';
import { ACTION_LIST } from './agent_actions.js';
import { createServer } from './screenshotter_server.js';
import { webAgentLog } from './utils.js';
import { waitForNavigation, clickElement } from './agent_actions.js';

const LIVE_VIEW_URL = process.env.ACTOR_WEB_SERVER_URL ? process.env.ACTOR_WEB_SERVER_URL : 'http://localhost:4000';

// Initialize the Apify SDK
await Actor.init();

const browser = await launchPuppeteer({
    useChrome: true,
    launchOptions: { headless: false },
    // proxyUrl,
});
const page = await browser.newPage();
await page.goto('https://www.apple.com/cz/iphone/');

await waitForNavigation(page);

const element = await page.$('a ::-p-text(iPhone 14)');

console.log(element)

if(!element) throw new Error('Element not found');
await clickElement(page, element);

await sleep(10000);

await Actor.exit();
