/**
 * Palette audit.
 *
 * Walks every rendered element and collects every colour actually painted —
 * text, backgrounds, borders, gradient stops, SVG fills and strokes — then
 * flags anything that is not in the approved set.
 *
 * This is the check behind the claim "the colour scheme matches the logo". The
 * logo is black on white, so black, white and cream do the structural work,
 * gold carries the actions, and the stylesheet's blues and greens are accents.
 * Anything else on the page is an accident and shows up here.
 *
 * Dev-only:
 *   npm i -D playwright && npx playwright install chromium
 *   npm run build && node scripts/palette.mjs
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  let f = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) f = path.join(ROOT, 'index.html');
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => server.listen(4173, '127.0.0.1', r));

/* The approved set. Keys are what each colour is for. */
const APPROVED = {
  '17,17,17': 'carbon — the logo ink',
  '32,34,36': 'carbonsoft — hover on carbon',
  '21,50,74': 'navy — secondary dark',
  '33,79,112': 'deepsea — gradient mid',
  '47,111,159': 'ocean — links',
  '234,245,251': 'sky — tinted panel',
  '63,107,51': 'leaf — accessible green',
  '95,143,78': 'leafbright — decorative fill',
  '220,235,207': 'lime — soft panel',
  '247,251,243': 'palegreen — gradient partner',
  '242,184,75': 'gold — primary action',
  '251,250,244': 'cream — page ground',
  '255,255,255': 'white',
  '90,96,102': 'stone — secondary text',
  '224,224,220': 'border',
  '190,49,49': 'destructive — errors only',
  '0,0,0': 'black (shadows/overlays)',
};

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1280, height: 1000 } })).newPage();
await page.goto('http://127.0.0.1:4173', { waitUntil: 'load' });
await page.waitForTimeout(2600);
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 45)); }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(1200);
/* open the assistant too, so its surface is included */
await page.click('button[aria-controls="ask-soloup-panel"]').catch(() => {});
await page.waitForTimeout(600);

const found = await page.evaluate(() => {
  const hits = new Map();
  const norm = (v) => {
    const m = String(v).match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(',').map((s) => parseFloat(s.trim()));
    if (p.length > 3 && p[3] === 0) return null; // fully transparent
    return `${Math.round(p[0])},${Math.round(p[1])},${Math.round(p[2])}`;
  };
  const add = (v, el, prop) => {
    const k = norm(v);
    if (!k) return;
    if (!hits.has(k)) hits.set(k, { count: 0, samples: [] });
    const h = hits.get(k);
    h.count++;
    if (h.samples.length < 3) {
      h.samples.push(`${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.split(' ').slice(0, 2).join('.') : ''} {${prop}}`);
    }
  };

  for (const el of document.querySelectorAll('*')) {
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.opacity === '0') continue;

    if ((el.textContent || '').trim()) add(cs.color, el, 'color');
    add(cs.backgroundColor, el, 'background');
    for (const side of ['Top', 'Right', 'Bottom', 'Left']) {
      if (parseFloat(cs[`border${side}Width`]) > 0) add(cs[`border${side}Color`], el, 'border');
    }
    if (cs.backgroundImage && cs.backgroundImage.includes('gradient')) {
      for (const stop of cs.backgroundImage.match(/rgba?\([^)]+\)/g) || []) add(stop, el, 'gradient');
    }
    if (el instanceof SVGElement) {
      if (cs.fill && cs.fill !== 'none') add(cs.fill, el, 'svg fill');
      if (cs.stroke && cs.stroke !== 'none') add(cs.stroke, el, 'svg stroke');
    }
  }
  return [...hits.entries()].map(([k, v]) => ({ rgb: k, ...v })).sort((a, b) => b.count - a.count);
});

await browser.close();
server.close();

const hex = (rgb) => '#' + rgb.split(',').map((n) => Number(n).toString(16).padStart(2, '0')).join('');
const strays = found.filter((f) => !APPROVED[f.rgb]);

console.log('=== approved colours in use ===');
for (const f of found.filter((x) => APPROVED[x.rgb])) {
  console.log(`  ${hex(f.rgb).padEnd(8)} ×${String(f.count).padStart(4)}  ${APPROVED[f.rgb]}`);
}
console.log(`\n=== OFF-PALETTE (${strays.length}) ===`);
if (!strays.length) console.log('  none');
for (const f of strays) {
  console.log(`  ${hex(f.rgb).padEnd(8)} ×${String(f.count).padStart(4)}  ${f.samples.join(' | ').slice(0, 150)}`);
}
process.exit(strays.length ? 1 : 0);
