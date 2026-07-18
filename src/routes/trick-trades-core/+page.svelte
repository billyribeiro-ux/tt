<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import Button from '$lib/components/Button.svelte';
	import { reveal, splitReveal, parallax, scrollToTarget } from '$lib/motion';
	import HeadphonesIcon from 'phosphor-svelte/lib/HeadphonesIcon';
	import BrainIcon from 'phosphor-svelte/lib/BrainIcon';
	import SunHorizonIcon from 'phosphor-svelte/lib/SunHorizonIcon';
	import WaveformIcon from 'phosphor-svelte/lib/WaveformIcon';
	import LightningIcon from 'phosphor-svelte/lib/LightningIcon';
	import MoonIcon from 'phosphor-svelte/lib/MoonIcon';
	import SparkleIcon from 'phosphor-svelte/lib/SparkleIcon';
	import BookOpenIcon from 'phosphor-svelte/lib/BookOpenIcon';
	import CheckIcon from 'phosphor-svelte/lib/CheckIcon';
	import CheckCircleIcon from 'phosphor-svelte/lib/CheckCircleIcon';

	const BUY_URL = 'https://tricktrades.com/trick-trades-core';

	// The four daily sessions + the bonus disks — durations and states are the real program spec.
	const sessions = [
		{
			name: 'Focus Session',
			len: '15 min',
			slot: 'Morning',
			state: 'Mindset',
			Icon: SunHorizonIcon,
			body: 'A short pre-market reset. Walk into the open calm, clear, and deliberate instead of already reacting.'
		},
		{
			name: 'Market Session',
			len: '1.5 hrs',
			slot: 'Live open',
			state: 'Alpha state',
			Icon: WaveformIcon,
			body: 'Alpha-state brainwave training played during live trading — so focus holds when the money is real and the pressure is on.'
		},
		{
			name: 'Power Session',
			len: '1 hr',
			slot: 'Afternoon',
			state: 'Subliminal',
			Icon: LightningIcon,
			body: 'A full hour of subliminal affirmations layered beneath the audio, quietly reinforcing the disciplined behavior you want to default to.'
		},
		{
			name: 'Sleep Session',
			len: '7 hrs',
			slot: 'Overnight',
			state: 'Delta wave',
			Icon: MoonIcon,
			body: 'Seven hours of delta-wave audio for the deep, overnight subconscious rewiring that does the heavy lifting while you sleep.'
		}
	];

	// The five behavioural patterns each meditation targets.
	const topics = ['Big Losses', 'Losing Streak', 'Oversizing', 'Overtrading', 'Small Wins'];

	// Program spec — every figure derived from the real session lengths (0.25 + 1.5 + 1 + 7 = 9.75 hrs).
	const spec = [
		{ k: 'Format', v: 'Binaural audio' },
		{ k: 'Daily sessions', v: '4 + bonus' },
		{ k: 'Daily runtime', v: '≈ 9.75 hrs' },
		{ k: 'Topics', v: '5 patterns' },
		{ k: 'Delivery', v: 'Instant download' }
	];

	const packages = [
		{
			id: 'single',
			name: 'Single Meditation',
			price: 25,
			note: 'per topic',
			blurb: 'Pick one topic — the pattern that costs you the most — and start rewiring it tonight.',
			cta: 'Buy a single meditation',
			featured: false,
			feats: [
				'Any one topic of the five',
				'All four daily sessions for that topic',
				'Meditation guide included',
				'Instant digital download'
			]
		},
		{
			id: 'volume-one',
			name: 'Complete Volume One',
			price: 97,
			note: 'save $28 vs à la carte',
			blurb: 'Every topic, every daily session, plus the bonus affirmation disks — the whole rewire in one download.',
			cta: 'Get Volume One',
			featured: true,
			feats: [
				'All five topic meditations',
				'Focus, Market, Power & Sleep sessions',
				'Bonus affirmations — three 1-hour disks',
				'Meditation guide included',
				'Instant digital download'
			]
		}
	];

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Product',
		name: 'Trick Trades Core',
		category: 'Binaural meditation program',
		description:
			'A binaural-beats meditation program that rewires the subconscious survival responses that sabotage traders — four daily sessions across five behavioural topics.',
		brand: { '@type': 'Brand', name: 'Trick Trades' },
		url: BUY_URL,
		offers: [
			{
				'@type': 'Offer',
				name: 'Single topic meditation',
				price: 25,
				priceCurrency: 'USD',
				url: BUY_URL,
				availability: 'https://schema.org/InStock'
			},
			{
				'@type': 'Offer',
				name: 'Complete Volume One',
				price: 97,
				priceCurrency: 'USD',
				url: BUY_URL,
				availability: 'https://schema.org/InStock'
			}
		]
	};

	function jump(e: MouseEvent, href: string) {
		e.preventDefault();
		scrollToTarget(href);
	}
