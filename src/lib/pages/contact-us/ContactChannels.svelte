<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { reveal } from '$lib/motion';
	import { site } from '$lib/data/site';
	import EnvelopeSimpleIcon from 'phosphor-svelte/lib/EnvelopeSimpleIcon';
	import FacebookLogoIcon from 'phosphor-svelte/lib/FacebookLogoIcon';
</script>

<section class="c-ch tt-section" aria-labelledby="c-ch-title">
	<span class="c-ch__glow" aria-hidden="true"></span>
	<div class="tt-container">
		<header class="section-head">
			<span class="idx">01 / 02</span>
			<span class="rule"></span>
			<span class="label">Two honest ways to reach us</span>
		</header>

		<h2 id="c-ch-title" class="c-ch__title">Pick the channel that fits the question.</h2>

		<div class="c-ch__grid">
			<!-- Email — the primary, direct channel (wide) -->
			<article class="c-ch__card c-ch__card--wide" data-anim {@attach reveal({ y: 40, duration: 1 })}>
				<div class="c-ch__top">
					<span class="c-ch__icon"><EnvelopeSimpleIcon size={24} weight="regular" /></span>
					<span class="c-ch__tag label">Direct · Email</span>
				</div>
				<h3 class="c-ch__name">Email the support team</h3>
				<p class="c-ch__body">
					The right place for anything to do with your account, billing, access, or a specific course
					— and for anything you would rather not post in a group. Write to us and a member of the
					team will read it and reply by email.
				</p>
				<a class="c-ch__addr num" href="mailto:{site.support}">{site.support}</a>
				<div class="c-ch__cta">
					<Button href="mailto:{site.support}">Email {site.support}</Button>
				</div>
			</article>

			<!-- Private Facebook group — community channel (narrow) -->
			<article class="c-ch__card" data-anim {@attach reveal({ y: 40, duration: 1, delay: 0.08 })}>
				<div class="c-ch__top">
					<span class="c-ch__icon"><FacebookLogoIcon size={24} weight="fill" /></span>
					<span class="c-ch__tag label">Community · Members</span>
				</div>
				<h3 class="c-ch__name">Ask the private Facebook group</h3>
				<p class="c-ch__body">
					Our private group is where members trade notes and get quick answers day and night. For
					general questions, it is often the fastest response of all — because you are asking the
					whole community, not just us.
				</p>
				<div class="c-ch__cta">
					<Button href={site.social.facebookGroup} variant="ghost">Open the Facebook group</Button>
				</div>
			</article>
		</div>
	</div>
</section>

<style>
	.c-ch {
		position: relative;
		overflow: clip;
		background: var(--tt-black);
		border-top: 1px solid var(--tt-line);
	}
	.c-ch__glow {
		position: absolute;
		left: -14%;
		bottom: -20%;
		width: 52vw;
		height: 52vw;
		max-width: 660px;
		max-height: 660px;
		background: radial-gradient(circle, rgb(var(--tt-red-rgb) / 0.16), transparent 64%);
		filter: blur(26px);
		pointer-events: none;
	}
	.c-ch .tt-container {
		position: relative;
		z-index: 1;
	}
	.c-ch__title {
		font-size: var(--fs-h2);
		font-weight: 800;
		letter-spacing: -0.02em;
		color: #fff;
		max-width: 20ch;
		margin-bottom: clamp(2rem, 4vw, 3.2rem);
	}
	.c-ch__grid {
		display: grid;
		gap: 1.2rem;
	}
	.c-ch__card {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: clamp(1.8rem, 3vw, 2.6rem);
		border: 1px solid var(--tt-line);
		border-radius: var(--tt-radius-lg);
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent);
		transition:
			border-color 0.4s ease,
			transform 0.4s ease;
	}
	.c-ch__card:hover {
		border-color: var(--tt-line-strong);
		transform: translateY(-3px);
	}
	.c-ch__card--wide {
		border-color: var(--tt-line-strong);
		background:
			radial-gradient(120% 140% at 0% 0%, rgb(var(--tt-red-rgb) / 0.08), transparent 55%),
			linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent);
	}
	.c-ch__top {
		display: flex;
		align-items: center;
		gap: 0.9rem;
		margin-bottom: 1.2rem;
	}
	.c-ch__icon {
		display: grid;
		place-items: center;
		width: 46px;
		height: 46px;
		border-radius: 11px;
		color: #fff;
		border: 1px solid var(--tt-line-strong);
		background: rgba(255, 255, 255, 0.03);
	}
	.c-ch__tag {
		color: var(--tt-red-bright);
	}
	.c-ch__name {
		font-size: var(--fs-h3);
		font-weight: 700;
		color: #fff;
		letter-spacing: -0.01em;
	}
	.c-ch__body {
		margin-top: 0.9rem;
		max-width: 60ch;
		color: var(--tt-fog);
	}
	.c-ch__addr {
		margin-top: 1.4rem;
		font-size: 1rem;
		color: #fff;
		border-bottom: 1px solid var(--tt-line-strong);
		transition: color 0.25s ease;
	}
	.c-ch__addr:hover {
		color: var(--tt-red-bright);
	}
	.c-ch__cta {
		margin-top: 1.8rem;
	}

	@media (min-width: 900px) {
		.c-ch__grid {
			grid-template-columns: 1.35fr 1fr;
			align-items: stretch;
		}
	}
</style>
