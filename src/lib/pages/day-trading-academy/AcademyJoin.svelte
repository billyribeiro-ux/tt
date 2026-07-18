<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { reveal, splitReveal, parallax } from '$lib/motion';
	import ArrowUpRightIcon from 'phosphor-svelte/lib/ArrowUpRightIcon';
</script>

<section class="tt-section join" aria-labelledby="join-title">
	<div class="join__bg" aria-hidden="true">
		<div class="join__grid grid-bg"></div>
		<div class="join__glow" {@attach parallax(-60)}></div>
	</div>

	<div class="tt-container join__inner">
		<p class="label join__kicker">
			<span class="join__rule" aria-hidden="true"></span>Beyond the courses
		</p>

		<h2 id="join-title" class="join__title" data-split {@attach splitReveal({ stagger: 0.03 })}>
			Prefer daily live guidance? <span class="text-red">Join the membership.</span>
		</h2>

		<p class="join__lede" data-anim {@attach reveal({ y: 22 })}>
			Courses give you the playbook. The Size UP membership puts you in the room every morning: a
			live pre-market plan, a nightly video watch list, and a 24/7 community that answers.
		</p>

		<div class="join__cta" data-anim {@attach reveal({ y: 22, delay: 0.05 })}>
			<Button href="/size-up-join">Explore membership</Button>
			<a class="join__link" href="/size-up-join">
				See what's included <ArrowUpRightIcon size={15} weight="bold" aria-hidden="true" />
			</a>
		</div>
	</div>
</section>

<style>
	.join {
		position: relative;
		overflow: clip;
		background: var(--tt-black);
		text-align: center;
	}
	.join__bg {
		position: absolute;
		inset: 0;
		z-index: 0;
	}
	.join__grid {
		position: absolute;
		inset: 0;
		opacity: 0.32;
	}
	.join__glow {
		position: absolute;
		left: 50%;
		bottom: -55%;
		width: min(1400px, 128vw);
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
	.join__inner {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		max-width: 54rem;
	}
	.join__kicker {
		display: inline-flex;
		align-items: center;
		gap: 0.9rem;
		color: var(--tt-mute);
	}
	.join__rule {
		width: 40px;
		height: 1px;
		background: var(--tt-red);
	}
	.join__title {
		margin-top: 1.4rem;
		font-size: var(--fs-h2);
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.025em;
		text-wrap: balance;
	}
	.join__lede {
		margin-top: 1.6rem;
		max-width: 48ch;
		font-size: var(--fs-lead);
		color: var(--tt-fog);
	}
	.join__cta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 1.4rem;
		margin-top: 2.4rem;
	}
	.join__link {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-family: var(--tt-font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--tt-fog);
		border-bottom: 1px solid transparent;
		transition:
			color 0.25s ease,
			border-color 0.25s ease;
	}
	.join__link:hover {
		color: #fff;
		border-color: var(--tt-line-strong);
	}

	@media (prefers-reduced-motion: reduce) {
		.join__link {
			transition: none;
		}
	}
</style>
