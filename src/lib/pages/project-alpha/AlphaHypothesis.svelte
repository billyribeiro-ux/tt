<script lang="ts">
	import { reveal, splitReveal } from '$lib/motion';

	// What the hypothesis predicts, versus each trader's own baseline.
	const predictions = [
		'Reduced emotional reactivity under live-market pressure',
		'Improved execution and shorter learning curves',
		'Greater decision consistency, day to day',
		'A measurable shift toward a calmer, more focused baseline'
	];
</script>

<section class="tt-section pa-hyp" aria-labelledby="pa-hyp-title">
	<div class="tt-container">
		<header class="section-head">
			<span class="idx">01 / 05</span>
			<span class="rule"></span>
			<span class="label">The hypothesis</span>
		</header>

		<div class="pa-hyp__grid">
			<div class="pa-hyp__lead">
				<h2
					id="pa-hyp-title"
					class="pa-hyp__title"
					data-split
					{@attach splitReveal({ stagger: 0.03 })}
				>
					Traders who hold an alpha state should trade like <span class="text-red"
						>different people.</span
					>
				</h2>
				<p class="pa-hyp__note prose">
					The premise is narrow on purpose. We are not claiming a headband makes anyone profitable.
					We are testing whether a trained, repeatable alpha state measurably lowers emotional
					reactivity and tightens decision-making, with each participant judged against their own Day
					0 baseline, not against anyone else.
				</p>
			</div>

			<ul class="pa-hyp__list" data-anim-stagger {@attach reveal({ stagger: 0.1, y: 26 })}>
				{#each predictions as p, i (p)}
					<li class="pa-hyp__item">
						<span class="pa-hyp__num num">H{i + 1}</span>
						<span class="pa-hyp__text">{p}</span>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</section>

<style>
	.pa-hyp {
		background: var(--tt-black);
		overflow: clip;
	}
	.pa-hyp__grid {
		display: grid;
		gap: clamp(2.4rem, 5vw, 4rem);
	}
	.pa-hyp__title {
		font-size: var(--fs-h2);
		font-weight: 800;
		letter-spacing: -0.02em;
		color: #fff;
		max-width: 16ch;
	}
	.pa-hyp__note {
		margin-top: 1.4rem;
		font-size: var(--fs-body);
		max-width: 56ch;
	}
	.pa-hyp__list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0;
		align-self: start;
	}
	.pa-hyp__item {
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: baseline;
		gap: 1rem;
		padding: 1.15rem 0;
		border-top: 1px solid var(--tt-line);
	}
	.pa-hyp__item:last-child {
		border-bottom: 1px solid var(--tt-line);
	}
	.pa-hyp__num {
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--tt-red-bright);
	}
	.pa-hyp__text {
		font-size: var(--fs-h4);
		font-weight: 500;
		color: #fff;
		line-height: 1.3;
		letter-spacing: -0.01em;
	}

	@media (min-width: 1024px) {
		.pa-hyp__grid {
			grid-template-columns: 1fr 1fr;
			align-items: start;
		}
	}
</style>
