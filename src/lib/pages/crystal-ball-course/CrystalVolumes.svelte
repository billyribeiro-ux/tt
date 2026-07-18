<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { reveal, splitReveal } from '$lib/motion';

	const courseUrl = 'https://tricktrades.com/crystal-ball-course';

	// Volumes, taglines, module counts and prices transcribed from the Trick Trades
	// catalogue. Nothing invented.
	const volumes = [
		{
			n: '01',
			name: 'Volume 1',
			tag: 'Price action',
			tagline: 'Dissect price action and see moves before they happen.',
			meta: '8 modules · 2 quizzes',
			price: 399,
			featured: false
		},
		{
			n: '02',
			name: 'Volume 2',
			tag: 'Advanced',
			tagline: 'Patience, sizing, and support & resistance mastery.',
			meta: '8 modules · 2 quizzes',
			price: 399,
			featured: false
		},
		{
			n: '03',
			name: 'Bundle + Bonus',
			tag: 'Best value',
			tagline: 'Both volumes, plus a live-trading bonus hour.',
			meta: 'Vol 1 + Vol 2 · +1 live hour',
			price: 649,
			featured: true
		}
	];
</script>

<section id="cb-volumes" class="cb-vol" aria-labelledby="cb-vol-title">
	<span class="cb-vol__glow" aria-hidden="true"></span>
	<div class="tt-container">
		<div class="section-head">
			<span class="idx">◆ The series</span>
			<span class="rule"></span>
			<span class="label cb-vol__count">03 ways in</span>
		</div>

		<div class="cb-vol__head">
			<h2
				id="cb-vol-title"
				class="cb-vol__title"
				data-split
				{@attach splitReveal({ stagger: 0.03 })}
			>
				Two volumes. One <span class="text-red">bundle.</span>
			</h2>
			<p class="cb-vol__intro prose">
				Take a single volume, or take both and add the live bonus hour. Each volume runs eight
				modules and two quizzes. Self-paced, yours to keep.
			</p>
		</div>

		<ul class="cb-vol__list" data-anim-stagger {@attach reveal({ stagger: 0.1, y: 40 })}>
			{#each volumes as v (v.n)}
				<li class="cb-vol__row" class:cb-vol__row--featured={v.featured}>
					<span class="cb-vol__row-n num" aria-hidden="true">{v.n}</span>
					<div class="cb-vol__row-main">
						<span class="cb-vol__row-tag label">{v.tag}</span>
						<h3 class="cb-vol__row-name">{v.name}</h3>
						<p class="cb-vol__row-tagline">{v.tagline}</p>
						<p class="cb-vol__row-meta num">{v.meta}</p>
					</div>
					<div class="cb-vol__row-buy">
						<p class="cb-vol__row-price">
							<span class="cb-vol__cur">$</span><span class="num cb-vol__amt">{v.price}</span>
						</p>
						<Button href={courseUrl} variant={v.featured ? 'primary' : 'ghost'} size="md">
							{v.featured ? 'Get the bundle' : 'Get this volume'}
						</Button>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.cb-vol {
		position: relative;
		overflow: clip;
		padding-block: clamp(4.5rem, 3rem + 8vw, 9rem);
		background: var(--tt-ink);
		box-shadow:
			inset 0 1px 0 var(--tt-line),
			inset 0 -1px 0 var(--tt-line);
	}
	.cb-vol__glow {
		position: absolute;
		z-index: 0;
		top: 6%;
		right: -10%;
		width: 44vw;
		max-width: 620px;
		aspect-ratio: 1;
		background: radial-gradient(circle, rgb(var(--tt-red-rgb) / 0.16), transparent 64%);
		filter: blur(14px);
		pointer-events: none;
	}
	.cb-vol .tt-container {
		position: relative;
		z-index: 1;
	}
	.cb-vol__count {
		flex: none;
		color: var(--tt-mute-2);
	}
	.cb-vol__head {
		display: grid;
		gap: 1.2rem;
		margin-bottom: clamp(2.5rem, 5vw, 4rem);
	}
	.cb-vol__title {
		font-size: var(--fs-h2);
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.025em;
		color: #fff;
	}
	.cb-vol__intro {
		max-width: 56ch;
	}
	@media (min-width: 1024px) {
		.cb-vol__head {
			grid-template-columns: 1fr 1fr;
			align-items: end;
			gap: clamp(2rem, 5vw, 4rem);
		}
	}

	.cb-vol__list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: clamp(1rem, 2.2vw, 1.4rem);
	}
	.cb-vol__row {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 1.2rem 1.6rem;
		padding: clamp(1.6rem, 3.5vw, 2.4rem);
		border: 1px solid var(--tt-line);
		border-radius: var(--tt-radius-lg);
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent);
	}
	.cb-vol__row--featured {
		border-color: rgb(var(--tt-red-rgb) / 0.42);
		background:
			linear-gradient(180deg, rgb(var(--tt-red-rgb) / 0.1), transparent 44%), var(--tt-ink-2);
		box-shadow: var(--tt-shadow-card);
	}
	.cb-vol__row-n {
		font-size: clamp(1.6rem, 1rem + 2.5vw, 2.8rem);
		font-weight: 800;
		line-height: 1;
		color: transparent;
		-webkit-text-stroke: 1px rgb(var(--tt-red-bright-rgb) / 0.7);
	}
	.cb-vol__row-tag {
		color: var(--tt-red-bright);
	}
	.cb-vol__row-name {
		margin-top: 0.5rem;
		font-size: var(--fs-h3);
		font-weight: 800;
		letter-spacing: -0.02em;
		color: #fff;
	}
	.cb-vol__row-tagline {
		margin-top: 0.6rem;
		max-width: 44ch;
		font-size: var(--fs-body);
		color: var(--tt-fog);
	}
	.cb-vol__row-meta {
		margin-top: 0.9rem;
		font-size: 0.78rem;
		letter-spacing: 0.03em;
		color: var(--tt-mute);
	}
	.cb-vol__row-buy {
		grid-column: 2;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1.2rem;
		padding-top: 0.4rem;
	}
	.cb-vol__row-price {
		display: flex;
		align-items: baseline;
		gap: 0.4rem;
		color: #fff;
	}
	.cb-vol__cur {
		font-size: 1rem;
		font-weight: 700;
		color: var(--tt-fog);
	}
	.cb-vol__amt {
		font-size: clamp(1.9rem, 1.4rem + 2vw, 2.6rem);
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.02em;
	}

	@media (min-width: 768px) {
		.cb-vol__row {
			grid-template-columns: auto 1fr auto;
			align-items: center;
		}
		.cb-vol__row-buy {
			grid-column: auto;
			flex-direction: column;
			align-items: flex-end;
			gap: 1rem;
			padding-top: 0;
			padding-left: clamp(1.4rem, 3vw, 2.4rem);
			border-left: 1px solid var(--tt-line);
		}
	}
</style>
