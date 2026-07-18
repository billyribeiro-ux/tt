<script lang="ts">
	import { reveal, splitReveal } from '$lib/motion';
	import ArrowUpRightIcon from 'phosphor-svelte/lib/ArrowUpRightIcon';

	const enrollUrl = 'https://tricktrades.com/day-trading-bootcamp';

	// Three pillars named directly from the course's own description:
	// "the foundation: mechanics, strategy and mindset." No lesson list is invented.
	const pillars = [
		{
			n: '01',
			title: 'Mechanics',
			body: 'The how of the trade. Order types, levels, risk and the moving parts you have to operate without hesitation before size ever matters.'
		},
		{
			n: '02',
			title: 'Strategy',
			body: 'An introduction to Pat’s proven, time-tested day-trading strategy. The same framework the community trades every single morning.'
		},
		{
			n: '03',
			title: 'Mindset',
			body: 'The emotional half of the game. Retraining the reactions and self-talk that separate the disciplined 10% from everyone else.'
		}
	];
</script>

<section id="bc-inside" class="bc-found" aria-labelledby="bc-found-title">
	<div class="tt-container">
		<div class="section-head">
			<span class="idx">02 / 03</span>
			<span class="rule"></span>
			<span class="label bc-found__count">Inside the course</span>
		</div>

		<div class="bc-found__head">
			<h2
				id="bc-found-title"
				class="bc-found__title"
				data-split
				{@attach splitReveal({ stagger: 0.03 })}
			>
				Every detail required to <span class="text-red">become a trader.</span>
			</h2>
			<p class="bc-found__intro prose">
				50+ lessons, built to be caveman simple and impossible to skip. Three foundations carry a
				complete beginner, or reset an experienced one, from the first green candle onward.
			</p>
		</div>

		<ol class="bc-found__list" data-anim-stagger {@attach reveal({ stagger: 0.1, y: 34 })}>
			{#each pillars as p (p.n)}
				<li class="bc-found__row">
					<span class="bc-found__row-n num" aria-hidden="true">{p.n}</span>
					<h3 class="bc-found__row-title">{p.title}</h3>
					<p class="bc-found__row-body">{p.body}</p>
				</li>
			{/each}
		</ol>

		<div class="bc-found__note" data-anim {@attach reveal({ y: 24 })}>
			<p class="bc-found__note-text">
				The full lesson-by-lesson syllabus and lifetime access are on the course page.
			</p>
			<a class="bc-found__note-link" href={enrollUrl}>
				View the full curriculum
				<ArrowUpRightIcon size={15} weight="bold" aria-hidden="true" />
			</a>
		</div>
	</div>
</section>

<style>
	.bc-found {
		position: relative;
		padding-block: clamp(4.5rem, 3rem + 8vw, 9rem);
	}
	.bc-found__count {
		flex: none;
		color: var(--tt-mute-2);
	}
	.bc-found__head {
		display: grid;
		gap: 1.2rem;
		margin-bottom: clamp(2.5rem, 5vw, 4rem);
	}
	.bc-found__title {
		font-size: var(--fs-h2);
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.025em;
		color: #fff;
	}
	.bc-found__intro {
		max-width: 56ch;
	}
	@media (min-width: 1024px) {
		.bc-found__head {
			grid-template-columns: 1.1fr 0.9fr;
			align-items: end;
			gap: clamp(2rem, 5vw, 4rem);
		}
	}

	.bc-found__list {
		list-style: none;
		margin: 0;
		padding: 0;
		border-top: 1px solid var(--tt-line);
	}
	.bc-found__row {
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: baseline;
		gap: 0.4rem 1.4rem;
		padding: clamp(1.6rem, 3.5vw, 2.6rem) 0;
		border-bottom: 1px solid var(--tt-line);
	}
	.bc-found__row-n {
		grid-row: span 2;
		font-size: clamp(1.6rem, 1rem + 2vw, 2.4rem);
		font-weight: 800;
		line-height: 1;
		color: transparent;
		-webkit-text-stroke: 1px rgb(var(--tt-red-bright-rgb) / 0.7);
	}
	.bc-found__row-title {
		font-size: var(--fs-h3);
		font-weight: 800;
		letter-spacing: -0.02em;
		color: #fff;
	}
	.bc-found__row-body {
		max-width: 60ch;
		font-size: var(--fs-body);
		color: var(--tt-fog);
	}

	.bc-found__note {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 1rem 1.6rem;
		margin-top: clamp(2rem, 4vw, 3rem);
	}
	.bc-found__note-text {
		max-width: 42ch;
		color: var(--tt-mute);
		font-size: 0.95rem;
	}
	.bc-found__note-link {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-family: var(--tt-font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--tt-fog);
		border-bottom: 1px solid transparent;
		transition:
			color 0.25s ease,
			border-color 0.25s ease;
	}
	.bc-found__note-link:hover {
		color: #fff;
		border-color: var(--tt-line-strong);
	}

	@media (min-width: 768px) {
		.bc-found__row {
			grid-template-columns: auto 0.7fr 1.3fr;
			align-items: center;
			gap: 2rem;
		}
		.bc-found__row-n {
			grid-row: auto;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.bc-found__note-link {
			transition: none;
		}
	}
</style>
