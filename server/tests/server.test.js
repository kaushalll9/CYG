import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'http';
import { app, io } from '../src/index.js';
import { closeDatabase } from '../src/db/index.js';

test('Backend Server - Health endpoint responds with status ok', async (t) => {
  const testServer = http.createServer(app);
  await new Promise((resolve) => testServer.listen(0, resolve));
  const port = testServer.address().port;

  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/health`, {
      headers: { connection: 'close' }
    });
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.equal(data.status, 'ok');
    assert.match(data.phase, /Phase 0/);
    assert.ok(data.timestamp);
    assert.ok(data.message);
  } finally {
    if (typeof testServer.closeAllConnections === 'function') {
      testServer.closeAllConnections();
    }
    await new Promise((resolve) => testServer.close(resolve));
    await closeDatabase();
    await new Promise((resolve) => io.close(resolve));
  }
});
