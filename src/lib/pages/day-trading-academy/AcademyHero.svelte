<script lang="ts">
	import { reveal, splitReveal, parallax } from '$lib/motion';
	import { courses } from './data';
</script>

<section class="tt-section aca-hero" aria-labelledby="aca-hero-title">
	<div class="aca-hero__bg" aria-hidden="true">
		<div class="aca-hero__grid grid-bg"></div>
		<div class="aca-hero__glow" {@attach parallax(90)}></div>
	</div>

	<div class="tt-container aca-hero__inner">
		<p class="eyebrow aca-hero__kicker">
			<span class="aca-hero__dot" aria-hidden="true"></span>The Academy
		</p>

		<h1
			id="aca-hero-title"
			class="aca-hero__title"
			data-split
			{@attach splitReveal({ stagger: 0.026 })}
		>
			A full library of courses — from fundamentals to
			<span class="text-red">price-action mastery.</span>
		</h1>

		<div class="aca-hero__foot" data-anim-stagger {@attach reveal({ stagger: 0.12, y: 24 })}>
			<p class="aca-hero__lede prose">
				Built on real trading experience, not theory. Six programs that carry you from your first
				green candle to reading price action before the move happens — self-paced, and taught by Pat
				“Trick” Mitchell.
			</p>

			<dl class="aca-hero__meta">
				<div class="aca-hero__metric">
					<dt class="num aca-hero__metric-n">0{courses.length}</dt>
					<dd class="aca-hero__metric-l">Courses in the library</dd>
				</div>
				<div class="aca-hero__metric">
					<dt class="num aca-hero__metric-n">115</dt>
					<dd class="aca-hero__metric-l">Video lessons in Momentum</dd>
				</div>
				<div class="aca-hero__metric">
					<dt class="num aca-hero__metric-n">10+ yrs</dt>
					<dd class="aca-hero__metric-l">Of proven strategy</dd>
				</div>
			</dl>
		</div>
	</div>
</section>

<style>
	.aca-hero {
		position: relative;
		overflow: clip;
		padding-top: calc(var(--tt-header-h) + clamp(2.5rem, 6vw, 5rem));
	}
	.aca-hero__bg {
		position: absolute;
		inset: 0;
		z-index: 0;
	}
	.aca-hero__grid {
		position: absolute;
		inset: -12% 0 0;
		opacity: 0.45;
	}
	.aca-hero__glow {
		position: absolute;
		top: -18%;
		right: -12%;
		width: 66vw;
		height: 66vw;
		max-width: 820px;
		max-height: 820px;
		background: radial-gradient(circle, rgb(var(--tt-red-rgb) / 0.4), transparent 62%);
		filter: blur(22px);
	}

	.aca-hero__inner {
		position: relative;
		z-index: 1;
	}
	.aca-hero__kicker {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
	}
	.aca-hero__dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--tt-red-bright);
		box-shadow: 0 0 12px var(--tt-red-bright);
	}
	.aca-hero__title {
		margin-top: 1.4rem;
		max-width: 18ch;
		font-size: var(--fs-h1);
		font-weight: 800;
		line-height: 0.98;
		letter-spacing: -0.03em;
		color: #fff;
	}
	.aca-hero__foot {
		display: grid;
		gap: clamp(2rem, 5vw, 3.5rem);
		margin-top: clamp(2rem, 4vw, 3rem);
	}
	.aca-hero__lede {
		max-width: 54ch;
	}
	.aca-hero__meta {
		display: flex;
		flex-wrap: wrap;
		gap: clamp(1.6rem, 5vw, 3.5rem);
		margin: 0;
		padding-top: 1.8rem;
		border-top: 1px solid var(--tt-line);
	}
	.aca-hero__metric-n {
		font-size: clamp(1.8rem, 1.2rem + 2vw, 2.6rem);
		font-weight: 700;
		line-height: 1;
		color: #fff;
	}
	.aca-hero__metric-l {
		margin-top: 0.5rem;
		font-size: 0.78rem;
		letter-spacing: 0.02em;
		color: var(--tt-mute);
	}

	@media (min-width: 900px) {
		.aca-hero__foot {
			grid-template-columns: 1.05fr 0.95fr;
			align-items: end;
		}
		.aca-hero__meta {
			padding-top: 0;
			border-top: 0;
			justify-content: flex-end;
			text-align: right;
		}
	}
</style>
