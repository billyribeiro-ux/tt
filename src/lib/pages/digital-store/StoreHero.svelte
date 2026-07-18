<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { reveal, splitReveal, parallax, jumpTo } from '$lib/motion';
	import DownloadSimpleIcon from 'phosphor-svelte/lib/DownloadSimpleIcon';
	import MonitorPlayIcon from 'phosphor-svelte/lib/MonitorPlayIcon';
	import LightningIcon from 'phosphor-svelte/lib/LightningIcon';
	import InfinityIcon from 'phosphor-svelte/lib/InfinityIcon';
	import { catalog, intPart, totalTitles } from './data';
</script>

<section class="tt-section store-hero" aria-labelledby="ds-title">
	<div class="store-hero__bg" aria-hidden="true">
		<div class="store-hero__grid grid-bg"></div>
		<div class="store-hero__glow" {@attach parallax(90)}></div>
	</div>

	<div class="tt-container store-hero__inner">
		<div class="store-hero__copy">
			<p class="store-hero__kicker label">
				<span class="store-hero__dot" aria-hidden="true"></span>Instant Downloads
			</p>

			<h1 id="ds-title" class="store-hero__title" data-split {@attach splitReveal({ stagger: 0.028 })}>
				Own the education. <span class="text-red">Forever.</span>
			</h1>

			<div class="store-hero__stack" data-anim-stagger {@attach reveal({ stagger: 0.12, y: 24 })}>
				<p class="store-hero__sub prose">
					Downloadable courses & masterclasses — instant access the moment you buy.
				</p>

				<div class="store-hero__cta">
					<Button href="#boss" onclick={(e) => jumpTo(e, '#boss')}>Browse the catalog</Button>
					<span class="store-hero__meta label">
						<LightningIcon size={14} weight="fill" />
						{totalTitles} titles · lifetime access
					</span>
				</div>
			</div>
		</div>

		<aside class="catalog" data-anim {@attach reveal({ y: 40, duration: 1.1 })}>
			<div class="catalog__head">
				<span class="label">Catalog</span>
			</div>
			<ul class="catalog__list">
				{#each catalog as c (c.label)}
					<li class="catalog__row">
						<span class="catalog__idx num">{c.idx}</span>
						<span class="catalog__name">{c.label}</span>
						<span class="catalog__count num">{c.count} titles</span>
						<span class="catalog__from num">from ${intPart(c.from)}</span>
					</li>
				{/each}
			</ul>
			<div class="catalog__foot">
				<span class="catalog__foot-item"><DownloadSimpleIcon size={14} /> Download</span>
				<span class="catalog__foot-item"><MonitorPlayIcon size={14} /> Stream</span>
				<span class="catalog__foot-item"><InfinityIcon size={14} /> Lifetime</span>
			</div>
		</aside>
	</div>
</section>

<style>
	.store-hero {
		position: relative;
		padding-top: calc(var(--tt-header-h) + clamp(2rem, 6vw, 4.5rem));
		overflow: clip;
	}
	.store-hero__bg {
		position: absolute;
		inset: 0;
		z-index: 0;
	}
	.store-hero__grid {
		position: absolute;
		inset: -10% 0 0;
		opacity: 0.45;
	}
	.store-hero__glow {
		position: absolute;
		top: -22%;
		right: -12%;
		width: 68vw;
		height: 68vw;
		max-width: 860px;
		max-height: 860px;
		background: radial-gradient(circle, rgb(var(--tt-red-rgb) / 0.4), transparent 62%);
		filter: blur(22px);
	}

	.store-hero__inner {
		position: relative;
		z-index: 1;
		display: grid;
		gap: clamp(2.5rem, 5vw, 4rem);
		align-items: end;
	}

	.store-hero__kicker {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		color: var(--tt-fog);
	}
	.store-hero__dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--tt-red-bright);
		box-shadow: 0 0 12px var(--tt-red-bright);
	}

	.store-hero__title {
		margin-top: 1.4rem;
		font-size: var(--fs-h1);
		font-weight: 800;
		letter-spacing: -0.03em;
		line-height: 0.98;
		color: #fff;
	}

	.store-hero__sub {
		margin-top: 1.5rem;
	}
	.store-hero__cta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1.2rem;
		margin-top: 2rem;
	}
	.store-hero__meta {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--tt-mute);
	}

	/* Terminal-style catalog index */
	.catalog {
		position: relative;
		padding: clamp(1.4rem, 3vw, 2rem);
		border: 1px solid var(--tt-line);
		border-radius: var(--tt-radius-lg);
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent 60%), var(--tt-ink-2);
		box-shadow: var(--tt-shadow-card);
	}
	.catalog__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 1rem;
		border-bottom: 1px solid var(--tt-line);
		color: var(--tt-mute-2);
	}
	.catalog__list {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.catalog__row {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: baseline;
		gap: 0.3rem 1rem;
		padding: 1rem 0;
		border-bottom: 1px solid var(--tt-line);
	}
	.catalog__idx {
		grid-row: span 2;
		align-self: center;
		font-size: 0.82rem;
		color: var(--tt-red-bright);
	}
	.catalog__name {
		font-family: var(--tt-font-display);
		font-size: 1.15rem;
		letter-spacing: 0.02em;
		color: #fff;
	}
	.catalog__count {
		font-size: 0.72rem;
		text-align: right;
		color: var(--tt-mute);
	}
	.catalog__from {
		grid-column: 2 / 4;
		font-size: 0.74rem;
		letter-spacing: 0.04em;
		color: var(--tt-fog);
	}
	.catalog__foot {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-top: 1.2rem;
		font-family: var(--tt-font-mono);
		font-size: 0.68rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--tt-mute-2);
	}
	.catalog__foot-item {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}

	@media (min-width: 900px) {
		.store-hero__inner {
			grid-template-columns: 1.08fr 0.92fr;
		}
		.store-hero__title {
			margin-top: 1.8rem;
		}
	}
</style>
