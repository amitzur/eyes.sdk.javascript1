'use strict';

const puppeteer = require('puppeteer');
const {makeVisualGridClient} = require('../src/visual-grid-client');
const {getProcessPageAndSerializeScript} = require('@applitools/dom-capture');

(async function() {
  const {openEyes} = makeVisualGridClient({
    apiKey: process.env.APPLITOOLS_API_KEY,
    showLogs: process.env.APPLITOOLS_SHOW_LOGS,
  });

  const {checkWindow, close} = await openEyes({
    appName: 'render script',
    testName: 'render script',
  });

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const processPageAndSerialize = `(${await getProcessPageAndSerializeScript()})()`;

  await page.goto('https://applitools.github.io/demo/TestPages/DomTest/dom_capture.html');
  const {cdt, url, resourceUrls, blobs, frames} = await page.evaluate(processPageAndSerialize);
  const resourceContents = blobs.map(({url, type, value}) => ({
    url,
    type,
    value: Buffer.from(value, 'base64'),
  }));

  checkWindow({url, cdt, resourceUrls, resourceContents, frames});
  const result = await close(false);
  console.log(`${result}`);
  await browser.close();
})();
