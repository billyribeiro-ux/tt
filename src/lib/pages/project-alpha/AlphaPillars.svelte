<script lang="ts">
	import { reveal, splitReveal } from '$lib/motion';

	import BrainIcon from 'phosphor-svelte/lib/BrainIcon';
	import HeadphonesIcon from 'phosphor-svelte/lib/HeadphonesIcon';
	import PulseIcon from 'phosphor-svelte/lib/PulseIcon';

	const pillars = [
		{
			icon: BrainIcon,
			cadence: '10–15 min · daily',
			title: 'Daily MUSE Training',
			body: 'Guided EEG biofeedback with the Muse S headband trains the brain to find, and hold, a calm alpha state on demand, the raw material of every other pillar.'
		},
		{
			icon: HeadphonesIcon,
			cadence: '15–30 min · pre-open',
			title: 'CORE ALPHA Session',
			body: 'A proprietary binaural meditation run before the open primes the alpha band, so you step into the session regulated rather than reactive.'
		},
		{
			icon: PulseIcon,
			cadence: 'live · market hours',
			title: 'Live EEG Monitoring',
			body: 'Mind Monitor streams your EEG in real time while you trade, capturing exactly how your brain state moves with every decision, entry, and exit.'
		}
	];
</script>

<section class="tt-section pa-pil" aria-labelledby="pa-pil-title">
	<span class="pa-pil__glow" aria-hidden="true"></span>
	<div class="tt-container">
		<header class="section-head">
			<span class="idx">03 / 05</span>
			<span class="rule"></span>
			<span class="label">Three training pillars</span>
		</header>

		<h2 id="pa-pil-title" class="pa-pil__title" data-split {@attach splitReveal({ stagger: 0.03 })}>
			One discipline, practised three ways
		</h2>

		<ol class="pa-pil__list">
			{#each pillars as p, i (p.title)}
				{@const Icon = p.icon}
				<li
					class="pa-pil__step"
					data-anim
					{@attach reveal({ y: 44, duration: 1, delay: i * 0.08 })}
				>
					<div class="pa-pil__top">
						<span class="pa-pil__idx num">0{i + 1}</span>
						<span class="pa-pil__icon"><Icon size={24} weight="regular" /></span>
						<span class="pa-pil__cadence label">{p.cadence}</span>
					</div>
					<h3 class="pa-pil__name">{p.title}</h3>
					<p class="pa-pil__body">{p.body}</p>
				</li>
			{/each}
		</ol>
	</div>
</section>

<style>
	.pa-pil {
		position: relative;
		background: var(--tt-black);
		overflow: clip;
	}
	.pa-pil__glow {
		position: absolute;
		right: -14%;
		top: 12%;
		width: 52vw;
		height: 52vw;
		max-width: 660px;
		max-height: 660px;
		background: radial-gradient(circle, rgb(var(--tt-red-rgb) / 0.2), transparent 64%);
		filter: blur(26px);
		pointer-events: none;
	}
	.pa-pil .tt-container {
		position: relative;
		z-index: 1;
	}
	.pa-pil__title {
		font-size: var(--fs-h2);
		font-weight: 800;
		color: #fff;
		max-width: 16ch;
		margin-bottom: clamp(2rem, 4vw, 3.2rem);
	}
	.pa-pil__list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 1.2rem;
	}
	.pa-pil__step {
		position: relative;
		padding: clamp(1.6rem, 3vw, 2.4rem);
		border: 1px solid var(--tt-line);
		border-radius: var(--tt-radius-lg);
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent);
	}
	.pa-pil__top {
		display: flex;
		align-items: center;
		gap: 0.9rem;
		margin-bottom: 1.1rem;
	}
	.pa-pil__idx {
		font-size: 1rem;
		font-weight: 700;
		color: var(--tt-red-bright);
	}
	.pa-pil__icon {
		display: grid;
		place-items: center;
		width: 42px;
		height: 42px;
		border-radius: 10px;
		color: #fff;
		border: 1px solid var(--tt-line-strong);
		background: rgba(255, 255, 255, 0.03);
	}
	.pa-pil__cadence {
		margin-left: auto;
		color: var(--tt-mute);
	}
	.pa-pil__name {
		font-size: var(--fs-h3);
		font-weight: 700;
		color: #fff;
		letter-spacing: -0.01em;
	}
	.pa-pil__body {
		margin-top: 0.8rem;
		max-width: 60ch;
		color: var(--tt-fog);
	}

	@media (min-width: 1024px) {
		.pa-pil__list {
			grid-template-columns: repeat(3, 1fr);
			gap: 1.1rem;
		}
		.pa-pil__step {
			display: flex;
			flex-direction: column;
		}
		.pa-pil__cadence {
			margin-left: 0;
		}
		.pa-pil__top {
			flex-wrap: wrap;
		}
	}
</style>
