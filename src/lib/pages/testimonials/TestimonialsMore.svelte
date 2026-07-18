<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { reveal, splitReveal } from '$lib/motion';
	import { site } from '$lib/data/site';

	const moreUrl = site.domain + '/testimonials';
</script>

<section class="t-more tt-section" aria-labelledby="t-more-title">
	<span class="t-more__glow" aria-hidden="true"></span>
	<div class="tt-container t-more__inner">
		<p class="t-more__kicker eyebrow">More member stories</p>
		<h2 id="t-more-title" class="t-more__title" data-split {@attach splitReveal({ stagger: 0.03 })}>
			These are just three of many.
		</h2>
		<p class="t-more__text prose" data-anim {@attach reveal({ y: 24 })}>
			The full wall of member stories lives on the main site. Read more of them there — then, if it
			sounds like the room you have been looking for, come see the education for yourself.
		</p>
		<div class="t-more__actions" data-anim {@attach reveal({ y: 24, delay: 0.1 })}>
			<Button href={moreUrl}>Read more testimonials</Button>
			<Button href="/#pricing" variant="ghost">Become a member</Button>
		</div>
		<p class="t-more__fine label">
			Testimonials reflect individual experiences and are not a promise of results. Most people lose
			or never make money day trading.
		</p>
	</div>
</section>

<style>
	.t-more {
		position: relative;
		overflow: clip;
		background: var(--tt-black);
		border-top: 1px solid var(--tt-line);
		text-align: center;
	}
	.t-more__glow {
		position: absolute;
		left: 50%;
		bottom: -40%;
		width: 80vw;
		height: 80vw;
		max-width: 900px;
		max-height: 900px;
		transform: translateX(-50%);
		background: radial-gradient(circle, rgb(var(--tt-red-rgb) / 0.24), transparent 60%);
		filter: blur(30px);
		pointer-events: none;
	}
	.t-more__inner {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.t-more__kicker {
		justify-content: center;
	}
	.t-more__title {
		margin-top: 1.2rem;
		font-size: var(--fs-h1);
		font-weight: 800;
		letter-spacing: -0.03em;
		color: #fff;
		max-width: 18ch;
	}
	.t-more__text {
		margin-top: 1.4rem;
		text-align: center;
	}
	.t-more__actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.9rem;
		margin-top: 2.2rem;
	}
	.t-more__fine {
		margin-top: 1.8rem;
		max-width: 56ch;
		text-transform: none;
		letter-spacing: 0.01em;
		line-height: 1.6;
		color: var(--tt-mute-2);
	}
</style>
