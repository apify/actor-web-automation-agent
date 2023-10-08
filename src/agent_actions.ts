import { Actor } from 'apify';
import { utils } from 'crawlee';
import { ElementHandle, type Page } from 'puppeteer';
import { z } from 'zod';
import { shrinkHtmlForWebAutomation, tagAllElementsOnPage } from './shrink_html.js';
import { HTML_CURRENT_PAGE_PREFIX, UNIQUE_ID_ATTRIBUTE } from './consts.js';
import { maybeShortsTextByTokenLength } from './tokens.js';
import { webAgentLog, keyValueArrayToObject } from './utils.js';

interface AgentBrowserContext {
    page: Page;
}

export async function waitForNavigation(page: Page) {
    try {
        await page.waitForNavigation({
            timeout: 5000,
            waitUntil: 'load',
        });
    } catch (error: any) {
        webAgentLog.debug('waitForNavigation failed', error);
    }
}

export async function goToUrl(context: AgentBrowserContext, { url }: { url: string }) {
    webAgentLog.info('Calling go to page', { url });
    const { page } = context;
    await page.goto(url);
    await waitForNavigation(page);
    await utils.puppeteer.closeCookieModals(page);
    await tagAllElementsOnPage(page, UNIQUE_ID_ATTRIBUTE);
    const minHtml = await shrinkHtmlForWebAutomation(page);
    webAgentLog.info(`Went to page, current URL: ${page.url()}`, { url, htmlLength: minHtml.length });
    return maybeShortsTextByTokenLength(`Previous action was: go_to_url, ${HTML_CURRENT_PAGE_PREFIX} ${minHtml}`, 10000);
}

export async function betterClick(page: Page, element: ElementHandle) {
    try {
        await Promise.all([
            // NOTE: Pptr click is not working for some reason for non visible elements,
            // ensures click is called on the element itself.
            page.evaluate((el: any) => el.click(), element),
            element.click(),
        ]);
    } catch (error: any) {
        // This can happen when click work in the first try, but second click fails, because loosing context.
        webAgentLog.debug('The clickElement failed!', { error });
    }
}

export async function clickElement(context: AgentBrowserContext, { text, gid, tagName }: { text: string, gid: number, tagName?: string }) {
    tagName = tagName || 'a';
    webAgentLog.info('Calling clicking on link', { text, gid, tagName });
    const { page } = context;
    let elementFoundAndClicked = false;
    let linkFoundByGidSelector = false;
    if (gid) {
        const linkHtmlSelector = `${tagName}[gid="${gid}"]`;
        const link = await page.$(linkHtmlSelector);
        if (link) {
            await betterClick(page, link);
            elementFoundAndClicked = true;
            linkFoundByGidSelector = true;
        }
    }

    if (!elementFoundAndClicked && text) {
        const link = await page.$(`${tagName} ::-p-text(${text})`);
        if (link) {
            await betterClick(page, link);
            elementFoundAndClicked = true;
        }
    }

    if (!elementFoundAndClicked) {
        // TODO: Handle this error
        webAgentLog.error(`Cannot find link with text ${text} or gid ${gid} on ${page.url()}`);
        throw new Error('Element not found');
    }

    await waitForNavigation(page);
    await utils.puppeteer.closeCookieModals(page);
    await tagAllElementsOnPage(page, UNIQUE_ID_ATTRIBUTE);
    const minHtml = await shrinkHtmlForWebAutomation(page);

    webAgentLog.info(`Clicked on link, current URL: ${page.url()}`, { text, gid, linkFoundByGidSelector, htmlLength: minHtml.length });
    return maybeShortsTextByTokenLength(`Previous action was: click_element, ${HTML_CURRENT_PAGE_PREFIX} ${minHtml}`, 10000);
}

export async function fillForm(context: AgentBrowserContext, { formData }: { formData: { gid: number, value: string }[]}) {
    webAgentLog.info('Calling filling form', { formData });
    const { page } = context;
    for (const { gid, value } of formData) {
        const element = await page.$(`[${UNIQUE_ID_ATTRIBUTE}="${gid}"]`);
        if (element) {
            await element.type(value.trim());
        }
    }
    webAgentLog.info('Form was filled with values', { formData });
    const submitButton = await page.$('button[type="submit"]');
    // If the submit button is not presented, submit the form by pressing enter.
    if (submitButton) {
        await submitButton.click();
    } else {
        await page.keyboard.press('Enter');
    }
    await waitForNavigation(page);
    await utils.puppeteer.closeCookieModals(page);
    await tagAllElementsOnPage(page, UNIQUE_ID_ATTRIBUTE);
    const minHtml = await shrinkHtmlForWebAutomation(page);
    webAgentLog.info(`Form submitted, current URL: ${page.url()}`, { htmlLength: minHtml.length });
    return maybeShortsTextByTokenLength(`Previous action was: fill_form_and_submit, ${HTML_CURRENT_PAGE_PREFIX} ${minHtml}`, 10000);
}

export async function extractData(context: AgentBrowserContext, { attributesToExtract }: { attributesToExtract: { gid: number, keyName: string }[] }) {
    webAgentLog.info('Calling extracting data from page', { attributesToExtract });
    const { page } = context;
    const extractedData: Record<string, string | null> = {};
    for (const { gid, keyName } of attributesToExtract) {
        const element = await page.$(`[${UNIQUE_ID_ATTRIBUTE}="${gid}"]`);
        if (element) {
            const value = await page.evaluate((el) => el.textContent, element);
            extractedData[keyName] = value && value.trim();
        }
    }
    webAgentLog.info('Data were extracted from page', { extractedData });
    return `Extracted JSON data from page: ${JSON.stringify(extractedData)}`;
}

