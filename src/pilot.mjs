import { readFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { attachScenarios } from './scenarios.mjs';
import { evaluateSnapshot } from './engine.mjs';

const read = async path => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
const inputs = await Promise.all(['positive-snapshot', 'observation', 'results', 'mapping'].map(name => read('../data/pilot/' + name + '.json')));
const missing = await read('../data/growth-os-pr-175.json');
const evaluate = () => ({ positive: attachScenarios(...inputs).report, missing: evaluateSnapshot(missing) });
const measured = evaluate();
if (measured.positive.counts.verified !== 3 || measured.positive.counts.failed !== 0 || measured.missing.counts.verified !== 0 || measured.missing.counts.insufficient !== 5) throw new Error('Pilot expectations changed; review evidence before updating the baseline.');
const milliseconds = [];
for (let i = 0; i < 1000; i++) { const start = performance.now(); evaluate(); milliseconds.push(performance.now() - start); }
milliseconds.sort((a, b) => a - b);
console.log(JSON.stringify({ schemaVersion: 1, kind: 'taskproof-preliminary-pilot', measuredAt: new Date().toISOString(),
  environment: { node: process.version, platform: process.platform, arch: process.arch },
  positive: { repository: measured.positive.repository, prNumber: measured.positive.prNumber, commitSha: measured.positive.headSha, counts: measured.positive.counts },
  evidenceGap: { repository: measured.missing.repository, prNumber: measured.missing.prNumber, commitSha: measured.missing.headSha, counts: measured.missing.counts },
  engineTiming: { iterations: 1000, medianMs: milliseconds[500], p95Ms: milliseconds[950], includes: 'in-memory import validation and both reports; excludes collection, browser, network and human review' },
  falseVerifiedAgainstLimitedExpectedLabels: 0,
  missedBugs: null, humanReviewMinutes: null, timeSavedMinutes: null,
  limitations: [
    'Preliminary evidence-level check, not a completed human comparison experiment.',
    'Positive results were transcribed by Codex from GitHub job logs and matched to reviewed test source; imported bytes are not authenticated.',
    'Only three selected TaskProof UI criteria are assessed, not all PR #5 requirements.',
    'Growth OS #175 lacks direct scenario proof here; this is not proof of a code defect.',
    'No adversarial mapping accuracy, real-world bug recall or human time savings have been measured.'
  ] }, null, 2));
