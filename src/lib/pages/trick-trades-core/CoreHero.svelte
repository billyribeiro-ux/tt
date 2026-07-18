<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { reveal, splitReveal, parallax, jumpTo } from '$lib/motion';
	import HeadphonesIcon from 'phosphor-svelte/lib/HeadphonesIcon';
	import WaveformIcon from 'phosphor-svelte/lib/WaveformIcon';

	// Program spec — every figure derived from the real session lengths
	// (0.25 + 1.5 + 1 + 7 = 9.75 hrs).
	const spec = [
		{ k: 'Format', v: 'Binaural audio' },
		{ k: 'Daily sessions', v: '4 + bonus' },
		{ k: 'Daily runtime', v: '≈ 9.75 hrs' },
		{ k: 'Topics', v: '5 patterns' },
		{ k: 'Delivery', v: 'Instant download' }
	];
</script>

<section class="chero" aria-label="Trick Trades Core">
	<div class="chero__bg" aria-hidden="true">
		<div class="chero__grid grid-bg"></div>
		<div class="chero__glow" {@attach parallax(90)}></div>
	</div>

	<div class="tt-container chero__inner">
		<div class="chero__copy">
			<p class="eyebrow chero__eyebrow">
				<HeadphonesIcon size={15} weight="fill" aria-hidden="true" />Rewire the subconscious
			</p>

			<h1 class="chero__title" data-split {@attach splitReveal({ stagger: 0.028 })}>
				You don’t have a chart problem, and you don’t have a
				<span class="text-red">psychology problem.</span>
			</h1>

			<div class="chero__stack" data-anim-stagger {@attach reveal({ stagger: 0.12, y: 26 })}>
				<p class="chero__lede">
					Under real risk, a <strong>survival response</strong> takes over and overrides the strategy
					you’ve already learned. <strong>Trick Trades Core</strong> is a binaural-beats meditation program
					built to rewire those subconscious behaviours — session by session, night by night.
				</p>

				<div class="chero__cta">
					<Button href="#pricing" onclick={(e) => jumpTo(e, '#pricing')}>Get Volume One — $97</Button>
					<Button href="#sessions" variant="ghost" onclick={(e) => jumpTo(e, '#sessions')}>
						See the daily sessions
					</Button>
				</div>
			</div>
		</div>

		<aside class="chero__spec" data-anim {@attach reveal({ y: 44, scale: 0.98, duration: 1.15 })}>
			<div class="chero__spec-top">
				<span class="label">Program spec</span>
				<span class="chero__wave" aria-hidden="true">
					<WaveformIcon size={20} weight="bold" />
				</span>
			</div>
			<dl class="chero__spec-list">
				{#each spec as row (row.k)}
					<div class="chero__spec-row">
						<dt class="label chero__spec-k">{row.k}</dt>
						<dd class="chero__spec-v">{row.v}</dd>
					</div>
				{/each}
			</dl>
			<p class="chero__spec-band num" aria-hidden="true">ALPHA → DELTA · BINAURAL</p>
		</aside>
	</div>
</section>

<style>
	.chero {
		position: relative;
		padding-top: calc(var(--tt-header-h) + clamp(2rem, 6vw, 5rem));
		padding-bottom: clamp(3rem, 6vw, 5rem);
		overflow: clip;
	}
	.chero__bg {
		position: absolute;
		inset: 0;
		z-index: 0;
	}
	.chero__grid {
		position: absolute;
		inset: -10% 0 0;
		opacity: 0.45;
	}
	.chero__glow {
		position: absolute;
		top: -18%;
		right: -12%;
		width: 68vw;
		height: 68vw;
		max-width: 860px;
		max-height: 860px;
		background: radial-gradient(circle, rgb(var(--tt-red-rgb) / 0.4), transparent 62%);
		filter: blur(22px);
	}

	.chero__inner {
		position: relative;
		z-index: 1;
		display: grid;
		gap: clamp(2.5rem, 5vw, 4rem);
		align-items: center;
	}

	.chero__eyebrow {
		gap: 0.5em;
	}
	.chero__title {
		margin-top: 1.5rem;
		font-size: var(--fs-h1);
		font-weight: 800;
		letter-spacing: -0.03em;
		line-height: 0.98;
		color: #fff;
		max-width: 16ch;
	}
	.chero__lede {
		margin-top: 1.7rem;
		max-width: 54ch;
		font-size: var(--fs-lead);
		color: var(--tt-fog);
	}
	.chero__lede strong {
		color: #fff;
		font-weight: 600;
	}
	.chero__cta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.9rem;
		margin-top: 2.1rem;
	}

	.chero__spec {
		position: relative;
		padding: clamp(1.5rem, 3vw, 2.1rem);
		border: 1px solid var(--tt-line);
		border-radius: var(--tt-radius-lg);
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent 45%),
			var(--tt-ink-2);
		box-shadow: var(--tt-shadow-card);
	}
	.chero__spec-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1.2rem;
	}
	.chero__wave {
		display: grid;
		place-items: center;
		width: 38px;
		height: 38px;
		border-radius: 10px;
		color: var(--tt-red-bright);
		border: 1px solid var(--tt-line);
		background: rgb(var(--tt-red-rgb) / 0.08);
	}
	.chero__spec-list {
		margin: 0;
		display: flex;
		flex-direction: column;
	}
	.chero__spec-row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.85rem 0;
		border-top: 1px solid var(--tt-line);
	}
	.chero__spec-row:first-child {
		border-top: 0;
	}
	.chero__spec-k {
		color: var(--tt-mute);
	}
	.chero__spec-v {
		font-family: var(--tt-font-body);
		font-weight: 600;
		font-size: 0.98rem;
		color: var(--tt-white);
		text-align: right;
	}
	.chero__spec-band {
		margin-top: 1.4rem;
		padding-top: 1.1rem;
		border-top: 1px solid var(--tt-line);
		font-size: 0.68rem;
		letter-spacing: 0.24em;
		color: var(--tt-red-bright);
	}

	@media (min-width: 940px) {
		.chero__inner {
			grid-template-columns: 1.1fr 0.9fr;
		}
	}
</style>
