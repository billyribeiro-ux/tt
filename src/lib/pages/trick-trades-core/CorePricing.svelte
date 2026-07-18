<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { reveal, splitReveal } from '$lib/motion';
	import BookOpenIcon from 'phosphor-svelte/lib/BookOpenIcon';
	import CheckIcon from 'phosphor-svelte/lib/CheckIcon';
	import CheckCircleIcon from 'phosphor-svelte/lib/CheckCircleIcon';
	import { BUY_URL, packages } from './data';
</script>

<section id="pricing" class="cprice tt-section" aria-labelledby="cprice-title">
	<div class="cprice__glow" aria-hidden="true"></div>

	<div class="tt-container">
		<header class="cprice__head">
			<div class="section-head">
				<span class="idx">02 / 02</span>
				<span class="rule"></span>
				<span class="label">Pricing</span>
			</div>
			<div class="cprice__headrow">
				<h2
					id="cprice-title"
					class="cprice__title"
					data-split
					{@attach splitReveal({ stagger: 0.03 })}
				>
					Start with one. Or rewire the whole thing.
				</h2>
				<span class="cprice__badge">
					<span class="cprice__badge-dot" aria-hidden="true"></span>One-time · digital
				</span>
			</div>
		</header>

		<div class="cprice__grid" data-anim-stagger {@attach reveal({ stagger: 0.14, y: 44 })}>
			{#each packages as p, i (p.id)}
				<article class="pak" class:pak--featured={p.featured}>
					{#if p.featured}<span class="pak__ribbon">Best value</span>{/if}

					<div class="pak__top">
						<span class="pak__idx num">0{i + 1} / 0{packages.length}</span>
						<h3 class="pak__name">{p.name}</h3>
					</div>

					<p class="pak__price">
						<span class="pak__cur">$</span><span class="num pak__amt">{p.price}</span>
						<span class="pak__note">{p.note}</span>
					</p>

					<p class="pak__blurb">{p.blurb}</p>

					<div class="pak__cta">
						<Button href={BUY_URL} variant={p.featured ? 'primary' : 'ghost'} block>{p.cta}</Button>
					</div>

					<hr class="pak__rule" />

					<ul class="pak__feats">
						{#each p.feats as feat (feat)}
							<li class="pak__feat">
								<span class="pak__fico">
									{#if p.featured}
										<CheckCircleIcon weight="fill" size={17} />
									{:else}
										<CheckIcon weight="bold" size={15} />
									{/if}
								</span>
								<span class="pak__ftxt">{feat}</span>
							</li>
						{/each}
					</ul>
				</article>
			{/each}
		</div>

		<p class="cprice__guide">
			<BookOpenIcon class="cprice__guide-ico" weight="fill" size={18} />
			<span>
				Every package includes a <strong>meditation guide</strong>: setup, a breakdown of each session,
				what to expect, and how to use it.
			</span>
		</p>

		<p class="cprice__fine">
			Trick Trades Core is an educational meditation program, not medical, psychological, or
			financial advice. Individual results vary.
		</p>
	</div>
</section>

<style>
	.cprice {
		position: relative;
		background: var(--tt-ink);
		overflow: clip;
		box-shadow:
			inset 0 1px 0 var(--tt-line),
			inset 0 -1px 0 var(--tt-line);
	}
	.cprice__glow {
		position: absolute;
		z-index: 0;
		top: 16%;
		right: -6%;
		width: 46vw;
		max-width: 620px;
		aspect-ratio: 1;
		background: radial-gradient(circle, rgb(var(--tt-red-rgb) / 0.2), transparent 62%);
		filter: blur(10px);
		pointer-events: none;
	}
	.cprice .tt-container {
		position: relative;
		z-index: 1;
	}

	.cprice__head {
		margin-bottom: clamp(2.4rem, 5vw, 3.6rem);
	}
	.cprice__headrow {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: space-between;
		gap: 1.2rem;
		margin-top: 0.4rem;
	}
	.cprice__title {
		font-size: var(--fs-h2);
		max-width: 16ch;
	}
	.cprice__badge {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		padding: 0.5rem 0.9rem;
		font-family: var(--tt-font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--tt-fog);
		border: 1px solid var(--tt-line);
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.02);
	}
	.cprice__badge-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--tt-red-bright);
		box-shadow: 0 0 10px var(--tt-red-bright);
	}

	.cprice__grid {
		display: grid;
		gap: clamp(1.3rem, 3vw, 1.9rem);
	}

	.pak {
		position: relative;
		display: flex;
		flex-direction: column;
		padding: clamp(1.5rem, 3vw, 2.2rem);
		border: 1px solid var(--tt-line);
		border-radius: var(--tt-radius-lg);
		background: var(--tt-ink-2);
		box-shadow: var(--tt-shadow-card);
	}
	.pak--featured {
		z-index: 2;
		border-color: rgb(var(--tt-red-rgb) / 0.55);
		background:
			linear-gradient(180deg, rgb(var(--tt-red-rgb) / 0.1), transparent 40%), var(--tt-ink-2);
		box-shadow: var(--tt-glow-red), var(--tt-shadow-lg);
		padding-top: clamp(2.3rem, 4vw, 3rem);
	}
	.pak__ribbon {
		position: absolute;
		top: 0;
		left: 50%;
		transform: translate(-50%, -50%);
		display: inline-flex;
		align-items: center;
		padding: 0.45rem 1rem;
		font-family: var(--tt-font-mono);
		font-size: 0.66rem;
		font-weight: 700;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: #fff;
		white-space: nowrap;
		background: linear-gradient(180deg, var(--tt-red-hot), var(--tt-red) 60%, var(--tt-red-600));
		border-radius: 999px;
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.25),
			0 10px 26px -10px rgb(var(--tt-red-rgb) / 0.9);
	}

	.pak__top {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.pak__idx {
		font-size: 0.7rem;
		letter-spacing: 0.18em;
		color: var(--tt-mute);
	}
	.pak__name {
		font-size: var(--fs-h4);
		color: var(--tt-white);
	}

	.pak__price {
		display: flex;
		align-items: baseline;
		gap: 0.15rem;
		margin-top: 1.3rem;
		color: var(--tt-white);
	}
	.pak__cur {
		align-self: flex-start;
		margin-top: 0.4rem;
		font-size: 1.4rem;
		font-weight: 700;
		color: var(--tt-fog);
	}
	.pak__amt {
		font-size: clamp(2.8rem, 1.8rem + 3vw, 4rem);
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.03em;
	}
	.pak__note {
		margin-left: 0.5rem;
		font-family: var(--tt-font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.02em;
		color: var(--tt-mute);
	}
	.pak--featured .pak__note {
		color: var(--tt-gold);
	}

	.pak__blurb {
		margin-top: 1rem;
		max-width: 42ch;
		color: var(--tt-fog);
		font-size: 0.98rem;
	}
	.pak__cta {
		margin-top: 1.6rem;
	}
	.pak__rule {
		margin: 1.6rem 0 1.2rem;
		border: 0;
		height: 1px;
		background: var(--tt-line);
	}

	.pak__feats {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.72rem;
	}
	.pak__feat {
		display: flex;
		align-items: flex-start;
		gap: 0.7rem;
	}
	.pak__fico {
		display: flex;
		flex: none;
		margin-top: 0.16em;
		color: var(--tt-gold);
	}
	.pak--featured .pak__fico {
		color: var(--tt-red-bright);
	}
	.pak__ftxt {
		font-size: 0.92rem;
		line-height: 1.5;
		color: var(--tt-fog);
	}

	.cprice__guide {
		display: flex;
		align-items: flex-start;
		gap: 0.7rem;
		margin-top: clamp(2rem, 4vw, 3rem);
		padding: 1.1rem 1.3rem;
		border: 1px solid var(--tt-line);
		border-radius: var(--tt-radius);
		background: rgba(255, 255, 255, 0.02);
		font-size: 0.94rem;
		color: var(--tt-fog);
	}
	.cprice__guide strong {
		color: var(--tt-white);
	}
	:global(.cprice__guide-ico) {
		flex: none;
		margin-top: 0.15em;
		color: var(--tt-gold);
	}
	.cprice__fine {
		margin-top: 1.4rem;
		max-width: 70ch;
		font-size: 0.8rem;
		color: var(--tt-mute-2);
	}

	@media (min-width: 768px) {
		.cprice__grid {
			grid-template-columns: 1fr 1.06fr;
			align-items: center;
		}
	}
</style>
