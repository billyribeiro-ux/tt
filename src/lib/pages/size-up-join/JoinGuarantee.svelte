<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { reveal } from '$lib/motion';
	import { guarantee } from '$lib/data/site';

	const webinarHref = 'https://tricktrades.com/size-up-webinar';
</script>

<section class="tt-section join-nt" aria-labelledby="join-nt-title">
	<div class="tt-container">
		<div class="join-nt__panel">
			<span class="join-nt__mark join-nt__mark--tl" aria-hidden="true"></span>
			<span class="join-nt__mark join-nt__mark--br" aria-hidden="true"></span>

			<div class="join-nt__grid">
				<div class="join-nt__body" data-anim {@attach reveal({ y: 30 })}>
					<div class="section-head">
						<span class="idx">02 / 02</span>
						<span class="rule"></span>
						<span class="label">The guarantee</span>
					</div>
					<h2 id="join-nt-title" class="join-nt__title">
						No trader <span class="text-red">left behind.</span>
					</h2>
					<p class="join-nt__copy">{guarantee.body[0]}</p>
				</div>

				<aside class="join-nt__aside" data-anim {@attach reveal({ y: 30, delay: 0.1 })}>
					<p class="join-nt__still label">Not ready to join?</p>
					<p class="join-nt__stillcopy">
						Start with the free training and see the strategy in action before you commit a single
						dollar.
					</p>
					<Button href={webinarHref} variant="light">Watch the free webinar</Button>
				</aside>
			</div>
		</div>
	</div>
</section>

<style>
	.join-nt__panel {
		position: relative;
		overflow: hidden;
		padding: clamp(1.9rem, 5vw, 3.6rem);
		border: 1px solid var(--tt-line-strong);
		border-radius: var(--tt-radius-lg);
		background:
			radial-gradient(120% 150% at 12% -10%, rgb(var(--tt-red-rgb) / 0.12), transparent 46%),
			var(--tt-ink);
		box-shadow: var(--tt-shadow-card);
	}
	.join-nt__mark {
		position: absolute;
		width: 15px;
		height: 15px;
		opacity: 0.55;
	}
	.join-nt__mark--tl {
		top: 16px;
		left: 16px;
		border-top: 1px solid var(--tt-line-strong);
		border-left: 1px solid var(--tt-line-strong);
	}
	.join-nt__mark--br {
		bottom: 16px;
		right: 16px;
		border-bottom: 1px solid var(--tt-line-strong);
		border-right: 1px solid var(--tt-line-strong);
	}

	.join-nt__grid {
		display: grid;
		gap: clamp(2rem, 5vw, 3.5rem);
		align-items: center;
	}
	.join-nt__title {
		margin-top: 0.4rem;
		font-size: var(--fs-h2);
		max-width: 12ch;
	}
	.join-nt__copy {
		margin-top: 1.3rem;
		max-width: 52ch;
		font-size: var(--fs-lead);
		color: var(--tt-fog);
	}

	.join-nt__aside {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 1rem;
		padding-top: 0.4rem;
	}
	.join-nt__still {
		color: var(--tt-red-bright);
	}
	.join-nt__stillcopy {
		max-width: 40ch;
		font-size: var(--fs-body);
		color: var(--tt-mute);
	}

	@media (min-width: 768px) {
		.join-nt__grid {
			grid-template-columns: 1.35fr 0.65fr;
		}
		.join-nt__aside {
			padding-left: clamp(1.5rem, 3vw, 2.5rem);
			border-left: 1px solid var(--tt-line);
		}
	}
</style>
