<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { reveal, splitReveal, parallax, counter, jumpTo, drawLine } from '$lib/motion';
	import { site } from '$lib/data/site';

	const webinarHref = 'https://tricktrades.com/size-up-webinar';
</script>

<section class="tt-section join-hero" aria-labelledby="join-hero-title">
	<div class="join-hero__bg" aria-hidden="true">
		<div class="join-hero__grid grid-bg"></div>
		<div class="join-hero__glow" {@attach parallax(110)}></div>
		<!-- A price line printing upward across the empty right field: the chart
		     literally sizing up. Decorative, drawn once on entry. -->
		<svg
			class="join-hero__chart"
			viewBox="0 0 560 300"
			fill="none"
			preserveAspectRatio="xMidYMid meet"
			{@attach drawLine({ scrub: false })}
		>
			<path
				d="M4 250 L74 232 L128 258 L196 186 L252 210 L322 148 L388 172 L452 92 L512 118 L556 34"
				stroke="var(--tt-red-bright)"
				stroke-width="2.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	</div>

	<div class="tt-container join-hero__inner">
		<p class="join-hero__kicker label">
			<span class="join-hero__live" aria-hidden="true"></span>Size UP! Membership
		</p>

		<h1
			id="join-hero-title"
			class="join-hero__title"
			data-split
			{@attach splitReveal({ stagger: 0.026 })}
		>
			Get the whole system.
			<span class="script join-hero__script">then size up.</span>
		</h1>

		<div class="join-hero__stack" data-anim-stagger {@attach reveal({ stagger: 0.12, y: 26 })}>
			<p class="join-hero__lede">
				More value, expertise and educational material (that works) than any other trading service
				you can find. <strong>Period.</strong>
			</p>

			<div class="join-hero__cta">
				<Button href="#pricing" onclick={(e) => jumpTo(e, '#pricing')}>See membership plans</Button>
				<Button href={webinarHref} variant="ghost">Watch the free webinar</Button>
			</div>

			<dl class="join-hero__trust">
				<div class="join-hero__trust-item">
					<dt class="num">
						<span {@attach counter(site.studentsTrained)}
							>{site.studentsTrained.toLocaleString('en-US')}</span
						>+
					</dt>
					<dd>Traders trained</dd>
				</div>
				<div class="join-hero__sep" aria-hidden="true"></div>
				<div class="join-hero__trust-item">
					<dt class="num">9:00 <span class="join-hero__unit">AM EST</span></dt>
					<dd>Live every trading day</dd>
				</div>
				<div class="join-hero__sep" aria-hidden="true"></div>
				<div class="join-hero__trust-item">
					<dt class="num">50+</dt>
					<dd>Boot Camp lessons</dd>
				</div>
			</dl>
		</div>
	</div>
</section>

<style>
	.join-hero {
		position: relative;
		padding-top: calc(var(--tt-header-h) + clamp(2.4rem, 7vw, 5.5rem));
		overflow: clip;
	}
	.join-hero__bg {
		position: absolute;
		inset: 0;
		z-index: 0;
	}
	.join-hero__grid {
		position: absolute;
		inset: -10% 0 0;
		opacity: 0.5;
	}
	.join-hero__glow {
		position: absolute;
		top: -22%;
		right: -12%;
		width: 72vw;
		height: 72vw;
		max-width: 920px;
		max-height: 920px;
		background: radial-gradient(circle, rgb(var(--tt-red-rgb) / 0.4), transparent 62%);
		filter: blur(22px);
	}
	.join-hero__chart {
		display: none;
	}

	.join-hero__inner {
		position: relative;
		z-index: 1;
	}
	.join-hero__kicker {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		color: var(--tt-fog);
	}
	.join-hero__live {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--tt-red-bright);
		box-shadow: 0 0 12px var(--tt-red-bright);
	}

	.join-hero__title {
		margin-top: 1.4rem;
		max-width: 15ch;
		font-size: var(--fs-h1);
		font-weight: 800;
		letter-spacing: -0.03em;
		line-height: 0.98;
		color: #fff;
	}
	.join-hero__script {
		display: block;
		margin-top: 0.08em;
		font-size: 1.14em;
		line-height: 0.8;
		color: var(--tt-red-bright);
	}

	.join-hero__lede {
		margin-top: 1.7rem;
		max-width: 46ch;
		font-size: var(--fs-lead);
		color: var(--tt-fog);
	}
	.join-hero__lede strong {
		color: #fff;
	}

	.join-hero__cta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.9rem;
		margin-top: 2rem;
	}

	.join-hero__trust {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 1.4rem;
		margin: 2.6rem 0 0;
		padding-top: 1.8rem;
		border-top: 1px solid var(--tt-line);
	}
	.join-hero__sep {
		width: 1px;
		height: 34px;
		background: var(--tt-line-strong);
	}
	.join-hero__trust-item dt {
		display: flex;
		align-items: baseline;
		gap: 0.12rem;
		font-size: clamp(1.4rem, 1rem + 1.8vw, 2rem);
		font-weight: 700;
		color: #fff;
		line-height: 1;
	}
	.join-hero__unit {
		font-size: 0.5em;
		letter-spacing: 0.06em;
		color: var(--tt-mute);
	}
	.join-hero__trust-item dd {
		margin: 0.34rem 0 0;
		font-size: 0.76rem;
		letter-spacing: 0.02em;
		color: var(--tt-mute);
	}

	@media (min-width: 768px) {
		.join-hero__title {
			margin-top: 1.8rem;
		}
	}

	@media (min-width: 1024px) {
		/* Only surface the chart where the right column is genuinely empty; below
		   this it would crowd the single-column stack. */
		.join-hero__chart {
			display: block;
			position: absolute;
			top: 19%;
			right: 1%;
			width: min(44vw, 600px);
			height: auto;
			opacity: 0.55;
			filter: drop-shadow(0 0 16px rgb(var(--tt-red-rgb) / 0.4));
		}
	}
</style>
