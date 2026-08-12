<script lang="ts">
	/**
	 * /momentum-course — WHAT STUDENTS SAY.
	 *
	 * Three real, named students, quoted verbatim from
	 * docs/momentum-reference/live-momentum-course.txt:415-433 — the same page's own
	 * testimonial block, captured with a real browser. Names, headlines and body
	 * text all come from `voices` (content.ts:518-540); the heading comes from
	 * `voicesHeading` (content.ts:553) rather than being retyped here, which is
	 * what stops this page and the data module drifting apart.
	 *
	 * NOT SANITISED. Rick Guilette's quote contains "until you fkn make it". It is
	 * reproduced as he wrote it: it is on the live site, it is his account of his own
	 * experience, and softening it would be editing a student into marketing copy. If
	 * it has to go, the whole testimonial goes rather than a rewritten version of it.
	 *
	 * NO INVENTED PROOF. No stars, no "verified" badges, no student counts, no
	 * photographs, no results, no dates. The capture supports a name and a sentence,
	 * so a name and a sentence is what this renders.
	 *
	 * NO CANVAS, DELIBERATELY. Three quotations need typography and pace, not an
	 * instrument. A mark field here would be decoration over a void — the words are
	 * the content, and the only thing motion is asked to do is slow the reader down.
	 *
	 * Semantics: a real figure/blockquote/figcaption per quote, so the attribution is
	 * programmatically tied to the words rather than just sitting near them.
	 *
	 * MOTION — the verb is SETTLE, and it is deliberately the slowest beat on the
	 * page, so the reading pace drops before the ask. Each quote resolves out of a
	 * 9px blur with a fractional rotation, and the red rule above each column draws
	 * itself left to right while they are still settling. NOTHING HERE ANIMATES
	 * OPACITY, and that is a
	 * choice rather than an omission: a testimonial must never be able to end up
	 * invisible because a tween did not run.
	 *
	 * REDUCED MOTION: the attachment returns before it builds anything, so zero
	 * ScrollTriggers exist; the quotes are unblurred and square and the three rules
	 * are full width from first paint.
	 */
	import { onMount } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import { browser } from '$app/env';
	import { splitReveal } from '$lib/motion';
	import { ui } from '$lib/pages/momentum/state/ui.svelte';
	import { ensureGsap } from '$lib/pages/momentum/motion/gsap-setup';
	import { voices, voicesHeading } from '$lib/pages/momentum/data/content';
	import { courseSectionHead } from '$lib/pages/momentum-course/motion/course-signals';
	import '$lib/pages/momentum-course/course.css';

	/** "04 / 05". Never a literal — course-signals owns the page's numbering. */
	const head = courseSectionHead('mo-voices');

	/**
	 * The heading is one certified string (content.ts:553). To colour the name
	 * without retyping any of it, the string is split on an EXACT tail comparison —
	 * `endsWith`, not a pattern built out of text this file does not control. If
	 * content.ts ever stops ending with the name, `headLead` becomes the whole
	 * heading and the accent span simply renders empty; the words on screen stay
	 * correct either way.
	 */
	const HEAD_NAME = 'Pat Mitchell';
	const headName = voicesHeading.endsWith(HEAD_NAME) ? HEAD_NAME : '';
	const headLead = headName ? voicesHeading.slice(0, -HEAD_NAME.length) : voicesHeading;

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
	 * The settle, as one attachment on the section. Attachments run inside an
	 * effect, so reading `reduced` here means a mid-session preference flip tears
	 * the timeline down through this function's cleanup and does not rebuild it.
	 *
	 * `once: true` rather than a scrub: a quotation that re-animates every time it
	 * is scrolled past is a distraction from reading it.
	 */
	const settle: Attachment<HTMLElement> = (root) => {
		if (reduced) return;

		const gsap = ensureGsap();
		const figures = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('.mv__fig'));
		const rules = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('.mv__rule'));
		if (!figures.length) return;

		const ctx = gsap.context(() => {
			const tl = gsap.timeline({
				scrollTrigger: { trigger: root, start: 'top 78%', once: true }
			});

			tl.fromTo(
				figures,
				{
					filter: 'blur(9px)',
					y: 34,
					// -0.8deg, 0, +0.8deg across three columns: the outer two lean in.
					rotate: (i: number) => (i - 1) * 0.8
				},
				{
					filter: 'blur(0px)',
					y: 0,
					rotate: 0,
					duration: 1.35,
					ease: 'sine.out',
					stagger: 0.16,
					immediateRender: false,
					// Drop the filter once it is at rest: a `filter` left on an element
					// keeps a compositing layer alive for the life of the page.
					onComplete: () => gsap.set(figures, { clearProps: 'filter' })
				}
			);

			if (rules.length) {
				tl.fromTo(
					rules,
					{ scaleX: 0, transformOrigin: 'left center' },
					{
						scaleX: 1,
						duration: 0.9,
						ease: 'expo.inOut',
						stagger: 0.12,
						immediateRender: false
					},
					'-=1.0'
				);
			}
		}, root);

		return () => ctx.revert();
	};
