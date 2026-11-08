'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const net = require('node:net');

function pingRedis(redisUrl) {
  return new Promise((resolve, reject) => {
    const url = new URL(redisUrl);
    const port = Number(url.port || 6379);
    const socket = net.createConnection({ host: url.hostname, port });
    let response = '';

    const timer = setTimeout(() => {
      socket.destroy(new Error('Redis PING timed out'));
    }, 3000);

    socket.setEncoding('utf8');
    socket.on('connect', () => socket.write('*1\r\n$4\r\nPING\r\n'));
    socket.on('data', chunk => {
      response += chunk;
      if (response.includes('\r\n')) {
        clearTimeout(timer);
        socket.end();
        resolve(response);
      }
    });
    socket.on('error', error => {
      clearTimeout(timer);
      reject(error);
    });
  });
}

test('trusted runner Redis accepts PING', async () => {
  const redisUrl = String(process.env.INTEGRATION_REDIS_URL || '').trim();

  if (!redisUrl) {
    throw new Error('INTEGRATION_REDIS_URL is required');
  }

  const response = await pingRedis(redisUrl);
  assert.match(response, /^\+PONG/);
});
