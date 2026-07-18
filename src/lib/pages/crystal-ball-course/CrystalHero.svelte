<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { reveal, splitReveal, parallax, drawLine, jumpTo } from '$lib/motion';
	import EyeIcon from 'phosphor-svelte/lib/EyeIcon';

	const courseUrl = 'https://tricktrades.com/crystal-ball-course';
</script>

<section class="cb-hero" aria-labelledby="cb-hero-title">
	<div class="cb-hero__bg" aria-hidden="true">
		<div class="cb-hero__grid grid-bg"></div>
	</div>

	<div class="tt-container cb-hero__inner">
		<div class="cb-hero__copy">
			<p class="eyebrow cb-hero__kicker">
				<EyeIcon size={16} weight="fill" aria-hidden="true" />The Price-Action Series
			</p>

			<h1
				id="cb-hero-title"
				class="cb-hero__title"
				data-split
				{@attach splitReveal({ stagger: 0.026 })}
			>
				See the move <span class="text-red">before</span> it happens.
			</h1>

			<div class="cb-hero__foot" data-anim-stagger {@attach reveal({ stagger: 0.12, y: 24 })}>
				<p class="cb-hero__lede prose">
					Crystal Ball is Pat Mitchell’s price-action series: two volumes that teach you to dissect
					raw price action, read intent behind every candle, and build the patience to wait for the
					level that pays.
				</p>

				<div class="cb-hero__cta">
					<Button href={courseUrl}>Explore the series</Button>
					<a class="cb-hero__link" href="#cb-volumes" onclick={(e) => jumpTo(e, '#cb-volumes')}>
						Compare volumes
					</a>
				</div>
			</div>
		</div>

		<div class="cb-hero__orb-wrap" {@attach parallax(-40)}>
			<div class="cb-hero__orb" data-anim {@attach reveal({ scale: 0.9, y: 30, duration: 1.2 })}>
				<span class="cb-hero__orb-glyph"
					><EyeIcon size={64} weight="thin" aria-hidden="true" /></span
				>
				<!-- The move printing before it happens: a price line drawn once on entry. -->
				<svg
					class="cb-hero__orb-line"
					viewBox="0 0 220 96"
					fill="none"
					aria-hidden="true"
					{@attach drawLine({ scrub: false })}
				>
					<path
						d="M6 76 L44 62 L74 82 L104 44 L134 56 L166 24 L214 8"
						stroke="var(--tt-red-bright)"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
				<span class="cb-hero__orb-ring cb-hero__orb-ring--a" aria-hidden="true"></span>
				<span class="cb-hero__orb-ring cb-hero__orb-ring--b" aria-hidden="true"></span>
			</div>
		</div>
	</div>
</section>

<style>
	.cb-hero {
		position: relative;
		overflow: clip;
		padding-top: calc(var(--tt-header-h) + clamp(2.5rem, 6vw, 5rem));
		padding-bottom: clamp(3.5rem, 6vw, 6rem);
	}
	.cb-hero__bg {
		position: absolute;
		inset: 0;
		z-index: 0;
	}
	.cb-hero__grid {
		position: absolute;
		inset: -12% 0 0;
		opacity: 0.4;
	}

	.cb-hero__inner {
		position: relative;
		z-index: 1;
		display: grid;
		gap: clamp(2.5rem, 5vw, 4rem);
		align-items: center;
	}
	.cb-hero__kicker {
		gap: 0.5rem;
	}
	.cb-hero__title {
		margin-top: 1.4rem;
		max-width: 14ch;
		font-size: var(--fs-h1);
		font-weight: 800;
		line-height: 0.94;
		letter-spacing: -0.03em;
		color: #fff;
	}
	.cb-hero__foot {
		display: grid;
		gap: clamp(1.8rem, 4vw, 2.4rem);
		margin-top: clamp(1.8rem, 4vw, 2.4rem);
	}
	.cb-hero__lede {
		max-width: 52ch;
	}
	.cb-hero__cta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1.4rem;
	}
	.cb-hero__link {
		display: inline-flex;
		align-items: center;
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
	.cb-hero__link:hover {
		color: #fff;
		border-color: var(--tt-line-strong);
	}

	.cb-hero__orb-wrap {
		display: flex;
		justify-content: center;
	}
	.cb-hero__orb {
		position: relative;
		display: grid;
		place-items: center;
		width: min(78vw, 360px);
		aspect-ratio: 1;
		border-radius: 50%;
		background:
			radial-gradient(circle at 38% 32%, rgb(var(--tt-red-bright-rgb) / 0.4), transparent 46%),
			radial-gradient(circle at 50% 50%, rgb(var(--tt-red-rgb) / 0.22), transparent 68%),
			var(--tt-ink-2);
		box-shadow:
			inset 0 0 60px rgb(var(--tt-red-rgb) / 0.3),
			var(--tt-shadow-card);
	}
	.cb-hero__orb-glyph {
		position: relative;
		z-index: 2;
		color: #fff;
	}
	.cb-hero__orb-line {
		position: absolute;
		left: 50%;
		bottom: 19%;
		z-index: 1;
		width: 58%;
		height: auto;
		filter: drop-shadow(0 0 8px rgb(var(--tt-red-bright-rgb) / 0.45));
		transform: translateX(-50%);
		pointer-events: none;
	}
	.cb-hero__orb-ring {
		position: absolute;
		border-radius: 50%;
		border: 1px solid var(--tt-line-strong);
	}
	.cb-hero__orb-ring--a {
		inset: 12%;
		border-color: rgb(var(--tt-red-bright-rgb) / 0.28);
	}
	.cb-hero__orb-ring--b {
		inset: 26%;
		border-color: var(--tt-line);
	}

	@media (min-width: 1024px) {
		.cb-hero__inner {
			grid-template-columns: 1.1fr 0.9fr;
		}
	}
</style>
