import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { runSeoBaseline } from '../src/openai-seo-baseline.mjs';
import { SEO_PROMPT } from '../src/seo-prepare.mjs';

const dataset = JSON.parse(await readFile(new URL('../research/seo-comparison/reported-cases.json', import.meta.url), 'utf8'));
const caseRecord = dataset.cases.find(c => c.id === 'R-atik-su');
test('committed Gemini reference hashes match the actual frozen baseline prompt and input', async () => {
  const observed = JSON.parse(await readFile(new URL('../research/seo-comparison/first-trial-observed.json', import.meta.url), 'utf8'));
  assert.equal(observed.status, 'completed');
  assert.equal(observed.caseId, caseRecord.id);
  assert.equal(observed.promptSha256, sha(SEO_PROMPT));
  assert.equal(observed.inputSha256, sha(caseRecord.input));
  assert.equal(observed.renderedPromptSha256, sha(SEO_PROMPT.replace('{{input}}', () => caseRecord.input)));
});
const sha = s => createHash('sha256').update(s).digest('hex');
const ref = c => ({ status: 'completed', caseId: c.id, promptSha256: sha(SEO_PROMPT), inputSha256: sha(c.input), renderedPromptSha256: sha(SEO_PROMPT.replace('{{input}}', () => c.input)) });
const args = () => ({ approved: true, apiKey: 'fake-unit-test-key', caseRecord, reference: ref(caseRecord) });
const success = () => Response.json({ status: 'completed', model: 'gpt-4o-mini-2024-07-18', output: [{ type: 'message', role: 'assistant', content: [{ type: 'output_text', text: 'Bulgu: Rapora g�re eksik.' }] }], usage: { input_tokens: 280, output_tokens: 100, total_tokens: 380 } });

test('baseline gates approval, credentials, reference hashes and budget before any network', async () => {
  const request = () => assert.fail('network forbidden');
  assert.equal((await runSeoBaseline({ ...args(), approved: false, request })).status, 'approval_missing');
  assert.equal((await runSeoBaseline({ ...args(), apiKey: '', request })).status, 'secret_missing');
  assert.equal((await runSeoBaseline({ ...args(), reference: {}, request })).status, 'reference_mismatch');
  const large = { ...caseRecord, input: 'a'.repeat(6000) };
  assert.equal((await runSeoBaseline({ ...args(), caseRecord: large, reference: ref(large), request })).status, 'budget_exceeded');
});

test('baseline sends exactly the matched prompt once without reviewer/model answer leakage', async () => {
  let calls = 0;
  const result = await runSeoBaseline({ ...args(), request: async (url, init) => {
    calls++;
    assert.equal(url, 'https://api.openai.com/v1/responses');
    assert.equal(init.redirect, 'error');
    const body = JSON.parse(init.body);
    assert.equal(body.input.length, 1);
    assert.equal(body.input[0].content, SEO_PROMPT.replace('{{input}}', () => caseRecord.input));
    assert.equal(body.model, 'gpt-4o-mini'); assert.equal(body.store, false);
    assert.equal(body.max_output_tokens, 768); assert.equal(body.tools, undefined);
    return success();
  } });
  assert.equal(calls, 1); assert.equal(result.status, 'completed');
  assert.equal(result.totalTokens, 380); assert.equal(result.apiCostUsd, null);
  assert.equal(result.estimatedCostUsd, 0.000102); assert.ok(result.listPriceUpperBoundUsd < 0.001);
});

test('baseline errors, truncation and reflected secrets cannot cause retries or leakage', async () => {
  for (const status of [429, 403, 503]) {
    let calls = 0;
    const result = await runSeoBaseline({ ...args(), request: async () => { calls++; return new Response('fake-unit-test-key', { status }); } });
    assert.equal(calls, 1); assert.equal(result.httpStatus, status);
    assert.ok(!JSON.stringify(result).includes('fake-unit-test-key'));
  }
  const result = await runSeoBaseline({ ...args(), request: async () => Response.json({ status: 'incomplete', output: [{ type: 'message', role: 'assistant', content: [{ type: 'output_text', text: 'fake-unit-test-key' }] }] }) });
  assert.equal(result.status, 'incomplete'); assert.equal(result.response, '[REDACTED]');
});

test('baseline timeout records unknown provider outcome with one attempt', async () => {
  let calls = 0;
  const result = await runSeoBaseline({ ...args(), timeoutMs: 5, request: (_url, init) => { calls++; return new Promise((_r, reject) => init.signal.addEventListener('abort', () => reject(new Error('fake-unit-test-key')), { once: true })); } });
  assert.equal(calls, 1); assert.equal(result.status, 'timeout_unknown_outcome');
  assert.ok(!JSON.stringify(result).includes('fake-unit-test-key'));
});

test('429 diagnostics distinguish billing from rate limits using only allowlisted codes', async () => {
  const cases = [
    ['credit_balance_exhausted', 'insufficient_quota', 'quota_error'],
    ['insufficient_quota', 'insufficient_quota', 'quota_error'],
    ['project_spend_limit_exceeded', 'invalid_request_error', 'quota_error'],
    ['rate_limit_exceeded', 'rate_limit_error', 'rate_limit_error'],
    ['slow_down', 'rate_limit_error', 'rate_limit_error'],
    ['fake-unit-test-key', 'fake-unit-test-key', 'rate_or_quota_error'],
  ];
  for (const [code, type, expected] of cases) {
    let calls = 0;
    const result = await runSeoBaseline({ ...args(), request: async () => { calls++; return Response.json({ error: { code, type, message: 'fake-unit-test-key' } }, { status: 429 }); } });
    assert.equal(calls, 1); assert.equal(result.status, expected);
    assert.ok(!JSON.stringify(result).includes('fake-unit-test-key'));
    assert.equal(result.errorCode, code === 'fake-unit-test-key' ? null : code);
  }
});

test('non-JSON and oversized 429 bodies remain ambiguous and never retry', async () => {
  for (const body of ['fake-unit-test-key', 'x'.repeat(40000)]) {
    let calls = 0;
    const result = await runSeoBaseline({ ...args(), request: async () => { calls++; return new Response(body, { status: 429 }); } });
    assert.equal(calls, 1); assert.equal(result.status, 'rate_or_quota_error');
    assert.equal(result.errorCode, null); assert.equal(result.errorType, null);
    assert.ok(!JSON.stringify(result).includes('fake-unit-test-key'));
  }
});
