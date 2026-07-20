#!/usr/bin/env node
/**
 * Screenshot one or more OG HTML files (scripts/og/out/<slug>.html) to
 * public/og/<slug>.png at exactly 1200x630 using the locally installed Chrome.
 * Usage: node scripts/og/shoot-og.mjs <slug> [<slug> ...]
 */
import puppeteer from 'puppeteer-core';
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, 'out');
const PUBOG = join(HERE, '..', '..', 'public', 'og');

const CHROME_CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
];
const executablePath = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!executablePath) {
  console.error('No Chrome/Edge executable found.');
  process.exit(1);
}

const slugs = process.argv.slice(2);
if (slugs.length === 0) {
  console.error('Usage: node scripts/og/shoot-og.mjs <slug> [<slug> ...]');
  process.exit(1);
}

const browser = await puppeteer.launch({
  executablePath,
  headless: 'new',
  args: ['--no-sandbox', '--allow-file-access-from-files', '--force-device-scale-factor=1'],
});
try {
  for (const slug of slugs) {
    const htmlPath = join(OUT, `${slug}.html`);
    if (!existsSync(htmlPath)) {
      console.error(`missing ${htmlPath}`);
      process.exitCode = 1;
      continue;
    }
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
    await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle0' });
    const outPng = join(PUBOG, `${slug}.png`);
    await page.screenshot({ path: outPng, clip: { x: 0, y: 0, width: 1200, height: 630 } });
    await page.close();
    console.log(`wrote public/og/${slug}.png`);
  }
} finally {
  await browser.close();
}
