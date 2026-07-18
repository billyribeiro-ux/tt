<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { reveal, splitReveal, parallax } from '$lib/motion';
	import ArrowUpRightIcon from 'phosphor-svelte/lib/ArrowUpRightIcon';

	const courseUrl = 'https://tricktrades.com/momentum-course';
</script>

<section class="mo-enroll" aria-labelledby="mo-enroll-title">
	<div class="mo-enroll__bg" aria-hidden="true">
		<div class="mo-enroll__grid grid-bg"></div>
		<div class="mo-enroll__glow" {@attach parallax(-60)}></div>
	</div>

	<div class="tt-container mo-enroll__inner">
		<p class="label mo-enroll__kicker">
			<span class="mo-enroll__rule" aria-hidden="true"></span>Enrollment
		</p>

		<h2
			id="mo-enroll-title"
			class="mo-enroll__title"
			data-split
			{@attach splitReveal({ stagger: 0.03 })}
		>
			The flagship. Coached by <span class="text-red">Pat.</span>
		</h2>

		<p class="mo-enroll__lede" data-anim {@attach reveal({ y: 22 })}>
			115 lessons, 15 modules, 14 bonus sessions and B.O.S.S. Carbon bundled in. Enrollment and
			current pricing are handled on the Trick Trades course page.
		</p>

		<div class="mo-enroll__cta" data-anim {@attach reveal({ y: 22, delay: 0.05 })}>
			<Button href={courseUrl}>Enroll on tricktrades.com</Button>
			<a class="mo-enroll__link" href="/day-trading-academy">
				Compare every course
				<ArrowUpRightIcon size={14} weight="bold" aria-hidden="true" />
			</a>
		</div>
	</div>
</section>

<style>
	.mo-enroll {
		position: relative;
		overflow: clip;
		padding-block: clamp(4.5rem, 3rem + 8vw, 9rem);
		background: var(--tt-black);
		text-align: center;
	}
	.mo-enroll__bg {
		position: absolute;
		inset: 0;
		z-index: 0;
	}
	.mo-enroll__grid {
		position: absolute;
		inset: 0;
		opacity: 0.3;
	}
	.mo-enroll__glow {
		position: absolute;
		left: 50%;
		bottom: -55%;
		width: min(1300px, 124vw);
		height: 100vh;
		transform: translateX(-50%);
		background: radial-gradient(
			ellipse 46% 60% at 50% 100%,
			rgb(var(--tt-red-bright-rgb) / 0.3),
			rgb(var(--tt-red-rgb) / 0.4) 24%,
			transparent 66%
		);
		filter: blur(24px);
	}
	.mo-enroll__inner {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		max-width: 54rem;
	}
	.mo-enroll__kicker {
		display: inline-flex;
		align-items: center;
		gap: 0.9rem;
		color: var(--tt-mute);
	}
	.mo-enroll__rule {
		width: 40px;
		height: 1px;
		background: var(--tt-red);
	}
	.mo-enroll__title {
		margin-top: 1.4rem;
		font-size: var(--fs-h2);
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.025em;
		color: #fff;
		text-wrap: balance;
	}
	.mo-enroll__lede {
		margin-top: 1.6rem;
		max-width: 52ch;
		font-size: var(--fs-lead);
		color: var(--tt-fog);
	}
	.mo-enroll__cta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 1.4rem;
		margin-top: 2.4rem;
	}
	.mo-enroll__link {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-family: var(--tt-font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--tt-fog);
		border-bottom: 1px solid transparent;
		transition:
			color 0.25s ease,
			border-color 0.25s ease;
	}
	.mo-enroll__link:hover {
		color: #fff;
		border-color: var(--tt-line-strong);
	}
	@media (prefers-reduced-motion: reduce) {
		.mo-enroll__link {
			transition: none;
		}
	}
</style>
