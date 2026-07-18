<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { reveal, splitReveal, parallax, jumpTo } from '$lib/motion';

	const applyUrl = 'https://tricktrades.com/project-alpha';

	// Study meta strip: every value is a stated fact from the protocol.
	// No named investigator is claimed here: attribution is unsourced, so the study
	// is framed by type rather than by a specific person.
	const meta = [
		{ k: 'Study type', v: 'Neuroscience research' },
		{ k: 'Participants', v: '30', note: 'subject to change' },
		{ k: 'Duration', v: '90 days', note: '+ 180-day follow-up' },
		{ k: 'Target band', v: '8–12 Hz', note: 'alpha rhythm' }
	];
</script>

<section class="pa-hero" aria-label="Project ALPHA">
	<div class="pa-hero__bg" aria-hidden="true">
		<div class="pa-hero__grid grid-bg"></div>
		<div class="pa-hero__glow" {@attach parallax(120)}></div>
	</div>

	<div class="tt-container pa-hero__inner">
		<div class="pa-hero__copy">
			<p class="pa-hero__kicker label">
				<span class="pa-hero__live" aria-hidden="true"></span>Neuroscience × Trading
			</p>

			<h1 class="pa-hero__title" data-split {@attach splitReveal({ stagger: 0.03 })}>
				Project <span class="text-red">ALPHA</span>
			</h1>

			<div class="pa-hero__stack" data-anim-stagger {@attach reveal({ stagger: 0.12, y: 26 })}>
				<p class="pa-hero__lede">
					A <strong>90-day neuroscience study</strong> testing a single question: can training the
					brain’s alpha rhythm (the <strong>8–12 Hz</strong> band tied to calm, alert focus) make day
					traders steadier under pressure, sharper in execution, and more consistent from one session
					to the next?
				</p>

				<div class="pa-hero__cta">
					<Button href={applyUrl}>Apply / Learn more</Button>
					<Button href="#protocol" variant="ghost" onclick={(e) => jumpTo(e, '#protocol')}>
						See the 90-day protocol
					</Button>
				</div>

				<dl class="pa-hero__meta">
					{#each meta as m (m.k)}
						<div class="pa-hero__meta-item">
							<dt class="label">{m.k}</dt>
							<dd class="num">
								{m.v}{#if m.note}<span class="pa-hero__meta-note"> {m.note}</span>{/if}
							</dd>
						</div>
					{/each}
				</dl>
			</div>
		</div>

		<!-- Illustrative EEG monitor: decorative, clearly labelled as not real data. -->
		<div
			class="pa-hero__panel"
			aria-hidden="true"
			{@attach parallax(-40)}
			data-anim
			{@attach reveal({ y: 60, scale: 0.97, duration: 1.2 })}
		>
			<div class="pa-panel__head">
				<span class="label pa-panel__tag"
					><span class="pa-panel__dot"></span>Live EEG · Mind Monitor</span
				>
				<span class="label pa-panel__band">α 8–12 Hz</span>
			</div>
			<div class="pa-panel__wave">
				<svg viewBox="0 0 620 180" preserveAspectRatio="none" role="presentation">
					<path
						class="pa-wave pa-wave--ghost"
						d="M0 96 C 34 40, 68 40, 102 96 S 170 152, 204 96 S 272 40, 306 96 S 374 152, 408 96 S 476 40, 510 96 S 578 152, 620 96"
					/>
					<path
						class="pa-wave pa-wave--live"
						d="M0 92 C 40 30, 78 150, 118 92 S 196 26, 236 92 S 314 150, 354 92 S 432 30, 472 92 S 552 150, 620 92"
					/>
				</svg>
			</div>
			<dl class="pa-panel__readout">
				<div>
					<dt>Band</dt>
					<dd>Alpha</dd>
				</div>
				<div>
					<dt>Range</dt>
					<dd>8–12 Hz</dd>
				</div>
				<div>
					<dt>State</dt>
					<dd>Focused calm</dd>
				</div>
			</dl>
			<p class="pa-panel__note label">Illustrative · not participant data</p>
		</div>
	</div>
</section>

<style>
	.pa-hero {
		position: relative;
		padding-top: calc(var(--tt-header-h) + clamp(2rem, 6vw, 5rem));
		padding-bottom: clamp(3rem, 6vw, 5rem);
		overflow: clip;
	}
	.pa-hero__bg {
		position: absolute;
		inset: 0;
		z-index: 0;
	}
	.pa-hero__grid {
		position: absolute;
		inset: -10% 0 0;
		opacity: 0.5;
	}
	.pa-hero__glow {
		position: absolute;
		top: -18%;
		right: -12%;
		width: 70vw;
		height: 70vw;
		max-width: 880px;
		max-height: 880px;
		background: radial-gradient(circle, rgb(var(--tt-red-rgb) / 0.4), transparent 62%);
		filter: blur(20px);
	}
	.pa-hero__inner {
		position: relative;
		z-index: 1;
		display: grid;
		gap: clamp(2.5rem, 5vw, 4rem);
		align-items: center;
	}
	.pa-hero__kicker {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		color: var(--tt-fog);
	}
	.pa-hero__live {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--tt-red-bright);
		box-shadow: 0 0 12px var(--tt-red-bright);
	}
	.pa-hero__title {
		margin-top: 1.4rem;
		font-size: var(--fs-mega);
		font-weight: 800;
		letter-spacing: -0.04em;
		line-height: 0.9;
		color: #fff;
		text-transform: uppercase;
	}
	.pa-hero__lede {
		margin-top: 1.6rem;
		max-width: 54ch;
		font-size: var(--fs-lead);
		color: var(--tt-fog);
	}
	.pa-hero__lede strong {
		color: #fff;
		font-weight: 600;
	}
	.pa-hero__cta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.9rem;
		margin-top: 2rem;
	}
	.pa-hero__meta {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: 1.4rem;
		margin: 2.6rem 0 0;
		padding-top: 1.8rem;
		border-top: 1px solid var(--tt-line);
	}
	.pa-hero__meta-item + .pa-hero__meta-item {
		padding-left: 1.4rem;
		border-left: 1px solid var(--tt-line-strong);
	}
	.pa-hero__meta-item dt {
		color: var(--tt-mute-2);
	}
	.pa-hero__meta-item dd {
		margin: 0.5rem 0 0;
		font-size: var(--fs-body);
		font-weight: 600;
		color: #fff;
		line-height: 1.15;
	}
	.pa-hero__meta-note {
		display: block;
		margin-top: 0.15rem;
		font-family: var(--tt-font-mono);
		font-size: 0.68rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--tt-red-bright);
	}

	/* Illustrative EEG monitor panel */
	.pa-hero__panel {
		position: relative;
		padding: clamp(1.2rem, 2.4vw, 1.7rem);
		border: 1px solid var(--tt-line-strong);
		border-radius: var(--tt-radius-lg);
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01));
		box-shadow: var(--tt-shadow-card);
	}
	.pa-panel__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}
	.pa-panel__tag {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--tt-fog);
	}
	.pa-panel__dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--tt-red-bright);
		box-shadow: 0 0 10px var(--tt-red-bright);
	}
	.pa-panel__band {
		color: var(--tt-gold);
	}
	.pa-panel__wave {
		margin: 1.1rem 0;
		height: clamp(120px, 22vw, 180px);
		border-radius: var(--tt-radius);
		border: 1px solid var(--tt-line);
		background:
			radial-gradient(120% 140% at 50% 0%, rgb(var(--tt-red-rgb) / 0.12), transparent 60%),
			var(--tt-ink);
		overflow: hidden;
	}
	.pa-panel__wave svg {
		width: 100%;
		height: 100%;
	}
	.pa-wave {
		fill: none;
		stroke-linecap: round;
	}
	.pa-wave--ghost {
		stroke: var(--tt-line-strong);
		stroke-width: 1.5;
	}
	.pa-wave--live {
		stroke: var(--tt-red-bright);
		stroke-width: 2.5;
		filter: drop-shadow(0 0 6px rgb(var(--tt-red-bright-rgb) / 0.55));
	}
	.pa-panel__readout {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.75rem;
	}
	.pa-panel__readout div {
		padding: 0.75rem 0.85rem;
		border: 1px solid var(--tt-line);
		border-radius: 10px;
		background: rgba(255, 255, 255, 0.02);
	}
	.pa-panel__readout dt {
		font-family: var(--tt-font-mono);
		font-size: 0.62rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--tt-mute-2);
	}
	.pa-panel__readout dd {
		margin: 0.3rem 0 0;
		font-size: 0.95rem;
		font-weight: 600;
		color: #fff;
	}
	.pa-panel__note {
		margin-top: 1rem;
		color: var(--tt-mute-2);
		font-size: 0.62rem;
	}

	@media (min-width: 1024px) {
		.pa-hero__inner {
			grid-template-columns: 1.05fr 0.95fr;
		}
	}
</style>
