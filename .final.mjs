import { chromium } from 'playwright';
const routes = ['/', '/size-up-join', '/project-alpha', '/day-trading-academy', '/day-trading-bootcamp',
  '/crystal-ball-course', '/crystal-ball-gold-edition-course', '/momentum-course', '/digital-store',
  '/trick-trades-core', '/polaris', '/testimonials', '/contact-us'];
const b = await chromium.launch();
let fail = 0;
// Rail-lane geometry assertion on the alpha page
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('http://localhost:4173/project-alpha', { waitUntil: 'networkidle' });
  await p.waitForTimeout(6000);
  const geo = await p.evaluate(() => {
    const rail = document.querySelector('.chapter-rail')?.getBoundingClientRect();
    const callouts = [...document.querySelectorAll('.stage-callout')].map((c) => c.getBoundingClientRect().right);
    return { railLeft: rail ? Math.round(rail.left) : null, calloutMaxRight: Math.round(Math.max(...callouts)) };
  });
  const clear = geo.railLeft === null || geo.calloutMaxRight < geo.railLeft - 4;
  console.log(`rail lane: callouts right=${geo.calloutMaxRight} rail left=${geo.railLeft} -> ${clear ? 'CLEAR' : 'COLLIDING'}`);
  if (!clear) fail++;
  await p.close();
}
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
      let stuck = 0;
      for (const el of document.querySelectorAll('[data-anim-stagger] > *, [data-anim], [data-split]')) {
        const rc = el.getBoundingClientRect();
        if (rc.width === 0 && rc.height === 0) continue;
        if (parseFloat(getComputedStyle(el).opacity) < 0.99) stuck++;
      }
      return { stuck, overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        h1: document.querySelectorAll('h1').length, emdash: (document.body.innerText.match(/—/g) || []).length };
    });
    const ok = resp.status() === 200 && res.stuck === 0 && !res.overflowX && res.h1 === 1 && res.emdash === 0;
    if (!ok) { fail++; console.log(`FAIL [${tag}] ${r}`, JSON.stringify(res)); }
  }
  if (errors.length) { console.log(`JS ERRORS [${tag}]:`, [...new Set(errors)].slice(0, 3).join(' ; ')); fail++; }
  await p.close();
}
await b.close();
console.log(fail === 0 ? 'ALL CHECKS PASS' : `${fail} FAILURES`);
process.exit(fail);
