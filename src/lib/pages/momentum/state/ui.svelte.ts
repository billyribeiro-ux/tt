/**
 * /momentum — page-scoped reactive UI state.
 *
 * Mirrors src/lib/pages/project-alpha/state/ui.svelte.ts: a single class-based
 * rune store, instantiated once at module scope. The route's $effect is the only
 * writer for `reducedMotion`, `scrollProgress` and `activeSection`; every
 * consumer reads.
 *
 * This page has no modal, so there is no open/close pair here — project-alpha's
 * applyOpen/openApply/closeApply are deliberately not copied.
 */

import { SECTION_IDS, type SectionId } from '../data/content';

class MomentumUiState {
	/**
	 * Mirrors `matchMedia('(prefers-reduced-motion: reduce)')`. Written by the
	 * route's $effect on mount and again on every `change` event.
	 *
	 * WARNING for viz components: a component can mount BEFORE the route effect
	 * runs, so this can still be `false` for a reduced-motion visitor at that
	 * instant. ChromeStage and MomentumTape must ALSO re-check
	 * `window.matchMedia` directly at mount — the exact bug documented in
	 * project-alpha/viz/NeuroTradeHud.svelte:19-27.
	 */
	reducedMotion = $state(false);

	/** 0..1 document scroll progress, written by the route's passive scroll listener. */
	scrollProgress = $state(0);

	/** The section id currently under the reading line. Drives the Director's chapter rail. */
	activeSection = $state<SectionId>(SECTION_IDS[0]);
}

export const ui = new MomentumUiState();
