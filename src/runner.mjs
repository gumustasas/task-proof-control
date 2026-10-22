import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, writeFile, chmod, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { randomUUID } from 'node:crypto';

export const RUNNER_IMAGE = 'node:22-bookworm-slim';
const SHA = /^[a-f0-9]{40}$/;
const MAX_FILES = 500, MAX_SOURCE_BYTES = 5_000_000;

// Commands are fixed executables with argument arrays. Source never supplies a
// shell command, Docker flags, image, mounts or host environment variables.
export function boundedProcess(command, args, { cwd, timeoutMs = 10_000, maxBytes = 65_536 } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, shell: false, windowsHide: true,
      env: { PATH: process.env.PATH, ...(process.env.SystemRoot ? { SystemRoot: process.env.SystemRoot } : {}) },
      stdio: ['ignore', 'pipe', 'pipe'] });
    const chunks = []; let bytes = 0, stopped = null;
    const stop = reason => { if (!stopped) { stopped = reason; child.kill('SIGKILL'); } };
    const timer = setTimeout(() => stop('timeout'), timeoutMs);
    for (const stream of [child.stdout, child.stderr]) stream.on('data', chunk => {
      const room = maxBytes - bytes;
      if (room > 0) chunks.push(chunk.subarray(0, room));
      bytes += chunk.length;
      if (bytes > maxBytes) stop('output-limit');
    });
    child.once('error', error => { clearTimeout(timer); reject(error); });
    child.once('close', code => {
      clearTimeout(timer);
      resolve({ code, stopped, output: Buffer.concat(chunks), outputBytes: Math.min(bytes, maxBytes) });
    });
  });
}

async function checked(command, args, options) {
  const result = await boundedProcess(command, args, options);
  if (result.code !== 0 || result.stopped) throw new Error(command + ' failed (' + (result.stopped ?? result.code) + ').');
  return result.output;
}

export function validateTestPaths(paths) {
  if (!Array.isArray(paths) || !paths.length || paths.length > 20) throw new Error('1–20 explicit Node test paths required.');
  for (const path of paths) if (typeof path !== 'string' || !/^[\w/-]+\.test\.(?:mjs|cjs|js)$/.test(path) || path.split('/').some(p => !p || p === '.' || p === '..') || path.startsWith('-') || path.startsWith('/')) throw new Error('Invalid test path.');
}

export function parseTree(buffer) {
  const entries = buffer.toString('utf8').split('\0').filter(Boolean).map(line => {
    const match = /^(100644|100755) blob ([a-f0-9]{40})\t(.+)$/.exec(line);
    if (!match) throw new Error('Symlinks, submodules and unsupported tree entries are rejected.');
    const [, , oid, path] = match;
    if (!/^[\w./-]+$/.test(path) || path.startsWith('/') || path.split('/').some(p => !p || p === '.' || p === '..' || p.toLowerCase() === '.git')) throw new Error('Unsafe source path.');
    if (/(?:^|\/)(?:\.env(?:\..*)?|credentials(?:\..*)?|id_rsa|id_ed25519)$|\.(?:pem|key|p12)$/i.test(path)) throw new Error('Potential secret file rejected.');
    return { oid, path };
  });
  if (!entries.length || entries.length > MAX_FILES) throw new Error('Source file limit exceeded.');
  return entries;
}

export function containerArgs(stage, imageId, testPaths, name) {
  validateTestPaths(testPaths);
  if (!/^sha256:[a-f0-9]{64}$/.test(imageId) || /[,\r\n]/.test(stage)) throw new Error('Invalid image or staging directory.');
  return ['create', '--name', name, '--pull=never', '--network=none', '--read-only',
    '--user=1000:1000', '--cap-drop=ALL', '--security-opt=no-new-privileges',
    '--memory=256m', '--memory-swap=256m', '--cpus=1', '--pids-limit=64',
    '--ulimit=nofile=128:128', '--ulimit=fsize=8388608:8388608', '--log-driver=none',
    '--tmpfs=/tmp:rw,noexec,nosuid,nodev,size=16777216,mode=1777',
    '--mount', 'type=bind,src=' + stage + ',dst=/source,readonly', '--workdir=/source',
    '--env=HOME=/tmp', '--env=NODE_OPTIONS=', '--entrypoint=node', imageId,
    '--test', '--test-reporter=tap', '--', ...testPaths];
}