</script>

<section id="mo-voices" class="mc-section mv" aria-labelledby="mv-title" {@attach settle}>
	<div class="tt-container">
		<div class="section-head">
			{#if head}<span class="idx">{head}</span>{/if}
			<span class="rule"></span>
			<span class="label mv__count">In their words</span>
		</div>

		<h2 id="mv-title" class="mv__title" data-split {@attach splitReveal({ stagger: 0.03 })}>
			{headLead}<span class="text-red">{headName}</span>
		</h2>

		<ul class="mv__grid">
			{#each voices as v (v.name)}
				<li class="mv__item">
					<span class="mv__rule" aria-hidden="true"></span>
					<figure class="mv__fig">
						<p class="mv__headline">{v.headline}</p>
						<blockquote class="mv__quote">{v.quote}</blockquote>
						<figcaption class="mv__name label">{v.name}</figcaption>
					</figure>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	/* `.mc-section` (course.css) carries `position: relative` and the page's shared
	   padding-block, so neither is restated here. */
	.mv__count {
		flex: none;
		color: var(--tt-mute-2);
	}
	.mv__title {
		max-width: 22ch;
		font-size: var(--fs-h2);
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.025em;
		color: #fff;
		text-wrap: balance;
	}

	.mv__grid {
		list-style: none;
		margin: clamp(2.5rem, 5vw, 4rem) 0 0;
		padding: 0;
		display: grid;
		gap: clamp(1.75rem, 4vw, 2.5rem);
	}
	@media (min-width: 900px) {
		.mv__grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	/* A top rule per column rather than a bordered card: the page already uses
	   ruled sections, and three boxes would fight the curriculum table above.

	   It is a real 2px ELEMENT rather than a `border-top`, because the rule is
	   drawn on scroll and a border cannot be scaled. The row template keeps the
	   figure stretched to the tallest column, which the border did for free. */
	.mv__item {
		display: grid;
		grid-template-rows: auto 1fr;
	}
	/* A block element with no width declared is full width, which is both the
	   resting state and the reduced-motion / no-JS state — the draw only ever
	   scales it up to that. The origin is declared here as well as in the tween so
	   the two can never disagree. */
	.mv__rule {
		display: block;
		height: 2px;
		background: var(--tt-red);
		transform-origin: left center;
	}
	.mv__fig {
		margin: 0;
		padding-top: clamp(1rem, 2.5vw, 1.4rem);
		display: flex;
		flex-direction: column;
		height: 100%;
	}
	.mv__headline {
		margin: 0 0 0.8rem;
		font-size: clamp(1.05rem, 0.95rem + 0.4vw, 1.25rem);
		font-weight: 700;
		line-height: 1.25;
		color: #fff;
		text-wrap: balance;
	}
	.mv__quote {
		margin: 0;
		flex: 1;
		font-size: 0.97rem;
		line-height: 1.65;
		color: var(--tt-fog);
	}
	.mv__name {
		margin-top: 1.2rem;
		color: var(--tt-mute);
	}
</style>
