<script lang="ts">
	import { reveal, splitReveal } from '$lib/motion';
	import WarningIcon from 'phosphor-svelte/lib/WarningIcon';
	import { includes } from './data';
</script>

<section class="inc tt-section" aria-labelledby="inc-title">
	<div class="tt-container">
		<header class="inc__head">
			<div class="section-head">
				<span class="idx">03 / 03</span>
				<span class="rule"></span>
				<span class="label">What’s included</span>
			</div>
			<h2 id="inc-title" class="inc__title" data-split {@attach splitReveal({ stagger: 0.03 })}>
				Everything the engagement covers.
			</h2>
		</header>

		<ul class="inc__grid" data-anim-stagger {@attach reveal({ stagger: 0.08, y: 28 })}>
			{#each includes as item (item.t)}
				{@const Icon = item.Icon}
				<li class="inc__item">
					<span class="inc__ico" aria-hidden="true"><Icon size={24} weight="light" /></span>
					<h3 class="inc__itemtitle">{item.t}</h3>
					<p class="inc__itembody">{item.d}</p>
				</li>
			{/each}
		</ul>

		<div class="inc__disclaimer" role="note">
			<WarningIcon class="inc__disclaimer-ico" weight="fill" size={20} />
			<p>
				<strong>Polaris is educational coaching, not accounting or tax advice.</strong> Results vary;
				most day traders lose money.
			</p>
		</div>
	</div>
</section>

<style>
	.inc {
		position: relative;
		background: var(--tt-ink);
		border-top: 1px solid var(--tt-line);
		border-bottom: 1px solid var(--tt-line);
		overflow: clip;
	}
	.inc__head {
		max-width: 760px;
		margin-bottom: clamp(2.4rem, 5vw, 3.6rem);
	}
	.inc__title {
		font-size: var(--fs-h2);
		max-width: 16ch;
	}
	.inc__grid {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 1px;
		background: var(--tt-line);
		border: 1px solid var(--tt-line);
		border-radius: var(--tt-radius-lg);
		overflow: hidden;
	}
	.inc__item {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: clamp(1.5rem, 3vw, 2rem);
		background: var(--tt-ink);
	}
	.inc__ico {
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border-radius: 11px;
		color: var(--tt-fog);
		border: 1px solid var(--tt-line);
		background: rgba(255, 255, 255, 0.02);
	}
	.inc__itemtitle {
		font-size: var(--fs-h4);
		font-weight: 700;
		line-height: 1.2;
		color: var(--tt-white);
	}
	.inc__itembody {
		max-width: 40ch;
		font-size: 0.94rem;
		color: var(--tt-mute);
	}

	.inc__disclaimer {
		display: flex;
		align-items: flex-start;
		gap: 0.8rem;
		margin-top: clamp(2rem, 4vw, 3rem);
		padding: 1.2rem 1.4rem;
		border: 1px solid rgba(245, 196, 81, 0.3);
		border-radius: var(--tt-radius);
		background: rgba(245, 196, 81, 0.05);
	}
	:global(.inc__disclaimer-ico) {
		flex: none;
		margin-top: 0.1em;
		color: var(--tt-gold);
	}
	.inc__disclaimer p {
		font-size: 0.9rem;
		color: var(--tt-fog);
		line-height: 1.6;
	}
	.inc__disclaimer strong {
		color: var(--tt-white);
		font-weight: 600;
	}

	@media (min-width: 640px) {
		.inc__grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	@media (min-width: 960px) {
		.inc__grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}
</style>
