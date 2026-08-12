/**
 * /momentum — route-scoped Lenis smooth scroll.
 *
 * Mirrors src/lib/pages/project-alpha/motion/smooth-scroll.ts: same duration,
 * same easing, driven off gsap.ticker with lagSmoothing(0), wired to
 * ScrollTrigger.update, and torn down completely (ticker callback removed,
 * instance destroyed, root classes removed).
 *
 * Lenis scrolls the window, so ScrollTrigger needs no scrollerProxy — the
 * `scroll` -> `ScrollTrigger.update` bridge is the whole wiring, and it is what
 * keeps the Ledger's pinned/scrubbed trigger in sync with the smoothed value.
 *
 * REDUCED MOTION: `initSmoothScroll(true)` returns null immediately and creates
 * nothing, so a reduced-motion visitor gets plain native scrolling.
 */

import Lenis from 'lenis';
import { gsap, ScrollTrigger, ensureGsap } from './gsap-setup';

let lenis: Lenis | null = null;
let tickerFn: ((time: number) => void) | null = null;

export function initSmoothScroll(reducedMotion: boolean): Lenis | null {
	if (typeof window === 'undefined') return null;
	if (reducedMotion) return null;

	ensureGsap();
	// Guard against a double-mount (HMR, or a navigation that re-runs the effect).
	destroySmoothScroll();

	lenis = new Lenis({
		duration: 1.4,
		easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
		smoothWheel: true,
		touchMultiplier: 1.4
	});

	lenis.on('scroll', ScrollTrigger.update);

	tickerFn = (time: number) => {
		// gsap.ticker reports seconds; Lenis wants milliseconds.
		lenis?.raf(time * 1000);
	};
	gsap.ticker.add(tickerFn);
	gsap.ticker.lagSmoothing(0);

	document.documentElement.classList.add('lenis', 'lenis-smooth');
	return lenis;
}

export function destroySmoothScroll() {
	if (tickerFn) {
		gsap.ticker.remove(tickerFn);
		tickerFn = null;
	}
	if (lenis) {
		lenis.destroy();
		lenis = null;
	}
	if (typeof document !== 'undefined') {
		document.documentElement.classList.remove('lenis', 'lenis-smooth');
	}
}

/*
 * NOTE: no `getLenis()` escape hatch is exported. project-alpha's equivalent
 * module exports one, but nothing on this page ever needed the instance, and an
 * export with no consumer is dead scaffolding. `lenis` above is module-private;
 * add an accessor back only when a caller actually exists.
 */

/**
 * Scroll to an in-page section, Lenis-aware.
 *
 * Use this for the Overture's scroll cue rather than `jumpTo()` from
 * $lib/motion: jumpTo calls `window.scrollTo({ behavior: 'smooth' })`, which
 * runs a second, native animation alongside Lenis' own. When Lenis is not
 * running (reduced motion, or SSR-hydration before init) this falls back to the
 * same native smooth scroll jumpTo would have done.
 *
 * The 84px default offset is the shared repo convention (src/lib/motion.ts:371).
 * Focus is moved to the target afterwards so keyboard and screen-reader users
 * actually land there; `section[id]:focus { outline: none }` in app.css:359-361
 * keeps that from painting a ring.
 */
export function scrollToId(id: string, offset = 84) {
	if (typeof document === 'undefined') return;
	const el = document.getElementById(id.replace(/^#/, ''));
	if (!el) return;

	if (lenis) {
		lenis.scrollTo(el, { offset: -offset, duration: 1.2 });
	} else {
		const top = el.getBoundingClientRect().top + window.scrollY - offset;
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
	}

	if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
	el.focus({ preventScroll: true });
}

/** Click handler for the page's in-page anchors: `onclick={(e) => jumpToId(e, 'paths')}`. */
export function jumpToId(e: MouseEvent, id: string, offset = 84) {
	e.preventDefault();
	scrollToId(id, offset);
}
