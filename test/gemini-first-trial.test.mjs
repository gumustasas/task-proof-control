import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runFirstGeminiTrial } from '../src/gemini-first-trial.mjs';
import { GEMINI_MODEL } from '../src/gemini-access.mjs';

const key = 'unit-test-only-fake-secret-key';
const dataset = JSON.parse(await readFile(new URL('../research/seo-comparison/reported-cases.json', import.meta.url), 'utf8'));
const selected = dataset.cases.find(c => c.id === 'R-atik-su');
const fixture = () => ({ ...structuredClone(selected), review_checks: ['REVIEWER_ONLY_MARKER'] });
const success = (extra = {}) => Response.json({ candidates: [{ finishReason: 'STOP', content: { parts: [{ text: 'Bulgu: Rapora g�re b�l�m eksik. �nce sayfay� do�rulay�n.' }] } }], ...extra });

test('opaque header-safe credentials are accepted and JSON characters redact safely', async () => {
  const opaque = 'opaque/+' + 'a'.repeat(600) + '=\\"';
  let calls = 0;
  const result = await runFirstGeminiTrial({ apiKey: opaque, freeTierConfirmed: true, caseRecord: fixture(), request: async (_url, init) => {
    calls++;
    assert.equal(init.headers['x-goog-api-key'], opaque);
    return Response.json({ candidates: [{ finishReason: 'STOP', content: { parts: [{ text: opaque }] } }] });
  } });
  assert.equal(calls, 1); assert.equal(result.response, '[REDACTED]');
  assert.equal(result.status, 'completed');
  for (const invalid of ['line\nbreak', 'a'.repeat(8193)]) {
    assert.equal((await runFirstGeminiTrial({ apiKey: invalid, freeTierConfirmed: true, caseRecord: fixture(), request: () => assert.fail('invalid header') })).status, 'secret_format_invalid');
  }
});

test('first trial requires explicit Free Tier confirmation, key and intended case before network', async () => {
  const request = () => assert.fail('network must not run');
  assert.equal((await runFirstGeminiTrial({ apiKey: key, caseRecord: fixture(), request })).status, 'free_tier_unconfirmed');
  assert.equal((await runFirstGeminiTrial({ freeTierConfirmed: true, caseRecord: fixture(), request })).status, 'secret_missing');
  const wrong = fixture(); wrong.id = 'other';
  assert.equal((await runFirstGeminiTrial({ apiKey: key, freeTierConfirmed: true, caseRecord: wrong, request })).status, 'invalid_case');
});

test('first trial sends exactly one bounded candidate without review answers, tools or fallback', async () => {
  let calls = 0;
  const result = await runFirstGeminiTrial({ apiKey: key, freeTierConfirmed: true, caseRecord: fixture(), request: async (url, init) => {
    calls++;
    assert.equal(url, `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`);
    assert.equal(init.method, 'POST'); assert.equal(init.redirect, 'error');
    assert.equal(init.headers['x-goog-api-key'], key);
    const body = JSON.parse(init.body);
    assert.equal(body.generationConfig.candidateCount, 1);
    assert.equal(body.generationConfig.maxOutputTokens, 768);
    assert.equal(body.tools, undefined);
    assert.ok(body.contents[0].parts[0].text.includes(selected.input));
    assert.ok(!init.body.includes('REVIEWER_ONLY_MARKER'));
    return success();
  } });
  assert.equal(calls, 1); assert.equal(result.status, 'completed');
  assert.equal(result.apiCostUsd, null); assert.equal(result.inputTokens, null);
  assert.equal(result.canClaimModelComparison, false);
  assert.equal(result.review.status, 'pending');
  assert.match(result.renderedPromptSha256, /^[a-f0-9]{64}$/);
});

test('first trial stops on quota and other HTTP errors without retries or body leakage', async () => {
  for (const status of [429, 403, 503]) {
    let calls = 0;
    const result = await runFirstGeminiTrial({ apiKey: key, freeTierConfirmed: true, caseRecord: fixture(), request: async () => { calls++; return new Response(key, { status }); } });
    assert.equal(calls, 1); assert.equal(result.httpStatus, status);
    assert.equal(result.status, status === 429 ? 'quota_error' : 'http_error');
    assert.ok(!JSON.stringify(result).includes(key));
  }
});

test('first trial preserves truncation as incomplete and records only provider token counts', async () => {
  const result = await runFirstGeminiTrial({ apiKey: key, freeTierConfirmed: true, caseRecord: fixture(), request: async () => Response.json({
    candidates: [{ finishReason: 'MAX_TOKENS', content: { parts: [{ text: 'Yar�m yan�t' }] } }],
    usageMetadata: { promptTokenCount: 120, candidatesTokenCount: 8, totalTokenCount: 128 },
  }) });
  assert.equal(result.status, 'incomplete'); assert.equal(result.response, 'Yar�m yan�t');
  assert.equal(result.inputTokens, 120); assert.equal(result.outputTokens, 8); assert.equal(result.thinkingTokens, null);
});

test('first trial excludes thought parts and redacts an unexpected exact secret reflection', async () => {
  const result = await runFirstGeminiTrial({ apiKey: key, freeTierConfirmed: true, caseRecord: fixture(), request: async () => Response.json({
    candidates: [{ finishReason: 'STOP', content: { parts: [{ thought: true, text: 'not output' }, { text: key }] } }], modelVersion: key,
  }) });
  assert.ok(!JSON.stringify(result).includes(key));
  assert.ok(!result.response.includes('not output'));
  assert.equal(result.response, '[REDACTED]');
});

test('first trial timeout records unknown provider outcome without retry', async () => {
  let calls = 0;
  const result = await runFirstGeminiTrial({ apiKey: key, freeTierConfirmed: true, caseRecord: fixture(), timeoutMs: 5, request: (_url, init) => { calls++; return new Promise((_resolve, reject) => init.signal.addEventListener('abort', () => reject(new Error(key)), { once: true })); } });
  assert.equal(calls, 1); assert.equal(result.status, 'timeout_unknown_outcome');
  assert.ok(!JSON.stringify(result).includes(key));
});
