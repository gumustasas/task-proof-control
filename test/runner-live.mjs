import assert from 'node:assert/strict';
import { mkdtemp, writeFile, mkdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { runIsolated } from '../src/runner.mjs';

const results = [];
const root = await mkdtemp(join(tmpdir(), 'taskproof-runner-smoke-'));
const git = args => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
try {
  const own = await runIsolated({ repositoryDir: process.cwd(), commitSha: process.env.TASKPROOF_COMMIT_SHA, testPaths: ['test/engine.test.mjs'] });
  assert.equal(own.outcome, 'passed', own.output); assert.match(own.output, /# pass 14/);
  results.push({ caseName: 'RUN-01-own-commit', outcome: 'passed', execution: own });
  await mkdir(join(root, 'test'));
  await writeFile(join(root, 'test/isolation.test.mjs'), `
import test from 'node:test'; import assert from 'node:assert/strict';
import {writeFileSync, readFileSync, existsSync, statfsSync} from 'node:fs';
import {networkInterfaces} from 'node:os'; import {connect} from 'node:net';
test('isolation', async () => {
  assert.equal(process.getuid(),1000);
  assert.equal(process.env.TASKPROOF_CANARY, undefined);
  assert.equal(process.env.GITHUB_TOKEN, undefined);
  assert.equal(process.env.TASKPROOF_GITHUB_TOKEN, undefined);
  assert.equal(existsSync('/var/run/docker.sock'),false);
  assert.equal(readFileSync('/sys/fs/cgroup/memory.max','utf8').trim(),'268435456');
  assert.equal(readFileSync('/sys/fs/cgroup/pids.max','utf8').trim(),'64');
  assert.equal(readFileSync('/sys/fs/cgroup/cpu.max','utf8').trim(),'100000 100000');
  assert.throws(()=>writeFileSync('/source/escape','no'));
  assert.throws(()=>writeFileSync('/etc/escape','no'));
  writeFileSync('/tmp/allowed','ok');
  assert.ok(Object.keys(networkInterfaces()).every(name=>name==='lo'));
  const fs=statfsSync('/tmp'); assert.ok(fs.blocks*fs.bsize<=16777216);
  await new Promise((resolve,reject)=>{
    const socket=connect({host:'1.1.1.1',port:443});
    socket.setTimeout(1000,()=>{socket.destroy();reject(new Error('network denial was not immediate'));});
    socket.on('connect',()=>{socket.destroy();reject(new Error('external network reached'));});
    socket.on('error',error=>{assert.ok(['ENETUNREACH','EHOSTUNREACH','EPERM','EACCES'].includes(error.code));resolve();});
  });
});
`);
  await writeFile(join(root, 'test/failure.test.mjs'), "import test from 'node:test'; test('known failure',()=>{throw new Error('intentional');});");
  await writeFile(join(root, 'test/hang.test.mjs'), 'setInterval(()=>{},1000);');
  await writeFile(join(root, 'test/loud.test.mjs'), 'setInterval(()=>process.stdout.write("x".repeat(4096)),1);');
  await writeFile(join(root, 'test/file-limit.test.mjs'), "import {writeFileSync} from 'node:fs'; writeFileSync('/tmp/too-big',Buffer.alloc(9*1024*1024));");
  git(['init', '--quiet']); git(['add', '.']);
  git(['-c', 'user.name=TaskProof smoke', '-c', 'user.email=taskproof@example.invalid', '-c', 'commit.gpgsign=false', 'commit', '--quiet', '-m', 'Synthetic isolation probes']);
  const commitSha = git(['rev-parse', 'HEAD']);
  for (const [name, expected, extra] of [
    ['isolation', 'passed', {}], ['failure', 'failed', {}], ['hang', 'timeout', {timeoutMs:1500}],
    ['loud', 'output-limit', {maxOutputBytes:1024}], ['file-limit', 'failed', {}],
  ]) {
    const execution = await runIsolated({repositoryDir:root, commitSha, testPaths:['test/'+name+'.test.mjs'], ...extra});
    assert.equal(execution.outcome,expected,execution.output);
    if(name==='loud')assert.ok(execution.outputBytes<=1024);
    results.push({caseName:'RUN-'+name,outcome:'passed',expected,execution});
    console.log('PASS RUN-'+name+' (observed '+execution.outcome+')');
  }
} finally {
  await mkdir('test-results',{recursive:true});
  await writeFile('test-results/runner-results.json',JSON.stringify({schemaVersion:1,kind:'taskproof-runner-smoke',commitSha:process.env.TASKPROOF_COMMIT_SHA,runId:process.env.GITHUB_RUN_ID,results},null,2));
  await rm(root,{recursive:true,force:true});
}
