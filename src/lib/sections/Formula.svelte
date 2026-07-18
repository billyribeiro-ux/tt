<script lang="ts">
	import { formula } from '$lib/data/site';
	import { reveal, splitReveal } from '$lib/motion';
	import GraduationCapIcon from 'phosphor-svelte/lib/GraduationCapIcon';
	import WrenchIcon from 'phosphor-svelte/lib/WrenchIcon';
	import SunHorizonIcon from 'phosphor-svelte/lib/SunHorizonIcon';
	import CrosshairIcon from 'phosphor-svelte/lib/CrosshairIcon';
	import CompassIcon from 'phosphor-svelte/lib/CompassIcon';

	const icons = [GraduationCapIcon, WrenchIcon, SunHorizonIcon, CrosshairIcon, CompassIcon];

	let listEl: HTMLElement | undefined = $state();
	let activeIndex = $state(0);

	// Highlight the fix that's currently centered in the viewport.
	$effect(() => {
		if (!listEl || typeof IntersectionObserver === 'undefined') return;
		const els = Array.from(listEl.querySelectorAll<HTMLElement>('[data-step]'));
		if (!els.length) return;
		const io = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						const idx = Number((entry.target as HTMLElement).dataset.step);
						if (!Number.isNaN(idx)) activeIndex = idx;
					}
				}
			},
			{ rootMargin: '-48% 0px -48% 0px', threshold: 0 }
		);
		els.forEach((el) => io.observe(el));
		return () => io.disconnect();
	});
</script>

