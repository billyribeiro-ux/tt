<script lang="ts">
	/**
	 * /momentum — BEAT 3 · LEDGER.
	 *
	 * The one place the page argues rather than states, and it argues using
	 * nothing but certified strings. Every word rendered here is a verbatim
	 * fragment of one of the two captured offer descriptions, imported from
	 * data/content.ts:
	 *
	 *   "Over 129 Video Lessons"                        pretty.html:7518
	 *   "INCLUDES one 8 week round of live trading"     pretty.html:7518-7519
	 *   "Once a week for 8 weeks"                       pretty.html:7592-7593
	 *   "DOES NOT INCLUDE MOMENTUM MODULES"             pretty.html:7593
	 *
	 * FORBIDDEN AND ABSENT: totals, percentages, differences, "value", prices,
	 * cohort dates, module or lesson titles, comparison adjectives, and the
	 * unsourced 15 / 115 / 14 / $597 figures. Re-verified in this pass by reading
	 * the whole file: the only numerals that reach the DOM are inside the four
	 * certified fragments above and the section counter. No number is animated
	 * through intermediate counts — 129 is a stated FLOOR ("Over 129"), so a
	 * counter would briefly assert figures the evidence does not support. The
	 * TICKS in the D3 figure are the animated quantity; the strings stay static.
	 *
	 * THE BAND. This section sits on the page ground, --tt-black. The reference
	 * has no counterpart for it (it is this build's own figure), so there is no
	 * captured colour to honour; the choice is compositional and is stated here so
	 * the next reader knows it was a decision and not an omission. Two reasons it
	 * is dark rather than light: (1) it follows the page's single WHITE band —
	 * Voice — so returning to black is what makes that band read as one deliberate
	 * cut rather than as the start of a light half; (2) every colour in this
	 * section and in MomentumTape is authored for a dark ground. --mo-cyan
	 * (#05dafa) is 11.70:1 on --tt-black and about 1.4:1 on white, so a light band
	 * here would not be a background swap, it would be a full re-specification of
	 * a figure this component does not own.
	 *
	 * MOTION OWNERSHIP, stated so nothing collides.
	 * MomentumTape's `progress` prop is fully CONTROLLED by its caller, and this
	 * section is the only component that renders it — so the scrub has to live
	 * here. The scrub is created only at >=1024px and only when motion is allowed;
	 * in every other case `progress` stays at 1 and the tape renders complete,
	 * which is the honest default.
	 *
	 * Below 1024px the entrance is now a CSS SCROLL-DRIVEN ANIMATION rather than a
	 * GSAP reveal() — see the note in the style block. That removes this section's
	 * second ScrollTrigger and its main-thread scroll work on exactly the devices
	 * least able to afford them.
	 *
	 * NO PIN IS CREATED, HERE OR ANYWHERE. The direction brief specifies a pinned
	 * ScrollTrigger on #ledger (start 'top top', end '+=120%', scrub 0.8) as this
	 * page's one pinned beat. It is not implemented: neither this file nor
	 * Director.svelte creates one, and a browser check at 1440x900 measured zero
	 * `.pin-spacer` elements on the rendered page.
	 *
	 * It is also not safe to add as briefed at the sizes actually measured. A pin
	 * anchored at 'top top' holds the section against the top of the viewport, so
	 * anything taller than the viewport is unreachable for the whole pin. Measured
	 * in the browser: this section is 940px tall at 1440x900 and still 940px at
	 * 1440x700, i.e. 40px and 240px past the fold respectively — the provenance
	 * line, and at the shorter height part of the tape, would sit off-screen and
	 * un-scrollable for the entire pinned range. Implementing the brief's pin
	 * therefore needs an owner decision about the section's height budget first;
	 * it is logged as an open gap in TODO.md rather than guessed at here.
	 */
	import type { Attachment } from 'svelte/attachments';
	import { MediaQuery } from 'svelte/reactivity';
	import { prefersReducedMotion } from '$lib/motion';
	import { ensureGsap } from '$lib/pages/momentum/motion/gsap-setup';
	import { ledger } from '$lib/pages/momentum/data/content';
	import MomentumTape from '$lib/pages/momentum/viz/MomentumTape.svelte';

	/**
	 * 1024px is the repo's canonical laptop breakpoint (app.css:60-66).
	 *
	 * MediaQuery (svelte/reactivity, since 5.7.0) rather than a hand-rolled
	 * $effect + matchMedia listener: it is SSR-safe via its explicit server
	 * fallback, it reads its value synchronously on the client at component init
	 * (so the scrub attachment is never created and then torn down one tick
	 * later during hydration), and it needs no manual listener teardown.
	 */
	const desktop = new MediaQuery('min-width: 1024px', false);

	/**
	 * 0..1, handed to MomentumTape. 1 = the completed figure, which is what a
	 * reduced-motion visitor, a narrow viewport and a no-JS render all get.
	 */
	let progress = $state(1);

	/**
	 * The scrub. This one stays on GSAP deliberately: it does not animate a CSS
	 * property, it drives a Svelte state value that a D3 component reads to decide
	 * how many <rect> ticks to print. A CSS scroll timeline cannot reach into
	 * component state, so there is nothing to convert here.
	 *
	 * Written as an attachment rather than an $effect so its lifecycle is the
	 * element's: it is torn down and rebuilt automatically when the viewport
	 * crosses 1024px, and the cleanup restores the completed figure.
	 *
	 * Reduced motion is read DIRECTLY off matchMedia via prefersReducedMotion()
	 * rather than through the page's ui store — a section can mount before the
	 * route's $effect has synced that store.
	 */
	function ledgerScrub(enabled: boolean): Attachment<HTMLElement> {
		return (node) => {
			if (!enabled || prefersReducedMotion()) return;
			const gsap = ensureGsap();
			// Start empty, so the ticks have somewhere to print from. Set before the
			// tape's dynamic d3 import can resolve, so there is no complete-then-empty
			// flash on first paint.
			progress = 0;
			const proxy = { p: 0 };
			const ctx = gsap.context(() => {
				gsap.to(proxy, {
					p: 1,
					ease: 'none',
					scrollTrigger: {
						trigger: node,
						start: 'top 72%',
						end: 'bottom 62%',
						scrub: 0.8
					},
					onUpdate: () => {
						progress = proxy.p;
					}
				});
			}, node);
			return () => {
				ctx.revert();
				progress = 1;
			};
		};
	}
