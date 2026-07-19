/**
 * Trick Trades: cinematic motion layer.
 * GSAP + ScrollTrigger + SplitText exposed as Svelte 5 attachments.
 * Everything degrades gracefully: no-JS / reduced-motion keeps prerendered content
 * fully visible (the `.js` class that hides [data-anim] is only added when motion is allowed).
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { SplitText } from 'gsap/dist/SplitText';
import type { Attachment } from 'svelte/attachments';

let registered = false;
export function registerGsap() {
	if (registered || typeof window === 'undefined') return;
	gsap.registerPlugin(ScrollTrigger, SplitText);
	gsap.defaults({ ease: 'power3.out' });
	registered = true;
}

export const prefersReducedMotion = () =>
	typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Recompute all ScrollTrigger positions (call after fonts/images settle). */
export function refreshTriggers() {
	registerGsap();
	ScrollTrigger.refresh();
}

const isCoarse = () =>
	typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

/** Marks <html> so CSS can hide [data-anim] elements, only when motion is allowed. */
export function enableMotionClass() {
	if (typeof document === 'undefined' || prefersReducedMotion()) return;
	document.documentElement.classList.add('js');
}

type RevealOpts = {
	y?: number;
	x?: number;
	scale?: number;
	duration?: number;
	delay?: number;
	start?: string;
	stagger?: number;
	ease?: string;
};

/** Fade / slide an element (or its children when `stagger` is set) into view on scroll. */
export function reveal(opts: RevealOpts = {}): Attachment {
	return (node) => {
		registerGsap();
		const el = node as HTMLElement;
		if (prefersReducedMotion()) {
			gsap.set(el, { clearProps: 'all' });
			return;
		}
		const {
			y = 44,
			x = 0,
			scale = 1,
			duration = 1,
			delay = 0,
			start = 'top 84%',
			stagger,
			ease = 'power3.out'
		} = opts;
		const targets = stagger ? (Array.from(el.children) as HTMLElement[]) : el;
		const ctx = gsap.context(() => {
			// Reset the CSS-gated opacity:0 on the TWEEN TARGETS (children in the stagger
			// path). gsap.from() reads the current computed value as its END value, so
			// resetting only the container would tween children 0 -> 0 (invisible forever).
			gsap.set(el, { opacity: 1 });
			gsap.set(targets, { opacity: 1 });
			gsap.from(targets, {
				y,
				x,
				scale,
				opacity: 0,
				duration,
				delay,
				ease,
				stagger: stagger ?? 0,
				scrollTrigger: { trigger: el, start, once: true },
				// Drop the will-change compositor hint once the entrance has played.
				onComplete: () => gsap.set(targets, { clearProps: 'willChange' })
			});
		}, el);
		return () => ctx.revert();
	};
}

/**
 * Headline word-by-word mask reveal (SplitText).
 * The headline is made visible IMMEDIATELY (never gated on fonts.ready, which would
 * hide the LCP text until webfonts resolve); the split itself waits for fonts so the
 * line boxes are measured against the final typeface, and re-splits on width resize
 * so masks match real line breaks after rotation.
 */
export function splitReveal(
	opts: { start?: string; stagger?: number; duration?: number; delay?: number } = {}
): Attachment {
	return (node) => {
		registerGsap();
		const el = node as HTMLElement;
		gsap.set(el, { autoAlpha: 1 });
		if (prefersReducedMotion()) return;
		let split: SplitText | undefined;
		let tween: gsap.core.Tween | undefined;
		let killed = false;
		let played = false;
		const teardown = () => {
			tween?.scrollTrigger?.kill();
			tween?.kill();
			split?.revert();
			split = undefined;
			tween = undefined;
		};
		const run = () => {
			if (killed || played) return;
			teardown();
			split = new SplitText(el, { type: 'lines,words', linesClass: 'tt-splitline' });
			tween = gsap.from(split.words, {
				yPercent: 118,
				opacity: 0,
				duration: opts.duration ?? 0.9,
				delay: opts.delay ?? 0,
				ease: 'power4.out',
				stagger: opts.stagger ?? 0.03,
				scrollTrigger: { trigger: el, start: opts.start ?? 'top 88%', once: true },
				onComplete: () => {
					// After the entrance, unwrap the masks so future resizes reflow naturally.
					played = true;
					teardown();
				}
			});
		};
		// Split immediately, never gating the LCP headline's visibility on fonts.ready,
		// then re-split once webfonts land (if the entrance hasn't played) so line
		// masks are measured against the final typeface.
		run();
		const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
		fonts?.ready.then(() => run()).catch(() => {});
		// Re-split when the element's width changes before the entrance has played
		// (device rotation / window resize would otherwise leave stale line masks).
		let lastW = el.clientWidth;
		const ro = new ResizeObserver(() => {
			if (played || killed) return;
			const w = el.clientWidth;
			if (w !== lastW && split) {
				lastW = w;
				run();
			}
		});
		ro.observe(el);
		return () => {
			killed = true;
			ro.disconnect();
			teardown();
		};
	};
}

