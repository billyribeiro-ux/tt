<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import Button from '$lib/components/Button.svelte';
	import { reveal, splitReveal, parallax, scrollToTarget } from '$lib/motion';
	import StarIcon from 'phosphor-svelte/lib/StarIcon';
	import CompassIcon from 'phosphor-svelte/lib/CompassIcon';
	import RocketLaunchIcon from 'phosphor-svelte/lib/RocketLaunchIcon';
	import AirplaneTiltIcon from 'phosphor-svelte/lib/AirplaneTiltIcon';
	import PhoneCallIcon from 'phosphor-svelte/lib/PhoneCallIcon';
	import TableIcon from 'phosphor-svelte/lib/TableIcon';
	import CalendarCheckIcon from 'phosphor-svelte/lib/CalendarCheckIcon';
	import ChatsCircleIcon from 'phosphor-svelte/lib/ChatsCircleIcon';
	import ChartBarIcon from 'phosphor-svelte/lib/ChartBarIcon';
	import TargetIcon from 'phosphor-svelte/lib/TargetIcon';
	import ScalesIcon from 'phosphor-svelte/lib/ScalesIcon';
	import PiggyBankIcon from 'phosphor-svelte/lib/PiggyBankIcon';
	import WarningIcon from 'phosphor-svelte/lib/WarningIcon';
	import CheckIcon from 'phosphor-svelte/lib/CheckIcon';

	const BUY_URL = 'https://tricktrades.com/polaris';

	// Two tiers, same $697/mo — the difference is your debt situation and budget horizon.
	const tiers = [
		{
			id: 'launch',
			name: 'Polaris Launch',
			Icon: RocketLaunchIcon,
			forWho: 'For traders carrying debt',
			focus: 'Immediate budget management',
			blurb: 'Stop the overleveraging now. We stabilise your cash flow and build a structured path out of the hole.',
			points: [
				'Built for traders struggling with debt',
				'Cap trading risk to what you can afford',
				'A clear plan to pay debt down',
				'Weekly accountability while you rebuild'
			]
		},
		{
			id: 'flight',
			name: 'Polaris Flight',
			Icon: AirplaneTiltIcon,
			forWho: 'For traders with little to no debt',
			focus: 'Long-term budget management',
			blurb: 'Compound your gains with discipline — and build guardrails so you never repeat the same mistakes.',
			points: [
				'Built for minimal or no-debt traders',
				'Allocate profits with intention, not impulse',
				'Systems that prevent repeat mistakes',
				'Steady march toward financial independence'
			]
		}
	];

	const steps = [
		{
			n: '01',
			name: 'Breakthrough Call',
			Icon: PhoneCallIcon,
			body: 'A one-on-one consultation on your finances and your goals — an honest look at where you are and where you want to be.'
		},
		{
			n: '02',
			name: 'Data Input',
			Icon: TableIcon,
			body: 'We load your numbers into Polaris’s proprietary spreadsheets, so the full picture is finally clear on one screen.'
		},
		{
			n: '03',
			name: 'Weekly Collaboration',
			Icon: CalendarCheckIcon,
			body: 'Ninety days of structured, weekly coaching — adjusting the plan as your situation and the market change.'
		}
	];

	const includes = [
		{ Icon: ChatsCircleIcon, t: '1:1 consultation', d: 'Direct, personal coaching — not a course you watch alone.' },
		{ Icon: ChartBarIcon, t: 'Budget breakdown', d: 'A clear map of what comes in, what goes out, and what to change.' },
		{ Icon: TargetIcon, t: 'Realistic goal-setting', d: 'Targets built on your numbers, not someone else’s highlight reel.' },
		{ Icon: ScalesIcon, t: 'Risk-tolerance assessment', d: 'How much you can actually afford to put at risk — and no more.' },
		{ Icon: PiggyBankIcon, t: 'Money-saving strategies', d: 'Practical ways to keep more of what you make.' },
		{ Icon: CompassIcon, t: 'Path to financial independence', d: 'A long-term direction, not just a short-term patch.' }
	];

	const spec = [
		{ k: 'Format', v: '1:1 coaching' },
		{ k: 'Length', v: '90 days' },
		{ k: 'Cadence', v: 'Weekly' },
		{ k: 'Investment', v: '$697 / mo' },
		{ k: 'Focus', v: 'Budget & risk' }
	];

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Service',
		serviceType: 'Financial coaching',
		name: 'Polaris',
		description:
			'A 90-day, 1:1 financial and budget coaching program for day traders — so you stop overleveraging and trade from a position of strength. Two tiers, each $697 per month.',
		provider: { '@type': 'Organization', name: 'Trick Trades' },
		url: BUY_URL,
		offers: tiers.map((t) => ({
			'@type': 'Offer',
			name: t.name,
			price: 697,
			priceCurrency: 'USD',
			url: BUY_URL,
			availability: 'https://schema.org/InStock'
		}))
	};

	function jump(e: MouseEvent, href: string) {
		e.preventDefault();
		scrollToTarget(href);
	}
