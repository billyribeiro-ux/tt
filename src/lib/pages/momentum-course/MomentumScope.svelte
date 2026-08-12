<script lang="ts">
	/**
	 * /momentum-course — THE SCOPE. Rail stop 02 (`mo-scope`).
	 *
	 * PURPOSE: turn three claims into one picture. The three certified figures are
	 * stated as numerals AND drawn as mass — LessonMass renders one mark per lesson
	 * and consolidates them from a seeded scatter into two packed blocks as the
	 * section is scrolled, so "115 + 14" stops being a sentence and becomes a
	 * quantity you can see.
	 *
	 * WHAT WENT, AND WHY:
	 *
	 * 1. THE NINE-POINT POLYLINE. A red line stepping up and to the right, drawn
	 *    with `drawLine()`, on a day-trading page. It carried no data and had no
	 *    axis, but a rising line in brand red beside the words "115 Video lessons"
	 *    reads as a performance curve, and this page may not imply results. Deleted,
	 *    along with the `drawLine` import.
	 *
	 * 2. `class="mo-scope"`. That is /momentum's own wrapper selector
	 *    (momentum/momentum.css:88), where the `--mo-*` tokens are declared. A
	 *    stylesheet from a sibling route survives a client-side navigation, so the
	 *    class was a latent collision for the sake of a name. Renamed `mc-scope`.
	 *
	 * 3. THE DUPLICATE BAND. `position/padding-block/background/box-shadow` here
	 *    were byte-identical to MomentumCurriculum's. Both now use
	 *    `.mc-section.mc-section--ink` (course.css:101-115).
	 *
	 * 4. THE HARDCODED FIGURES. `15 / 115 / +14` and their labels were typed into
	 *    this file. They now come from `ledger.breakdown.items` (content.ts:339-352),
	 *    where each entry carries its own locator in the live capture. Note the
	 *    invented `+` on the bonus figure went with them: the captured figure is
	 *    "14".
	 *
	 * DELIBERATE DEVIATION — NO counter() ON THE FIGURES. The direction brief asked
	 * for `counter()` here. This page's own data module forbids exactly that
	 * (content.ts:294-295: "Never animate a number through intermediate counts
	 * (7... 43... 118) — those would assert figures the evidence does not support"),
	 * and a count-up from 0 to 115 puts a different uncertified number on screen on
	 * every frame. The brief's actual goal — the big numerals being the animated
	 * element rather than the small labels — is met by animating the numerals as
	 * objects: they arrive first, on a metronome, on a `back.out` overshoot, and the
	 * label and note follow each one.
	 *
	 * REDUCED MOTION: no context is built, so ZERO ScrollTriggers exist. `.js` is
	 * never on <html> (app.html:16-22), so every figure, label and note sits at its
	 * resting opacity, and LessonMass paints its settled frame — every mark packed —
	 * ignoring `progress` entirely (LessonMass.svelte:125).
	 */
	import { onMount } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import Button from '$lib/components/Button.svelte';
	import { splitReveal } from '$lib/motion';
	import { curriculum, ledger } from '$lib/pages/momentum/data/content';
	import { ui } from '$lib/pages/momentum/state/ui.svelte';
	import { ensureGsap } from '$lib/pages/momentum/motion/gsap-setup';
	import { jumpToId } from '$lib/pages/momentum/motion/smooth-scroll';
	import { courseSectionHead } from '$lib/pages/momentum-course/motion/course-signals';
	import LessonMass from '$lib/pages/momentum-course/viz/LessonMass.svelte';
	import '$lib/pages/momentum-course/course.css';

	/**
	 * The three certified figures, in captured order (content.ts:342-349).
	 * Nothing here is retyped; only the one-line note beside each figure is this
	 * page's own writing, and it is keyed by the CERTIFIED label — so renaming or
	 * dropping an entry in content.ts fails the type check here rather than
	 * silently rendering an empty note.
	 */
	type ScopeLabel = (typeof ledger.breakdown.items)[number]['label'];
	const NOTES: Record<ScopeLabel, string> = {
		Modules: 'A structured, front-to-back curriculum',
		'Video Lessons': 'From first setup to professional execution',
		'Bonus Lessons': 'Extra material layered on top'
	};

	/**
	 * Read at INIT and OR-ed with the store: the route's $effect is the only writer
	 * of `ui.reducedMotion` and it can run after this component initialises — the
	 * bug documented at project-alpha/viz/NeuroTradeHud.svelte:19-27.
	 */
	let systemReduced = $state(
		typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
	);
	const reduced = $derived(systemReduced || ui.reducedMotion);

	/** 0..1, scrubbed. The only writer is the trigger built below. */
	let massProgress = $state(0);

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
		return () => mq.removeEventListener('change', onMotion);
	});

	/**
	 * Every from/fromTo carries `immediateRender: false`, which is what lets the CSS
	 * gate (`.js [data-anim] { opacity: 0 }`, app.css:210-215) hold an element
	 * invisible until its own beat starts instead of GSAP flashing an end state.
	 */
	$effect(() => {
		if (reduced || !root) return;

		const gsap = ensureGsap();
		const el = root;

		const ctx = gsap.context(() => {
			gsap.fromTo(
				'.mc-scope__intro',
				{ opacity: 0, y: 20 },
				{
					opacity: 1,
					y: 0,
					duration: 0.8,
					ease: 'power3.out',
					immediateRender: false,
					scrollTrigger: { trigger: '.mc-scope__head', start: 'top 84%', once: true }
				}
			);

			/* THE METRONOME. One timeline, one trigger: the numeral lands first with
			   an overshoot, then its label, then its note — three times, 0.14s apart.
			   That ordering is the point; the numerals are the loudest thing in the
			   section and they now move like it. */
			const figures = gsap.timeline({
				scrollTrigger: { trigger: '.mc-scope__figs', start: 'top 84%', once: true }
			});
			figures
				.fromTo(
					'.mc-scope__fig-n',
					{ opacity: 0, y: 40 },
					{
						opacity: 1,
						y: 0,
						duration: 0.7,
						ease: 'back.out(2.2)',
						stagger: 0.14,
						immediateRender: false
					},
					0
				)
				.fromTo(
					'.mc-scope__fig-label',
					{ opacity: 0, y: 16 },
					{
						opacity: 1,
						y: 0,
						duration: 0.6,
						ease: 'power3.out',
						stagger: 0.14,
						immediateRender: false
					},
					0.14
				)
				.fromTo(
					'.mc-scope__fig-note',
					{ opacity: 0, y: 16 },
					{
						opacity: 1,
						y: 0,
						duration: 0.6,
						ease: 'power3.out',
						stagger: 0.14,
						immediateRender: false
					},
					0.22
				);

			/* THE MASS, scrubbed. A standalone ScrollTrigger's `scrub` value would do
			   nothing — it smooths an ANIMATION — so the progress is carried by a real
			   tween on a proxy object, whose eased value is handed to LessonMass. That
			   is what makes the consolidation lag the scroll by 0.8s instead of
			   snapping to it. */
			const proxy = { p: 0 };
			gsap.to(proxy, {
				p: 1,
				ease: 'none',
				scrollTrigger: {
					trigger: '.mc-scope__mass',
					start: 'top 80%',
					end: 'bottom 60%',
					scrub: 0.8
				},
				onUpdate: () => {
					massProgress = proxy.p;
				}
			});

			gsap.fromTo(
				'.mc-scope__note',
				{ opacity: 0, y: 24 },
				{
					opacity: 1,
					y: 0,
					duration: 0.65,
					ease: 'power3.out',
					immediateRender: false,
					scrollTrigger: { trigger: '.mc-scope__note', start: 'top 86%', once: true }
				}
			);
		}, el);

		return () => ctx.revert();
	});
