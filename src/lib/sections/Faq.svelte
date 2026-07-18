<script lang="ts">
	import { reveal, splitReveal } from '$lib/motion';
	import { faqs, site } from '$lib/data/site';
	import CaretDownIcon from 'phosphor-svelte/lib/CaretDownIcon';

	// Single-open accordion — cleanest editorial behaviour. First item open on load
	// so the column never reads as an empty stack. Click an open row to close it.
	let open = $state<number | null>(0);

	function toggle(i: number) {
		open = open === i ? null : i;
	}
</script>

<section id="faq" class="tt-section faq">
	<div class="tt-container faq__grid">
		<div class="faq__aside">
			<div class="faq__sticky">
				<p class="label faq__kicker" data-anim {@attach reveal({ y: 16, duration: 0.65 })}>
					Answers
				</p>
				<h2 class="faq__headline" data-split {@attach splitReveal({ stagger: 0.03 })}>
					Frequently asked questions.
				</h2>
				<p class="faq__nudge" data-anim {@attach reveal({ y: 20 })}>
					<span aria-hidden="true" class="faq__nudge-rule"></span>
					Still unsure? Email
					<a class="faq__nudge-link" href="mailto:{site.support}">{site.support}</a>
				</p>
			</div>
		</div>

		<ul class="faq__list" data-anim-stagger {@attach reveal({ stagger: 0.07, y: 22 })}>
			{#each faqs as item, i (item.q)}
				<li class="faq__item" class:is-open={open === i}>
					<h3 class="faq__heading">
						<button
							type="button"
							class="faq__trigger"
							id="faq-trigger-{i}"
							aria-expanded={open === i}
							aria-controls="faq-panel-{i}"
							onclick={() => toggle(i)}
						>
							<span class="faq__idx num">{String(i + 1).padStart(2, '0')}</span>
							<span class="faq__q">{item.q}</span>
							<span class="faq__caret" aria-hidden="true">
								<CaretDownIcon size={20} weight="bold" />
							</span>
						</button>
					</h3>
					<div
						class="faq__panel"
						id="faq-panel-{i}"
						role="region"
						aria-labelledby="faq-trigger-{i}"
						inert={open !== i}
					>
						<div class="faq__answer">
							<p>{item.a}</p>
						</div>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.faq {
		background: var(--tt-black);
	}

	.faq__grid {
		display: grid;
		gap: clamp(2.5rem, 5vw, 4.5rem);
	}

	/* --- Left rail: sticky headline + a quiet nudge --- */
	.faq__kicker {
		color: var(--tt-mute);
	}
	.faq__headline {
		margin-top: 1.1rem;
		font-size: var(--fs-h2);
		letter-spacing: -0.03em;
	}
	.faq__nudge {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.55rem;
		margin-top: 2rem;
		font-family: var(--tt-font-mono);
		font-size: 0.8rem;
		letter-spacing: 0.02em;
		color: var(--tt-mute);
	}
	.faq__nudge-rule {
		width: 34px;
		height: 1px;
		background: var(--tt-line-strong);
	}
	.faq__nudge-link {
		color: var(--tt-fog);
		border-bottom: 1px solid var(--tt-line-strong);
		padding-bottom: 1px;
		transition:
			color 0.25s ease,
			border-color 0.25s ease;
	}
	.faq__nudge-link:hover {
		color: var(--tt-red-bright);
		border-color: var(--tt-red-bright);
	}

	/* --- Right rail: accordion --- */
	.faq__list {
		list-style: none;
		margin: 0;
		padding: 0;
		border-top: 1px solid var(--tt-line);
	}
	.faq__item {
		border-bottom: 1px solid var(--tt-line);
	}
	.faq__heading {
		margin: 0;
		font-size: inherit;
		font-weight: inherit;
		letter-spacing: normal;
		color: inherit;
	}

	.faq__trigger {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: baseline;
		gap: clamp(0.9rem, 2vw, 1.6rem);
		width: 100%;
		padding: clamp(1.3rem, 2.4vw, 1.7rem) 0;
		text-align: left;
		color: var(--tt-fog);
		transition: color 0.25s ease;
	}
	.faq__trigger:hover {
		color: var(--tt-white);
	}
	.faq__trigger:focus-visible {
		outline-offset: 6px;
	}

	.faq__idx {
		font-size: 0.72rem;
		letter-spacing: 0.06em;
		color: var(--tt-mute-2);
		transition: color 0.25s ease;
	}
	.faq__item.is-open .faq__idx,
	.faq__trigger:hover .faq__idx {
		color: var(--tt-red-bright);
	}

	.faq__q {
		font-size: var(--fs-h4);
		font-weight: 600;
		line-height: 1.3;
		letter-spacing: -0.01em;
		color: var(--tt-white);
	}

	.faq__caret {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		align-self: center;
		color: var(--tt-mute);
		transition:
			transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
			color 0.25s ease;
	}
	.faq__trigger[aria-expanded='true'] .faq__caret {
		transform: rotate(180deg);
		color: var(--tt-red-bright);
	}

	/* Grid 0fr -> 1fr collapse: smooth height animation, panel stays in the DOM
	   (so aria-controls always resolves) while `inert` removes it from the a11y
	   tree + tab order when closed. */
	.faq__panel {
		display: grid;
		grid-template-rows: 0fr;
		transition: grid-template-rows 0.45s cubic-bezier(0.22, 1, 0.36, 1);
	}
	.faq__item.is-open .faq__panel {
		grid-template-rows: 1fr;
	}
	.faq__answer {
		overflow: hidden;
	}
	.faq__answer p {
		max-width: 60ch;
		margin: 0;
		/* Indent under the question, clearing the mono index column. */
		padding: 0 clamp(1.5rem, 4vw, 3rem) clamp(1.4rem, 2.4vw, 1.9rem) clamp(2.4rem, 5vw, 3.4rem);
		color: var(--tt-fog);
		font-size: var(--fs-body);
	}

	@media (min-width: 860px) {
		.faq__grid {
			grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr);
			align-items: start;
		}
		.faq__sticky {
			position: sticky;
			top: calc(var(--tt-header-h) + 2.5rem);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.faq__panel,
		.faq__caret {
			transition: none;
		}
	}
</style>
