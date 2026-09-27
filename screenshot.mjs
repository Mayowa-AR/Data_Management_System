import puppeteer from 'puppeteer';
import fs from 'node:fs/promises';
import path from 'node:path';

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3];
const ROOT = path.dirname(new URL(import.meta.url).pathname);
const dir = path.join(ROOT, 'temporary screenshots');
await fs.mkdir(dir, { recursive: true });

const nums = (await fs.readdir(dir))
  .map(f => f.match(/^screenshot-(\d+)/)?.[1]).filter(Boolean).map(Number);
const n = (nums.length ? Math.max(...nums) : 0) + 1;
const out = path.join(dir, `screenshot-${n}${label ? `-${label}` : ''}.png`);

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log(`Saved ${out}`);
