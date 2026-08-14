<script lang="ts">
	import { onMount } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import { study } from '$lib/pages/project-alpha/data/content';
	import { assets } from '$lib/pages/project-alpha/data/assets';
	import { ui } from '$lib/pages/project-alpha/state/ui.svelte';
	import { ensureGsap } from '$lib/pages/project-alpha/motion/gsap-setup';
	import { magnetic } from '$lib/pages/project-alpha/actions/magnetic';
	import { scrollToId } from '$lib/pages/project-alpha/motion/smooth-scroll';
	import type { Component } from 'svelte';
	import NeuroTradeHud from '../viz/NeuroTradeHud.svelte';

	// The neural scene carries three.js (~700 KB raw); load it off the critical
	// path so the hero's copy and HUD paint instantly. The brain fades in when
	// the module lands, which reads as a deliberate warm-up rather than a wait.
	let NeuralScene = $state<Component | null>(null);
	onMount(() => {
		let cancelled = false;
		import('../viz/NeuralScene.svelte').then((m) => {
			if (!cancelled) NeuralScene = m.default;
		});
		return () => {
			cancelled = true;
		};
	});
	import ArrowDownIcon from 'phosphor-svelte/lib/ArrowDownIcon';
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';

	let root: HTMLElement | undefined;

	const captureRoot: Attachment<HTMLElement> = (node) => {
		root = node;
		return () => {
			if (root === node) root = undefined;
		};
	};

	onMount(() => {
		if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const gsap = ensureGsap();
		let context: ReturnType<typeof gsap.context> | undefined;
		let started = false;

		const startHero = () => {
			if (started || !root) return;
			started = true;
			context = gsap.context(() => {
				const timeline = gsap.timeline({
					defaults: { ease: 'expo.out' }
				});

				timeline
					.from('.hero-stage', { opacity: 0, scale: 1.045, duration: 2.1 })
					.from('.hero-rule', { scaleX: 0, transformOrigin: 'left', duration: 1.05 }, '-=1.45')
					.from('.hero-eyebrow > *', { y: 16, opacity: 0, stagger: 0.12, duration: 0.82 }, '-=0.85')
					.from(
						'.title-line',
						{ yPercent: 108, opacity: 0, stagger: 0.18, duration: 1.4 },
						'-=0.55'
					)
					.from('.hero-manifesto', { y: 24, opacity: 0, duration: 1.05 }, '-=0.82')
					.from('.hero-bridge', { y: 20, opacity: 0, duration: 0.95 }, '-=0.72')
					.from('.hero-actions > *', { y: 18, opacity: 0, stagger: 0.13, duration: 0.88 }, '-=0.62')
					.from('.hero-stat', { y: 14, opacity: 0, stagger: 0.12, duration: 0.82 }, '-=0.52')
					.from('.hero-hud', { y: 18, opacity: 0, duration: 0.95 }, '-=0.58')
					.from('.stage-callout', { opacity: 0, x: 14, stagger: 0.18, duration: 0.9 }, '-=0.68')
					.from('.scroll-cue', { opacity: 0, y: -8, duration: 0.72 }, '-=0.32');

				const copyExit = gsap.to('.hero-copy', {
					yPercent: 9,
					opacity: 0.42,
					ease: 'none',
					scrollTrigger: {
						trigger: root,
						start: 'top top',
						end: 'bottom 15%',
						scrub: 1.6
					}
				});

				const stageExit = gsap.to('.hero-stage', {
					scale: 0.96,
					xPercent: 2.5,
					ease: 'none',
					scrollTrigger: {
						trigger: root,
						start: 'top top',
						end: 'bottom 10%',
						scrub: 1.8
					}
				});

				copyExit.scrollTrigger?.disable();
				stageExit.scrollTrigger?.disable();
				timeline.eventCallback('onComplete', () => {
					copyExit.scrollTrigger?.enable();
					stageExit.scrollTrigger?.enable();
					copyExit.scrollTrigger?.refresh();
					stageExit.scrollTrigger?.refresh();
				});
			}, root);
		};

		window.addEventListener('alpha:intro-complete', startHero, { once: true });
		if (document.documentElement.classList.contains('cinematic-intro-complete')) {
			requestAnimationFrame(startHero);
		}

		return () => {
			window.removeEventListener('alpha:intro-complete', startHero);
			context?.revert();
		};
	});
