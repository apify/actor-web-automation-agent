import cheerio from 'cheerio';
import { type Page } from 'puppeteer';
import { WHITELIST_ATTRIBUTES_WEB_AUTOMATION, WHITELIST_TAGS_WEB_AUTOMATION } from './consts.js';

interface ShrinkHtmlOptions {
    whiteListTags: string[];
    whiteListAttributes: string[];
    maxElementTextLength?: number; // TODO: Implement this
}

/**
 * Tag each element in the HTML with a unique attribute.
 */
export async function tagAllElementsOnPage(page: Page, attributeName: string) {
    return page.$$eval('html *', (elements, attrName) => {
        for (let i = 1; i < elements.length; i++) {
            if (!elements[i].getAttribute(attrName)) elements[i].setAttribute(attrName, `${i}`);
        }
    }, attributeName);
}

export async function shrinkHtml(page: Page, options: ShrinkHtmlOptions) {
    const { whiteListTags, whiteListAttributes } = options;
    const html = await page.content();
    const $ = cheerio.load(html);
    const allElements = $('html *');
    // TODO: Remove empty elements (with not content)
    for (const element of allElements.toArray().reverse()) {
        const $element = $(element);
        const tag = $element.prop('tagName').toLocaleLowerCase();
        // Include only the whitelisted tags
        if (whiteListTags.includes(tag)) {
            const attributes = element.attribs;
            // Include only the whitelisted attributes
            Object.keys(attributes).forEach((attr) => {
                if (!whiteListAttributes.includes(attr)) delete attributes[attr];
            });
            element.attribs = attributes;
        } else {
            // Keep the children and remove the element with its content
            $element.before($element.children());
            $element.remove();
        }
    }
    return $.html()
        .replace(/\s{2,}/g, ' ') // remove extra spaces
        .replace(/>\s+</g, '><'); // remove all spaces between tags;
}

export async function shrinkHtmlForWebAutomation(page: Page) {
    return shrinkHtml(page, {
        whiteListTags: WHITELIST_TAGS_WEB_AUTOMATION,
        whiteListAttributes: WHITELIST_ATTRIBUTES_WEB_AUTOMATION,
    });
}
