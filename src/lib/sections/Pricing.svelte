<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { reveal, splitReveal, tilt } from '$lib/motion';
	import { plans } from '$lib/data/site';
	import CheckIcon from 'phosphor-svelte/lib/CheckIcon';
	import CheckCircleIcon from 'phosphor-svelte/lib/CheckCircleIcon';
	import ShieldCheckIcon from 'phosphor-svelte/lib/ShieldCheckIcon';
</script>

<section id="pricing" class="tt-section price" aria-labelledby="price-title">
	<div class="price__glow" aria-hidden="true"></div>

	<div class="tt-container">
		<header class="price__head">
			<div class="section-head price__bar" data-anim {@attach reveal({ y: 16, duration: 0.65 })}>
				<span class="idx">11 / 13</span>
				<span class="label">Membership</span>
				<span class="rule" aria-hidden="true"></span>
			</div>

			<div class="price__headrow">
				<h2 id="price-title" class="price__title" data-split {@attach splitReveal({ stagger: 0.026 })}>
					Pricing plan — unbeatable value.
				</h2>

				<span
					class="price__billing"
					data-anim
					{@attach reveal({ y: 18, duration: 0.75, delay: 0.1 })}
				>
					<span class="price__billing-dot" aria-hidden="true"></span>
					Monthly billing
				</span>
			</div>
		</header>

		<div class="price__grid" data-anim-stagger {@attach reveal({ stagger: 0.14, y: 44 })}>
			{#each plans as plan, i (plan.id)}
				<article class="plan" class:plan--featured={plan.featured} {@attach tilt(4)}>
					{#if plan.featured}
						<span class="plan__ribbon">Most Popular</span>
					{/if}

					<div class="plan__head">
						<span class="plan__idx num">0{i + 1} / 0{plans.length}</span>
						<h3 class="plan__name">{plan.name}</h3>
					</div>

					<p class="plan__price">
						<span class="plan__cur">$</span><span class="num plan__amt">{plan.price}</span><span
							class="plan__cad">{plan.cadence}</span
						>
					</p>

					<p class="plan__blurb">{plan.blurb}</p>

					<div class="plan__cta">
						<Button href={plan.href} variant={plan.featured ? 'primary' : 'ghost'} block>
							{plan.cta}
						</Button>
					</div>

					<hr class="plan__rule" />

					{#if plan.inheritLabel}
						<p class="plan__inherit">{plan.inheritLabel}</p>
					{/if}

					<ul class="plan__feats">
						{#each plan.features as feature (feature)}
							<li class="plan__feat">
								<span class="plan__ico">
									{#if plan.featured}
										<CheckCircleIcon weight="fill" size={17} />
									{:else}
										<CheckIcon weight="bold" size={15} />
									{/if}
								</span>
								<span class="plan__ftxt">{feature}</span>
							</li>
						{/each}
					</ul>
				</article>
			{/each}
		</div>

		<p class="price__assure" data-anim {@attach reveal({ y: 18, duration: 0.8 })}>
			<ShieldCheckIcon class="price__assure-ico" weight="fill" size={18} />
			<span>Cancel anytime with one click from your dashboard. No long-term commitment.</span>
		</p>
	</div>
</section>

<style>
	.price {
		position: relative;
		background: var(--tt-ink);
		overflow: clip;
		box-shadow:
			inset 0 1px 0 var(--tt-line),
			inset 0 -1px 0 var(--tt-line);
	}
	.price__glow {
		position: absolute;
		z-index: 0;
		top: 18%;
		right: -6%;
		width: 46vw;
		max-width: 620px;
		aspect-ratio: 1;
		background: radial-gradient(circle, rgb(var(--tt-red-rgb) / 0.2), transparent 62%);
		filter: blur(10px);
		pointer-events: none;
	}
	.price .tt-container {
		position: relative;
		z-index: 1;
	}

	.price__head {
		margin-bottom: clamp(2.4rem, 5vw, 3.6rem);
	}
	.price__bar {
		margin-bottom: 0;
	}
	.price__headrow {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: space-between;
		gap: 1.2rem;
		margin-top: 1rem;
	}
	.price__title {
		font-size: var(--fs-h2);
		max-width: 16ch;
	}
	.price__billing {
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
	.price__billing-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--tt-red-bright);
		box-shadow: 0 0 10px var(--tt-red-bright);
	}

	.price__grid {
		display: grid;
		gap: clamp(1.3rem, 3vw, 1.9rem);
	}

	.plan {
		position: relative;
		display: flex;
		flex-direction: column;
		padding: clamp(1.5rem, 3vw, 2.2rem);
		border: 1px solid var(--tt-line);
		border-radius: var(--tt-radius-lg);
		background: var(--tt-ink-2);
		box-shadow: var(--tt-shadow-card);
		will-change: transform;
	}
	.plan--featured {
		z-index: 2;
		border-color: rgb(var(--tt-red-rgb) / 0.55);
		background:
			linear-gradient(180deg, rgb(var(--tt-red-rgb) / 0.1), transparent 40%),
			var(--tt-ink-2);
		box-shadow:
			var(--tt-glow-red),
			var(--tt-shadow-lg);
		padding-top: clamp(2.3rem, 4vw, 3rem);
	}

	.plan__ribbon {
		position: absolute;
		top: 0;
		left: 50%;
		transform: translate(-50%, -50%);
		display: inline-flex;
		align-items: center;
		padding: 0.45rem 1rem;
		font-family: var(--tt-font-mono);
		font-size: 0.66rem;
		font-weight: 700;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--tt-white);
		white-space: nowrap;
		background: linear-gradient(180deg, var(--tt-red-hot), var(--tt-red) 60%, var(--tt-red-600));
		border-radius: 999px;
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.25),
			0 10px 26px -10px rgb(var(--tt-red-rgb) / 0.9);
	}

	.plan__head {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.plan__idx {
		font-size: 0.7rem;
		letter-spacing: 0.18em;
		color: var(--tt-mute);
	}
	.plan__name {
		font-size: var(--fs-h4);
		color: var(--tt-white);
	}

	.plan__price {
		display: flex;
		align-items: baseline;
		gap: 0.12rem;
		margin-top: 1.3rem;
		color: var(--tt-white);
	}
	.plan__cur {
		align-self: flex-start;
		margin-top: 0.4rem;
		font-size: 1.4rem;
		font-weight: 700;
		color: var(--tt-fog);
	}
	.plan__amt {
		font-size: clamp(2.8rem, 1.8rem + 3vw, 4rem);
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.03em;
	}
	.plan__cad {
		margin-left: 0.25rem;
		font-family: var(--tt-font-mono);
		font-size: 0.85rem;
		color: var(--tt-mute);
	}
	.plan--featured .plan__amt {
		font-size: clamp(3.1rem, 1.9rem + 3.4vw, 4.6rem);
	}

	.plan__blurb {
		margin-top: 1rem;
		max-width: 40ch;
		color: var(--tt-fog);
		font-size: 0.98rem;
	}

	.plan__cta {
		margin-top: 1.6rem;
	}

	.plan__rule {
		margin: 1.6rem 0 1.2rem;
		border: 0;
		height: 1px;
		background: var(--tt-line);
	}

	.plan__inherit {
		margin-bottom: 1rem;
		font-family: var(--tt-font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--tt-red-bright);
	}

	.plan__feats {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.72rem;
	}
	.plan__feat {
		display: flex;
		align-items: flex-start;
		gap: 0.7rem;
	}
	.plan__ico {
		display: flex;
		flex: none;
		margin-top: 0.16em;
		color: var(--tt-gold);
	}
	.plan--featured .plan__ico {
		color: var(--tt-red-bright);
	}
	.plan__ftxt {
		font-size: 0.92rem;
		line-height: 1.5;
		color: var(--tt-fog);
	}

	.price__assure {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.6rem;
		margin-top: clamp(2rem, 4vw, 3rem);
		text-align: center;
		font-size: 0.9rem;
		color: var(--tt-mute);
	}
	:global(.price__assure-ico) {
		flex: none;
		color: var(--tt-red-bright);
	}

	@media (min-width: 880px) {
		.price__grid {
			grid-template-columns: 1fr 1.06fr;
			align-items: center;
		}
		.plan--featured {
			padding-block: clamp(2.6rem, 4vw, 3.4rem);
		}
	}
</style>
