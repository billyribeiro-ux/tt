<script lang="ts">
	/**
	 * /momentum-course — B.O.S.S. CARBON, THE BUNDLED COURSE.
	 *
	 * WHAT CHANGED AND WHY. This section used to assert one number — "$597 value" —
	 * and say nothing about what the thing actually is. The twelve real B.O.S.S.
	 * Carbon lesson titles were already sitting captured and unused in
	 * data/content.ts (bossCarbon.lessons, cited per line at content.ts:573-586,
	 * from docs/momentum-reference/live-momentum-course.txt:89-115). A named list
	 * of twelve lessons is worth more than a price tag, so the list is now printed
	 * as real DOM text — selectable, searchable, and read by a screen reader.
	 *
	 * VERBATIM, INCLUDING THE ROUGH EDGES. "DAS" is the bare broker name as the
	 * live page prints it, and "how much $$ do you need" keeps its shorthand. The
	 * list heading is bossCarbon.heading ("FREE B.O.S.S. CARBON", content.ts:572),
	 * which is that page's own heading for exactly these twelve lessons — so the
	 * plate is labelled with captured text rather than something written here.
	 *
	 * THE ONLY FIGURE ON THIS SECTION is 597, certified via
	 * ledger.breakdown.included, "Includes B.O.S.S. Carbon ($597 value)"
	 * (content.ts:351). No Momentum price, no date, no seat count, no result.
	 *
	 * NO CANVAS HERE, DELIBERATELY. Twelve real titles must be text; a mark field
	 * standing in for them would be decoration where the product itself is the
	 * strongest thing available. The lessons are what move.
	 *
	 * MOTION — the verb is ARRIVE. One scrubbed timeline: the card irises open from
	 * a closed shutter, the twelve titles fly in from a fixed scatter and lock into
	 * their two columns, both registration marks snap in, and an exposure flash
	 * fires as the last of it lands. Everything lives in one gsap.context() created
	 * by the `arrive` attachment, so a preference flip or an unmount reverts every
	 * tween and every inline style in one call. The scene is deliberately NOT
	 * pinned; the measurement behind that is recorded at the timeline below.
	 *
	 * REDUCED MOTION: the attachment returns before it builds anything, so zero
	 * ScrollTriggers exist and there is no scrub. The card, the twelve titles, both
	 * marks and the 597 are all at their final state from first paint.
	 */
	import { onMount } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import { browser } from '$app/env';
	import { splitReveal, tilt } from '$lib/motion';
	import { ui } from '$lib/pages/momentum/state/ui.svelte';
	import { ensureGsap } from '$lib/pages/momentum/motion/gsap-setup';
	import { bossCarbon, links } from '$lib/pages/momentum/data/content';
	import { courseSectionHead } from '$lib/pages/momentum-course/motion/course-signals';
	import CubeIcon from 'phosphor-svelte/lib/CubeIcon';
	import ArrowUpRightIcon from 'phosphor-svelte/lib/ArrowUpRightIcon';
	import '$lib/pages/momentum-course/course.css';

	/** "03 / 05". Never a literal — course-signals owns the page's numbering. */
	const head = courseSectionHead('mo-boss');

	/**
	 * The one figure this section may state. CERTIFIED: content.ts:351 renders it
	 * as "Includes B.O.S.S. Carbon ($597 value)", quoted from
	 * docs/momentum-reference/live-momentum-course.txt:65.
	 *
	 * IT IS PRINTED, NEVER COUNTED. `counter(597)` used to be attached to the
	 * numeral below. It was removed after a screenshot caught the card reading
	 * "$504", and a MutationObserver over the same scroll recorded FIFTY distinct
	 * strings in that one element — "0", "14", "28", "40", "120", "146", "192",
	 * "505", "579" … — each of which is a dollar amount this page has no evidence
	 * for and is explicitly forbidden from stating. content.ts:294-295 already
	 * says so in as many words: "Never animate a number through intermediate
	 * counts (7... 43... 118) — those would assert figures the evidence does not
	 * support." MomentumHero and MomentumScope dropped counter() for exactly this
	 * reason; this was the last one on the page. The numeral now arrives as an
	 * object — it moves, it just never lies while it does.
	 */
	const BOSS_VALUE = 597;

	/**
	 * The twelve titles' entry positions, in px. Fixed rather than random: a
	 * scatter that changes on every load cannot be screenshot-compared, and this
	 * one is authored so no two neighbours travel the same way. Index-aligned with
	 * bossCarbon.lessons; the tween falls back to 0 if that list ever changes
	 * length, so a content edit degrades to a plain fade instead of an undefined.
	 */
	const SCATTER_X = [-88, 64, -52, 40, -96, 72, -44, 58, -70, 36, -60, 50];
	const SCATTER_Y = [40, -32, 52, -24, 36, -46, 28, -38, 44, -30, 48, -26];

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
	 * The whole beat, as one attachment on the section.
	 *
	 * Attachments run inside an effect, so reading `reduced` here means a
	 * mid-session preference flip tears the pin and every tween down through this
	 * function's cleanup and does not rebuild them.
	 *
	 * Every lookup is length-checked before it is tweened, so a content change
	 * that removes an element cannot throw. Every fromTo sets
	 * `immediateRender: false` — that is what stops a start state being written
	 * before the timeline is first rendered.
	 */
	const arrive: Attachment<HTMLElement> = (root) => {
		if (reduced) return;

		const gsap = ensureGsap();
		const card = root.querySelector<HTMLElement>('.mo-boss__card');
		if (!card) return;

		const lessons = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('.mo-boss__lesson'));
		const marks = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('.mo-boss__reg'));
		const amount = root.querySelector<HTMLElement>('.mo-boss__value-amt');

		const ctx = gsap.context(() => {
			/* NO PIN, AND THAT IS A MEASURED DECISION, NOT AN OMISSION.
			   The direction brief specified `pin: true` with `end: '+=110%'` and
			   allowed a plain scrubbed trigger as its fallback. Built with the pin
			   and measured in a real browser, this section is 1133px tall in a 900px
			   viewport (1128 at 1280x800, 1428 at 390x844): pinning it parks 233px —
			   the bottom third of the twelve lessons — permanently below the fold for
			   the whole 990px of the pin, so the reader is held in place watching
			   content arrive where they cannot see it. Two other beats were hidden
			   with it: the 597 count and the title's word reveal both fire before the
			   shutter opens, because their own triggers sit at the card's natural
			   position. Dropping the pin fixes all three and removes a viewport of
			   scroll from in front of the enrol CTA.

			   The trigger is the CARD, not the section, so the frame is measured
			   against the thing being framed rather than against the section padding:
			   the shutter starts closed as the card's top enters at 85% and the whole
			   arrival lands as its bottom reaches 90%, i.e. with the card composed in
			   the viewport. */
			const tl = gsap.timeline({
				defaults: { ease: 'expo.out' },
				scrollTrigger: {
					trigger: card,
					start: 'top 85%',
					end: 'bottom 90%',
					scrub: 0.9
				}
			});

			/* The shutter. `inset(50% 0 50% 0)` is a zero-height slit at the card's
			   own centre line, so the card irises open rather than fading. The
			   `round 22px` matches --tt-radius-lg (app.css:47), which is the card's
			   real border-radius — without it the clip would square the corners off
			   for the length of the tween. */
			tl.fromTo(
				card,
				{ clipPath: 'inset(50% 0% 50% 0% round 22px)' },
				{
					clipPath: 'inset(0% 0% 0% 0% round 22px)',
					duration: 0.9,
					ease: 'expo.inOut',
					immediateRender: false
				},
				0
			);

			/* The twelve real lesson titles fly in and lock into their columns. */
			if (lessons.length) {
				tl.fromTo(
					lessons,
					{
						x: (i: number) => SCATTER_X[i] ?? 0,
						y: (i: number) => SCATTER_Y[i] ?? 0,
						rotate: (i: number) => (i % 2 === 0 ? -3 : 3),
						opacity: 0
					},
					{
						x: 0,
						y: 0,
						rotate: 0,
						opacity: 1,
						duration: 1,
						stagger: 0.06,
						immediateRender: false
					},
					0.3
				);
			}

			/* The two registration marks snap square. */
			if (marks.length) {
				tl.fromTo(
					marks,
					{ scale: 0, rotate: -90 },
					{
						scale: 1,
						rotate: 0,
						duration: 0.5,
						ease: 'back.out(2.4)',
						immediateRender: false
					},
					0.55
				);
			}

			/* THE VALUE LANDS AS AN OBJECT, NOT AS A COUNT. This is what replaced
			   counter(597): the numeral is in the DOM as the single string "597"
			   from first paint and is never rewritten, so no other dollar amount
			   can ever be on screen — but it still arrives, on the same overshoot
			   MomentumScope gives its three figures. Only y and opacity are
			   written here; the `$` sits in its own span and rides with it. */
			if (amount) {
				tl.fromTo(
					amount,
					{ y: 26, opacity: 0 },
					{
						y: 0,
						opacity: 1,
						duration: 0.7,
						ease: 'back.out(2.2)',
						immediateRender: false
					},
					0.45
				);
			}

			/* The exposure flash, on the card's `filter` — a property nothing else
			   here writes, so it can never collide with the clip above or with
			   tilt()'s transform. It settles on the identity filter rather than on
			   the keyword `none`, which is not a tweenable value. */
			tl.fromTo(
				card,
				{ filter: 'brightness(1.28) saturate(1.08)' },
				{
					filter: 'brightness(1) saturate(1)',
					duration: 0.5,
					ease: 'power2.out',
					immediateRender: false
				},
				0.82
			);
		}, root);

		return () => ctx.revert();
	};
