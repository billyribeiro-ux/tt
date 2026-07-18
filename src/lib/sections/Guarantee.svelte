<script lang="ts">
	import { reveal, splitReveal, drawLine } from '$lib/motion';
	import { guarantee } from '$lib/data/site';
	import SealCheckIcon from 'phosphor-svelte/lib/SealCheckIcon';

	// Stamp ring text is derived from the real guarantee title + brand name. Nothing invented.
	const ringText = 'Trick Trades · No Trader Left Behind · ';
</script>

<section class="tt-section gua" aria-labelledby="gua-title">
	<div class="gua__ambient" aria-hidden="true"></div>

	<div class="tt-container">
		<div class="gua__frame">
			<span class="gua__mark gua__mark--tl" aria-hidden="true"></span>
			<span class="gua__mark gua__mark--tr" aria-hidden="true"></span>
			<span class="gua__mark gua__mark--bl" aria-hidden="true"></span>
			<span class="gua__mark gua__mark--br" aria-hidden="true"></span>

			<div class="gua__grid">
				<div class="gua__body">
					<p class="label gua__kicker" data-anim {@attach reveal({ y: 16, duration: 0.65 })}>
						Our promise to you
					</p>

					<h2 id="gua-title" class="gua__title" data-split {@attach splitReveal({ stagger: 0.02 })}>
						{guarantee.title}
					</h2>

					<div class="gua__prose" data-anim-stagger {@attach reveal({ stagger: 0.12, y: 24 })}>
						{#each guarantee.body as para (para)}
							<p>{para}</p>
						{/each}
					</div>

					<p class="gua__sign" data-anim {@attach reveal({ y: 20, duration: 0.85, delay: 0.1 })}>
						<svg
							class="gua__sign-rule"
							aria-hidden="true"
							viewBox="0 0 60 18"
							fill="none"
							{@attach drawLine({ scrub: false })}
						>
							<path d="M1,15 L18,11 L34,12 L47,5 L59,2" />
						</svg>
						<span class="script gua__sign-mark">No trader left behind.</span>
					</p>
				</div>

				<aside
					class="gua__sealcol"
					data-anim
					{@attach reveal({ y: 40, scale: 0.9, duration: 1.1 })}
				>
					<div class="gua__seal" aria-hidden="true">
						<span class="gua__seal-edge"></span>

						<svg class="gua__ring" viewBox="0 0 220 220">
							<defs>
								<path
									id="gua-ring-path"
									d="M110,110 m-84,0 a84,84 0 1,1 168,0 a84,84 0 1,1 -168,0"
								/>
							</defs>
							<text><textPath href="#gua-ring-path" startOffset="0">{ringText}</textPath></text>
						</svg>

						<span class="gua__core">
							<SealCheckIcon class="gua__seal-icon" weight="fill" size={52} />
							<span class="gua__core-line"></span>
							<span class="gua__core-label">Guaranteed</span>
						</span>
					</div>
				</aside>
			</div>
		</div>
	</div>
</section>

<style>
	.gua {
		position: relative;
		overflow: clip;
	}
	.gua__ambient {
		position: absolute;
		inset: 0;
		z-index: 0;
		pointer-events: none;
		background: radial-gradient(58% 46% at 82% 22%, rgb(var(--tt-red-rgb) / 0.12), transparent 70%);
	}

	.gua__frame {
		position: relative;
		z-index: 1;
		overflow: hidden;
		padding: clamp(1.9rem, 5vw, 4rem);
		border: 1px solid var(--tt-line-strong);
		border-radius: var(--tt-radius-lg);
		background:
			radial-gradient(120% 150% at 10% -10%, rgb(var(--tt-red-rgb) / 0.11), transparent 46%),
			var(--tt-ink);
		box-shadow: var(--tt-shadow-card);
	}

	/* Corner registration marks: an editorial "certificate" detail */
	.gua__mark {
		position: absolute;
		width: 15px;
		height: 15px;
		opacity: 0.55;
	}
	.gua__mark--tl {
		top: 16px;
		left: 16px;
		border-top: 1px solid var(--tt-line-strong);
		border-left: 1px solid var(--tt-line-strong);
	}
	.gua__mark--tr {
		top: 16px;
		right: 16px;
		border-top: 1px solid var(--tt-line-strong);
		border-right: 1px solid var(--tt-line-strong);
	}
	.gua__mark--bl {
		bottom: 16px;
		left: 16px;
		border-bottom: 1px solid var(--tt-line-strong);
		border-left: 1px solid var(--tt-line-strong);
	}
	.gua__mark--br {
		bottom: 16px;
		right: 16px;
		border-bottom: 1px solid var(--tt-line-strong);
		border-right: 1px solid var(--tt-line-strong);
	}

	.gua__grid {
		display: grid;
		gap: clamp(2.4rem, 5vw, 3.5rem);
		align-items: center;
	}

	.gua__kicker {
		color: var(--tt-red-bright);
	}
	.gua__title {
		margin-top: 1.1rem;
		font-size: var(--fs-h2);
		max-width: 20ch;
	}

	.gua__prose {
		margin-top: 1.7rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 60ch;
	}
	.gua__prose p {
		color: var(--tt-fog);
		font-size: var(--fs-body);
	}
	.gua__prose p:first-child {
		color: var(--tt-white);
		font-size: var(--fs-lead);
	}

	.gua__sign {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-top: 2.2rem;
	}
	.gua__sign-rule {
		flex: none;
		width: 56px;
		height: 18px;
		overflow: visible;
	}
	.gua__sign-rule path {
		fill: none;
		stroke: var(--tt-red);
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.gua__sign-mark {
		font-size: clamp(1.7rem, 1rem + 2.4vw, 2.4rem);
		color: var(--tt-fog);
	}

	/* ---- The seal ---- */
	.gua__sealcol {
		display: flex;
		justify-content: center;
	}
	.gua__seal {
		position: relative;
		width: clamp(208px, 44vw, 268px);
		aspect-ratio: 1;
		transform: rotate(-6deg);
	}
	.gua__seal-edge {
		position: absolute;
		inset: 0;
		border-radius: 50%;
		border: 1px solid var(--tt-line-strong);
		box-shadow:
			inset 0 0 0 7px rgba(255, 255, 255, 0.02),
			inset 0 0 0 8px var(--tt-line);
	}

	.gua__ring {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		transform-origin: 50% 50%;
		animation: gua-spin 44s linear infinite;
	}
	.gua__ring text {
		font-family: var(--tt-font-mono);
		font-size: 12.5px;
		letter-spacing: 0.29em;
		text-transform: uppercase;
		fill: var(--tt-gold);
	}
	@keyframes gua-spin {
		to {
			transform: rotate(360deg);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.gua__ring {
			animation: none;
		}
	}

	.gua__core {
		position: absolute;
		inset: 29%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.55rem;
		border-radius: 50%;
		text-align: center;
		background: radial-gradient(
			120% 120% at 50% 22%,
			rgb(var(--tt-red-rgb) / 0.24),
			rgba(16, 16, 19, 0.94) 72%
		);
		border: 1px solid rgb(var(--tt-red-rgb) / 0.42);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.06),
			0 12px 34px -14px rgb(var(--tt-red-rgb) / 0.7);
	}
	:global(.gua__seal-icon) {
		color: var(--tt-red-bright);
		filter: drop-shadow(0 0 11px rgb(var(--tt-red-bright-rgb) / 0.5));
	}
	.gua__core-line {
		width: 26px;
		height: 1px;
		background: var(--tt-red);
	}
	.gua__core-label {
		font-family: var(--tt-font-mono);
		font-size: 0.62rem;
		letter-spacing: 0.28em;
		text-transform: uppercase;
		color: var(--tt-gold);
	}

	@media (min-width: 1024px) {
		.gua__grid {
			grid-template-columns: 1fr auto;
		}
		.gua__title {
			font-size: clamp(2.2rem, 1.4rem + 3vw, 3.4rem);
		}
	}
</style>
