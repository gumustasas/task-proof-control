import { runIsolated } from './runner.mjs';
try {
  const [repositoryDir, commitSha, ...testPaths] = process.argv.slice(2);
  const result = await runIsolated({ repositoryDir, commitSha, testPaths });
  console.log(JSON.stringify(result, null, 2));
  if (result.outcome !== 'passed') process.exitCode = 1;
} catch (error) { console.error(error.message); process.exitCode = 1; }