</script>

<section id="mo-boss" class="mc-section mo-boss" aria-labelledby="mo-boss-title" {@attach arrive}>
	<div class="tt-container">
		<div class="section-head">
			{#if head}<span class="idx">{head}</span>{/if}
			<span class="rule"></span>
			<span class="label mo-boss__count">Bundled inside</span>
		</div>

		<!-- tilt() owns this element's transform and nothing else writes one: the
		     timeline above animates clip-path and filter only. -->
		<article class="mo-boss__card" {@attach tilt(6)}>
			<span class="mo-boss__reg mo-boss__reg--tl" aria-hidden="true"></span>
			<span class="mo-boss__reg mo-boss__reg--br" aria-hidden="true"></span>

			<div class="mo-boss__main">
				<span class="mo-boss__icon"><CubeIcon size={26} weight="regular" aria-hidden="true" /></span
				>
				<h2
					id="mo-boss-title"
					class="mo-boss__title"
					data-split
					{@attach splitReveal({ stagger: 0.03 })}
				>
					B.O.S.S. <span class="text-red">Carbon</span>, included.
				</h2>
				<p class="mo-boss__body">
					Enrollment in Momentum comes with B.O.S.S. Carbon bundled in, sold separately as a $597
					value and yours as part of the program at no extra cost. Full details are on the course
					page.
				</p>
				<a class="mo-boss__link" href={links.course}>
					See what B.O.S.S. Carbon includes
					<ArrowUpRightIcon size={14} weight="bold" aria-hidden="true" />
				</a>
			</div>

			<!-- The certified figure, PRINTED and never counted. The comment on
			     BOSS_VALUE records the screenshot and the fifty intermediate dollar
			     strings that took counter() off this element. -->
			<div class="mo-boss__value">
				<span class="mo-boss__value-label label">Value</span>
				<p class="mo-boss__value-amt">
					<span class="mo-boss__cur">$</span><span class="num">{BOSS_VALUE}</span>
				</p>
				<span class="mo-boss__value-note">Included free</span>
			</div>

			<!--
				The twelve lessons. A real list of real text — never a canvas, never an
				image: this is the most specific, most persuasive material the bonus
				course has, and it has to be selectable and readable by assistive
				technology. The heading is the live page's own (content.ts:572).
			-->
			<div class="mo-boss__plate">
				<p class="label mo-boss__plate-label">{bossCarbon.heading}</p>
				<ul class="mo-boss__lessons">
					{#each bossCarbon.lessons as lesson (lesson)}
						<li class="mo-boss__lesson">{lesson}</li>
					{/each}
				</ul>
			</div>
		</article>
	</div>
</section>

<style>
	/* `.mc-section` (course.css) carries `position: relative` and the page's shared
	   padding-block, so neither is restated here. */
	.mo-boss__count {
		flex: none;
		color: var(--tt-mute-2);
	}
	.mo-boss__card {
		position: relative;
		display: grid;
		gap: clamp(1.8rem, 4vw, 3rem);
		padding: clamp(1.8rem, 4vw, 3.2rem);
		border: 1px solid rgb(var(--tt-red-rgb) / 0.42);
		border-radius: var(--tt-radius-lg);
		background:
			linear-gradient(180deg, rgb(var(--tt-red-rgb) / 0.1), transparent 42%), var(--tt-ink-2);
		box-shadow: var(--tt-shadow-card);
	}
	.mo-boss__reg {
		position: absolute;
		width: 14px;
		height: 14px;
		border-color: rgba(255, 255, 255, 0.22);
		border-style: solid;
		border-width: 0;
		pointer-events: none;
	}
	.mo-boss__reg--tl {
		top: 12px;
		left: 12px;
		border-top-width: 1px;
		border-left-width: 1px;
	}
	.mo-boss__reg--br {
		right: 12px;
		bottom: 12px;
		border-right-width: 1px;
		border-bottom-width: 1px;
	}
	.mo-boss__icon {
		display: inline-grid;
		place-items: center;
		width: 48px;
		height: 48px;
		margin-bottom: 1.4rem;
		border-radius: 12px;
		color: #fff;
		border: 1px solid rgb(var(--tt-red-rgb) / 0.5);
		background: rgb(var(--tt-red-rgb) / 0.08);
	}
	.mo-boss__title {
		font-size: clamp(1.8rem, 1.3rem + 2.5vw, 3rem);
		font-weight: 800;
		letter-spacing: -0.025em;
		color: #fff;
	}
	.mo-boss__body {
		margin-top: 1rem;
		max-width: 54ch;
		font-size: var(--fs-lead);
		color: var(--tt-fog);
	}
	.mo-boss__link {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		margin-top: 1.4rem;
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
	.mo-boss__link:hover {
		color: #fff;
		border-color: var(--tt-line-strong);
	}
	.mo-boss__value {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.6rem;
	}
	.mo-boss__value-label {
		color: var(--tt-mute-2);
	}
	.mo-boss__value-amt {
		display: flex;
		align-items: baseline;
		gap: 0.3rem;
		color: #fff;
	}
	.mo-boss__cur {
		font-size: 1.4rem;
		font-weight: 700;
		color: var(--tt-fog);
	}
	.mo-boss__value-amt .num {
		font-size: clamp(2.6rem, 1.8rem + 4vw, 4.4rem);
		font-weight: 800;
		line-height: 0.9;
		letter-spacing: -0.03em;
	}
	.mo-boss__value-note {
		font-size: 0.82rem;
		letter-spacing: 0.02em;
		color: var(--tt-red-bright);
	}

	/* ---- The twelve lessons -------------------------------------------------
	   A ruled two-column list rather than twelve cards or twelve pills: the page
	   already reads as ruled editorial (MomentumCurriculum's fifteen module rows),
	   and boxing these would turn the strongest content in the section into a
	   pattern swatch. No numerals: the capture lists the lessons in order but does
	   not number them, and printing 01..12 would assert a numbering it does not
	   evidence. */
	.mo-boss__plate {
		padding-top: clamp(1.5rem, 3vw, 2.2rem);
		border-top: 1px solid var(--tt-line);
	}
	.mo-boss__plate-label {
		color: var(--tt-mute-2);
	}
	.mo-boss__lessons {
		list-style: none;
		margin: 1.2rem 0 0;
		padding: 0;
		display: grid;
		gap: 0.6rem 2rem;
	}
	.mo-boss__lesson {
		position: relative;
		padding-left: 1.3rem;
		font-size: 0.95rem;
		line-height: 1.45;
		color: var(--tt-fog);
	}
	/* The same 8px red tick MomentumCurriculum uses on its intro topics
	   (MomentumCurriculum.svelte:114-122). INHERITED from that rule, not captured. */
	.mo-boss__lesson::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.68em;
		width: 8px;
		height: 1px;
		background: var(--tt-red-bright);
	}

	@media (min-width: 768px) {
		.mo-boss__card {
			grid-template-columns: 1.4fr 0.6fr;
			align-items: center;
		}
		.mo-boss__value {
			padding-left: clamp(1.8rem, 4vw, 3rem);
			border-left: 1px solid var(--tt-line);
		}
		/* The lessons sit under both columns, full card width. */
		.mo-boss__plate {
			grid-column: 1 / -1;
		}
		.mo-boss__lessons {
			grid-template-columns: 1fr 1fr;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.mo-boss__link {
			transition: none;
		}
	}
</style>
