<script lang="ts">
	import { reveal, splitReveal } from '$lib/motion';
	import SproutIcon from 'phosphor-svelte/lib/SproutIcon';
	import ArrowsClockwiseIcon from 'phosphor-svelte/lib/ArrowsClockwiseIcon';

	// Copy transcribed from the Trick Trades FAQ — the education is "designed for both
	// new and experienced traders."
	const audiences = [
		{
			Icon: SproutIcon,
			tag: 'New traders',
			title: 'Better if you’re a beginner',
			body: 'It’s almost better if you don’t have a lot of experience — you don’t have to be re-wired to get rid of bad habits. This is a family-oriented community that embraces new and struggling day traders.'
		},
		{
			Icon: ArrowsClockwiseIcon,
			tag: 'Experienced traders',
			title: 'Or ready for a reset',
			body: 'Our education is designed for both new and experienced traders. To ensure everyone understands Pat’s strategy, the Boot Camp covers every detail required to become a successful day trader.'
		}
	];
</script>

<section class="bc-who" aria-labelledby="bc-who-title">
	<div class="tt-container">
		<div class="section-head">
			<span class="idx">03 / 03</span>
			<span class="rule"></span>
			<span class="label bc-who__count">Who it’s for</span>
		</div>

		<h2 id="bc-who-title" class="bc-who__title" data-split {@attach splitReveal({ stagger: 0.03 })}>
			Start from zero — or <span class="text-red">start over.</span>
		</h2>

		<div class="bc-who__grid" data-anim-stagger {@attach reveal({ stagger: 0.12, y: 36 })}>
			{#each audiences as a (a.tag)}
				{@const Icon = a.Icon}
				<article class="bc-who__card">
					<div class="bc-who__card-top">
						<span class="bc-who__card-icon"><Icon size={22} weight="regular" /></span>
						<span class="bc-who__card-tag label">{a.tag}</span>
					</div>
					<h3 class="bc-who__card-title">{a.title}</h3>
					<p class="bc-who__card-body">{a.body}</p>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.bc-who {
		position: relative;
		padding-block: clamp(4.5rem, 3rem + 8vw, 9rem);
		background: var(--tt-ink);
		box-shadow:
			inset 0 1px 0 var(--tt-line),
			inset 0 -1px 0 var(--tt-line);
	}
	.bc-who__count {
		flex: none;
		color: var(--tt-mute-2);
	}
	.bc-who__title {
		max-width: 18ch;
		margin-bottom: clamp(2.5rem, 5vw, 4rem);
		font-size: var(--fs-h2);
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.025em;
		color: #fff;
	}
	.bc-who__grid {
		display: grid;
		gap: clamp(1.1rem, 2.5vw, 1.6rem);
	}
	.bc-who__card {
		padding: clamp(1.8rem, 4vw, 2.8rem);
		border: 1px solid var(--tt-line);
		border-radius: var(--tt-radius-lg);
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent);
	}
	.bc-who__card-top {
		display: flex;
		align-items: center;
		gap: 0.9rem;
		margin-bottom: 1.3rem;
	}
	.bc-who__card-icon {
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border-radius: 11px;
		color: var(--tt-fog);
		border: 1px solid var(--tt-line);
		background: rgba(255, 255, 255, 0.02);
	}
	.bc-who__card-tag {
		color: var(--tt-red-bright);
	}
	.bc-who__card-title {
		font-size: var(--fs-h3);
		font-weight: 800;
		letter-spacing: -0.02em;
		color: #fff;
	}
	.bc-who__card-body {
		margin-top: 0.9rem;
		max-width: 48ch;
		font-size: var(--fs-body);
		color: var(--tt-fog);
	}
	@media (min-width: 780px) {
		.bc-who__grid {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