</script>

<section id="hero" class="hero" {@attach captureRoot} aria-labelledby="hero-title">
	<div class="hero-grid" aria-hidden="true"></div>
	<div class="hero-bloom bloom-red" aria-hidden="true"></div>
	<div class="hero-bloom bloom-blue" aria-hidden="true"></div>

	<div class="hero-stage">
		{#if NeuralScene}
			<NeuralScene />
		{/if}
		<div class="stage-callouts" aria-hidden="true">
			<div class="stage-callout callout-a">
				<span class="callout-line"></span>
				<span><b>01</b> Frontal regulation</span>
			</div>
			<div class="stage-callout callout-b">
				<span class="callout-line"></span>
				<span><b>02</b> Alpha coherence</span>
			</div>
			<div class="stage-callout callout-c">
				<span class="callout-line"></span>
				<span><b>03</b> Execution discipline</span>
			</div>
		</div>
	</div>

	<div class="hero-content">
		<div class="hero-copy">
			<div class="hero-rule" aria-hidden="true"></div>

			<div class="hero-eyebrow">
				<img
					class="tt-badge"
					src={assets.trickTradesLogo.src}
					alt={assets.trickTradesLogo.alt}
					width="38"
					height="38"
					decoding="async"
				/>
				<div>
					<span>{study.brand}</span>
					<span class="eyebrow-muted">Neurofeedback research · 2026</span>
				</div>
			</div>

			<h1 id="hero-title" class="hero-title">
				<span class="title-mask"><span class="title-line project">Project</span></span>
				<span class="title-mask"><span class="title-line alpha">ALPHA</span></span>
			</h1>

			<p class="hero-manifesto">
				The market isn’t the first thing you trade. <em>Your state is.</em>
			</p>

			<p class="hero-bridge">
				A {study.days}-day investigation into whether training the brain toward
				<strong>{study.alphaBand.minHz}–{study.alphaBand.maxHz} Hz alpha</strong> can reduce emotional
				reactivity and sharpen live execution.
			</p>

			<div class="hero-actions">
				<button
					type="button"
					class="btn-primary"
					use:magnetic={0.18}
					onclick={() => ui.openApply()}
				>
					Apply for the study
					<ArrowRightIcon size={17} weight="bold" />
				</button>
				<button type="button" class="btn-ghost" onclick={() => scrollToId('hypothesis')}
					>Explore the protocol</button
				>
			</div>

			<div class="hero-stats" role="group" aria-label="Study overview">
				<div class="hero-stat">
					<span class="stat-value">{study.days}</span>
					<span class="stat-label">Days of protocol</span>
				</div>
				<div class="hero-stat">
					<span class="stat-value">{study.participants}</span>
					<span class="stat-label">Trader cohort</span>
				</div>
				<div class="hero-stat investigator">
					<span class="stat-value">PhD</span>
					<span class="stat-label">{study.investigator.name}</span>
				</div>
			</div>
		</div>
	</div>

	<div class="hero-hud">
		<div class="hud-label">
			<span class="live-dot"></span>
			<span>Research signal model</span>
		</div>
		<NeuroTradeHud />
		<p>[{study.disclaimer.toUpperCase()} · ILLUSTRATIVE SIGNALS]</p>
	</div>

	<div class="hero-corner hero-corner-left" aria-hidden="true">
		<span>TT / PA–090</span>
		<span>EEG × EXECUTION</span>
	</div>

	<img
		class="hero-wordmark"
		src={assets.projectAlpha.src}
		alt=""
		width={assets.projectAlpha.width}
		height={assets.projectAlpha.height}
		decoding="async"
	/>

	<button
		class="scroll-cue"
		type="button"
		onclick={() => scrollToId('hypothesis')}
		aria-label="Scroll to the study hypothesis"
	>
		<span>Begin protocol</span>
		<span class="scroll-line"></span>
		<ArrowDownIcon size={14} weight="bold" />
	</button>
</section>

<style>
	.hero {
		position: relative;
		min-height: max(760px, 100svh);
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		align-items: center;
		overflow: clip;
		background:
			linear-gradient(90deg, rgba(7, 7, 9, 0.98) 0%, rgba(7, 7, 9, 0.82) 43%, transparent 70%),
			#070709;
	}

	.hero-grid {
		position: absolute;
		inset: 0;
		z-index: 0;
		opacity: 0.26;
		background-image:
			linear-gradient(rgba(255, 255, 255, 0.024) 1px, transparent 1px),
			linear-gradient(90deg, rgba(255, 255, 255, 0.024) 1px, transparent 1px);
		background-size: 76px 76px;
		mask-image: linear-gradient(90deg, #000, transparent 84%);
	}

	.hero-bloom {
		position: absolute;
		z-index: 0;
		width: 42rem;
		height: 42rem;
		border-radius: 50%;
		pointer-events: none;
		filter: blur(10px);
	}

	.bloom-red {
		left: -25rem;
		top: -18rem;
		background: radial-gradient(circle, rgba(152, 0, 0, 0.13), transparent 68%);
	}

	.bloom-blue {
		right: -20rem;
		bottom: -24rem;
		background: radial-gradient(circle, rgba(59, 139, 235, 0.11), transparent 68%);
	}

	.hero-stage {
		position: absolute;
		z-index: 0;
		inset: 0;
		transform-origin: 72% 50%;
		will-change: transform, opacity;
	}

	.hero-content {
		position: relative;
		z-index: 4;
		width: min(1320px, calc(100% - 3rem));
		margin: 0 auto;
		padding: calc(var(--nav-h) + 4rem) 0 13.5rem;
		pointer-events: none;
	}

	.hero-copy {
		width: min(690px, 57%);
		pointer-events: auto;
	}

	.hero-rule {
		width: min(100%, 530px);
		height: 1px;
		margin-bottom: 1.25rem;
		background: linear-gradient(
			90deg,
			var(--alpha-red-bright),
			rgba(59, 139, 235, 0.42),
			transparent
		);
		box-shadow: 0 0 14px rgba(184, 32, 32, 0.22);
	}

	.hero-eyebrow {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1.2rem;
		font-size: var(--fs-eyebrow);
		font-weight: 800;
		letter-spacing: 0.19em;
		text-transform: uppercase;
		color: var(--alpha-text);
	}

	.hero-eyebrow > div {
		display: flex;
		flex-direction: column;
		gap: 0.12rem;
	}

	.eyebrow-muted {
		color: var(--alpha-faint);
		font-size: var(--fs-nano);
	}

	.tt-badge {
		width: 38px;
		height: 38px;
		border-radius: 9px;
		object-fit: cover;
		background: #000;
		box-shadow:
			0 0 0 1px rgba(255, 255, 255, 0.1),
			0 12px 30px -16px rgba(0, 0, 0, 0.95);
	}

	.hero-title {
		margin: 0 0 1.25rem;
		font-weight: 700;
		font-size: clamp(4.75rem, 8.4vw, 8.25rem);
		line-height: 1;
		letter-spacing: -0.078em;
	}

	.title-mask {
		display: block;
		overflow: clip;
		padding: 0.1em 0.08em 0.2em 0;
		line-height: 1.04;
	}

	.title-mask + .title-mask {
		margin-top: -0.34em;
	}

	.title-line {
		display: inline-block;
		line-height: 1;
	}

	.title-line.project {
		color: rgba(239, 239, 237, 0.9);
		font-size: 0.58em;
		font-style: italic;
		letter-spacing: -0.06em;
	}

	.title-line.alpha {
		background: linear-gradient(105deg, #f4f6fa 0%, #b6c8e6 45%, #3b8beb 78%, #b82020 118%);
		background-size: 180% auto;
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
		text-shadow: 0 0 50px rgba(59, 139, 235, 0.08);
		animation: title-sheen 10s ease-in-out infinite alternate;
	}

	.hero-manifesto {
		max-width: 610px;
		margin: 0 0 1rem;
		font-size: clamp(1.35rem, 2.25vw, 2rem);
		line-height: 1.2;
		letter-spacing: -0.025em;
		color: var(--alpha-muted);
		text-wrap: balance;
	}

	.hero-manifesto em {
		font-style: italic;
		color: var(--alpha-text);
	}

	.hero-bridge {
		max-width: 560px;
		margin: 0 0 1.75rem;
		font-size: var(--fs-body);
		line-height: 1.75;
		color: var(--alpha-muted);
		text-wrap: pretty;
	}

	.hero-bridge strong {
		font-weight: 700;
		color: #c3d8f7;
	}

	.hero-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.7rem;
		margin-bottom: 2rem;
	}

	.hero-stats {
		display: flex;
		width: min(590px, 100%);
		border-top: 1px solid rgba(255, 255, 255, 0.09);
		border-bottom: 1px solid rgba(255, 255, 255, 0.09);
	}

	.hero-stat {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
		padding: 0.9rem 1rem 0.85rem 0;
		border-right: 1px solid rgba(255, 255, 255, 0.09);
	}

	.hero-stat + .hero-stat {
		padding-left: 1rem;
	}

	.hero-stat:last-child {
		border-right: none;
	}

	.stat-value {
		font-size: var(--fs-h4);
		font-weight: 700;
		font-variant-numeric: lining-nums;
		line-height: 1.1;
		color: var(--alpha-text);
	}

	.stat-label {
		font-size: var(--fs-nano);
		font-weight: 700;
		letter-spacing: 0.11em;
		text-transform: uppercase;
		color: var(--alpha-faint);
	}

	.hero-hud {
		position: absolute;
		z-index: 5;
		left: 50%;
		bottom: 1.2rem;
		width: min(900px, calc(100% - 10rem));
		transform: translateX(-50%);
		padding: 0.75rem 1rem 0.55rem;
		border: 1px solid rgba(255, 255, 255, 0.075);
		border-radius: 16px;
		background: rgba(8, 8, 11, 0.72);
		backdrop-filter: blur(18px) saturate(1.25);
		box-shadow: 0 22px 70px -30px rgba(0, 0, 0, 0.95);
	}

	.hero-hud :global(.hud) {
		margin-bottom: 0.4rem;
	}

	.hud-label {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.45rem;
		margin-bottom: 0.55rem;
		font-size: var(--fs-nano);
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--alpha-faint);
	}

	.live-dot {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: var(--alpha-teal);
		box-shadow: 0 0 9px var(--alpha-teal);
		animation: live-pulse 2.4s ease-in-out infinite;
	}

	.hero-hud > p {
		margin: 0;
		text-align: center;
		font-size: var(--fs-nano);
		font-weight: 700;
		letter-spacing: 0.12em;
		color: #4b4b52;
	}

	.stage-callouts {
		position: absolute;
		inset: 0;
	}

	.stage-callout {
		position: absolute;
		display: flex;
		align-items: center;
		gap: 0.55rem;
		font-size: var(--fs-nano);
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #737681;
	}

	.stage-callout b {
		margin-right: 0.35rem;
		font-size: var(--fs-nano);
		color: var(--alpha-blue);
	}

	.callout-line {
		width: clamp(2rem, 5vw, 5rem);
		height: 1px;
		background: linear-gradient(90deg, transparent, rgba(59, 139, 235, 0.5));
	}

	.callout-a {
		top: 28%;
		right: 5%;
	}

	.callout-b {
		top: 48%;
		right: 2%;
	}

	.callout-c {
		top: 68%;
		right: 7%;
	}

	/* Once the protocol rail appears (>=1320px) the callouts yield its lane,
	   mirroring the shell's reserved rail gutter in alpha.css. */
	@media (min-width: 1320px) {
		.callout-a {
			right: calc(5% + 132px);
		}

		.callout-b {
			right: calc(2% + 132px);
		}

		.callout-c {
			right: calc(7% + 132px);
		}
	}

	.hero-corner {
		position: absolute;
		z-index: 5;
		left: 1.5rem;
		bottom: 1.65rem;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		font-size: var(--fs-nano);
		font-weight: 700;
		letter-spacing: 0.14em;
		color: #45454c;
	}

	.hero-wordmark {
		position: absolute;
		z-index: 2;
		top: calc(var(--nav-h) + 1.4rem);
		right: 1.5rem;
		width: 155px;
		height: auto;
		aspect-ratio: 721 / 293;
		object-fit: contain;
		opacity: 0.22;
		mix-blend-mode: screen;
		/* The PNG carries a baked #111 plate that screen-blending lightens into
		   a hard-edged box over the starfield / brain; its lettering sits within
		   6% side / 17% vertical margins, so feathering the edges hides the
		   plate without touching ink. */
		-webkit-mask-image:
			linear-gradient(90deg, transparent, #000 5.5%, #000 94.5%, transparent),
			linear-gradient(180deg, transparent, #000 16%, #000 84%, transparent);
		-webkit-mask-composite: source-in;
		mask-image:
			linear-gradient(90deg, transparent, #000 5.5%, #000 94.5%, transparent),
			linear-gradient(180deg, transparent, #000 16%, #000 84%, transparent);
		mask-composite: intersect;
	}

	.scroll-cue {
		position: absolute;
		z-index: 6;
		right: 1.4rem;
		bottom: 1.3rem;
		display: flex;
		align-items: center;
		gap: 0.55rem;
		font-size: var(--fs-nano);
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--alpha-faint);
	}

	.scroll-line {
		width: 2.8rem;
		height: 1px;
		background: linear-gradient(90deg, var(--alpha-faint), transparent);
	}

	@keyframes title-sheen {
		to {
			background-position: 100% center;
		}
	}

	@keyframes live-pulse {
		50% {
			opacity: 0.35;
			transform: scale(0.72);
		}
	}

	@media (max-width: 1040px) {
		.hero {
			min-height: auto;
			display: block;
			background: #070709;
		}

		.hero-stage {
			position: relative;
			inset: auto;
			height: 54svh;
			min-height: 440px;
			margin-top: var(--nav-h);
		}

		.hero-stage::after {
			content: '';
			position: absolute;
			inset: 0;
			background: linear-gradient(180deg, transparent 55%, #070709 100%);
			pointer-events: none;
		}

		.hero-content {
			width: min(760px, calc(100% - 2rem));
			padding: 0 0 13rem;
			margin-top: -2.75rem;
		}

		.hero-copy {
			width: 100%;
		}

		.hero-title {
			font-size: clamp(4.6rem, 14vw, 7.5rem);
		}

		.stage-callouts {
			display: none;
		}

		.hero-hud {
			width: min(760px, calc(100% - 2rem));
			bottom: 1.1rem;
		}

		.hero-wordmark {
			top: calc(var(--nav-h) + 0.5rem);
		}

		.hero-corner,
		.scroll-cue {
			display: none;
		}
	}

	@media (max-width: 620px) {
		.hero-stage {
			height: 48svh;
			min-height: 390px;
		}

		.hero-content {
			margin-top: -1.4rem;
			padding-bottom: 15.5rem;
		}

		.hero-title {
			font-size: clamp(3.8rem, 19vw, 6.2rem);
			margin-bottom: 1.35rem;
		}

		/* The font-size that was here set 1.35rem, which is exactly the floor of the
		   base rule's own `clamp(1.35rem, 2.25vw, 2rem)` — at any width this media
		   query matches, 2.25vw is already well under 1.35rem, so the clamp returns
		   that floor with or without the override. It was a no-op. */

		.hero-actions {
			flex-direction: column;
			align-items: stretch;
		}

		.hero-actions :global(button) {
			width: 100%;
		}

		.hero-stat {
			padding-inline: 0 0.5rem;
		}

		.hero-stat + .hero-stat {
			padding-left: 0.5rem;
		}

		/* No font-size override either: the base is now `--fs-h4`, whose clamp floor
		   is 1.15rem, so this rule's old 1.2rem would have made the stat LARGER on
		   the narrow viewports it targets than the fluid rung it was overriding. */

		/* No font-size here any more. This used to step 0.58rem down to 0.5rem for
		   narrow viewports; both now resolve to `--fs-nano`, whose clamp already
		   does that step fluidly, so restating it would be a declaration that
		   overrides itself with the same value. The tracking still tightens. */
		.stat-label {
			letter-spacing: 0.08em;
		}

		.hero-hud {
			padding-inline: 0.55rem;
		}

		.hero-hud :global(.hud) {
			display: grid;
			grid-template-columns: 1fr 1fr;
		}

		.hero-wordmark {
			width: 115px;
			right: 0.75rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.title-line.alpha,
		.live-dot {
			animation: none;
		}
	}
</style>
