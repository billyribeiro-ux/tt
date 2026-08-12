<script lang="ts">
	/**
	 * MomentumTape — the /momentum Ledger figure.
	 *
	 * WHAT IT PLOTS, AND WHAT IT DELIBERATELY DOES NOT.
	 * There is no market data on the /momentum page and none is invented here.
	 * This figure has no price axis, no time axis, no quote, no return, no win
	 * rate and no currency. It draws exactly two countable quantities, both of
	 * which are certified strings from the reference capture:
	 *
	 *   LANE A — "The Complete Momentum course":
	 *       129 lesson ticks   (from "Over 129 Video Lessons", pretty.html:7518)
	 *       8 week segments    (from "INCLUDES one 8 week round of live trading")
	 *   LANE B — "8 weeks of Live Trading + Q & A only":
	 *       an EMPTY lesson region inside the same outline
	 *                          (from "DOES NOT INCLUDE MOMENTUM MODULES")
	 *       8 week segments    (from "Once a week for 8 weeks")
	 *
	 * The void in lane B is the whole argument, and it is drawn rather than
	 * asserted. Nothing here is composed, summed, averaged or compared.
	 *
	 * THIS SVG DRAWS NO TEXT. The four certified fragments naming these quantities
	 * are rendered once, as HTML lane labels, by Ledger.svelte directly above this
	 * figure; printing them again as SVG captions put every one of them on screen
	 * twice. The <svg> keeps role="img" and aria-label = ledger.tapeAriaLabel (the
	 * two captured offer descriptions, verbatim), and the failure fallback still
	 * lists all four fragments as text. See the longer note at the outlines.
	 *
	 * NO ANIMATED NUMERALS. 129 is a stated FLOOR ("Over 129"), so counting a
	 * numeral up through 7... 43... 118 would briefly assert figures the evidence
	 * does not support. The TICKS are the animated quantity; the verbatim strings
	 * are printed statically by the section.
	 *
	 * COLOUR ENCODING (measured off the reference art, see momentum.css):
	 * cyan #05dafa marks the course — momentum-course-1920.png accents in cyan and
	 * contains no red; red #ff3333 marks the live round — momentum-live-1280.png
	 * carries a red ON AIR badge and contains no cyan. Per the repo's d3 idiom
	 * (EEGWaveform.svelte, BioMarketMonitor.svelte) the colours are hardcoded here
	 * as hex strings matching the CSS tokens by value; this repo's d3 code does not
	 * read CSS custom properties.
	 *
	 * REPO D3 IDIOM, followed exactly: the full `d3` bundle is dynamically imported
	 * inside onMount, the SVG is built imperatively with d3.select().append(), and
	 * there are no d3 scales and no d3 axes — every pixel coordinate is computed by
	 * hand, as in both existing d3 components.
	 */
	import { onMount } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import { browser } from '$app/env';
	import { ui } from '$lib/pages/momentum/state/ui.svelte';
	import { ledger } from '$lib/pages/momentum/data/content';

	interface Props {
		/**
		 * 0..1 draw-in progress, fully CONTROLLED by the caller. The Ledger's pinned
		 * ScrollTrigger (>=1024px, owned by Director.svelte) scrubs it; below that
		 * breakpoint nothing drives it and the default of 1 renders the completed
		 * figure, which is the honest default. Under reduced motion this prop is
		 * ignored and the tape is always complete.
		 *
		 * Mapping (from the motion score):
		 *   0.00 -> 0.55  the 129 course ticks print left to right
		 *   0.35 -> 0.70  the course lane's 8 week blocks fill in cyan
		 *   0.70 -> 1.00  the live lane's 8 week blocks fill in red
		 * The live lane's lesson region never fills: it is the argument.
		 */
		progress?: number;
		/** Fixed pixel height at >=1024px. Repo d3 idiom: fluid width, fixed height. */
		height?: number;
		/** Fixed pixel height below 1024px (the repo's canonical breakpoint, app.css:60-66). */
		compactHeight?: number;
	}

	let { progress = 1, height = 260, compactHeight = 200 }: Props = $props();

	/* Values, not tokens: see the colour note above. */
	const CYAN = '#05dafa'; // === --mo-cyan
	const RED = '#ff3333'; // === --tt-red-bright
	const LINE = 'rgba(255, 255, 255, 0.09)'; // === --tt-line

	const TICKS = ledger.lessonTicks; // 129
	const WEEKS = ledger.weekSegments; // 8

	let host: HTMLDivElement | undefined;
	/** Re-checked directly at mount: see the reduced-motion note in onMount. */
	let localReduced = $state(false);
	let failed = $state(false);
	let ready = $state(false);
	let inView = $state(true);
	/** Set once the SVG exists; the only writer of geometry attributes. */
	let paint: ((p: number) => void) | undefined;
	/** Non-reactive: guarantees one paint even if the figure mounts off-screen. */
	let painted = false;

	const captureHost: Attachment<HTMLDivElement> = (node) => {
		host = node;
		return () => {
			if (host === node) host = undefined;
		};
	};

	const reduced = $derived(ui.reducedMotion || localReduced);
	const target = $derived(reduced ? 1 : Math.min(1, Math.max(0, progress)));

	$effect(() => {
		// Read every dependency before any early return so the effect re-runs when
		// the figure scrolls back into view with a progress value it skipped.
		const p = target;
		const isReady = ready;
		const visible = inView;
		if (!isReady) return;
		if (!visible && painted) return;
		paint?.(p);
		painted = true;
	});

	onMount(() => {
		if (!browser || !host) return;

		let disposed = false;
		let removeSvg: (() => void) | undefined;
		let relayout: (() => void) | undefined;
		let ro: ResizeObserver | undefined;
		let io: IntersectionObserver | undefined;

		/**
		 * ui.reducedMotion is written by the route's $effect, which can run AFTER
		 * this component mounts — the exact bug documented in
		 * project-alpha/viz/NeuroTradeHud.svelte:19-27. Read matchMedia directly too.
		 */
		const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
		localReduced = motionMq.matches;
		const onMotion = (e: MediaQueryListEvent) => (localReduced = e.matches);
		motionMq.addEventListener('change', onMotion);

		const wideMq = window.matchMedia('(min-width: 1024px)');
		const onWide = () => relayout?.();
		wideMq.addEventListener('change', onWide);

		// Stop repainting a scrubbed figure that is off-screen. Neither existing d3
		// component in this repo does this; the canvas/WebGL ones do.
		io = new IntersectionObserver(
			(entries) => {
				inView = entries[0]?.isIntersecting ?? true;
			},
			{ rootMargin: '120px 0px' }
		);
		io.observe(host);

		void (async () => {
			try {
				// Full bundle, per the repo's d3 idiom. There is no tree-shaken precedent here.
				const d3 = await import('d3');
				if (disposed || !host) return;

				const M = { top: 10, right: 12, bottom: 8, left: 12 };

				const svg = d3
					.select(host)
					.append('svg')
					.attr('width', '100%')
					.attr('height', height)
					.attr('role', 'img')
					// Verbatim certified sentences, concatenated — never paraphrased.
					.attr('aria-label', ledger.tapeAriaLabel);
				removeSvg = () => svg.remove();

				const gA = svg.append('g');
				const gB = svg.append('g');

				const outline = (g: typeof gA) =>
					g
						.append('rect')
						.attr('fill', 'none')
						.attr('stroke', LINE)
						.attr('stroke-width', 1)
						.attr('rx', 3)
						.node() as SVGRectElement;

				const outlineA = outline(gA);
				const outlineB = outline(gB);

				/*
				 * NO TEXT IS DRAWN INSIDE THIS SVG, deliberately.
				 *
				 * This figure used to print the same four certified fragments
				 * (lessons / includesLive / noModules / weekly) as <text> captions.
				 * Ledger.svelte already renders all four as HTML lane labels directly
				 * above this element, so every one of them appeared on screen TWICE.
				 * The section's labels win: HTML text is selectable, scales with the
				 * user's font size and reflows, whereas an 11px SVG caption anchored at
				 * x = M.left cannot wrap and overflows the viewBox on a narrow phone
				 * ("INCLUDES one 8 week round of live trading" is wider than the 240px
				 * minimum width this component lays out against).
				 *
				 * Nothing is lost for assistive technology: the <svg> keeps
				 * role="img" + aria-label = ledger.tapeAriaLabel (both captured offer
				 * descriptions verbatim), and the failure fallback below still lists all
				 * four fragments as text. The lane spacing that used to hold the
				 * captions is retained as breathing room — see laneAt().
				 */

				const tickNodes: SVGRectElement[] = [];
				for (let i = 0; i < TICKS; i++) {
					tickNodes.push(gA.append('rect').attr('fill', CYAN).node() as SVGRectElement);
				}

				const track = (g: typeof gA) =>
					g
						.append('rect')
						.attr('fill', 'none')
						.attr('stroke', LINE)
						.attr('stroke-width', 1)
						.attr('rx', 2)
						.node() as SVGRectElement;
				const fill = (g: typeof gA, color: string) =>
					g.append('rect').attr('fill', color).attr('rx', 2).node() as SVGRectElement;

				const weekTrackA: SVGRectElement[] = [];
				const weekFillA: SVGRectElement[] = [];
				const weekTrackB: SVGRectElement[] = [];
				const weekFillB: SVGRectElement[] = [];
				for (let j = 0; j < WEEKS; j++) {
					weekTrackA.push(track(gA));
					weekFillA.push(fill(gA, CYAN));
					weekTrackB.push(track(gB));
					weekFillB.push(fill(gB, RED));
				}

				type Lane = {
					lessonY: number;
					lessonH: number;
					weekY: number;
					weekH: number;
				};

				/**
				 * Hand-computed lane geometry: lesson region, then week bar.
				 *
				 * The vertical rhythm is still expressed in terms of `fs`, the label
				 * size, even though this SVG no longer draws labels (see the no-text
				 * note above): `lead` is the space above the lesson box and the
				 * `fs + 9` term is the space between that box and the week bar. Every
				 * coordinate returned below is numerically IDENTICAL to the version
				 * that drew its own captions — only the two caption baselines were
				 * removed — so the proportions verified across widths still hold.
				 */
				const laneAt = (y0: number, laneH: number, fs: number): Lane => {
					const lead = fs + 5;
					const weekH = Math.max(12, laneH * 0.2);
					const lessonH = Math.max(14, laneH - lead - (fs + 5) - 5 - weekH);
					return {
						lessonY: y0 + lead,
						lessonH,
						weekY: y0 + lead + lessonH + fs + 9,
						weekH
					};
				};

				// Placeholder only: layout() overwrites this before paint is ever exposed.
				// It exists so paintAt() has a definitely-assigned lane to read.
				let laneA = laneAt(M.top, 100, 11);
				let lastP = 1;

				const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
				/** Normalised position of `p` inside the window [a, b]. */
				const win = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
				/** Per-item 0..1 within a staggered sweep: item i starts later than item i-1. */
				const step = (u: number, i: number, n: number, spread: number) =>
					clamp01((u - (i / Math.max(1, n - 1)) * (1 - spread)) / spread);

				function paintAt(p: number) {
					lastP = p;

					const uTicks = win(p, 0, 0.55);
					const base = laneA.lessonY + laneA.lessonH;
					for (let i = 0; i < TICKS; i++) {
						const t = step(uTicks, i, TICKS, 0.22);
						const h = laneA.lessonH * (0.3 + 0.7 * t);
						const el = tickNodes[i];
						el.setAttribute('y', String(base - h));
						el.setAttribute('height', String(h));
						el.setAttribute('opacity', t.toFixed(3));
					}

					const uWeekA = win(p, 0.35, 0.7);
					const uWeekB = win(p, 0.7, 1);
					for (let j = 0; j < WEEKS; j++) {
						weekFillA[j].setAttribute('opacity', step(uWeekA, j, WEEKS, 0.4).toFixed(3));
						weekFillB[j].setAttribute('opacity', step(uWeekB, j, WEEKS, 0.4).toFixed(3));
					}
				}

				function layout() {
					if (!host) return;
					const w = Math.max(240, host.clientWidth || 240);
					const h = wideMq.matches ? height : compactHeight;
					const innerW = Math.max(120, w - M.left - M.right);
					const fs = w < 420 ? 10 : 11;
					const laneGap = Math.max(14, h * 0.08);
					const laneH = (h - M.top - M.bottom - laneGap) / 2;

					laneA = laneAt(M.top, laneH, fs);
					const laneB = laneAt(M.top + laneH + laneGap, laneH, fs);
					const pitch = innerW / TICKS;
					const tickW = Math.max(1, Math.min(3.5, pitch * 0.52));
					const weekGap = Math.max(2, innerW * 0.006);
					const weekW = (innerW - weekGap * (WEEKS - 1)) / WEEKS;

					svg.attr('height', h).attr('viewBox', `0 0 ${w} ${h}`);

					// Both lesson regions get the SAME outline: identical box, one full of
					// ticks, one empty. That equivalence is what makes the void legible.
					const box = (node: SVGRectElement, lane: Lane) => {
						node.setAttribute('x', String(M.left - 2));
						node.setAttribute('y', String(lane.lessonY - 2));
						node.setAttribute('width', String(innerW + 4));
						node.setAttribute('height', String(lane.lessonH + 4));
					};
					box(outlineA, laneA);
					box(outlineB, laneB);

					for (let i = 0; i < TICKS; i++) {
						tickNodes[i].setAttribute('x', String(M.left + i * pitch + (pitch - tickW) / 2));
						tickNodes[i].setAttribute('width', String(tickW));
					}

					for (let j = 0; j < WEEKS; j++) {
						const x = String(M.left + j * (weekW + weekGap));
						const setBlock = (node: SVGRectElement, lane: Lane) => {
							node.setAttribute('x', x);
							node.setAttribute('y', String(lane.weekY));
							node.setAttribute('width', String(weekW));
							node.setAttribute('height', String(lane.weekH));
						};
						setBlock(weekTrackA[j], laneA);
						setBlock(weekFillA[j], laneA);
						setBlock(weekTrackB[j], laneB);
						setBlock(weekFillB[j], laneB);
					}

					paintAt(lastP);
				}

				relayout = layout;
				layout();

				ro = new ResizeObserver(() => layout());
				ro.observe(host);

				paint = paintAt;
				ready = true;
			} catch (error) {
				// Fail loud, and still deliver the certified facts as text.
				console.error('[Momentum] Tape initialisation failed.', error);
				failed = true;
			}
		})();

		return () => {
			disposed = true;
			motionMq.removeEventListener('change', onMotion);
			wideMq.removeEventListener('change', onWide);
			ro?.disconnect();
			io?.disconnect();
			removeSvg?.();
			paint = undefined;
			relayout = undefined;
			painted = false;
			ready = false;
		};
	});
