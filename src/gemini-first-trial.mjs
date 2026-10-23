import { createHash } from 'node:crypto';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { performance } from 'node:perf_hooks';
import { GEMINI_MODEL, boundedJson } from './gemini-access.mjs';
import { SEO_PROMPT, readSeoDataset, validateSeoDataset } from './seo-prepare.mjs';

const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const sha = (value) => createHash('sha256').update(value).digest('hex');
const tokenCount = (value) => Number.isSafeInteger(value) && value >= 0 ? value : null;
export const GENERATION_CONFIG = Object.freeze({ candidateCount: 1, temperature: 0.2, maxOutputTokens: 768 });

export async function runFirstGeminiTrial({ apiKey, freeTierConfirmed = false, caseRecord, request = fetch, timeoutMs = 45000 } = {}) {
  const key = typeof apiKey === 'string' ? apiKey.trim() : '';
  const base = {
    schemaVersion: 1, requestId: 'gemini-first-seo-20261023', status: 'not_run',
    provider: 'google', model: GEMINI_MODEL, caseId: 'R-atik-su', provenance: 'reported',
    accountTier: freeTierConfirmed ? 'free_user_reported' : 'unconfirmed', billingVerified: false,
    requestsAttempted: 0, httpStatus: null, response: null, wallMs: null,
    inputTokens: null, outputTokens: null, thinkingTokens: null, totalTokens: null, apiCostUsd: null,
    canClaimModelComparison: false, review: { status: 'pending', reviewer: null, accuracy: null, turkish: null },
  };
  const clean = (value) => key ? JSON.parse(JSON.stringify(value).replaceAll(key, '[REDACTED]')) : value;
  if (!freeTierConfirmed) return { ...base, status: 'free_tier_unconfirmed' };
  if (!key) return { ...base, status: 'secret_missing' };
  if (!/^[A-Za-z0-9_-]{20,512}$/.test(key)) return { ...base, status: 'secret_format_invalid' };
  try {
    validateSeoDataset({ schemaVersion: 1, provenance: 'reported', cases: [caseRecord] });
    if (caseRecord.id !== base.caseId) throw new Error('case');
  } catch { return { ...base, status: 'invalid_case' }; }
  const prompt = SEO_PROMPT.replace('{{input}}', () => caseRecord.input);
  const body = JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: GENERATION_CONFIG });
  Object.assign(base, {
    source: caseRecord.source, input: caseRecord.input, promptSha256: sha(SEO_PROMPT),
    inputSha256: sha(caseRecord.input), renderedPromptSha256: sha(prompt), requestSha256: sha(body),
    generationConfig: GENERATION_CONFIG, observedAt: new Date().toISOString(),
  });
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const started = performance.now();
  base.requestsAttempted = 1;
  try {
    const response = await request(ENDPOINT, {
      method: 'POST', redirect: 'error', signal: controller.signal,
      headers: { 'x-goog-api-key': key, 'content-type': 'application/json' }, body,
    });
    base.httpStatus = response.status;
    if (!response.ok) {
      await response.body?.cancel().catch(() => {});
      return clean({ ...base, status: response.status === 429 ? 'quota_error' : 'http_error', wallMs: Math.round(performance.now() - started) });
    }
    const data = await boundedJson(response);
    const candidate = data.candidates?.[0];
    const text = (candidate?.content?.parts ?? []).filter(p => p.thought !== true && typeof p.text === 'string').map(p => p.text).join('').trim();
    const finishReason = ['STOP', 'MAX_TOKENS', 'SAFETY', 'OTHER'].includes(candidate?.finishReason) ? candidate.finishReason : 'OTHER';
    const usage = data.usageMetadata ?? {};
    const wordCount = text ? text.split(/\s+/u).length : 0;
    return clean({
      ...base, status: text && finishReason === 'STOP' ? 'completed' : text ? 'incomplete' : 'blocked_or_empty',
      response: text || null, finishReason, wallMs: Math.round(performance.now() - started), wordCount,
      withinWordLimit: text ? wordCount <= 120 : null,
      inputTokens: tokenCount(usage.promptTokenCount), outputTokens: tokenCount(usage.candidatesTokenCount),
      thinkingTokens: tokenCount(usage.thoughtsTokenCount), totalTokens: tokenCount(usage.totalTokenCount),
      modelVersion: typeof data.modelVersion === 'string' ? data.modelVersion.slice(0, 100) : null,
    });
  } catch {
    return clean({ ...base, status: controller.signal.aborted ? 'timeout_unknown_outcome' : 'request_failed_unknown_outcome', wallMs: Math.round(performance.now() - started) });
  } finally { clearTimeout(timer); }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const config = JSON.parse(await readFile('research/seo-comparison/first-trial-request.json', 'utf8'));
    if (config.requestId !== 'gemini-first-seo-20261023' || config.model !== GEMINI_MODEL || config.caseId !== 'R-atik-su' || config.maximumGenerationRequests !== 1) throw new Error('config');
    const dataset = await readSeoDataset('research/seo-comparison/reported-cases.json');
    await mkdir('runtime', { recursive: true });
    // Reserve this workspace before any request. Never call again just because saving failed.
    await writeFile('runtime/gemini-first-trial-attempt.lock', 'single attempt reserved\n', { flag: 'wx' });
    const output = await runFirstGeminiTrial({ apiKey: process.env.GEMINI_API_KEY, freeTierConfirmed: config.userConfirmedFreeTier === true, caseRecord: dataset.cases.find(c => c.id === config.caseId) });
    await writeFile('runtime/gemini-first-trial.json', JSON.stringify(output, null, 2) + '\n', { flag: 'wx' });
    process.stdout.write('GEMINI_TRIAL_RESULT ' + JSON.stringify(output) + '\n');
    if (output.status !== 'completed') process.exitCode = 1;
  } catch {
    process.stderr.write('Trial setup or result save failed. No automatic retry is allowed.\n');
    process.exitCode = 1;
  }
}