export async function pushToDataset(_: AgentBrowserContext, { objects }: { objects: any[] }) {
    webAgentLog.info('Calling push to dataset', { objects });
    // NOTE: For some reason passing the object directly to as function param did not work.
    const items: any[] = [];
    objects.forEach((object) => {
        const item = keyValueArrayToObject(object);
        items.push(item);
    });
    await Actor.pushData(items);
    webAgentLog.info('Pushed to dataset!', { items });
    return 'Pushed to dataset.';
}

export async function saveOutput(_: AgentBrowserContext, { object }: { object: { key: string, value: string }[] }) {
    webAgentLog.info('Calling save output', { object });
    // NOTE: For some reason passing the object directly to as function param did not work.
    const data = keyValueArrayToObject(object);
    await Actor.setValue('OUTPUT', data);
    webAgentLog.info('Output saved!', { data });
    return 'Output saved';
}

export async function captureAndSaveScreenshot(context: AgentBrowserContext, { filename, saveHtml }: { filename?: string, saveHtml?: boolean }) {
    webAgentLog.info('Calling capture and save screenshot', { filename, saveHtml });
    const { page } = context;
    const key = filename || 'screenshot';
    const kvs = await Actor.openKeyValueStore();
    await utils.puppeteer.saveSnapshot(page, { key, saveHtml });
    webAgentLog.info(`Screenshot saved, you can check it ${kvs.getPublicUrl(key)}.jpeg .`, {
        screenshotUrl: `${kvs.getPublicUrl(key)}.jpg`,
        htmlUrl: saveHtml && `${kvs.getPublicUrl(key)}.html`,
    });
    return 'Screenshot saved';
}

/**
 * List of all actions that can agent can use.
 * NOTE: The return value from the action function will be used in the next step in LLM flow.
 */
export const ACTIONS = {
    GO_TO_URL: {
        name: 'go_to_url',
        description: 'Goes to a specific URL and gets the content',
        parameters: z.object({
            url: z.string().url().describe('The valid URL to go to (including protocol)'),
        }),
        required: ['url'],
        action: goToUrl,
    },
    CLICK_ELEMENT: {
        name: 'click_element',
        description: 'Clicks on a element with the given gid on the page. Note that gid is required and'
            + ' you must use the corresponding gid attribute from the page content. '
            + 'Add the text of the link to confirm that you are clicking the right link.',
        parameters: z.object({
            tagName: z.string().describe('The tag name of the element to click'),
            text: z.string().describe('The text on the element you want to click'),
            gid: z.number().describe('The gid of the element to click (from the page content)'),
        }),
        required: ['text', 'gid'],
        action: clickElement,
    },
    FILL_FORM: {
        name: 'fill_form_and_submit',
        description: 'Types value to input fields and submit the form.',
        parameters: z.object({
            formData: z.array(z.object({
                gid: z.number().int().describe('The gid HTML attribute from the content to fill'),
                value: z.string().describe('The value to fill to the input field'),
            })).describe('The list of form data to fill'),
        }),
        action: fillForm,
    },
    // TODO: It turns out that this is not needed, because the data can be extracted from the page content using LLM directly.
    // It works better than LLM just tell which data to extract. But need to investigate more.
    // EXTRACT_DATA: {
    //     name: 'extract_data',
    //     description: 'Extract data from HTML page content',
    //     parameters: z.object({
    //         attributesToExtract: z.array(z.object({
    //             gid: z.number().int().describe('The gid HTML attribute from the HTML, which contains the text to extract'),
    //             keyName: z.string().describe('The name of the key'),
    //         })).describe('The list of gid keys of the elements gid attributes to extract text from (from the page content)'),
    //     }),
    //     required: ['attributesToExtract'],
    //     action: extractData,
    // },
    SAVE_OUTPUT: {
        name: 'save_object_to_output',
        description: 'Saves the output in the key-value store',
        parameters: z.object({
            object: z.array(z.object({
                key: z.string().describe('Key of the object to save to output'),
                value: z.string().describe('The value of the object to save to output'),
            })).describe('The key value pair of object to save to output'),
        }),
        action: saveOutput,
    },
    SAVE_TO_DATASET: {
        name: 'save_objects_to_dataset',
        description: 'Saves one or multiple object to the dataset',
        parameters: z.object({
            objects: z.array(
                z.array(z.object({
                    key: z.string().describe('Key of the object to save to dataset'),
                    value: z.string().describe('The value of the object to save to dataset'),
                })).describe('The key value pair of object to save to dataset'),
            ).describe('The list of objects to save to dataset'),
        }),
        action: pushToDataset,
    },
    CAPTURE_AND_SAVE_SCREENSHOT: {
        name: 'capture_and_save_screenshot',
        description: 'Captures and saves a screenshot of the current page',
        parameters: z.object({
            filename: z.string().optional().describe('The filename of the screenshot without extension'),
            saveHtml: z.boolean().optional().describe('Whether to save the HTML of the page'),
        }),
        action: captureAndSaveScreenshot,
    },
};

export const ACTION_LIST = Object.values(ACTIONS);
