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
