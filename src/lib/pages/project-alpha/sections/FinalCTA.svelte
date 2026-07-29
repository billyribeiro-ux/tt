<script lang="ts">
	import { study } from '$lib/pages/project-alpha/data/content';
	import { assets } from '$lib/pages/project-alpha/data/assets';
	import { ui } from '$lib/pages/project-alpha/state/ui.svelte';
	import { magnetic } from '$lib/pages/project-alpha/actions/magnetic';
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';
	import UsersThreeIcon from 'phosphor-svelte/lib/UsersThreeIcon';
	import FlaskIcon from 'phosphor-svelte/lib/FlaskIcon';
	import ShieldCheckIcon from 'phosphor-svelte/lib/ShieldCheckIcon';
</script>

<section id="apply" class="section-shell cta-section" data-chapter="08" aria-labelledby="cta-title">
	<div class="cta card-surface reveal">
		<div class="glow" aria-hidden="true"></div>
		<div class="orbit" aria-hidden="true">
			<span class="orbit-a"></span>
			<span class="orbit-b"></span>
			<span class="orbit-c"></span>
			<i>α</i>
		</div>
		<img
			class="cta-mark"
			src={assets.projectAlpha.src}
			alt={assets.projectAlpha.alt}
			width={assets.projectAlpha.width}
			height={assets.projectAlpha.height}
			decoding="async"
			loading="lazy"
		/>
		<p class="section-label">Enrollment interest</p>
		<p class="resolution">The protocol ends where your practice begins.</p>
		<h2 id="cta-title" class="section-title">
			Train the brain<br />
			<em>that places the trade.</em>
		</h2>
		<p class="section-desc">
			{study.participants} seats. {study.days} days. Muse EEG + CORE ALPHA + one-contract live sessions
			under {study.investigator.name}. If you can run the protocol and size risk correctly, register
			your interest.
		</p>

		<ul class="perks">
			<li><FlaskIcon size={18} weight="duotone" /> EEG + trade-log research protocol</li>
			<li>
				<UsersThreeIcon size={18} weight="duotone" /> Limited {study.participants}-trader cohort
			</li>
			<li><ShieldCheckIcon size={18} weight="duotone" /> De-identified data · voluntary exit</li>
		</ul>

		<div class="actions">
			<button type="button" class="btn-primary" use:magnetic={0.22} onclick={() => ui.openApply()}>
				Apply for {study.name}
				<ArrowRightIcon size={18} weight="bold" />
			</button>
		</div>
		<p class="fine">
			No fabricated outcomes. Interest form only. Acceptance is not guaranteed. Trading involves
			substantial risk of loss.
		</p>
	</div>
</section>

<style>
	.cta {
		position: relative;
		overflow: hidden;
		padding: clamp(3rem, 8vw, 6.5rem) clamp(1.4rem, 5vw, 3.5rem);
		border-radius: 28px;
		text-align: center;
		background:
			radial-gradient(ellipse 80% 70% at 50% 0%, rgba(152, 0, 0, 0.14), transparent 55%),
			radial-gradient(ellipse 60% 50% at 80% 100%, rgba(59, 139, 235, 0.1), transparent 50%),
			linear-gradient(145deg, #111117, #09090c);
	}

	.cta-mark {
		display: block;
		width: min(320px, 72vw);
		height: auto;
		aspect-ratio: 721 / 293;
		object-fit: contain;
		margin: 0 auto 1.25rem;
		mix-blend-mode: screen;
		filter: drop-shadow(0 12px 40px rgba(0, 0, 0, 0.45));
	}

	.glow {
		position: absolute;
		inset: -40% -20% auto;
		height: 80%;
		background: radial-gradient(circle, rgba(184, 32, 32, 0.12), transparent 60%);
		pointer-events: none;
	}

	.orbit {
		position: absolute;
		top: 50%;
		left: 50%;
		width: min(64vw, 680px);
		aspect-ratio: 1;
		transform: translate(-50%, -52%);
		pointer-events: none;
		opacity: 0.58;
	}

	.orbit span {
		position: absolute;
		inset: 0;
		border: 1px solid rgba(59, 139, 235, 0.13);
		border-radius: 50%;
	}

	.orbit-a {
		animation: orbit 18s linear infinite;
	}

	.orbit-b {
		inset: 12% !important;
		border-color: rgba(184, 32, 32, 0.12) !important;
		animation: orbit-reverse 14s linear infinite;
	}

	.orbit-c {
		inset: 27% !important;
		border-color: rgba(212, 168, 83, 0.1) !important;
	}

	.orbit span::before {
		content: '';
		position: absolute;
		top: 12%;
		left: 12%;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--alpha-blue);
		box-shadow: 0 0 12px var(--alpha-blue);
	}

	.orbit i {
		position: absolute;
		inset: 41%;
		display: grid;
		place-items: center;
		border-radius: 50%;
		font-family: var(--font-display);
		font-size: clamp(3rem, 7vw, 6rem);
		font-style: italic;
		color: rgba(59, 139, 235, 0.13);
	}

	.resolution {
		position: relative;
		margin: 0 0 0.7rem;
		font-family: var(--font-display);
		font-size: clamp(1rem, 2vw, 1.35rem);
		font-style: italic;
		color: var(--alpha-muted);
	}

	.cta :global(.section-title) {
		position: relative;
		font-size: clamp(3rem, 7.2vw, 6.2rem);
	}

	.cta :global(.section-title em) {
		font-weight: 450;
		color: #b9ccea;
	}

	.cta :global(.section-desc) {
		margin-inline: auto;
	}

	.perks {
		list-style: none;
		margin: 0 auto 2rem;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.75rem 1.25rem;
		max-width: 720px;
	}

	.perks li {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		font-size: 0.88rem;
		color: var(--alpha-muted);
		padding: 0.45rem 0.85rem;
		border-radius: 999px;
		border: 1px solid var(--alpha-border);
		background: rgba(10, 10, 12, 0.45);
	}

	.actions {
		display: flex;
		justify-content: center;
		margin-bottom: 1rem;
	}

	.fine {
		margin: 0;
		font-size: 0.78rem;
		color: var(--alpha-faint);
		max-width: 480px;
		margin-inline: auto;
		line-height: 1.6;
	}

	@keyframes orbit {
		to {
			transform: rotate(360deg);
		}
	}

	@keyframes orbit-reverse {
		to {
			transform: rotate(-360deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.orbit-a,
		.orbit-b {
			animation: none;
		}
	}
</style>
