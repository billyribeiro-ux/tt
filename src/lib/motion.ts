/**
 * Trick Trades — cinematic motion layer.
 * GSAP + ScrollTrigger + SplitText + ScrollSmoother exposed as Svelte 5 attachments.
 * Everything degrades gracefully: no-JS / reduced-motion keeps prerendered content
 * fully visible (the `.js` class that hides [data-anim] is only added when motion is allowed).
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { SplitText } from 'gsap/dist/SplitText';
import { ScrollSmoother } from 'gsap/dist/ScrollSmoother';
import type { Attachment } from 'svelte/attachments';

let registered = false;
export function registerGsap() {
	if (registered || typeof window === 'undefined') return;
	gsap.registerPlugin(ScrollTrigger, SplitText, ScrollSmoother);
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

/** Marks <html> so CSS can hide [data-anim] elements — only when motion is allowed. */
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
			gsap.set(el, { opacity: 1 });
			gsap.from(targets, {
				y,
				x,
				scale,
				opacity: 0,
				duration,
				delay,
				ease,
				stagger: stagger ?? 0,
				scrollTrigger: { trigger: el, start, once: true }
			});
		}, el);
		return () => ctx.revert();
	};
}

/** Headline word-by-word mask reveal (SplitText). Waits for fonts so line breaks are correct. */
export function splitReveal(opts: { start?: string; stagger?: number; duration?: number } = {}): Attachment {
	return (node) => {
		registerGsap();
		const el = node as HTMLElement;
		if (prefersReducedMotion()) {
			gsap.set(el, { autoAlpha: 1 });
			return;
		}
		let split: SplitText | undefined;
		let tween: gsap.core.Tween | undefined;
		let killed = false;
		const run = () => {
			if (killed) return;
			gsap.set(el, { autoAlpha: 1 });
			split = new SplitText(el, { type: 'lines,words', linesClass: 'tt-splitline' });
			tween = gsap.from(split.words, {
				yPercent: 118,
				opacity: 0,
				duration: opts.duration ?? 0.9,
				ease: 'power4.out',
				stagger: opts.stagger ?? 0.03,
				scrollTrigger: { trigger: el, start: opts.start ?? 'top 88%', once: true }
			});
		};
		const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
		if (fonts?.ready) fonts.ready.then(run);
		else run();
		return () => {
			killed = true;
			tween?.scrollTrigger?.kill();
			tween?.kill();
			split?.revert();
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
export function counter(target: number, format: (v: number) => string = (v) => Math.round(v).toLocaleString('en-US')): Attachment {
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
			scrollTrigger: { trigger: el, start: 'top 92%', once: true }
		});
		return () => {
			t.scrollTrigger?.kill();
			t.kill();
		};
	};
}

/** Magnetic pull toward the cursor — for primary CTAs. Skips touch / reduced motion. */
export function magnetic(strength = 0.35): Attachment {
	return (node) => {
		registerGsap();
		const el = node as HTMLElement;
		if (prefersReducedMotion() || isCoarse()) return;
		const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' });
		const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' });
		const move = (e: PointerEvent) => {
			const r = el.getBoundingClientRect();
			xTo((e.clientX - (r.left + r.width / 2)) * strength);
			yTo((e.clientY - (r.top + r.height / 2)) * strength);
		};
		const leave = () => {
			xTo(0);
			yTo(0);
		};
		el.addEventListener('pointermove', move);
		el.addEventListener('pointerleave', leave);
		return () => {
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
		const move = (e: PointerEvent) => {
			const r = el.getBoundingClientRect();
			ry(((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * max);
			rx((-(e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * max);
		};
		const leave = () => {
			rx(0);
			ry(0);
		};
		el.addEventListener('pointermove', move);
		el.addEventListener('pointerleave', leave);
		return () => {
			el.removeEventListener('pointermove', move);
			el.removeEventListener('pointerleave', leave);
			gsap.set(el, { rotationX: 0, rotationY: 0 });
		};
	};
}

/** Seamless auto-scrolling marquee (logo / stat ribbons). */
export function marquee(speed = 32): Attachment {
	return (node) => {
		registerGsap();
		const el = node as HTMLElement;
		if (prefersReducedMotion()) return;
		const half = el.scrollWidth / 2;
		if (!half) return;
		const t = gsap.to(el, {
			x: -half,
			duration: half / speed,
			ease: 'none',
			repeat: -1
		});
		const enter = () => gsap.to(t, { timeScale: 0.25, duration: 0.4 });
		const leave = () => gsap.to(t, { timeScale: 1, duration: 0.4 });
		el.addEventListener('pointerenter', enter);
		el.addEventListener('pointerleave', leave);
		return () => {
			el.removeEventListener('pointerenter', enter);
			el.removeEventListener('pointerleave', leave);
			t.kill();
		};
	};
}

/** Smooth-scroll to an in-page target, aware of ScrollSmoother when it's active. */
export function scrollToTarget(hash: string, offset = 84) {
	registerGsap();
	if (typeof document === 'undefined' || !hash.startsWith('#')) return;
	const el = document.querySelector(hash);
	if (!el) return;
	const smoother = ScrollSmoother.get();
	if (smoother) {
		smoother.scrollTo(el as HTMLElement, true, `top ${offset}px`);
	} else {
		const top = (el as HTMLElement).getBoundingClientRect().top + window.scrollY - offset;
		window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
	}
}

/** ScrollSmoother — buttery inertia scroll on pointer devices. Returns a disposer. */
export function createSmoother(): () => void {
	registerGsap();
	if (prefersReducedMotion() || isCoarse()) return () => {};
	const smoother = ScrollSmoother.create({
		wrapper: '#smooth-wrapper',
		content: '#smooth-content',
		smooth: 1.15,
		effects: true,
		normalizeScroll: true
	});
	return () => smoother?.kill();
}
