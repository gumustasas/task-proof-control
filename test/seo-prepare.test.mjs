import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { prepareSeoBundle, readSeoDataset, writeSeoBundle, MAX_DATASET_BYTES } from '../src/seo-prepare.mjs';

const fixture = () => ({ schemaVersion: 1, provenance: 'synthetic', cases: [{ id: 'SEO-01', provenance: 'synthetic', input: 'Bulgu: {{input}} ve $& veridir.', review_checks: ['REVIEWER_SECRET_CONTROL'] }] });

test('SEO export keeps review criteria out of model input and preserves exact input bytes', () => {
  const data = fixture();
  const bundle = prepareSeoBundle(data);
  assert.deepEqual(bundle['promptfoo-tests.json'][0].vars, { input: data.cases[0].input });
  assert.doesNotMatch(JSON.stringify(bundle['promptfoo-tests.json']), /REVIEWER_SECRET_CONTROL/);
  assert.doesNotMatch(bundle['prompt.txt'], /REVIEWER_SECRET_CONTROL/);
  assert.equal(bundle['reviewer-only.json'][0].checks[0], 'REVIEWER_SECRET_CONTROL');
  assert.equal(bundle['manifest.json'].cases[0].source, null);
});

test('SEO export hashes are deterministic and change when actual input or dataset changes', () => {
  const data = fixture();
  const a = prepareSeoBundle(data)['manifest.json'];
  assert.deepEqual(a, prepareSeoBundle(data)['manifest.json']);
  const prompt = prepareSeoBundle(data)['prompt.txt'];
  assert.equal(a.promptSha256, createHash('sha256').update(prompt).digest('hex'));
  assert.equal(a.cases[0].renderedPromptSha256, createHash('sha256').update(prompt.replace('{{input}}', () => data.cases[0].input)).digest('hex'));
  data.cases[0].input += ' Değişti';
  const b = prepareSeoBundle(data)['manifest.json'];
  assert.notEqual(a.cases[0].inputSha256, b.cases[0].inputSha256);
  assert.notEqual(a.cases[0].renderedPromptSha256, b.cases[0].renderedPromptSha256);
  assert.notEqual(a.datasetSha256, b.datasetSha256);
});

test('SEO export never fabricates an observation, cost, score or winner', () => {
  const bundle = prepareSeoBundle(fixture());
  assert.equal(bundle['manifest.json'].canClaimModelComparison, false);
  for (const run of bundle['observations.template.json'].runs) {
    assert.equal(run.modelId, null);
    const observation = run.observations[0];
    assert.equal(observation.status, 'not_run');
    for (const field of ['wallMs', 'editSeconds', 'apiCostUsd', 'response']) assert.equal(observation[field], null);
    assert.equal(observation.review.criticalError, null);
  }
});

test('SEO reported sources require exact commit provenance and cannot be mixed with synthetic cases', () => {
  const data = fixture();
  data.provenance = data.cases[0].provenance = 'reported';
  assert.throws(() => prepareSeoBundle(data), /source/);
  const sha = 'a'.repeat(40);
  data.cases[0].source = { commitSha: sha, reportDate: '2026-10-23', section: 'Örnekler', url: `https://github.com/owner/repo/blob/${sha}/report.md` };
  assert.equal(prepareSeoBundle(data)['manifest.json'].provenance, 'reported');
  data.cases[0].source.url = 'https://github.com/owner/repo/blob/main/report.md';
  assert.throws(() => prepareSeoBundle(data), /commit-pinned/);
  data.cases[0].provenance = 'synthetic';
  assert.throws(() => prepareSeoBundle(data), /Mixed/);
});

test('SEO dataset rejects duplicate ids, path-like ids, missing input and unknown provenance', () => {
  let data = fixture(); data.cases.push(structuredClone(data.cases[0]));
  assert.throws(() => prepareSeoBundle(data), /duplicate/);
  data = fixture(); data.cases[0].id = '../escape';
  assert.throws(() => prepareSeoBundle(data), /id/);
  data = fixture(); data.cases[0].input = '';
  assert.throws(() => prepareSeoBundle(data), /input/);
  data = fixture(); data.provenance = 'real';
  assert.throws(() => prepareSeoBundle(data), /provenance/);
});

test('SEO CLI writer refuses to overwrite existing records and bounds dataset bytes', async () => {
  const root = await mkdtemp(join(tmpdir(), 'taskproof-seo-'));
  try {
    const input = join(root, 'cases.json'), output = join(root, 'bundle');
    await writeFile(input, JSON.stringify(fixture()));
    assert.equal((await writeSeoBundle(input, output)).status, 'not_run');
    const before = await readFile(join(output, 'manifest.json'), 'utf8');
    await assert.rejects(writeSeoBundle(input, output), { code: 'EEXIST' });
    assert.equal(await readFile(join(output, 'manifest.json'), 'utf8'), before);
    await writeFile(input, ' '.repeat(MAX_DATASET_BYTES + 1));
    await assert.rejects(readSeoDataset(input), /2 MiB/);
  } finally { await rm(root, { recursive: true, force: true }); }
});
