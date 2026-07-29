import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const ctx = await browser.newContext({
	viewport: { width: 1440, height: 900 },
	reducedMotion: 'reduce'
});
const page = await ctx.newPage();
await page.goto('http://localhost:5199/project-alpha', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);

// 1. Schedule copy + placeholder time + time color
await page.locator('#schedule').scrollIntoViewIfNeeded();
await page.waitForTimeout(600);
const desc = await page.locator('#schedule .section-desc').innerText();
console.log('SCHEDULE DESC:', JSON.stringify(desc.replace(/\s+/g, ' ').trim()));
const firstTime = await page
	.locator('#schedule .block')
	.nth(2)
	.locator('.time')
	.first()
	.innerText();
console.log('POST-MARKET FIRST TIME CELL:', JSON.stringify(firstTime));
const timeColor = await page
	.locator('#schedule .time')
	.first()
	.evaluate((el) => getComputedStyle(el).color);
console.log('TIME COLOR:', timeColor);
await page.screenshot({ path: '/tmp/tt-alpha/verify-schedule.png' });

// 2. Assessments .when color
const whenColor = await page
	.locator('#assessments .when')
	.first()
	.evaluate((el) => getComputedStyle(el).color);
console.log('WHEN COLOR:', whenColor);

// 3. Rail clearance: coherence right edge vs rail dot left edge
const coh = await page.locator('#hypothesis .coherence').boundingBox();
const rail = await page.locator('.chapter-rail .rail-track').boundingBox();
console.log(
	'COHERENCE RIGHT:',
	coh ? (coh.x + coh.width).toFixed(1) : 'n/a',
	'RAIL LEFT:',
	rail ? rail.x.toFixed(1) : 'n/a'
);
const shell = await page.locator('#hypothesis').boundingBox();
console.log('SHELL WIDTH:', shell ? shell.width.toFixed(1) : 'n/a');

// 4. Hypothesis pre-study nobreak renders on one line
const nb = await page.locator('#hypothesis .no-break').boundingBox();
console.log('NO-BREAK BOX:', nb ? `${nb.width.toFixed(0)}x${nb.height.toFixed(0)}` : 'n/a');

// 5. CTA mark mask applied
await page.locator('#apply').scrollIntoViewIfNeeded();
await page.waitForTimeout(600);
const mask = await page
	.locator('.cta-mark')
	.evaluate((el) => getComputedStyle(el).maskImage || getComputedStyle(el).webkitMaskImage);
console.log('CTA MASK:', mask.slice(0, 60));
await page.screenshot({ path: '/tmp/tt-alpha/verify-apply.png' });

// 6. Hero wordmark mask + screenshot
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(700);
const hm = await page
	.locator('.hero-wordmark')
	.evaluate((el) => getComputedStyle(el).maskImage || getComputedStyle(el).webkitMaskImage);
console.log('HERO WORDMARK MASK:', hm.slice(0, 60));
await page.screenshot({ path: '/tmp/tt-alpha/verify-hero.png' });

// Mobile pass for hero wordmark
const mctx = await browser.newContext({
	viewport: { width: 390, height: 844 },
	reducedMotion: 'reduce'
});
const mp = await mctx.newPage();
await mp.goto('http://localhost:5199/project-alpha', { waitUntil: 'networkidle' });
await mp.waitForTimeout(1500);
await mp.screenshot({ path: '/tmp/tt-alpha/verify-hero-mobile.png' });

await browser.close();
console.log('DONE');
