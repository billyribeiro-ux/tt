<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { reveal, splitReveal, parallax, scrollToTarget } from '$lib/motion';
	import { site } from '$lib/data/site';
	import EnvelopeIcon from 'phosphor-svelte/lib/EnvelopeIcon';
	import PaperPlaneRightIcon from 'phosphor-svelte/lib/PaperPlaneRightIcon';
	import FacebookLogoIcon from 'phosphor-svelte/lib/FacebookLogoIcon';

	function toPricing(e: MouseEvent) {
		e.preventDefault();
		scrollToTarget('#pricing');
	}
</script>

<section class="tt-section final" aria-labelledby="final-headline">
	<div class="final__bg" aria-hidden="true">
		<div class="final__grid grid-bg"></div>
		<div class="final__glow" {@attach parallax(-70)}></div>
	</div>

	<div class="tt-container final__inner">
		<p class="label final__kicker" data-anim {@attach reveal({ y: 16, duration: 0.65 })}>
			<span class="final__kicker-rule" aria-hidden="true"></span>
			Your move
		</p>

		<h2
			id="final-headline"
			class="final__headline"
			data-split
			{@attach splitReveal({ stagger: 0.035 })}
		>
			How will you get your <span class="text-red">freedom?</span>
		</h2>

		<p class="final__lede" data-anim {@attach reveal({ y: 22 })}>
			The next step is yours. Master the skill, master the emotion — day by day, trade by trade.
		</p>

		<div class="final__cta" data-anim {@attach reveal({ y: 22, delay: 0.05 })}>
			<Button href="#pricing" size="lg" onclick={toPricing}>Become a member</Button>
		</div>

		<div class="final__news" data-anim {@attach reveal({ y: 24, delay: 0.1 })}>
			<span class="hairline final__news-rule"></span>
			<p class="label final__news-label">
				The Situation Room — get the free pre-market newsletter
			</p>

			<form class="final__form" action="{site.domain}/the-situation-room" method="get">
				<EnvelopeIcon class="final__form-icon" size={18} weight="regular" aria-hidden="true" />
				<label class="sr-only" for="final-email">Your email address</label>
				<input
					id="final-email"
					class="final__input"
					type="email"
					name="email"
					required
					autocomplete="email"
					placeholder="Your best email"
				/>
				<button type="submit" class="final__submit">
					<span>Get it free</span>
					<PaperPlaneRightIcon size={16} weight="bold" aria-hidden="true" />
				</button>
			</form>

			<p class="final__fine">
				Delivered before the bell — no alerts, no hype.
				<a class="final__fb" href={site.social.facebookGroup}>
					<FacebookLogoIcon size={15} weight="fill" aria-hidden="true" />
					Prefer the private Facebook group?
				</a>
			</p>
		</div>
	</div>
</section>

<style>
	.final {
		position: relative;
		overflow: clip;
		background: var(--tt-black);
		text-align: center;
	}

	.final__bg {
		position: absolute;
		inset: 0;
		z-index: 0;
	}
	.final__grid {
		position: absolute;
		inset: 0;
		opacity: 0.35;
	}
	/* Red radial glow bleeding up from the bottom edge — the cinematic close. */
	.final__glow {
		position: absolute;
		left: 50%;
		bottom: -55%;
		width: min(1500px, 130vw);
		height: 105vh;
		transform: translateX(-50%);
		background: radial-gradient(
			ellipse 46% 60% at 50% 100%,
			rgb(var(--tt-red-bright-rgb) / 0.32),
			rgb(var(--tt-red-rgb) / 0.42) 24%,
			transparent 66%
		);
		filter: blur(24px);
	}

	.final__inner {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		max-width: 62rem;
	}

	.final__kicker {
		display: inline-flex;
		align-items: center;
		gap: 0.9rem;
		color: var(--tt-mute);
	}
	.final__kicker-rule {
		width: 40px;
		height: 1px;
		background: var(--tt-red);
	}

	.final__headline {
		margin-top: 1.6rem;
		font-size: var(--fs-mega);
		font-weight: 800;
		line-height: 0.94;
		letter-spacing: -0.035em;
		text-wrap: balance;
	}

	.final__lede {
		margin-top: 1.8rem;
		max-width: 46ch;
		font-size: var(--fs-lead);
		color: var(--tt-fog);
	}

	.final__cta {
		margin-top: 2.6rem;
	}

	/* --- Free newsletter capture (real hand-off, no fake success) --- */
	.final__news {
		width: 100%;
		max-width: 34rem;
		margin-top: clamp(3.5rem, 7vw, 5.5rem);
	}
	.final__news-rule {
		display: block;
		width: 100%;
		margin-bottom: 1.9rem;
		background: linear-gradient(90deg, transparent, var(--tt-line-strong), transparent);
	}
	.final__news-label {
		color: var(--tt-mute);
	}

	.final__form {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		margin-top: 1.1rem;
		padding-bottom: 0.85rem;
		border-bottom: 1px solid var(--tt-line-strong);
		transition: border-color 0.3s ease;
	}
	.final__form:focus-within {
		border-color: var(--tt-red-bright);
	}
	:global(.final__form-icon) {
		flex: none;
		color: var(--tt-mute);
	}
	.final__input {
		flex: 1;
		min-width: 0;
		padding: 0.35rem 0;
		font: inherit;
		font-size: 1rem;
		color: var(--tt-white);
		background: none;
		border: none;
	}
	.final__input::placeholder {
		color: var(--tt-mute-2);
	}
	.final__input:focus {
		outline: none;
	}
	.final__submit {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		flex: none;
		padding: 0.4rem 0.2rem 0.4rem 0.6rem;
		font-family: var(--tt-font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--tt-red-bright);
		transition: color 0.25s ease, transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
	}
	.final__submit:hover {
		color: var(--tt-white);
		transform: translateX(3px);
	}

	.final__fine {
		margin-top: 1.2rem;
		font-size: 0.8rem;
		color: var(--tt-mute-2);
		line-height: 1.7;
	}
	.final__fb {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		color: var(--tt-fog);
		border-bottom: 1px solid transparent;
		transition: color 0.25s ease, border-color 0.25s ease;
	}
	.final__fb:hover {
		color: var(--tt-white);
		border-color: var(--tt-line-strong);
	}

	@media (min-width: 720px) {
		.final__form {
			gap: 0.9rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.final__submit,
		.final__form,
		.final__fb {
			transition: none;
		}
	}
</style>
