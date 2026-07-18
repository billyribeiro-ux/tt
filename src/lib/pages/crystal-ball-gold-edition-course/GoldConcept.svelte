<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { reveal, splitReveal } from '$lib/motion';
	import WaveTriangleIcon from 'phosphor-svelte/lib/WaveTriangleIcon';
	import BroadcastIcon from 'phosphor-svelte/lib/BroadcastIcon';

	const courseUrl = 'https://tricktrades.com/crystal-ball-gold-edition-course';

	// The two facts the catalogue states about this tier, described and not embellished.
	const pillars = [
		{
			n: '01',
			Icon: WaveTriangleIcon,
			title: 'Natural-movement theory',
			body: 'The idea at the centre of the Gold Edition. Pat’s advanced read on how price moves and where it wants to go next.'
		},
		{
			n: '02',
			Icon: BroadcastIcon,
			title: 'Taught live',
			body: 'Not a pre-recorded library. The theory is taught in real time across nine months of live trades, as the setups actually form.'
		}
	];
</script>

<section class="gd-concept" aria-labelledby="gd-concept-title">
	<div class="tt-container">
		<div class="section-head gd-concept__head">
			<span class="idx gd-concept__idx">◆ The tier</span>
			<span class="rule gd-concept__rule"></span>
			<span class="label gd-concept__count">Gold Edition</span>
		</div>

		<h2
			id="gd-concept-title"
			class="gd-concept__title"
			data-split
			{@attach splitReveal({ stagger: 0.03 })}
		>
			Where the series is taught <span class="gd-concept__accent">live.</span>
		</h2>

		<div class="gd-concept__grid" data-anim-stagger {@attach reveal({ stagger: 0.12, y: 36 })}>
			{#each pillars as p (p.n)}
				{@const Icon = p.Icon}
				<article class="gd-concept__panel">
					<div class="gd-concept__panel-top">
						<span class="gd-concept__panel-idx num">{p.n}</span>
						<span class="gd-concept__panel-icon"><Icon size={24} weight="regular" /></span>
					</div>
					<h3 class="gd-concept__panel-name">{p.title}</h3>
					<p class="gd-concept__panel-body">{p.body}</p>
				</article>
			{/each}
		</div>

		<div class="gd-concept__note" data-anim {@attach reveal({ y: 24 })}>
			<p class="gd-concept__note-text">
				The Gold Edition is enrolled directly through Trick Trades. The full curriculum, live
				schedule and pricing are on the course page.
			</p>
			<Button href={courseUrl} variant="ghost" size="md">See full details on tricktrades.com</Button
			>
		</div>
	</div>
</section>

<style>
	.gd-concept {
		position: relative;
		padding-block: clamp(4.5rem, 3rem + 8vw, 9rem);
		background: var(--tt-ink);
		box-shadow:
			inset 0 1px 0 var(--tt-line),
			inset 0 -1px 0 var(--tt-line);
	}
	.gd-concept__idx {
		color: var(--tt-gold);
	}
	.gd-concept__rule {
		background: linear-gradient(90deg, rgba(245, 196, 81, 0.4), transparent);
	}
	.gd-concept__count {
		flex: none;
		color: var(--tt-mute-2);
	}
	.gd-concept__title {
		max-width: 18ch;
		margin-bottom: clamp(2.5rem, 5vw, 4rem);
		font-size: var(--fs-h2);
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.025em;
		color: #fff;
	}
	.gd-concept__accent {
		color: var(--tt-gold);
	}

	.gd-concept__grid {
		display: grid;
		gap: clamp(1.1rem, 2.5vw, 1.6rem);
	}
	.gd-concept__panel {
		padding: clamp(1.8rem, 4vw, 2.8rem);
		border: 1px solid rgba(245, 196, 81, 0.22);
		border-radius: var(--tt-radius-lg);
		background: linear-gradient(180deg, rgba(245, 196, 81, 0.05), transparent 55%);
	}
	.gd-concept__panel-top {
		display: flex;
		align-items: center;
		gap: 0.9rem;
		margin-bottom: 1.3rem;
	}
	.gd-concept__panel-idx {
		font-size: clamp(1.4rem, 1rem + 1.5vw, 2rem);
		font-weight: 800;
		line-height: 1;
		color: var(--tt-gold);
	}
	.gd-concept__panel-icon {
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border-radius: 11px;
		color: var(--tt-gold);
		border: 1px solid rgba(245, 196, 81, 0.4);
		background: rgba(245, 196, 81, 0.06);
	}
	.gd-concept__panel-name {
		font-size: var(--fs-h3);
		font-weight: 800;
		letter-spacing: -0.02em;
		color: #fff;
	}
	.gd-concept__panel-body {
		margin-top: 0.9rem;
		max-width: 46ch;
		font-size: var(--fs-body);
		color: var(--tt-fog);
	}

	.gd-concept__note {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 1.4rem 2rem;
		margin-top: clamp(2rem, 4vw, 3rem);
		padding-top: clamp(1.8rem, 4vw, 2.4rem);
		border-top: 1px solid var(--tt-line);
	}
	.gd-concept__note-text {
		max-width: 52ch;
		color: var(--tt-mute);
		font-size: 0.95rem;
	}

	@media (min-width: 768px) {
		.gd-concept__grid {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