</script>

<div class="mo-tape">
	<div
		class="mo-tape__host"
		class:is-failed={failed}
		style:--mo-tape-h="{height}px"
		style:--mo-tape-h-compact="{compactHeight}px"
		{@attach captureHost}
	></div>

	{#if failed}
		<!-- The figure could not be drawn. The facts it draws are stated instead;
		     nothing about the comparison is lost, only its shape. -->
		<ul class="mo-tape__fallback">
			<li>{ledger.fragments.lessons}</li>
			<li>{ledger.fragments.includesLive}</li>
			<li>{ledger.fragments.weekly}</li>
			<li>{ledger.fragments.noModules}</li>
		</ul>
	{/if}
</div>

<style>
	.mo-tape {
		width: 100%;
	}

	/* Height is reserved in CSS, not JS, so the server-rendered box already has the
	   right size and the figure cannot shift layout when d3 lands. The two custom
	   properties carry the props' pixel values in. */
	.mo-tape__host {
		width: 100%;
		height: var(--mo-tape-h-compact);
	}

	/* 1024px = the repo's canonical laptop breakpoint (app.css:60-66). */
	@media (min-width: 1024px) {
		.mo-tape__host {
			height: var(--mo-tape-h);
		}
	}

	.mo-tape__host.is-failed {
		height: 0;
		overflow: hidden;
	}

	.mo-tape__fallback {
		display: grid;
		gap: 0.4rem;
		margin: 0;
		padding: 0;
		list-style: none;
		/* INHERITED from the repo design system: --mo-desc is the reference's own
		   .entry-content p colour, and --fs-body is app.css's body step. */
		color: var(--mo-desc);
		font-size: var(--fs-body);
	}
</style>
