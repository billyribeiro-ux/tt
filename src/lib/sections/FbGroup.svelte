<script lang="ts">
	import FacebookLogoIcon from 'phosphor-svelte/lib/FacebookLogoIcon';
	import LockSimpleIcon from 'phosphor-svelte/lib/LockSimpleIcon';
	import UsersThreeIcon from 'phosphor-svelte/lib/UsersThreeIcon';
	import Button from '$lib/components/Button.svelte';
	import { reveal } from '$lib/motion';
	import { site } from '$lib/data/site';
</script>

<section class="fbg" aria-labelledby="fbg-title">
	<div class="tt-container fbg__inner">
		<div class="fbg__card" data-anim {@attach reveal({ x: -32, duration: 0.95 })}>
			<a href={site.social.facebookGroup} class="fbg__shot" aria-label="TrickTrades Daytrader's War Room private Facebook group">
				<picture>
					<source
						type="image/avif"
						srcset="/fb-group-720.avif 720w, /fb-group-1536.avif 1536w"
						sizes="(min-width: 768px) 42vw, 92vw"
					/>
					<source
						type="image/webp"
						srcset="/fb-group-720.webp 720w, /fb-group-1536.webp 1536w"
						sizes="(min-width: 768px) 42vw, 92vw"
					/>
					<img
						src="/fb-group-1536.jpg"
						alt="The TrickTrades Daytrader's War Room private Facebook group, 2.5K members"
						width="1536"
						height="779"
						loading="lazy"
						decoding="async"
					/>
				</picture>
			</a>
			<dl class="fbg__meta">
				<div class="fbg__meta-item">
					<dt class="sr-only">Privacy</dt>
					<dd><LockSimpleIcon size={14} aria-hidden="true" /> Private group</dd>
				</div>
				<div class="fbg__meta-item fbg__meta-item--ruled">
					<dt class="sr-only">Members</dt>
					<dd><UsersThreeIcon size={14} aria-hidden="true" /> 2.5K members</dd>
				</div>
				<div class="fbg__meta-item fbg__meta-item--ruled">
					<dt class="sr-only">Platform</dt>
					<dd><FacebookLogoIcon size={14} weight="fill" aria-hidden="true" /> Facebook</dd>
				</div>
			</dl>
		</div>

		<div class="fbg__copy" data-anim-stagger {@attach reveal({ stagger: 0.1, y: 24 })}>
			<h2 class="fbg__title" id="fbg-title">
				Join our FREE <span class="text-red">private</span> FB group
			</h2>
			<p class="fbg__body">
				This is where I post my daily recaps, share strategies, and post dedicated content
				strictly for group members. You can engage with each other and learn how to implement the
				TT strategy! Click the "Join" button and send in a request to join today!
			</p>
			<div class="fbg__cta">
				<Button href={site.social.facebookGroup}>Join the private Facebook group</Button>
			</div>
		</div>
	</div>
</section>

<style>
	.fbg {
		position: relative;
		padding-block: clamp(3.5rem, 2.5rem + 5vw, 6.5rem);
		border-top: 1px solid var(--tt-line);
		background:
			radial-gradient(90% 120% at 8% 50%, rgb(var(--tt-red-rgb) / 0.09), transparent 55%),
			var(--tt-ink);
	}
	.fbg__inner {
		display: grid;
		gap: clamp(2rem, 5vw, 4rem);
		align-items: center;
	}

	/* The real group screenshot, framed like a monitor on the war-room wall */
	.fbg__card {
		position: relative;
		padding: clamp(0.7rem, 1.6vw, 1rem);
		border: 1px solid var(--tt-line-strong);
		border-radius: var(--tt-radius);
		background: linear-gradient(160deg, var(--tt-ink-2), var(--tt-black));
		box-shadow: var(--tt-shadow-card);
		overflow: hidden;
	}
	.fbg__shot {
		display: block;
		border-radius: calc(var(--tt-radius) - 6px);
		overflow: hidden;
		border: 1px solid var(--tt-line);
	}
	.fbg__shot img {
		width: 100%;
		height: auto;
		display: block;
		transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
	}
	.fbg__shot:hover img {
		transform: scale(1.025);
	}
	.fbg__meta {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 1rem;
		margin: 0.9rem 0 0.2rem;
		padding-inline: 0.3rem;
	}
	.fbg__meta-item dd {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		margin: 0;
		font-family: var(--tt-font-mono);
		font-size: 0.74rem;
		letter-spacing: 0.06em;
		color: var(--tt-mute);
	}
	.fbg__meta-item--ruled {
		padding-left: 1rem;
		border-left: 1px solid var(--tt-line);
	}
	.fbg__title {
		font-size: var(--fs-h2);
		letter-spacing: -0.02em;
		max-width: 14ch;
	}
	.fbg__body {
		margin-top: 1.1rem;
		max-width: 52ch;
		color: var(--tt-fog);
	}
	.fbg__cta {
		margin-top: 1.8rem;
	}

	@media (min-width: 768px) {
		.fbg__inner {
			grid-template-columns: 0.9fr 1.1fr;
		}
	}
</style>
