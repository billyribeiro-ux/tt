/**
 * /momentum — GSAP registration.
 *
 * Mirrors src/lib/pages/project-alpha/motion/gsap-setup.ts exactly: registration
 * is idempotent (a module-level flag), SSR-safe (no-ops when `window` is
 * undefined), and the same `gsap` singleton is shared with $lib/motion.ts, so
 * the shared attachments (reveal, splitReveal, parallax, magnetic, tilt,
 * drawLine) and this page's Director operate on one instance.
 *
 * ScrollTrigger is imported from 'gsap/dist/ScrollTrigger' to match the repo's
 * existing import path.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

let registered = false;

export function ensureGsap() {
	if (registered || typeof window === 'undefined') return gsap;
	gsap.registerPlugin(ScrollTrigger);
	registered = true;
	return gsap;
}

export { gsap, ScrollTrigger };
