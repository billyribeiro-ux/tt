<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { reveal, splitReveal, parallax } from '$lib/motion';
	import CrownIcon from 'phosphor-svelte/lib/CrownIcon';
	import ArrowUpRightIcon from 'phosphor-svelte/lib/ArrowUpRightIcon';

	const courseUrl = 'https://tricktrades.com/crystal-ball-course';
	const goldUrl = '/crystal-ball-gold-edition-course';
</script>

<section class="cb-enroll" aria-labelledby="cb-enroll-title">
	<div class="cb-enroll__bg" aria-hidden="true">
		<div class="cb-enroll__glow" {@attach parallax(-50)}></div>
	</div>

	<div class="tt-container cb-enroll__inner">
		<div class="cb-enroll__copy">
			<p class="label cb-enroll__kicker">
				<span class="cb-enroll__rule" aria-hidden="true"></span>Best value
			</p>
			<h2
				id="cb-enroll-title"
				class="cb-enroll__title"
				data-split
				{@attach splitReveal({ stagger: 0.03 })}
			>
				Take both volumes and the <span class="text-red">bonus hour.</span>
			</h2>
			<p class="cb-enroll__lede" data-anim {@attach reveal({ y: 22 })}>
				The bundle pairs Volume 1 and Volume 2 with a live-trading bonus hour — the complete
				price-action education in one enrollment.
			</p>
			<div class="cb-enroll__cta" data-anim {@attach reveal({ y: 22, delay: 0.05 })}>
				<Button href={courseUrl}>Enroll — Bundle $649</Button>
				<a class="cb-enroll__gold" href={goldUrl}>
					<CrownIcon size={15} weight="fill" aria-hidden="true" />
					Explore the Gold Edition
					<ArrowUpRightIcon size={14} weight="bold" aria-hidden="true" />
				</a>
			</div>
		</div>
	</div>
</section>

<style>
	.cb-enroll {
		position: relative;
		overflow: clip;
		padding-block: clamp(4.5rem, 3rem + 8vw, 9rem);
		background: var(--tt-black);
	}
	.cb-enroll__bg {
		position: absolute;
		inset: 0;
		z-index: 0;
	}
	.cb-enroll__glow {
		position: absolute;
		left: -12%;
		bottom: -40%;
		width: min(1000px, 100vw);
		height: 90vh;
		background: radial-gradient(
			ellipse 50% 55% at 30% 100%,
			rgb(var(--tt-red-bright-rgb) / 0.22),
			rgb(var(--tt-red-rgb) / 0.32) 26%,
			transparent 64%
		);
		filter: blur(26px);
	}
	.cb-enroll__inner {
		position: relative;
		z-index: 1;
	}
	.cb-enroll__copy {
		max-width: 44rem;
	}
	.cb-enroll__kicker {
		display: inline-flex;
		align-items: center;
		gap: 0.9rem;
		color: var(--tt-mute);
	}
	.cb-enroll__rule {
		width: 40px;
		height: 1px;
		background: var(--tt-red);
	}
	.cb-enroll__title {
		margin-top: 1.4rem;
		font-size: var(--fs-h2);
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.025em;
		color: #fff;
	}
	.cb-enroll__lede {
		margin-top: 1.6rem;
		max-width: 52ch;
		font-size: var(--fs-lead);
		color: var(--tt-fog);
	}
	.cb-enroll__cta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1.4rem;
		margin-top: 2.4rem;
	}
	.cb-enroll__gold {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		font-family: var(--tt-font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--tt-gold);
		border-bottom: 1px solid transparent;
		transition:
			color 0.25s ease,
			border-color 0.25s ease;
	}
	.cb-enroll__gold:hover {
		color: #fff;
		border-color: rgb(var(--tt-red-bright-rgb) / 0.5);
	}
	@media (prefers-reduced-motion: reduce) {
		.cb-enroll__gold {
			transition: none;
		}
	}
</style>
