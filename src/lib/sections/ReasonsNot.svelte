<script lang="ts">
	import { reveal, splitReveal, parallax } from '$lib/motion';
	import { reasonsNot, notList } from '$lib/data/site';
	import WarningIcon from 'phosphor-svelte/lib/WarningIcon';
	import XIcon from 'phosphor-svelte/lib/XIcon';
	import GraduationCapIcon from 'phosphor-svelte/lib/GraduationCapIcon';
</script>

<section class="rn tt-section" aria-labelledby="rn-title">
	<div class="rn__bg" aria-hidden="true">
		<div class="rn__grid grid-bg"></div>
		<div class="rn__hazard"></div>
		<div class="rn__glow" {@attach parallax(90)}></div>
	</div>

	<div class="tt-container rn__inner">
		<header class="rn__head">
			<div class="section-head rn__bar" data-anim {@attach reveal({ y: 16, duration: 0.65 })}>
				<span class="idx">08 / 13</span>
				<span class="label rn__kicker">
					<WarningIcon weight="fill" size={15} />
					Read this first
				</span>
				<span class="rule" aria-hidden="true"></span>
			</div>
			<h2 id="rn-title" class="rn__title" data-split {@attach splitReveal({ stagger: 0.026 })}>
				Reasons you should <em>NOT</em> be here.
			</h2>
			<p class="rn__lede" data-anim {@attach reveal({ y: 20, duration: 0.85, delay: 0.12 })}>
				Trick Trades filters hard, on purpose. If any of these three describe you, this isn’t your
				room — and we’d rather you found out now than three trades from here.
			</p>
		</header>

		<ol class="rn__reasons" data-anim-stagger {@attach reveal({ stagger: 0.14, y: 40 })}>
			{#each reasonsNot as reason, i (reason.title)}
				<li class="rn__reason">
					<span class="rn__num num" aria-hidden="true">{(i + 1).toString().padStart(2, '0')}</span>
					<div class="rn__reason-main">
						<h3 class="rn__reason-title">{reason.title}</h3>
						<p class="rn__reason-body">{reason.body}</p>
					</div>
				</li>
			{/each}
		</ol>

		<div class="rn__panel" data-anim {@attach reveal({ y: 44, duration: 1.1 })}>
			<div class="rn__panel-head">
				<p class="label">For the record</p>
				<h3 class="rn__panel-title">What we are <span class="text-red">not</span>.</h3>
			</div>

			<ul class="rn__not" data-anim-stagger {@attach reveal({ stagger: 0.09, y: 18 })}>
				{#each notList as item (item)}
					<li class="rn__not-item">
						<XIcon weight="bold" size={18} class="rn__x" />
						<span class="rn__not-text">{item}</span>
					</li>
				{/each}
			</ul>

			<hr class="hairline rn__rule" />

			<div class="rn__verdict">
				<p class="label rn__verdict-label">
					<GraduationCapIcon weight="fill" size={15} />
					And what it is
				</p>
				<p class="rn__edu">We are an <span class="text-gradient">Educational Service.</span></p>
				<p class="rn__fine">
					Must be 18 or older. This service is 100% education — your decisions are yours alone to
					make.
				</p>
			</div>
		</div>
	</div>
</section>

<style>
	.rn {
		position: relative;
		overflow: clip;
		background:
			radial-gradient(125% 85% at 88% -12%, rgb(var(--tt-red-rgb) / 0.16), transparent 55%),
			linear-gradient(180deg, var(--tt-black), #07070a 60%, var(--tt-black));
		border-top: 1px solid var(--tt-line);
	}
	.rn__bg {
		position: absolute;
		inset: 0;
		z-index: 0;
		pointer-events: none;
	}
	.rn__grid {
		position: absolute;
		inset: 0;
		opacity: 0.35;
	}
	.rn__hazard {
		position: absolute;
		inset: 0 auto 0 0;
		width: clamp(10px, 2vw, 22px);
		background: repeating-linear-gradient(
			-45deg,
			rgb(var(--tt-red-rgb) / 0.55) 0 9px,
			transparent 9px 20px
		);
		opacity: 0.5;
		-webkit-mask-image: linear-gradient(180deg, transparent, #000 18%, #000 82%, transparent);
		mask-image: linear-gradient(180deg, transparent, #000 18%, #000 82%, transparent);
	}
	.rn__glow {
		position: absolute;
		top: -14%;
		right: -12%;
		width: 60vw;
		height: 60vw;
		max-width: 780px;
		max-height: 780px;
		background: radial-gradient(circle, rgb(var(--tt-red-rgb) / 0.32), transparent 62%);
		filter: blur(24px);
	}

	.rn__inner {
		position: relative;
		z-index: 1;
	}

	/* --- Header --- */
	.rn__head {
		max-width: 62ch;
	}
	.rn__bar {
		margin-bottom: 0;
	}
	.rn__kicker {
		display: inline-flex;
		align-items: center;
		gap: 0.5em;
		color: var(--tt-red-bright);
	}
	.rn__title {
		margin-top: 1.2rem;
		font-size: var(--fs-h2);
		letter-spacing: -0.03em;
		line-height: 0.98;
	}
	.rn__title em {
		font-style: normal;
		color: var(--tt-red-bright);
		-webkit-text-stroke: 0;
	}
	.rn__lede {
		margin-top: 1.4rem;
		max-width: 54ch;
		font-size: var(--fs-lead);
		color: var(--tt-fog);
	}

	/* --- Numbered reasons --- */
	.rn__reasons {
		list-style: none;
		padding: 0;
		margin: clamp(3rem, 6vw, 5rem) 0 0;
	}
	.rn__reason {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: clamp(1.1rem, 4vw, 3rem);
		align-items: start;
		padding: clamp(1.8rem, 3.5vw, 2.8rem) 0;
		border-top: 1px solid var(--tt-line);
	}
	.rn__reason:last-child {
		border-bottom: 1px solid var(--tt-line);
	}
	.rn__num {
		font-size: clamp(2.6rem, 1.6rem + 4.5vw, 5.5rem);
		font-weight: 700;
		line-height: 0.8;
		color: transparent;
		-webkit-text-stroke: 1.4px rgb(var(--tt-red-rgb) / 0.85);
	}
	.rn__reason-title {
		font-size: var(--fs-h4);
		color: var(--tt-white);
		letter-spacing: -0.01em;
	}
	.rn__reason-body {
		margin-top: 0.65rem;
		max-width: 64ch;
		color: var(--tt-fog);
	}

	/* --- The "not" panel --- */
	.rn__panel {
		position: relative;
		margin-top: clamp(3rem, 6vw, 5rem);
		padding: clamp(1.8rem, 4vw, 3.2rem);
		background: linear-gradient(180deg, rgba(31, 15, 15, 0.72), rgba(12, 12, 14, 0.85));
		border: 1px solid var(--tt-line-strong);
		border-radius: var(--tt-radius-lg);
		box-shadow: var(--tt-shadow-card);
		overflow: hidden;
	}
	.rn__panel::before {
		content: '';
		position: absolute;
		inset: 0 0 auto 0;
		height: 4px;
		background: repeating-linear-gradient(
			-45deg,
			var(--tt-red) 0 10px,
			rgba(10, 10, 11, 0) 10px 22px
		);
		opacity: 0.75;
	}
	.rn__panel-head {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.6rem 1.2rem;
	}
	.rn__panel-title {
		font-size: var(--fs-h3);
		letter-spacing: -0.02em;
	}

	.rn__not {
		list-style: none;
		padding: 0;
		margin: clamp(1.6rem, 3vw, 2.4rem) 0 0;
		display: grid;
		gap: 0.9rem 2rem;
	}
	.rn__not-item {
		display: flex;
		align-items: center;
		gap: 0.85rem;
		padding-bottom: 0.9rem;
		border-bottom: 1px solid var(--tt-line);
	}
	:global(.rn__x) {
		flex: none;
		color: var(--tt-red-bright);
	}
	.rn__not-text {
		font-family: var(--tt-font-mono);
		font-size: 0.94rem;
		letter-spacing: 0.01em;
		color: var(--tt-mute);
		text-decoration: line-through;
		text-decoration-color: rgb(var(--tt-red-rgb) / 0.7);
		text-decoration-thickness: 1.5px;
	}

	.rn__rule {
		margin: clamp(1.8rem, 4vw, 2.8rem) 0;
		background: var(--tt-line-strong);
	}

	.rn__verdict-label {
		display: inline-flex;
		align-items: center;
		gap: 0.5em;
		color: var(--tt-gold);
	}
	.rn__edu {
		margin-top: 0.8rem;
		font-family: var(--tt-font-body);
		font-weight: 800;
		font-size: var(--fs-h1);
		line-height: 0.96;
		letter-spacing: -0.03em;
		color: var(--tt-white);
		text-wrap: balance;
	}
	.rn__fine {
		margin-top: 1.4rem;
		max-width: 56ch;
		font-family: var(--tt-font-mono);
		font-size: 0.82rem;
		line-height: 1.7;
		letter-spacing: 0.02em;
		color: var(--tt-mute-2);
	}

	@media (min-width: 760px) {
		.rn__not {
			grid-template-columns: 1fr 1fr;
		}
	}
	@media (min-width: 960px) {
		.rn__panel {
			padding: clamp(2.6rem, 4vw, 3.6rem);
		}
	}
</style>
