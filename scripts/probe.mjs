import http from 'node:http';
import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const UPSTREAM = process.env.UP || 'base44.app';
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png' };

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/api/')) {
    const headers = { ...req.headers, host: UPSTREAM };
    delete headers['accept-encoding'];
    const up = https.request({ hostname: UPSTREAM, port: 443, path: req.url, method: req.method, headers }, (r) => {
      let body = '';
      r.on('data', (d) => { body += d; });
      r.on('end', () => {
        console.log(`  [proxy] ${req.method} ${req.url.slice(0, 70)} -> ${r.statusCode} ${body.slice(0, 300).replace(/\s+/g, ' ')}`);
        res.writeHead(r.statusCode, { 'content-type': r.headers['content-type'] || 'application/json', 'access-control-allow-origin': '*' });
        res.end(body);
      });
    });
    up.on('error', (e) => { console.log('  [proxy ERR]', e.message); res.writeHead(502).end('{}'); });
    req.pipe(up);
    return;
  }
  let f = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) f = path.join(ROOT, 'index.html');
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => server.listen(4173, '127.0.0.1', r));

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
page.on('requestfailed', (r) => console.log('  [netfail]', r.url().slice(0, 90), r.failure()?.errorText));
page.on('console', (m) => { if (m.type() === 'error') console.log('  [console]', m.text().slice(0, 180)); });

await page.goto('http://127.0.0.1:4173', { waitUntil: 'load' });
await page.waitForTimeout(2000);
await page.click('button[aria-controls="ask-soloup-panel"]');
await page.waitForTimeout(400);
await page.fill('#ask-soloup-input', 'What is SoloUp?');
console.log('--- submitting ---');
await page.click('#ask-soloup-panel form button[type="submit"]');
await page.waitForTimeout(Number(process.env.WAIT || 22000));

const state = await page.evaluate(() => ({
  bubbles: [...document.querySelectorAll('#ask-soloup-panel li')].map((li) => li.textContent.trim().slice(0, 150)),
  status: document.querySelector('#ask-soloup-panel [role="status"]')?.textContent?.trim() || null,
  alert: document.querySelector('#ask-soloup-panel [role="alert"]')?.textContent?.trim() || null,
}));
console.log('--- panel state ---');
console.log(JSON.stringify(state, null, 1));

await browser.close();
server.close();
