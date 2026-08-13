<script lang="ts">
	/**
	 * /momentum-course — THE HERO. Rail stop 01 (`mo-hero`).
	 *
	 * WHAT IT IS NOW, AND WHY.
	 *
	 * 1. THE ORNAMENT IS THE SYLLABUS. The scene behind this hero used to be
	 *    CorridorScene — a corridor of rails rushing at the viewer. It was
	 *    competent and it said "speed", but it did not say "trading", and this
	 *    page is a day-trading course. It is replaced on THIS ROUTE ONLY by
	 *    `viz/MomentumMarket.svelte`: a candle tape printing right to left, its
	 *    wicks, a volume row, two channel rails and a risk box that appears under
	 *    the break. Every one of those is a thing the course actually teaches —
	 *    "Trend Lines" (:221), "The Trading Channel" (:213) and "Standard Risk"
	 *    (:195) in the live capture — and the hero now NAMES them in the
	 *    `.mo-hero__syllabus` caption rather than leaving the decoration abstract.
	 *    /momentum still mounts CorridorScene; nothing there changed.
	 *
	 * 2. IT IS ONE CUT, NOT SIX FADES. The kicker, the headline, the lockup, the
	 *    lede, the CTA row, the caption and the three figures are ONE timeline
	 *    with explicit absolute positions, so the beat is composed rather than
	 *    coincidental.
	 *
	 * 3. IT WAITS FOR NOTHING. There is no intro-film handshake in this file and
	 *    none may be added back — see the block in `onMount` for what that cost
	 *    when it was here. DECORATION NEVER GATES CONTENT.
	 *
	 * 4. THE TWO SCROLL SCRUBS ARE BORN DISABLED. A scrubbed exit that is live
	 *    while the entrance is still running fights it for the same properties.
	 *    They are enabled and refreshed in the entrance's own onComplete.
	 *
	 * 5. counter() IS NOT USED ON THE FIGURES. Counting 0 -> 115 renders every
	 *    intermediate number on screen; each of those is a figure the evidence
	 *    does not contain (the rule content.ts:294-295 already states for the
	 *    Ledger's ticks). The three figures print their captured values and are
	 *    animated as objects instead.
	 *
	 * 6. NO COPY AND NO FACT IS TYPED HERE. The kicker, lockup, lede and caption
	 *    come from `courseHero`, the three figures from `ledger.breakdown.items`
	 *    and the enrolment href from `links.course` — all in
	 *    momentum/data/content.ts, each entry carrying its own locator.
	 *
	 * REDUCED MOTION. `.js` is never added to <html> (app.html:16-22), so every
	 * [data-anim] / [data-split] / [data-anim-stagger] > * element sits at its CSS
	 * resting state and is fully visible at first paint. No timeline is built, no
	 * ScrollTrigger is created, `splitReveal` sets autoAlpha 1 and returns
	 * (motion.ts:106-107), `parallax` returns (motion.ts:168) and MomentumMarket
	 * composes a single still frame. The CTA is reachable the moment the page
	 * paints, at 0ms.
	 */
	import { onMount } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import Button from '$lib/components/Button.svelte';
	import { splitReveal, parallax } from '$lib/motion';
	import LightningIcon from 'phosphor-svelte/lib/LightningIcon';
	import MomentumMarket from '$lib/pages/momentum-course/viz/MomentumMarket.svelte';
	import { courseHero, ledger, links } from '$lib/pages/momentum/data/content';
	import { ui } from '$lib/pages/momentum/state/ui.svelte';
	import { ensureGsap } from '$lib/pages/momentum/motion/gsap-setup';
	import { jumpToId } from '$lib/pages/momentum/motion/smooth-scroll';

	/**
	 * Read at INIT and OR-ed with the store, never trusting the store alone: the
	 * route's $effect is the only writer of `ui.reducedMotion` and it can run after
	 * this component initialises — the bug documented at
	 * project-alpha/viz/NeuroTradeHud.svelte:19-27.
	 */
	let systemReduced = $state(
		typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
	);
	const reduced = $derived(systemReduced || ui.reducedMotion);

	let root = $state<HTMLElement | undefined>(undefined);
	const captureRoot: Attachment<HTMLElement> = (node) => {
		root = node;
		return () => {
			if (root === node) root = undefined;
		};
	};

	onMount(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		systemReduced = mq.matches;
		const onMotion = () => (systemReduced = mq.matches);
		mq.addEventListener('change', onMotion);

		/*
		 * THE FILM HANDSHAKE WAS REMOVED HERE, AND MUST NOT COME BACK.
		 *
		 * This block listened for `mc:intro-complete`, watched for `.mc-intro` in the
		 * DOM, and carried a 3.4s failsafe — all so the hero's entrance could wait for
		 * the director's intro film. Measured, that wait left the kicker, the lede, the
		 * enrol button and the three figures at opacity 0 for up to nine seconds.
		 *
		 * Nothing needs to wait. The hero's entrance runs on mount and the film, when
		 * it plays, is a `pointer-events: none` overlay above an already-composed
		 * frame. Removing the wait also removed the failsafe, the rAF probe, the event
		 * listener and the `heroReady` flag, none of which have anything left to do.
		 * The same rule governs the new scene: MomentumMarket takes NO props and
		 * exposes no ready callback, precisely so there is nothing here to gate on.
		 */

		return () => mq.removeEventListener('change', onMotion);
	});

	/**
	 * THE ENTRANCE.
	 *
	 * Every tween is a fromTo with `immediateRender: false`, which is what lets the
	 * CSS gate (`.js [data-anim] { opacity: 0 }`, app.css:210-215) hold each
	 * element invisible until its own beat starts instead of GSAP flashing an end
	 * state first.
	 *
	 * THE CLOCK IS NOT WALL TIME, AND THAT IS THE WHOLE REASON THESE NUMBERS LOOK
	 * EARLY. CourseDirector.svelte:217 sets `gsap.globalTimeline.timeScale(0.86)`
	 * for the life of this page, so one timeline second is 1.163 wall seconds.
	 * Positions below are timeline seconds; the wall time each beat LANDS at is in
	 * brackets. The budget that matters is the enrol button, which is this page's
	 * conversion point:
	 *
	 *   0.00  .mo-hero__bg      opacity + scale 1.04->1, d 0.90   [0    -> 1.05]
	 *   0.05  .mo-hero__kicker  opacity + y18,           d 0.46   [0.06 -> 0.59]
	 *   0.20  h1                splitReveal, d 0.80, stagger 0.03 [0.23 -> 1.16]
	 *   0.30  .mo-hero__sub     opacity + y14,           d 0.50   [0.35 -> 0.93]
	 *   0.38  .mo-hero__lede    opacity + y22,           d 0.55   [0.44 -> 1.08]
	 *   0.50  .mo-hero__cta > * opacity + y16, d 0.44, stag 0.06  [0.58 -> 1.16]
	 *   0.62  .mo-hero__syllabus opacity,      d 0.50             [0.72 -> 1.30]
	 *   0.70  .mo-hero__stat    opacity + clipPath, d 0.62        [0.81 -> 1.70]
	 *
	 * The enrol button is the CTA row's FIRST child. The previous cut started the
	 * CTA at 0.62 TIMELINE seconds, i.e. 1.36s wall; its comment claimed "~1.2s"
	 * because it read its own numbers as wall time and ignored the 0.86 timeScale.
	 *
	 * MEASURED, NOT ASSERTED. `vite build` + `vite preview`, Chromium, polling
	 * `getComputedStyle('#mo-hero .mo-hero__cta .btn').opacity` every 40ms from
	 * navigation, intro film skipped via sessionStorage as a returning visitor's
	 * would be:
	 *      1440x720  opacity 1.00 at 1031ms
	 *      1280x700  opacity 1.00 at  958ms
	 *       390x844  opacity 1.00 at  955ms
	 *      1440x720 prefers-reduced-motion: reduce — 41ms (no timeline is built)
	 * All inside the ~1.2s budget. Re-measure the same way after any change to a
	 * position or duration above; do not re-derive it on paper.
	 *
	 * ⚠ THOSE ABSOLUTES ARE MACHINE NUMBERS, SO MEASURE THE GAP, NOT THE CLOCK.
	 * Re-run on a loaded machine (load average 14, headless Chromium forced onto
	 * the SwiftShader software rasteriser) the SAME build reported first
	 * contentful paint at 2.13s, which is more than the whole budget spent before
	 * a pixel exists. What held there, and what is worth asserting, is the
	 * DIFFERENCE: the enrol button reached opacity 1 within 48ms of FCP at
	 * 1440x900 (2132 -> 2180), 65ms at 1280x700 (2144 -> 2209) and 51ms at 390x844
	 * (1340 -> 1391), and at 31-42ms flat with reduced motion. The entrance is
	 * therefore never the thing the visitor is waiting for — paint is. If a future
	 * run shows the button landing hundreds of milliseconds AFTER first paint,
	 * that is a real regression in this timeline; a large absolute with a small
	 * gap is the machine.
	 *
	 * The h1 is NOT in this timeline. It is the LCP element and it reveals on
	 * mount through its own `splitReveal` attachment, so it can never be delayed
	 * by anything composed here. One writer per element.
	 */
	$effect(() => {
		if (reduced || !root) return;

		const gsap = ensureGsap();
		const el = root;

		const ctx = gsap.context(() => {
			const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

			tl.fromTo(
				'.mo-hero__bg',
				{ opacity: 0, scale: 1.04 },
				{ opacity: 1, scale: 1, duration: 0.9, immediateRender: false },
				0
			)
				.fromTo(
					'.mo-hero__kicker',
					{ opacity: 0, y: 18 },
					{ opacity: 1, y: 0, duration: 0.46, immediateRender: false },
					0.05
				)
				// 0.20 -> 1.00 belongs to the h1: `splitReveal` owns it, attached
				// below with the matching delay.
				.fromTo(
					'.mo-hero__sub',
					{ opacity: 0, y: 14 },
					{ opacity: 1, y: 0, duration: 0.5, immediateRender: false },
					0.3
				)
				.fromTo(
					'.mo-hero__lede',
					{ opacity: 0, y: 22 },
					{ opacity: 1, y: 0, duration: 0.55, immediateRender: false },
					0.38
				)
				.fromTo(
					'.mo-hero__cta > *',
					{ opacity: 0, y: 16 },
					{ opacity: 1, y: 0, duration: 0.44, stagger: 0.06, immediateRender: false },
					0.5
				)
				.fromTo(
					'.mo-hero__syllabus',
					{ opacity: 0 },
					{ opacity: 1, duration: 0.5, ease: 'power2.out', immediateRender: false },
					0.62
				)
				// The caption's hairline draws itself left to right on the same beat as
				// the caption it marks. Its CSS resting state is the drawn rule, so with
				// motion disabled it is simply there — no tween, nothing missing.
				.fromTo(
					'.mo-hero__mark',
					{ scaleX: 0 },
					{ scaleX: 1, duration: 0.55, immediateRender: false },
					0.62
				)
				.fromTo(
					'.mo-hero__stat',
					{ opacity: 0, clipPath: 'inset(0 0 100% 0)' },
					{
						opacity: 1,
						clipPath: 'inset(0 0 0% 0)',
						duration: 0.62,
						stagger: 0.07,
						immediateRender: false
					},
					0.7
				);

			/* The two scrubbed exits. Created disabled so they cannot claim
			   `.mo-hero__inner`'s y or `.mo-hero__bg`'s scale while the entrance is
			   still writing them; enabled and re-measured once it lands. */
			const copyExit = gsap.to('.mo-hero__inner', {
				yPercent: 10,
				opacity: 0.35,
				ease: 'none',
				scrollTrigger: { trigger: el, start: 'top top', end: 'bottom 12%', scrub: 1.6 }
			});
			const bgExit = gsap.to('.mo-hero__bg', {
				scale: 0.94,
				ease: 'none',
				scrollTrigger: { trigger: el, start: 'top top', end: 'bottom 12%', scrub: 1.8 }
			});
			copyExit.scrollTrigger?.disable();
			bgExit.scrollTrigger?.disable();

			tl.eventCallback('onComplete', () => {
				copyExit.scrollTrigger?.enable();
				bgExit.scrollTrigger?.enable();
				copyExit.scrollTrigger?.refresh();
				bgExit.scrollTrigger?.refresh();
			});
		}, el);

		return () => ctx.revert();
	});
