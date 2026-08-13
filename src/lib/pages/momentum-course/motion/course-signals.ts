/**
 * /momentum-course — shared page signals.
 *
 * WHAT THIS FILE IS. The one place the course page's *structure* is written
 * down: the six section stops, their rail indices, their section-head numbering,
 * the three string constants that form the intro-film contract, and the small
 * pure-maths helpers the canvas viz on this page share (seeded value noise,
 * clamp/lerp, and a CSS-custom-property colour reader).
 *
 * WHAT THIS FILE IS NOT. It holds NO reactive state, and it cannot: runes are
 * only compiled inside `.svelte` and `.svelte.ts` modules, and this is a plain
 * `.ts`. The page's reactive state therefore stays where it already is:
 *
 *   - `reducedMotion` and `scrollProgress` — written by the route's $effect into
 *     `$lib/pages/momentum/state/ui.svelte` (src/routes/momentum-course/+page.svelte:43,54).
 *     Read them from there.
 *   - `activeSection` — NOT in a store. CourseDirector computes it locally with
 *     `pickActiveSection()` below and is its only consumer, so there is no
 *     cross-component signal to keep in sync and nothing to leave dangling.
 *     Do not add a second writer in the route: it would be dead scaffolding.
 *   - `curriculumIndex` — belongs to MomentumCurriculum, which is both its only
 *     writer (its pinned trigger) and its only reader (it passes the value down
 *     to CurriculumSpine as a prop). Keep it local; a module-scope store for a
 *     value that never leaves one subtree is scaffolding too.
 *
 * PROVENANCE. Every label below is a string ALREADY RENDERED on the page today;
 * nothing here is new copy. Line numbers are cited per entry.
 */

export type CourseSectionId =
	'mo-hero' | 'mo-scope' | 'mo-curriculum' | 'mo-boss' | 'mo-voices' | 'mo-enroll';

export interface CourseSection {
	/** The section element's `id`. The rail scrolls to it; the spy reads it. */
	readonly id: CourseSectionId;
	/** Rail label. Always a string the page already prints — see the citations. */
	readonly label: string;
	/** Two-digit rail index, 01..06. Rail only — see `head` for the section heads. */
	readonly n: string;
	/**
	 * The `.section-head .idx` string for this section, or `null` where the
	 * section has no head. The hero has none (it opens with an h1, not a head),
	 * so the heads count the five TITLED sections: 01/05 .. 05/05.
	 *
	 * This is the fix for the page's broken numbering. Today the five heads read
	 * `01 / 02` (MomentumScope.svelte:18), `02 / 04` (MomentumCurriculum.svelte:31),
	 * `02 / 02` (MomentumBoss.svelte:13), `04 / 04` (MomentumVoices.svelte:31) and
	 * nothing at all on Enroll — three different denominators, `02` twice, `03`
	 * never. Sections MUST render `courseSectionHead(id)` rather than a literal,
	 * so the count can never drift again.
	 */
	readonly head: string | null;
}

export const COURSE_SECTIONS: readonly CourseSection[] = [
	{
		id: 'mo-hero',
		// The h1 reads "Momentum." (MomentumHero.svelte:298-305). The rail drops
		// the sentence period; the word itself is unchanged.
		label: 'Momentum',
		n: '01',
		head: null
	},
	// "The scope" — MomentumScope.svelte:20, `.label.mo-scope__count`.
	{ id: 'mo-scope', label: 'The scope', n: '02', head: '01 / 05' },
	// "The syllabus" — MomentumCurriculum.svelte:33, `.label.mc__count`.
	{ id: 'mo-curriculum', label: 'The syllabus', n: '03', head: '02 / 05' },
	// "Bundled inside" — MomentumBoss.svelte:13, `.label.mo-boss__count`.
	{ id: 'mo-boss', label: 'Bundled inside', n: '04', head: '03 / 05' },
	// "In their words" — MomentumVoices.svelte:31, `.label.mv__count`.
	{ id: 'mo-voices', label: 'In their words', n: '05', head: '04 / 05' },
	// "Enrollment" — MomentumEnroll.svelte:17, the eyebrow. Enroll has no head
	// today; adding one is what closes the sequence at 05 / 05.
	{ id: 'mo-enroll', label: 'Enrollment', n: '06', head: '05 / 05' }
];

