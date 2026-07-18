<script lang="ts">
	import { reveal, splitReveal } from '$lib/motion';
	import { mastery } from '$lib/data/site';
	import BarbellIcon from 'phosphor-svelte/lib/BarbellIcon';
	import BrainIcon from 'phosphor-svelte/lib/BrainIcon';
	import ChartLineUpIcon from 'phosphor-svelte/lib/ChartLineUpIcon';

	// Data-driven icon lookup — keys match the `icon` field in $lib/data/site.
	const iconMap = {
		Barbell: BarbellIcon,
		Brain: BrainIcon,
		ChartLineUp: ChartLineUpIcon
	} as const;
</script>

<section class="tt-section mastery" aria-labelledby="mastery-title">
	<div class="mastery__bg" aria-hidden="true">
		<span class="mastery__glow"></span>
	</div>

	<div class="tt-container">
		<header class="mastery__head">
			<p class="mastery__kicker label" data-anim {@attach reveal({ y: 16, duration: 0.65 })}>
				<span class="mastery__tick" aria-hidden="true"></span>Top performers share a trait
			</p>
			<h2 id="mastery-title" class="mastery__title" data-split {@attach splitReveal({ stagger: 0.03 })}>
				Mastery of skill.<br />Mastery of emotion.
			</h2>
		</header>

		<!-- The trait as an equation, not three cards: Skill + Emotion = Results -->
		<div class="equation">
			{#each mastery as m, i (m.title)}
				{@const Icon = iconMap[m.icon as keyof typeof iconMap] ?? BarbellIcon}
				{#if i === 1}
					<span
						class="op op--plus"
						aria-hidden="true"
						data-anim
						{@attach reveal({ y: 0, scale: 0.55, duration: 0.7, delay: 0.16, ease: 'back.out(1.7)' })}
					>+</span>
				{/if}
				{#if i === 2}
					<span
						class="op op--eq"
						aria-hidden="true"
						data-anim
						{@attach reveal({ y: 0, scale: 0.5, duration: 0.85, delay: 0.56, ease: 'back.out(2)' })}
					>=</span>
				{/if}
				<div
					class="term"
					class:term--result={i === 2}
					data-anim
					{@attach reveal({ y: 44, duration: 1, delay: i * 0.16 })}
				>
					<div class="term__top">
						<span class="term__icon"><Icon size={22} weight="regular" /></span>
						<span class="term__idx num">0{i + 1}</span>
					</div>
					<h3 class="term__title">{m.title}</h3>
					<p class="term__body">{m.body}</p>
				</div>
			{/each}
		</div>

		<div class="payoff" data-anim {@attach reveal({ y: 30, duration: 1 })}>
			<span class="payoff__mark" aria-hidden="true">=</span>
			<p class="payoff__text">
				Master the skill to do the job <span class="op-inline" aria-hidden="true">+</span> master your
				focus through pressure <span class="op-inline op-inline--eq" aria-hidden="true">=</span>
				<strong>Mastery of Self.</strong> All top performers share this trait — and so do professional
				traders who pull <span class="text-red">seven figures</span>.
			</p>
		</div>
	</div>
</section>

<style>
	.mastery {
		background: var(--tt-black);
		overflow: clip;
	}
	.mastery__bg {
		position: absolute;
		inset: 0;
		z-index: 0;
	}
	.mastery__glow {
		position: absolute;
		left: -14%;
		bottom: -22%;
		width: 60vw;
		height: 60vw;
		max-width: 760px;
		max-height: 760px;
		background: radial-gradient(circle, rgb(var(--tt-red-rgb) / 0.22), transparent 64%);
		filter: blur(14px);
	}

	.mastery .tt-container {
		position: relative;
		z-index: 1;
	}

	/* ---- Head ---- */
	.mastery__kicker {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		color: var(--tt-mute);
	}
	.mastery__tick {
		width: 24px;
		height: 1px;
		background: var(--tt-red-bright);
	}
	.mastery__title {
		margin-top: 1.3rem;
		max-width: 18ch;
		font-size: var(--fs-h2);
		line-height: 1;
	}

	/* ---- Equation ---- */
	.equation {
		display: grid;
		grid-template-columns: 1fr;
		gap: clamp(1.4rem, 3vw, 2.2rem);
		margin-top: clamp(2.6rem, 6vw, 4.5rem);
	}

	.op {
		font-family: var(--tt-font-mono);
		font-weight: 300;
		font-size: clamp(2.4rem, 5vw, 4.2rem);
		line-height: 0.7;
		user-select: none;
	}
	.op--plus {
		color: var(--tt-mute-2);
	}
	.op--eq {
		color: var(--tt-red-bright);
		text-shadow: 0 0 26px rgb(var(--tt-red-bright-rgb) / 0.45);
	}

	.term {
		position: relative;
		padding-top: 1.05rem;
		border-top: 1px solid var(--tt-line-strong);
	}
	.term--result {
		border-top-color: var(--tt-red);
	}
	.term--result::before {
		content: '';
		position: absolute;
		inset: -8% -12% auto -12%;
		height: 130%;
		background: radial-gradient(ellipse at 30% 0%, rgb(var(--tt-red-rgb) / 0.16), transparent 70%);
		z-index: -1;
		pointer-events: none;
	}

	.term__top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}
	.term__icon {
		display: inline-flex;
		color: var(--tt-fog);
	}
	.term--result .term__icon {
		color: var(--tt-red-bright);
	}
	.term__idx {
		font-size: 0.72rem;
		letter-spacing: 0.1em;
		color: var(--tt-mute-2);
	}
	.term--result .term__idx {
		color: var(--tt-red-bright);
	}

	.term__title {
		margin-top: 0.9rem;
		font-size: var(--fs-h3);
		font-weight: 800;
		letter-spacing: -0.02em;
	}
	.term__body {
		margin-top: 0.7rem;
		max-width: 40ch;
		font-size: var(--fs-body);
		color: var(--tt-fog);
	}

	/* ---- Payoff ---- */
	.payoff {
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: start;
		column-gap: clamp(1.2rem, 3vw, 2.4rem);
		margin-top: clamp(3rem, 7vw, 5.5rem);
		padding-top: clamp(2rem, 4vw, 3rem);
		border-top: 1px solid var(--tt-line);
	}
	.payoff__mark {
		font-family: var(--tt-font-mono);
		font-weight: 300;
		font-size: clamp(2.6rem, 6vw, 5rem);
		line-height: 0.7;
		color: var(--tt-red);
	}
	.payoff__text {
		max-width: 62ch;
		font-size: var(--fs-lead);
		line-height: 1.5;
		color: var(--tt-fog);
	}
	.payoff__text strong {
		color: var(--tt-white);
		font-weight: 700;
	}
	.op-inline {
		font-family: var(--tt-font-mono);
		font-weight: 400;
		color: var(--tt-mute);
		padding-inline: 0.12em;
	}
	.op-inline--eq {
		color: var(--tt-red-bright);
	}

	/* ---- Equation layout on wider screens ---- */
	@media (min-width: 880px) {
		.equation {
			grid-template-columns: 1fr auto 1fr auto 1fr;
			align-items: center;
			gap: clamp(1.4rem, 2.6vw, 2.6rem);
		}
		.op {
			text-align: center;
		}
	}
</style>
