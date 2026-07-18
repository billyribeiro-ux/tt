<script lang="ts">
	import { reveal } from '$lib/motion';
	import ShieldWarningIcon from 'phosphor-svelte/lib/ShieldWarningIcon';

	const disclosures = [
		'Day trading involves substantial risk of financial loss. This study does not guarantee improved performance or profitability.',
		'All data is de-identified before analysis; individual results are never published in an identifiable form.',
		'Participation is entirely voluntary and may be withdrawn at any time, with no consequence to your Trick Trades membership.',
		'Participants are asked to maintain roughly 80% protocol adherence for their data to remain in the study.'
	];
</script>

<section class="tt-section pa-disc" aria-labelledby="pa-disc-title">
	<div class="tt-container">
		<div class="pa-disc__panel" data-anim {@attach reveal({ y: 34, duration: 1 })}>
			<div class="pa-disc__head">
				<span class="pa-disc__icon"><ShieldWarningIcon size={26} weight="regular" /></span>
				<div>
					<span class="idx pa-disc__idx">05 / 05</span>
					<h2 id="pa-disc-title" class="pa-disc__title">The honest part</h2>
				</div>
			</div>

			<dl class="pa-disc__list">
				{#each disclosures as d, i (d)}
					<div class="pa-disc__item">
						<dt class="num">0{i + 1}</dt>
						<dd>{d}</dd>
					</div>
				{/each}
			</dl>

			<p class="pa-disc__foot">
				Project ALPHA is a genuine research study, not a marketing programme. Findings will be
				reported as the data supports them, no more and no less.
			</p>
		</div>
	</div>
</section>

<style>
	.pa-disc {
		background: var(--tt-ink);
	}
	.pa-disc__panel {
		padding: clamp(1.8rem, 4vw, 3rem);
		border: 1px solid var(--tt-line-strong);
		border-radius: var(--tt-radius-lg);
		background: linear-gradient(180deg, rgb(var(--tt-red-rgb) / 0.05), rgba(255, 255, 255, 0.01));
	}
	.pa-disc__head {
		display: flex;
		align-items: center;
		gap: 1.1rem;
		padding-bottom: 1.6rem;
		border-bottom: 1px solid var(--tt-line);
	}
	.pa-disc__icon {
		display: grid;
		place-items: center;
		width: 52px;
		height: 52px;
		flex: none;
		border-radius: 13px;
		color: var(--tt-red-bright);
		border: 1px solid rgb(var(--tt-red-rgb) / 0.4);
		background: rgb(var(--tt-red-rgb) / 0.08);
	}
	.pa-disc__idx {
		font-family: var(--tt-font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.1em;
		color: var(--tt-red-bright);
	}
	.pa-disc__title {
		margin-top: 0.3rem;
		font-size: var(--fs-h3);
		font-weight: 800;
		color: #fff;
	}
	.pa-disc__list {
		display: grid;
		gap: 0;
		margin: 0;
	}
	.pa-disc__item {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 1.1rem;
		padding: 1.15rem 0;
		border-bottom: 1px solid var(--tt-line);
	}
	.pa-disc__item dt {
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--tt-red-bright);
		padding-top: 0.1rem;
	}
	.pa-disc__item dd {
		margin: 0;
		font-size: 0.98rem;
		color: var(--tt-fog);
	}
	.pa-disc__foot {
		margin-top: 1.6rem;
		font-size: 0.9rem;
		color: var(--tt-mute);
		max-width: 64ch;
	}
</style>
