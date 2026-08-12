<script lang="ts">
	/**
	 * /momentum-course — THE ASK.
	 *
	 * This is the page's conversion point, and the one section where motion is
	 * subordinate to a single job: put the enrol button within immediate reach and
	 * never hold it off screen. So there is NO pin here and NO scrub gate on the
	 * CTA — the aperture is a one-shot `once: true` timeline on an `expo.out`
	 * curve, which puts roughly four fifths of its travel into the first quarter of
	 * its duration; the button is clear long before it is reachable.
	 *
	 * WHAT IT MAY STATE, and nothing else: 115 video lessons, 15 modules, 14 bonus
	 * lessons, and that B.O.S.S. Carbon is bundled in. Each is certified via
	 * data/content.ts (ledger.breakdown.items, content.ts:342-349, and
	 * ledger.breakdown.included, :351). NO price, NO cohort date, NO countdown, NO
	 * seat count, NO student count, NO result. Pricing is handled on the Trick
	 * Trades course page, which is what the lede says and where the button goes.
	 *
	 * TWO COPY FIXES, both toward the captured wording:
	 *   · "14 bonus sessions" -> "14 bonus lessons". The certified label is
	 *     "Bonus Lessons" (content.ts:348); "sessions" was a different product.
	 *   · "115 lessons" -> "115 video lessons", matching the certified label
	 *     "Video Lessons" (content.ts:346) exactly.
	 *
	 * THE HREF is `links.course` (content.ts:181), imported rather than retyped —
	 * the literal used to be declared separately in five files on this page.
	 *
	 * MOTION — the verb is APERTURE. The centred lockup opens from a rounded
	 * letterbox to a full frame, the kicker's rule draws out to its 40px, and the
	 * two calls to action fly in from opposite sides and lock into their row. The
	 * background glow keeps its parallax drift; the scrubbed turn it used to have
	 * was removed after it measured as 86% of the page's CLS — the measurement is
	 * recorded in full where the tween used to be.
	 *
	 * REDUCED MOTION: the attachment returns before it builds anything, so zero
	 * ScrollTriggers exist. No clip, no drift, no turn; the CTA is at rest and
	 * reachable from first paint.
	 */
	import { onMount } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import { browser } from '$app/env';
	import Button from '$lib/components/Button.svelte';
	import { splitReveal, parallax } from '$lib/motion';
	import { ui } from '$lib/pages/momentum/state/ui.svelte';
	import { ensureGsap } from '$lib/pages/momentum/motion/gsap-setup';
	import { links } from '$lib/pages/momentum/data/content';
	import { courseSectionHead } from '$lib/pages/momentum-course/motion/course-signals';
	import ArrowUpRightIcon from 'phosphor-svelte/lib/ArrowUpRightIcon';
	import '$lib/pages/momentum-course/course.css';

	/** "05 / 05" — the head that finally closes the page's numbering. */
	const head = courseSectionHead('mo-enroll');

	/**
	 * `matchMedia` is read at component INIT and OR-ed with the store, never
	 * trusted from the store alone: the route's $effect is the only writer of
	 * `ui.reducedMotion` and this component can mount before it runs — the bug
	 * documented at project-alpha/viz/NeuroTradeHud.svelte:19-27.
	 */
	let systemReduced = $state(
		browser && window.matchMedia('(prefers-reduced-motion: reduce)').matches
	);
	const reduced = $derived(systemReduced || ui.reducedMotion);

	onMount(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		// Re-read after mount: the server rendered with the `false` fallback.
		systemReduced = mq.matches;
		const onChange = () => (systemReduced = mq.matches);
		mq.addEventListener('change', onChange);
		return () => mq.removeEventListener('change', onChange);
	});

	/**
	 * The close, as one attachment on the section. Attachments run inside an
	 * effect, so reading `reduced` here means a mid-session preference flip tears
	 * every tween down through this function's cleanup and does not rebuild it.
	 */
	const aperture: Attachment<HTMLElement> = (root) => {
		if (reduced) return;

		const gsap = ensureGsap();
		const inner = root.querySelector<HTMLElement>('.mo-enroll__inner');
		const rule = root.querySelector<HTMLElement>('.mo-enroll__rule');
		/* No `glow` lookup any more: nothing in this timeline writes to it. The
		   glow's only animator is the `parallax(-60)` attachment in the markup. */
		const slots = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('.mo-enroll__slot'));

		const ctx = gsap.context(() => {
			const tl = gsap.timeline({
				defaults: { ease: 'expo.out' },
				scrollTrigger: { trigger: root, start: 'top 76%', once: true }
			});

			/* The frame opens. `clip-path` clips hit-testing as well as paint, so it
			   is removed outright on completion rather than left sitting at
			   `inset(0)` over the page's only enrol button. */
			if (inner) {
				tl.fromTo(
					inner,
					{ clipPath: 'inset(14% 6% 14% 6% round 80px)' },
					{
						clipPath: 'inset(0% 0% 0% 0% round 0px)',
						duration: 1.3,
						immediateRender: false,
						onComplete: () => gsap.set(inner, { clipPath: 'none' })
					},
					0
				);
			}

			/* The kicker's hairline draws out to the 40px its own rule declares
			   below, then hands the property back to CSS. */
			if (rule) {
				tl.fromTo(
					rule,
					{ width: 0 },
					{
						width: 40,
						duration: 0.5,
						immediateRender: false,
						onComplete: () => gsap.set(rule, { clearProps: 'width' })
					},
					0.1
				);
			}

			/* The two destinations arrive from opposite sides and lock into the row.
			   The tween targets the SLOT WRAPPERS, never the button itself: Button
			   carries magnetic(), which owns its transform, and two writers on one
			   transform is a real defect (the reason Close.svelte omits magnetic
			   entirely — Close.svelte:222-223). One writer per element instead. */
			if (slots.length) {
				tl.fromTo(
					slots,
					{
						x: (i: number) => (i === 0 ? -56 : 46),
						rotate: (i: number) => (i === 0 ? -2.5 : 2),
						opacity: 0
					},
					{
						x: 0,
						rotate: 0,
						opacity: 1,
						duration: 1,
						ease: 'expo.inOut',
						stagger: 0.08,
						immediateRender: false,
						onComplete: () => gsap.set(slots, { clearProps: 'transform,opacity' })
					},
					0.35
				);
			}

			/* THE GLOW'S SCRUBBED TURN IS GONE, AND IT IS THE ONE BEAT ON THIS PAGE
			   THAT WAS MEASURABLY NOT WORTH ITS COST.

			   It used to be `gsap.to(glow, { rotate: 14, scale: 1.28, scrub: 1 })`.
			   `.mo-enroll__glow` is `min(1300px, 124vw)` wide, `100vh` tall and
			   `filter: blur(24px)`; at 1440x900 its box measures 1891x1520. Rotating
			   that box 14deg and scaling it 1.28 grows its axis-aligned paint rect by
			   several hundred pixels in both axes, on every scroll tick, right at the
			   boundary with the next section.

			   MEASURED against the production build with a real PerformanceObserver,
			   1440x900, full-page scroll: that one tween produced a single
			   layout-shift entry of 0.10464 — identical to five decimal places on
			   every run — naming `.mo-enroll__glow` and the following `section.fbg`
			   as its sources, and it was 86% of the page's whole CLS (0.1215 total).
			   Nothing about the layout actually moved: document height 8451,
			   `#mo-enroll` height 761 and `.fbg` document offset 7251 were byte-stable
			   through the entire scroll. Containment could not suppress it —
			   `contain: paint`, `contain: strict`, `overflow: clip` on the parent,
			   `clip-path: inset(0)` and `will-change: transform` were each tested with
			   `!important` and each left the entry at exactly 0.10464.

			   The tween was invented ornament with no capture behind it (its own
			   author said so), it is a blurred gradient behind an opaque lockup, and
			   removing it is the difference between this page and its siblings:
			   /project-alpha measures 0.0032 and /momentum 0.0041.

			   `parallax(-60)` stays on the element in the markup — it writes `y` only,
			   translates rather than grows the box, and the same attachment at a
			   larger amount sits on the hero's glow without producing an entry. */
		}, root);

		return () => ctx.revert();
	};
