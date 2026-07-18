<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { reveal, splitReveal, parallax } from '$lib/motion';
	import { BUY_URL } from './data';
</script>

<section class="fcta tt-section" aria-labelledby="fcta-title">
	<div class="fcta__bg" aria-hidden="true">
		<div class="fcta__grid grid-bg"></div>
		<div class="fcta__glow" {@attach parallax(-70)}></div>
	</div>

	<div class="tt-container fcta__inner">
		<p class="label fcta__kicker">
			<span class="fcta__kicker-rule" aria-hidden="true"></span>Your ninety days
		</p>
		<h2 id="fcta-title" class="fcta__title" data-split {@attach splitReveal({ stagger: 0.035 })}>
			The strongest traders manage the <span class="text-red">money</span> first.
		</h2>
		<p class="fcta__lede" data-anim {@attach reveal({ y: 22 })}>
			It starts with one call — an honest look at your finances, your goals, and the plan to get you
			there.
		</p>
		<div class="fcta__cta" data-anim {@attach reveal({ y: 22, delay: 0.05 })}>
			<Button href={BUY_URL} size="lg">Book a breakthrough call</Button>
		</div>
	</div>
</section>

<style>
	.fcta {
		position: relative;
		overflow: clip;
		background: var(--tt-black);
		text-align: center;
	}
	.fcta__bg {
		position: absolute;
		inset: 0;
		z-index: 0;
	}
	.fcta__grid {
		position: absolute;
		inset: 0;
		opacity: 0.35;
	}
	.fcta__glow {
		position: absolute;
		left: 50%;
		bottom: -55%;
		width: min(1400px, 130vw);
		height: 105vh;
		transform: translateX(-50%);
		background: radial-gradient(
			ellipse 46% 60% at 50% 100%,
			rgb(var(--tt-red-bright-rgb) / 0.3),
			rgb(var(--tt-red-rgb) / 0.4) 24%,
			transparent 66%
		);
		filter: blur(24px);
	}
	.fcta__inner {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		max-width: 60rem;
	}
	.fcta__kicker {
		display: inline-flex;
		align-items: center;
		gap: 0.9rem;
		color: var(--tt-mute);
	}
	.fcta__kicker-rule {
		width: 40px;
		height: 1px;
		background: var(--tt-red);
	}
	.fcta__title {
		margin-top: 1.6rem;
		font-size: var(--fs-h1);
		font-weight: 800;
		line-height: 0.98;
		letter-spacing: -0.03em;
		max-width: 18ch;
	}
	.fcta__lede {
		margin-top: 1.7rem;
		max-width: 46ch;
		font-size: var(--fs-lead);
		color: var(--tt-fog);
	}
	.fcta__cta {
		margin-top: 2.4rem;
	}
</style>
