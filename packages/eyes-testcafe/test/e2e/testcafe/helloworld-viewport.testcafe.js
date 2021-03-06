/* global fixture */

'use strict';

const { Configuration } = require('@applitools/eyes-common');
const { Eyes, Target } = require('../../../');

fixture`Hello world`.page`https://applitools.com/helloworld`; // eslint-disable-line no-unused-expressions

test('helloworld viewport', async (t) => {
  const configuration = new Configuration({ showLogs: !!process.env.APPLITOOLS_SHOW_LOGS, viewportSize: { width: 800, height: 600 } });
  const eyes = new Eyes({ t, configuration });
  await eyes.open('Applitools helloworld', 'eyes-testcafe e2e - viewport');
  await eyes.check('some tag', Target.window());
  await eyes.close();
});
