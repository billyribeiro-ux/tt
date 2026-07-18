<script lang="ts">
	import { reveal, splitReveal } from '$lib/motion';
	import BrainIcon from 'phosphor-svelte/lib/BrainIcon';

	// The five behavioural patterns each meditation targets.
	const topics = ['Big Losses', 'Losing Streak', 'Oversizing', 'Overtrading', 'Small Wins'];
</script>

<section class="topics tt-section" aria-labelledby="topics-title">
	<div class="tt-container topics__inner">
		<header class="topics__head">
			<p class="label topics__kicker">
				<BrainIcon size={16} weight="fill" aria-hidden="true" />The five patterns
			</p>
			<h2
				id="topics-title"
				class="topics__title"
				data-split
				{@attach splitReveal({ stagger: 0.03 })}
			>
				Every meditation targets one behaviour you keep repeating.
			</h2>
			<p class="topics__note prose">
				Each topic is its own meditation. Buy the one that’s bleeding your account, or take all
				five in Volume One.
			</p>
		</header>

		<ul class="topics__tags" data-anim-stagger {@attach reveal({ stagger: 0.07, y: 20 })}>
			{#each topics as t, i (t)}
				<li class="topics__tag">
					<span class="topics__tag-idx num">{String(i + 1).padStart(2, '0')}</span>
					<span class="topics__tag-label">{t}</span>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.topics {
		position: relative;
		overflow: clip;
	}
	.topics__inner {
		position: relative;
		z-index: 1;
	}
	.topics__head {
		max-width: 720px;
	}
	.topics__kicker {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		color: var(--tt-fog);
	}
	.topics__title {
		margin-top: 1.1rem;
		font-size: var(--fs-h2);
		max-width: 20ch;
	}
	.topics__note {
		margin-top: 1.2rem;
	}

	.topics__tags {
		list-style: none;
		margin: clamp(2.2rem, 4vw, 3.2rem) 0 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.9rem;
	}
	.topics__tag {
		display: inline-flex;
		align-items: center;
		gap: 0.7rem;
		padding: 0.75rem 1.2rem;
		border: 1px solid var(--tt-line-strong);
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.02);
		transition:
			border-color 0.35s ease,
			background 0.35s ease,
			transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
	}
	.topics__tag:hover {
		border-color: rgb(var(--tt-red-rgb) / 0.5);
		background: rgb(var(--tt-red-rgb) / 0.06);
		transform: translateY(-2px);
	}
	.topics__tag-idx {
		font-size: 0.7rem;
		color: var(--tt-red-bright);
	}
	.topics__tag-label {
		font-family: var(--tt-font-display);
		font-size: 1.05rem;
		letter-spacing: 0.05em;
		color: var(--tt-white);
	}

	@media (prefers-reduced-motion: reduce) {
		.topics__tag {
			transition: none;
		}
	}
</style>
