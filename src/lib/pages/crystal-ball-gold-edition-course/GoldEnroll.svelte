<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { reveal, splitReveal, parallax } from '$lib/motion';
	import ArrowUpRightIcon from 'phosphor-svelte/lib/ArrowUpRightIcon';

	const courseUrl = 'https://tricktrades.com/crystal-ball-gold-edition-course';
</script>

<section class="gd-enroll" aria-labelledby="gd-enroll-title">
	<div class="gd-enroll__bg" aria-hidden="true">
		<div class="gd-enroll__grid grid-bg"></div>
		<div class="gd-enroll__glow" {@attach parallax(-60)}></div>
	</div>

	<div class="tt-container gd-enroll__inner">
		<p class="label gd-enroll__kicker">
			<span class="gd-enroll__rule" aria-hidden="true"></span>Enrollment
		</p>

		<h2 id="gd-enroll-title" class="gd-enroll__title" data-split {@attach splitReveal({ stagger: 0.03 })}>
			Nine months, live, with <span class="gd-enroll__accent">Pat.</span>
		</h2>

		<p class="gd-enroll__lede" data-anim {@attach reveal({ y: 22 })}>
			The Gold Edition runs on a live schedule and enrolls directly through Trick Trades. Head to the
			course page for the current cohort, the full curriculum and pricing.
		</p>

		<div class="gd-enroll__cta" data-anim {@attach reveal({ y: 22, delay: 0.05 })}>
			<Button href={courseUrl}>Enroll on tricktrades.com</Button>
			<a class="gd-enroll__link" href="/crystal-ball-course">
				Back to the Crystal Ball series
				<ArrowUpRightIcon size={14} weight="bold" aria-hidden="true" />
			</a>
		</div>
	</div>
</section>

<style>
	.gd-enroll {
		position: relative;
		overflow: clip;
		padding-block: clamp(4.5rem, 3rem + 8vw, 9rem);
		background: var(--tt-black);
		text-align: center;
	}
	.gd-enroll__bg {
		position: absolute;
		inset: 0;
		z-index: 0;
	}
	.gd-enroll__grid {
		position: absolute;
		inset: 0;
		opacity: 0.28;
	}
	.gd-enroll__glow {
		position: absolute;
		left: 50%;
		bottom: -55%;
		width: min(1200px, 120vw);
		height: 100vh;
		transform: translateX(-50%);
		background: radial-gradient(
			ellipse 46% 60% at 50% 100%,
			rgba(245, 196, 81, 0.2),
			rgba(230, 161, 47, 0.28) 24%,
			transparent 64%
		);
		filter: blur(26px);
	}
	.gd-enroll__inner {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		max-width: 52rem;
	}
	.gd-enroll__kicker {
		display: inline-flex;
		align-items: center;
		gap: 0.9rem;
		color: var(--tt-mute);
	}
	.gd-enroll__rule {
		width: 40px;
		height: 1px;
		background: var(--tt-gold);
	}
	.gd-enroll__title {
		margin-top: 1.4rem;
		font-size: var(--fs-h2);
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.025em;
		color: #fff;
		text-wrap: balance;
	}
	.gd-enroll__accent {
		color: var(--tt-gold);
	}
	.gd-enroll__lede {
		margin-top: 1.6rem;
		max-width: 50ch;
		font-size: var(--fs-lead);
		color: var(--tt-fog);
	}
	.gd-enroll__cta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 1.4rem;
		margin-top: 2.4rem;
	}
	.gd-enroll__link {
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
	.gd-enroll__link:hover {
		color: #fff;
		border-color: rgba(245, 196, 81, 0.5);
	}
	@media (prefers-reduced-motion: reduce) {
		.gd-enroll__link {
			transition: none;
		}
	}
</style>
