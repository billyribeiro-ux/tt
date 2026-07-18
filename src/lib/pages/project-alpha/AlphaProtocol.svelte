<script lang="ts">
	import { reveal, splitReveal } from '$lib/motion';

	import FlaskIcon from 'phosphor-svelte/lib/FlaskIcon';
	import BrainIcon from 'phosphor-svelte/lib/BrainIcon';
	import BarbellIcon from 'phosphor-svelte/lib/BarbellIcon';
	import SealCheckIcon from 'phosphor-svelte/lib/SealCheckIcon';
	import CalendarBlankIcon from 'phosphor-svelte/lib/CalendarBlankIcon';

	// The 90-day ladder — the centrepiece. Active phase lights as you scroll.
	const phases = [
		{
			icon: FlaskIcon,
			tag: 'Preloading',
			window: 'Days −7 to −1',
			title: 'Setup & Baseline',
			lead: 'Before the clock starts, we capture who you are cold — an honest reference point for everything that follows.',
			items: [
				'Fit the Muse S / Athena; install the MUSE and Mind Monitor apps',
				'Baseline brain snapshot — resting EEG recorded before any training',
				'Intake questionnaire; funded, options-capable account confirmed',
				'CORE ALPHA membership activated'
			]
		},
		{
			icon: BrainIcon,
			tag: 'Phase 1',
			window: 'Days 1–30',
			title: 'Foundation',
			lead: 'The full daily rhythm goes live. You rehearse on paper first, then commit real capital once the protocol is habit.',
			items: [
				'Days 1–5: paper trading only — protocol rehearsal, no capital at risk',
				'Day 6 onward: live, one-contract execution',
				'Daily MUSE biofeedback + the CORE ALPHA pre-market session',
				'Live EEG monitored during every trading session'
			]
		},
		{
			icon: BarbellIcon,
			tag: 'Phase 2',
			window: 'Days 31–60',
			title: 'Strength',
			lead: 'A second training load is layered on, and a mid-study assessment checks whether the trajectory is holding.',
			items: [
				'Add MUSE STRENGTH training to the daily block',
				'Full pre-market → live → post-market protocol continues',
				'Day 45: mid-study assessment and brain snapshot',
				'Journaling deepens — separate emotion from execution'
			]
		},
		{
			icon: SealCheckIcon,
			tag: 'Phase 3',
			window: 'Days 61–90',
			title: 'Full Protocol',
			lead: 'Every pillar runs at full load, closing with a final assessment and the complete, de-identified data submission.',
			items: [
				'Complete protocol at full intensity',
				'Day 90: final assessment and closing brain snapshot',
				'Full de-identified data set submitted for analysis',
				'Consistency scored against the Day 0 baseline'
			]
		}
	];

	// Scroll-linked highlight for the phase ladder (mirrors the Formula section).
	let phaseListEl: HTMLElement | undefined = $state();
	let activePhase = $state(0);

	$effect(() => {
		if (!phaseListEl || typeof IntersectionObserver === 'undefined') return;
		const els = Array.from(phaseListEl.querySelectorAll<HTMLElement>('[data-step]'));
		if (!els.length) return;
		const io = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						const idx = Number((entry.target as HTMLElement).dataset.step);
						if (!Number.isNaN(idx)) activePhase = idx;
					}
				}
			},
			{ rootMargin: '-48% 0px -48% 0px', threshold: 0 }
		);
		els.forEach((el) => io.observe(el));
		return () => io.disconnect();
	});
</script>

