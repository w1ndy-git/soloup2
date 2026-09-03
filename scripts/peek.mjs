import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0]);
  let f = path.join(ROOT, url);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) f = path.join(ROOT, 'index.html');
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => server.listen(4173, '127.0.0.1', r));

const target = process.argv[2] || 'top';
const width = Number(process.argv[3] || 1000);
const height = Number(process.argv[4] || 620);
const quality = Number(process.argv[5] || 40);
const mobile = process.argv[6] === 'mobile';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.goto('http://127.0.0.1:4173', { waitUntil: 'load' });
await page.waitForTimeout(2600);
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 45)); }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(1000);

if (target !== 'top') {
  await page.evaluate((id) => document.getElementById(id)?.scrollIntoView({ block: 'start' }), target);
  await page.waitForTimeout(1200);
}

const out = '/tmp/peek.jpg';
await page.screenshot({ path: out, type: 'jpeg', quality });
await browser.close();
server.close();

const buf = fs.readFileSync(out);
const b64 = buf.toString('base64');
fs.writeFileSync('/tmp/peek.b64', b64);
console.log('JPEG bytes', buf.length, '| b64 chars', b64.length, '| md5', crypto.createHash('md5').update(buf).digest('hex'));
