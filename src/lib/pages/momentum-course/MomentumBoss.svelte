<script lang="ts">
	import { reveal, splitReveal } from '$lib/motion';
	import CubeIcon from 'phosphor-svelte/lib/CubeIcon';

	const courseUrl = 'https://tricktrades.com/momentum-course';
</script>

<section class="mo-boss" aria-labelledby="mo-boss-title">
	<div class="tt-container">
		<div class="section-head">
			<span class="idx">02 / 02</span>
			<span class="rule"></span>
			<span class="label mo-boss__count">Bundled inside</span>
		</div>

		<article class="mo-boss__card" data-anim {@attach reveal({ y: 44, duration: 1.05 })}>
			<span class="mo-boss__reg mo-boss__reg--tl" aria-hidden="true"></span>
			<span class="mo-boss__reg mo-boss__reg--br" aria-hidden="true"></span>

			<div class="mo-boss__main">
				<span class="mo-boss__icon"><CubeIcon size={26} weight="regular" /></span>
				<h2 id="mo-boss-title" class="mo-boss__title" data-split {@attach splitReveal({ stagger: 0.03 })}>
					B.O.S.S. <span class="text-red">Carbon</span>, included.
				</h2>
				<p class="mo-boss__body">
					Enrollment in Momentum comes with B.O.S.S. Carbon bundled in — sold separately as a $597
					value, and yours as part of the program at no extra cost. Full details are on the course
					page.
				</p>
				<a class="mo-boss__link" href={courseUrl}>See what B.O.S.S. Carbon includes →</a>
			</div>

			<div class="mo-boss__value">
				<span class="mo-boss__value-label label">Value</span>
				<p class="mo-boss__value-amt">
					<span class="mo-boss__cur">$</span><span class="num">597</span>
				</p>
				<span class="mo-boss__value-note">Included free</span>
			</div>
		</article>
	</div>
</section>

<style>
	.mo-boss {
		position: relative;
		padding-block: clamp(4.5rem, 3rem + 8vw, 9rem);
	}
	.mo-boss__count {
		flex: none;
		color: var(--tt-mute-2);
	}
	.mo-boss__card {
		position: relative;
		display: grid;
		gap: clamp(1.8rem, 4vw, 3rem);
		padding: clamp(1.8rem, 4vw, 3.2rem);
		border: 1px solid rgb(var(--tt-red-rgb) / 0.42);
		border-radius: var(--tt-radius-lg);
		background:
			linear-gradient(180deg, rgb(var(--tt-red-rgb) / 0.1), transparent 42%),
			var(--tt-ink-2);
		box-shadow: var(--tt-shadow-card);
	}
	.mo-boss__reg {
		position: absolute;
		width: 14px;
		height: 14px;
		border-color: rgba(255, 255, 255, 0.22);
		border-style: solid;
		border-width: 0;
		pointer-events: none;
	}
	.mo-boss__reg--tl {
		top: 12px;
		left: 12px;
		border-top-width: 1px;
		border-left-width: 1px;
	}
	.mo-boss__reg--br {
		right: 12px;
		bottom: 12px;
		border-right-width: 1px;
		border-bottom-width: 1px;
	}
	.mo-boss__icon {
		display: inline-grid;
		place-items: center;
		width: 48px;
		height: 48px;
		margin-bottom: 1.4rem;
		border-radius: 12px;
		color: #fff;
		border: 1px solid rgb(var(--tt-red-rgb) / 0.5);
		background: rgb(var(--tt-red-rgb) / 0.08);
	}
	.mo-boss__title {
		font-size: clamp(1.8rem, 1.3rem + 2.5vw, 3rem);
		font-weight: 800;
		letter-spacing: -0.025em;
		color: #fff;
	}
	.mo-boss__body {
		margin-top: 1rem;
		max-width: 54ch;
		font-size: var(--fs-lead);
		color: var(--tt-fog);
	}
	.mo-boss__link {
		display: inline-block;
		margin-top: 1.4rem;
		font-family: var(--tt-font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--tt-fog);
		border-bottom: 1px solid transparent;
		transition:
			color 0.25s ease,
			border-color 0.25s ease;
	}
	.mo-boss__link:hover {
		color: #fff;
		border-color: var(--tt-line-strong);
	}
	.mo-boss__value {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.6rem;
	}
	.mo-boss__value-label {
		color: var(--tt-mute-2);
	}
	.mo-boss__value-amt {
		display: flex;
		align-items: baseline;
		gap: 0.3rem;
		color: #fff;
	}
	.mo-boss__cur {
		font-size: 1.4rem;
		font-weight: 700;
		color: var(--tt-fog);
	}
	.mo-boss__value-amt .num {
		font-size: clamp(2.6rem, 1.8rem + 4vw, 4.4rem);
		font-weight: 800;
		line-height: 0.9;
		letter-spacing: -0.03em;
	}
	.mo-boss__value-note {
		font-size: 0.82rem;
		letter-spacing: 0.02em;
		color: var(--tt-red-bright);
	}

	@media (min-width: 820px) {
		.mo-boss__card {
			grid-template-columns: 1.4fr 0.6fr;
			align-items: center;
		}
		.mo-boss__value {
			padding-left: clamp(1.8rem, 4vw, 3rem);
			border-left: 1px solid var(--tt-line);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.mo-boss__link {
			transition: none;
		}
	}
</style>
