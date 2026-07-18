<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Vsl from '$lib/components/Vsl.svelte';
	import { reveal, splitReveal, parallax, counter, marquee, scrollToTarget } from '$lib/motion';
	import { featuredOn, site } from '$lib/data/site';

	const stats = [
		{ value: site.studentsTrained, suffix: '+', label: 'Traders trained' },
		{ value: 50, suffix: '+', label: 'Boot Camp lessons' },
		{ value: 10, suffix: ' yrs', label: 'Proven strategy' }
	];

	function jump(e: MouseEvent, href: string) {
		e.preventDefault();
		scrollToTarget(href);
	}
</script>

<section class="hero" aria-label="Trick Trades">
	<div class="hero__bg" aria-hidden="true">
		<div class="hero__grid grid-bg"></div>
		<div class="hero__glow" {@attach parallax(120)}></div>
	</div>

	<div class="tt-container tt-container--wide hero__inner">
		<div class="hero__copy">
			<p class="hero__kicker label">
				<span class="hero__live"></span>Want to make money trading?
			</p>

			<h1 class="hero__title" data-split {@attach splitReveal({ stagger: 0.028 })}>
				Master the skill.<br />Master the emotion.
				<span class="script hero__script">get your freedom.</span>
			</h1>

			<div class="hero__stack" data-anim-stagger {@attach reveal({ stagger: 0.12, y: 26 })}>
				<p class="hero__lede">
					If you’re losing money trading, watch this before you do anything else today. Trick Trades
					is a <strong>100% educational</strong> day-trading mentorship led by Pat “Trick” Mitchell. No
					alerts, no hype. Just the skill and the emotional mastery that separate professionals from the
					90%.
				</p>

				<div class="hero__cta">
					<Button href="#pricing" onclick={(e) => jump(e, '#pricing')}>Become a Member</Button>
					<Button href="#formula" variant="ghost" onclick={(e) => jump(e, '#formula')}>
						See the strategy
					</Button>
				</div>

				<dl class="hero__stats">
					{#each stats as s, i (s.label)}
						<div class="hero__stat" class:hero__stat--ruled={i > 0}>
							<dt class="num">
								<span {@attach counter(s.value, (v) => Math.round(v).toLocaleString('en-US'))}
									>{s.value.toLocaleString('en-US')}</span
								>{s.suffix}
							</dt>
							<dd>{s.label}</dd>
						</div>
					{/each}
				</dl>
			</div>
		</div>

		<!-- parallax and reveal both tween GSAP `y`, so they live on separate nodes:
		     the outer wrapper drifts, the inner element plays the entrance. -->
		<div class="hero__media" {@attach parallax(-46)}>
			<div data-anim {@attach reveal({ y: 60, scale: 0.97, duration: 1.2 })}>
				<Vsl label="Watch: Why 90% fail" />
				<p class="hero__caption label">The 6-minute film that started 30,000 journeys</p>
			</div>
		</div>
	</div>

	<div class="hero__ribbon">
		<span class="hero__ribbon-tag label">As featured on</span>
		<div class="hero__ribbon-mask" aria-hidden="true">
			<div class="hero__ribbon-track" {@attach marquee(28)}>
				{#each [...featuredOn, ...featuredOn] as name, i (name + i)}
					<span class="hero__ribbon-item">{name}</span>
					<span class="hero__ribbon-dot">✦</span>
				{/each}
			</div>
		</div>
		<!-- Static, accessible equivalent of the moving ribbon -->
		<p class="sr-only">As featured on {featuredOn.join(', ')}.</p>
	</div>
</section>

<style>
	.hero {
		position: relative;
		padding-top: calc(var(--tt-header-h) + clamp(2rem, 6vw, 5rem));
		padding-bottom: 0;
		overflow: clip;
	}
	.hero__bg {
		position: absolute;
		inset: 0;
		z-index: 0;
	}
	.hero__grid {
		position: absolute;
		inset: -10% 0 0;
		opacity: 0.5;
	}
	.hero__glow {
		position: absolute;
		top: -20%;
		right: -10%;
		width: 70vw;
		height: 70vw;
		max-width: 900px;
		max-height: 900px;
		background: radial-gradient(circle, rgb(var(--tt-red-rgb) / 0.42), transparent 62%);
		filter: blur(20px);
	}

	.hero__inner {
		position: relative;
		z-index: 1;
		display: grid;
		gap: clamp(2.5rem, 5vw, 4rem);
		align-items: center;
	}

	.hero__kicker {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		color: var(--tt-fog);
	}
	.hero__live {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--tt-red-bright);
		box-shadow: 0 0 12px var(--tt-red-bright);
	}

	.hero__title {
		margin-top: 1.4rem;
		font-size: var(--fs-h1);
		font-weight: 800;
		letter-spacing: -0.03em;
		line-height: 0.98;
		color: #fff;
	}
	.hero__script {
		display: block;
		margin-top: 0.1em;
		font-size: 1.15em;
		line-height: 0.8;
		color: var(--tt-red-bright);
	}

	.hero__lede {
		margin-top: 1.6rem;
		max-width: 52ch;
		font-size: var(--fs-lead);
		color: var(--tt-fog);
	}
	.hero__lede strong {
		color: #fff;
	}

	.hero__cta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.9rem;
		margin-top: 2rem;
	}

	.hero__stats {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 1.4rem;
		margin: 2.6rem 0 0;
		padding-top: 1.8rem;
		border-top: 1px solid var(--tt-line);
	}
	.hero__stat--ruled {
		padding-left: 1.4rem;
		border-left: 1px solid var(--tt-line-strong);
	}
	.hero__stat dt {
		font-size: clamp(1.5rem, 1rem + 2vw, 2.1rem);
		font-weight: 700;
		color: #fff;
		line-height: 1;
	}
	.hero__stat dd {
		margin: 0.3rem 0 0;
		font-size: 0.78rem;
		letter-spacing: 0.02em;
		color: var(--tt-mute);
	}

	.hero__media {
		position: relative;
	}
	.hero__caption {
		margin-top: 1rem;
		text-align: right;
		color: var(--tt-mute-2);
	}

	.hero__ribbon {
		position: relative;
		z-index: 1;
		display: flex;
		align-items: center;
		gap: 1.5rem;
		margin-top: clamp(3rem, 6vw, 5rem);
		padding: 1.2rem 0;
		border-top: 1px solid var(--tt-line);
		border-bottom: 1px solid var(--tt-line);
	}
	.hero__ribbon-tag {
		flex: none;
		padding-left: clamp(1.1rem, 5vw, 2.5rem);
		color: var(--tt-mute-2);
	}
	.hero__ribbon-mask {
		position: relative;
		overflow: hidden;
		-webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
		mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
	}
	.hero__ribbon-track {
		display: flex;
		align-items: center;
		gap: 2.2rem;
		width: max-content;
	}
	.hero__ribbon-item {
		font-family: var(--tt-font-display);
		font-size: 1.35rem;
		letter-spacing: 0.1em;
		color: var(--tt-fog);
		white-space: nowrap;
	}
	.hero__ribbon-dot {
		color: var(--tt-red);
		font-size: 0.7rem;
	}

	@media (min-width: 1024px) {
		.hero__inner {
			/* The film is the conversion engine: give it the wider column */
			grid-template-columns: 0.92fr 1.08fr;
		}
		.hero__title {
			margin-top: 1.8rem;
		}
	}
</style>
