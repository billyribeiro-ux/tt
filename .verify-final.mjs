import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
const routes = ['/', '/size-up-join', '/project-alpha', '/day-trading-academy', '/day-trading-bootcamp',
  '/crystal-ball-course', '/crystal-ball-gold-edition-course', '/momentum-course', '/digital-store',
  '/trick-trades-core', '/polaris', '/testimonials', '/contact-us'];
const shots = '/private/tmp/claude-501/-Users-billyribeiro-Desktop-trick-trades/d10b3358-669c-44c4-b6a2-375c7a515c14/scratchpad/final';
mkdirSync(shots, { recursive: true });
const b = await chromium.launch();
let fail = 0;
for (const [vw, vh, tag] of [[1440, 900, 'desktop'], [390, 844, 'mobile']]) {
  const p = await b.newPage({ viewport: { width: vw, height: vh } });
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  for (const r of routes) {
    const resp = await p.goto('http://localhost:4173' + r, { waitUntil: 'networkidle' });
    await p.evaluate(async () => {
      for (let y = 0; y <= document.body.scrollHeight; y += 350) { window.scrollTo(0, y); await new Promise(rs => setTimeout(rs, 90)); }
    });
    await p.waitForTimeout(3200);
    const res = await p.evaluate(() => {
      const bad = [];
      for (const el of document.querySelectorAll('[data-anim-stagger] > *, [data-anim], [data-split]')) {
        const rc = el.getBoundingClientRect();
        if (rc.width === 0 && rc.height === 0) continue;
        if (parseFloat(getComputedStyle(el).opacity) < 0.99) bad.push((el.className || el.tagName).toString().slice(0, 40));
      }
      return {
        stuck: bad,
        overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        h1: document.querySelectorAll('h1').length,
        emdash: (document.body.innerText.match(/—/g) || []).length
      };
    });
    const name = (r === '/' ? 'home' : r.slice(1)) + '.' + tag;
    if (tag === 'desktop') { await p.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' })); await p.waitForTimeout(250); await p.screenshot({ path: `${shots}/${name}.png` }); }
    const ok = resp.status() === 200 && res.stuck.length === 0 && !res.overflowX && res.h1 === 1 && res.emdash === 0;
    if (!ok) fail++;
    console.log(`${ok ? 'PASS' : 'FAIL'} [${tag}] ${r} stuck=${res.stuck.length} overflowX=${res.overflowX} h1=${res.h1} emdash=${res.emdash}${res.stuck.length ? ' ' + res.stuck.slice(0,2).join('|') : ''}`);
  }
  if (errors.length) { console.log(`JS ERRORS [${tag}]:`, [...new Set(errors)].slice(0, 4).join(' ; ')); fail++; }
  await p.close();
}
await b.close();
process.exit(fail);
