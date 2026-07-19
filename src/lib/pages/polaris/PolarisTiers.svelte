<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { reveal, splitReveal } from '$lib/motion';
	import CheckIcon from 'phosphor-svelte/lib/CheckIcon';
	import { BUY_URL, POLARIS_PRICE, POLARIS_PRICE_LABEL, tiers } from './data';
</script>

<section id="tiers" class="tiers tt-section" aria-labelledby="tiers-title">
	<div class="tiers__glow" aria-hidden="true"></div>

	<div class="tt-container">
		<header class="tiers__head">
			<div class="section-head">
				<span class="idx">01 / 03</span>
				<span class="rule"></span>
				<span class="label">Two paths</span>
			</div>
			<div class="tiers__headrow">
				<h2
					id="tiers-title"
					class="tiers__title"
					data-split
					{@attach splitReveal({ stagger: 0.03 })}
				>
					Same price. Pick the path your debt decides.
				</h2>
				<span class="tiers__badge">
					<span class="tiers__badge-dot" aria-hidden="true"></span>{POLARIS_PRICE_LABEL} / month · each
				</span>
			</div>
		</header>

		<div class="tiers__grid" data-anim-stagger {@attach reveal({ stagger: 0.14, y: 44 })}>
			{#each tiers as t, i (t.id)}
				{@const Icon = t.Icon}
				<article class="tier tier--{t.id}">
					<div class="tier__top">
						<span class="tier__ico" aria-hidden="true"><Icon size={26} weight="light" /></span>
						<span class="tier__idx num">0{i + 1} / 0{tiers.length}</span>
					</div>

					<h3 class="tier__name">{t.name}</h3>
					<p class="tier__for">
						<span class="tier__for-dot" aria-hidden="true"></span>{t.forWho}
					</p>

					<div class="tier__pricelock">
						<p class="tier__price">
							<span class="tier__cur">$</span><span class="num tier__amt">{POLARIS_PRICE}</span
							><span class="tier__cad">/ month</span>
						</p>
						<span class="tier__priceline" aria-hidden="true"></span>
						<span class="tier__focus label">{t.focus}</span>
					</div>

					<p class="tier__blurb">{t.blurb}</p>

					<div class="tier__cta">
						<Button href={BUY_URL} block>Book a breakthrough call</Button>
					</div>

					<hr class="tier__rule" />

					<ul class="tier__points">
						{#each t.points as point (point)}
							<li class="tier__point">
								<span class="tier__pico"><CheckIcon weight="bold" size={15} /></span>
								<span class="tier__ptxt">{point}</span>
							</li>
						{/each}
					</ul>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.tiers {
		position: relative;
		background: var(--tt-ink);
		overflow: clip;
		box-shadow:
			inset 0 1px 0 var(--tt-line),
			inset 0 -1px 0 var(--tt-line);
	}
	.tiers__glow {
		position: absolute;
		z-index: 0;
		top: 14%;
		left: -8%;
		width: 46vw;
		max-width: 620px;
		aspect-ratio: 1;
		background: radial-gradient(circle, rgb(var(--tt-red-rgb) / 0.18), transparent 62%);
		filter: blur(12px);
		pointer-events: none;
	}
	.tiers .tt-container {
		position: relative;
		z-index: 1;
	}
	.tiers__head {
		margin-bottom: clamp(2.4rem, 5vw, 3.6rem);
	}
	.tiers__headrow {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: space-between;
		gap: 1.2rem;
		margin-top: 0.4rem;
	}
	.tiers__title {
		font-size: var(--fs-h2);
		max-width: 18ch;
	}
	.tiers__badge {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		padding: 0.5rem 0.9rem;
		font-family: var(--tt-font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--tt-fog);
		border: 1px solid var(--tt-line);
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.02);
	}
	.tiers__badge-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--tt-gold);
		box-shadow: 0 0 10px var(--tt-gold);
	}

	.tiers__grid {
		display: grid;
		gap: clamp(1.3rem, 3vw, 1.9rem);
	}

	.tier {
		--accent: var(--tt-red-bright);
		--accent-soft: rgb(var(--tt-red-rgb) / 0.4);
		position: relative;
		display: flex;
		flex-direction: column;
		padding: clamp(1.6rem, 3vw, 2.3rem);
		border: 1px solid var(--tt-line);
		border-top: 2px solid var(--accent-soft);
		border-radius: var(--tt-radius-lg);
		background: var(--tt-ink-2);
		box-shadow: var(--tt-shadow-card);
	}
	.tier--launch {
		--accent: var(--tt-gold);
		--accent-soft: rgb(var(--tt-gold-rgb) / 0.5);
	}

	.tier__top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1.2rem;
	}
	.tier__ico {
		display: grid;
		place-items: center;
		width: 48px;
		height: 48px;
		border-radius: 12px;
		color: var(--accent);
		border: 1px solid var(--tt-line);
		background: rgba(255, 255, 255, 0.02);
	}
	.tier__idx {
		font-size: 0.7rem;
		letter-spacing: 0.18em;
		color: var(--tt-mute);
	}
	.tier__name {
		font-size: var(--fs-h3);
		color: var(--tt-white);
	}
	.tier__for {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		margin-top: 0.7rem;
		font-family: var(--tt-font-mono);
		font-size: 0.74rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--accent);
	}
	.tier__for-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--accent);
		box-shadow: 0 0 10px var(--accent);
	}

	/* Price lockup: the number is the moment. A short accent rule anchors it and
	   the focus line reads as the plan's descriptor, not a competing pill. */
	.tier__pricelock {
		margin-top: 1.5rem;
	}
	.tier__price {
		display: flex;
		align-items: baseline;
		gap: 0.12rem;
		color: var(--tt-white);
	}
	.tier__cur {
		align-self: flex-start;
		margin-top: 0.42rem;
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--accent);
	}
	.tier__amt {
		font-size: clamp(3rem, 1.9rem + 3.4vw, 4.2rem);
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.035em;
	}
	.tier__cad {
		margin-left: 0.35rem;
		font-family: var(--tt-font-mono);
		font-size: 0.85rem;
		color: var(--tt-mute);
	}
	.tier__priceline {
		display: block;
		width: 52px;
		height: 3px;
		margin: 0.9rem 0 0.75rem;
		border-radius: 999px;
		background: var(--accent);
		box-shadow: 0 0 14px var(--accent-soft);
	}
	.tier__focus {
		display: block;
		letter-spacing: 0.14em;
		color: var(--accent);
	}

	.tier__blurb {
		margin-top: 1.2rem;
		max-width: 42ch;
		color: var(--tt-fog);
		font-size: 0.98rem;
	}
	.tier__cta {
		margin-top: 1.6rem;
	}
	.tier__rule {
		margin: 1.6rem 0 1.2rem;
		border: 0;
		height: 1px;
		background: var(--tt-line);
	}
	.tier__points {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.72rem;
	}
	.tier__point {
		display: flex;
		align-items: flex-start;
		gap: 0.7rem;
	}
	.tier__pico {
		display: flex;
		flex: none;
		margin-top: 0.16em;
		color: var(--accent);
	}
	.tier__ptxt {
		font-size: 0.92rem;
		line-height: 1.5;
		color: var(--tt-fog);
	}

	@media (min-width: 768px) {
		.tiers__grid {
			grid-template-columns: 1fr 1fr;
			align-items: start;
		}
	}
</style>