</script>

<section
	id="mo-scope"
	class="mc-scope mc-section mc-section--ink"
	aria-labelledby="mo-scope-title"
	{@attach captureRoot}
>
	<div class="tt-container">
		<div class="section-head">
			<span class="idx">{courseSectionHead('mo-scope')}</span>
			<span class="rule"></span>
			<span class="label mc-scope__count">The scope</span>
		</div>

		<div class="mc-scope__head">
			<h2
				id="mo-scope-title"
				class="mc-scope__title"
				data-split
				{@attach splitReveal({ stagger: 0.03 })}
			>
				The whole game, <span class="text-red">module by module.</span>
			</h2>
			<p class="mc-scope__intro prose" data-anim>
				Momentum is the deepest program in the catalogue: high-level coaching built as a complete,
				structured path rather than a loose set of clips.
			</p>
		</div>

		<div class="mc-scope__body">
			<ul class="mc-scope__figs">
				{#each ledger.breakdown.items as item (item.label)}
					<li class="mc-scope__fig">
						<span class="num mc-scope__fig-n" data-anim>{item.figure}</span>
						<span class="mc-scope__fig-label label" data-anim>{item.label}</span>
						<span class="mc-scope__fig-note" data-anim>{NOTES[item.label]}</span>
					</li>
				{/each}
			</ul>

			<!-- One mark per lesson. Decorative and aria-hidden inside; its figcaption
			     carries the two certified counts as real text. -->
			<div class="mc-scope__mass">
				<LessonMass progress={massProgress} />
			</div>
		</div>

		<div class="mc-scope__note" data-anim>
			<!-- The live course page's own heading over this breakdown, verbatim
			     (content.ts:432), used here as the hand-off to the fifteen real module
			     titles further down THIS page. The sentence that used to sit here sent
			     the reader to "the course page" for a breakdown that is now two
			     sections below them. -->
			<p class="mc-scope__note-text label">{curriculum.heading}</p>
			<Button
				href="#mo-curriculum"
				variant="ghost"
				size="md"
				onclick={(e) => jumpToId(e, 'mo-curriculum')}
			>
				{curriculum.ctaLabel}
			</Button>
		</div>
	</div>
</section>

<style>
	/* The band itself is `.mc-section.mc-section--ink` (course.css:101-115); this
	   file only owns what is specific to the section. */
	.mc-scope {
		position: relative;
	}
	.mc-scope__count {
		flex: none;
		color: var(--tt-mute-2);
	}
	.mc-scope__head {
		display: grid;
		gap: 1.2rem;
		margin-bottom: clamp(2.5rem, 5vw, 4rem);
	}
	.mc-scope__title {
		font-size: var(--fs-h2);
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.025em;
		color: #fff;
	}
	.mc-scope__intro {
		max-width: 56ch;
	}
	@media (min-width: 1024px) {
		.mc-scope__head {
			grid-template-columns: 1.1fr 0.9fr;
			align-items: end;
			gap: clamp(2rem, 5vw, 4rem);
		}
	}

	/* The figures read down the left, the mass sits beside them from 1024px so the
	   three numerals and the picture of the same three numerals are one glance. */
	.mc-scope__body {
		display: grid;
		gap: clamp(2rem, 4vw, 3rem);
	}
	@media (min-width: 1024px) {
		.mc-scope__body {
			grid-template-columns: minmax(0, 1fr) minmax(0, 0.86fr);
			align-items: center;
			gap: clamp(2.5rem, 5vw, 4.5rem);
		}
	}

	.mc-scope__figs {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0;
		border-top: 1px solid var(--tt-line);
	}
	.mc-scope__fig {
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: center;
		gap: 0.2rem 1.6rem;
		padding: clamp(1.4rem, 3vw, 2.2rem) 0;
		border-bottom: 1px solid var(--tt-line);
	}
	.mc-scope__fig-n {
		grid-row: span 2;
		min-width: 3.5ch;
		font-size: clamp(2.8rem, 1.4rem + 7vw, 6rem);
		font-weight: 800;
		line-height: 0.85;
		letter-spacing: -0.04em;
		color: #fff;
	}
	.mc-scope__fig-label {
		align-self: end;
		color: var(--tt-red-bright);
	}
	.mc-scope__fig-note {
		align-self: start;
		font-size: var(--fs-body);
		color: var(--tt-fog);
	}

	.mc-scope__note {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 1.4rem 2rem;
		margin-top: clamp(2rem, 4vw, 3rem);
	}
	.mc-scope__note-text {
		max-width: 46ch;
		color: var(--tt-mute-2);
	}
</style>
