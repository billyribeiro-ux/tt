<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { reveal, splitReveal, drawLine } from '$lib/motion';

	const courseUrl = 'https://tricktrades.com/momentum-course';

	// The exact scope stated in the catalogue: 15 modules, 115 lessons, +14 bonus.
	const scope = [
		{ fig: '15', label: 'Modules', note: 'A structured, front-to-back curriculum' },
		{ fig: '115', label: 'Video lessons', note: 'From first setup to professional execution' },
		{ fig: '+14', label: 'Bonus lessons', note: 'Extra material layered on top' }
	];
</script>

<section id="mo-scope" class="mo-scope" aria-labelledby="mo-scope-title">
	<div class="tt-container">
		<div class="section-head">
			<span class="idx">01 / 02</span>
			<span class="rule"></span>
			<span class="label mo-scope__count">The scope</span>
		</div>

		<div class="mo-scope__head">
			<h2
				id="mo-scope-title"
				class="mo-scope__title"
				data-split
				{@attach splitReveal({ stagger: 0.03 })}
			>
				The whole game, <span class="text-red">module by module.</span>
			</h2>
			<p class="mo-scope__intro prose">
				Momentum is the deepest program in the catalogue: high-level coaching built as a complete,
				structured path rather than a loose set of clips.
			</p>
		</div>

		<!-- The line builds as you scroll: momentum printing across the section. -->
		<svg
			class="mo-scope__line"
			viewBox="0 0 1200 120"
			preserveAspectRatio="none"
			fill="none"
			aria-hidden="true"
			{@attach drawLine()}
		>
			<path
				d="M0 104 L150 88 L300 96 L450 64 L600 72 L750 40 L900 48 L1050 20 L1200 8"
				stroke="var(--tt-red-bright)"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				vector-effect="non-scaling-stroke"
			/>
		</svg>

		<ul class="mo-scope__figs" data-anim-stagger {@attach reveal({ stagger: 0.12, y: 40 })}>
			{#each scope as s (s.label)}
				<li class="mo-scope__fig">
					<span class="num mo-scope__fig-n">{s.fig}</span>
					<span class="mo-scope__fig-label label">{s.label}</span>
					<span class="mo-scope__fig-note">{s.note}</span>
				</li>
			{/each}
		</ul>

		<div class="mo-scope__note" data-anim {@attach reveal({ y: 24 })}>
			<p class="mo-scope__note-text">
				The full module-by-module breakdown and enrollment are on the course page.
			</p>
			<Button href={courseUrl} variant="ghost" size="md">View the full curriculum</Button>
		</div>
	</div>
</section>

<style>
	.mo-scope {
		position: relative;
		padding-block: clamp(4.5rem, 3rem + 8vw, 9rem);
		background: var(--tt-ink);
		box-shadow:
			inset 0 1px 0 var(--tt-line),
			inset 0 -1px 0 var(--tt-line);
	}
	.mo-scope__count {
		flex: none;
		color: var(--tt-mute-2);
	}
	.mo-scope__head {
		display: grid;
		gap: 1.2rem;
		margin-bottom: clamp(2.5rem, 5vw, 4rem);
	}
	.mo-scope__title {
		font-size: var(--fs-h2);
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.025em;
		color: #fff;
	}
	.mo-scope__intro {
		max-width: 56ch;
	}
	@media (min-width: 1024px) {
		.mo-scope__head {
			grid-template-columns: 1.1fr 0.9fr;
			align-items: end;
			gap: clamp(2rem, 5vw, 4rem);
		}
	}

	.mo-scope__line {
		display: block;
		width: 100%;
		height: clamp(44px, 7vw, 84px);
		margin-bottom: clamp(1.4rem, 3vw, 2.4rem);
		opacity: 0.55;
	}

	.mo-scope__figs {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0;
		border-top: 1px solid var(--tt-line);
	}
	.mo-scope__fig {
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: center;
		gap: 0.2rem 1.6rem;
		padding: clamp(1.4rem, 3vw, 2.2rem) 0;
		border-bottom: 1px solid var(--tt-line);
	}
	.mo-scope__fig-n {
		grid-row: span 2;
		min-width: 3.5ch;
		font-size: clamp(2.8rem, 1.4rem + 7vw, 6rem);
		font-weight: 800;
		line-height: 0.85;
		letter-spacing: -0.04em;
		color: #fff;
	}
	.mo-scope__fig-label {
		align-self: end;
		color: var(--tt-red-bright);
	}
	.mo-scope__fig-note {
		align-self: start;
		font-size: var(--fs-body);
		color: var(--tt-fog);
	}

	.mo-scope__note {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 1.4rem 2rem;
		margin-top: clamp(2rem, 4vw, 3rem);
	}
	.mo-scope__note-text {
		max-width: 46ch;
		color: var(--tt-mute);
		font-size: 0.95rem;
	}
</style>
