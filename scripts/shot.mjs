import { chromium } from 'playwright';

const BASE = process.env.SHOT_BASE || 'http://127.0.0.1:4173';
const OUT = process.env.SHOT_OUT || '/tmp/shots';

const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
];

const browser = await chromium.launch();
const problems = [];

for (const vp of viewports) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.deviceScaleFactor || 1,
    isMobile: !!vp.isMobile,
    hasTouch: !!vp.hasTouch,
    userAgent: vp.isMobile
      ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
      : undefined,
  });
  const page = await ctx.newPage();

  page.on('console', (m) => {
    if (m.type() === 'error') problems.push(`[${vp.name}] console: ${m.text().slice(0, 220)}`);
  });
  page.on('pageerror', (e) => problems.push(`[${vp.name}] pageerror: ${String(e).slice(0, 220)}`));

  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 45000 }).catch((e) => {
    problems.push(`[${vp.name}] goto: ${e.message}`);
  });

  // let fonts + framer-motion in-view animations settle
  await page.waitForTimeout(2500);
  await page.evaluate(async () => {
    // trigger every whileInView block
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1200);

  await page.screenshot({ path: `${OUT}/${vp.name}-full.png`, fullPage: true });

  // ---- structural assertions -------------------------------------------
  const report = await page.evaluate(() => {
    const q = (s) => document.querySelector(s);
    const qa = (s) => [...document.querySelectorAll(s)];
    return {
      title: document.title,
      h1: qa('h1').map((h) => h.textContent.trim()),
      h2count: qa('h2').length,
      sections: qa('section[id]').map((s) => s.id),
      imagesMissingAlt: qa('img').filter((i) => !i.hasAttribute('alt')).length,
      imgs: qa('img').map((i) => ({ src: i.getAttribute('src'), alt: i.getAttribute('alt'), w: i.naturalWidth })),
      brokenImgs: qa('img').filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
      deadAnchors: qa('a[href$="##"], a[href="#"], a[href=""]').length,
      canvasCount: qa('canvas').length,
      viewportMeta: q('meta[name="viewport"]')?.getAttribute('content'),
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1
        ? { scrollWidth: document.documentElement.scrollWidth, inner: window.innerWidth }
        : null,
      // tap targets smaller than 44px on mobile
      smallTargets: qa('a, button').filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && (r.height < 40 || r.width < 40);
      }).length,
      spinnerOnly: !!q('.animate-spin') && qa('section').length === 0,
    };
  });

  console.log(`\n===== ${vp.name} (${vp.width}x${vp.height}) =====`);
  console.log(JSON.stringify(report, null, 2));

  await ctx.close();
}

await browser.close();

console.log('\n===== PROBLEMS =====');
console.log(problems.length ? problems.join('\n') : 'none');
