<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { reveal, splitReveal, parallax, jumpTo } from '$lib/motion';
	import StarIcon from 'phosphor-svelte/lib/StarIcon';
	import CompassIcon from 'phosphor-svelte/lib/CompassIcon';
	import { BUY_URL, spec } from './data';
</script>

<section class="phero" aria-label="Polaris financial coaching">
	<div class="phero__bg" aria-hidden="true">
		<div class="phero__grid grid-bg"></div>
		<div class="phero__glow" {@attach parallax(90)}></div>
	</div>

	<div class="tt-container phero__inner">
		<div class="phero__copy">
			<p class="eyebrow phero__eyebrow">
				<StarIcon size={15} weight="fill" aria-hidden="true" />Financial coaching
			</p>

			<h1 class="phero__title" data-split {@attach splitReveal({ stagger: 0.03 })}>
				Trade from a position of <span class="text-red">strength.</span>
			</h1>

			<div class="phero__stack" data-anim-stagger {@attach reveal({ stagger: 0.12, y: 26 })}>
				<p class="phero__lede">
					The market punishes traders who trade scared money. <strong>Polaris</strong> is a 90-day, 1:1
					financial and budget coaching program built to fix the thing behind the blowups — so you stop
					overleveraging and start managing risk like a professional.
				</p>

				<div class="phero__cta">
					<Button href={BUY_URL}>Book a breakthrough call</Button>
					<Button href="#process" variant="ghost" onclick={(e) => jumpTo(e, '#process')}>
						See how it works
					</Button>
				</div>
			</div>
		</div>

		<aside class="phero__spec" data-anim {@attach reveal({ y: 44, scale: 0.98, duration: 1.15 })}>
			<div class="phero__spec-top">
				<span class="label">The engagement</span>
				<span class="phero__compass" aria-hidden="true">
					<CompassIcon size={20} weight="bold" />
				</span>
			</div>
			<dl class="phero__spec-list">
				{#each spec as row (row.k)}
					<div class="phero__spec-row">
						<dt class="label phero__spec-k">{row.k}</dt>
						<dd class="phero__spec-v">{row.v}</dd>
					</div>
				{/each}
			</dl>
			<p class="phero__spec-band num" aria-hidden="true">POLARIS · YOUR FIXED POINT</p>
		</aside>
	</div>
</section>

<style>
	.phero {
		position: relative;
		padding-top: calc(var(--tt-header-h) + clamp(2rem, 6vw, 5rem));
		padding-bottom: clamp(3rem, 6vw, 5rem);
		overflow: clip;
	}
	.phero__bg {
		position: absolute;
		inset: 0;
		z-index: 0;
	}
	.phero__grid {
		position: absolute;
		inset: -10% 0 0;
		opacity: 0.45;
	}
	.phero__glow {
		position: absolute;
		top: -18%;
		right: -12%;
		width: 68vw;
		height: 68vw;
		max-width: 860px;
		max-height: 860px;
		background: radial-gradient(circle, rgb(var(--tt-red-rgb) / 0.38), transparent 62%);
		filter: blur(22px);
	}
	.phero__inner {
		position: relative;
		z-index: 1;
		display: grid;
		gap: clamp(2.5rem, 5vw, 4rem);
		align-items: center;
	}
	.phero__eyebrow {
		gap: 0.5em;
	}
	.phero__title {
		margin-top: 1.5rem;
		font-size: var(--fs-h1);
		font-weight: 800;
		letter-spacing: -0.03em;
		line-height: 0.98;
		color: #fff;
		max-width: 14ch;
	}
	.phero__lede {
		margin-top: 1.7rem;
		max-width: 54ch;
		font-size: var(--fs-lead);
		color: var(--tt-fog);
	}
	.phero__lede strong {
		color: #fff;
		font-weight: 600;
	}
	.phero__cta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.9rem;
		margin-top: 2.1rem;
	}
	.phero__spec {
		position: relative;
		padding: clamp(1.5rem, 3vw, 2.1rem);
		border: 1px solid var(--tt-line);
		border-radius: var(--tt-radius-lg);
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent 45%),
			var(--tt-ink-2);
		box-shadow: var(--tt-shadow-card);
	}
	.phero__spec-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1.2rem;
	}
	.phero__compass {
		display: grid;
		place-items: center;
		width: 38px;
		height: 38px;
		border-radius: 10px;
		color: var(--tt-gold);
		border: 1px solid var(--tt-line);
		background: rgba(245, 196, 81, 0.08);
	}
	.phero__spec-list {
		margin: 0;
		display: flex;
		flex-direction: column;
	}
	.phero__spec-row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.85rem 0;
		border-top: 1px solid var(--tt-line);
	}
	.phero__spec-row:first-child {
		border-top: 0;
	}
	.phero__spec-k {
		color: var(--tt-mute);
	}
	.phero__spec-v {
		font-family: var(--tt-font-body);
		font-weight: 600;
		font-size: 0.98rem;
		color: var(--tt-white);
		text-align: right;
	}
	.phero__spec-band {
		margin-top: 1.4rem;
		padding-top: 1.1rem;
		border-top: 1px solid var(--tt-line);
		font-size: 0.68rem;
		letter-spacing: 0.22em;
		color: var(--tt-gold);
	}
	@media (min-width: 940px) {
		.phero__inner {
			grid-template-columns: 1.1fr 0.9fr;
		}
	}
</style>
