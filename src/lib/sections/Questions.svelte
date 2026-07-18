<script lang="ts">
	import { reveal, splitReveal } from '$lib/motion';
	import { questions } from '$lib/data/site';
</script>

<section class="tt-section questions">
	<div class="tt-container questions__inner">
		<div class="questions__aside">
			<p class="questions__kicker label" data-anim {@attach reveal({ y: 16, duration: 0.65 })}>
				Ask a better question
			</p>
			<h2 class="questions__title" data-split {@attach splitReveal({ stagger: 0.045 })}>
				You’re asking the <span class="questions__accent">wrong</span> question.
			</h2>
			<p
				class="questions__closing"
				data-anim
				{@attach reveal({ y: 20, duration: 0.8, delay: 0.1 })}
			>
				Money isn’t a strong enough motivator to get you through what’s holding you back. Any job
				earns money. <strong
					>Almost none earns you the freedom to be the author of your life.</strong
				>
			</p>
		</div>

		<ol class="questions__list">
			{#each questions as item, i (item.q)}
				<li
					class="questions__item"
					data-anim
					{@attach reveal({ y: 34, x: 22, duration: 0.85 + i * 0.06 })}
				>
					<span class="questions__idx num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span
					>
					<h3 class="questions__q">{item.q}</h3>
					<p class="questions__body">{item.body}</p>
				</li>
			{/each}
		</ol>
	</div>
</section>

<style>
	.questions {
		background: var(--tt-ink);
		border-top: 1px solid var(--tt-line);
		border-bottom: 1px solid var(--tt-line);
	}

	.questions__inner {
		display: grid;
		gap: clamp(2.75rem, 6vw, 5rem);
		align-items: start;
	}

	/* ---- Left column: sticky headline + kicker + closing statement ---- */
	.questions__kicker {
		margin-bottom: 1.4rem;
		color: var(--tt-red-bright);
	}
	.questions__title {
		font-size: var(--fs-h2);
		max-width: 12ch;
	}
	.questions__accent {
		color: var(--tt-red-bright);
	}
	.questions__closing {
		margin-top: clamp(1.75rem, 3vw, 2.5rem);
		padding-top: clamp(1.5rem, 3vw, 2rem);
		max-width: 42ch;
		border-top: 1px solid var(--tt-line);
		font-size: var(--fs-lead);
		line-height: 1.5;
		color: var(--tt-mute);
	}
	.questions__closing strong {
		font-weight: 600;
		color: var(--tt-white);
	}

	/* ---- Right column: large editorial question blocks ---- */
	.questions__list {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.questions__item {
		position: relative;
		padding: clamp(1.6rem, 3vw, 2.25rem) 0 clamp(1.6rem, 3vw, 2.25rem) clamp(1.4rem, 3vw, 2.25rem);
		border-left: 2px solid var(--tt-line-strong);
		transition: border-color 0.4s ease;
	}
	.questions__item + .questions__item {
		margin-top: clamp(0.5rem, 1.5vw, 1.25rem);
	}
	.questions__item:hover {
		border-left-color: var(--tt-red);
	}

	.questions__idx {
		display: block;
		margin-bottom: 0.8rem;
		font-size: 0.78rem;
		letter-spacing: 0.1em;
		color: var(--tt-red-bright);
	}
	.questions__q {
		font-size: var(--fs-h3);
		font-weight: 700;
		color: var(--tt-white);
	}
	.questions__body {
		margin-top: 0.85rem;
		max-width: 54ch;
		font-size: var(--fs-body);
		color: var(--tt-fog);
	}

	@media (min-width: 1024px) {
		.questions__inner {
			grid-template-columns: 0.82fr 1fr;
			gap: clamp(3rem, 6vw, 6rem);
		}
		.questions__aside {
			position: sticky;
			top: calc(var(--tt-header-h) + 2.5rem);
		}
	}
</style>
