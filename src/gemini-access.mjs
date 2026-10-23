import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const GEMINI_MODEL = 'gemini-3.1-flash-lite';
export const GEMINI_METADATA_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}`;
export const MAX_METADATA_BYTES = 32768;

function result(status, httpStatus = null) {
  return { status, model: GEMINI_MODEL, httpStatus, generationRequested: false, freeTierVerified: false, remainingQuota: null };
}

async function boundedJson(response) {
  if (Number(response.headers.get('content-length')) > MAX_METADATA_BYTES) throw new Error('size');
  const reader = response.body?.getReader();
  if (!reader) throw new Error('body');
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_METADATA_BYTES) throw new Error('size');
      chunks.push(value);
    }
  } catch (error) {
    await reader.cancel().catch(() => {});
    throw error;
  } finally { reader.releaseLock(); }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

/** Single metadata GET only. No model generation, retries, fallback or secret output. */
export async function checkGeminiAccess({ apiKey, request = fetch, timeoutMs = 15000 } = {}) {
  if (typeof apiKey !== 'string' || !apiKey.trim()) return result('secret_missing');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await request(GEMINI_METADATA_URL, {
      method: 'GET', redirect: 'error', signal: controller.signal,
      headers: { 'x-goog-api-key': apiKey.trim(), accept: 'application/json' },
    });
    if (!response.ok) {
      await response.body?.cancel().catch(() => {});
      return result('http_error', response.status);
    }
    const metadata = await boundedJson(response);
    if (metadata.name !== `models/${GEMINI_MODEL}` || !Array.isArray(metadata.supportedGenerationMethods)) return result('invalid_metadata', response.status);
    return { ...result('metadata_ok', response.status), supportsGenerateContent: metadata.supportedGenerationMethods.includes('generateContent') };
  } catch {
    // A thrown transport error may contain the secret: never serialize it.
    return result(controller.signal.aborted ? 'timeout' : 'request_failed');
  } finally { clearTimeout(timer); }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const output = await checkGeminiAccess({ apiKey: process.env.GEMINI_API_KEY });
  process.stdout.write(JSON.stringify(output) + '\n');
  if (output.status !== 'metadata_ok') process.exitCode = 1;
}
