<script lang="ts">
	import { site } from '$lib/data/site';
	import { reveal, splitReveal, parallax, counter } from '$lib/motion';

	const fmt = (v: number) => Math.round(v).toLocaleString('en-US');
</script>

<section class="tt-section bio" aria-labelledby="bio-lead">
	<div class="bio__atmos" aria-hidden="true">
		<span class="bio__warm" {@attach parallax(70)}></span>
	</div>

	<div class="tt-container bio__inner">
		<figure
			class="bio__portrait"
			data-anim
			{@attach reveal({ y: 54, scale: 0.98, duration: 1.15 })}
		>
			<span class="bio__accent" aria-hidden="true"></span>
			<div class="bio__frame">
				<img
					class="bio__img"
					src={site.videoPoster}
					width="1200"
					height="800"
					alt="Pat &lsquo;Trick&rsquo; Mitchell"
					loading="lazy"
					decoding="async"
				/>
				<span class="bio__reg bio__reg--tl" aria-hidden="true"></span>
				<span class="bio__reg bio__reg--tr" aria-hidden="true"></span>
				<span class="bio__reg bio__reg--bl" aria-hidden="true"></span>
				<span class="bio__reg bio__reg--br" aria-hidden="true"></span>
				<span class="bio__tag num" aria-hidden="true">Fig. 01</span>
			</div>
			<figcaption class="bio__cap label">Professional Trader &amp; Coach</figcaption>
		</figure>

		<div class="bio__col">
			<p class="bio__kicker label" data-anim {@attach reveal({ y: 18 })}>
				<span class="bio__dot" aria-hidden="true"></span>Meet your coach
			</p>

			<figure class="bio__statement">
				<blockquote class="bio__quote">
					<span class="bio__mark" aria-hidden="true">&ldquo;</span>
					<h2 id="bio-lead" class="bio__lead" data-split {@attach splitReveal({ stagger: 0.03 })}>
						There is a path — because I&rsquo;ve walked it.
					</h2>
					<div class="bio__body" data-anim-stagger {@attach reveal({ stagger: 0.12, y: 24 })}>
						<p>
							I&rsquo;ve trained over 30,000 traders, just like you, who know there&rsquo;s a better
							life calling to them.
						</p>
						<p>
							I&rsquo;ve bled, I&rsquo;ve given everything to get where I am — and I can take you by
							the hand, guide each step, and get you through the doubt, the mistakes, the blow ups. I
							broke through every barrier, and now I&rsquo;m living the life of my dreams.
						</p>
						<p class="bio__closer">
							There&rsquo;s only one thing missing from this picture:
							<span class="text-red">you</span>.
						</p>
					</div>
				</blockquote>

				<figcaption class="bio__sign" data-anim {@attach reveal({ y: 20 })}>
					<span class="bio__sig script">Pat &ldquo;Trick&rdquo; Mitchell</span>
					<span class="bio__signrule" aria-hidden="true"></span>
					<span class="bio__signmeta label">Trick Trades</span>
				</figcaption>
			</figure>

			<dl class="bio__stats" data-anim-stagger {@attach reveal({ stagger: 0.14, y: 22 })}>
				<div class="bio__stat">
					<dt class="num">
						<span {@attach counter(site.studentsTrained, fmt)}>{fmt(site.studentsTrained)}</span>+
					</dt>
					<dd>Traders trained</dd>
				</div>
				<span class="bio__statsep" aria-hidden="true"></span>
				<div class="bio__stat">
					<dt class="num"><span {@attach counter(10)}>10</span>+ yrs</dt>
					<dd>Proven strategy</dd>
				</div>
			</dl>
		</div>
	</div>
</section>

