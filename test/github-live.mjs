import { collectPull } from '../src/github.mjs';
import assert from 'node:assert/strict';
const result=await collectPull('https://github.com/gumustasas/task-proof-control/pull/1',{token:process.env.TASKPROOF_GITHUB_TOKEN??''});
assert.equal(result.repository,'gumustasas/task-proof-control');
assert.equal(result.prNumber,1);assert.match(result.headSha,/^[a-f0-9]{40}$/);
assert.ok(result.observations.length>0);
assert.ok(result.observations.every(o=>o.commitSha===result.headSha));
console.log(JSON.stringify({liveGitHub:'passed',repository:result.repository,headSha:result.headSha,calls:result.calls,complete:result.complete,observations:result.observations.length}));
