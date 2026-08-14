<script lang="ts">
	import { notes } from '$lib/pages/project-alpha/data/content';
	import WarningIcon from 'phosphor-svelte/lib/WarningIcon';
	import LockIcon from 'phosphor-svelte/lib/LockIcon';
	import DoorOpenIcon from 'phosphor-svelte/lib/DoorOpenIcon';
	import ClipboardTextIcon from 'phosphor-svelte/lib/ClipboardTextIcon';
	import type { Component } from 'svelte';

	const icons: Record<(typeof notes)[number]['icon'], Component> = {
		warning: WarningIcon,
		lock: LockIcon,
		door: DoorOpenIcon,
		clipboard: ClipboardTextIcon
	};
</script>

<section id="notes" class="section-shell" data-chapter="07" aria-labelledby="notes-title">
	<div class="reveal">
		<p class="section-label">Important</p>
		<h2 id="notes-title" class="section-title">Things to know</h2>
	</div>

	<div class="grid">
		{#each notes as note, i (note.title)}
			{@const Icon = icons[note.icon]}
			<article class="note card-surface reveal" class:risk={i === 0}>
				<div class="note-meta">
					<span>Protocol safeguard / 0{i + 1}</span>
					<span>{i === 0 ? 'Read carefully' : 'Participant right'}</span>
				</div>
				<h3>
					<span class="icon"><Icon size={18} weight="duotone" /></span>
					{note.title}
				</h3>
				<p>{note.body}</p>
			</article>
		{/each}
	</div>
</section>

<style>
	.grid {
		display: grid;
		gap: 1.15rem;
	}

	@media (min-width: 760px) {
		.grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	.note {
		position: relative;
		overflow: hidden;
		padding: 1.3rem 1.7rem 1.8rem;
		border-radius: 18px;
		min-height: 250px;
	}

	.note.risk {
		background:
			radial-gradient(circle at 90% 0%, rgba(184, 32, 32, 0.09), transparent 46%),
			linear-gradient(145deg, rgba(23, 16, 19, 0.95), rgba(11, 11, 14, 0.96));
	}

	.note-meta {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 3.6rem;
		font-size: var(--fs-nano);
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--alpha-faint);
	}

	h3 {
		margin: 0 0 0.75rem;
		font-size: var(--fs-h4);
		font-weight: 700;
		letter-spacing: -0.02em;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.icon {
		width: 34px;
		height: 34px;
		border-radius: 50%;
		place-items: center;
		color: var(--alpha-muted);
		display: grid;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	p {
		margin: 0;
		font-size: var(--fs-small);
		color: var(--alpha-muted);
		line-height: 1.7;
	}
</style>
