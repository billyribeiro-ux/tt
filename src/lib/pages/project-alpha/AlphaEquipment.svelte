<script lang="ts">
	import { reveal } from '$lib/motion';

	import BrainIcon from 'phosphor-svelte/lib/BrainIcon';
	import WaveformIcon from 'phosphor-svelte/lib/WaveformIcon';
	import ChartLineUpIcon from 'phosphor-svelte/lib/ChartLineUpIcon';
	import GraduationCapIcon from 'phosphor-svelte/lib/GraduationCapIcon';

	const equipment = [
		{
			icon: BrainIcon,
			name: 'Muse S / Muse S Athena',
			tag: 'Yours to keep',
			detail:
				'A soft EEG headband that reads brainwave activity for daily training and live in-session monitoring.'
		},
		{
			icon: WaveformIcon,
			name: 'The MUSE App',
			tag: 'Exports CSV',
			detail:
				'Runs the guided biofeedback sessions and exports the raw EEG as CSV for de-identified analysis.'
		},
		{
			icon: ChartLineUpIcon,
			name: 'Funded trading account',
			tag: 'One-contract sizing',
			detail:
				'An options-capable brokerage account, standardized to one-contract sizing so results compare cleanly.'
		},
		{
			icon: GraduationCapIcon,
			name: 'Trick Trades membership',
			tag: 'CORE ALPHA access',
			detail: 'CORE ALPHA access, the structured trade journal, and the full education library.'
		}
	];
</script>

<section class="tt-section pa-eq" aria-labelledby="pa-eq-title">
	<div class="tt-container">
		<header class="section-head">
			<span class="idx">02 / 05</span>
			<span class="rule"></span>
			<span class="label">What you’ll use</span>
		</header>

		<div class="pa-eq__head">
			<h2 id="pa-eq-title" class="pa-eq__title">The kit each participant runs</h2>
			<p class="pa-eq__intro prose">
				Four things make the protocol work. The hardware is yours to keep; the rest is standardized
				so every participant’s data reads the same way.
			</p>
		</div>

		<ul class="pa-eq__grid" data-anim-stagger {@attach reveal({ stagger: 0.1, y: 34 })}>
			{#each equipment as item (item.name)}
				{@const Icon = item.icon}
				<li class="pa-eq__card">
					<span class="pa-eq__icon"><Icon size={22} weight="regular" /></span>
					<span class="pa-eq__tag label">{item.tag}</span>
					<h3 class="pa-eq__name">{item.name}</h3>
					<p class="pa-eq__detail">{item.detail}</p>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.pa-eq {
		background: var(--tt-ink);
	}
	.pa-eq__head {
		max-width: 720px;
		margin-bottom: clamp(2rem, 4vw, 3rem);
	}
	.pa-eq__title {
		font-size: var(--fs-h3);
		font-weight: 800;
		color: #fff;
	}
	.pa-eq__intro {
		margin-top: 1rem;
		font-size: var(--fs-body);
	}
	.pa-eq__grid {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 1rem;
		grid-template-columns: 1fr;
	}
	.pa-eq__card {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: clamp(1.4rem, 2.6vw, 1.9rem);
		border: 1px solid var(--tt-line);
		border-radius: var(--tt-radius-lg);
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent);
		transition:
			border-color 0.4s ease,
			transform 0.4s ease;
	}
	.pa-eq__card:hover {
		border-color: var(--tt-line-strong);
		transform: translateY(-3px);
	}
	.pa-eq__icon {
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border-radius: 11px;
		color: var(--tt-fog);
		border: 1px solid var(--tt-line);
		background: rgba(255, 255, 255, 0.02);
	}
	.pa-eq__tag {
		margin-top: 1.1rem;
		color: var(--tt-red-bright);
	}
	.pa-eq__name {
		margin-top: 0.55rem;
		font-size: var(--fs-h4);
		font-weight: 700;
		color: #fff;
		letter-spacing: -0.01em;
	}
	.pa-eq__detail {
		margin-top: 0.65rem;
		font-size: 0.94rem;
		color: var(--tt-mute);
	}

	@media (min-width: 640px) {
		.pa-eq__grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	@media (min-width: 1040px) {
		.pa-eq__grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}
</style>