/** The six ids in DOM order. Same order as COURSE_SECTIONS, always. */
export const COURSE_SECTION_IDS: readonly CourseSectionId[] = COURSE_SECTIONS.map((s) => s.id);

/** The `.section-head .idx` string for a section, or `null` if it has no head. */
export function courseSectionHead(id: CourseSectionId): string | null {
	return COURSE_SECTIONS.find((s) => s.id === id)?.head ?? null;
}

/* ==========================================================================
   THE INTRO-FILM CONTRACT.

   Three strings, exported so that no component has to retype them, and a typo
   in a string literal would fail silently.

   ⛔ NOTHING IS GATED ON THIS HANDSHAKE ANY MORE, AND NOTHING MAY BE. The hero's
   entrance used to wait for it, and measured, that left the kicker, the lede,
   the enrol button and the three figures at opacity 0 for up to nine seconds
   when the event was late. The wait is gone (MomentumHero.svelte:87-101) and the
   hero now composes on mount, underneath the film. These strings are the film's
   own bookkeeping — the sessionStorage key it remembers itself by, the class it
   marks the document with and the event it announces itself finished with — and
   they exist so the film can clean up after itself, not so anything can wait.
   ========================================================================== */

/** sessionStorage key. The film plays once per browser session, never twice. */
export const COURSE_INTRO_KEY = 'mc-intro-seen';

/**
 * Dispatched on `window` when the film has finished OR when it was skipped
 * (reduced motion, a repeat visit within the session, or the visitor scrolling
 * past it). It ALWAYS fires, exactly once, so nothing can be gated behind a
 * film that will not play.
 */
export const COURSE_INTRO_EVENT = 'mc:intro-complete';

/**
 * Added to `<html>` at the same moment, and SYNCHRONOUSLY BEFORE the event is
 * dispatched. Svelte mounts siblings in creation order, so CourseDirector (which
 * is rendered above the sections) mounts and dispatches before MomentumHero has
 * attached its listener. The hero must therefore do both: listen for the event
 * with `{ once: true }`, AND check for this class on a requestAnimationFrame in
 * case the event already went past. That is the same belt-and-braces pattern as
 * project-alpha's Hero.svelte:104-107.
 */
export const COURSE_INTRO_CLASS = 'mc-intro-done';

/*
 * There is deliberately NO second `<html>` class here. project-alpha adds
 * `cinematic-ready` (CinematicDirector.svelte:40) and nothing in the repo ever
 * reads it — verified by grepping every file outside that component. A class
 * with no consumer is dead scaffolding, so this page ships one class, the one
 * the hero actually reads.
 */

/* ==========================================================================
   THE SECTION SPY.
   ========================================================================== */

/**
 * The reading line, as a fraction of viewport height. A section becomes active
 * once its top has passed 28% down the viewport — high enough that the rail
 * changes when you have *started* reading a section rather than when it is
 * fully centred.
 */
export const COURSE_PROBE_VH = 0.28;

/**
 * The last section whose top has crossed the reading line, or `null` if none
 * has (which can only happen if the first section is missing from the DOM).
 *
 * Positions come from `getBoundingClientRect().top + scrollY`, not `offsetTop`:
 * offsetTop is measured against the nearest positioned ancestor, and several of
 * these sections sit inside `position: relative` wrappers, so offsetTop would
 * read a per-section local origin rather than a page coordinate.
 *
 * Every lookup is null-checked. A section that does not exist yet (or has been
 * removed) is skipped rather than throwing.
 */