<section id="formula" class="tt-section fx" aria-labelledby="fx-title">
	<div class="fx__bg grid-bg" aria-hidden="true"></div>
	<span class="fx__glow" aria-hidden="true"></span>

	<div class="tt-container">
		<header class="fx__head">
			<p class="label fx__kicker" data-anim {@attach reveal({ y: 16, duration: 0.65 })}>
				<span class="fx__tick" aria-hidden="true"></span>The system
			</p>
			<h2 id="fx-title" class="fx__title" data-split {@attach splitReveal({ stagger: 0.03 })}>
				The Massive <span class="text-red">Results</span> Formula
			</h2>
			<p class="fx__intro prose" data-anim {@attach reveal({ y: 20, duration: 0.85, delay: 0.1 })}>
				A strategy isn’t another setup. It’s knowing what <em>not</em> to do. Five disciplines, five
				demons removed. This is how consistency is built.
			</p>
		</header>

		<div class="fx__grid">
			<!-- Sticky rail: the five demons, active one lit -->
			<aside class="fx__rail" aria-hidden="true">
				<span class="label fx__rail-tag">The 5 fixes</span>
				<ol class="fx__rail-list">
					{#each formula as f, i (f.fixTitle)}
						<li class="fx__rail-item" class:is-active={activeIndex === i}>
							<span class="fx__rail-idx num">0{i + 1}</span>
							<span class="fx__rail-label">{f.fixTitle}</span>
						</li>
					{/each}
				</ol>
				<div class="fx__progress">
					<span
						class="fx__progress-bar"
						style:transform="scaleY({(activeIndex + 1) / formula.length})"
					></span>
				</div>
			</aside>

			<!-- The five steps -->
			<ol class="fx__steps" bind:this={listEl}>
				{#each formula as f, i (f.pillar)}
					{@const Icon = icons[i] ?? GraduationCapIcon}
					<li
						class="fx__step"
						class:is-active={activeIndex === i}
						data-step={i}
						data-anim
						{@attach reveal({ y: 48, duration: 1 })}
					>
						<div class="fx__step-top">
							<span class="fx__step-idx num">0{i + 1}</span>
							<span class="fx__step-icon"><Icon size={22} weight="regular" /></span>
							<span class="fx__step-fix label">{f.fixTitle}</span>
						</div>
						<h3 class="fx__step-pillar">{f.pillar}</h3>
						<p class="fx__step-lead">{f.lead}</p>
						<p class="fx__step-body">{f.fix}</p>
					</li>
				{/each}
			</ol>
		</div>
	</div>
</section>

<style>
	.fx {
		position: relative;
		overflow: clip;
		background: var(--tt-ink);
	}
	.fx__bg {
		position: absolute;
		inset: 0;
		opacity: 0.35;
	}
	.fx__glow {
		position: absolute;
		top: 20%;
		left: -12%;
		width: 46vw;
		height: 46vw;
		max-width: 640px;
		max-height: 640px;
		background: radial-gradient(circle, rgb(var(--tt-red-rgb) / 0.28), transparent 64%);
		filter: blur(30px);
		pointer-events: none;
	}

	.fx__head {
		position: relative;
		max-width: 760px;
		margin-bottom: clamp(2.5rem, 5vw, 4.5rem);
	}
	.fx__kicker {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		color: var(--tt-fog);
	}
	.fx__tick {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--tt-red-bright);
		box-shadow: 0 0 10px var(--tt-red-bright);
	}
	.fx__title {
		margin-top: 1.1rem;
		font-size: var(--fs-h2);
		font-weight: 800;
		letter-spacing: -0.02em;
	}
	.fx__intro {
		margin-top: 1.3rem;
	}
	.fx__intro em {
		color: var(--tt-white);
		font-style: italic;
	}

	.fx__grid {
		position: relative;
		display: grid;
		gap: 2.5rem;
	}

	/* Rail hidden on small screens; the steps carry their own index/fix */
	.fx__rail {
		display: none;
	}

	.fx__steps {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: clamp(1rem, 2vw, 1.6rem);
	}
	.fx__step {
		position: relative;
		padding: clamp(1.6rem, 3vw, 2.4rem);
		border: 1px solid var(--tt-line);
		border-radius: var(--tt-radius-lg);
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent);
		transition:
			border-color 0.5s ease,
			background 0.5s ease,
			transform 0.5s ease;
	}
	.fx__step.is-active {
		border-color: rgb(var(--tt-red-rgb) / 0.5);
		background: linear-gradient(180deg, rgb(var(--tt-red-rgb) / 0.08), transparent);
	}
	.fx__step-top {
		display: flex;
		align-items: center;
		gap: 0.9rem;
		margin-bottom: 1.1rem;
	}
	.fx__step-idx {
		font-size: 1rem;
		font-weight: 700;
		color: var(--tt-red-bright);
	}
	.fx__step-icon {
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
	.fx__step.is-active .fx__step-icon {
		color: var(--tt-white);
		border-color: rgb(var(--tt-red-rgb) / 0.6);
	}
	.fx__step-fix {
		margin-left: auto;
		color: var(--tt-mute);
		transition: color 0.4s ease;
	}
	.fx__step.is-active .fx__step-fix {
		color: var(--tt-red-bright);
	}
	.fx__step-pillar {
		font-size: var(--fs-h3);
		font-weight: 700;
		letter-spacing: -0.01em;
	}
	.fx__step-lead {
		margin-top: 0.7rem;
		font-size: var(--fs-lead);
		color: var(--tt-fog);
	}
	.fx__step-body {
		margin-top: 0.9rem;
		max-width: 62ch;
		color: var(--tt-mute);
	}

	@media (min-width: 1024px) {
		.fx__grid {
			grid-template-columns: 300px 1fr;
			gap: clamp(3rem, 5vw, 5rem);
			align-items: start;
		}
		.fx__rail {
			display: block;
			position: sticky;
			top: calc(var(--tt-header-h) + 3rem);
		}
		.fx__rail-tag {
			display: block;
			margin-bottom: 1.4rem;
			color: var(--tt-mute-2);
		}
		.fx__rail-list {
			list-style: none;
			margin: 0;
			padding: 0;
			display: grid;
			gap: 0.2rem;
		}
		.fx__rail-item {
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
		.fx__rail-item.is-active {
			opacity: 1;
			transform: translateX(6px);
		}
		.fx__rail-idx {
			font-size: 0.78rem;
			color: var(--tt-mute);
		}
		.fx__rail-item.is-active .fx__rail-idx {
			color: var(--tt-red-bright);
		}
		.fx__rail-label {
			font-family: var(--tt-font-display);
			font-size: 1.25rem;
			letter-spacing: 0.02em;
			color: var(--tt-white);
		}
		.fx__progress {
			position: relative;
			margin-top: 1.6rem;
			margin-left: 2px;
			width: 2px;
			height: 120px;
			background: var(--tt-line);
			border-radius: 2px;
			overflow: hidden;
		}
		.fx__progress-bar {
			position: absolute;
			inset: 0;
			transform-origin: top;
			background: linear-gradient(180deg, var(--tt-red-bright), var(--tt-red));
			transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
		}
	}
</style>
