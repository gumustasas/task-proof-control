import { readFile } from 'node:fs/promises';
import { evaluateSnapshot } from './engine.mjs';
const file = process.argv[2] ?? new URL('../data/growth-os-pr-175.json', import.meta.url);
try {
  const report = evaluateSnapshot(JSON.parse(await readFile(file, 'utf8')));
  console.log(JSON.stringify(report, null, 2));
} catch (e) { console.error(e.message); process.exitCode = 1; }
