<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { reveal, splitReveal, parallax, counter, jumpTo } from '$lib/motion';
	import LightningIcon from 'phosphor-svelte/lib/LightningIcon';

	const courseUrl = 'https://tricktrades.com/momentum-course';

	const stats = [
		{ value: 15, suffix: '', label: 'Modules' },
		{ value: 115, suffix: '', label: 'Video lessons' },
		{ value: 14, suffix: '', label: 'Bonus lessons' }
	];
</script>

<section class="mo-hero" aria-labelledby="mo-hero-title">
	<div class="mo-hero__bg" aria-hidden="true">
		<div class="mo-hero__grid grid-bg"></div>
		<div class="mo-hero__glow" {@attach parallax(120)}></div>
		<span class="mo-hero__bolt"><LightningIcon size={340} weight="fill" aria-hidden="true" /></span>
	</div>

	<div class="tt-container mo-hero__inner">
		<p class="eyebrow mo-hero__kicker">
			<LightningIcon size={16} weight="fill" aria-hidden="true" />Flagship coaching
		</p>

		<h1
			id="mo-hero-title"
			class="mo-hero__title"
			data-split
			{@attach splitReveal({ stagger: 0.03 })}
		>
			<span class="mo-hero__word">Momentum.</span>
		</h1>

		<div class="mo-hero__foot" data-anim-stagger {@attach reveal({ stagger: 0.12, y: 26 })}>
			<p class="mo-hero__lede prose">
				The most complete program Trick Trades offers: high-level day-trading coaching with Pat
				“Trick” Mitchell. Fifteen modules and 115 video lessons that carry you from setup to
				professional execution, plus fourteen bonus lessons.
			</p>

			<div class="mo-hero__cta">
				<Button href={courseUrl}>Enroll in Momentum</Button>
				<a class="mo-hero__link" href="#mo-scope" onclick={(e) => jumpTo(e, '#mo-scope')}>
					What’s inside
				</a>
			</div>

			<dl class="mo-hero__stats">
				{#each stats as s, i (s.label)}
					<div class="mo-hero__stat" class:mo-hero__stat--ruled={i > 0}>
						<dt class="num mo-hero__stat-n">
							<span {@attach counter(s.value, (v) => Math.round(v).toLocaleString('en-US'))}
								>{s.value}</span
							>{s.suffix}
						</dt>
						<dd class="mo-hero__stat-l">{s.label}</dd>
					</div>
				{/each}
			</dl>
		</div>
	</div>
</section>

<style>
	.mo-hero {
		position: relative;
		overflow: clip;
		padding-top: calc(var(--tt-header-h) + clamp(2.5rem, 6vw, 5rem));
		padding-bottom: clamp(3.5rem, 6vw, 6rem);
	}
	.mo-hero__bg {
		position: absolute;
		inset: 0;
		z-index: 0;
	}
	.mo-hero__grid {
		position: absolute;
		inset: -12% 0 0;
		opacity: 0.4;
	}
	.mo-hero__glow {
		position: absolute;
		top: -18%;
		right: -14%;
		width: 68vw;
		height: 68vw;
		max-width: 860px;
		max-height: 860px;
		background: radial-gradient(circle, rgb(var(--tt-red-rgb) / 0.42), transparent 62%);
		filter: blur(24px);
	}
	.mo-hero__bolt {
		position: absolute;
		top: 50%;
		right: -3%;
		transform: translateY(-50%);
		color: rgb(var(--tt-red-bright-rgb) / 0.06);
		line-height: 0;
	}

	.mo-hero__inner {
		position: relative;
		z-index: 1;
	}
	.mo-hero__kicker {
		gap: 0.5rem;
	}
	.mo-hero__title {
		margin-top: 1.4rem;
		font-size: var(--fs-mega);
		font-weight: 800;
		line-height: 0.86;
		letter-spacing: -0.04em;
		color: #fff;
	}
	.mo-hero__word {
		display: inline-block;
	}
	.mo-hero__foot {
		display: grid;
		gap: clamp(1.8rem, 4vw, 2.6rem);
		margin-top: clamp(1.8rem, 4vw, 2.6rem);
	}
	.mo-hero__lede {
		max-width: 58ch;
	}
	.mo-hero__cta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1.4rem;
	}
	.mo-hero__link {
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
	.mo-hero__link:hover {
		color: #fff;
		border-color: var(--tt-line-strong);
	}
	.mo-hero__stats {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 1.4rem;
		margin: 0;
		padding-top: 1.8rem;
		border-top: 1px solid var(--tt-line);
	}
	.mo-hero__stat--ruled {
		padding-left: 1.4rem;
		border-left: 1px solid var(--tt-line-strong);
	}
	.mo-hero__stat-n {
		font-size: clamp(1.8rem, 1.2rem + 2.4vw, 3rem);
		font-weight: 800;
		line-height: 1;
		color: #fff;
	}
	.mo-hero__stat-l {
		margin-top: 0.4rem;
		font-size: 0.78rem;
		letter-spacing: 0.02em;
		color: var(--tt-mute);
	}

	@media (min-width: 1024px) {
		.mo-hero__foot {
			grid-template-columns: 1.15fr 0.85fr;
			align-items: end;
		}
		.mo-hero__stats {
			grid-column: 1 / -1;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.mo-hero__link {
			transition: none;
		}
	}
</style>