</script>

<section
	id="mo-enroll"
	class="mc-section mo-enroll"
	aria-labelledby="mo-enroll-title"
	{@attach aperture}
>
	<div class="mo-enroll__bg" aria-hidden="true">
		<div class="mo-enroll__grid grid-bg"></div>
		<div class="mo-enroll__glow" {@attach parallax(-60)}></div>
	</div>

	<!--
		The head carries the index and the hairline but NOT a label, and that is
		deliberate: every other section's label is a word that appears nowhere else
		on it, whereas this section's word is "Enrollment" — already the centred
		kicker below. Printing it twice on one screen to satisfy a pattern would be
		worse than a head with two parts instead of three.
	-->
	<div class="tt-container mo-enroll__top">
		<div class="section-head">
			{#if head}<span class="idx">{head}</span>{/if}
			<span class="rule"></span>
		</div>
	</div>

	<div class="tt-container mo-enroll__inner">
		<p class="label mo-enroll__kicker">
			<span class="mo-enroll__rule" aria-hidden="true"></span>Enrollment
		</p>

		<h2
			id="mo-enroll-title"
			class="mo-enroll__title"
			data-split
			{@attach splitReveal({ stagger: 0.03 })}
		>
			The flagship. Coached by <span class="text-red">Pat.</span>
		</h2>

		<p class="mo-enroll__lede">
			115 video lessons, 15 modules, 14 bonus lessons and B.O.S.S. Carbon bundled in. Enrollment and
			current pricing are handled on the Trick Trades course page.
		</p>

		<div class="mo-enroll__cta">
			<span class="mo-enroll__slot">
				<Button href={links.course}>Enroll on tricktrades.com</Button>
			</span>
			<span class="mo-enroll__slot">
				<a class="mo-enroll__link" href="/day-trading-academy">
					Compare every course
					<ArrowUpRightIcon size={14} weight="bold" aria-hidden="true" />
				</a>
			</span>
		</div>
	</div>
</section>

<style>
	/* `.mc-section` (course.css) carries `position: relative` and the page's shared
	   padding-block; only what is particular to the close is declared here. */
	.mo-enroll {
		overflow: clip;
		background: var(--tt-black);
		text-align: center;
	}
	.mo-enroll__bg {
		position: absolute;
		inset: 0;
		z-index: 0;
	}
	.mo-enroll__grid {
		position: absolute;
		inset: 0;
		opacity: 0.3;
	}
	.mo-enroll__glow {
		position: absolute;
		left: 50%;
		bottom: -55%;
		width: min(1300px, 124vw);
		height: 100vh;
		transform: translateX(-50%);
		background: radial-gradient(
			ellipse 46% 60% at 50% 100%,
			rgb(var(--tt-red-bright-rgb) / 0.3),
			rgb(var(--tt-red-rgb) / 0.4) 24%,
			transparent 66%
		);
		filter: blur(24px);
	}
	/* The head sits above the background layer and outside the aperture, so the
	   page's numbering is readable while the lockup is still opening. */
	.mo-enroll__top {
		position: relative;
		z-index: 1;
	}
	.mo-enroll__inner {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		max-width: 54rem;
	}
	.mo-enroll__kicker {
		display: inline-flex;
		align-items: center;
		gap: 0.9rem;
		color: var(--tt-mute);
	}
	.mo-enroll__rule {
		width: 40px;
		height: 1px;
		background: var(--tt-red);
	}
	.mo-enroll__title {
		margin-top: 1.4rem;
		font-size: var(--fs-h2);
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.025em;
		color: #fff;
		text-wrap: balance;
	}
	.mo-enroll__lede {
		margin-top: 1.6rem;
		max-width: 52ch;
		font-size: var(--fs-lead);
		color: var(--tt-fog);
	}
	.mo-enroll__cta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 1.4rem;
		margin-top: 2.4rem;
	}
	/* The wrapper the entrance tween moves, so the button's own transform is left
	   entirely to magnetic(). It adds no box of its own. */
	.mo-enroll__slot {
		display: inline-flex;
	}
	.mo-enroll__link {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-family: var(--tt-font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--tt-fog);
		border-bottom: 1px solid transparent;
		transition:
			color 0.25s ease,
			border-color 0.25s ease;
	}
	.mo-enroll__link:hover {
		color: #fff;
		border-color: var(--tt-line-strong);
	}
	@media (prefers-reduced-motion: reduce) {
		.mo-enroll__link {
			transition: none;
		}
	}
</style>
