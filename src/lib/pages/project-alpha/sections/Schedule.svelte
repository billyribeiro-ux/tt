<script lang="ts">
	import { schedule, study } from '$lib/pages/project-alpha/data/content';
	import ClockIcon from 'phosphor-svelte/lib/ClockIcon';

	// study.dailyCommitment is '~45 minutes beyond trading'; the sentence below
	// supplies its own "beyond the trading" clause, so strip both markers here.
	const commitment = study.dailyCommitment.replace('~', '').replace(' beyond trading', '');
</script>

<section id="schedule" class="section-shell" data-chapter="05" aria-labelledby="schedule-title">
	<div class="reveal">
		<p class="section-label">Your day</p>
		<h2 id="schedule-title" class="section-title">The daily program</h2>
		<p class="section-desc">
			A typical study day. Total added commitment is approximately {commitment} beyond the trading you’d
			already be doing.
		</p>
	</div>

	<div class="dayline reveal" aria-hidden="true">
		<span>06:30 / Prepare</span>
		<i></i>
		<span>09:30 / Execute</span>
		<i></i>
		<span>16:00 / Debrief</span>
		<i></i>
		<span>20:00 / Train</span>
	</div>

	<div class="grid">
		{#each schedule as block, i (block.title)}
			<article class="card-surface reveal block" style:--accent={block.accent}>
				<div class="cycle-index" aria-hidden="true">
					<span>0{i + 1}</span>
					<i></i>
				</div>
				<p class="time-label">
					<ClockIcon size={13} weight="bold" />
					{block.timeLabel}
				</p>
				<h3>{block.title}</h3>
				<ul>
					{#each block.items as item (item.text)}
						<li>
							<span class="time">{item.time}</span>
							<span class="text">{item.text}</span>
						</li>
					{/each}
				</ul>
			</article>
		{/each}
	</div>
</section>

<style>
	.dayline {
		display: grid;
		grid-template-columns: auto 1fr auto 1fr auto 1fr auto;
		align-items: center;
		gap: 0.7rem;
		margin: -1.5rem 0 1.15rem;
		font-size: 0.51rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--alpha-faint);
	}

	.dayline i {
		height: 1px;
		background: rgba(255, 255, 255, 0.09);
	}

	.grid {
		display: grid;
		gap: 0.9rem;
	}

	@media (min-width: 760px) {
		.grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	.block {
		position: relative;
		overflow: hidden;
		padding: 1.3rem 1.6rem 1.65rem;
		border-radius: 18px;
		min-height: 330px;
	}

	.block:hover {
		border-color: color-mix(in srgb, var(--accent) 30%, var(--alpha-border));
	}

	.block::before {
		content: '';
		position: absolute;
		inset: 0 auto 0 0;
		width: 2px;
		background: linear-gradient(180deg, transparent, var(--accent), transparent);
		opacity: 0.75;
	}

	.cycle-index {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		margin-bottom: 2.1rem;
		font-family: var(--font-display);
		font-size: 2.8rem;
		font-weight: 650;
		line-height: 1;
		color: color-mix(in srgb, var(--accent) 28%, transparent);
	}

	.cycle-index i {
		flex: 1;
		height: 1px;
		background: linear-gradient(
			90deg,
			color-mix(in srgb, var(--accent) 35%, transparent),
			transparent
		);
	}

	.time-label {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		margin: 0 0 0.55rem;
		font-size: 0.65rem;
		font-weight: 600;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--accent);
	}

	h3 {
		margin: 0 0 1rem;
		font-family: var(--font-display);
		font-size: 1.6rem;
		font-weight: 650;
		letter-spacing: -0.025em;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.55rem;
	}

	li {
		display: grid;
		grid-template-columns: 58px 1fr;
		gap: 0.65rem;
		font-size: 0.88rem;
		color: var(--alpha-muted);
		line-height: 1.5;
		padding: 0.35rem 0;
		border-top: 1px solid rgba(36, 36, 41, 0.7);
	}

	li:first-child {
		border-top: none;
	}

	.time {
		font-size: 0.76rem;
		font-weight: 500;
		color: var(--alpha-muted);
		padding-top: 0.1rem;
	}

	@media (max-width: 760px) {
		.dayline {
			grid-template-columns: auto 1fr;
		}

		.dayline span:not(:first-child),
		.dayline i:not(:nth-child(2)) {
			display: none;
		}
	}
</style>
