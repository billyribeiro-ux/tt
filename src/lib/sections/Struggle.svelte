<script lang="ts">
	import { reveal, splitReveal } from '$lib/motion';
	import { painPoints } from '$lib/data/site';
</script>

<section id="struggle" class="tt-section struggle">
	<div class="struggle__bg" aria-hidden="true">
		<div class="struggle__grid grid-bg"></div>
		<div class="struggle__glow"></div>
	</div>

	<div class="tt-container">
		<header class="struggle__head">
			<div class="struggle__eyebrow" data-anim {@attach reveal({ y: 16, duration: 0.7 })}>
				<span class="struggle__tick" aria-hidden="true"></span>
				<span class="label">The Struggle</span>
				<span class="struggle__rule" aria-hidden="true"></span>
			</div>
			<h2 class="struggle__title" data-split {@attach splitReveal({ stagger: 0.05 })}>
				Is this you?
			</h2>
		</header>

		<ol class="struggle__list" data-anim-stagger {@attach reveal({ stagger: 0.13, y: 42, duration: 0.95 })}>
			{#each painPoints as point (point.n)}
				<li class="struggle__item">
					<span class="struggle__index num" aria-hidden="true">{point.n}</span>
					<div class="struggle__copy">
						<h3 class="struggle__item-title">{point.title}</h3>
						<p class="struggle__item-text">{point.body}</p>
					</div>
				</li>
			{/each}
		</ol>
	</div>
</section>

<style>
	.struggle {
		overflow: clip;
	}
	.struggle__bg {
		position: absolute;
		inset: 0;
		z-index: 0;
		pointer-events: none;
	}
	.struggle__grid {
		position: absolute;
		inset: 0;
		opacity: 0.35;
	}
	/* Soft red radial glow bleeding off the lower-left edge */
	.struggle__glow {
		position: absolute;
		left: -18%;
		bottom: -24%;
		width: 60vw;
		height: 60vw;
		max-width: 720px;
		max-height: 720px;
		background: radial-gradient(circle, rgb(var(--tt-red-rgb) / 0.34), transparent 64%);
		filter: blur(24px);
	}

	.struggle .tt-container {
		position: relative;
		z-index: 1;
	}

	/* ---- Header: mono kicker + hairline rule, big headline below ---- */
	.struggle__head {
		margin-bottom: clamp(2.5rem, 5vw, 4.5rem);
	}
	.struggle__eyebrow {
		display: flex;
		align-items: center;
		gap: 0.9rem;
		margin-bottom: 1.4rem;
	}
	.struggle__tick {
		width: 26px;
		height: 2px;
		background: var(--tt-red-bright);
		box-shadow: 0 0 10px rgb(var(--tt-red-bright-rgb) / 0.6);
	}
	.struggle__rule {
		flex: 1;
		height: 1px;
		background: linear-gradient(90deg, var(--tt-line-strong), transparent);
	}
	.struggle__title {
		font-size: var(--fs-h2);
		max-width: 14ch;
	}

	/* ---- Editorial numbered list ---- */
	.struggle__list {
		list-style: none;
		margin: 0;
		padding: 0;
		border-bottom: 1px solid var(--tt-line);
	}
	.struggle__item {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.4rem 2.5rem;
		padding-block: clamp(1.9rem, 4vw, 3rem);
		border-top: 1px solid var(--tt-line);
	}

	.struggle__index {
		font-size: clamp(3.5rem, 8vw, 6.75rem);
		font-weight: 700;
		line-height: 0.8;
		letter-spacing: -0.03em;
		color: transparent;
		-webkit-text-stroke: 1.5px var(--tt-line-strong);
		transition:
			-webkit-text-stroke-color 0.45s ease,
			color 0.45s ease,
			transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
	}
	.struggle__item:hover .struggle__index {
		-webkit-text-stroke-color: var(--tt-red);
		color: rgb(var(--tt-red-rgb) / 0.08);
		transform: translateX(4px);
	}

	.struggle__copy {
		max-width: 58ch;
	}
	.struggle__item-title {
		font-size: var(--fs-h3);
		font-weight: 700;
		color: var(--tt-white);
	}
	.struggle__item-text {
		margin-top: 0.7rem;
		font-size: var(--fs-body);
		color: var(--tt-fog);
	}

	@media (min-width: 720px) {
		.struggle__item {
			grid-template-columns: minmax(150px, 0.3fr) 1fr;
			align-items: start;
			gap: clamp(2rem, 5vw, 4rem);
		}
		.struggle__index {
			justify-self: start;
		}
	}
</style>
