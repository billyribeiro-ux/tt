<script lang="ts">
	import { reveal, splitReveal, parallax, counter } from '$lib/motion';
	import { site } from '$lib/data/site';
</script>

<section class="t-hero" aria-label="Trick Trades testimonials">
	<div class="t-hero__bg" aria-hidden="true">
		<div class="t-hero__grid grid-bg"></div>
		<div class="t-hero__glow" {@attach parallax(120)}></div>
	</div>

	<div class="tt-container t-hero__inner">
		<p class="t-hero__kicker label">
			<span class="t-hero__dot" aria-hidden="true"></span>Testimonials · In their words
		</p>

		<h1 class="t-hero__title" data-split {@attach splitReveal({ stagger: 0.03 })}>
			The proof is the <span class="text-red">people.</span>
		</h1>

		<div class="t-hero__stack" data-anim-stagger {@attach reveal({ stagger: 0.12, y: 26 })}>
			<p class="t-hero__lede">
				Truck drivers, nurses, IT consultants — real members who worked the process and put it in
				their own words. No paid actors, no star ratings, no invented scores. Just what a few of the
				traders alongside you had to say about the education and the mentoring.
			</p>

			<dl class="t-hero__stats">
				<div class="t-hero__stat">
					<dt class="num">
						<span {@attach counter(site.studentsTrained)}
							>{site.studentsTrained.toLocaleString('en-US')}</span
						>+
					</dt>
					<dd>Traders trained</dd>
				</div>
				<span class="t-hero__stat-sep" aria-hidden="true"></span>
				<div class="t-hero__stat">
					<dt class="num">10+ yrs</dt>
					<dd>Proven strategy</dd>
				</div>
			</dl>
		</div>
	</div>
</section>

<style>
	.t-hero {
		position: relative;
		padding-top: calc(var(--tt-header-h) + clamp(2rem, 6vw, 5rem));
		padding-bottom: clamp(2.5rem, 5vw, 4rem);
		overflow: clip;
	}
	.t-hero__bg {
		position: absolute;
		inset: 0;
		z-index: 0;
	}
	.t-hero__grid {
		position: absolute;
		inset: -10% 0 0;
		opacity: 0.5;
	}
	.t-hero__glow {
		position: absolute;
		top: -20%;
		right: -10%;
		width: 68vw;
		height: 68vw;
		max-width: 860px;
		max-height: 860px;
		background: radial-gradient(circle, rgb(var(--tt-red-rgb) / 0.4), transparent 62%);
		filter: blur(20px);
	}
	.t-hero__inner {
		position: relative;
		z-index: 1;
	}
	.t-hero__kicker {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		color: var(--tt-fog);
	}
	.t-hero__dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--tt-red-bright);
		box-shadow: 0 0 12px var(--tt-red-bright);
	}
	.t-hero__title {
		margin-top: 1.4rem;
		font-size: var(--fs-h1);
		font-weight: 800;
		letter-spacing: -0.03em;
		line-height: 0.98;
		color: #fff;
		max-width: 14ch;
	}
	.t-hero__lede {
		margin-top: 1.6rem;
		max-width: 60ch;
		font-size: var(--fs-lead);
		color: var(--tt-fog);
	}
	.t-hero__stats {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 1.4rem;
		margin: 2.6rem 0 0;
		padding-top: 1.8rem;
		border-top: 1px solid var(--tt-line);
	}
	.t-hero__stat-sep {
		width: 1px;
		height: 38px;
		background: var(--tt-line-strong);
	}
	.t-hero__stat dt {
		font-size: clamp(1.6rem, 1rem + 2.2vw, 2.4rem);
		font-weight: 700;
		color: #fff;
		line-height: 1;
	}
	.t-hero__stat dd {
		margin-top: 0.4rem;
		font-family: var(--tt-font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--tt-mute);
	}
</style>
