<script lang="ts">
	import { reveal, splitReveal, drawLine } from '$lib/motion';
	import { steps } from './data';
</script>

<section id="process" class="proc tt-section" aria-labelledby="proc-title">
	<span class="proc__glow" aria-hidden="true"></span>

	<div class="tt-container">
		<header class="proc__head">
			<div class="section-head">
				<span class="idx">02 / 03</span>
				<span class="rule"></span>
				<span class="label">How it works</span>
			</div>
			<h2 id="proc-title" class="proc__title" data-split {@attach splitReveal({ stagger: 0.03 })}>
				Three steps to a plan you actually follow.
			</h2>
			<p class="proc__intro prose">
				No spreadsheets to figure out alone, no generic templates. It’s your numbers, a real coach,
				and ninety days of structured collaboration.
			</p>
		</header>

		<div class="proc__chart">
			<!-- Decorative rising line drawn across the three steps as you scroll. -->
			<svg
				class="proc__spark"
				aria-hidden="true"
				viewBox="0 0 1000 200"
				preserveAspectRatio="none"
				{@attach drawLine()}
			>
				<path d="M0 180 C 150 160 210 96 340 80 C 470 64 520 128 660 104 C 800 80 850 40 1000 24" />
			</svg>

			<ol class="proc__ladder" data-anim-stagger {@attach reveal({ stagger: 0.12, y: 40 })}>
				{#each steps as step (step.n)}
					{@const Icon = step.Icon}
					<li class="proc__step">
						<span class="proc__num num" aria-hidden="true">{step.n}</span>
						<span class="proc__ico" aria-hidden="true"><Icon size={26} weight="light" /></span>
						<h3 class="proc__name">{step.name}</h3>
						<p class="proc__body">{step.body}</p>
					</li>
				{/each}
			</ol>
		</div>
	</div>
</section>

<style>
	.proc {
		position: relative;
		overflow: clip;
	}
	.proc__glow {
		position: absolute;
		top: 10%;
		right: -10%;
		width: 44vw;
		height: 44vw;
		max-width: 600px;
		max-height: 600px;
		z-index: 0;
		pointer-events: none;
		background: radial-gradient(circle, rgb(var(--tt-red-rgb) / 0.14), transparent 64%);
		filter: blur(26px);
	}
	.proc .tt-container {
		position: relative;
		z-index: 1;
	}
	.proc__head {
		max-width: 760px;
		margin-bottom: clamp(2.5rem, 5vw, 4rem);
	}
	.proc__title {
		font-size: var(--fs-h2);
		max-width: 18ch;
	}
	.proc__intro {
		margin-top: 1.3rem;
	}

	.proc__chart {
		position: relative;
	}
	.proc__spark {
		position: absolute;
		inset: 0;
		z-index: 0;
		width: 100%;
		height: 100%;
		opacity: 0.5;
		pointer-events: none;
	}
	.proc__spark path {
		fill: none;
		stroke: var(--tt-red-bright);
		stroke-width: 1.5;
		stroke-linecap: round;
		stroke-linejoin: round;
		vector-effect: non-scaling-stroke;
		filter: drop-shadow(0 0 6px rgb(var(--tt-red-bright-rgb) / 0.4));
	}
	.proc__ladder {
		position: relative;
		z-index: 1;
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: clamp(1.3rem, 3vw, 1.9rem);
	}
	.proc__step {
		position: relative;
		padding: clamp(1.6rem, 3vw, 2.3rem);
		border: 1px solid var(--tt-line);
		border-radius: var(--tt-radius-lg);
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent);
		overflow: hidden;
	}
	.proc__num {
		display: block;
		font-size: clamp(2.4rem, 1.6rem + 3vw, 3.6rem);
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.04em;
		color: transparent;
		-webkit-text-stroke: 1px var(--tt-line-strong);
	}
	.proc__ico {
		display: grid;
		place-items: center;
		width: 48px;
		height: 48px;
		margin-top: 1.2rem;
		border-radius: 12px;
		color: var(--tt-red-bright);
		border: 1px solid rgb(var(--tt-red-rgb) / 0.35);
		background: rgb(var(--tt-red-rgb) / 0.06);
	}
	.proc__name {
		margin-top: 1.2rem;
		font-size: var(--fs-h4);
		font-weight: 700;
		color: var(--tt-white);
	}
	.proc__body {
		margin-top: 0.8rem;
		max-width: 46ch;
		color: var(--tt-fog);
		font-size: 0.96rem;
	}

	@media (min-width: 768px) {
		.proc__ladder {
			grid-template-columns: repeat(3, 1fr);
		}
	}
</style>