</script>

<Seo
	title="Trick Trades Core — Binaural Meditation for Traders"
	description="Trick Trades Core is a binaural-beats meditation program that rewires the subconscious survival responses that sabotage traders — four daily sessions across five patterns. Meditations from $25, complete Volume One $97."
	path="/trick-trades-core"
	{jsonLd}
/>

<!-- ===================== HERO ===================== -->
<section class="chero" aria-label="Trick Trades Core">
	<div class="chero__bg" aria-hidden="true">
		<div class="chero__grid grid-bg"></div>
		<div class="chero__glow" {@attach parallax(90)}></div>
	</div>

	<div class="tt-container chero__inner">
		<div class="chero__copy">
			<p class="eyebrow chero__eyebrow">
				<HeadphonesIcon size={15} weight="fill" aria-hidden="true" />Rewire the subconscious
			</p>

			<h1 class="chero__title" data-split {@attach splitReveal({ stagger: 0.028 })}>
				You don’t have a chart problem, and you don’t have a
				<span class="text-red">psychology problem.</span>
			</h1>

			<div class="chero__stack" data-anim-stagger {@attach reveal({ stagger: 0.12, y: 26 })}>
				<p class="chero__lede">
					Under real risk, a <strong>survival response</strong> takes over and overrides the strategy
					you’ve already learned. <strong>Trick Trades Core</strong> is a binaural-beats meditation program
					built to rewire those subconscious behaviours — session by session, night by night.
				</p>

				<div class="chero__cta">
					<Button href="#pricing" onclick={(e) => jump(e, '#pricing')}>Get Volume One — $97</Button>
					<Button href="#sessions" variant="ghost" onclick={(e) => jump(e, '#sessions')}>
						See the daily sessions
					</Button>
				</div>
			</div>
		</div>

		<aside
			class="chero__spec"
			data-anim
			{@attach reveal({ y: 44, scale: 0.98, duration: 1.15 })}
		>
			<div class="chero__spec-top">
				<span class="label">Program spec</span>
				<span class="chero__wave" aria-hidden="true">
					<WaveformIcon size={20} weight="bold" />
				</span>
			</div>
			<dl class="chero__spec-list">
				{#each spec as row (row.k)}
					<div class="chero__spec-row">
						<dt class="label chero__spec-k">{row.k}</dt>
						<dd class="chero__spec-v">{row.v}</dd>
					</div>
				{/each}
			</dl>
			<p class="chero__spec-band num" aria-hidden="true">ALPHA → DELTA · BINAURAL</p>
		</aside>
	</div>
</section>

<!-- ===================== DAILY SESSIONS ===================== -->
<section id="sessions" class="sess tt-section" aria-labelledby="sess-title">
	<span class="sess__glow" aria-hidden="true"></span>

	<div class="tt-container">
		<header class="sess__head">
			<div class="section-head">
				<span class="idx">01 / 02</span>
				<span class="rule"></span>
				<span class="label">A day on the program</span>
			</div>
			<h2 id="sess-title" class="sess__title" data-split {@attach splitReveal({ stagger: 0.03 })}>
				Four sessions, from the <span class="text-red">open bell</span> to deep sleep.
			</h2>
			<p class="sess__intro prose">
				The rewiring isn’t one download you listen to once. It’s a daily rhythm — a short morning
				reset, focus during the trade, reinforcement after, and the deep overnight work that changes
				the default.
			</p>
		</header>

		<ol class="sess__list" data-anim-stagger {@attach reveal({ stagger: 0.1, y: 34 })}>
			{#each sessions as s, i (s.name)}
				{@const Icon = s.Icon}
				<li class="sess__item">
					<div class="sess__marker" aria-hidden="true">
						<span class="sess__idx num">0{i + 1}</span>
						<span class="sess__line"></span>
					</div>

					<div class="sess__ico" aria-hidden="true"><Icon size={26} weight="light" /></div>

					<div class="sess__body">
						<div class="sess__row">
							<h3 class="sess__name">{s.name}</h3>
							<span class="sess__len num">{s.len}</span>
						</div>
						<div class="sess__tags">
							<span class="sess__tag">{s.slot}</span>
							<span class="sess__tag sess__tag--state">{s.state}</span>
						</div>
						<p class="sess__text">{s.body}</p>
					</div>
				</li>
			{/each}

			<li class="sess__item sess__item--bonus">
				<div class="sess__marker" aria-hidden="true">
					<span class="sess__idx num">+</span>
					<span class="sess__line"></span>
				</div>
				<div class="sess__ico" aria-hidden="true"><SparkleIcon size={26} weight="light" /></div>
				<div class="sess__body">
					<div class="sess__row">
						<h3 class="sess__name">Bonus Affirmations</h3>
						<span class="sess__len num">3 × 1 hr</span>
					</div>
					<div class="sess__tags">
						<span class="sess__tag">Included in Volume One</span>
					</div>
					<p class="sess__text">
						Three standalone one-hour affirmation disks to reinforce the work between sessions and on
						the days the market keeps you away from the desk.
					</p>
				</div>
			</li>
		</ol>
	</div>
</section>

<!-- ===================== TOPICS ===================== -->
<section class="topics tt-section" aria-labelledby="topics-title">
	<div class="tt-container topics__inner">
		<header class="topics__head">
			<p class="label topics__kicker">
				<BrainIcon size={16} weight="fill" aria-hidden="true" />The five patterns
			</p>
			<h2 id="topics-title" class="topics__title" data-split {@attach splitReveal({ stagger: 0.03 })}>
				Every meditation targets one behaviour you keep repeating.
			</h2>
			<p class="topics__note prose">
				Each topic is its own meditation — buy the one that’s bleeding your account, or take all five in
				Volume One.
			</p>
		</header>

		<ul class="topics__tags" data-anim-stagger {@attach reveal({ stagger: 0.07, y: 20 })}>
			{#each topics as t, i (t)}
				<li class="topics__tag">
					<span class="topics__tag-idx num">{String(i + 1).padStart(2, '0')}</span>
					<span class="topics__tag-label">{t}</span>
				</li>
			{/each}
		</ul>
	</div>
</section>

<!-- ===================== PRICING ===================== -->
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
				<h2 id="cprice-title" class="cprice__title" data-split {@attach splitReveal({ stagger: 0.03 })}>
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
				Every package includes a <strong>meditation guide</strong> — setup, a breakdown of each
				session, what to expect, and how to use it.
			</span>
		</p>

		<p class="cprice__fine">
			Trick Trades Core is an educational meditation program — not medical, psychological, or
			financial advice. Individual results vary.
		</p>
	</div>
</section>

<style>
	/* ===================== HERO ===================== */
	.chero {
		position: relative;
		padding-top: calc(var(--tt-header-h) + clamp(2rem, 6vw, 5rem));
		padding-bottom: clamp(3rem, 6vw, 5rem);
		overflow: clip;
	}
	.chero__bg {
		position: absolute;
		inset: 0;
		z-index: 0;
	}
	.chero__grid {
		position: absolute;
		inset: -10% 0 0;
		opacity: 0.45;
	}
	.chero__glow {
		position: absolute;
		top: -18%;
		right: -12%;
		width: 68vw;
		height: 68vw;
		max-width: 860px;
		max-height: 860px;
		background: radial-gradient(circle, rgba(178, 39, 37, 0.4), transparent 62%);
		filter: blur(22px);
	}

	.chero__inner {
		position: relative;
		z-index: 1;
		display: grid;
		gap: clamp(2.5rem, 5vw, 4rem);
		align-items: center;
	}

	.chero__eyebrow {
		gap: 0.5em;
	}
	.chero__title {
		margin-top: 1.5rem;
		font-size: var(--fs-h1);
		font-weight: 800;
		letter-spacing: -0.03em;
		line-height: 0.98;
		color: #fff;
		max-width: 16ch;
	}
	.chero__lede {
		margin-top: 1.7rem;
		max-width: 54ch;
		font-size: var(--fs-lead);
		color: var(--tt-fog);
	}
	.chero__lede strong {
		color: #fff;
		font-weight: 600;
	}
	.chero__cta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.9rem;
		margin-top: 2.1rem;
	}

	.chero__spec {
		position: relative;
		padding: clamp(1.5rem, 3vw, 2.1rem);
		border: 1px solid var(--tt-line);
		border-radius: var(--tt-radius-lg);
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent 45%),
			var(--tt-ink-2);
		box-shadow: var(--tt-shadow-card);
	}
	.chero__spec-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1.2rem;
	}
	.chero__wave {
		display: grid;
		place-items: center;
		width: 38px;
		height: 38px;
		border-radius: 10px;
		color: var(--tt-red-bright);
		border: 1px solid var(--tt-line);
		background: rgba(178, 39, 37, 0.08);
	}
	.chero__spec-list {
		margin: 0;
		display: flex;
		flex-direction: column;
	}
	.chero__spec-row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.85rem 0;
		border-top: 1px solid var(--tt-line);
	}
	.chero__spec-row:first-child {
		border-top: 0;
	}
	.chero__spec-k {
		color: var(--tt-mute);
	}
	.chero__spec-v {
		font-family: var(--tt-font-body);
		font-weight: 600;
		font-size: 0.98rem;
		color: var(--tt-white);
		text-align: right;
	}
	.chero__spec-band {
		margin-top: 1.4rem;
		padding-top: 1.1rem;
		border-top: 1px solid var(--tt-line);
		font-size: 0.68rem;
		letter-spacing: 0.24em;
		color: var(--tt-red-bright);
	}

	@media (min-width: 940px) {
		.chero__inner {
			grid-template-columns: 1.1fr 0.9fr;
		}
	}

	/* ===================== SESSIONS ===================== */
	.sess {
		position: relative;
		background: var(--tt-ink);
		border-top: 1px solid var(--tt-line);
		border-bottom: 1px solid var(--tt-line);
		overflow: clip;
	}
	.sess__glow {
		position: absolute;
		top: 12%;
		left: -10%;
		width: 44vw;
		height: 44vw;
		max-width: 600px;
		max-height: 600px;
		z-index: 0;
		pointer-events: none;
		background: radial-gradient(circle, rgba(178, 39, 37, 0.16), transparent 64%);
		filter: blur(26px);
	}
	.sess .tt-container {
		position: relative;
		z-index: 1;
	}
	.sess__head {
		max-width: 780px;
		margin-bottom: clamp(2.5rem, 5vw, 4rem);
	}
	.sess__title {
		font-size: var(--fs-h2);
		max-width: 18ch;
	}
	.sess__intro {
		margin-top: 1.3rem;
	}

	.sess__list {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.sess__item {
		display: grid;
		grid-template-columns: auto auto 1fr;
		gap: clamp(1rem, 3vw, 2rem);
		padding: clamp(1.6rem, 3vw, 2.2rem) 0;
		border-top: 1px solid var(--tt-line);
	}
	.sess__item:last-child {
		border-bottom: 1px solid var(--tt-line);
	}

	.sess__marker {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.7rem;
	}
	.sess__idx {
		font-size: 1rem;
		font-weight: 700;
		color: var(--tt-red-bright);
		line-height: 1;
	}
	.sess__line {
		flex: 1;
		width: 1px;
		background: linear-gradient(180deg, var(--tt-line-strong), transparent);
	}
	.sess__item:last-child .sess__line {
		display: none;
	}

	.sess__ico {
		display: grid;
		place-items: center;
		width: 52px;
		height: 52px;
		border-radius: 12px;
		color: var(--tt-fog);
		border: 1px solid var(--tt-line);
		background: rgba(255, 255, 255, 0.02);
	}
	.sess__item--bonus .sess__ico {
		color: var(--tt-gold);
		border-color: rgba(245, 196, 81, 0.35);
	}

	.sess__row {
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		gap: 0.7rem 1rem;
	}
	.sess__name {
		font-size: var(--fs-h4);
		font-weight: 700;
		color: var(--tt-white);
	}
	.sess__len {
		font-size: 0.82rem;
		letter-spacing: 0.04em;
		color: var(--tt-mute);
	}
	.sess__tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 0.7rem;
	}
	.sess__tag {
		font-family: var(--tt-font-mono);
		font-size: 0.64rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--tt-mute);
		padding: 0.28rem 0.6rem;
		border: 1px solid var(--tt-line);
		border-radius: 999px;
	}
	.sess__tag--state {
		color: var(--tt-red-bright);
		border-color: rgba(178, 39, 37, 0.4);
	}
	.sess__text {
		margin-top: 0.9rem;
		max-width: 58ch;
		color: var(--tt-fog);
		font-size: 0.98rem;
	}

	@media (max-width: 560px) {
		.sess__item {
			grid-template-columns: auto 1fr;
		}
		.sess__ico {
			display: none;
		}
	}

	/* ===================== TOPICS ===================== */
	.topics {
		position: relative;
		overflow: clip;
	}
	.topics__inner {
		position: relative;
		z-index: 1;
	}
	.topics__head {
		max-width: 720px;
	}
	.topics__kicker {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		color: var(--tt-fog);
	}
	.topics__title {
		margin-top: 1.1rem;
		font-size: var(--fs-h2);
		max-width: 20ch;
	}
	.topics__note {
		margin-top: 1.2rem;
	}

	.topics__tags {
		list-style: none;
		margin: clamp(2.2rem, 4vw, 3.2rem) 0 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.9rem;
	}
	.topics__tag {
		display: inline-flex;
		align-items: center;
		gap: 0.7rem;
		padding: 0.75rem 1.2rem;
		border: 1px solid var(--tt-line-strong);
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.02);
		transition:
			border-color 0.35s ease,
			background 0.35s ease,
			transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
	}
	.topics__tag:hover {
		border-color: rgba(178, 39, 37, 0.5);
		background: rgba(178, 39, 37, 0.06);
		transform: translateY(-2px);
	}
	.topics__tag-idx {
		font-size: 0.7rem;
		color: var(--tt-red-bright);
	}
	.topics__tag-label {
		font-family: var(--tt-font-display);
		font-size: 1.05rem;
		letter-spacing: 0.05em;
		color: var(--tt-white);
	}

	@media (prefers-reduced-motion: reduce) {
		.topics__tag {
			transition: none;
		}
	}

	/* ===================== PRICING ===================== */
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
		background: radial-gradient(circle, rgba(178, 39, 37, 0.2), transparent 62%);
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
		border-color: rgba(178, 39, 37, 0.55);
		background:
			linear-gradient(180deg, rgba(178, 39, 37, 0.1), transparent 40%),
			var(--tt-ink-2);
		box-shadow:
			var(--tt-glow-red),
			var(--tt-shadow-lg);
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
		background: linear-gradient(180deg, #d1332f, var(--tt-red) 60%, var(--tt-red-600));
		border-radius: 999px;
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.25),
			0 10px 26px -10px rgba(178, 39, 37, 0.9);
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

	@media (min-width: 820px) {
		.cprice__grid {
			grid-template-columns: 1fr 1.06fr;
			align-items: center;
		}
	}
</style>
