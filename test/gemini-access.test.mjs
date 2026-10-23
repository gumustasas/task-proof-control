import test from 'node:test';
import assert from 'node:assert/strict';
import { checkGeminiAccess, GEMINI_METADATA_URL, GEMINI_MODEL, MAX_METADATA_BYTES } from '../src/gemini-access.mjs';

const metadata = () => Response.json({ name: `models/${GEMINI_MODEL}`, supportedGenerationMethods: ['generateContent'] });
const secret = 'test-only-secret-never-a-real-key';

test('Gemini missing secret makes no request', async () => {
  const output = await checkGeminiAccess({ request: () => assert.fail('network') });
  assert.equal(output.status, 'secret_missing');
});

test('Gemini metadata uses one fixed GET without a query key, prompt or generation', async () => {
  let calls = 0;
  const output = await checkGeminiAccess({ apiKey: secret, request: async (url, init) => {
    calls++;
    assert.equal(url, GEMINI_METADATA_URL);
    assert.equal(new URL(url).search, '');
    assert.equal(init.method, 'GET');
    assert.equal(init.redirect, 'error');
    assert.equal(init.headers['x-goog-api-key'], secret);
    assert.equal(init.body, undefined);
    return metadata();
  } });
  assert.equal(calls, 1);
  assert.equal(output.status, 'metadata_ok');
  assert.equal(output.generationRequested, false);
  assert.equal(output.freeTierVerified, false);
  assert.equal(output.remainingQuota, null);
  assert.ok(!JSON.stringify(output).includes(secret));
});

test('Gemini errors do not leak response bodies, thrown secrets or retry', async () => {
  let calls = 0;
  const output = await checkGeminiAccess({ apiKey: secret, request: async () => { calls++; return new Response(secret, { status: 403 }); } });
  assert.equal(output.httpStatus, 403);
  assert.equal(calls, 1);
  assert.ok(!JSON.stringify(output).includes(secret));
  const thrown = await checkGeminiAccess({ apiKey: secret, request: async () => { throw new Error(secret); } });
  assert.equal(thrown.status, 'request_failed');
  assert.ok(!JSON.stringify(thrown).includes(secret));
});

test('Gemini metadata response must match requested model', async () => {
  const output = await checkGeminiAccess({ apiKey: secret, request: async () => Response.json({ name: 'models/other', supportedGenerationMethods: [] }) });
  assert.equal(output.status, 'invalid_metadata');
});

test('Gemini response body is bounded even without content-length', async () => {
  const output = await checkGeminiAccess({ apiKey: secret, request: async () => new Response(' '.repeat(MAX_METADATA_BYTES + 1)) });
  assert.equal(output.status, 'request_failed');
});

test('Gemini timeout aborts the single request', async () => {
  const output = await checkGeminiAccess({ apiKey: secret, timeoutMs: 5, request: (_url, init) => new Promise((_resolve, reject) => {
    init.signal.addEventListener('abort', () => reject(new Error(secret)), { once: true });
  }) });
  assert.equal(output.status, 'timeout');
});
