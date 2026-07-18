<script lang="ts">
	import { reveal } from '$lib/motion';
	import { testimonials } from '$lib/data/site';

	const total = String(testimonials.length).padStart(2, '0');
</script>

<section class="t-wall tt-section" aria-labelledby="t-wall-title">
	<span class="t-wall__glow" aria-hidden="true"></span>
	<div class="tt-container tt-container--wide">
		<header class="section-head">
			<span class="idx">01 / 02</span>
			<span class="rule"></span>
			<span class="label">Member voices</span>
		</header>

		<h2 id="t-wall-title" class="t-wall__title">
			Three traders, in their <span class="text-red">own</span> words.
		</h2>

		<ol class="t-wall__list">
			{#each testimonials as t, i (t.name)}
				<li class="t-wall__row" data-anim {@attach reveal({ y: 46, duration: 1 })}>
					<div class="t-wall__meta">
						<span class="t-wall__idx num">{String(i + 1).padStart(2, '0')} / {total}</span>
						<div class="t-wall__cite">
							<span class="t-wall__name">{t.name}</span>
							<span class="t-wall__role">{t.role}</span>
						</div>
					</div>
					<figure class="t-wall__figure">
						<span class="t-wall__mark" aria-hidden="true">&ldquo;</span>
						<blockquote class="t-wall__quote">{t.quote}</blockquote>
					</figure>
				</li>
			{/each}
		</ol>
	</div>
</section>

<style>
	.t-wall {
		position: relative;
		overflow: clip;
		background: var(--tt-black);
		border-top: 1px solid var(--tt-line);
	}
	.t-wall__glow {
		position: absolute;
		right: -14%;
		top: 8%;
		width: 54vw;
		height: 54vw;
		max-width: 700px;
		max-height: 700px;
		background: radial-gradient(circle, rgb(var(--tt-red-rgb) / 0.16), transparent 64%);
		filter: blur(26px);
		pointer-events: none;
	}
	.t-wall .tt-container {
		position: relative;
		z-index: 1;
	}
	.t-wall__title {
		font-size: var(--fs-h2);
		font-weight: 800;
		letter-spacing: -0.02em;
		color: #fff;
		max-width: 18ch;
		margin-bottom: clamp(2.4rem, 5vw, 4rem);
	}
	.t-wall__list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0;
	}
	.t-wall__row {
		display: grid;
		gap: 1.4rem;
		padding: clamp(2rem, 4vw, 3.2rem) 0;
		border-top: 1px solid var(--tt-line);
	}
	.t-wall__row:last-child {
		border-bottom: 1px solid var(--tt-line);
	}
	.t-wall__meta {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.t-wall__idx {
		font-size: 0.78rem;
		letter-spacing: 0.06em;
		color: var(--tt-red-bright);
	}
	.t-wall__cite {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}
	.t-wall__name {
		font-size: var(--fs-h4);
		font-weight: 700;
		color: #fff;
		letter-spacing: -0.01em;
		line-height: 1.1;
	}
	.t-wall__role {
		font-family: var(--tt-font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--tt-mute);
	}
	.t-wall__figure {
		position: relative;
		margin: 0;
		padding-left: clamp(2.4rem, 5vw, 4.5rem);
	}
	.t-wall__mark {
		position: absolute;
		left: -0.1rem;
		top: -0.35em;
		font-family: var(--tt-font-body);
		font-weight: 800;
		font-size: clamp(4rem, 3rem + 5vw, 8rem);
		line-height: 0.7;
		color: var(--tt-red);
		opacity: 0.26;
		pointer-events: none;
	}
	.t-wall__quote {
		margin: 0;
		font-size: var(--fs-h4);
		line-height: 1.5;
		color: var(--tt-fog);
		text-wrap: pretty;
		max-width: 62ch;
	}

	@media (min-width: 860px) {
		.t-wall__row {
			grid-template-columns: 0.42fr 1fr;
			gap: clamp(2rem, 4vw, 4rem);
			align-items: start;
		}
		.t-wall__row:nth-child(even) .t-wall__quote {
			color: #fff;
		}
	}
</style>