<section id="protocol" class="tt-section pa-tl" aria-labelledby="pa-tl-title">
	<div class="pa-tl__bg grid-bg" aria-hidden="true"></div>
	<span class="pa-tl__glow" aria-hidden="true"></span>

	<div class="tt-container">
		<header class="pa-tl__head">
			<p class="label pa-tl__kicker">
				<span class="pa-tl__tick" aria-hidden="true"></span>The protocol
			</p>
			<h2 id="pa-tl-title" class="pa-tl__title" data-split {@attach splitReveal({ stagger: 0.03 })}>
				Ninety days, <span class="text-red">four phases</span>
			</h2>
			<p class="pa-tl__intro prose">
				The study builds in deliberate steps — a cold baseline first, then load added phase by
				phase, so any change can be traced to the protocol rather than to chance.
			</p>
		</header>

		<div class="pa-tl__grid">
			<!-- Sticky rail: the four phases, active one lit -->
			<aside class="pa-tl__rail" aria-hidden="true">
				<span class="label pa-tl__rail-tag">The 4 phases</span>
				<ol class="pa-tl__rail-list">
					{#each phases as p, i (p.tag)}
						<li class="pa-tl__rail-item" class:is-active={activePhase === i}>
							<span class="pa-tl__rail-idx num">0{i + 1}</span>
							<span class="pa-tl__rail-label">{p.tag}</span>
						</li>
					{/each}
				</ol>
				<div class="pa-tl__progress">
					<span
						class="pa-tl__progress-bar"
						style:transform="scaleY({(activePhase + 1) / phases.length})"
					></span>
				</div>
			</aside>

			<!-- The four phases -->
			<ol class="pa-tl__steps" bind:this={phaseListEl}>
				{#each phases as p, i (p.tag)}
					{@const Icon = p.icon}
					<li
						class="pa-tl__step"
						class:is-active={activePhase === i}
						data-step={i}
						data-anim
						{@attach reveal({ y: 48, duration: 1 })}
					>
						<span class="pa-tl__step-num num" aria-hidden="true">0{i + 1}</span>
						<div class="pa-tl__step-body">
							<div class="pa-tl__step-top">
								<span class="pa-tl__step-icon"><Icon size={22} weight="regular" /></span>
								<span class="pa-tl__step-tag label">{p.tag}</span>
								<span class="pa-tl__step-window num">{p.window}</span>
							</div>
							<h3 class="pa-tl__step-title">{p.title}</h3>
							<p class="pa-tl__step-lead">{p.lead}</p>
							<ul class="pa-tl__step-items">
								{#each p.items as item (item)}
									<li>{item}</li>
								{/each}
							</ul>
						</div>
					</li>
				{/each}
			</ol>
		</div>

		<!-- Coda: the long-tail follow-up, offset from the ladder -->
		<div class="pa-tl__followup" data-anim {@attach reveal({ y: 30, duration: 1 })}>
			<span class="pa-tl__followup-icon"><CalendarBlankIcon size={22} weight="regular" /></span>
			<div>
				<p class="label pa-tl__followup-tag">Day 180 · Follow-up</p>
				<p class="pa-tl__followup-text">
					Three months after the protocol ends, participants return for a follow-up check —
					measuring what held, and what faded, once the daily structure was gone.
				</p>
			</div>
		</div>
	</div>
</section>

<style>
	.pa-tl {
		position: relative;
		overflow: clip;
		background: var(--tt-ink);
	}
	.pa-tl__bg {
		position: absolute;
		inset: 0;
		opacity: 0.35;
	}
	.pa-tl__glow {
		position: absolute;
		top: 18%;
		left: -12%;
		width: 46vw;
		height: 46vw;
		max-width: 640px;
		max-height: 640px;
		background: radial-gradient(circle, rgb(var(--tt-red-rgb) / 0.26), transparent 64%);
		filter: blur(30px);
		pointer-events: none;
	}
	.pa-tl .tt-container {
		position: relative;
		z-index: 1;
	}
	.pa-tl__head {
		max-width: 760px;
		margin-bottom: clamp(2.5rem, 5vw, 4.5rem);
	}
	.pa-tl__kicker {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		color: var(--tt-fog);
	}
	.pa-tl__tick {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--tt-red-bright);
		box-shadow: 0 0 10px var(--tt-red-bright);
	}
	.pa-tl__title {
		margin-top: 1.1rem;
		font-size: var(--fs-h2);
		font-weight: 800;
		letter-spacing: -0.02em;
		color: #fff;
	}
	.pa-tl__intro {
		margin-top: 1.3rem;
	}
	.pa-tl__grid {
		position: relative;
		display: grid;
		gap: 2.5rem;
	}
	.pa-tl__rail {
		display: none;
	}
	.pa-tl__steps {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: clamp(1rem, 2vw, 1.5rem);
	}
	.pa-tl__step {
		position: relative;
		display: grid;
		grid-template-columns: auto 1fr;
		gap: clamp(1rem, 2.5vw, 1.8rem);
		padding: clamp(1.6rem, 3vw, 2.4rem);
		border: 1px solid var(--tt-line);
		border-radius: var(--tt-radius-lg);
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent);
		transition:
			border-color 0.5s ease,
			background 0.5s ease;
	}
	.pa-tl__step.is-active {
		border-color: rgb(var(--tt-red-rgb) / 0.5);
		background: linear-gradient(180deg, rgb(var(--tt-red-rgb) / 0.08), transparent);
	}
	.pa-tl__step-num {
		font-size: var(--fs-h3);
		font-weight: 800;
		line-height: 1;
		color: var(--tt-ink-3);
		transition: color 0.5s ease;
	}
	.pa-tl__step.is-active .pa-tl__step-num {
		color: var(--tt-red-bright);
	}
	.pa-tl__step-top {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.8rem;
		margin-bottom: 1rem;
	}
	.pa-tl__step-icon {
		display: grid;
		place-items: center;
		width: 40px;
		height: 40px;
		border-radius: 10px;
		color: var(--tt-fog);
		border: 1px solid var(--tt-line);
		background: rgba(255, 255, 255, 0.02);
		transition:
			color 0.4s ease,
			border-color 0.4s ease;
	}
	.pa-tl__step.is-active .pa-tl__step-icon {
		color: #fff;
		border-color: rgb(var(--tt-red-rgb) / 0.6);
	}
	.pa-tl__step-tag {
		font-family: var(--tt-font-display);
		font-size: 0.95rem;
		letter-spacing: 0.14em;
		color: #fff;
	}
	.pa-tl__step-window {
		margin-left: auto;
		font-size: 0.8rem;
		letter-spacing: 0.02em;
		color: var(--tt-mute);
	}
	.pa-tl__step.is-active .pa-tl__step-window {
		color: var(--tt-red-bright);
	}
	.pa-tl__step-title {
		font-size: var(--fs-h3);
		font-weight: 700;
		color: #fff;
		letter-spacing: -0.01em;
	}
	.pa-tl__step-lead {
		margin-top: 0.7rem;
		font-size: var(--fs-lead);
		color: var(--tt-fog);
		max-width: 60ch;
	}
	.pa-tl__step-items {
		list-style: none;
		margin: 1.3rem 0 0;
		padding: 0;
		display: grid;
		gap: 0.65rem;
	}
	.pa-tl__step-items li {
		position: relative;
		padding-left: 1.4rem;
		font-size: 0.94rem;
		color: var(--tt-mute);
	}
	.pa-tl__step-items li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.62em;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--tt-red);
	}

	.pa-tl__followup {
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: center;
		gap: 1.2rem;
		margin-top: clamp(1.6rem, 3vw, 2.4rem);
		padding: clamp(1.4rem, 3vw, 2rem);
		border: 1px dashed var(--tt-line-strong);
		border-radius: var(--tt-radius-lg);
		background: rgba(255, 255, 255, 0.015);
	}
	.pa-tl__followup-icon {
		display: grid;
		place-items: center;
		width: 46px;
		height: 46px;
		border-radius: 11px;
		color: var(--tt-gold);
		border: 1px solid var(--tt-line);
		background: rgba(255, 255, 255, 0.02);
	}
	.pa-tl__followup-tag {
		color: var(--tt-gold);
	}
	.pa-tl__followup-text {
		margin-top: 0.35rem;
		max-width: 62ch;
		color: var(--tt-fog);
	}

	@media (min-width: 940px) {
		.pa-tl__grid {
			grid-template-columns: 260px 1fr;
			gap: clamp(3rem, 5vw, 5rem);
			align-items: start;
		}
		.pa-tl__rail {
			display: block;
			position: sticky;
			top: calc(var(--tt-header-h) + 3rem);
		}
		.pa-tl__rail-tag {
			display: block;
			margin-bottom: 1.4rem;
			color: var(--tt-mute-2);
		}
		.pa-tl__rail-list {
			list-style: none;
			margin: 0;
			padding: 0;
			display: grid;
			gap: 0.2rem;
		}
		.pa-tl__rail-item {
			display: flex;
			align-items: baseline;
			gap: 1rem;
			padding: 0.7rem 0;
			border-bottom: 1px solid var(--tt-line);
			opacity: 0.45;
			transition:
				opacity 0.4s ease,
				transform 0.4s ease;
		}
		.pa-tl__rail-item.is-active {
			opacity: 1;
			transform: translateX(6px);
		}
		.pa-tl__rail-idx {
			font-size: 0.78rem;
			color: var(--tt-mute);
		}
		.pa-tl__rail-item.is-active .pa-tl__rail-idx {
			color: var(--tt-red-bright);
		}
		.pa-tl__rail-label {
			font-family: var(--tt-font-display);
			font-size: 1.25rem;
			letter-spacing: 0.06em;
			color: #fff;
		}
		.pa-tl__progress {
			position: relative;
			margin-top: 1.6rem;
			margin-left: 2px;
			width: 2px;
			height: 120px;
			background: var(--tt-line);
			border-radius: 2px;
			overflow: hidden;
		}
		.pa-tl__progress-bar {
			position: absolute;
			inset: 0;
			transform-origin: top;
			background: linear-gradient(180deg, var(--tt-red-bright), var(--tt-red));
			transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
		}
	}
</style>
