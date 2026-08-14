<script lang="ts">
	import { assessments } from '$lib/pages/project-alpha/data/content';
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';
</script>

<section id="assessments" class="section-shell" data-chapter="06" aria-labelledby="assess-title">
	<div class="reveal">
		<p class="section-label">Measuring progress</p>
		<h2 id="assess-title" class="section-title">Assessment schedule</h2>
		<p class="section-desc">
			Three key checkpoints. Each includes a brain snapshot and questionnaire: quantitative and
			qualitative data to track transformation.
		</p>
	</div>

	<div class="grid">
		{#each assessments as a, i (a.title)}
			<article class="card card-surface reveal" style:--i={i}>
				<div class="checkpoint" aria-hidden="true">
					<span>0{i + 1}</span>
					<i></i>
				</div>
				<p class="when">{a.when}</p>
				<h3>{a.title}</h3>
				<ul>
					{#each a.items as item (item)}
						<li>
							<span class="arrow"><ArrowRightIcon size={12} weight="bold" /></span>
							{item}
						</li>
					{/each}
				</ul>
			</article>
		{/each}
	</div>
</section>

<style>
	.grid {
		position: relative;
		display: grid;
		gap: 1.15rem;
	}

	@media (min-width: 800px) {
		.grid {
			grid-template-columns: repeat(3, 1fr);
		}

		.grid::before {
			content: '';
			position: absolute;
			z-index: -1;
			top: 39px;
			left: 10%;
			right: 10%;
			height: 1px;
			background: linear-gradient(90deg, var(--alpha-red), var(--alpha-blue), var(--alpha-gold));
			opacity: 0.55;
		}
	}

	.card {
		padding: 1.25rem 1.55rem 1.75rem;
		border-radius: 18px;
		text-align: left;
	}

	.checkpoint {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 2rem;
	}

	.checkpoint span {
		display: grid;
		place-items: center;
		width: 50px;
		height: 50px;
		border-radius: 50%;
		font-size: var(--fs-body);
		font-weight: 700;
		background: #0b0b0e;
		border: 1px solid rgba(255, 255, 255, 0.12);
		box-shadow:
			0 0 0 7px rgba(255, 255, 255, 0.025),
			0 0 28px -8px rgba(59, 139, 235, 0.5);
	}

	.checkpoint i {
		flex: 1;
		height: 1px;
		background: linear-gradient(90deg, rgba(255, 255, 255, 0.12), transparent);
	}

	.when {
		margin: 0 0 0.45rem;
		font-size: var(--fs-eyebrow);
		font-weight: 600;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--alpha-muted);
	}

	h3 {
		margin: 0 0 1rem;
		font-size: var(--fs-h4);
		font-weight: 600;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		text-align: left;
		display: grid;
		gap: 0.4rem;
	}

	li {
		display: flex;
		gap: 0.45rem;
		align-items: flex-start;
		font-size: var(--fs-eyebrow);
		color: var(--alpha-muted);
		line-height: 1.5;
	}

	.arrow {
		color: var(--alpha-faint);
		margin-top: 0.15rem;
		flex-shrink: 0;
	}
</style>