/** Scroll-scrubbed parallax drift. */
export function parallax(amount = 90): Attachment {
	return (node) => {
		registerGsap();
		if (prefersReducedMotion()) return;
		const el = node as HTMLElement;
		const t = gsap.to(el, {
			y: amount,
			ease: 'none',
			scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
		});
		return () => {
			t.scrollTrigger?.kill();
			t.kill();
		};
	};
}

/** Count a number up when it scrolls into view. */
export function counter(
	target: number,
	format: (v: number) => string = (v) => Math.round(v).toLocaleString('en-US')
): Attachment {
	return (node) => {
		registerGsap();
		const el = node as HTMLElement;
		if (prefersReducedMotion()) {
			el.textContent = format(target);
			return;
		}
		const obj = { v: 0 };
		const t = gsap.to(obj, {
			v: target,
			duration: 2.2,
			ease: 'power2.out',
			onUpdate: () => (el.textContent = format(obj.v)),
			// Match reveal()'s default start so counters begin with their container's
			// entrance instead of finishing before the block has faded in.
			scrollTrigger: { trigger: el, start: 'top 84%', once: true }
		});
		return () => {
			t.scrollTrigger?.kill();
			t.kill();
		};
	};
}

/** Magnetic pull toward the cursor, for primary CTAs. Skips touch / reduced motion. */
export function magnetic(strength = 0.35): Attachment {
	return (node) => {
		registerGsap();
		const el = node as HTMLElement;
		if (prefersReducedMotion() || isCoarse()) return;
		const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' });
		const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' });
		// Measure once on entry, not per pointermove: a getBoundingClientRect() every
		// move forces a layout flush against GSAP's concurrent transform writes.
		let r: DOMRect | undefined;
		const enter = () => (r = el.getBoundingClientRect());
		const move = (e: PointerEvent) => {
			if (!r) r = el.getBoundingClientRect();
			xTo((e.clientX - (r.left + r.width / 2)) * strength);
			yTo((e.clientY - (r.top + r.height / 2)) * strength);
		};
		const leave = () => {
			r = undefined;
			xTo(0);
			yTo(0);
		};
		el.addEventListener('pointerenter', enter);
		el.addEventListener('pointermove', move);
		el.addEventListener('pointerleave', leave);
		return () => {
			el.removeEventListener('pointerenter', enter);
			el.removeEventListener('pointermove', move);
			el.removeEventListener('pointerleave', leave);
			gsap.set(el, { x: 0, y: 0 });
		};
	};
}

