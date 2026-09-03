/**
 * Self-contained visual + structural check: serves ./dist in-process,
 * drives it with Playwright at desktop and phone sizes, writes screenshots
 * and prints an audit report. No shell backgrounding, no curl.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const OUT = '/tmp/shots';
fs.mkdirSync(OUT, { recursive: true });

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0]);
  let file = path.join(ROOT, url);
  if (!file.startsWith(ROOT)) return res.writeHead(403).end();
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(ROOT, 'index.html');
  if (!fs.existsSync(file)) return res.writeHead(404).end();
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

await new Promise((r) => server.listen(4173, '127.0.0.1', r));
const BASE = 'http://127.0.0.1:4173';

const browser = await chromium.launch();
const problems = [];

for (const vp of [
  { name: 'desktop', width: 1440, height: 1000, dsf: 1, mobile: false },
  { name: 'mobile', width: 390, height: 844, dsf: 2, mobile: true },
]) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.dsf,
    isMobile: vp.mobile,
    hasTouch: vp.mobile,
  });
  const page = await ctx.newPage();
  page.on('console', (m) => {
    if (m.type() === 'error') problems.push(`[${vp.name}] console: ${m.text().slice(0, 200)}`);
  });
  page.on('pageerror', (e) => problems.push(`[${vp.name}] pageerror: ${String(e).slice(0, 200)}`));

  try {
    await page.goto(BASE, { waitUntil: 'load', timeout: 45000 });
  } catch (e) {
    problems.push(`[${vp.name}] goto failed: ${e.message}`);
  }

  await page.waitForTimeout(3000);
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 450) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 55));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1500);

  await page.screenshot({ path: `${OUT}/${vp.name}-full.png`, fullPage: true });
  await page.screenshot({ path: `${OUT}/${vp.name}-hero.png` });

  const report = await page.evaluate(() => {
    const qa = (s) => [...document.querySelectorAll(s)];
    const q = (s) => document.querySelector(s);
    return {
      title: document.title,
      h1: qa('h1').map((h) => h.textContent.trim()),
      sections: qa('section[id]').map((s) => s.id),
      imgMissingAlt: qa('img').filter((i) => !i.hasAttribute('alt')).length,
      imgBroken: qa('img').filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.getAttribute('src')),
      deadAnchors: qa('a').filter((a) => {
        const h = a.getAttribute('href');
        return !h || h === '#' || h.endsWith('##');
      }).length,
      canvases: qa('canvas').length,
      qrPainted: (() => {
        const c = q('canvas');
        if (!c) return 'no canvas';
        try {
          const g = c.getContext('2d');
          const d = g.getImageData(0, 0, c.width, c.height).data;
          let dark = 0;
          for (let i = 0; i < d.length; i += 4) if (d[i] < 100) dark++;
          return `${c.width}x${c.height}, dark px ${dark}`;
        } catch (e) {
          return 'read error: ' + e.message;
        }
      })(),
      viewportMeta: q('meta[name="viewport"]')?.getAttribute('content'),
      hOverflow:
        document.documentElement.scrollWidth > window.innerWidth + 1
          ? `${document.documentElement.scrollWidth} > ${window.innerWidth}`
          : null,
      offscreenRight: qa('section, div, img, canvas')
        .filter((el) => el.getBoundingClientRect().right > window.innerWidth + 2)
        .slice(0, 5)
        .map((el) => `${el.tagName}.${(el.className || '').toString().split(' ')[0]}`),
      smallTapTargets: qa('a, button').filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && r.height < 40;
      }).length,
      bodyBg: getComputedStyle(document.body).backgroundColor,
      headingFont: getComputedStyle(q('h1') || document.body).fontFamily,
    };
  });

  console.log(`\n===== ${vp.name} (${vp.width}x${vp.height}) =====`);
  console.log(JSON.stringify(report, null, 2));
  await ctx.close();
}

await browser.close();
server.close();

console.log('\n===== RUNTIME PROBLEMS =====');
console.log(problems.length ? [...new Set(problems)].join('\n') : 'none');
