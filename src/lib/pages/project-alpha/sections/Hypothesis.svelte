<script lang="ts">
	import { study } from '$lib/pages/project-alpha/data/content';
	import BioMarketMonitor from '../viz/BioMarketMonitor.svelte';
	import BrainIcon from 'phosphor-svelte/lib/BrainIcon';
	import ChartLineUpIcon from 'phosphor-svelte/lib/ChartLineUpIcon';
</script>

<section id="hypothesis" class="section-shell" data-chapter="01" aria-labelledby="hypothesis-title">
	<div class="intro reveal">
		<p class="section-label">The problem</p>
		<h2 id="hypothesis-title" class="section-title">Why most traders fail</h2>
		<p class="section-desc">{study.problem}</p>
	</div>

	<div
		class="problem-signal reveal"
		role="group"
		aria-label="The behavioral gap this study investigates"
	>
		<div class="failure-stat">
			<strong>90<span>%</span></strong>
			<p>
				The industry teaches the setup.<br />
				<span>Almost no one trains the state executing it.</span>
			</p>
		</div>
		<div class="signal-shift" aria-hidden="true">
			<span class="chaos">fear · greed · impulse · noise</span>
			<span class="signal-line"></span>
			<span class="coherence">observe · regulate · execute</span>
		</div>
	</div>

	<div class="thesis-row reveal">
		<div class="pill">
			<BrainIcon size={18} weight="duotone" />
			<span>Train α state (8–12 Hz)</span>
		</div>
		<span class="x" aria-hidden="true">×</span>
		<div class="pill trade">
			<ChartLineUpIcon size={18} weight="duotone" />
			<span>Execute with one-contract discipline</span>
		</div>
	</div>

	<div class="grid">
		<article class="hypothesis card-surface reveal">
			<div class="hyp-label">
				<BrainIcon size={16} weight="duotone" />
				Study hypothesis
			</div>
			<p class="hyp-body">
				Day traders who learn to achieve and maintain an
				<strong>alpha brainwave state ({study.alphaBand.minHz}–{study.alphaBand.maxHz} Hz)</strong>
				will demonstrate reduced emotional reactivity, improved technical execution, shorter learning
				curves, and greater consistency, compared to their own
				<span class="no-break">pre-study</span> baseline.
			</p>
			<ul class="hyp-metrics">
				<li>Lower emotional reactivity at the moment of entry / exit</li>
				<li>Cleaner technical execution (plan → order)</li>
				<li>Faster skill acquisition under pressure</li>
				<li>More consistent R-multiples over the 90-day window</li>
			</ul>
		</article>

		<div class="reveal viz">
			<BioMarketMonitor height={280} />
		</div>
	</div>
</section>

