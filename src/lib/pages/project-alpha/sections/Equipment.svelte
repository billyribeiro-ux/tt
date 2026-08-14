<script lang="ts">
	import { equipment } from '$lib/pages/project-alpha/data/content';
	import BrainIcon from 'phosphor-svelte/lib/BrainIcon';
	import DeviceMobileIcon from 'phosphor-svelte/lib/DeviceMobileIcon';
	import ChartLineUpIcon from 'phosphor-svelte/lib/ChartLineUpIcon';
	import NotebookIcon from 'phosphor-svelte/lib/NotebookIcon';
	import type { Component } from 'svelte';

	const icons: Record<(typeof equipment)[number]['icon'], Component> = {
		brain: BrainIcon,
		app: DeviceMobileIcon,
		chart: ChartLineUpIcon,
		journal: NotebookIcon
	};
</script>

<section id="equipment" class="section-shell" data-chapter="02" aria-labelledby="equipment-title">
	<div class="reveal">
		<p class="section-label">Before you begin</p>
		<h2 id="equipment-title" class="section-title">What you’ll need</h2>
		<p class="section-desc">
			Acquire these before the preloading phase begins. All equipment remains your personal property
			regardless of study completion.
		</p>
	</div>

	<div class="grid">
		{#each equipment as item, i (item.id)}
			{@const Icon = icons[item.icon]}
			<article
				class="equip-card card-surface reveal"
				style:--accent={item.accent}
				style:--delay="{i * 0.05}s"
			>
				<div class="card-meta">
					<span>Instrument / 0{i + 1}</span>
					<span class="status"><i></i> Required</span>
				</div>
				<div class="icon-wrap">
					<Icon size={22} weight="duotone" />
				</div>
				<h3>{item.title}</h3>
				<p>{item.body}</p>
			</article>
		{/each}
	</div>
</section>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 1px;
		padding: 1px;
		border-radius: 20px;
		background: linear-gradient(
			120deg,
			rgba(59, 139, 235, 0.3),
			rgba(255, 255, 255, 0.06),
			rgba(212, 168, 83, 0.2)
		);
	}

	.equip-card {
		min-height: 310px;
		padding: 1.25rem 1.5rem 1.65rem;
		border: none;
		border-radius: 0;
		display: flex;
		flex-direction: column;
	}

	.equip-card:first-child {
		border-radius: 19px 0 0 19px;
	}

	.equip-card:last-child {
		border-radius: 0 19px 19px 0;
	}

	.equip-card:hover {
		box-shadow: 0 20px 50px -28px color-mix(in srgb, var(--accent) 55%, transparent);
	}

	.card-meta {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 3.25rem;
		font-size: var(--fs-nano);
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--alpha-faint);
	}

	.status {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		color: color-mix(in srgb, var(--accent) 70%, var(--alpha-muted));
	}

	.status i {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: var(--accent);
		box-shadow: 0 0 8px var(--accent);
	}

	.icon-wrap {
		width: 52px;
		height: 52px;
		border-radius: 50%;
		display: grid;
		place-items: center;
		margin-bottom: 1.2rem;
		background: color-mix(in srgb, var(--accent) 14%, transparent);
		color: var(--accent);
		border: 1px solid color-mix(in srgb, var(--accent) 28%, transparent);
		box-shadow: 0 0 0 7px color-mix(in srgb, var(--accent) 4%, transparent);
	}

	h3 {
		margin: 0 0 0.45rem;
		font-size: var(--fs-body);
		font-weight: 600;
	}

	p {
		margin: 0;
		font-size: var(--fs-small);
		color: var(--alpha-muted);
		line-height: 1.65;
	}

	@media (max-width: 1080px) {
		.grid {
			grid-template-columns: 1fr 1fr;
		}

		.equip-card:first-child {
			border-radius: 19px 0 0 0;
		}

		.equip-card:nth-child(2) {
			border-radius: 0 19px 0 0;
		}

		.equip-card:nth-child(3) {
			border-radius: 0 0 0 19px;
		}

		.equip-card:last-child {
			border-radius: 0 0 19px 0;
		}
	}

	@media (max-width: 620px) {
		.grid {
			grid-template-columns: 1fr;
		}

		.equip-card,
		.equip-card:first-child,
		.equip-card:nth-child(2),
		.equip-card:nth-child(3),
		.equip-card:last-child {
			min-height: 280px;
			border-radius: 0;
		}

		.equip-card:first-child {
			border-radius: 19px 19px 0 0;
		}

		.equip-card:last-child {
			border-radius: 0 0 19px 19px;
		}
	}
</style>
