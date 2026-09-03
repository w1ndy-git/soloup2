/**
 * Reads the QR canvas back out of the live page and decodes it, for each of the
 * three targets. This proves the logo knockout in the middle has not broken
 * scannability — a thing you cannot confirm by eye.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import jsQR from 'jsqr';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0]);
  let file = path.join(ROOT, url);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(ROOT, 'index.html');
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(4173, '127.0.0.1', r));

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
await page.goto('http://127.0.0.1:4173', { waitUntil: 'load' });
await page.waitForTimeout(2500);
await page.evaluate(() => document.getElementById('share')?.scrollIntoView());
await page.waitForTimeout(1200);

const labels = await page.$$eval('input[name="qr-target"]', (els) => els.map((e) => e.value));
console.log('targets found:', labels.join(', '));

let pass = 0;
for (const value of labels) {
  await page.check(`input[name="qr-target"][value="${value}"]`);
  await page.waitForTimeout(900);

  const data = await page.evaluate(() => {
    const c = document.querySelector('canvas');
    const g = c.getContext('2d');
    const d = g.getImageData(0, 0, c.width, c.height);
    return { w: c.width, h: c.height, bytes: Array.from(d.data) };
  });

  const res = jsQR(Uint8ClampedArray.from(data.bytes), data.w, data.h);
  const ok = Boolean(res);
  if (ok) pass++;
  console.log(`  ${value.padEnd(9)} -> ${ok ? 'DECODES' : 'FAILED  '}  ${ok ? res.data : ''}`);
}

// also confirm the logo really is drawn on top (cream plate in the middle)
const centre = await page.evaluate(() => {
  const c = document.querySelector('canvas');
  const g = c.getContext('2d');
  const p = g.getImageData(Math.floor(c.width / 2), Math.floor(c.height * 0.42), 1, 1).data;
  return [p[0], p[1], p[2]];
});
console.log('centre pixel (expect cream 251,250,244 plate or navy ink):', centre.join(','));

await browser.close();
server.close();
console.log(`\n${pass}/${labels.length} QR targets decode correctly.`);
process.exit(pass === labels.length ? 0 : 1);