export function completedContainerExit(state, clientCode) {
  if (state?.Status !== 'exited' || state.Running || !Number.isInteger(state.ExitCode) || state.Error || (state.ExitCode === 0 && clientCode !== 0)) {
    throw new Error('Container did not finish normally.');
  }
  return state.ExitCode;
}

export async function runIsolated({ repositoryDir, commitSha, testPaths, timeoutMs = 30_000, maxOutputBytes = 65_536 }) {
  if (process.platform !== 'linux') throw new Error('Runner requires a disposable Linux Docker host; no host fallback.');
  if (typeof repositoryDir !== 'string' || !repositoryDir.trim()) throw new Error('Trusted repository directory required.');
  if (!SHA.test(commitSha)) throw new Error('Full commit SHA required.');
  validateTestPaths(testPaths);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 100 || timeoutMs > 60_000 || !Number.isInteger(maxOutputBytes) || maxOutputBytes < 256 || maxOutputBytes > 65_536) throw new Error('Invalid execution limits.');
  const stage = await mkdtemp(join(tmpdir(), 'taskproof-source-'));
  const name = 'taskproof-' + randomUUID(); let containerCreated = false;
  const started = Date.now();
  try {
    await chmod(stage, 0o755);
    const gitOptions = { cwd: repositoryDir, maxBytes: 500_000 };
    const actual = (await checked('git', ['rev-parse', '--verify', commitSha + '^{commit}'], gitOptions)).toString().trim();
    if (actual !== commitSha) throw new Error('Commit resolution mismatch.');
    const entries = parseTree(await checked('git', ['ls-tree', '-rz', '--full-tree', commitSha], gitOptions));
    for (const path of testPaths) if (!entries.some(entry => entry.path === path)) throw new Error('Test not present in exact commit.');
    let sourceBytes = 0;
    for (const entry of entries) {
      const blob = await checked('git', ['cat-file', 'blob', entry.oid], { cwd: repositoryDir, maxBytes: MAX_SOURCE_BYTES });
      sourceBytes += blob.length;
      if (sourceBytes > MAX_SOURCE_BYTES) throw new Error('Source byte limit exceeded.');
      const destination = join(stage, entry.path);
      await mkdir(dirname(destination), { recursive: true, mode: 0o755 });
      await writeFile(destination, blob, { mode: 0o444, flag: 'wx' });
    }
    const imageId = (await checked('docker', ['image', 'inspect', '--format={{.Id}}', RUNNER_IMAGE])).toString().trim();
    const args = containerArgs(stage, imageId, testPaths, name);
    // Mark before create: even a timed-out create must attempt cleanup by name.
    containerCreated = true;
    await checked('docker', args);
    const execution = await boundedProcess('docker', ['start', '--attach', name], { timeoutMs, maxBytes: maxOutputBytes });
    let exitCode = execution.code;
    if (!execution.stopped) {
      const state = JSON.parse((await checked('docker', ['inspect', '--format={{json .State}}', name])).toString());
      exitCode = completedContainerExit(state, execution.code);
    }
    return { schemaVersion: 1, kind: 'taskproof-sandbox-execution', commitSha, imageId, testPaths,
      startedAt: new Date(started).toISOString(), durationMs: Date.now() - started,
      outcome: execution.stopped ?? (exitCode === 0 ? 'passed' : 'failed'), exitCode,
      outputBytes: execution.outputBytes, output: execution.output.toString('utf8'), sourceFiles: entries.length, sourceBytes,
      limits: { network: 'none', memoryMiB: 256, cpus: 1, pids: 64, tmpMiB: 16, timeoutMs, maxOutputBytes },
      interpretation: 'Execution only; stdout and case assertions are untrusted source output, not authenticated acceptance evidence.' };
  } finally {
    try {
      if (containerCreated) await checked('docker', ['rm', '--force', name]);
    } finally { await rm(stage, { recursive: true, force: true }); }
  }
}
