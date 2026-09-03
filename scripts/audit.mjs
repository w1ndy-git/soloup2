/**
 * Interaction + accessibility audit.
 *
 * Dev-only tool; its deps are not installed by default so production builds
 * stay fast. To run it:
 *   npm i -D playwright jsqr && npx playwright install chromium
 *   npm run build && node scripts/audit.mjs
 *
 * Checks the things that decide whether this site is actually usable:
 * colour contrast, tap targets, keyboard paths, the mobile menu, the video
 * dialog, and text that overflows or overlaps.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
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

const CONTRAST = `
  window.__lum = (c) => {
    const [r,g,b] = c.match(/\\d+(\\.\\d+)?/g).slice(0,3).map(Number).map(v => {
      v /= 255; return v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4);
    });
    return 0.2126*r + 0.7152*g + 0.0722*b;
  };
  window.__ratio = (fg, bg) => {
    const a = window.__lum(fg), b = window.__lum(bg);
    return (Math.max(a,b) + 0.05) / (Math.min(a,b) + 0.05);
  };
  // Returns the worst-case backdrop: walks ancestors, and if one paints a
  // gradient, considers every colour stop in it (the least contrasty wins).
  window.__bgOf = (el) => {
    let n = el;
    while (n && n !== document.documentElement) {
      const cs = getComputedStyle(n);
      const bi = cs.backgroundImage;
      if (bi && bi.includes('gradient')) {
        const stops = bi.match(/rgba?\\([^)]+\\)/g) || [];
        const solid = stops.filter(s => !/,\\s*0\\s*\\)$/.test(s));
        if (solid.length) return solid;
      }
      const bg = cs.backgroundColor;
      // Skip fully- and mostly-transparent layers: a 10% white pill over a navy
      // gradient is still effectively navy, not white.
      const am = bg && bg.match(/rgba\\([^)]*,\\s*([\\d.]+)\\)$/);
      const alpha = am ? Number(am[1]) : 1;
      if (bg && !/transparent/.test(bg) && alpha >= 0.6) return [bg];
      n = n.parentElement;
    }
    return ['rgb(255,255,255)'];
  };
  window.__worst = (fg, bgs) => Math.min(...bgs.map(b => window.__ratio(fg, b)));
`;

const browser = await chromium.launch();
const fail = [];

/* ---------- desktop: contrast, overlap, headings ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'load' });
  await page.waitForTimeout(2600);
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 45)); }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1200);
  await page.addScriptTag({ content: CONTRAST });

  const contrast = await page.evaluate(() => {
    const out = [];
    const els = [...document.querySelectorAll('p, h1, h2, h3, a, button, li, span, blockquote, code')];
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.width < 4 || r.height < 4) continue;
      const t = (el.textContent || '').trim();
      if (!t || t.length < 3) continue;
      if ([...el.children].some(c => (c.textContent || '').trim() === t)) continue; // only leaf-ish
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.opacity === '0') continue;
      const size = parseFloat(cs.fontSize);
      const weight = Number(cs.fontWeight) || 400;
      const large = size >= 24 || (size >= 18.66 && weight >= 700);
      const bgs = window.__bgOf(el);
      const ratio = window.__worst(cs.color, bgs);
      const min = large ? 3 : 4.5;
      if (ratio < min) out.push({ text: t.slice(0, 46), size: +size.toFixed(1), weight, fg: cs.color, bg: bgs.join('|').slice(0, 60), ratio: +ratio.toFixed(2), min });
    }
    return out;
  });

  const overlap = await page.evaluate(() => {
    const bad = [];
    const els = [...document.querySelectorAll('h1, h2, h3, p')];
    for (const el of els) {
      // text taller than its box => clipped
      if (el.scrollHeight > el.clientHeight + 4 && getComputedStyle(el).overflow !== 'visible') {
        bad.push(`clipped: ${(el.textContent || '').trim().slice(0, 40)}`);
      }
    }
    return bad;
  });

  const headingOrder = await page.evaluate(() => {
    const hs = [...document.querySelectorAll('h1,h2,h3,h4')].map(h => Number(h.tagName[1]));
    const jumps = [];
    for (let i = 1; i < hs.length; i++) if (hs[i] - hs[i - 1] > 1) jumps.push(`h${hs[i - 1]} -> h${hs[i]} at #${i}`);
    return { sequence: hs.join(''), jumps };
  });

  console.log('--- contrast failures (WCAG AA) ---');
  console.log(contrast.length ? JSON.stringify(contrast, null, 1) : 'none');
  console.log('--- clipped text ---');
  console.log(overlap.length ? overlap.join('\n') : 'none');
  console.log('--- heading order ---');
  console.log(JSON.stringify(headingOrder));
  if (contrast.length) fail.push(`${contrast.length} contrast failures`);
  if (overlap.length) fail.push(`${overlap.length} clipped`);
  if (headingOrder.jumps.length) fail.push(`heading jumps: ${headingOrder.jumps.join(', ')}`);

  /* video dialog */
  await page.evaluate(() => document.getElementById('stories')?.scrollIntoView());
  await page.waitForTimeout(900);
  const playBtn =
    (await page.$('#stories button:has-text("Watch the story")')) ||
    (await page.$('#stories button:has-text("What belongs here")'));
  if (playBtn) {
    await playBtn.click();
    await page.waitForTimeout(700);
    const dlg = await page.evaluate(() => {
      const d = document.querySelector('[role="dialog"]');
      if (!d) return null;
      return {
        modal: d.getAttribute('aria-modal'),
        labelled: !!document.getElementById(d.getAttribute('aria-labelledby')),
        focusInside: d.contains(document.activeElement),
        title: document.getElementById('video-modal-title')?.textContent,
      };
    });
    console.log('--- video dialog ---');
    console.log(JSON.stringify(dlg));
    if (!dlg || dlg.modal !== 'true' || !dlg.labelled || !dlg.focusInside) fail.push('video dialog a11y');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
    const closed = await page.evaluate(() => !document.querySelector('[role="dialog"]'));
    console.log('escape closes dialog:', closed);
    if (!closed) fail.push('dialog does not close on Escape');
  } else {
    fail.push('no play button found');
  }
  await ctx.close();
}

