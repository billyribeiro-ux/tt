<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { reveal, splitReveal, parallax } from '$lib/motion';
	import ArrowUpRightIcon from 'phosphor-svelte/lib/ArrowUpRightIcon';

	const enrollUrl = 'https://tricktrades.com/day-trading-bootcamp';
</script>

<section class="bc-enroll" aria-labelledby="bc-enroll-title">
	<div class="bc-enroll__bg" aria-hidden="true">
		<div class="bc-enroll__grid grid-bg"></div>
		<div class="bc-enroll__glow" {@attach parallax(-60)}></div>
	</div>

	<div class="tt-container bc-enroll__inner">
		<p class="label bc-enroll__kicker">
			<span class="bc-enroll__rule" aria-hidden="true"></span>Enrollment
		</p>

		<h2
			id="bc-enroll-title"
			class="bc-enroll__title"
			data-split
			{@attach splitReveal({ stagger: 0.03 })}
		>
			Everything starts <span class="text-red">here.</span>
		</h2>

		<div class="bc-enroll__ticket" data-anim {@attach reveal({ y: 30 })}>
			<div class="bc-enroll__price">
				<span class="bc-enroll__cur">$</span><span class="num bc-enroll__amt">97</span>
				<del class="bc-enroll__was num">$147</del>
			</div>
			<dl class="bc-enroll__specs">
				<div class="bc-enroll__spec">
					<dt class="label">Format</dt>
					<dd>50+ self-paced lessons</dd>
				</div>
				<div class="bc-enroll__spec">
					<dt class="label">Access</dt>
					<dd>Lifetime · every device</dd>
				</div>
			</dl>
			<div class="bc-enroll__cta">
				<Button href={enrollUrl}>Enroll in Boot Camp</Button>
			</div>
		</div>

		<p class="bc-enroll__member" data-anim {@attach reveal({ y: 20, delay: 0.05 })}>
			Already included in every Size UP membership.
			<a class="bc-enroll__member-link" href="/size-up-join">
				Explore membership <ArrowUpRightIcon size={14} weight="bold" aria-hidden="true" />
			</a>
		</p>
	</div>
</section>

<style>
	.bc-enroll {
		position: relative;
		overflow: clip;
		padding-block: clamp(4.5rem, 3rem + 8vw, 9rem);
		background: var(--tt-black);
		text-align: center;
	}
	.bc-enroll__bg {
		position: absolute;
		inset: 0;
		z-index: 0;
	}
	.bc-enroll__grid {
		position: absolute;
		inset: 0;
		opacity: 0.3;
	}
	.bc-enroll__glow {
		position: absolute;
		left: 50%;
		bottom: -55%;
		width: min(1200px, 120vw);
		height: 100vh;
		transform: translateX(-50%);
		background: radial-gradient(
			ellipse 46% 60% at 50% 100%,
			rgb(var(--tt-red-bright-rgb) / 0.28),
			rgb(var(--tt-red-rgb) / 0.4) 24%,
			transparent 66%
		);
		filter: blur(24px);
	}
	.bc-enroll__inner {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		max-width: 52rem;
	}
	.bc-enroll__kicker {
		display: inline-flex;
		align-items: center;
		gap: 0.9rem;
		color: var(--tt-mute);
	}
	.bc-enroll__rule {
		width: 40px;
		height: 1px;
		background: var(--tt-red);
	}
	.bc-enroll__title {
		margin-top: 1.4rem;
		font-size: var(--fs-h2);
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.025em;
		color: #fff;
		text-wrap: balance;
	}
	.bc-enroll__ticket {
		display: grid;
		gap: clamp(1.6rem, 4vw, 2.4rem);
		align-items: center;
		margin-top: clamp(2.4rem, 5vw, 3.4rem);
		padding: clamp(1.8rem, 4vw, 2.6rem);
		border: 1px solid rgb(var(--tt-red-rgb) / 0.4);
		border-radius: var(--tt-radius-lg);
		background:
			linear-gradient(180deg, rgb(var(--tt-red-rgb) / 0.1), transparent 46%), var(--tt-ink-2);
		box-shadow: var(--tt-shadow-card);
	}
	.bc-enroll__price {
		display: flex;
		align-items: baseline;
		justify-content: center;
		gap: 0.6rem;
		color: #fff;
	}
	.bc-enroll__cur {
		font-size: 1.4rem;
		font-weight: 700;
		color: var(--tt-fog);
	}
	.bc-enroll__amt {
		font-size: clamp(3rem, 2rem + 5vw, 5rem);
		font-weight: 800;
		line-height: 0.9;
		letter-spacing: -0.03em;
	}
	.bc-enroll__was {
		font-size: 1.1rem;
		color: var(--tt-mute-2);
		text-decoration-line: line-through;
	}
	.bc-enroll__specs {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1.4rem 2.4rem;
		margin: 0;
		padding-block: 1.4rem;
		border-top: 1px solid var(--tt-line);
		border-bottom: 1px solid var(--tt-line);
	}
	.bc-enroll__spec dd {
		margin: 0.5rem 0 0;
		font-size: 0.95rem;
		color: var(--tt-fog);
	}
	.bc-enroll__member {
		display: inline-flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 0.6rem;
		margin-top: 1.8rem;
		font-size: 0.9rem;
		color: var(--tt-mute);
	}
	.bc-enroll__member-link {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		font-family: var(--tt-font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--tt-fog);
		border-bottom: 1px solid transparent;
		transition:
			color 0.25s ease,
			border-color 0.25s ease;
	}
	.bc-enroll__member-link:hover {
		color: #fff;
		border-color: var(--tt-line-strong);
	}

	@media (min-width: 768px) {
		.bc-enroll__ticket {
			grid-template-columns: auto 1fr auto;
			text-align: left;
			gap: clamp(1.8rem, 4vw, 3rem);
		}
		.bc-enroll__specs {
			justify-content: flex-start;
			padding-block: 0;
			padding-inline: clamp(1.8rem, 4vw, 3rem);
			border-block: 0;
			border-inline: 1px solid var(--tt-line);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.bc-enroll__member-link {
			transition: none;
		}
	}
</style>
