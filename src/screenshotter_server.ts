// eslint-disable-next-line import/no-extraneous-dependencies
import { log } from 'crawlee';
import express from 'express';
import http from 'node:http';
import { writeFile, rm } from 'node:fs/promises';
import type { Page } from 'puppeteer';

// @ts-ignore
const PORT = process.env.ACTOR_WEB_SERVER_PORT ? parseInt(process.env.ACTOR_WEB_SERVER_PORT, 10) : 4000;
const PAGE_FILE_NAME = 'page.jpeg';

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
   <img src="${PAGE_FILE_NAME}" />
</body>
</html>`;

/**
 * Create server which serves screenshots from puppeteer page.
 * Uses this for server live view of the page in Apify live view.
 * This is experimental.
 */
export const createServer = async (page: Page) => {
    const app = express();
    const server = http.createServer(app);
    const client = await page.target().createCDPSession();

    let initialPage = true;

    app.get('/', async (_, res) => {
        if (initialPage) {
            const startOptions = {
                format: 'jpeg',
                quality: 50,
                everyNthFrame: 1,
            };
            client.on('Page.screencastFrame', async (frameObject) => {
                const buffer = Buffer.from(frameObject.data, 'base64');
                await writeFile(PAGE_FILE_NAME, buffer);
                await client.send('Page.screencastFrameAck', {
                    sessionId: frameObject.sessionId,
                });
            });
            // @ts-ignore
            await client.send('Page.startScreencast', startOptions);
            initialPage = false;
        }
        res.status(200).send(DUMMY_HTML);
    });

    app.get(`/${PAGE_FILE_NAME}`, (_, res, next) => {
        const options = {
            root: './',
            dotfiles: 'deny',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true,
            },
        };
        // @ts-ignore
        res.sendFile(PAGE_FILE_NAME, options, (err) => {
            // TODO: Fallback for some dummy image
            if (err) {
                log.debug('Cannot serve file', err);
            }
            next();
        });
    });

    server.listen(PORT, () => {
        log.debug(`Server listening on ${PORT}`);
    });

    return {
        destroy: async () => {
            await client.detach();
            server.close();
            await rm(PAGE_FILE_NAME, { force: true });
        },
    };
};