</script>

<section id="mo-hero" class="mo-hero" aria-labelledby="mo-hero-title" {@attach captureRoot}>
	<!-- PAINT ORDER, and it is load-bearing: grid (texture) -> glow (the red key
	     light) -> the tape (lit BY that glow) -> the scrim (which pulls the left of
	     the frame back down to black so the type never competes with the canvas).
	     The 340px lightning glyph that used to sit here is gone: at 6% opacity it
	     read as a smudge, not an ornament. -->
	<div class="mo-hero__bg" data-anim aria-hidden="true">
		<div class="mo-hero__grid grid-bg"></div>
		<div class="mo-hero__glow" {@attach parallax(120)}></div>
		<!-- No props, deliberately. MomentumMarket has exactly one consumer and
		     exposes no readiness callback, so there is nothing here that could
		     re-grow into the nine-second gate documented in `onMount`. -->
		<MomentumMarket />
		<div class="mo-hero__scrim"></div>
	</div>

	<div class="tt-container mo-hero__inner">
		<p class="eyebrow mo-hero__kicker" data-anim>
			<LightningIcon size={16} weight="fill" aria-hidden="true" />{courseHero.kicker}
		</p>

		<!-- THE LCP ELEMENT, AND IT IS GATED ON NOTHING. This h1 was once attached
		     only once the intro film's `mc:intro-complete` handshake landed, and
		     `.js [data-split]` (app.css:216) holds a split heading at opacity 0 until
		     its attachment runs — so the largest contentful paint could not happen
		     until the film ended plus the delay plus the reveal. Measured on the
		     production build that was LCP 4380-4872ms, Google's "poor" band; with the
		     film skipped via sessionStorage the same page measured 1868ms. The film
		     was the entire cost.
		     The reveal starts on mount and plays underneath the overlay, so the film
		     wipes away to disclose a frame that is already composed.
		     RE-MEASURED after the scene swap, on `vite build` + `vite preview` with
		     the film skipped: the LCP entry resolves to this heading's own text node
		     (`SPAN.mo-hero__word`) at 1288ms / 1440x720 and 1280ms / 1280x700, with
		     the WebGL tape mounted behind it — so a canvas in the background did not
		     take the LCP and the budget survives the swap. At 390x844 the LCP is the
		     lede instead, simply because a phone's h1 is smaller than its paragraph;
		     that is a size fact, not a regression. -->
		<h1
			id="mo-hero-title"
			class="mo-hero__title"
			data-split
			{@attach splitReveal({ stagger: 0.03, delay: 0.2, duration: 0.8 })}
		>
			<span class="mo-hero__word">Momentum.</span>
		</h1>

		<!-- The live course page's own lockup, VERBATIM (content.ts courseHero.subhead,
		     live-momentum-course.txt:47). It is rendered nowhere else in this repo, and
		     it is NOT the same string as the wordmark PNG's alt text — see the warning
		     on the export before "fixing" either one. -->
		<p class="mo-hero__sub" data-anim>{courseHero.subhead}</p>

		<div class="mo-hero__foot">
			<p class="mo-hero__lede prose" data-anim>{courseHero.lede}</p>

			<div class="mo-hero__cta" data-anim-stagger>
				<Button href={links.course}>Enroll in Momentum</Button>
				<a class="mo-hero__link" href="#mo-scope" onclick={(e) => jumpToId(e, 'mo-scope')}>
					What’s inside
				</a>
			</div>

			<!-- The base rail: the caption that names the scene, then the three
			     certified figures, sharing one hairline and one block of space.
			     Unrelated to CourseDirector's `.mc-rail`; Svelte scopes both. -->
			<div class="mo-hero__rail">
				<!-- Names what the tape behind this hero is drawing, in the course's own
				     words. Static — no cycling, no marquee. The separators are decorative
				     and hidden, so the line is announced as three lesson titles.
				     Each separator lives INSIDE the item it precedes rather than beside
				     it. Measured at 390px the line wraps to two, and as its own flex item
				     the middle "·" was left stranded at the end of line one against the
				     container edge; nested, it wraps down with the title it belongs to. -->
				<p class="mo-hero__syllabus" data-anim>
					<span class="mo-hero__mark" aria-hidden="true"></span>
					{#each courseHero.sceneTopics as topic, i (topic)}
						<span class="mo-hero__topic">
							{#if i > 0}<span class="mo-hero__sep" aria-hidden="true">·</span>{/if}{topic}
						</span>
					{/each}
				</p>

				<!-- The three certified figures, printed exactly as captured
				     (content.ts:342-349): "15 Modules", "115 Video Lessons",
				     "14 Bonus Lessons". Printed, never counted. -->
				<dl class="mo-hero__stats" data-anim-stagger>
					{#each ledger.breakdown.items as item, i (item.label)}
						<div class="mo-hero__stat" class:mo-hero__stat--ruled={i > 0}>
							<dt class="num mo-hero__stat-n">{item.figure}</dt>
							<dd class="mo-hero__stat-l">{item.label}</dd>
						</div>
					{/each}
				</dl>
			</div>
		</div>
	</div>
</section>

<style>
	/* SIX VALUES IN THIS FILE GOT TIGHTER, AND THEY WERE TIGHTENED TOGETHER
	   AGAINST A MEASURED TARGET, not one at a time by eye. The lockup and the
	   caption add ~96px of type to this hero, which pushed the three certified
	   figures through the fold and cut the numerals in half at 1440x720. Rather
	   than cut a beat out of the composition — the brief's own instruction — the
	   rhythm gives it back:
	       .mo-hero            top-pad ceiling  5rem  -> 4rem
	       .mo-hero__title     margin-top       1.4   -> 1rem
	       .mo-hero__foot      gap ceiling      2.6   -> 1.75rem
	       .mo-hero__foot      margin ceiling   2.6   -> 1.8rem
	       .mo-hero__rail      padding-top      1.8   -> 1.1rem  (was on __stats)
	       .mo-hero__stat-l    margin-top       0.4   -> 0.3rem
	   MEASURED AFTER, at 1440x720 / 1280x700 / 1024x768 / 768x1024 / 390x844: the
	   enrol button and all three figures WITH their labels are inside the fold at
	   every one. The top-pad ceiling only bites above ~1067px, where 6vw exceeds
	   4rem; narrower than that `6vw` is still the operative term. */
	.mo-hero {
		position: relative;
		overflow: clip;
		padding-top: calc(var(--tt-header-h) + clamp(2.5rem, 6vw, 4rem));
		padding-bottom: clamp(3.5rem, 6vw, 6rem);
	}
	.mo-hero__bg {
		position: absolute;
		inset: 0;
		z-index: 0;
	}
	.mo-hero__grid {
		position: absolute;
		inset: -12% 0 0;
		opacity: 0.4;
	}
	.mo-hero__glow {
		position: absolute;
		top: -18%;
		right: -14%;
		width: 68vw;
		height: 68vw;
		max-width: 860px;
		max-height: 860px;
		background: radial-gradient(circle, rgb(var(--tt-red-rgb) / 0.42), transparent 62%);
		filter: blur(24px);
	}

	/* THE SCRIM. Belt and braces for type contrast over the canvas: MomentumMarket
	   already masks its own wrapper so the tape contributes almost nothing left of
	   the headline, and this pulls whatever is left back down toward the page
	   ground on the copy side.
	   The COLOUR is a captured token (--tt-black, app.css:23) and stays one flat
	   token; the RAMP lives in a mask, whose #000/transparent stops are ALPHA
	   rather than a colour — the same idiom `.grid-bg` uses (app.css:292-293).
	   Keeping the ramp out of the background is what stops the token being retyped
	   as raw channels, which is exactly how a colour rots. 0.78 rather than 1 so
	   the grid texture survives underneath the headline.
	   THE STOPS WERE SET ON A SCREENSHOT OF THE BUILT PAGE, NOT COMPUTED. Two
	   earlier pairs were arithmetic and both were wrong: 32%/74% was derived from
	   container widths, and 46%/80% from the measured headline extent. The second
	   still failed on screen — the tape printed candles straight across the "um."
	   of Momentum, because a percentage in a 100deg gradient runs along the
	   GRADIENT LINE (~1557px on a 1440x800 box), not along x, so an x-derived
	   number lands somewhere else entirely.
	   What IS measured, and worth keeping: the right edge of the h1's own text
	   ("Momentum.", not its full-width box) sits at 69.0% of the viewport at 1440,
	   65.3% at 1280, 65.6% at 1024, 71.1% at 768, 88.2% at 390. The direction
	   brief's estimate of a "~58% h1 right edge" is not one of those and should
	   not be reused.
	   60%/88% holds the ground black across every desktop headline edge and hands
	   over exactly where MomentumMarket's own wrapper mask reaches full strength
	   (transparent 26% -> #000 62%, MomentumMarket.svelte:1209-1210). The two agree
	   that nothing prints before ~62%, so the tape emerges out of the dark instead
	   of starting mid-air — which is the better shot as well as the legible one. */
	.mo-hero__scrim {
		position: absolute;
		inset: 0;
		background: var(--tt-black);
		opacity: 0.78;
		-webkit-mask-image: linear-gradient(100deg, #000 0%, #000 60%, transparent 88%);
		mask-image: linear-gradient(100deg, #000 0%, #000 60%, transparent 88%);
	}

	.mo-hero__inner {
		position: relative;
		z-index: 1;
	}
	.mo-hero__kicker {
		gap: 0.5rem;
	}

	/* ⛔ font-size / font-weight / line-height / letter-spacing / colour below are
	   COPIED INTO CourseDirector.svelte:489-493, which cites this rule by line so
	   the intro film's word and the h1 it hands over to are one lockup. Changing
	   any of the five here silently breaks that match. */
	.mo-hero__title {
		margin-top: 1rem;
		font-size: var(--fs-mega);
		font-weight: 800;
		line-height: 0.86;
		letter-spacing: -0.04em;
		color: #fff;
	}
	.mo-hero__word {
		display: inline-block;
	}

	/* THE LOCKUP. Sized and measured so it is ALWAYS exactly two lines, which is
	   what makes it CLS-safe: --tt-font-display is a downloaded webfont
	   (@fontsource/allerta-stencil, +layout.svelte:10) and font-display: swap will
	   re-typeset this line after first paint. The captured string is 47 characters;
	   uppercase at 0.12em tracking it measures roughly 34em, so a 22em column
	   cannot fit it on one line and cannot need three even if the fallback face
	   measures 30% wider. `min-height` then reserves both lines up front, so the
	   swap re-wraps inside a box whose height never changes. Measured in `em`, not
	   `ch`, because `ch` is itself a font metric and would move with the swap. */
	.mo-hero__sub {
		max-width: 22em;
		margin-top: 0.9rem;
		font-family: var(--tt-font-display);
		font-size: var(--fs-body);
		line-height: 1.4;
		min-height: 2.8em;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		text-wrap: balance;
		color: var(--tt-fog);
	}

	/* Two of the six tightened values; the table on `.mo-hero` has the rest. */
	.mo-hero__foot {
		display: grid;
		gap: clamp(1.5rem, 3vw, 1.75rem);
		margin-top: clamp(1.5rem, 3.2vw, 1.8rem);
	}
	.mo-hero__lede {
		max-width: 58ch;
	}
	.mo-hero__cta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1.4rem;
	}
	.mo-hero__link {
		display: inline-flex;
		align-items: center;
		font-family: var(--tt-font-mono);
		font-size: var(--fs-eyebrow);
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--tt-fog);
		border-bottom: 1px solid transparent;
		transition:
			color 0.25s ease,
			border-color 0.25s ease;
	}
	.mo-hero__link:hover {
		color: #fff;
		border-color: var(--tt-line-strong);
	}

	/* The hairline that used to sit on `.mo-hero__stats` moved up here, so the
	   caption and the figures read as one block under one rule instead of as two
	   stacked rows separated by the grid's full gap. */
	.mo-hero__rail {
		display: grid;
		gap: 0.9rem;
		padding-top: 1.1rem;
		border-top: 1px solid var(--tt-line);
	}

	/* No height is reserved for this line and none is needed: --tt-font-mono
	   (app.css:53) resolves to ui-monospace / SFMono-Regular / Menlo — all locally
	   installed, none downloaded — so there is no swap to re-wrap it. */
	.mo-hero__syllabus {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.4rem 0.7rem;
		font-family: var(--tt-font-mono);
		font-size: var(--fs-eyebrow);
		line-height: 1.5;
		letter-spacing: 0.1em;
		color: var(--tt-mute);
	}
	/* Same shape as the site's `.section-head .rule` (app.css:249-253), in the
	   scene's own key colour instead of the neutral line token. */
	.mo-hero__mark {
		flex: none;
		width: 30px;
		height: 1px;
		background: linear-gradient(90deg, var(--tt-red-bright), transparent);
		transform-origin: left center;
	}
	/* The separator is inside its item, so the flex `gap` only spaces the item's
	   LEADING edge; this margin restores the matching space on its trailing edge
	   and keeps the three titles evenly set. */
	.mo-hero__sep {
		margin-right: 0.7rem;
		color: var(--tt-mute-2);
	}
	.mo-hero__topic {
		white-space: nowrap;
	}

	.mo-hero__stats {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 1.4rem;
		margin: 0;
	}
	.mo-hero__stat--ruled {
		padding-left: 1.4rem;
		border-left: 1px solid var(--tt-line-strong);
	}
	.mo-hero__stat-n {
		font-size: clamp(1.8rem, 1.2rem + 2.4vw, 3rem);
		font-weight: 800;
		line-height: 1;
		color: #fff;
	}
	.mo-hero__stat-l {
		margin-top: 0.3rem;
		font-size: var(--fs-eyebrow);
		letter-spacing: 0.02em;
		color: var(--tt-mute);
	}

	@media (min-width: 1024px) {
		.mo-hero__foot {
			grid-template-columns: 1.15fr 0.85fr;
			align-items: end;
		}
		.mo-hero__rail {
			grid-column: 1 / -1;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.mo-hero__link {
			transition: none;
		}
	}
</style>
