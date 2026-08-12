<script lang="ts">
	/**
	 * /momentum-course — THE CURRICULUM.
	 *
	 * This page previously stated "15 modules / 115 video lessons" and never said
	 * what any of them were. A number is a claim; a syllabus is proof. This section
	 * prints all fifteen module titles, and the instructor's own framing lessons
	 * above them, so a buyer can read the product instead of being told its size.
	 *
	 * ZERO WRITTEN COPY. Every title is quoted exactly — capitalisation, punctuation,
	 * the lot — from docs/momentum-reference/live-momentum-course.txt, captured from
	 * the live course page with a real browser. Per-entry line numbers are in
	 * data/content.ts. The titles are uneven and shouty in places; that is left
	 * alone, because a real syllabus reads as real precisely because nobody tidied it.
	 *
	 * It imports DATA from the /momentum content module, never that page's CSS
	 * scope: this component is styled entirely with the site's own global
	 * utilities (tt-container, section-head, idx, rule, label, num) so it sits
	 * inside the course page's existing visual language rather than importing a
	 * second one.
	 */
	import { reveal, splitReveal } from '$lib/motion';
	import { curriculum } from '$lib/pages/momentum/data/content';

	const courseUrl = 'https://tricktrades.com/momentum-course';
</script>

<section id="mo-curriculum" class="mc" aria-labelledby="mc-title">
	<div class="tt-container">
		<div class="section-head">
			<span class="idx">02 / 04</span>
			<span class="rule"></span>
			<span class="label mc__count">The syllabus</span>
		</div>

		<div class="mc__head">
			<h2 id="mc-title" class="mc__title" data-split {@attach splitReveal({ stagger: 0.03 })}>
				Fifteen modules. <span class="text-red">Nothing hidden.</span>
			</h2>

			<!-- The instructor's own framing lessons, quoted. They set up the course far
			     better than anything written for this page could. -->
			<ul class="mc__lede" data-anim {@attach reveal({ y: 18 })}>
				{#each curriculum.introTopics as topic (topic)}
					<li>{topic}</li>
				{/each}
			</ul>
		</div>

		<ol class="mc__list" data-anim {@attach reveal({ y: 26 })}>
			{#each curriculum.modules as m (m.n)}
				<li class="mc__row">
					<span class="mc__n num" aria-hidden="true">{m.n}</span>
					<span class="mc__t">{m.title}</span>
				</li>
			{/each}
		</ol>

		<p class="mc__foot" data-anim {@attach reveal({ y: 16 })}>
			<a class="mc__link" href={courseUrl}>Enrol and start module 01</a>
		</p>
	</div>
</section>

<style>
	.mc {
		position: relative;
		padding-block: clamp(4.5rem, 3rem + 8vw, 9rem);
		background: var(--tt-ink);
		box-shadow:
			inset 0 1px 0 var(--tt-line),
			inset 0 -1px 0 var(--tt-line);
	}
	.mc__count {
		flex: none;
		color: var(--tt-mute-2);
	}

	.mc__head {
		display: grid;
		gap: 1.4rem;
		margin-bottom: clamp(2.5rem, 5vw, 4rem);
	}
	@media (min-width: 1024px) {
		.mc__head {
			grid-template-columns: 1fr 1fr;
			align-items: start;
			gap: clamp(2rem, 5vw, 4rem);
		}
	}
	.mc__title {
		font-size: var(--fs-h2);
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.025em;
		color: #fff;
		text-wrap: balance;
	}

	.mc__lede {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.65rem;
	}
	.mc__lede li {
		position: relative;
		padding-left: 1.4rem;
		font-size: var(--fs-body);
		line-height: 1.5;
		color: var(--tt-fog);
	}
	.mc__lede li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.62em;
		width: 8px;
		height: 1px;
		background: var(--tt-red-bright);
	}

	/* A ruled list, not fifteen cards. A curriculum is read as a table of contents;
	   fifteen bordered boxes would be a wall and would bury the titles. */
	.mc__list {
		list-style: none;
		margin: 0;
		padding: 0;
		border-top: 1px solid var(--tt-line);
		/* Tall and below the fold: skip painting until it is near the viewport. */
		content-visibility: auto;
		contain-intrinsic-size: auto 1000px;
	}
	.mc__row {
		display: grid;
		grid-template-columns: 3.4rem 1fr;
		gap: 0.4rem 1.2rem;
		align-items: baseline;
		padding-block: clamp(0.9rem, 2vw, 1.25rem);
		border-bottom: 1px solid var(--tt-line);
		transition: background-color 0.3s ease;
	}
	.mc__row:hover {
		background-color: rgb(var(--tt-red-rgb) / 0.05);
	}
	.mc__n {
		font-size: 0.8rem;
		letter-spacing: 0.1em;
		color: var(--tt-red-bright);
	}
	.mc__t {
		font-size: clamp(1rem, 0.92rem + 0.4vw, 1.2rem);
		line-height: 1.35;
		color: #fff;
		text-wrap: pretty;
	}

	.mc__foot {
		margin-top: clamp(2rem, 4vw, 3rem);
	}
	.mc__link {
		font-family: var(--tt-font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--tt-fog);
		border-bottom: 1px solid var(--tt-line-strong);
		transition: color 0.25s ease;
	}
	.mc__link:hover,
	.mc__link:focus-visible {
		color: #fff;
	}

	@media (prefers-reduced-motion: reduce) {
		.mc__row,
		.mc__link {
			transition: none;
		}
	}
</style>
