'use strict';

const assert = require('assert');

const { RenderRequest } = require('../../index');

describe('RenderRequest', () => {
  describe('constructor', () => {
    it("doesn't allow empty webhook", () => {
      assert.throws(() => new RenderRequest(), /IllegalArgument: webhook is null or empty/);
      assert.throws(() => new RenderRequest({webhook: ''}), /IllegalArgument: webhook is null or empty/);
    });
    
    it("doesn't allow empty url", () => {
      assert.throws(() => new RenderRequest({webhook: 'webhook'}), /IllegalArgument: url is null or undefined/);
    });

    it("doesn't allow empty dom", () => {
      assert.throws(() => new RenderRequest({webhook: 'webhook', url: 'url'}), /IllegalArgument: dom is null or undefined/);
    });

    it("doesn't allow empty resources", () => {
      assert.throws(() => new RenderRequest({webhook: 'webhook', url: 'url', dom: 'dom'}), /IllegalArgument: resources is null or undefined/);
    });

    it("fills values", () => {
      const renderRequest = new RenderRequest({
        webhook: 'webhook',
        url: 'url',
        dom: 'dom',
        resources: 'resources',
        renderInfo: 'renderInfo',
        platform: 'platform',
        browserName: 'browserName',
        scriptHooks: 'scriptHooks',
        selectorsToFindRegionsFor: 'selectorsToFindRegionsFor',
        sendDom: 'sendDom'
      });
      assert.equal(renderRequest.getWebhook(), 'webhook');
      assert.equal(renderRequest.getUrl(), 'url');
      assert.equal(renderRequest.getDom(), 'dom');
      assert.equal(renderRequest.getResources(), 'resources');
      assert.equal(renderRequest.getRenderInfo(), 'renderInfo');
      assert.equal(renderRequest.getPlatform(), 'platform');
      assert.equal(renderRequest.getBrowserName(), 'browserName');
      assert.equal(renderRequest.getScriptHooks(), 'scriptHooks');
      assert.equal(renderRequest.getSelectorsToFindRegionsFor(), 'selectorsToFindRegionsFor');
      assert.equal(renderRequest.getSendDom(), 'sendDom');
    });
  });

  describe('toJSON', () => {
    it('returns the correct object', () => {
      const resource1 = {
        getUrl() { return 'url1'; },
        getHashAsObject() { return 'hashAsObject1'; }
      };
      const resource2 = {
        getUrl() { return 'url2'; },
        getHashAsObject() { return 'hashAsObject2' }
      };
      const dom = {
        getHashAsObject() { return 'dom_hashAsObject'; }
      };

      const renderInfo = {
        toJSON() { return 'renderInfoToJSON'; }
      };

      const renderRequest = new RenderRequest({
        webhook: 'webhook',
        url: 'url',
        resources: [resource1, resource2],
        dom,
        renderInfo,
        platform: 'platform',
        browserName: 'browserName',
        scriptHooks: 'scriptHooks',
        selectorsToFindRegionsFor: 'selectorsToFindRegionsFor',
        sendDom: 'sendDom'
      });
      const expected = {
        webhook: 'webhook',
        url: 'url',
        dom: 'dom_hashAsObject',
        resources: {
          url1: 'hashAsObject1',
          url2: 'hashAsObject2',
        },
        renderInfo: 'renderInfoToJSON',
        browser: { 
          name: 'browserName',
          platform: 'platform',
        },
        scriptHooks: 'scriptHooks',
        selectorsToFindRegionsFor: 'selectorsToFindRegionsFor',
        sendDom: 'sendDom'
      }
      assert.deepEqual(renderRequest.toJSON(), expected);
    });

    it('doesn\'t include platform if there is no browserName', () => {
      const dom = {
        getHashAsObject() { return 'dom_hashAsObject'; }
      };
      const renderRequest = new RenderRequest({
        webhook: 'webhook',
        url: 'url',
        dom,
        resources: [],
        renderInfo: null,
        platform: 'platform'
      });
      const expected = {
        webhook: 'webhook',
        url: 'url',
        dom: 'dom_hashAsObject',
        resources: {}
      }
      assert.deepEqual(renderRequest.toJSON(), expected);
    });

    it.only('includes sendDom even if it\'s false', () => {
      const dom = {
        getHashAsObject() { return 'dom_hashAsObject'; }
      };
      const renderRequest = new RenderRequest({
        webhook: 'webhook',
        url: 'url',
        dom,
        resources: [],
        sendDom: false
      });
      const expected = {
        webhook: 'webhook',
        url: 'url',
        dom: 'dom_hashAsObject',
        resources: {},
        sendDom: false
      }
      assert.deepEqual(renderRequest.toJSON(), expected);
    })
  });

  describe('toString', () => {
    it('returns the correct string', () => {
      const resource1 = {
        getUrl() { return 'url1'; },
        getHashAsObject() { return 'hashAsObject1'; }
      };
      const resource2 = {
        getUrl() { return 'url2'; },
        getHashAsObject() { return 'hashAsObject2' }
      };
      const dom = {
        getHashAsObject() { return 'dom_hashAsObject'; }
      };

      const renderInfo = {
        toJSON() { return 'renderInfoToJSON'; }
      };

      const renderRequest = new RenderRequest({
        webhook: 'webhook',
        url: 'url',
        dom,
        resources: [resource1, resource2],
        renderInfo,
        platform: 'platform',
        browserName: 'browserName',
        scriptHooks: 'scriptHooks',
        selectorsToFindRegionsFor: 'selectorsToFindRegionsFor',
        sendDom: 'sendDom'
      });
      assert.equal(renderRequest.toString(), 'RenderRequest { {"webhook":"webhook","url":"url","dom":"dom_hashAsObject","resources":{"url1":"hashAsObject1","url2":"hashAsObject2"},"browser":{"name":"browserName","platform":"platform"},"renderInfo":"renderInfoToJSON","scriptHooks":"scriptHooks","selectorsToFindRegionsFor":"selectorsToFindRegionsFor","sendDom":"sendDom"} }');
    });
  })
});