/** Subtle 3D tilt toward the cursor for cards. */
export function tilt(max = 8): Attachment {
	return (node) => {
		registerGsap();
		const el = node as HTMLElement;
		if (prefersReducedMotion() || isCoarse()) return;
		const rx = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power2' });
		const ry = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power2' });
		gsap.set(el, { transformPerspective: 900, transformStyle: 'preserve-3d' });
		let r: DOMRect | undefined;
		const enter = () => (r = el.getBoundingClientRect());
		const move = (e: PointerEvent) => {
			if (!r) r = el.getBoundingClientRect();
			ry(((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * max);
			rx((-(e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * max);
		};
		const leave = () => {
			r = undefined;
			rx(0);
			ry(0);
		};
		el.addEventListener('pointerenter', enter);
		el.addEventListener('pointermove', move);
		el.addEventListener('pointerleave', leave);
		return () => {
			el.removeEventListener('pointerenter', enter);
			el.removeEventListener('pointermove', move);
			el.removeEventListener('pointerleave', leave);
			gsap.set(el, { rotationX: 0, rotationY: 0 });
		};
	};
}

/**
 * Seamless auto-scrolling marquee (logo / stat ribbons).
 * Content must be duplicated once in the markup. Measures the true loop distance
 * (first item of the duplicate half minus first item of the original half) so the
 * loop never seams, and re-measures after webfonts load.
 */
export function marquee(speed = 32): Attachment {
	return (node) => {
		registerGsap();
		const el = node as HTMLElement;
		if (prefersReducedMotion()) return;
		let t: gsap.core.Tween | undefined;
		const build = () => {
			t?.kill();
			gsap.set(el, { x: 0 });
			const kids = el.children;
			// True loop distance: offset of the duplicate half's first element.
			const half =
				kids.length >= 2
					? ((kids[Math.floor(kids.length / 2)] as HTMLElement)?.offsetLeft ?? 0)
					: el.scrollWidth / 2;
			if (!half) return;
			t = gsap.to(el, { x: -half, duration: half / speed, ease: 'none', repeat: -1 });
		};
		build();
		// Re-measure once the display typeface swaps in (widths change).
		const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
		let killed = false;
		fonts?.ready.then(() => !killed && build()).catch(() => {});
		const slow = () => t && gsap.to(t, { timeScale: 0.25, duration: 0.4 });
		const resume = () => t && gsap.to(t, { timeScale: 1, duration: 0.4 });
		el.addEventListener('pointerenter', slow);
		el.addEventListener('pointerleave', resume);
		return () => {
			killed = true;
			el.removeEventListener('pointerenter', slow);
			el.removeEventListener('pointerleave', resume);
			t?.kill();
		};
	};
}

/**
 * Draw an SVG path like a price line printing across a chart, scrubbed to scroll.
 * Attach to an <svg> element; every <path> inside is drawn via dash-offset.
 * `scrub: false` plays it once on entry instead (for hero moments).
 */
export function drawLine(
	opts: { scrub?: boolean; duration?: number; start?: string } = {}
): Attachment {
	return (node) => {
		registerGsap();
		const svg = node as unknown as SVGSVGElement;
		if (prefersReducedMotion()) return;
		const paths = Array.from(svg.querySelectorAll('path'));
		if (!paths.length) return;
		const tweens = paths.map((p) => {
			const len = p.getTotalLength();
			gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
			return gsap.to(p, {
				strokeDashoffset: 0,
				ease: opts.scrub === false ? 'power2.inOut' : 'none',
				duration: opts.duration ?? 1.6,
				scrollTrigger:
					opts.scrub === false
						? { trigger: svg, start: opts.start ?? 'top 84%', once: true }
						: {
								trigger: svg,
								start: opts.start ?? 'top 88%',
								end: 'bottom 45%',
								scrub: 0.6
							}
			});
		});
		return () => {
			for (const t of tweens) {
				t.scrollTrigger?.kill();
				t.kill();
			}
			gsap.set(paths, { clearProps: 'strokeDasharray,strokeDashoffset' });
		};
	};
}

/**
 * Smooth-scroll to an in-page target using native scroll (respects the fixed header),
 * then move focus to the target so keyboard/screen-reader users actually land there.
 */
export function scrollToTarget(hash: string, offset = 84) {
	scrollToHash(hash, offset);
}

/** Click handler for in-page anchor links: `onclick={(e) => jumpTo(e, '#pricing')}`. */
export function jumpTo(e: MouseEvent, hash: string, offset = 84) {
	if (!hash.startsWith('#')) return;
	e.preventDefault();
	scrollToHash(hash, offset);
}

function scrollToHash(hash: string, offset = 84) {
	if (typeof document === 'undefined' || !hash.startsWith('#')) return;
	const el = document.querySelector<HTMLElement>(hash);
	if (!el) return;
	const top = el.getBoundingClientRect().top + window.scrollY - offset;
	window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
	// Make the section programmatically focusable without adding it to the tab order.
	if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
	el.focus({ preventScroll: true });
}
