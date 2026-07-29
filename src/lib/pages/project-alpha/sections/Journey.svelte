<script lang="ts">
	import { onMount } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import { phases } from '$lib/pages/project-alpha/data/content';
	import { ensureGsap, ScrollTrigger } from '$lib/pages/project-alpha/motion/gsap-setup';
	import { ui } from '$lib/pages/project-alpha/state/ui.svelte';
	import CheckIcon from 'phosphor-svelte/lib/CheckIcon';

	let root: HTMLElement | undefined;
	let active = $state(0);

	const captureRoot: Attachment<HTMLElement> = (node) => {
		root = node;
		return () => {
			if (root === node) root = undefined;
		};
	};

	onMount(() => {
		if (!root || ui.reducedMotion) return;
		const gsap = ensureGsap();
		const ctx = gsap.context(() => {
			const cards = gsap.utils.toArray<HTMLElement>('.phase-card');
			cards.forEach((card, i) => {
				ScrollTrigger.create({
					trigger: card,
					start: 'top 70%',
					end: 'bottom 40%',
					onEnter: () => (active = i),
					onEnterBack: () => (active = i)
				});
				gsap.from(card, {
					scrollTrigger: {
						trigger: card,
						start: 'top 85%',
						toggleActions: 'play none none none',
						once: true
					},
					x: i % 2 === 0 ? -36 : 36,
					opacity: 0,
					duration: 0.85,
					ease: 'power3.out',
					immediateRender: false
				});
			});

			gsap.from('.phase-rail-fill', {
				scrollTrigger: {
					trigger: '.phases',
					start: 'top 60%',
					end: 'bottom 40%',
					scrub: 0.6
				},
				scaleY: 0,
				transformOrigin: 'top center',
				ease: 'none'
			});
		}, root);
		return () => ctx.revert();
	});
</script>

<section
	id="journey"
	class="section-shell"
	data-chapter="04"
	{@attach captureRoot}
	aria-labelledby="journey-title"
>
	<div class="reveal">
		<p class="section-label">90-day structure</p>
		<h2 id="journey-title" class="section-title">The journey</h2>
		<p class="section-desc">
			Four distinct phases, each building on the last. Walk before you run, then prove the pattern.
		</p>
	</div>

	<div class="phases">
		<div class="phase-rail" aria-hidden="true">
			<div class="phase-rail-fill"></div>
		</div>

		{#each phases as phase, i (phase.id)}
			<article class="phase-card" class:is-active={active === i} style:--phase={phase.color}>
				<div class="dot-col" aria-hidden="true">
					<span class="dot"></span>
				</div>
				<div class="phase-content card-surface">
					<p class="tag">{phase.tag}</p>
					<h3>{phase.title}</h3>
					<p class="body">{phase.body}</p>
					<ul>
						{#each phase.bullets as bullet (bullet)}
							<li>
								<span class="check"><CheckIcon size={12} weight="bold" /></span>
								{bullet}
							</li>
						{/each}
					</ul>
				</div>
			</article>
		{/each}
	</div>
</section>

<style>
	.phases {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding-left: 0.25rem;
	}

	.phase-rail {
		position: absolute;
		left: 23px;
		top: 12px;
		bottom: 12px;
		width: 2px;
		background: var(--alpha-border);
		border-radius: 2px;
		overflow: hidden;
	}

	.phase-rail-fill {
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, #980000, #3b8beb, #2bbfa0, #d4a853);
		transform-origin: top center;
	}

	.phase-card {
		display: grid;
		grid-template-columns: 50px 1fr;
		gap: 1.25rem;
		padding: 1.1rem 0;
	}

	.dot-col {
		display: flex;
		justify-content: center;
		padding-top: 1.6rem;
		z-index: 1;
	}

	.dot {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: var(--phase);
		border: 3px solid var(--alpha-bg);
		box-shadow: 0 0 0 0 color-mix(in srgb, var(--phase) 35%, transparent);
		transition:
			box-shadow 0.4s ease,
			transform 0.4s ease;
	}

	.phase-card.is-active .dot {
		transform: scale(1.15);
		box-shadow: 0 0 0 6px color-mix(in srgb, var(--phase) 18%, transparent);
	}

	.phase-content {
		padding: 1.75rem 1.6rem;
		border-radius: 14px;
	}

	.phase-card.is-active .phase-content {
		border-color: color-mix(in srgb, var(--phase) 35%, var(--alpha-border));
		box-shadow: 0 16px 48px -30px color-mix(in srgb, var(--phase) 50%, transparent);
	}

	.tag {
		margin: 0 0 0.35rem;
		font-size: 0.65rem;
		font-weight: 600;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--phase);
	}

	h3 {
		margin: 0 0 0.7rem;
		font-family: var(--font-display);
		font-size: 1.35rem;
		font-weight: 600;
	}

	.body {
		margin: 0 0 1rem;
		font-size: 0.92rem;
		color: var(--alpha-muted);
		line-height: 1.7;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.45rem;
	}

	li {
		display: flex;
		gap: 0.55rem;
		align-items: flex-start;
		font-size: 0.88rem;
		color: var(--alpha-muted);
		line-height: 1.55;
	}

	.check {
		flex-shrink: 0;
		margin-top: 0.15rem;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		display: grid;
		place-items: center;
		background: color-mix(in srgb, var(--phase) 16%, transparent);
		color: var(--phase);
	}

	@media (min-width: 860px) {
		.phases {
			gap: 2.25rem;
			padding-left: 0;
		}

		.phase-rail {
			left: 50%;
			transform: translateX(-50%);
		}

		.phase-card {
			grid-template-columns: minmax(0, 1fr) 72px minmax(0, 1fr);
			gap: 0;
			padding: 0;
		}

		.phase-card .dot-col {
			grid-column: 2;
			grid-row: 1;
			padding-top: 2.15rem;
		}

		.phase-card .phase-content {
			grid-row: 1;
			padding: 2rem 2.1rem;
		}

		.phase-card:nth-of-type(odd) .phase-content {
			grid-column: 1;
		}

		.phase-card:nth-of-type(even) .phase-content {
			grid-column: 3;
		}
	}
</style>