<style>
	.problem-signal {
		display: grid;
		grid-template-columns: minmax(250px, 0.72fr) 1.28fr;
		align-items: end;
		gap: clamp(2rem, 6vw, 6rem);
		margin: -1rem 0 clamp(3.5rem, 7vw, 6rem);
		padding: 1.5rem 0 1.7rem;
		border-top: 1px solid rgba(255, 255, 255, 0.08);
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	}

	.failure-stat {
		display: flex;
		align-items: flex-end;
		gap: 1.25rem;
	}

	.failure-stat strong {
		font-family: var(--font-display);
		font-size: clamp(5rem, 10vw, 8.5rem);
		font-weight: 650;
		line-height: 0.72;
		letter-spacing: -0.075em;
		color: var(--alpha-text);
	}

	.failure-stat strong span {
		font-size: 0.36em;
		color: var(--alpha-red-bright);
	}

	.failure-stat p {
		margin: 0;
		padding-bottom: 0.15rem;
		font-size: 0.72rem;
		font-weight: 650;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		line-height: 1.7;
		color: var(--alpha-muted);
	}

	.failure-stat p span {
		color: var(--alpha-faint);
	}

	.signal-shift {
		display: grid;
		grid-template-columns: auto minmax(3rem, 1fr) auto;
		align-items: center;
		gap: 1rem;
		padding-bottom: 0.2rem;
		font-size: 0.6rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		white-space: nowrap;
	}

	.chaos {
		color: #875757;
	}

	.coherence {
		color: #6d91bf;
	}

	.signal-line {
		position: relative;
		height: 1px;
		background: linear-gradient(90deg, var(--alpha-red), var(--alpha-blue));
	}

	.signal-line::before,
	.signal-line::after {
		content: '';
		position: absolute;
		top: 50%;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		transform: translateY(-50%);
	}

	.signal-line::before {
		left: 0;
		background: var(--alpha-red);
		box-shadow: 0 0 12px var(--alpha-red);
	}

	.signal-line::after {
		right: 0;
		background: var(--alpha-blue);
		box-shadow: 0 0 12px var(--alpha-blue);
	}

	.thesis-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.65rem 0.85rem;
		margin: 0 0 2rem;
	}

	.pill {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.55rem 0.9rem;
		border-radius: 999px;
		border: 1px solid color-mix(in srgb, var(--alpha-blue) 30%, var(--alpha-border));
		background: rgba(59, 139, 235, 0.08);
		color: var(--alpha-blue);
		font-size: 0.82rem;
		font-weight: 600;
	}

	.pill.trade {
		border-color: color-mix(in srgb, var(--alpha-gold) 35%, var(--alpha-border));
		background: rgba(212, 168, 83, 0.08);
		color: var(--alpha-gold);
	}

	.pill span {
		color: var(--alpha-text);
	}

	.x {
		color: var(--alpha-faint);
		font-weight: 600;
	}

	.grid {
		display: grid;
		gap: 1.25rem;
	}

	@media (min-width: 960px) {
		.grid {
			grid-template-columns: 0.95fr 1.05fr;
			align-items: stretch;
		}
	}

	.hypothesis {
		padding: 2.1rem 1.85rem 2rem 2.1rem;
		position: relative;
		overflow: hidden;
		height: 100%;
	}

	.hypothesis::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 4px;
		background: linear-gradient(180deg, var(--alpha-red), var(--alpha-blue), var(--alpha-gold));
		border-radius: 4px 0 0 4px;
	}

	.hyp-label {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		font-size: 0.65rem;
		font-weight: 600;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--alpha-blue);
		margin-bottom: 1rem;
	}

	.hyp-body {
		margin: 0 0 1.25rem;
		font-family: var(--font-display);
		font-size: clamp(1.1rem, 2.2vw, 1.28rem);
		line-height: 1.75;
		font-style: italic;
		color: var(--alpha-text);
	}

	.hyp-body strong {
		color: var(--alpha-red-bright);
		font-style: normal;
		font-weight: 600;
	}

	/* Keep the compound from breaking at its hyphen ("pre-" / "study"). */
	.no-break {
		white-space: nowrap;
	}

	.hyp-metrics {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.45rem;
	}

	.hyp-metrics li {
		position: relative;
		padding-left: 1.1rem;
		font-size: 0.88rem;
		color: var(--alpha-muted);
		line-height: 1.5;
	}

	.hyp-metrics li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.55rem;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--alpha-gold);
		box-shadow: 0 0 8px rgba(212, 168, 83, 0.5);
	}

	.viz {
		min-height: 100%;
	}

	@media (max-width: 860px) {
		.problem-signal {
			grid-template-columns: 1fr;
			gap: 2.5rem;
		}

		.signal-shift {
			white-space: normal;
		}
	}

	@media (max-width: 560px) {
		.failure-stat {
			align-items: center;
		}

		.failure-stat strong {
			font-size: 5.5rem;
		}

		.signal-shift {
			grid-template-columns: 1fr;
			gap: 0.75rem;
		}

		.signal-line {
			width: 100%;
		}
	}
</style>
