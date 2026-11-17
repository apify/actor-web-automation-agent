import cheerio from 'cheerio';
import { type Page } from 'puppeteer';
import { WHITELIST_ATTRIBUTES_WEB_AUTOMATION, WHITELIST_TAGS_WEB_AUTOMATION, HTML_COMMENT_REGEX } from './consts.js';

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

/**
 * Remove all elements that are not whitelisted.
 * @param page
 * @param options
 */
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
            // NOTE: Keep the children and element in some case, but remove the element itself.
            const children = $element.children();
            const text = $element.children().remove().end().text();
            // Replace the element with its children
            // If the parent element is button or link, keep element text (usefully in case some strange element tag are used as children for buttons or links)
            if (text) {
                let isParentButtonOrLink = false;
                let prev = $element;
                // Check just 3 levels up
                for (let i = 0; i < 3; i++) {
                    const parent = prev.parent().first();
                    if (!parent || parent.length === 0) break;
                    if (parent.prop('tagName').toLocaleLowerCase() === 'a' || parent.prop('tagName').toLocaleLowerCase() === 'button') {
                        isParentButtonOrLink = true;
                        break;
                    }
                    prev = parent;
                }
                if (isParentButtonOrLink) $element.before(text);
            }
            $element.before(children);
            // Remove the element
            $element.remove();
        }
    }
    return $.html()
        .replace(/\s{2,}/g, ' ') // remove extra spaces
        .replace(/>\s+</g, '><') // remove all spaces between tags;
        .replace(HTML_COMMENT_REGEX, ''); // Remove HTML comments (e.g. <!-- comment -->)
}

export async function shrinkHtmlForWebAutomation(page: Page) {
    return shrinkHtml(page, {
        whiteListTags: WHITELIST_TAGS_WEB_AUTOMATION,
        whiteListAttributes: WHITELIST_ATTRIBUTES_WEB_AUTOMATION,
    });
}