<style>
	.bio {
		position: relative;
		background: var(--tt-black);
		overflow: clip;
	}

	/* Warm, low vignette — a lamp on a 4am desk */
	.bio__atmos {
		position: absolute;
		inset: 0;
		z-index: 0;
		pointer-events: none;
		background:
			radial-gradient(58% 50% at 22% 26%, rgba(230, 161, 47, 0.1), transparent 62%),
			radial-gradient(66% 60% at 88% 88%, rgba(178, 39, 37, 0.12), transparent 66%);
	}
	.bio__atmos::after {
		content: '';
		position: absolute;
		inset: 0;
		box-shadow: inset 0 0 220px 60px rgba(0, 0, 0, 0.72);
	}
	.bio__warm {
		position: absolute;
		top: -12%;
		left: 4%;
		width: 44vw;
		height: 44vw;
		max-width: 620px;
		max-height: 620px;
		background: radial-gradient(circle, rgba(245, 196, 81, 0.14), transparent 60%);
		filter: blur(26px);
	}

	.bio__inner {
		position: relative;
		z-index: 1;
		display: grid;
		gap: clamp(2.75rem, 5vw, 5rem);
		align-items: center;
	}

	/* ---- Portrait ---- */
	.bio__portrait {
		position: relative;
		margin: 0;
	}
	.bio__accent {
		position: absolute;
		inset: 1.6rem -1.4rem -1.6rem 1.6rem;
		border: 1px solid var(--tt-red);
		background: linear-gradient(135deg, rgba(178, 39, 37, 0.14), transparent 55%);
		z-index: 0;
	}
	.bio__frame {
		position: relative;
		z-index: 1;
		padding: 0.6rem;
		background: var(--tt-ink);
		box-shadow: var(--tt-shadow-lg);
	}
	.bio__img {
		width: 100%;
		height: auto;
		display: block;
		filter: saturate(1.02) contrast(1.03);
	}

	/* Corner registration marks */
	.bio__reg {
		position: absolute;
		width: 16px;
		height: 16px;
		z-index: 2;
	}
	.bio__reg--tl {
		top: -1px;
		left: -1px;
		border-top: 2px solid var(--tt-red-bright);
		border-left: 2px solid var(--tt-red-bright);
	}
	.bio__reg--tr {
		top: -1px;
		right: -1px;
		border-top: 2px solid var(--tt-red-bright);
		border-right: 2px solid var(--tt-red-bright);
	}
	.bio__reg--bl {
		bottom: -1px;
		left: -1px;
		border-bottom: 2px solid var(--tt-red-bright);
		border-left: 2px solid var(--tt-red-bright);
	}
	.bio__reg--br {
		bottom: -1px;
		right: -1px;
		border-bottom: 2px solid var(--tt-red-bright);
		border-right: 2px solid var(--tt-red-bright);
	}
	.bio__tag {
		position: absolute;
		left: 1.1rem;
		bottom: 1.1rem;
		z-index: 2;
		padding: 0.35rem 0.6rem;
		font-size: 0.66rem;
		letter-spacing: 0.14em;
		color: var(--tt-fog);
		background: rgba(10, 10, 11, 0.72);
		border: 1px solid var(--tt-line-strong);
		backdrop-filter: blur(4px);
	}
	.bio__cap {
		margin-top: 1.5rem;
		padding-left: 1.6rem;
		color: var(--tt-mute);
	}

	/* ---- Statement ---- */
	.bio__col {
		position: relative;
	}
	.bio__kicker {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		margin-bottom: 1.4rem;
		color: var(--tt-fog);
	}
	.bio__dot {
		width: 26px;
		height: 1px;
		background: var(--tt-red-bright);
	}

	.bio__statement {
		margin: 0;
	}
	.bio__quote {
		position: relative;
		margin: 0;
		padding-top: 0.4rem;
	}
	.bio__mark {
		position: absolute;
		top: -0.35em;
		left: -0.12em;
		font-family: var(--tt-font-body);
		font-size: clamp(6rem, 14vw, 11rem);
		line-height: 1;
		font-weight: 800;
		color: rgba(178, 39, 37, 0.24);
		pointer-events: none;
		user-select: none;
	}
	.bio__lead {
		position: relative;
		max-width: 16ch;
		font-size: var(--fs-h2);
		line-height: 1.02;
		letter-spacing: -0.025em;
		color: var(--tt-white);
	}
	.bio__body {
		margin-top: clamp(1.6rem, 3vw, 2.4rem);
		max-width: 54ch;
		display: grid;
		gap: 1.05rem;
		color: var(--tt-fog);
		font-size: var(--fs-lead);
	}
	.bio__closer {
		color: var(--tt-white);
		font-weight: 600;
	}

	.bio__sign {
		margin-top: clamp(1.8rem, 3vw, 2.6rem);
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		gap: 0.9rem 1.1rem;
	}
	.bio__sig {
		font-size: clamp(2.4rem, 2rem + 3vw, 3.6rem);
		color: var(--tt-white);
	}
	.bio__signrule {
		flex: 1;
		min-width: 40px;
		height: 1px;
		background: linear-gradient(90deg, var(--tt-line-strong), transparent);
	}
	.bio__signmeta {
		color: var(--tt-mute-2);
	}

	.bio__stats {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 1.4rem 1.8rem;
		margin: clamp(2.2rem, 4vw, 3rem) 0 0;
		padding-top: 1.8rem;
		border-top: 1px solid var(--tt-line);
	}
	.bio__statsep {
		width: 1px;
		height: 38px;
		background: var(--tt-line-strong);
	}
	.bio__stat dt {
		font-family: var(--tt-font-mono);
		font-size: clamp(1.7rem, 1.1rem + 2.4vw, 2.4rem);
		font-weight: 700;
		line-height: 1;
		color: var(--tt-white);
	}
	.bio__stat dd {
		margin: 0.45rem 0 0;
		font-size: 0.76rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--tt-mute);
	}

	@media (min-width: 900px) {
		.bio__inner {
			grid-template-columns: 0.9fr 1.1fr;
			align-items: start;
		}
		.bio__portrait {
			position: sticky;
			top: calc(var(--tt-header-h) + 3rem);
			margin-top: 0.6rem;
		}
		.bio__col {
			padding-top: 1.2rem;
		}
		.bio__lead {
			font-size: clamp(2.4rem, 1.4rem + 3.4vw, 4rem);
		}
	}
</style>
