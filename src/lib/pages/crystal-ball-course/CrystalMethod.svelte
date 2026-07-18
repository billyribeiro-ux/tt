<script lang="ts">
	import { reveal, splitReveal } from '$lib/motion';
	import EyeIcon from 'phosphor-svelte/lib/EyeIcon';
	import HourglassIcon from 'phosphor-svelte/lib/HourglassIcon';
	import ScalesIcon from 'phosphor-svelte/lib/ScalesIcon';
	import HorizontalRuleIcon from 'phosphor-svelte/lib/HorizontalRuleIcon';

	// Each principle is drawn directly from the two volumes' own descriptions —
	// no capability is claimed that the catalogue does not state.
	const principles = [
		{
			Icon: EyeIcon,
			title: 'Read the tape',
			body: 'Dissect raw price action and see the moves before they happen — the core skill of Volume 1.'
		},
		{
			Icon: HourglassIcon,
			title: 'Patience',
			body: 'Volume 2 is built on it: the discipline to wait for the trade instead of forcing one.'
		},
		{
			Icon: ScalesIcon,
			title: 'Sizing',
			body: 'How much to risk, and when — turning a good read into a position that actually pays.'
		},
		{
			Icon: HorizontalRuleIcon,
			title: 'Support & resistance',
			body: 'Mastery of the levels where price turns — the map every Crystal Ball trade is drawn on.'
		}
	];
</script>

<section class="cb-method" aria-labelledby="cb-method-title">
	<div class="tt-container cb-method__inner">
		<div class="cb-method__aside">
			<p class="label cb-method__kicker">The method</p>
			<h2 id="cb-method-title" class="cb-method__title" data-split {@attach splitReveal({ stagger: 0.03 })}>
				Four ideas, taught until they’re <span class="text-red">instinct.</span>
			</h2>
			<p class="cb-method__intro prose">
				The whole series orbits a small set of skills. Learn to see them everywhere and the chart
				stops being noise.
			</p>
		</div>

		<ul class="cb-method__list" data-anim-stagger {@attach reveal({ stagger: 0.1, y: 32 })}>
			{#each principles as p (p.title)}
				{@const Icon = p.Icon}
				<li class="cb-method__item">
					<span class="cb-method__item-icon"><Icon size={22} weight="regular" /></span>
					<div>
						<h3 class="cb-method__item-title">{p.title}</h3>
						<p class="cb-method__item-body">{p.body}</p>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.cb-method {
		position: relative;
		padding-block: clamp(4.5rem, 3rem + 8vw, 9rem);
	}
	.cb-method__inner {
		display: grid;
		gap: clamp(2.5rem, 5vw, 4rem);
	}
	.cb-method__kicker {
		color: var(--tt-red-bright);
	}
	.cb-method__title {
		margin-top: 1.2rem;
		max-width: 15ch;
		font-size: var(--fs-h2);
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.025em;
		color: #fff;
	}
	.cb-method__intro {
		margin-top: 1.4rem;
		max-width: 46ch;
	}

	.cb-method__list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0;
		border-top: 1px solid var(--tt-line);
	}
	.cb-method__item {
		display: flex;
		align-items: flex-start;
		gap: 1.2rem;
		padding: clamp(1.4rem, 3vw, 2rem) 0;
		border-bottom: 1px solid var(--tt-line);
	}
	.cb-method__item-icon {
		display: grid;
		place-items: center;
		flex: none;
		width: 44px;
		height: 44px;
		border-radius: 11px;
		color: var(--tt-fog);
		border: 1px solid var(--tt-line);
		background: rgba(255, 255, 255, 0.02);
	}
	.cb-method__item-title {
		font-size: var(--fs-h4);
		font-weight: 700;
		letter-spacing: -0.01em;
		color: #fff;
	}
	.cb-method__item-body {
		margin-top: 0.5rem;
		max-width: 56ch;
		font-size: var(--fs-body);
		color: var(--tt-fog);
	}

	@media (min-width: 900px) {
		.cb-method__inner {
			grid-template-columns: 0.85fr 1.15fr;
			align-items: start;
			gap: clamp(3rem, 6vw, 5rem);
		}
		.cb-method__aside {
			position: sticky;
			top: calc(var(--tt-header-h) + 2rem);
		}
	}
</style>
