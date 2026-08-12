<script lang="ts">
	/**
	 * /momentum — THE VOICES. THE LIGHT BAND.
	 *
	 * Three real, named students, quoted verbatim from a capture of the live course
	 * page (docs/momentum-reference/live-momentum-course.txt:415-433). Names,
	 * headlines and body text are exact.
	 *
	 * WHY THIS SITS ON THE LIGHT BAND. The page's score is dark → white → black →
	 * dark. The white band already belongs to the one human moment, Pat's pull
	 * quote; putting the students on a second light band makes "people talking"
	 * a colour the visitor can recognise, and gives the long dark curriculum above
	 * it somewhere to breathe.
	 *
	 * NOT SANITISED. The middle quote contains "until you fkn make it". It is his
	 * sentence, on the live site, and cleaning it up would be editing a man's
	 * account of his own experience into marketing. If it has to go, the whole
	 * testimonial goes — see the note in data/content.ts.
	 *
	 * NO INVENTED PROOF. No star ratings, no "verified" badges, no counts, no
	 * photographs: the capture provides none of those and this page will not
	 * manufacture them. A name and a sentence is what the evidence supports.
	 */
	import { reveal, splitReveal } from '$lib/motion';
	import { voices, voicesHeading } from '$lib/pages/momentum/data/content';
</script>

<section
	id="voices"
	class="mo-section mo-band--light mo-voices-band"
	aria-labelledby="mo-voices-title"
>
	<div class="mo-wrap">
		<!-- Completes the run: Paths 01, Ledger 02, Curriculum 03, this 04. Same
		     aria-hidden treatment as the other three — it is a counter and a rule,
		     with no captured copy to announce. -->
		<div class="section-head" aria-hidden="true">
			<span class="idx">04 / 04</span>
			<span class="rule"></span>
		</div>

		<h2
			id="mo-voices-title"
			class="mo-voices__title"
			data-split
			{@attach splitReveal({ stagger: 0.02, duration: 0.7, start: 'top 84%' })}
		>
			{voicesHeading}
		</h2>

		<ul class="mo-voices__grid" data-anim {@attach reveal({ y: 26, start: 'top 86%' })}>
			{#each voices as v (v.name)}
				<li class="mo-voices__item">
					<!-- A real <figure>/<blockquote>/<figcaption>: the attribution is
					     programmatically tied to the quote, not just visually near it. -->
					<figure class="mo-voices__fig">
						<p class="mo-voices__headline">{v.headline}</p>
						<blockquote class="mo-voices__quote">{v.quote}</blockquote>
						<figcaption class="mo-voices__name">{v.name}</figcaption>
					</figure>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	/* The light band. Every colour in here is inverted against the dark sections;
	   the values come from the band system in momentum.css. */
	.mo-voices-band {
		background: var(--mo-kit-secondary);
	}

	.mo-voices__title {
		max-width: 24ch;
		font-size: clamp(1.7rem, 1.1rem + 2.6vw, 2.7rem);
		line-height: 1.1;
		color: var(--mo-kit-primary);
	}

	.mo-voices__grid {
		list-style: none;
		margin: clamp(2rem, 4vw, 3rem) 0 0;
		padding: 0;
		display: grid;
		gap: clamp(1.75rem, 4vw, 2.75rem);
	}
	@media (min-width: 860px) {
		.mo-voices__grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	/* Ruled columns rather than cards: on a white band a card border plus a shadow
	   would be two devices doing one job. A single hairline is enough. */
	.mo-voices__item {
		border-block-start: 2px solid var(--mo-kit-accent);
		padding-block-start: clamp(1rem, 2.5vw, 1.4rem);
	}
	.mo-voices__fig {
		margin: 0;
		display: flex;
		flex-direction: column;
		height: 100%;
	}
	.mo-voices__headline {
		margin: 0 0 0.75rem;
		font-size: clamp(1.05rem, 0.95rem + 0.4vw, 1.25rem);
		font-weight: 700;
		line-height: 1.25;
		color: var(--mo-kit-primary);
		text-wrap: balance;
	}
	.mo-voices__quote {
		margin: 0;
		flex: 1;
		font-size: 0.98rem;
		line-height: 1.6;
		/* #4a4a4a on #ffffff is 8.6:1 — comfortably AA for body text, and softer
		   than pure black so the headline above still leads. */
		color: #4a4a4a;
	}
	.mo-voices__name {
		margin-block-start: 1.1rem;
		font-family: var(--tt-font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		/* #6b6b6b on #ffffff is 5.3:1 — AA at this size. */
		color: #6b6b6b;
	}
</style>
