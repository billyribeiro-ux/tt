<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { reveal, splitReveal, parallax, jumpTo } from '$lib/motion';

	const enrollUrl = 'https://tricktrades.com/day-trading-bootcamp';
</script>

<section class="bc-hero" aria-labelledby="bc-hero-title">
	<div class="bc-hero__bg" aria-hidden="true">
		<div class="bc-hero__grid grid-bg"></div>
		<div class="bc-hero__glow" {@attach parallax(100)}></div>
	</div>

	<div class="tt-container bc-hero__inner">
		<div class="bc-hero__index" aria-hidden="true">
			<span class="num bc-hero__num">00</span>
			<span class="bc-hero__num-label label">Start here</span>
		</div>

		<div class="bc-hero__copy">
			<p class="eyebrow bc-hero__kicker">
				<span class="bc-hero__dot"></span>The Foundation Course
			</p>

			<h1
				id="bc-hero-title"
				class="bc-hero__title"
				data-split
				{@attach splitReveal({ stagger: 0.026 })}
			>
				Day Trading <span class="text-red">Boot Camp.</span>
			</h1>

			<div class="bc-hero__foot" data-anim-stagger {@attach reveal({ stagger: 0.12, y: 24 })}>
				<p class="bc-hero__lede prose">
					The starting line. 50+ game-changing lessons on the skills and the emotions behind every
					trade: the mechanics, the strategy and the mindset required to become a successful day
					trader, taught by Pat “Trick” Mitchell.
				</p>

				<div class="bc-hero__cta">
					<Button href={enrollUrl}>Enroll for $97</Button>
					<a class="bc-hero__link" href="#bc-inside" onclick={(e) => jumpTo(e, '#bc-inside')}>
						See what's inside
					</a>
				</div>

				<dl class="bc-hero__meta">
					<div class="bc-hero__metric">
						<dt class="num bc-hero__metric-n">50+</dt>
						<dd class="bc-hero__metric-l">Game-changing lessons</dd>
					</div>
					<div class="bc-hero__metric">
						<dt class="num bc-hero__metric-n">$97</dt>
						<dd class="bc-hero__metric-l">One-time · was $147</dd>
					</div>
					<div class="bc-hero__metric">
						<dt class="num bc-hero__metric-n">∞</dt>
						<dd class="bc-hero__metric-l">Lifetime access</dd>
					</div>
				</dl>
			</div>
		</div>
	</div>
</section>

<style>
	.bc-hero {
		position: relative;
		overflow: clip;
		padding-top: calc(var(--tt-header-h) + clamp(2.5rem, 6vw, 5rem));
		padding-bottom: clamp(3.5rem, 6vw, 6rem);
	}
	.bc-hero__bg {
		position: absolute;
		inset: 0;
		z-index: 0;
	}
	.bc-hero__grid {
		position: absolute;
		inset: -12% 0 0;
		opacity: 0.4;
	}
	.bc-hero__glow {
		position: absolute;
		top: -20%;
		left: -8%;
		width: 62vw;
		height: 62vw;
		max-width: 780px;
		max-height: 780px;
		background: radial-gradient(circle, rgb(var(--tt-red-rgb) / 0.4), transparent 62%);
		filter: blur(22px);
	}

	.bc-hero__inner {
		position: relative;
		z-index: 1;
		display: grid;
		gap: clamp(1.6rem, 4vw, 3rem);
	}

	.bc-hero__index {
		display: flex;
		align-items: baseline;
		gap: 1rem;
		padding-bottom: 1.4rem;
		border-bottom: 1px solid var(--tt-line);
	}
	.bc-hero__num {
		font-size: clamp(3rem, 1.4rem + 9vw, 8rem);
		font-weight: 800;
		line-height: 0.8;
		letter-spacing: -0.04em;
		color: transparent;
		-webkit-text-stroke: 1px var(--tt-line-strong);
	}
	.bc-hero__num-label {
		color: var(--tt-red-bright);
	}

	.bc-hero__kicker {
		gap: 0.6rem;
	}
	.bc-hero__dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--tt-red-bright);
		box-shadow: 0 0 12px var(--tt-red-bright);
	}
	.bc-hero__title {
		margin-top: 1.3rem;
		font-size: var(--fs-h1);
		font-weight: 800;
		line-height: 0.94;
		letter-spacing: -0.03em;
		color: #fff;
	}
	.bc-hero__foot {
		display: grid;
		gap: clamp(1.8rem, 4vw, 2.6rem);
		margin-top: clamp(1.8rem, 4vw, 2.6rem);
	}
	.bc-hero__lede {
		max-width: 56ch;
	}
	.bc-hero__cta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1.4rem;
	}
	.bc-hero__link {
		display: inline-flex;
		align-items: center;
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
	.bc-hero__link:hover {
		color: #fff;
		border-color: var(--tt-line-strong);
	}
	.bc-hero__meta {
		display: flex;
		flex-wrap: wrap;
		gap: clamp(1.6rem, 5vw, 3.2rem);
		margin: 0;
		padding-top: 1.8rem;
		border-top: 1px solid var(--tt-line);
	}
	.bc-hero__metric-n {
		font-size: clamp(1.8rem, 1.2rem + 2vw, 2.6rem);
		font-weight: 700;
		line-height: 1;
		color: #fff;
	}
	.bc-hero__metric-l {
		margin-top: 0.5rem;
		font-size: 0.78rem;
		letter-spacing: 0.02em;
		color: var(--tt-mute);
	}

	@media (min-width: 1024px) {
		.bc-hero__foot {
			grid-template-columns: 1.1fr 0.9fr;
			align-items: end;
		}
		.bc-hero__meta {
			grid-column: 1 / -1;
		}
	}
</style>
