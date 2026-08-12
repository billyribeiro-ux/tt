<script lang="ts">
	/**
	 * /momentum-course — WHAT STUDENTS SAY.
	 *
	 * Three real, named students, quoted verbatim from
	 * docs/momentum-reference/live-momentum-course.txt:415-433 — the same page's own
	 * testimonial block, captured with a real browser.
	 *
	 * NOT SANITISED. Rick Guilette's quote contains "until you fkn make it". It is
	 * reproduced as he wrote it: it is on the live site, it is his account of his own
	 * experience, and softening it would be editing a student into marketing copy. If
	 * it has to go, the whole testimonial goes rather than a rewritten version of it.
	 *
	 * NO INVENTED PROOF. No stars, no "verified" badges, no student counts, no
	 * photographs, no results. The capture supports a name and a sentence, so a name
	 * and a sentence is what this renders.
	 *
	 * Semantics: a real figure/blockquote/figcaption per quote, so the attribution is
	 * programmatically tied to the words rather than just sitting near them.
	 */
	import { reveal, splitReveal } from '$lib/motion';
	import { voices } from '$lib/pages/momentum/data/content';
</script>

<section id="mo-voices" class="mv" aria-labelledby="mv-title">
	<div class="tt-container">
		<div class="section-head">
			<span class="idx">04 / 04</span>
			<span class="rule"></span>
			<span class="label mv__count">In their words</span>
		</div>

		<h2 id="mv-title" class="mv__title" data-split {@attach splitReveal({ stagger: 0.03 })}>
			What people are saying about <span class="text-red">Pat Mitchell.</span>
		</h2>

		<ul class="mv__grid" data-anim {@attach reveal({ stagger: 0.1, y: 30 })}>
			{#each voices as v (v.name)}
				<li class="mv__item">
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
	.mv {
		position: relative;
		padding-block: clamp(4.5rem, 3rem + 8vw, 9rem);
	}
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
	   ruled sections, and three boxes would fight the curriculum table above. */
	.mv__item {
		border-top: 2px solid var(--tt-red);
		padding-top: clamp(1rem, 2.5vw, 1.4rem);
	}
	.mv__fig {
		margin: 0;
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
