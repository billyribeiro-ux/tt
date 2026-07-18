<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { membership } from '$lib/data/site';
	import { reveal, splitReveal } from '$lib/motion';
	import GraduationCapIcon from 'phosphor-svelte/lib/GraduationCapIcon';
	import UsersThreeIcon from 'phosphor-svelte/lib/UsersThreeIcon';
	import BroadcastIcon from 'phosphor-svelte/lib/BroadcastIcon';
	import MoonStarsIcon from 'phosphor-svelte/lib/MoonStarsIcon';
	import AlarmIcon from 'phosphor-svelte/lib/AlarmIcon';
	import ChatsCircleIcon from 'phosphor-svelte/lib/ChatsCircleIcon';

	const icons: Record<string, typeof GraduationCapIcon> = {
		GraduationCap: GraduationCapIcon,
		UsersThree: UsersThreeIcon,
		Broadcast: BroadcastIcon,
		MoonStars: MoonStarsIcon,
		Alarm: AlarmIcon,
		ChatsCircle: ChatsCircleIcon
	};
</script>

<section id="mentorship" class="tt-section mem" aria-labelledby="mem-title">
	<span class="mem__glow" aria-hidden="true"></span>

	<div class="tt-container mem__inner">
		<header class="mem__head">
			<div class="mem__headline">
				<p class="label mem__kicker">
					<span class="mem__idxlead">01 / 06</span>The membership
				</p>
				<h2 id="mem-title" class="mem__title" data-split {@attach splitReveal({ stagger: 0.026 })}>
					Guidance &amp; mentorship that gets <span class="text-red">results.</span>
				</h2>
				<p class="mem__strike">(not a chaotic free-for-all Discord room)</p>
			</div>
			<div class="mem__aside">
				<p class="mem__note">
					No alerts. No noise. A trained room that answers — and a coach who teaches live, on mic,
					every session.
				</p>
				<Button href="#pricing">See membership plans</Button>
			</div>
		</header>

		<ul class="mem__grid" data-anim-stagger {@attach reveal({ stagger: 0.08, y: 30 })}>
			{#each membership as m, i (m.title)}
				{@const Icon = icons[m.icon]}
				<li class="mem__item" class:mem__item--feat={i === 0}>
					<div class="mem__top">
						<span class="mem__idx num">{String(i + 1).padStart(2, '0')}</span>
						<span class="mem__ico" aria-hidden="true">
							<Icon size={i === 0 ? 34 : 24} weight="light" />
						</span>
					</div>
					<h3 class="mem__itemtitle">{m.title}</h3>
					<p class="mem__body">{m.body}</p>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.mem {
		position: relative;
		background: var(--tt-ink);
		border-top: 1px solid var(--tt-line);
		border-bottom: 1px solid var(--tt-line);
		overflow: clip;
	}
	.mem__glow {
		position: absolute;
		top: -8%;
		right: -6%;
		width: 48vw;
		height: 48vw;
		max-width: 640px;
		max-height: 640px;
		z-index: 0;
		pointer-events: none;
		background: radial-gradient(circle, rgba(178, 39, 37, 0.16), transparent 62%);
		filter: blur(24px);
	}
	.mem__inner {
		position: relative;
		z-index: 1;
	}

	/* ---- Header: asymmetric, headline left / brief + CTA right ---- */
	.mem__head {
		display: grid;
		gap: clamp(1.8rem, 4vw, 3rem);
		align-items: end;
		margin-bottom: clamp(2.4rem, 5vw, 4rem);
	}
	.mem__kicker {
		display: inline-flex;
		align-items: center;
		gap: 0.7rem;
		margin-bottom: 1.3rem;
		color: var(--tt-mute);
	}
	.mem__idxlead {
		color: var(--tt-red-bright);
		letter-spacing: 0.1em;
	}
	.mem__title {
		max-width: 15ch;
		font-size: var(--fs-h2);
		line-height: 1.02;
		color: var(--tt-white);
	}
	.mem__strike {
		margin-top: 1rem;
		font-size: var(--fs-lead);
		color: var(--tt-mute);
		text-decoration: line-through;
		text-decoration-color: var(--tt-red);
		text-underline-offset: 2px;
	}
	.mem__aside {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 1.5rem;
	}
	.mem__note {
		max-width: 42ch;
		font-size: var(--fs-body);
		color: var(--tt-fog);
	}

	/* ---- Feature grid: rules, not cards. First feature spans wide. ---- */
	.mem__grid {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: 1fr;
	}
	.mem__item {
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
		padding: clamp(1.5rem, 3vw, 2.1rem) 0;
		border-top: 1px solid var(--tt-line);
	}
	.mem__item:last-child {
		border-bottom: 1px solid var(--tt-line);
	}
	.mem__top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}
	.mem__idx {
		font-size: 0.78rem;
		letter-spacing: 0.08em;
		color: var(--tt-red-bright);
	}
	.mem__ico {
		display: inline-flex;
		color: var(--tt-fog);
	}
	.mem__itemtitle {
		font-size: var(--fs-h4);
		font-weight: 700;
		line-height: 1.15;
		color: var(--tt-white);
	}
	.mem__body {
		max-width: 46ch;
		font-size: 0.96rem;
		color: var(--tt-mute);
	}

	/* Featured (first) feature — wider, warmer, horizontal */
	.mem__item--feat {
		position: relative;
		gap: 1.1rem;
		padding-left: clamp(1rem, 2vw, 1.6rem);
	}
	.mem__item--feat::before {
		content: '';
		position: absolute;
		left: 0;
		top: clamp(1.5rem, 3vw, 2.1rem);
		bottom: clamp(1.5rem, 3vw, 2.1rem);
		width: 2px;
		background: var(--tt-red);
	}
	.mem__item--feat .mem__ico {
		color: var(--tt-red-bright);
	}
	.mem__item--feat .mem__itemtitle {
		font-size: var(--fs-h3);
	}
	.mem__item--feat .mem__body {
		max-width: 60ch;
		font-size: var(--fs-lead);
		color: var(--tt-fog);
	}

	@media (min-width: 620px) {
		.mem__grid {
			grid-template-columns: repeat(6, 1fr);
			column-gap: clamp(1.5rem, 3vw, 2.5rem);
		}
		.mem__item {
			padding: clamp(1.8rem, 2.6vw, 2.4rem) 0;
		}
		.mem__item:last-child {
			border-bottom: 0;
		}
		/* 1 wide / 2 medium / 3 narrow — a genuinely varied rhythm */
		.mem__item:nth-child(1) {
			grid-column: span 6;
		}
		.mem__item:nth-child(2),
		.mem__item:nth-child(3) {
			grid-column: span 3;
		}
		.mem__item:nth-child(4),
		.mem__item:nth-child(5),
		.mem__item:nth-child(6) {
			grid-column: span 2;
		}
		/* Vertical hairlines between items that share a row */
		.mem__item:nth-child(3),
		.mem__item:nth-child(5),
		.mem__item:nth-child(6) {
			border-left: 1px solid var(--tt-line);
			padding-left: clamp(1.5rem, 3vw, 2.5rem);
		}
	}

	@media (min-width: 620px) {
		.mem__item--feat {
			display: grid;
			grid-template-columns: minmax(140px, 220px) 1fr;
			gap: 0.6rem clamp(2rem, 4vw, 3.5rem);
			align-items: start;
			padding-left: clamp(1.2rem, 2vw, 1.6rem);
		}
		.mem__item--feat .mem__top {
			grid-column: 1;
			grid-row: 1 / span 2;
			flex-direction: column;
			align-items: flex-start;
			justify-content: flex-start;
			gap: 1.4rem;
		}
		.mem__item--feat .mem__idx {
			font-size: 0.9rem;
		}
		.mem__item--feat .mem__itemtitle {
			grid-column: 2;
			grid-row: 1;
			max-width: 18ch;
		}
		.mem__item--feat .mem__body {
			grid-column: 2;
			grid-row: 2;
		}
	}

	@media (min-width: 900px) {
		.mem__head {
			grid-template-columns: 1.2fr 0.8fr;
		}
	}
</style>
