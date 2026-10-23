import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { performance } from 'node:perf_hooks';
import { boundedJson } from './gemini-access.mjs';
import { SEO_PROMPT, readSeoDataset, validateSeoDataset } from './seo-prepare.mjs';

export const BASELINE_MODEL = 'gpt-4o-mini';
const ENDPOINT = 'https://api.openai.com/v1/responses';
const sha = value => createHash('sha256').update(value).digest('hex');
const count = v => Number.isSafeInteger(v) && v >= 0 ? v : null;
const estimate = (input, output) => (input * 0.15 + output * 0.60) / 1e6;

export async function runSeoBaseline({ approved = false, apiKey, caseRecord, reference, request = fetch, timeoutMs = 45000 } = {}) {
  const key = typeof apiKey === 'string' ? apiKey.trim() : '';
  const base = { schemaVersion: 1, provider: 'openai', model: BASELINE_MODEL, caseId: 'R-atik-su', provenance: 'reported', status: 'not_run', requestsAttempted: 0, httpStatus: null, response: null, wallMs: null, inputTokens: null, outputTokens: null, totalTokens: null, apiCostUsd: null, estimatedCostUsd: null, review: { status: 'pending' } };
  const clean = v => typeof v === 'string' ? (key ? v.replaceAll(key, '[REDACTED]') : v) : Array.isArray(v) ? v.map(clean) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, value]) => [k, clean(value)])) : v;
  if (!approved) return { ...base, status: 'approval_missing' };
  if (!key) return { ...base, status: 'secret_missing' };
  if (key.length > 8192 || /[^\x21-\x7E]/.test(key)) return { ...base, status: 'unsafe_header' };
  try {
    validateSeoDataset({ schemaVersion: 1, provenance: 'reported', cases: [caseRecord] });
    if (caseRecord.id !== base.caseId) throw new Error('case');
  } catch { return { ...base, status: 'invalid_case' }; }
  const prompt = SEO_PROMPT.replace('{{input}}', () => caseRecord.input);
  const hashes = { promptSha256: sha(SEO_PROMPT), inputSha256: sha(caseRecord.input), renderedPromptSha256: sha(prompt) };
  if (reference?.status !== 'completed' || reference.caseId !== base.caseId || Object.entries(hashes).some(([k, v]) => reference[k] !== v)) return { ...base, status: 'reference_mismatch' };
  const inputTokenUpperBound = Buffer.byteLength(prompt, 'utf8') + 512;
  const listPriceUpperBoundUsd = estimate(inputTokenUpperBound, 768);
  if (listPriceUpperBoundUsd > 0.001) return { ...base, status: 'budget_exceeded' };
  const body = JSON.stringify({ model: BASELINE_MODEL, input: [{ role: 'user', content: prompt }], temperature: 0.2, max_output_tokens: 768, store: false });
  Object.assign(base, hashes, { input: caseRecord.input, source: caseRecord.source, requestSha256: sha(body), observedAt: new Date().toISOString(), listPriceUpperBoundUsd, inputTokenUpperBound, pricing: { inputPerMillionUsd: 0.15, outputPerMillionUsd: 0.60, checkedAt: '2026-10-23', source: 'https://developers.openai.com/api/docs/models/gpt-4o-mini', billingVerified: false }, mode: 'local_api_single_sample' });
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const started = performance.now();
  base.requestsAttempted = 1;
  try {
    const response = await request(ENDPOINT, { method: 'POST', headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' }, body, redirect: 'error', signal: controller.signal });
    base.httpStatus = response.status;
    if (!response.ok) {
      await response.body?.cancel().catch(() => {});
      return clean({ ...base, status: response.status === 429 ? 'quota_error' : 'http_error', wallMs: Math.round(performance.now() - started) });
    }
    const data = await boundedJson(response);
    const text = (Array.isArray(data.output) ? data.output : []).filter(item => item.type === 'message' && item.role === 'assistant').flatMap(item => Array.isArray(item.content) ? item.content : []).filter(p => p.type === 'output_text' && typeof p.text === 'string').map(p => p.text).join('').trim();
    const inputTokens = count(data.usage?.input_tokens), outputTokens = count(data.usage?.output_tokens);
    const wordCount = text ? text.split(/\s+/u).length : 0;
    return clean({ ...base, status: text && data.status === 'completed' ? 'completed' : text ? 'incomplete' : 'empty_or_refused', response: text || null, wallMs: Math.round(performance.now() - started), inputTokens, outputTokens, totalTokens: count(data.usage?.total_tokens), estimatedCostUsd: inputTokens !== null && outputTokens !== null ? estimate(inputTokens, outputTokens) : null, modelVersion: typeof data.model === 'string' ? data.model.slice(0, 100) : null, wordCount, withinWordLimit: text ? wordCount <= 120 : null });
  } catch {
    return clean({ ...base, status: controller.signal.aborted ? 'timeout_unknown_outcome' : 'request_failed_unknown_outcome', wallMs: Math.round(performance.now() - started) });
  } finally { clearTimeout(timer); }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    if (process.argv[2] !== '--approved-one-request') throw new Error('approval');
    const dataset = await readSeoDataset('research/seo-comparison/reported-cases.json');
    const reference = JSON.parse(await readFile('research/seo-comparison/first-trial-observed.json', 'utf8'));
    await mkdir('runtime', { recursive: true });
    await writeFile('runtime/openai-seo-baseline.attempt.lock', 'one approved attempt reserved\n', { flag: 'wx' });
    const result = await runSeoBaseline({ approved: true, apiKey: process.env.OPENAI_API_KEY, caseRecord: dataset.cases.find(c => c.id === 'R-atik-su'), reference });
    await writeFile('runtime/openai-seo-baseline.json', JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
    process.stdout.write(JSON.stringify(result) + '\n');
    if (result.status !== 'completed') process.exitCode = 1;
  } catch {
    process.stderr.write('Baseline setup or save failed; never retry blindly.\n');
    process.exitCode = 1;
  }
}
