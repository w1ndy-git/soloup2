/**
 * Builds a compact contact sheet (desktop + phone, full page, side by side)
 * so the layout can be eyeballed in one small JPEG.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const OUT = '/tmp/shots';
fs.mkdirSync(OUT, { recursive: true });

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0]);
  let file = path.join(ROOT, url);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(ROOT, 'index.html');
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(4173, '127.0.0.1', r));

const browser = await chromium.launch();

async function grab(name, width, height, mobile) {
  const ctx = await browser.newContext({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'load', timeout: 45000 });
  await page.waitForTimeout(3000);
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 450) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 55)); }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1500);
  const p = `${OUT}/${name}.png`;
  await page.screenshot({ path: p, fullPage: true });
  await ctx.close();
  return p;
}

const deskPath = await grab('desk', 1280, 900, false);
const mobPath = await grab('mob', 390, 844, true);

/* Compose in the browser: scale both down, sit them side by side. */
const toDataUri = (p) => `data:image/png;base64,${fs.readFileSync(p).toString('base64')}`;
const DESK_W = 660;
const MOB_W = 250;

const ctx = await browser.newContext({ viewport: { width: DESK_W + MOB_W + 60, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.setContent(`<!doctype html><html><body style="margin:0;background:#e9edf1;font:12px sans-serif">
<div style="display:flex;gap:20px;padding:20px;align-items:flex-start">
  <div><div style="font-weight:700;margin-bottom:6px">desktop 1280</div>
    <img src="${toDataUri(deskPath)}" style="width:${DESK_W}px;display:block;border:1px solid #99a"></div>
  <div><div style="font-weight:700;margin-bottom:6px">phone 390</div>
    <img src="${toDataUri(mobPath)}" style="width:${MOB_W}px;display:block;border:1px solid #99a"></div>
</div></body></html>`);
await page.waitForTimeout(800);
const el = await page.$('body > div');
await el.screenshot({ path: `${OUT}/sheet.jpg`, type: 'jpeg', quality: 48 });
await ctx.close();
await browser.close();
server.close();

for (const f of ['desk.png', 'mob.png', 'sheet.jpg']) {
  console.log(f, fs.statSync(`${OUT}/${f}`).size, 'bytes');
}