</script>

<section id="ledger" class="mo-section mo-ledger-band" {@attach ledgerScrub(desktop.current)}>
	<div class="mo-wrap">
		<!-- The site's shared section-head trio. `.idx` and `.rule` have no rules
		     outside a `.section-head` ancestor, so the wrapper is required.
		     No kicker text: none is evidenced for this section.

		     aria-hidden matches Paths.svelte's head, whose content is identical in
		     kind — a bare counter plus a rule, with no captured copy. Without it a
		     screen reader announced a counter on one of the two sections and
		     nothing on the other.

		     THE DENOMINATOR IS 02: this page renders exactly two indexed section
		     heads, Paths' and this one. See the note at Paths.svelte's head. -->
		<div class="section-head" aria-hidden="true">
			<span class="idx">02 / 02</span>
			<span class="rule"></span>
		</div>

		<div class="mo-ledger">
			<div class="mo-ledger__lanes">
				<!-- Lane A · the course. Cyan, because momentum-course-1920.png
				     accents in cyan (#05dafa measured) and contains no red. -->
				<div class="mo-ledger__lane mo-ledger__lane--course">
					<h2 class="mo-ledger__figure">{ledger.fragments.lessons}</h2>
					<p class="mo-ledger__note">{ledger.fragments.includesLive}</p>
				</div>

				<!-- Lane B · the live round. Red, because momentum-live-1280.png
				     carries a red ON AIR badge and contains no cyan. -->
				<div class="mo-ledger__lane mo-ledger__lane--live">
					<h2 class="mo-ledger__figure">{ledger.fragments.weekly}</h2>
					<p class="mo-ledger__note">{ledger.fragments.noModules}</p>
				</div>
			</div>

			<!-- The figure. Its own `height`/`compactHeight` defaults are already the
			     briefed 260 / 200, so nothing is passed but the scrub value. -->
			<MomentumTape {progress} />

			<!-- What the 129 is made of. This is the ONLY block on the page sourced
			     from a capture other than /momentum's own, so it is visibly attributed
			     to the course page it came from rather than presented as if the
			     /momentum capture stated it. Figures verbatim from
			     docs/momentum-reference/live-momentum-course.txt:49-65.

			     The heading is a real <h3> rather than a styled span: it labels the
			     list that follows, and the list is a <dl> because each row is a
			     figure paired with what the figure counts. -->
			<div class="mo-ledger__breakdown">
				<h3 class="label mo-ledger__breakdown-head">{ledger.breakdown.heading}</h3>
				<dl class="mo-ledger__breakdown-list">
					{#each ledger.breakdown.items as item (item.label)}
						<div class="mo-ledger__breakdown-item">
							<dt class="mo-ledger__breakdown-figure">{item.figure}</dt>
							<dd class="mo-ledger__breakdown-label">{item.label}</dd>
						</div>
					{/each}
				</dl>
				<p class="mo-ledger__breakdown-included">{ledger.breakdown.included}</p>
			</div>

			<!-- Functional provenance, not a claim: the repo visibly discloses what
			     a figure represents (EEGWaveform.svelte:205,
			     BioMarketMonitor.svelte:537-540). -->
			<p class="label mo-ledger__provenance">{ledger.provenance}</p>
		</div>
	</div>
</section>

<style>
	/* THE BAND, declared rather than inherited so the page's light/dark score is
	   authored in the sections that make it up and not left to look accidental.
	   The value is the repo ground token, the same one `.mo-scope` already sets;
	   the reasoning for choosing dark here is in the component header. */
	.mo-ledger-band {
		background: var(--tt-black);
	}

	.mo-ledger {
		display: flex;
		flex-direction: column;
		gap: clamp(2rem, 5vw, 3.5rem);
	}

	/* ------------------------------------------------------------------------
	   THE SMALL-SCREEN ENTRANCE — a CSS scroll-driven animation.

	   This replaces a GSAP reveal({ y: 28 }) that ran only below 1024px. It is a
	   single element's progress against the scroller, which is exactly what a
	   scroll timeline expresses, and running it off the main thread matters most
	   on the phones that got it.

	   BASELINE (verified 12 Aug 2026): scroll-driven animations are Baseline
	   LIMITED — Chrome 115+ and Safari 26+ ship them, Firefox does not (it keeps
	   them behind layout.css.scroll-driven-animations.enabled, Nightly only), so
	   this is the ADOPT-WITH-FALLBACK path.

	   MODERN PATH  — everything inside @supports (animation-timeline: view()).
	   FALLBACK PATH — no declaration at all, so Firefox and every older engine
	                   render `.mo-ledger` in its final state, fully opaque and in
	                   position, from first paint. The animation is never the only
	                   path to the content.

	   The @supports wrapper is not decoration: MDN warns that Firefox drops the
	   `animation-timeline` declaration but KEEPS the `animation` shorthand, so an
	   unguarded rule would play these keyframes once as an ordinary time-based
	   animation on load. Same reason `animation-timeline` is written AFTER the
	   shorthand — declared before it, the shorthand's `auto` resets it.

	   1023.98px rather than 1023px so there is no fractional-width sliver between
	   this rule and the MediaQuery('min-width: 1024px') that gates the scrub. */
	@keyframes mo-ledger-rise {
		from {
			opacity: 0;
			translate: 0 28px;
		}
		to {
			opacity: 1;
			translate: 0 0;
		}
	}

	@media (max-width: 1023.98px) and (prefers-reduced-motion: no-preference) {
		@supports (animation-timeline: view()) {
			.mo-ledger {
				animation: mo-ledger-rise linear both;
				animation-timeline: view();
				animation-range: entry 8% entry 62%;
			}
		}
	}

	/* Stacked on phones, side by side from the tablet breakpoint up — the same
	   two-column reading the visitor just met in Paths, so the colour coding
	   carries over. Breakpoint and gap INHERITED from app.css:60-66; the
	   reference has no counterpart section, so it specifies neither. */
	.mo-ledger__lanes {
		display: grid;
		gap: clamp(1.75rem, 4vw, 3rem);
	}

	.mo-ledger__lane {
		padding-top: clamp(1rem, 2vw, 1.4rem);
		border-top: 1px solid var(--tt-line);
	}

	/* Accent hairlines. A non-text UI edge is the only role this page permits a
	   low-contrast brand colour. */
	.mo-ledger__lane--course {
		border-top-color: rgb(var(--mo-cyan-rgb) / 0.45);
	}

	.mo-ledger__lane--live {
		border-top-color: rgb(var(--tt-red-bright-rgb) / 0.45);
	}

	/* One honest number, set large enough to carry the section. Allerta Stencil
	   400 comes from the scope override in momentum.css (the family itself is
	   CAPTURED: the reference's astra inline CSS sets h1-h6 to "Allerta Stencil";
	   the kit asks for weight 600 at post-47277.css:1, but @fontsource/allerta-stencil
	   ships latin-400 only, so 600 would be a synthesised fake bold and 400 stands).
	   tabular-nums so 129 and 8 sit on a stable grid. */
	.mo-ledger__figure {
		margin: 0;
		font-size: var(--fs-h2);
		font-variant-numeric: tabular-nums;
		color: var(--tt-white);
	}

	/* The second fragment of each lane, in the mono voice used for data labels.
	   DELIBERATELY NOT the global `.label` utility: `.label` applies
	   text-transform: uppercase, and the source encodes its own emphasis in
	   casing — it shouts "DOES NOT INCLUDE MOMENTUM MODULES" and does not shout
	   "INCLUDES one 8 week round of live trading". Uppercasing both would erase a
	   distinction the captured copy makes on purpose. */
	.mo-ledger__note {
		margin: 0.7rem 0 0;
		font-family: var(--tt-font-mono);
		font-size: 0.78rem;
		letter-spacing: 0.08em;
		line-height: 1.6;
	}

	/* --mo-cyan is 11.70:1 on --tt-black and --tt-red-bright is 5.44:1; both pass
	   AA at this size. (--tt-red at 3.02:1 would not, which is why it never
	   appears as text on this page — only as the two buttons' fill.) */
	.mo-ledger__lane--course .mo-ledger__note {
		color: var(--mo-cyan);
	}

	.mo-ledger__lane--live .mo-ledger__note {
		color: var(--tt-red-bright);
	}

	.mo-ledger__provenance {
		margin: 0;
	}

	/* THE BREAKDOWN.
	   Sits between the figure and its provenance line, and is deliberately quieter
	   than the two lane headings above it: those carry the captured /momentum copy
	   and must stay the loudest thing in the section, while this is supporting
	   detail sourced from a different page. Hence label-scale heading, no accent
	   colour on the figures, and a hairline to separate it from the tape. */
	.mo-ledger__breakdown {
		margin-block-start: clamp(1.75rem, 4vw, 2.75rem);
		padding-block-start: clamp(1.25rem, 3vw, 1.75rem);
		border-block-start: 1px solid var(--tt-line);
	}
	.mo-ledger__breakdown-head {
		margin: 0 0 clamp(0.9rem, 2.5vw, 1.25rem);
		color: var(--tt-mute-2);
	}
	.mo-ledger__breakdown-list {
		display: grid;
		grid-template-columns: repeat(3, auto);
		justify-content: start;
		gap: clamp(1.5rem, 5vw, 3.5rem);
		margin: 0;
	}
	.mo-ledger__breakdown-item {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}
	.mo-ledger__breakdown-figure {
		font-family: var(--tt-font-display);
		font-size: clamp(1.6rem, 1.1rem + 2.2vw, 2.6rem);
		line-height: 1;
		color: var(--tt-white);
	}
	.mo-ledger__breakdown-label {
		margin: 0;
		font-size: 0.82rem;
		line-height: 1.4;
		color: var(--tt-fog);
	}
	.mo-ledger__breakdown-included {
		margin: clamp(1rem, 2.5vw, 1.4rem) 0 0;
		font-size: 0.9rem;
		color: var(--tt-fog);
	}

	@media (min-width: 768px) {
		.mo-ledger__lanes {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
