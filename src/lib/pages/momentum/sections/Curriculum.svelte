<script lang="ts">
	/**
	 * /momentum — THE CURRICULUM. THE DARK BAND.
	 *
	 * The page used to state one honest number, "Over 129 Video Lessons", and stop.
	 * That is accurate and completely unpersuasive: a number is a claim, a syllabus
	 * is evidence. This section prints the actual 15 modules, verbatim from a
	 * capture of the live course page, so a visitor can read what they would be
	 * buying instead of being told it is large.
	 *
	 * NOTHING HERE IS WRITTEN COPY. Every module title, and every one of the four
	 * intro topics, is quoted exactly — capitalisation, punctuation and all — from
	 * docs/momentum-reference/live-momentum-course.txt. See data/content.ts for the
	 * per-entry line numbers. The uneven voice of the titles is the point: a real
	 * syllabus reads as real precisely because nobody smoothed it.
	 *
	 * MOTION. Rows stagger in on a single ScrollTrigger batch rather than one
	 * trigger per row — 15 triggers would be 15 scroll listeners for one effect.
	 * Under reduced motion the attachment returns before creating anything and the
	 * rows are simply present, which is also the no-JS state.
	 */
	import { reveal, splitReveal } from '$lib/motion';
	import ArrowUpRightIcon from 'phosphor-svelte/lib/ArrowUpRightIcon';
	import { curriculum, offers } from '$lib/pages/momentum/data/content';
</script>

<section
	id="curriculum"
	class="mo-section mo-curriculum-band"
	aria-labelledby="mo-curriculum-title"
>
	<div class="mo-wrap">
		<div class="section-head" aria-hidden="true">
			<span class="idx">03 / 04</span>
			<span class="rule"></span>
		</div>

		<h2
			id="mo-curriculum-title"
			class="mo-curriculum__title"
			data-split
			{@attach splitReveal({ stagger: 0.02, duration: 0.7, start: 'top 84%' })}
		>
			{curriculum.heading}
		</h2>

		<!-- The four intro topics. Quoted lesson titles, used as the section's lede
		     because they say what the course is about in the instructor's own words
		     far better than anything written for this page could. -->
		<ul class="mo-curriculum__lede" data-anim {@attach reveal({ y: 18, start: 'top 86%' })}>
			{#each curriculum.introTopics as topic (topic)}
				<li>{topic}</li>
			{/each}
		</ul>

		<ol class="mo-curriculum__list" data-anim {@attach reveal({ y: 24, start: 'top 88%' })}>
			{#each curriculum.modules as m (m.n)}
				<li class="mo-curriculum__row">
					<span class="mo-curriculum__n" aria-hidden="true">{m.n}</span>
					<span class="mo-curriculum__t">{m.title}</span>
				</li>
			{/each}
		</ol>

		<a
			class="mo-curriculum__cta"
			href={offers.course.href}
			aria-label="{curriculum.ctaLabel} for The Complete Momentum course"
			data-anim
			{@attach reveal({ y: 16, start: 'top 92%' })}
		>
			{curriculum.ctaLabel}
			<ArrowUpRightIcon size={14} weight="bold" aria-hidden="true" />
		</a>
	</div>
</section>

<style>
	.mo-curriculum-band {
		background: var(--tt-black);
	}

	.mo-curriculum__title {
		max-width: 22ch;
		font-size: clamp(1.9rem, 1.2rem + 3vw, 3.1rem);
		line-height: 1.05;
		color: var(--tt-white);
	}

	/* The lede topics: set as a rule-separated stack rather than bullets, so four
	   long sentences read as a list of promises instead of a paragraph. */
	.mo-curriculum__lede {
		list-style: none;
		margin: clamp(1.5rem, 3vw, 2.25rem) 0 0;
		padding: 0;
		display: grid;
		gap: 0.7rem;
		max-width: 62ch;
	}
	.mo-curriculum__lede li {
		position: relative;
		padding-left: 1.5rem;
		font-size: clamp(0.98rem, 0.9rem + 0.3vw, 1.12rem);
		line-height: 1.5;
		color: var(--tt-fog);
	}
	.mo-curriculum__lede li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.62em;
		width: 8px;
		height: 1px;
		background: var(--mo-cyan);
	}

	/* THE SYLLABUS. A ruled table, not cards: 15 cards would be a wall of boxes,
	   and a ruled list is how a curriculum is actually read. */
	.mo-curriculum__list {
		list-style: none;
		margin: clamp(2.25rem, 5vw, 3.5rem) 0 0;
		padding: 0;
		border-block-start: 1px solid var(--mo-line);
		/* Below-the-fold and tall: skip painting it until it is near. */
		content-visibility: auto;
		contain-intrinsic-size: auto 900px;
	}
	.mo-curriculum__row {
		display: grid;
		grid-template-columns: 3.2rem 1fr;
		gap: 0.5rem 1rem;
		align-items: baseline;
		padding-block: clamp(0.85rem, 2vw, 1.15rem);
		border-block-end: 1px solid var(--mo-line);
		transition: background-color 0.3s ease;
	}
	.mo-curriculum__row:hover {
		background-color: rgb(var(--mo-cyan-rgb) / 0.04);
	}
	.mo-curriculum__n {
		font-family: var(--tt-font-mono);
		font-size: 0.78rem;
		letter-spacing: 0.1em;
		color: var(--mo-cyan);
	}
	.mo-curriculum__t {
		font-size: clamp(1rem, 0.92rem + 0.4vw, 1.22rem);
		line-height: 1.35;
		color: var(--tt-white);
		text-wrap: pretty;
	}

	.mo-curriculum__cta {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		margin-block-start: clamp(1.75rem, 4vw, 2.5rem);
		font-size: 0.95rem;
		color: var(--tt-white);
		text-decoration: underline;
		text-decoration-color: rgb(255 255 255 / 0.35);
		text-underline-offset: 0.3em;
		transition:
			color 0.25s ease,
			text-decoration-color 0.25s ease;
	}
	.mo-curriculum__cta:hover,
	.mo-curriculum__cta:focus-visible {
		text-decoration-color: currentColor;
	}

	@media (prefers-reduced-motion: reduce) {
		.mo-curriculum__row,
		.mo-curriculum__cta {
			transition: none;
		}
	}
</style>
