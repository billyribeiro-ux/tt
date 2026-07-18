<script lang="ts">
	import { reveal } from '$lib/motion';

	import SunHorizonIcon from 'phosphor-svelte/lib/SunHorizonIcon';
	import WaveformIcon from 'phosphor-svelte/lib/WaveformIcon';
	import FileArrowUpIcon from 'phosphor-svelte/lib/FileArrowUpIcon';
	import MoonStarsIcon from 'phosphor-svelte/lib/MoonStarsIcon';

	const routine = [
		{
			icon: SunHorizonIcon,
			when: 'Pre-market',
			task: 'CORE ALPHA meditation + chart review',
			note: 'Enter the open regulated, with a plan already in hand.'
		},
		{
			icon: WaveformIcon,
			when: 'Market hours',
			task: 'Headband on, live EEG streaming as you trade',
			note: 'One-contract sizing; the protocol runs the session, not emotion.'
		},
		{
			icon: FileArrowUpIcon,
			when: 'Post-market',
			task: 'Export EEG data + journal every trade',
			note: 'De-identified CSV uploaded; each trade tagged for review.'
		},
		{
			icon: MoonStarsIcon,
			when: 'Evening',
			task: 'MUSE biofeedback training block',
			note: '10–15 minutes to reinforce the alpha state before sleep.'
		}
	];
</script>

<section class="tt-section pa-day" aria-labelledby="pa-day-title">
	<div class="tt-container">
		<header class="section-head">
			<span class="idx">04 / 05</span>
			<span class="rule"></span>
			<span class="label">The daily commitment</span>
		</header>

		<div class="pa-day__head">
			<h2 id="pa-day-title" class="pa-day__title">
				About <span class="text-red">45 minutes</span> a day, beyond your normal trading
			</h2>
			<p class="pa-day__intro prose">
				Consistency is the whole point, so the routine is fixed. It wraps around a trading day
				you’re already having — bookending the open and the close with training and data capture.
			</p>
		</div>

		<ol class="pa-day__list" data-anim-stagger {@attach reveal({ stagger: 0.1, y: 30 })}>
			{#each routine as r, i (r.when)}
				{@const Icon = r.icon}
				<li class="pa-day__item">
					<span class="pa-day__num num">0{i + 1}</span>
					<span class="pa-day__icon"><Icon size={22} weight="regular" /></span>
					<span class="pa-day__when label">{r.when}</span>
					<h3 class="pa-day__task">{r.task}</h3>
					<p class="pa-day__note">{r.note}</p>
				</li>
			{/each}
		</ol>
	</div>
</section>

<style>
	.pa-day {
		background: var(--tt-black);
	}
	.pa-day__head {
		max-width: 720px;
		margin-bottom: clamp(2rem, 4vw, 3rem);
	}
	.pa-day__title {
		font-size: var(--fs-h3);
		font-weight: 800;
		color: #fff;
	}
	.pa-day__intro {
		margin-top: 1rem;
		font-size: var(--fs-body);
	}
	.pa-day__list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 1rem;
		grid-template-columns: 1fr;
	}
	.pa-day__item {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: clamp(1.4rem, 2.6vw, 1.8rem);
		border: 1px solid var(--tt-line);
		border-radius: var(--tt-radius-lg);
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent);
	}
	.pa-day__num {
		position: absolute;
		top: clamp(1.1rem, 2.4vw, 1.5rem);
		right: clamp(1.1rem, 2.4vw, 1.5rem);
		font-size: 0.8rem;
		color: var(--tt-mute-2);
	}
	.pa-day__icon {
		display: grid;
		place-items: center;
		width: 42px;
		height: 42px;
		border-radius: 10px;
		color: var(--tt-fog);
		border: 1px solid var(--tt-line);
		background: rgba(255, 255, 255, 0.02);
	}
	.pa-day__when {
		margin-top: 1rem;
		color: var(--tt-red-bright);
	}
	.pa-day__task {
		margin-top: 0.5rem;
		font-size: 1.1rem;
		font-weight: 700;
		color: #fff;
		letter-spacing: -0.01em;
		line-height: 1.25;
	}
	.pa-day__note {
		margin-top: 0.6rem;
		font-size: 0.9rem;
		color: var(--tt-mute);
	}

	@media (min-width: 720px) {
		.pa-day__list {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	@media (min-width: 1040px) {
		.pa-day__list {
			grid-template-columns: repeat(4, 1fr);
		}
	}
</style>
