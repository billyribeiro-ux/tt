<script lang="ts">
	import { reveal, splitReveal } from '$lib/motion';
	import { mastery } from '$lib/data/site';
	import BarbellIcon from 'phosphor-svelte/lib/BarbellIcon';
	import BrainIcon from 'phosphor-svelte/lib/BrainIcon';
	import ChartLineUpIcon from 'phosphor-svelte/lib/ChartLineUpIcon';

	const icons = { Barbell: BarbellIcon, Brain: BrainIcon, ChartLineUp: ChartLineUpIcon };
	const [skill, emotion, results] = mastery;
	const SkillIcon = icons[skill.icon as keyof typeof icons];
	const EmotionIcon = icons[emotion.icon as keyof typeof icons];
	const ResultsIcon = icons[results.icon as keyof typeof icons];
</script>

<section class="bc-dual" aria-labelledby="bc-dual-title">
	<div class="tt-container">
		<div class="section-head">
			<span class="idx">01 / 03</span>
			<span class="rule"></span>
			<span class="label bc-dual__count">Skill &amp; emotion</span>
		</div>

		<h2 id="bc-dual-title" class="bc-dual__title" data-split {@attach splitReveal({ stagger: 0.03 })}>
			Two halves of the same <span class="text-red">trade.</span>
		</h2>
		<p class="bc-dual__intro prose">
			The Boot Camp is built on the truth every professional learns the hard way — the chart is only
			half the battle. It trains the body to execute and the mind to stay calm under fire.
		</p>

		<div class="bc-dual__grid">
			<article class="bc-dual__panel" data-anim {@attach reveal({ y: 40 })}>
				<div class="bc-dual__panel-top">
					<span class="bc-dual__panel-idx num">01</span>
					<span class="bc-dual__panel-icon"><SkillIcon size={24} weight="regular" /></span>
				</div>
				<h3 class="bc-dual__panel-name">{skill.title}</h3>
				<p class="bc-dual__panel-body">{skill.body}</p>
			</article>

			<article class="bc-dual__panel bc-dual__panel--ruled" data-anim {@attach reveal({ y: 40, delay: 0.08 })}>
				<div class="bc-dual__panel-top">
					<span class="bc-dual__panel-idx num">02</span>
					<span class="bc-dual__panel-icon"><EmotionIcon size={24} weight="regular" /></span>
				</div>
				<h3 class="bc-dual__panel-name">{emotion.title}</h3>
				<p class="bc-dual__panel-body">{emotion.body}</p>
			</article>
		</div>

		<div class="bc-dual__result" data-anim {@attach reveal({ y: 30 })}>
			<span class="bc-dual__result-icon"><ResultsIcon size={22} weight="regular" /></span>
			<div>
				<h3 class="bc-dual__result-name">{results.title}</h3>
				<p class="bc-dual__result-body">{results.body}</p>
			</div>
		</div>
	</div>
</section>

<style>
	.bc-dual {
		position: relative;
		padding-block: clamp(4.5rem, 3rem + 8vw, 9rem);
		background: var(--tt-ink);
		box-shadow:
			inset 0 1px 0 var(--tt-line),
			inset 0 -1px 0 var(--tt-line);
	}
	.bc-dual__count {
		flex: none;
		color: var(--tt-mute-2);
	}
	.bc-dual__title {
		max-width: 16ch;
		font-size: var(--fs-h2);
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.025em;
		color: #fff;
	}
	.bc-dual__intro {
		margin-top: 1.4rem;
		max-width: 58ch;
	}

	.bc-dual__grid {
		display: grid;
		gap: 0;
		margin-top: clamp(2.5rem, 5vw, 4rem);
		border: 1px solid var(--tt-line);
		border-radius: var(--tt-radius-lg);
		overflow: clip;
	}
	.bc-dual__panel {
		padding: clamp(1.8rem, 4vw, 3rem);
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent);
	}
	.bc-dual__panel--ruled {
		border-top: 1px solid var(--tt-line);
	}
	.bc-dual__panel-top {
		display: flex;
		align-items: center;
		gap: 0.9rem;
		margin-bottom: 1.4rem;
	}
	.bc-dual__panel-idx {
		font-size: clamp(1.4rem, 1rem + 1.5vw, 2rem);
		font-weight: 800;
		line-height: 1;
		color: var(--tt-red-bright);
	}
	.bc-dual__panel-icon {
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border-radius: 11px;
		color: #fff;
		border: 1px solid rgb(var(--tt-red-rgb) / 0.5);
		background: rgb(var(--tt-red-rgb) / 0.08);
	}
	.bc-dual__panel-name {
		font-size: var(--fs-h3);
		font-weight: 800;
		letter-spacing: -0.02em;
		color: #fff;
	}
	.bc-dual__panel-body {
		margin-top: 0.9rem;
		max-width: 46ch;
		font-size: var(--fs-body);
		color: var(--tt-fog);
	}

	.bc-dual__result {
		display: flex;
		align-items: flex-start;
		gap: 1.2rem;
		margin-top: clamp(1.6rem, 3vw, 2.2rem);
		padding: clamp(1.5rem, 3vw, 2.2rem);
		border: 1px solid rgb(var(--tt-red-rgb) / 0.34);
		border-radius: var(--tt-radius-lg);
		background: linear-gradient(180deg, rgb(var(--tt-red-rgb) / 0.09), transparent 60%);
	}
	.bc-dual__result-icon {
		display: grid;
		place-items: center;
		flex: none;
		width: 44px;
		height: 44px;
		border-radius: 11px;
		color: var(--tt-red-bright);
		border: 1px solid rgb(var(--tt-red-rgb) / 0.5);
		background: rgb(var(--tt-red-rgb) / 0.08);
	}
	.bc-dual__result-name {
		font-size: var(--fs-h4);
		font-weight: 700;
		color: #fff;
	}
	.bc-dual__result-body {
		margin-top: 0.5rem;
		max-width: 68ch;
		color: var(--tt-fog);
	}

	@media (min-width: 780px) {
		.bc-dual__grid {
			grid-template-columns: 1fr 1fr;
		}
		.bc-dual__panel--ruled {
			border-top: 0;
			border-left: 1px solid var(--tt-line);
		}
	}
</style>
