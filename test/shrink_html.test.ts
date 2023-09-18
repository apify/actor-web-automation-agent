import {Page} from "puppeteer";
import { describe, expect, test } from '@jest/globals';
import { shrinkHtmlForWebAutomation, tagAllElementsOnPage } from '../src/shrink_html.js';

const createPage = (html: string) => {
    return {
        async content() {
            return html
        }
    } as Page
}

const DUMMY_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page live view</title>
    <!--  Ensures page refresh every 1 sec  -->
     <meta http-equiv="refresh" content="1">
</head>
<body>
   <img src="test.jpg" />
</body>
</html>`

describe('shrink HTML', () => {
    test('shrinkHtmlForWebAutomation can be run twice', async () => {
        const shrinkedHtml = await shrinkHtmlForWebAutomation(createPage(DUMMY_HTML));
        const shrinkedHtml2 = await shrinkHtmlForWebAutomation(createPage(shrinkedHtml));
        expect(shrinkedHtml).toEqual(shrinkedHtml2);
    });
});