</script>

<Seo
	title="Polaris — Financial Coaching for Day Traders | Trick Trades"
	description="Polaris is a 90-day, 1:1 financial and budget coaching program so day traders stop overleveraging and trade from a position of strength. Two tiers, each $697 per month."
	path="/polaris"
	{jsonLd}
/>

<!-- ===================== HERO ===================== -->
<section class="phero" aria-label="Polaris financial coaching">
	<div class="phero__bg" aria-hidden="true">
		<div class="phero__grid grid-bg"></div>
		<div class="phero__glow" {@attach parallax(90)}></div>
	</div>

	<div class="tt-container phero__inner">
		<div class="phero__copy">
			<p class="eyebrow phero__eyebrow">
				<StarIcon size={15} weight="fill" aria-hidden="true" />Financial coaching
			</p>

			<h1 class="phero__title" data-split {@attach splitReveal({ stagger: 0.03 })}>
				Trade from a position of <span class="text-red">strength.</span>
			</h1>

			<div class="phero__stack" data-anim-stagger {@attach reveal({ stagger: 0.12, y: 26 })}>
				<p class="phero__lede">
					The market punishes traders who trade scared money. <strong>Polaris</strong> is a 90-day, 1:1
					financial and budget coaching program built to fix the thing behind the blowups — so you stop
					overleveraging and start managing risk like a professional.
				</p>

				<div class="phero__cta">
					<Button href={BUY_URL}>Book a breakthrough call</Button>
					<Button href="#process" variant="ghost" onclick={(e) => jump(e, '#process')}>
						See how it works
					</Button>
				</div>
			</div>
		</div>

		<aside class="phero__spec" data-anim {@attach reveal({ y: 44, scale: 0.98, duration: 1.15 })}>
			<div class="phero__spec-top">
				<span class="label">The engagement</span>
				<span class="phero__compass" aria-hidden="true">
					<CompassIcon size={20} weight="bold" />
				</span>
			</div>
			<dl class="phero__spec-list">
				{#each spec as row (row.k)}
					<div class="phero__spec-row">
						<dt class="label phero__spec-k">{row.k}</dt>
						<dd class="phero__spec-v">{row.v}</dd>
					</div>
				{/each}
			</dl>
			<p class="phero__spec-band num" aria-hidden="true">POLARIS · YOUR FIXED POINT</p>
		</aside>
	</div>
</section>

<!-- ===================== TIERS ===================== -->
<section id="tiers" class="tiers tt-section" aria-labelledby="tiers-title">
	<div class="tiers__glow" aria-hidden="true"></div>

	<div class="tt-container">
		<header class="tiers__head">
			<div class="section-head">
				<span class="idx">01 / 03</span>
				<span class="rule"></span>
				<span class="label">Two paths</span>
			</div>
			<div class="tiers__headrow">
				<h2 id="tiers-title" class="tiers__title" data-split {@attach splitReveal({ stagger: 0.03 })}>
					Same price. Pick the path your debt decides.
				</h2>
				<span class="tiers__badge">
					<span class="tiers__badge-dot" aria-hidden="true"></span>$697 / month · each
				</span>
			</div>
		</header>

		<div class="tiers__grid" data-anim-stagger {@attach reveal({ stagger: 0.14, y: 44 })}>
			{#each tiers as t, i (t.id)}
				{@const Icon = t.Icon}
				<article class="tier tier--{t.id}">
					<div class="tier__top">
						<span class="tier__ico" aria-hidden="true"><Icon size={26} weight="light" /></span>
						<span class="tier__idx num">0{i + 1} / 0{tiers.length}</span>
					</div>

					<h3 class="tier__name">{t.name}</h3>
					<p class="tier__for">
						<span class="tier__for-dot" aria-hidden="true"></span>{t.forWho}
					</p>

					<p class="tier__price">
						<span class="tier__cur">$</span><span class="num tier__amt">697</span><span
							class="tier__cad">/ month</span
						>
					</p>

					<span class="tier__focus">{t.focus}</span>

					<p class="tier__blurb">{t.blurb}</p>

					<div class="tier__cta">
						<Button href={BUY_URL} block>Book a breakthrough call</Button>
					</div>

					<hr class="tier__rule" />

					<ul class="tier__points">
						{#each t.points as point (point)}
							<li class="tier__point">
								<span class="tier__pico"><CheckIcon weight="bold" size={15} /></span>
								<span class="tier__ptxt">{point}</span>
							</li>
						{/each}
					</ul>
				</article>
			{/each}
		</div>
	</div>
</section>

<!-- ===================== PROCESS ===================== -->
<section id="process" class="proc tt-section" aria-labelledby="proc-title">
	<span class="proc__glow" aria-hidden="true"></span>

	<div class="tt-container">
		<header class="proc__head">
			<div class="section-head">
				<span class="idx">02 / 03</span>
				<span class="rule"></span>
				<span class="label">How it works</span>
			</div>
			<h2 id="proc-title" class="proc__title" data-split {@attach splitReveal({ stagger: 0.03 })}>
				Three steps to a plan you actually follow.
			</h2>
			<p class="proc__intro prose">
				No spreadsheets to figure out alone, no generic templates. It’s your numbers, a real coach,
				and ninety days of structured collaboration.
			</p>
		</header>

		<ol class="proc__ladder" data-anim-stagger {@attach reveal({ stagger: 0.12, y: 40 })}>
			{#each steps as step (step.n)}
				{@const Icon = step.Icon}
				<li class="proc__step">
					<span class="proc__num num" aria-hidden="true">{step.n}</span>
					<span class="proc__ico" aria-hidden="true"><Icon size={26} weight="light" /></span>
					<h3 class="proc__name">{step.name}</h3>
					<p class="proc__body">{step.body}</p>
				</li>
			{/each}
		</ol>
	</div>
</section>

<!-- ===================== INCLUSIONS ===================== -->
<section class="inc tt-section" aria-labelledby="inc-title">
	<div class="tt-container">
		<header class="inc__head">
			<div class="section-head">
				<span class="idx">03 / 03</span>
				<span class="rule"></span>
				<span class="label">What’s included</span>
			</div>
			<h2 id="inc-title" class="inc__title" data-split {@attach splitReveal({ stagger: 0.03 })}>
				Everything the engagement covers.
			</h2>
		</header>

		<ul class="inc__grid" data-anim-stagger {@attach reveal({ stagger: 0.08, y: 28 })}>
			{#each includes as item (item.t)}
				{@const Icon = item.Icon}
				<li class="inc__item">
					<span class="inc__ico" aria-hidden="true"><Icon size={24} weight="light" /></span>
					<h3 class="inc__itemtitle">{item.t}</h3>
					<p class="inc__itembody">{item.d}</p>
				</li>
			{/each}
		</ul>

		<div class="inc__disclaimer" role="note">
			<WarningIcon class="inc__disclaimer-ico" weight="fill" size={20} />
			<p>
				<strong>Polaris is educational coaching, not accounting or tax advice.</strong> Results vary;
				most day traders lose money.
			</p>
		</div>
	</div>
</section>

<!-- ===================== FINAL CTA ===================== -->
<section class="fcta tt-section" aria-labelledby="fcta-title">
	<div class="fcta__bg" aria-hidden="true">
		<div class="fcta__grid grid-bg"></div>
		<div class="fcta__glow" {@attach parallax(-70)}></div>
	</div>

	<div class="tt-container fcta__inner">
		<p class="label fcta__kicker">
			<span class="fcta__kicker-rule" aria-hidden="true"></span>Your ninety days
		</p>
		<h2 id="fcta-title" class="fcta__title" data-split {@attach splitReveal({ stagger: 0.035 })}>
			The strongest traders manage the <span class="text-red">money</span> first.
		</h2>
		<p class="fcta__lede" data-anim {@attach reveal({ y: 22 })}>
			It starts with one call — an honest look at your finances, your goals, and the plan to get you
			there.
		</p>
		<div class="fcta__cta" data-anim {@attach reveal({ y: 22, delay: 0.05 })}>
			<Button href={BUY_URL} size="lg">Book a breakthrough call</Button>
		</div>
	</div>
</section>

<style>
	/* ===================== HERO ===================== */
	.phero {
		position: relative;
		padding-top: calc(var(--tt-header-h) + clamp(2rem, 6vw, 5rem));
		padding-bottom: clamp(3rem, 6vw, 5rem);
		overflow: clip;
	}
	.phero__bg {
		position: absolute;
		inset: 0;
		z-index: 0;
	}
	.phero__grid {
		position: absolute;
		inset: -10% 0 0;
		opacity: 0.45;
	}
	.phero__glow {
		position: absolute;
		top: -18%;
		right: -12%;
		width: 68vw;
		height: 68vw;
		max-width: 860px;
		max-height: 860px;
		background: radial-gradient(circle, rgba(178, 39, 37, 0.38), transparent 62%);
		filter: blur(22px);
	}
	.phero__inner {
		position: relative;
		z-index: 1;
		display: grid;
		gap: clamp(2.5rem, 5vw, 4rem);
		align-items: center;
	}
	.phero__eyebrow {
		gap: 0.5em;
	}
	.phero__title {
		margin-top: 1.5rem;
		font-size: var(--fs-h1);
		font-weight: 800;
		letter-spacing: -0.03em;
		line-height: 0.98;
		color: #fff;
		max-width: 14ch;
	}
	.phero__lede {
		margin-top: 1.7rem;
		max-width: 54ch;
		font-size: var(--fs-lead);
		color: var(--tt-fog);
	}
	.phero__lede strong {
		color: #fff;
		font-weight: 600;
	}
	.phero__cta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.9rem;
		margin-top: 2.1rem;
	}
	.phero__spec {
		position: relative;
		padding: clamp(1.5rem, 3vw, 2.1rem);
		border: 1px solid var(--tt-line);
		border-radius: var(--tt-radius-lg);
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent 45%),
			var(--tt-ink-2);
		box-shadow: var(--tt-shadow-card);
	}
	.phero__spec-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1.2rem;
	}
	.phero__compass {
		display: grid;
		place-items: center;
		width: 38px;
		height: 38px;
		border-radius: 10px;
		color: var(--tt-gold);
		border: 1px solid var(--tt-line);
		background: rgba(245, 196, 81, 0.08);
	}
	.phero__spec-list {
		margin: 0;
		display: flex;
		flex-direction: column;
	}
	.phero__spec-row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.85rem 0;
		border-top: 1px solid var(--tt-line);
	}
	.phero__spec-row:first-child {
		border-top: 0;
	}
	.phero__spec-k {
		color: var(--tt-mute);
	}
	.phero__spec-v {
		font-family: var(--tt-font-body);
		font-weight: 600;
		font-size: 0.98rem;
		color: var(--tt-white);
		text-align: right;
	}
	.phero__spec-band {
		margin-top: 1.4rem;
		padding-top: 1.1rem;
		border-top: 1px solid var(--tt-line);
		font-size: 0.68rem;
		letter-spacing: 0.22em;
		color: var(--tt-gold);
	}
	@media (min-width: 940px) {
		.phero__inner {
			grid-template-columns: 1.1fr 0.9fr;
		}
	}

	/* ===================== TIERS ===================== */
	.tiers {
		position: relative;
		background: var(--tt-ink);
		overflow: clip;
		box-shadow:
			inset 0 1px 0 var(--tt-line),
			inset 0 -1px 0 var(--tt-line);
	}
	.tiers__glow {
		position: absolute;
		z-index: 0;
		top: 14%;
		left: -8%;
		width: 46vw;
		max-width: 620px;
		aspect-ratio: 1;
		background: radial-gradient(circle, rgba(178, 39, 37, 0.18), transparent 62%);
		filter: blur(12px);
		pointer-events: none;
	}
	.tiers .tt-container {
		position: relative;
		z-index: 1;
	}
	.tiers__head {
		margin-bottom: clamp(2.4rem, 5vw, 3.6rem);
	}
	.tiers__headrow {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: space-between;
		gap: 1.2rem;
		margin-top: 0.4rem;
	}
	.tiers__title {
		font-size: var(--fs-h2);
		max-width: 18ch;
	}
	.tiers__badge {
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
	.tiers__badge-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--tt-gold);
		box-shadow: 0 0 10px var(--tt-gold);
	}

	.tiers__grid {
		display: grid;
		gap: clamp(1.3rem, 3vw, 1.9rem);
	}

	.tier {
		--accent: var(--tt-red-bright);
		--accent-soft: rgba(178, 39, 37, 0.4);
		position: relative;
		display: flex;
		flex-direction: column;
		padding: clamp(1.6rem, 3vw, 2.3rem);
		border: 1px solid var(--tt-line);
		border-top: 2px solid var(--accent-soft);
		border-radius: var(--tt-radius-lg);
		background: var(--tt-ink-2);
		box-shadow: var(--tt-shadow-card);
	}
	.tier--launch {
		--accent: var(--tt-gold);
		--accent-soft: rgba(245, 196, 81, 0.5);
	}

	.tier__top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1.2rem;
	}
	.tier__ico {
		display: grid;
		place-items: center;
		width: 48px;
		height: 48px;
		border-radius: 12px;
		color: var(--accent);
		border: 1px solid var(--tt-line);
		background: rgba(255, 255, 255, 0.02);
	}
	.tier__idx {
		font-size: 0.7rem;
		letter-spacing: 0.18em;
		color: var(--tt-mute);
	}
	.tier__name {
		font-size: var(--fs-h3);
		color: var(--tt-white);
	}
	.tier__for {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		margin-top: 0.7rem;
		font-family: var(--tt-font-mono);
		font-size: 0.74rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--accent);
	}
	.tier__for-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--accent);
		box-shadow: 0 0 10px var(--accent);
	}

	.tier__price {
		display: flex;
		align-items: baseline;
		gap: 0.12rem;
		margin-top: 1.4rem;
		color: var(--tt-white);
	}
	.tier__cur {
		align-self: flex-start;
		margin-top: 0.4rem;
		font-size: 1.4rem;
		font-weight: 700;
		color: var(--tt-fog);
	}
	.tier__amt {
		font-size: clamp(2.8rem, 1.8rem + 3vw, 3.8rem);
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.03em;
	}
	.tier__cad {
		margin-left: 0.3rem;
		font-family: var(--tt-font-mono);
		font-size: 0.85rem;
		color: var(--tt-mute);
	}

	.tier__focus {
		align-self: flex-start;
		margin-top: 1rem;
		padding: 0.4rem 0.85rem;
		font-family: var(--tt-font-mono);
		font-size: 0.68rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--tt-fog);
		border: 1px solid var(--accent-soft);
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.02);
	}

	.tier__blurb {
		margin-top: 1.2rem;
		max-width: 42ch;
		color: var(--tt-fog);
		font-size: 0.98rem;
	}
	.tier__cta {
		margin-top: 1.6rem;
	}
	.tier__rule {
		margin: 1.6rem 0 1.2rem;
		border: 0;
		height: 1px;
		background: var(--tt-line);
	}
	.tier__points {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.72rem;
	}
	.tier__point {
		display: flex;
		align-items: flex-start;
		gap: 0.7rem;
	}
	.tier__pico {
		display: flex;
		flex: none;
		margin-top: 0.16em;
		color: var(--accent);
	}
	.tier__ptxt {
		font-size: 0.92rem;
		line-height: 1.5;
		color: var(--tt-fog);
	}

	@media (min-width: 820px) {
		.tiers__grid {
			grid-template-columns: 1fr 1fr;
			align-items: start;
		}
	}

	/* ===================== PROCESS ===================== */
	.proc {
		position: relative;
		overflow: clip;
	}
	.proc__glow {
		position: absolute;
		top: 10%;
		right: -10%;
		width: 44vw;
		height: 44vw;
		max-width: 600px;
		max-height: 600px;
		z-index: 0;
		pointer-events: none;
		background: radial-gradient(circle, rgba(178, 39, 37, 0.14), transparent 64%);
		filter: blur(26px);
	}
	.proc .tt-container {
		position: relative;
		z-index: 1;
	}
	.proc__head {
		max-width: 760px;
		margin-bottom: clamp(2.5rem, 5vw, 4rem);
	}
	.proc__title {
		font-size: var(--fs-h2);
		max-width: 18ch;
	}
	.proc__intro {
		margin-top: 1.3rem;
	}

	.proc__ladder {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: clamp(1.3rem, 3vw, 1.9rem);
	}
	.proc__step {
		position: relative;
		padding: clamp(1.6rem, 3vw, 2.3rem);
		border: 1px solid var(--tt-line);
		border-radius: var(--tt-radius-lg);
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent);
		overflow: hidden;
	}
	.proc__num {
		display: block;
		font-size: clamp(2.4rem, 1.6rem + 3vw, 3.6rem);
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.04em;
		color: transparent;
		-webkit-text-stroke: 1px var(--tt-line-strong);
	}
	.proc__ico {
		display: grid;
		place-items: center;
		width: 48px;
		height: 48px;
		margin-top: 1.2rem;
		border-radius: 12px;
		color: var(--tt-red-bright);
		border: 1px solid rgba(178, 39, 37, 0.35);
		background: rgba(178, 39, 37, 0.06);
	}
	.proc__name {
		margin-top: 1.2rem;
		font-size: var(--fs-h4);
		font-weight: 700;
		color: var(--tt-white);
	}
	.proc__body {
		margin-top: 0.8rem;
		max-width: 46ch;
		color: var(--tt-fog);
		font-size: 0.96rem;
	}

	@media (min-width: 820px) {
		.proc__ladder {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	/* ===================== INCLUSIONS ===================== */
	.inc {
		position: relative;
		background: var(--tt-ink);
		border-top: 1px solid var(--tt-line);
		border-bottom: 1px solid var(--tt-line);
		overflow: clip;
	}
	.inc__head {
		max-width: 760px;
		margin-bottom: clamp(2.4rem, 5vw, 3.6rem);
	}
	.inc__title {
		font-size: var(--fs-h2);
		max-width: 16ch;
	}
	.inc__grid {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 1px;
		background: var(--tt-line);
		border: 1px solid var(--tt-line);
		border-radius: var(--tt-radius-lg);
		overflow: hidden;
	}
	.inc__item {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: clamp(1.5rem, 3vw, 2rem);
		background: var(--tt-ink);
	}
	.inc__ico {
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border-radius: 11px;
		color: var(--tt-fog);
		border: 1px solid var(--tt-line);
		background: rgba(255, 255, 255, 0.02);
	}
	.inc__itemtitle {
		font-size: var(--fs-h4);
		font-weight: 700;
		line-height: 1.2;
		color: var(--tt-white);
	}
	.inc__itembody {
		max-width: 40ch;
		font-size: 0.94rem;
		color: var(--tt-mute);
	}

	.inc__disclaimer {
		display: flex;
		align-items: flex-start;
		gap: 0.8rem;
		margin-top: clamp(2rem, 4vw, 3rem);
		padding: 1.2rem 1.4rem;
		border: 1px solid rgba(245, 196, 81, 0.3);
		border-radius: var(--tt-radius);
		background: rgba(245, 196, 81, 0.05);
	}
	:global(.inc__disclaimer-ico) {
		flex: none;
		margin-top: 0.1em;
		color: var(--tt-gold);
	}
	.inc__disclaimer p {
		font-size: 0.9rem;
		color: var(--tt-fog);
		line-height: 1.6;
	}
	.inc__disclaimer strong {
		color: var(--tt-white);
		font-weight: 600;
	}

	@media (min-width: 640px) {
		.inc__grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	@media (min-width: 960px) {
		.inc__grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	/* ===================== FINAL CTA ===================== */
	.fcta {
		position: relative;
		overflow: clip;
		background: var(--tt-black);
		text-align: center;
	}
	.fcta__bg {
		position: absolute;
		inset: 0;
		z-index: 0;
	}
	.fcta__grid {
		position: absolute;
		inset: 0;
		opacity: 0.35;
	}
	.fcta__glow {
		position: absolute;
		left: 50%;
		bottom: -55%;
		width: min(1400px, 130vw);
		height: 105vh;
		transform: translateX(-50%);
		background: radial-gradient(
			ellipse 46% 60% at 50% 100%,
			rgba(255, 51, 51, 0.3),
			rgba(178, 39, 37, 0.4) 24%,
			transparent 66%
		);
		filter: blur(24px);
	}
	.fcta__inner {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		max-width: 60rem;
	}
	.fcta__kicker {
		display: inline-flex;
		align-items: center;
		gap: 0.9rem;
		color: var(--tt-mute);
	}
	.fcta__kicker-rule {
		width: 40px;
		height: 1px;
		background: var(--tt-red);
	}
	.fcta__title {
		margin-top: 1.6rem;
		font-size: var(--fs-h1);
		font-weight: 800;
		line-height: 0.98;
		letter-spacing: -0.03em;
		max-width: 18ch;
	}
	.fcta__lede {
		margin-top: 1.7rem;
		max-width: 46ch;
		font-size: var(--fs-lead);
		color: var(--tt-fog);
	}
	.fcta__cta {
		margin-top: 2.4rem;
	}
</style>
