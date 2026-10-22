import { chromium, expect } from 'playwright/test';
import { readFile, mkdir, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import { makeServer } from '../src/server.mjs';

const server = makeServer();
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const temp = await mkdtemp(join(tmpdir(), 'taskproof-ui-'));
const results = [];
let browser;
let page;
let failure;
const sample = JSON.parse(await readFile(new URL('../data/synthetic-demo.json', import.meta.url), 'utf8'));
const check = async (caseName, run) => {
  try { await run(); results.push({caseName, outcome:'passed'}); console.log('PASS ' + caseName); }
  catch (error) { results.push({caseName, outcome:'failed', message:error.message}); throw error; }
};
try {
  browser = await chromium.launch({headless:true});
  page = await browser.newPage({viewport:{width:1365,height:900}, acceptDownloads:true});
  const errors = []; page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('http://127.0.0.1:' + server.address().port);
  await check('UI-01: real snapshot never implies verified behavior', async () => {
    await expect(page.locator('#rows .row')).toHaveCount(5);
    await expect(page.locator('#stats .verified strong')).toHaveText('0');
    await expect(page.locator('#stats .insufficient strong')).toHaveText('5');
    await expect(page.locator('#demo-banner')).toBeHidden();
    await page.locator('#rows summary').first().click();
    await expect(page.locator('#rows .evidence a').first()).toHaveAttribute('href', /github.com/);
  });
  await check('UI-02: synthetic data stays visibly separated', async () => {
    await page.locator('#snapshot').selectOption('demo');
    await expect(page.locator('#demo-banner')).toBeVisible();
    await expect(page.locator('#rows .row')).toHaveCount(4);
    for (const status of ['verified','failed','insufficient','stale']) await expect(page.locator('#stats .' + status + ' strong')).toHaveText('1');
  });
  await check('UI-03: exported report round-trips and remains selectable', async () => {
    const downloaded = page.waitForEvent('download'); await page.locator('#export').click();
    const file = join(temp, 'report.json'); await (await downloaded).saveAs(file);
    const parsed = JSON.parse(await readFile(file, 'utf8')); assert.equal(parsed.snapshot.mode, 'synthetic');
    await page.locator('#import').setInputFiles(file);
    await expect(page.locator('#snapshot')).toHaveValue('imported');
    await page.locator('#snapshot').selectOption('real'); await expect(page.locator('#rows .row')).toHaveCount(5);
    await page.locator('#snapshot').selectOption('imported'); await expect(page.locator('#rows .row')).toHaveCount(4);
    await expect(page.locator('#demo-banner')).toBeVisible();
  });
  await check('UI-04: invalid import keeps last valid data', async () => {
    await page.locator('#import').setInputFiles({name:'broken.json',mimeType:'application/json',buffer:Buffer.from('{broken')});
    await expect(page.locator('#error')).toBeVisible();
    await expect(page.locator('#rows .row')).toHaveCount(4);
  });
  await check('UI-05: imported text cannot create HTML', async () => {
    const s = structuredClone(sample); s.title = '<img src=x onerror=alert(1)>';
    await page.locator('#import').setInputFiles({name:'safe-text.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(s))});
    await expect(page.locator('#title')).toHaveText(s.title);
    await expect(page.locator('#title img')).toHaveCount(0);
  });
  await check('UI-06: mobile layout and browser errors', async () => {
    await page.setViewportSize({width:390,height:844});
    await page.locator('#snapshot').selectOption('real'); await expect(page.locator('#rows .row')).toHaveCount(5);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), true);
    assert.deepEqual(errors, []);
  });
  await mkdir('test-results', {recursive:true});
  await page.screenshot({path:'test-results/mobile.png', fullPage:true});
  await page.setViewportSize({width:1365,height:900});
  await page.screenshot({path:'test-results/desktop.png', fullPage:true});
} catch (e) { failure = e; console.error(e.message); }
finally {
  await mkdir('test-results', {recursive:true});
  const report = {schemaVersion:1,kind:'taskproof-ui-results',commitSha:process.env.TASKPROOF_COMMIT_SHA ?? null,runId:process.env.GITHUB_RUN_ID ?? 'local',observedAt:new Date().toISOString(),results};
  await writeFile('test-results/ui-results.json', JSON.stringify(report,null,2));
  await browser?.close(); server.closeAllConnections(); await new Promise((resolve) => server.close(resolve));
  await rm(temp,{recursive:true,force:true});
}
if (failure) process.exitCode = 1;