/* ---------- mobile: menu + tap targets ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'load' });
  await page.waitForTimeout(2600);

  const before = await page.evaluate(() => document.getElementById('mobile-nav')?.hidden);
  await page.click('button[aria-controls="mobile-nav"]');
  await page.waitForTimeout(500);
  const opened = await page.evaluate(() => ({
    hidden: document.getElementById('mobile-nav')?.hidden,
    expanded: document.querySelector('button[aria-controls="mobile-nav"]')?.getAttribute('aria-expanded'),
    scrollLocked: getComputedStyle(document.body).overflow === 'hidden',
    links: document.querySelectorAll('#mobile-nav a').length,
  }));
  console.log('--- mobile menu ---');
  console.log('hidden before open:', before, '| after:', JSON.stringify(opened));
  if (opened.hidden !== false || opened.expanded !== 'true' || opened.links < 6) fail.push('mobile menu broken');

  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  const afterEsc = await page.evaluate(() => document.getElementById('mobile-nav')?.hidden);
  console.log('escape closes menu:', afterEsc);
  if (afterEsc !== true) fail.push('mobile menu Escape');

  const taps = await page.evaluate(() => {
    const small = [];
    for (const el of document.querySelectorAll('a, button, input, select')) {
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) continue;
      // WCAG 2.5.8 "Inline" exception: a link sitting inside a sentence is
      // sized by the surrounding line-height and is not a failure.
      const p = el.parentElement;
      const inline =
        p && ['P', 'SPAN', 'LI', 'BLOCKQUOTE'].includes(p.tagName) &&
        (p.textContent || '').trim().length > (el.textContent || '').trim().length + 12;
      if (inline) continue;
      if (r.height < 24 || r.width < 24) {
        small.push({ tag: el.tagName, text: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30), h: Math.round(r.height), w: Math.round(r.width) });
      }
    }
    return small;
  });
  console.log('--- tap targets under 24px (WCAG 2.5.8) ---');
  console.log(taps.length ? JSON.stringify(taps, null, 1) : 'none');
  if (taps.length) fail.push(`${taps.length} tiny tap targets`);

  await ctx.close();
}

await browser.close();
server.close();

console.log('\n================ RESULT ================');
console.log(fail.length ? 'ISSUES:\n- ' + fail.join('\n- ') : 'All checks passed.');
process.exit(fail.length ? 1 : 0);
