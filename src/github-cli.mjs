import { collectPull } from './github.mjs';

try {
  if (process.argv.length !== 3) throw new Error('Kullanım: node src/github-cli.mjs https://github.com/owner/repo/pull/1');
  const result = await collectPull(process.argv[2], { token: process.env.TASKPROOF_GITHUB_TOKEN });
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