export function pickActiveSection(
	ids: readonly CourseSectionId[] = COURSE_SECTION_IDS,
	probeVh: number = COURSE_PROBE_VH
): CourseSectionId | null {
	if (typeof document === 'undefined') return null;
	const line = window.scrollY + window.innerHeight * probeVh;
	let active: CourseSectionId | null = null;
	for (const id of ids) {
		const el = document.getElementById(id);
		if (!el) continue;
		const top = el.getBoundingClientRect().top + window.scrollY;
		if (top <= line) active = id;
	}
	return active;
}

/* ==========================================================================
   PURE MATHS, shared by every canvas on this page.
   ========================================================================== */

/** Clamp to 0..1. */
export const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Linear interpolation. */
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export interface ValueNoise {
	/** The instance seed. Exposed so a caller can vary a second channel off it. */
	readonly seed: number;
	/** Deterministic hash in -1..1 for an integer index and a channel key. */
	hash(index: number, channel?: number): number;
	/** Smoothstep-interpolated value noise in roughly -1..1. */
	noise(t: number, freq: number, channel?: number): number;
}

/**
 * Seeded smoothstep value noise.
 *
 * Ported from project-alpha/viz/WaveDivider.svelte:74-85, which is the repo's
 * existing implementation of exactly this: a per-instance random seed plus a
 * sine-hash lattice, so no two instances of a component ever draw the same
 * trace. Lifted here so the course page's dividers and mark fields share one
 * implementation instead of copying it three times.
 */
export function createValueNoise(seed: number = Math.random() * 1000): ValueNoise {
	const hash = (index: number, channel = 0) => {
		const v = Math.sin(index * 127.1 + (seed + channel) * 311.7) * 43758.5453123;
		return (v - Math.floor(v)) * 2 - 1;
	};
	const noise = (t: number, freq: number, channel = 0) => {
		const pos = t * freq;
		const idx = Math.floor(pos);
		const f = pos - idx;
		const b = f * f * (3 - 2 * f); // smoothstep
		return hash(idx, channel) + (hash(idx + 1, channel) - hash(idx, channel)) * b;
	};
	return { seed, hash, noise };
}

export interface Rgb {
	readonly r: number;
	readonly g: number;
	readonly b: number;
}

/**
 * Read a site colour token off `:root` and return it as channels, so a canvas
 * can interpolate between two tokens without a hex literal being retyped into
 * JavaScript (where it would silently rot the next time app.css changes).
 *
 * Accepts the two shapes app.css actually uses: `#rrggbb` (e.g. `--tt-mute-2`,
 * app.css:35) and space-separated channels (e.g. `--tt-red-bright-rgb`,
 * app.css:16). `fallback` is used before hydration and if the property is
 * missing; pass the literal from app.css and cite its line at the call site.
 */
export function readColorToken(name: string, fallback: string): Rgb {
	let raw = fallback;
	if (typeof window !== 'undefined') {
		const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
		if (v) raw = v;
	}
	if (raw.startsWith('#')) {
		const hex = raw.slice(1);
		const full =
			hex.length === 3
				? hex
						.split('')
						.map((c) => c + c)
						.join('')
				: hex;
		const n = Number.parseInt(full.slice(0, 6), 16);
		if (Number.isNaN(n)) return { r: 255, g: 255, b: 255 };
		return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
	}
	const parts = raw
		.replace(/[,/]/g, ' ')
		.split(/\s+/)
		.map((p) => Number.parseFloat(p))
		.filter((p) => !Number.isNaN(p));
	if (parts.length < 3) return { r: 255, g: 255, b: 255 };
	return { r: parts[0], g: parts[1], b: parts[2] };
}

/** `rgba()` string between two tokens. `t` is clamped, so callers cannot overshoot. */
export function mixRgba(a: Rgb, b: Rgb, t: number, alpha: number): string {
	const k = clamp01(t);
	return `rgba(${Math.round(lerp(a.r, b.r, k))},${Math.round(lerp(a.g, b.g, k))},${Math.round(
		lerp(a.b, b.b, k)
	)},${alpha})`;
}
