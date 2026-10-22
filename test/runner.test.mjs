import test from 'node:test';
import assert from 'node:assert/strict';
import { boundedProcess, validateTestPaths, parseTree, containerArgs, completedContainerExit } from '../src/runner.mjs';

test('runner paths reject flags, shell text, traversal and globs', () => {
  validateTestPaths(['test/core.test.mjs']);
  for (const path of ['--eval=x', '../a.test.mjs', '/a.test.mjs', 'test/*.test.mjs', 'a;id.test.mjs', 'a/../b.test.mjs']) assert.throws(() => validateTestPaths([path]));
});

test('runner tree rejects symlinks, submodules, secrets and escaping paths', () => {
  const oid = 'a'.repeat(40);
  assert.equal(parseTree(Buffer.from('100644 blob ' + oid + '\ttest/a.test.mjs\0')).length, 1);
  for (const entry of ['120000 blob ' + oid + '\tlink', '160000 commit ' + oid + '\tsub', '100644 blob ' + oid + '\t../escape', '100644 blob ' + oid + '\t.env', '100644 blob ' + oid + '\tkey.pem']) assert.throws(() => parseTree(Buffer.from(entry + '\0')));
});

test('runner process enforces wall time and combined output cap', async () => {
  const timed = await boundedProcess(process.execPath, ['-e', 'setInterval(()=>{},1000)'], { timeoutMs: 150 });
  assert.equal(timed.stopped, 'timeout');
  const loud = await boundedProcess(process.execPath, ['-e', 'setInterval(()=>process.stdout.write("x".repeat(4096)),1)'], { maxBytes: 1024 });
  assert.equal(loud.stopped, 'output-limit'); assert.equal(loud.output.length, 1024);
});

test('runner fixed container policy contains no host socket or inherited token', () => {
  const args = containerArgs('/tmp/stage', 'sha256:' + 'a'.repeat(64), ['test/a.test.mjs'], 'taskproof-fixture');
  for (const required of ['--network=none', '--read-only', '--cap-drop=ALL', '--user=1000:1000', '--memory=256m', '--pids-limit=64', '--log-driver=none']) assert.ok(args.includes(required));
  assert.equal(args.filter(value => value.startsWith('--mount')).length, 1);
  assert.ok(!args.join(' ').includes('docker.sock')); assert.ok(!args.join(' ').includes('TOKEN'));
  assert.throws(() => containerArgs('/tmp/stage,evil', 'node:latest', ['test/a.test.mjs'], 'fixture'));
});

test('a never-started container or failed attach cannot look successful', () => {
  assert.throws(() => completedContainerExit({Status:'created', Running:false, ExitCode:0, Error:''}, 1));
  assert.throws(() => completedContainerExit({Status:'exited', Running:false, ExitCode:0, Error:''}, 125));
  assert.equal(completedContainerExit({Status:'exited', Running:false, ExitCode:0, Error:''}, 0), 0);
  assert.equal(completedContainerExit({Status:'exited', Running:false, ExitCode:1, Error:''}, 1), 1);
});
