'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { cacheKey } = require('../../src/key');
test('cacheKey is stable', () => {
  assert.equal(cacheKey(42), 'fixture:42');
});
