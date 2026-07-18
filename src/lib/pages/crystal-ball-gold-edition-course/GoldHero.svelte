<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { reveal, splitReveal, parallax } from '$lib/motion';
	import CrownIcon from 'phosphor-svelte/lib/CrownIcon';

	const courseUrl = 'https://tricktrades.com/crystal-ball-gold-edition-course';
</script>

<section class="gd-hero" aria-labelledby="gd-hero-title">
	<div class="gd-hero__bg" aria-hidden="true">
		<div class="gd-hero__glow" {@attach parallax(90)}></div>
	</div>

	<div class="tt-container gd-hero__inner">
		<span class="gd-hero__reg gd-hero__reg--tl" aria-hidden="true"></span>
		<span class="gd-hero__reg gd-hero__reg--tr" aria-hidden="true"></span>
		<span class="gd-hero__reg gd-hero__reg--bl" aria-hidden="true"></span>
		<span class="gd-hero__reg gd-hero__reg--br" aria-hidden="true"></span>

		<p class="eyebrow gd-hero__kicker">
			<CrownIcon size={16} weight="fill" aria-hidden="true" />Gold Edition
		</p>

		<h1 id="gd-hero-title" class="gd-hero__title" data-split {@attach splitReveal({ stagger: 0.028 })}>
			Crystal Ball:
			<span class="gd-hero__gold">Gold Edition.</span>
		</h1>

		<div class="gd-hero__foot" data-anim-stagger {@attach reveal({ stagger: 0.12, y: 24 })}>
			<p class="gd-hero__lede prose">
				The most advanced tier of the Crystal Ball series: natural-movement theory, taught live.
				Nine months of live trades alongside Pat Mitchell as the market reveals itself in real time.
			</p>

			<dl class="gd-hero__meta">
				<div class="gd-hero__metric">
					<dt class="num gd-hero__metric-n">09</dt>
					<dd class="gd-hero__metric-l">Months of live trades</dd>
				</div>
				<div class="gd-hero__metric">
					<dt class="num gd-hero__metric-n">Live</dt>
					<dd class="gd-hero__metric-l">Taught in real time</dd>
				</div>
			</dl>

			<div class="gd-hero__cta">
				<Button href={courseUrl}>Enroll &amp; full details</Button>
			</div>
		</div>
	</div>
</section>

<style>
	.gd-hero {
		position: relative;
		overflow: clip;
		padding-top: calc(var(--tt-header-h) + clamp(3rem, 7vw, 6rem));
		padding-bottom: clamp(3.5rem, 6vw, 6rem);
	}
	.gd-hero__bg {
		position: absolute;
		inset: 0;
		z-index: 0;
	}
	.gd-hero__glow {
		position: absolute;
		top: -22%;
		left: 50%;
		width: 70vw;
		height: 70vw;
		max-width: 860px;
		max-height: 860px;
		transform: translateX(-50%);
		background: radial-gradient(circle, rgba(245, 196, 81, 0.16), transparent 60%);
		filter: blur(26px);
	}
	.gd-hero__inner {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		max-width: 60rem;
		text-align: center;
		padding: clamp(2rem, 5vw, 4rem) 0;
	}
	.gd-hero__reg {
		position: absolute;
		width: 18px;
		height: 18px;
		border-color: rgba(245, 196, 81, 0.5);
		border-style: solid;
		border-width: 0;
		pointer-events: none;
	}
	.gd-hero__reg--tl {
		top: 0;
		left: 0;
		border-top-width: 1px;
		border-left-width: 1px;
	}
	.gd-hero__reg--tr {
		top: 0;
		right: 0;
		border-top-width: 1px;
		border-right-width: 1px;
	}
	.gd-hero__reg--bl {
		bottom: 0;
		left: 0;
		border-bottom-width: 1px;
		border-left-width: 1px;
	}
	.gd-hero__reg--br {
		bottom: 0;
		right: 0;
		border-bottom-width: 1px;
		border-right-width: 1px;
	}
	.gd-hero__kicker {
		gap: 0.5rem;
		color: var(--tt-gold);
	}
	.gd-hero__title {
		margin-top: 1.4rem;
		font-size: var(--fs-h1);
		font-weight: 800;
		line-height: 0.96;
		letter-spacing: -0.03em;
		color: #fff;
		text-wrap: balance;
	}
	.gd-hero__gold {
		display: block;
		margin-top: 0.1em;
		background: linear-gradient(100deg, var(--tt-gold), var(--tt-amber) 70%, #fff 130%);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}
	.gd-hero__foot {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: clamp(1.8rem, 4vw, 2.6rem);
		margin-top: clamp(1.8rem, 4vw, 2.6rem);
	}
	.gd-hero__lede {
		max-width: 54ch;
	}
	.gd-hero__meta {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: clamp(1.6rem, 5vw, 3.5rem);
		margin: 0;
		padding-top: 1.8rem;
		border-top: 1px solid rgba(245, 196, 81, 0.24);
	}
	.gd-hero__metric-n {
		font-size: clamp(1.8rem, 1.2rem + 2vw, 2.6rem);
		font-weight: 700;
		line-height: 1;
		color: var(--tt-gold);
	}
	.gd-hero__metric-l {
		margin-top: 0.5rem;
		font-size: 0.78rem;
		letter-spacing: 0.02em;
		color: var(--tt-mute);
	}
	.gd-hero__cta {
		margin-top: 0.4rem;
	}
</style>
