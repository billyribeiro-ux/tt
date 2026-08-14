<script lang="ts">
	import { pillars } from '$lib/pages/project-alpha/data/content';
</script>

<section id="pillars" class="section-shell" data-chapter="03" aria-labelledby="pillars-title">
	<div class="reveal">
		<p class="section-label">Training framework</p>
		<h2 id="pillars-title" class="section-title">The three pillars</h2>
		<p class="section-desc">
			Neurofeedback + pre-market mental prep + live EEG while you trade: the full loop from brain
			state to order ticket.
		</p>
	</div>

	<div class="loop-label reveal" aria-hidden="true">
		<span>Regulate</span>
		<i></i>
		<span>Prime</span>
		<i></i>
		<span>Observe</span>
	</div>

	<div class="grid">
		{#each pillars as pillar, i (pillar.num)}
			<article class="pillar card-surface reveal" style:--accent={pillar.accent}>
				<div class="bar" aria-hidden="true"></div>
				<div class="pillar-head">
					<span class="num">{pillar.num}</span>
					<span class="phase-state"><i></i> Stage {i + 1} / 3</span>
				</div>
				<p class="sub">{pillar.sub}</p>
				<h3>{pillar.title}</h3>
				<p class="body">{pillar.body}</p>
				<div class="flow-footer" aria-hidden="true">
					<span>State input</span>
					<span class="flow-arrow">→</span>
					<span>{i === 2 ? 'Decision data' : 'Protocol signal'}</span>
				</div>
			</article>
		{/each}
	</div>
</section>

<style>
	.loop-label {
		display: grid;
		grid-template-columns: auto 1fr auto 1fr auto;
		align-items: center;
		gap: 1rem;
		margin: -1.5rem 0 1rem;
		font-size: var(--fs-nano);
		font-weight: 800;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--alpha-faint);
	}

	.loop-label i {
		height: 1px;
		background: linear-gradient(90deg, rgba(59, 139, 235, 0.5), rgba(255, 255, 255, 0.08));
	}

	.grid {
		display: grid;
		gap: 0.9rem;
	}

	@media (min-width: 860px) {
		.grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.pillar {
		padding: 1.55rem 1.65rem 1.35rem;
		border-radius: 18px;
		position: relative;
		overflow: hidden;
		min-height: 430px;
		display: flex;
		flex-direction: column;
	}

	.bar {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: var(--accent);
	}

	.pillar-head {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
		margin-bottom: 2.8rem;
	}

	.num {
		display: block;
		font-size: var(--fs-h1);
		font-weight: 700;
		line-height: 0.75;
		letter-spacing: -0.06em;
		color: color-mix(in srgb, var(--accent) 22%, transparent);
	}

	.phase-state {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: var(--fs-nano);
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--alpha-faint);
	}

	.phase-state i {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: var(--accent);
		box-shadow: 0 0 9px var(--accent);
	}

	.sub {
		margin: 0 0 0.55rem;
		font-size: var(--fs-eyebrow);
		font-weight: 600;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--accent);
	}

	h3 {
		margin: 0 0 0.9rem;
		font-size: clamp(1.45rem, 2.2vw, 1.9rem);
		font-weight: 700;
		letter-spacing: -0.025em;
		line-height: 1.05;
	}

	.body {
		margin: 0;
		font-size: var(--fs-small);
		color: var(--alpha-muted);
		line-height: 1.7;
	}

	.flow-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		margin-top: auto;
		padding-top: 1.2rem;
		border-top: 1px solid rgba(255, 255, 255, 0.07);
		font-size: var(--fs-nano);
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--alpha-faint);
	}

	.flow-arrow {
		color: var(--accent);
	}

	@media (max-width: 680px) {
		.loop-label {
			grid-template-columns: auto 1fr;
		}

		.loop-label span:not(:first-child),
		.loop-label i:not(:nth-child(2)) {
			display: none;
		}

		.pillar {
			min-height: 390px;
		}
	}
</style>
