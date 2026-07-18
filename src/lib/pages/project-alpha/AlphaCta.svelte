<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { splitReveal } from '$lib/motion';

	const applyUrl = 'https://tricktrades.com/project-alpha';
</script>

<section class="tt-section pa-cta" aria-labelledby="pa-cta-title">
	<span class="pa-cta__glow" aria-hidden="true"></span>
	<div class="tt-container pa-cta__inner">
		<p class="pa-cta__kicker label">Now recruiting · 30 seats</p>
		<h2 id="pa-cta-title" class="pa-cta__title" data-split {@attach splitReveal({ stagger: 0.03 })}>
			Train the mind. Then measure it.
		</h2>
		<p class="pa-cta__text prose">
			If you’ll commit to 90 days, the headband, and honest data, we’d like you in the study. Read
			the full protocol and apply below.
		</p>
		<div class="pa-cta__actions">
			<Button href={applyUrl} size="lg">Apply / Learn more</Button>
		</div>
		<p class="pa-cta__fine label">
			Participation is voluntary and may be withdrawn at any time. Day trading involves substantial
			risk of financial loss.
		</p>
	</div>
</section>

<style>
	.pa-cta {
		position: relative;
		overflow: clip;
		background: var(--tt-black);
		text-align: center;
	}
	.pa-cta__glow {
		position: absolute;
		left: 50%;
		bottom: -40%;
		width: 80vw;
		height: 80vw;
		max-width: 900px;
		max-height: 900px;
		transform: translateX(-50%);
		background: radial-gradient(circle, rgb(var(--tt-red-rgb) / 0.28), transparent 60%);
		filter: blur(30px);
		pointer-events: none;
	}
	.pa-cta__inner {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.pa-cta__kicker {
		justify-content: center;
	}
	.pa-cta__title {
		margin-top: 1.2rem;
		font-size: var(--fs-h1);
		font-weight: 800;
		letter-spacing: -0.03em;
		color: #fff;
		max-width: 16ch;
	}
	.pa-cta__text {
		margin-top: 1.4rem;
		text-align: center;
	}
	.pa-cta__actions {
		margin-top: 2.2rem;
	}
	.pa-cta__fine {
		margin-top: 1.8rem;
		max-width: 52ch;
		text-transform: none;
		letter-spacing: 0.01em;
		line-height: 1.6;
		color: var(--tt-mute-2);
	}
</style>
