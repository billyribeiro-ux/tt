<script lang="ts">
	import { reveal, counter, tilt } from '$lib/motion';
	import { site, featuredOn, testimonials } from '$lib/data/site';

	const stats = [
		{ value: `${site.studentsTrained.toLocaleString('en-US')}+`, label: 'Traders trained' },
		{ value: '50+', label: 'Boot Camp lessons' },
		{ value: '10+ yrs', label: 'Proven strategy' }
	];
</script>

<section id="proof" class="proof tt-section" aria-labelledby="proof-title">
	<div class="proof__glow" aria-hidden="true"></div>

	<div class="tt-container tt-container--wide proof__inner">
		<header class="proof__head">
			<div class="proof__intro">
				<div class="section-head proof__bar" data-anim {@attach reveal({ y: 16, duration: 0.65 })}>
					<span class="idx">09 / 13</span>
					<span class="label">The proof</span>
					<span class="rule" aria-hidden="true"></span>
				</div>
				<h2
					id="proof-title"
					class="proof__title"
					data-anim
					{@attach reveal({ y: 30, duration: 0.9, delay: 0.08 })}
				>
					Join over
					<span class="proof__count text-gradient num" {@attach counter(site.studentsTrained)}
						>{site.studentsTrained.toLocaleString('en-US')}</span
					>
					students.
				</h2>
			</div>

			<dl class="proof__stats" data-anim-stagger {@attach reveal({ stagger: 0.1, y: 18 })}>
				{#each stats as stat, i (stat.label)}
					<div class="proof__stat" class:proof__stat--ruled={i > 0}>
						<dt class="num">{stat.value}</dt>
						<dd>{stat.label}</dd>
					</div>
				{/each}
			</dl>
		</header>

		<div
			class="proof__featured"
			aria-label="As featured on"
			data-anim
			{@attach reveal({ y: 20, duration: 0.8 })}
		>
			<span class="label proof__featured-tag">As featured on</span>
			<ul class="proof__logos">
				{#each featuredOn as name (name)}
					<li class="proof__logo">{name}</li>
				{/each}
			</ul>
		</div>

		<ul class="proof__grid" data-anim-stagger {@attach reveal({ stagger: 0.12, y: 46 })}>
			{#each testimonials as t, i (t.name)}
				<li class="proof__cell" class:proof__cell--featured={i === 0}>
					<figure class="proof__card" {@attach tilt(5)}>
						<span class="proof__mark" aria-hidden="true">&ldquo;</span>
						<blockquote class="proof__quote">{t.quote}</blockquote>
						<hr class="hairline proof__card-rule" />
						<figcaption class="proof__cite">
							<span class="proof__name">{t.name}</span>
							<span class="proof__role">{t.role}</span>
						</figcaption>
					</figure>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.proof {
		position: relative;
		overflow: clip;
		background: var(--tt-black);
		border-top: 1px solid var(--tt-line);
	}
	.proof__glow {
		position: absolute;
		bottom: -20%;
		left: -14%;
		width: 55vw;
		height: 55vw;
		max-width: 720px;
		max-height: 720px;
		z-index: 0;
		pointer-events: none;
		background: radial-gradient(circle, rgba(178, 39, 37, 0.18), transparent 64%);
		filter: blur(26px);
	}
	.proof__inner {
		position: relative;
		z-index: 1;
	}

	/* --- Header + stat band --- */
	.proof__head {
		display: grid;
		gap: clamp(2rem, 5vw, 3.5rem);
		align-items: end;
		padding-bottom: clamp(2.4rem, 5vw, 4rem);
		border-bottom: 1px solid var(--tt-line);
	}
	.proof__bar {
		margin-bottom: 1.3rem;
	}
	.proof__title {
		font-size: var(--fs-h2);
		line-height: 1;
		letter-spacing: -0.03em;
		text-wrap: balance;
	}
	.proof__count {
		font-weight: 800;
		font-size: 1.12em;
		letter-spacing: -0.04em;
		padding-inline: 0.06em;
	}

	.proof__stats {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1.4rem;
		margin: 0;
	}
	.proof__stat--ruled {
		padding-left: 1.4rem;
		border-left: 1px solid var(--tt-line-strong);
	}
	.proof__stat dt {
		font-size: clamp(1.6rem, 1rem + 2.2vw, 2.4rem);
		font-weight: 700;
		color: var(--tt-white);
		line-height: 1;
	}
	.proof__stat dd {
		margin-top: 0.4rem;
		font-family: var(--tt-font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--tt-mute);
	}

	/* --- Static "as featured on" row --- */
	.proof__featured {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1rem 1.8rem;
		margin-top: clamp(2rem, 4vw, 3rem);
		padding: clamp(1.1rem, 2.5vw, 1.6rem) 0;
		border-bottom: 1px solid var(--tt-line);
	}
	.proof__featured-tag {
		flex: none;
		color: var(--tt-mute-2);
	}
	.proof__logos {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.9rem 1.7rem;
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.proof__logo {
		position: relative;
		font-family: var(--tt-font-display);
		font-size: clamp(1rem, 0.9rem + 0.6vw, 1.35rem);
		letter-spacing: 0.08em;
		color: var(--tt-fog);
		white-space: nowrap;
	}
	.proof__logo + .proof__logo::before {
		content: '';
		position: absolute;
		left: calc(-0.85rem);
		top: 50%;
		width: 1px;
		height: 1.1em;
		background: var(--tt-line-strong);
		transform: translateY(-50%);
	}

	/* --- Testimonial grid --- */
	.proof__grid {
		list-style: none;
		padding: 0;
		margin: clamp(2.6rem, 5vw, 4rem) 0 0;
		display: grid;
		gap: clamp(1rem, 2vw, 1.5rem);
	}
	.proof__cell {
		display: flex;
	}
	.proof__card {
		position: relative;
		display: flex;
		flex-direction: column;
		width: 100%;
		margin: 0;
		padding: clamp(1.8rem, 3vw, 2.6rem);
		background: var(--tt-ink-2);
		border: 1px solid var(--tt-line);
		border-radius: var(--tt-radius-lg);
		box-shadow: var(--tt-shadow-card);
		overflow: hidden;
		/* No `transform` here — tilt() drives transform per-frame via GSAP; a CSS
		   transition on the same property would fight every write. */
		transition: border-color 0.4s ease;
	}
	.proof__card:hover {
		border-color: var(--tt-line-strong);
	}
	.proof__mark {
		font-family: var(--tt-font-body);
		font-weight: 800;
		font-size: clamp(4rem, 3rem + 4vw, 7rem);
		line-height: 0.7;
		color: var(--tt-red);
		opacity: 0.28;
	}
	.proof__quote {
		margin: 0.2rem 0 0;
		font-size: var(--fs-lead);
		line-height: 1.55;
		color: var(--tt-fog);
		text-wrap: pretty;
	}
	.proof__card-rule {
		margin: clamp(1.4rem, 3vw, 2rem) 0 1.1rem;
	}
	.proof__cite {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	.proof__name {
		font-weight: 700;
		color: var(--tt-white);
	}
	.proof__role {
		font-family: var(--tt-font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--tt-red-bright);
	}

	@media (min-width: 720px) {
		.proof__head {
			grid-template-columns: 1.5fr 1fr;
		}
	}
	@media (min-width: 940px) {
		.proof__grid {
			grid-template-columns: 1.35fr 1fr;
			grid-template-rows: 1fr 1fr;
		}
		.proof__cell--featured {
			grid-row: 1 / span 2;
		}
		.proof__cell--featured .proof__quote {
			font-size: var(--fs-h4);
			line-height: 1.4;
			color: var(--tt-white);
		}
		.proof__cell--featured .proof__mark {
			color: var(--tt-red-bright);
			opacity: 0.32;
		}
	}
</style>
