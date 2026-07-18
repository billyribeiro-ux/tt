<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import Button from '$lib/components/Button.svelte';
	import { site } from '$lib/data/site';
	import { reveal, splitReveal, parallax, scrollToTarget } from '$lib/motion';

	import BrainIcon from 'phosphor-svelte/lib/BrainIcon';
	import WaveformIcon from 'phosphor-svelte/lib/WaveformIcon';
	import PulseIcon from 'phosphor-svelte/lib/PulseIcon';
	import ChartLineUpIcon from 'phosphor-svelte/lib/ChartLineUpIcon';
	import GraduationCapIcon from 'phosphor-svelte/lib/GraduationCapIcon';
	import HeadphonesIcon from 'phosphor-svelte/lib/HeadphonesIcon';
	import SunHorizonIcon from 'phosphor-svelte/lib/SunHorizonIcon';
	import MoonStarsIcon from 'phosphor-svelte/lib/MoonStarsIcon';
	import FileArrowUpIcon from 'phosphor-svelte/lib/FileArrowUpIcon';
	import FlaskIcon from 'phosphor-svelte/lib/FlaskIcon';
	import BarbellIcon from 'phosphor-svelte/lib/BarbellIcon';
	import SealCheckIcon from 'phosphor-svelte/lib/SealCheckIcon';
	import CalendarBlankIcon from 'phosphor-svelte/lib/CalendarBlankIcon';
	import ShieldWarningIcon from 'phosphor-svelte/lib/ShieldWarningIcon';

	const applyUrl = 'https://tricktrades.com/project-alpha';

	// Study meta strip — every value is a stated fact from the protocol.
	const meta = [
		{ k: 'Principal Investigator', v: 'Dr. Olav Krigolson, PhD' },
		{ k: 'Participants', v: '30', note: 'subject to change' },
		{ k: 'Duration', v: '90 days', note: '+ 180-day follow-up' },
		{ k: 'Target band', v: '8–12 Hz', note: 'alpha rhythm' }
	];

	// What the hypothesis predicts, versus each trader's own baseline.
	const predictions = [
		'Reduced emotional reactivity under live-market pressure',
		'Improved execution and shorter learning curves',
		'Greater decision consistency, day to day',
		'A measurable shift toward a calmer, more focused baseline'
	];

	const equipment = [
		{
			icon: BrainIcon,
			name: 'Muse S / Muse S Athena',
			tag: 'Yours to keep',
			detail:
				'A soft EEG headband that reads brainwave activity for daily training and live in-session monitoring.'
		},
		{
			icon: WaveformIcon,
			name: 'The MUSE App',
			tag: 'Exports CSV',
			detail:
				'Runs the guided biofeedback sessions and exports the raw EEG as CSV for de-identified analysis.'
		},
		{
			icon: ChartLineUpIcon,
			name: 'Funded trading account',
			tag: 'One-contract sizing',
			detail:
				'An options-capable brokerage account, standardized to one-contract sizing so results compare cleanly.'
		},
		{
			icon: GraduationCapIcon,
			name: 'Trick Trades membership',
			tag: 'CORE ALPHA access',
			detail: 'CORE ALPHA access, the structured trade journal, and the full education library.'
		}
	];

	const pillars = [
		{
			icon: BrainIcon,
			cadence: '10–15 min · daily',
			title: 'Daily MUSE Training',
			body: 'Guided EEG biofeedback with the Muse S headband trains the brain to find, and hold, a calm alpha state on demand — the raw material of every other pillar.'
		},
		{
			icon: HeadphonesIcon,
			cadence: '15–30 min · pre-open',
			title: 'CORE ALPHA Session',
			body: 'A proprietary binaural meditation run before the open primes the alpha band, so you step into the session regulated rather than reactive.'
		},
		{
			icon: PulseIcon,
			cadence: 'live · market hours',
			title: 'Live EEG Monitoring',
			body: 'Mind Monitor streams your EEG in real time while you trade, capturing exactly how your brain state moves with every decision, entry, and exit.'
		}
	];

	// The 90-day ladder — the centrepiece. Active phase lights as you scroll.
	const phases = [
		{
			icon: FlaskIcon,
			tag: 'Preloading',
			window: 'Days −7 to −1',
			title: 'Setup & Baseline',
			lead: 'Before the clock starts, we capture who you are cold — an honest reference point for everything that follows.',
			items: [
				'Fit the Muse S / Athena; install the MUSE and Mind Monitor apps',
				'Baseline brain snapshot — resting EEG recorded before any training',
				'Intake questionnaire; funded, options-capable account confirmed',
				'CORE ALPHA membership activated'
			]
		},
		{
			icon: BrainIcon,
			tag: 'Phase 1',
			window: 'Days 1–30',
			title: 'Foundation',
			lead: 'The full daily rhythm goes live. You rehearse on paper first, then commit real capital once the protocol is habit.',
			items: [
				'Days 1–5: paper trading only — protocol rehearsal, no capital at risk',
				'Day 6 onward: live, one-contract execution',
				'Daily MUSE biofeedback + the CORE ALPHA pre-market session',
				'Live EEG monitored during every trading session'
			]
		},
		{
			icon: BarbellIcon,
			tag: 'Phase 2',
			window: 'Days 31–60',
			title: 'Strength',
			lead: 'A second training load is layered on, and a mid-study assessment checks whether the trajectory is holding.',
			items: [
				'Add MUSE STRENGTH training to the daily block',
				'Full pre-market → live → post-market protocol continues',
				'Day 45: mid-study assessment and brain snapshot',
				'Journaling deepens — separate emotion from execution'
			]
		},
		{
			icon: SealCheckIcon,
			tag: 'Phase 3',
			window: 'Days 61–90',
			title: 'Full Protocol',
			lead: 'Every pillar runs at full load, closing with a final assessment and the complete, de-identified data submission.',
			items: [
				'Complete protocol at full intensity',
				'Day 90: final assessment and closing brain snapshot',
				'Full de-identified data set submitted for analysis',
				'Consistency scored against the Day 0 baseline'
			]
		}
	];

	const routine = [
		{
			icon: SunHorizonIcon,
			when: 'Pre-market',
			task: 'CORE ALPHA meditation + chart review',
			note: 'Enter the open regulated, with a plan already in hand.'
		},
		{
			icon: WaveformIcon,
			when: 'Market hours',
			task: 'Headband on, live EEG streaming as you trade',
			note: 'One-contract sizing; the protocol runs the session, not emotion.'
		},
		{
			icon: FileArrowUpIcon,
			when: 'Post-market',
			task: 'Export EEG data + journal every trade',
			note: 'De-identified CSV uploaded; each trade tagged for review.'
		},
		{
			icon: MoonStarsIcon,
			when: 'Evening',
			task: 'MUSE biofeedback training block',
			note: '10–15 minutes to reinforce the alpha state before sleep.'
		}
	];

	const disclosures = [
		'Day trading involves substantial risk of financial loss. This study does not guarantee improved performance or profitability.',
		'All data is de-identified before analysis; individual results are never published in an identifiable form.',
		'Participation is entirely voluntary and may be withdrawn at any time — with no consequence to your Trick Trades membership.',
		'Participants are asked to maintain roughly 80% protocol adherence for their data to remain in the study.'
	];

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'ResearchProject',
		name: 'Project ALPHA — Alpha Brainwave Training Study',
		url: applyUrl,
		description:
			'A 90-day neuroscience research study investigating whether alpha-brainwave (8–12 Hz) training improves day-trading performance, emotional regulation, and decision consistency.',
		member: {
			'@type': 'Person',
			name: 'Dr. Olav Krigolson',
			honorificSuffix: 'PhD',
			jobTitle: 'Principal Investigator'
		},
		funder: { '@type': 'Organization', name: site.name, url: site.domain },
		parentOrganization: { '@type': 'Organization', name: site.name, url: site.domain },
		knowsAbout: [
			'Alpha brainwave training',
			'EEG neurofeedback',
			'Trading psychology',
			'Emotional regulation',
			'Decision consistency'
		]
	};

	// Scroll-linked highlight for the phase ladder (mirrors the Formula section).
	let phaseListEl: HTMLElement | undefined = $state();
	let activePhase = $state(0);

	$effect(() => {
		if (!phaseListEl || typeof IntersectionObserver === 'undefined') return;
		const els = Array.from(phaseListEl.querySelectorAll<HTMLElement>('[data-step]'));
		if (!els.length) return;
		const io = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						const idx = Number((entry.target as HTMLElement).dataset.step);
						if (!Number.isNaN(idx)) activePhase = idx;
					}
				}
			},
			{ rootMargin: '-48% 0px -48% 0px', threshold: 0 }
		);
		els.forEach((el) => io.observe(el));
		return () => io.disconnect();
	});

	function jump(e: MouseEvent, href: string) {
		e.preventDefault();
		scrollToTarget(href);
	}
</script>

<Seo
	title="Project ALPHA — Alpha Brainwave Training Study | Trick Trades"
	description="Project ALPHA is a 90-day neuroscience research study led by Dr. Olav Krigolson, PhD, testing whether alpha-brainwave (8–12 Hz) training improves day-trading performance, emotional regulation, and decision consistency."
	path="/project-alpha"
	{jsonLd}
/>

<!-- ============================ HERO ============================ -->
<section class="pa-hero" aria-label="Project ALPHA">
	<div class="pa-hero__bg" aria-hidden="true">
		<div class="pa-hero__grid grid-bg"></div>
		<div class="pa-hero__glow" {@attach parallax(120)}></div>
	</div>

	<div class="tt-container pa-hero__inner">
		<div class="pa-hero__copy">
			<p class="pa-hero__kicker label">
				<span class="pa-hero__live" aria-hidden="true"></span>Neuroscience × Trading
			</p>

			<h1 class="pa-hero__title" data-split {@attach splitReveal({ stagger: 0.03 })}>
				Project <span class="text-red">ALPHA</span>
			</h1>

			<div class="pa-hero__stack" data-anim-stagger {@attach reveal({ stagger: 0.12, y: 26 })}>
				<p class="pa-hero__lede">
					A <strong>90-day neuroscience study</strong> testing a single question: can training the
					brain’s alpha rhythm — the <strong>8–12 Hz</strong> band tied to calm, alert focus — make
					day traders steadier under pressure, sharper in execution, and more consistent from one
					session to the next?
				</p>

				<div class="pa-hero__cta">
					<Button href={applyUrl}>Apply / Learn more</Button>
					<Button href="#protocol" variant="ghost" onclick={(e) => jump(e, '#protocol')}>
						See the 90-day protocol
					</Button>
				</div>

				<dl class="pa-hero__meta">
					{#each meta as m, i (m.k)}
						{#if i > 0}<span class="pa-hero__meta-sep" aria-hidden="true"></span>{/if}
						<div class="pa-hero__meta-item">
							<dt class="label">{m.k}</dt>
							<dd class="num">
								{m.v}{#if m.note}<span class="pa-hero__meta-note"> {m.note}</span>{/if}
							</dd>
						</div>
					{/each}
				</dl>
			</div>
		</div>

		<!-- Illustrative EEG monitor — decorative, clearly labelled as not real data. -->
		<div
			class="pa-hero__panel"
			aria-hidden="true"
			{@attach parallax(-40)}
			data-anim
			{@attach reveal({ y: 60, scale: 0.97, duration: 1.2 })}
		>
			<div class="pa-panel__head">
				<span class="label pa-panel__tag"><span class="pa-panel__dot"></span>Live EEG · Mind Monitor</span>
				<span class="label pa-panel__band">α 8–12 Hz</span>
			</div>
			<div class="pa-panel__wave">
				<svg viewBox="0 0 620 180" preserveAspectRatio="none" role="presentation">
					<path
						class="pa-wave pa-wave--ghost"
						d="M0 96 C 34 40, 68 40, 102 96 S 170 152, 204 96 S 272 40, 306 96 S 374 152, 408 96 S 476 40, 510 96 S 578 152, 620 96"
					/>
					<path
						class="pa-wave pa-wave--live"
						d="M0 92 C 40 30, 78 150, 118 92 S 196 26, 236 92 S 314 150, 354 92 S 432 30, 472 92 S 552 150, 620 92"
					/>
				</svg>
			</div>
			<dl class="pa-panel__readout">
				<div><dt>Band</dt><dd>Alpha</dd></div>
				<div><dt>Range</dt><dd>8–12 Hz</dd></div>
				<div><dt>State</dt><dd>Focused calm</dd></div>
			</dl>
			<p class="pa-panel__note label">Illustrative — not participant data</p>
		</div>
	</div>
</section>

<!-- ========================= HYPOTHESIS ========================= -->
<section class="tt-section pa-hyp" aria-labelledby="pa-hyp-title">
	<div class="tt-container">
		<header class="section-head">
			<span class="idx">01 / 05</span>
			<span class="rule"></span>
			<span class="label">The hypothesis</span>
		</header>

		<div class="pa-hyp__grid">
			<div class="pa-hyp__lead">
				<h2 id="pa-hyp-title" class="pa-hyp__title" data-split {@attach splitReveal({ stagger: 0.03 })}>
					Traders who hold an alpha state should trade like <span class="text-red">different people.</span>
				</h2>
				<p class="pa-hyp__note prose">
					The premise is narrow on purpose. We are not claiming a headband makes anyone profitable.
					We are testing whether a trained, repeatable alpha state measurably lowers emotional
					reactivity and tightens decision-making — each participant judged against their own Day 0
					baseline, not against anyone else.
				</p>
			</div>

			<ul class="pa-hyp__list" data-anim-stagger {@attach reveal({ stagger: 0.1, y: 26 })}>
				{#each predictions as p, i (p)}
					<li class="pa-hyp__item">
						<span class="pa-hyp__num num">H{i + 1}</span>
						<span class="pa-hyp__text">{p}</span>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</section>

<!-- ========================= EQUIPMENT ========================= -->
<section class="tt-section pa-eq" aria-labelledby="pa-eq-title">
	<div class="tt-container">
		<header class="section-head">
			<span class="idx">02 / 05</span>
			<span class="rule"></span>
			<span class="label">What you’ll use</span>
		</header>

		<div class="pa-eq__head">
			<h2 id="pa-eq-title" class="pa-eq__title">The kit each participant runs</h2>
			<p class="pa-eq__intro prose">
				Four things make the protocol work. The hardware is yours to keep; the rest is standardized so
				every participant’s data reads the same way.
			</p>
		</div>

		<ul class="pa-eq__grid" data-anim-stagger {@attach reveal({ stagger: 0.1, y: 34 })}>
			{#each equipment as item (item.name)}
				{@const Icon = item.icon}
				<li class="pa-eq__card">
					<span class="pa-eq__icon"><Icon size={22} weight="regular" /></span>
					<span class="pa-eq__tag label">{item.tag}</span>
					<h3 class="pa-eq__name">{item.name}</h3>
					<p class="pa-eq__detail">{item.detail}</p>
				</li>
			{/each}
		</ul>
	</div>
</section>

<!-- ========================== PILLARS ========================== -->
<section class="tt-section pa-pil" aria-labelledby="pa-pil-title">
	<span class="pa-pil__glow" aria-hidden="true"></span>
	<div class="tt-container">
		<header class="section-head">
			<span class="idx">03 / 05</span>
			<span class="rule"></span>
			<span class="label">Three training pillars</span>
		</header>

		<h2 id="pa-pil-title" class="pa-pil__title" data-split {@attach splitReveal({ stagger: 0.03 })}>
			One discipline, practised three ways
		</h2>

		<ol class="pa-pil__list">
			{#each pillars as p, i (p.title)}
				{@const Icon = p.icon}
				<li class="pa-pil__step" data-anim {@attach reveal({ y: 44, duration: 1, delay: i * 0.08 })}>
					<div class="pa-pil__top">
						<span class="pa-pil__idx num">0{i + 1}</span>
						<span class="pa-pil__icon"><Icon size={24} weight="regular" /></span>
						<span class="pa-pil__cadence label">{p.cadence}</span>
					</div>
					<h3 class="pa-pil__name">{p.title}</h3>
					<p class="pa-pil__body">{p.body}</p>
				</li>
			{/each}
		</ol>
	</div>
</section>

<!-- ======================= PHASE TIMELINE ====================== -->
<section id="protocol" class="tt-section pa-tl" aria-labelledby="pa-tl-title">
	<div class="pa-tl__bg grid-bg" aria-hidden="true"></div>
	<span class="pa-tl__glow" aria-hidden="true"></span>

	<div class="tt-container">
		<header class="pa-tl__head">
			<p class="label pa-tl__kicker"><span class="pa-tl__tick" aria-hidden="true"></span>The protocol</p>
			<h2 id="pa-tl-title" class="pa-tl__title" data-split {@attach splitReveal({ stagger: 0.03 })}>
				Ninety days, <span class="text-red">four phases</span>
			</h2>
			<p class="pa-tl__intro prose">
				The study builds in deliberate steps — a cold baseline first, then load added phase by phase,
				so any change can be traced to the protocol rather than to chance.
			</p>
		</header>

		<div class="pa-tl__grid">
			<!-- Sticky rail: the four phases, active one lit -->
			<aside class="pa-tl__rail" aria-hidden="true">
				<span class="label pa-tl__rail-tag">The 4 phases</span>
				<ol class="pa-tl__rail-list">
					{#each phases as p, i (p.tag)}
						<li class="pa-tl__rail-item" class:is-active={activePhase === i}>
							<span class="pa-tl__rail-idx num">0{i + 1}</span>
							<span class="pa-tl__rail-label">{p.tag}</span>
						</li>
					{/each}
				</ol>
				<div class="pa-tl__progress">
					<span
						class="pa-tl__progress-bar"
						style:transform="scaleY({(activePhase + 1) / phases.length})"
					></span>
				</div>
			</aside>

			<!-- The four phases -->
			<ol class="pa-tl__steps" bind:this={phaseListEl}>
				{#each phases as p, i (p.tag)}
					{@const Icon = p.icon}
					<li
						class="pa-tl__step"
						class:is-active={activePhase === i}
						data-step={i}
						data-anim
						{@attach reveal({ y: 48, duration: 1 })}
					>
						<span class="pa-tl__step-num num" aria-hidden="true">0{i + 1}</span>
						<div class="pa-tl__step-body">
							<div class="pa-tl__step-top">
								<span class="pa-tl__step-icon"><Icon size={22} weight="regular" /></span>
								<span class="pa-tl__step-tag label">{p.tag}</span>
								<span class="pa-tl__step-window num">{p.window}</span>
							</div>
							<h3 class="pa-tl__step-title">{p.title}</h3>
							<p class="pa-tl__step-lead">{p.lead}</p>
							<ul class="pa-tl__step-items">
								{#each p.items as item (item)}
									<li>{item}</li>
								{/each}
							</ul>
						</div>
					</li>
				{/each}
			</ol>
		</div>

		<!-- Coda: the long-tail follow-up, offset from the ladder -->
		<div class="pa-tl__followup" data-anim {@attach reveal({ y: 30, duration: 1 })}>
			<span class="pa-tl__followup-icon"><CalendarBlankIcon size={22} weight="regular" /></span>
			<div>
				<p class="label pa-tl__followup-tag">Day 180 · Follow-up</p>
				<p class="pa-tl__followup-text">
					Three months after the protocol ends, participants return for a follow-up check — measuring
					what held, and what faded, once the daily structure was gone.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- ====================== DAILY COMMITMENT ===================== -->
<section class="tt-section pa-day" aria-labelledby="pa-day-title">
	<div class="tt-container">
		<header class="section-head">
			<span class="idx">04 / 05</span>
			<span class="rule"></span>
			<span class="label">The daily commitment</span>
		</header>

		<div class="pa-day__head">
			<h2 id="pa-day-title" class="pa-day__title">
				About <span class="text-red">45 minutes</span> a day, beyond your normal trading
			</h2>
			<p class="pa-day__intro prose">
				Consistency is the whole point, so the routine is fixed. It wraps around a trading day you’re
				already having — bookending the open and the close with training and data capture.
			</p>
		</div>

		<ol class="pa-day__list" data-anim-stagger {@attach reveal({ stagger: 0.1, y: 30 })}>
			{#each routine as r, i (r.when)}
				{@const Icon = r.icon}
				<li class="pa-day__item">
					<span class="pa-day__num num">0{i + 1}</span>
					<span class="pa-day__icon"><Icon size={22} weight="regular" /></span>
					<span class="pa-day__when label">{r.when}</span>
					<h3 class="pa-day__task">{r.task}</h3>
					<p class="pa-day__note">{r.note}</p>
				</li>
			{/each}
		</ol>
	</div>
</section>

<!-- ======================== DISCLOSURES ======================== -->
<section class="tt-section pa-disc" aria-labelledby="pa-disc-title">
	<div class="tt-container">
		<div class="pa-disc__panel" data-anim {@attach reveal({ y: 34, duration: 1 })}>
			<div class="pa-disc__head">
				<span class="pa-disc__icon"><ShieldWarningIcon size={26} weight="regular" /></span>
				<div>
					<span class="idx pa-disc__idx">05 / 05</span>
					<h2 id="pa-disc-title" class="pa-disc__title">The honest part</h2>
				</div>
			</div>

			<dl class="pa-disc__list">
				{#each disclosures as d, i (d)}
					<div class="pa-disc__item">
						<dt class="num">0{i + 1}</dt>
						<dd>{d}</dd>
					</div>
				{/each}
			</dl>

			<p class="pa-disc__foot">
				Project ALPHA is a genuine research study, not a marketing programme. Findings will be reported
				as the data supports them — no more, no less.
			</p>
		</div>
	</div>
</section>

<!-- ============================ CTA ============================ -->
<section class="tt-section pa-cta" aria-labelledby="pa-cta-title">
	<span class="pa-cta__glow" aria-hidden="true"></span>
	<div class="tt-container pa-cta__inner">
		<p class="pa-cta__kicker eyebrow">Now recruiting · 30 seats</p>
		<h2 id="pa-cta-title" class="pa-cta__title" data-split {@attach splitReveal({ stagger: 0.03 })}>
			Train the mind. Then measure it.
		</h2>
		<p class="pa-cta__text prose">
			If you’ll commit to 90 days, the headband, and honest data, we’d like you in the study. Read the
			full protocol and apply below.
		</p>
		<div class="pa-cta__actions">
			<Button href={applyUrl} size="lg">Apply / Learn more</Button>
		</div>
		<p class="pa-cta__fine label">
			Participation is voluntary and may be withdrawn at any time. Day trading involves substantial
			risk of financial loss.
		</p>
	</div>
</section>

<style>
	/* ============================ HERO ============================ */
	.pa-hero {
		position: relative;
		padding-top: calc(var(--tt-header-h) + clamp(2rem, 6vw, 5rem));
		padding-bottom: clamp(3rem, 6vw, 5rem);
		overflow: clip;
	}
	.pa-hero__bg {
		position: absolute;
		inset: 0;
		z-index: 0;
	}
	.pa-hero__grid {
		position: absolute;
		inset: -10% 0 0;
		opacity: 0.5;
	}
	.pa-hero__glow {
		position: absolute;
		top: -18%;
		right: -12%;
		width: 70vw;
		height: 70vw;
		max-width: 880px;
		max-height: 880px;
		background: radial-gradient(circle, rgba(178, 39, 37, 0.4), transparent 62%);
		filter: blur(20px);
	}
	.pa-hero__inner {
		position: relative;
		z-index: 1;
		display: grid;
		gap: clamp(2.5rem, 5vw, 4rem);
		align-items: center;
	}
	.pa-hero__kicker {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		color: var(--tt-fog);
	}
	.pa-hero__live {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--tt-red-bright);
		box-shadow: 0 0 12px var(--tt-red-bright);
	}
	.pa-hero__title {
		margin-top: 1.4rem;
		font-size: var(--fs-mega);
		font-weight: 800;
		letter-spacing: -0.04em;
		line-height: 0.9;
		color: #fff;
		text-transform: uppercase;
	}
	.pa-hero__lede {
		margin-top: 1.6rem;
		max-width: 54ch;
		font-size: var(--fs-lead);
		color: var(--tt-fog);
	}
	.pa-hero__lede strong {
		color: #fff;
		font-weight: 600;
	}
	.pa-hero__cta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.9rem;
		margin-top: 2rem;
	}
	.pa-hero__meta {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: 1.4rem;
		margin: 2.6rem 0 0;
		padding-top: 1.8rem;
		border-top: 1px solid var(--tt-line);
	}
	.pa-hero__meta-sep {
		align-self: stretch;
		width: 1px;
		background: var(--tt-line-strong);
	}
	.pa-hero__meta-item dt {
		color: var(--tt-mute-2);
	}
	.pa-hero__meta-item dd {
		margin: 0.5rem 0 0;
		font-size: clamp(1rem, 0.9rem + 0.5vw, 1.2rem);
		font-weight: 600;
		color: #fff;
		line-height: 1.15;
	}
	.pa-hero__meta-note {
		display: block;
		margin-top: 0.15rem;
		font-family: var(--tt-font-mono);
		font-size: 0.68rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--tt-red-bright);
	}

	/* Illustrative EEG monitor panel */
	.pa-hero__panel {
		position: relative;
		padding: clamp(1.2rem, 2.4vw, 1.7rem);
		border: 1px solid var(--tt-line-strong);
		border-radius: var(--tt-radius-lg);
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01));
		box-shadow: var(--tt-shadow-card);
	}
	.pa-panel__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}
	.pa-panel__tag {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--tt-fog);
	}
	.pa-panel__dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--tt-red-bright);
		box-shadow: 0 0 10px var(--tt-red-bright);
	}
	.pa-panel__band {
		color: var(--tt-gold);
	}
	.pa-panel__wave {
		margin: 1.1rem 0;
		height: clamp(120px, 22vw, 180px);
		border-radius: var(--tt-radius);
		border: 1px solid var(--tt-line);
		background:
			radial-gradient(120% 140% at 50% 0%, rgba(178, 39, 37, 0.12), transparent 60%),
			var(--tt-ink);
		overflow: hidden;
	}
	.pa-panel__wave svg {
		width: 100%;
		height: 100%;
	}
	.pa-wave {
		fill: none;
		stroke-linecap: round;
	}
	.pa-wave--ghost {
		stroke: var(--tt-line-strong);
		stroke-width: 1.5;
	}
	.pa-wave--live {
		stroke: var(--tt-red-bright);
		stroke-width: 2.5;
		filter: drop-shadow(0 0 6px rgba(255, 51, 51, 0.55));
	}
	.pa-panel__readout {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.75rem;
	}
	.pa-panel__readout div {
		padding: 0.75rem 0.85rem;
		border: 1px solid var(--tt-line);
		border-radius: 10px;
		background: rgba(255, 255, 255, 0.02);
	}
	.pa-panel__readout dt {
		font-family: var(--tt-font-mono);
		font-size: 0.62rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--tt-mute-2);
	}
	.pa-panel__readout dd {
		margin: 0.3rem 0 0;
		font-size: 0.95rem;
		font-weight: 600;
		color: #fff;
	}
	.pa-panel__note {
		margin-top: 1rem;
		color: var(--tt-mute-2);
		font-size: 0.62rem;
	}

	@media (min-width: 940px) {
		.pa-hero__inner {
			grid-template-columns: 1.05fr 0.95fr;
		}
	}

	/* ========================= HYPOTHESIS ========================= */
	.pa-hyp {
		background: var(--tt-black);
		overflow: clip;
	}
	.pa-hyp__grid {
		display: grid;
		gap: clamp(2.4rem, 5vw, 4rem);
	}
	.pa-hyp__title {
		font-size: var(--fs-h2);
		font-weight: 800;
		letter-spacing: -0.02em;
		color: #fff;
		max-width: 16ch;
	}
	.pa-hyp__note {
		margin-top: 1.4rem;
		font-size: var(--fs-body);
		max-width: 56ch;
	}
	.pa-hyp__list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0;
		align-self: start;
	}
	.pa-hyp__item {
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: baseline;
		gap: 1rem;
		padding: 1.15rem 0;
		border-top: 1px solid var(--tt-line);
	}
	.pa-hyp__item:last-child {
		border-bottom: 1px solid var(--tt-line);
	}
	.pa-hyp__num {
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--tt-red-bright);
	}
	.pa-hyp__text {
		font-size: var(--fs-h4);
		font-weight: 500;
		color: #fff;
		line-height: 1.3;
		letter-spacing: -0.01em;
	}

	@media (min-width: 900px) {
		.pa-hyp__grid {
			grid-template-columns: 1fr 1fr;
			align-items: start;
		}
	}

	/* ========================= EQUIPMENT ========================= */
	.pa-eq {
		background: var(--tt-ink);
	}
	.pa-eq__head {
		max-width: 720px;
		margin-bottom: clamp(2rem, 4vw, 3rem);
	}
	.pa-eq__title {
		font-size: var(--fs-h3);
		font-weight: 800;
		color: #fff;
	}
	.pa-eq__intro {
		margin-top: 1rem;
		font-size: var(--fs-body);
	}
	.pa-eq__grid {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 1rem;
		grid-template-columns: 1fr;
	}
	.pa-eq__card {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: clamp(1.4rem, 2.6vw, 1.9rem);
		border: 1px solid var(--tt-line);
		border-radius: var(--tt-radius-lg);
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent);
		transition:
			border-color 0.4s ease,
			transform 0.4s ease;
	}
	.pa-eq__card:hover {
		border-color: var(--tt-line-strong);
		transform: translateY(-3px);
	}
	.pa-eq__icon {
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border-radius: 11px;
		color: var(--tt-fog);
		border: 1px solid var(--tt-line);
		background: rgba(255, 255, 255, 0.02);
	}
	.pa-eq__tag {
		margin-top: 1.1rem;
		color: var(--tt-red-bright);
	}
	.pa-eq__name {
		margin-top: 0.55rem;
		font-size: var(--fs-h4);
		font-weight: 700;
		color: #fff;
		letter-spacing: -0.01em;
	}
	.pa-eq__detail {
		margin-top: 0.65rem;
		font-size: 0.94rem;
		color: var(--tt-mute);
	}

	@media (min-width: 640px) {
		.pa-eq__grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	@media (min-width: 1040px) {
		.pa-eq__grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	/* ========================== PILLARS ========================== */
	.pa-pil {
		position: relative;
		background: var(--tt-black);
		overflow: clip;
	}
	.pa-pil__glow {
		position: absolute;
		right: -14%;
		top: 12%;
		width: 52vw;
		height: 52vw;
		max-width: 660px;
		max-height: 660px;
		background: radial-gradient(circle, rgba(178, 39, 37, 0.2), transparent 64%);
		filter: blur(26px);
		pointer-events: none;
	}
	.pa-pil .tt-container {
		position: relative;
		z-index: 1;
	}
	.pa-pil__title {
		font-size: var(--fs-h2);
		font-weight: 800;
		color: #fff;
		max-width: 16ch;
		margin-bottom: clamp(2rem, 4vw, 3.2rem);
	}
	.pa-pil__list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 1.2rem;
	}
	.pa-pil__step {
		position: relative;
		padding: clamp(1.6rem, 3vw, 2.4rem);
		border: 1px solid var(--tt-line);
		border-radius: var(--tt-radius-lg);
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent);
	}
	.pa-pil__top {
		display: flex;
		align-items: center;
		gap: 0.9rem;
		margin-bottom: 1.1rem;
	}
	.pa-pil__idx {
		font-size: 1rem;
		font-weight: 700;
		color: var(--tt-red-bright);
	}
	.pa-pil__icon {
		display: grid;
		place-items: center;
		width: 42px;
		height: 42px;
		border-radius: 10px;
		color: #fff;
		border: 1px solid var(--tt-line-strong);
		background: rgba(255, 255, 255, 0.03);
	}
	.pa-pil__cadence {
		margin-left: auto;
		color: var(--tt-mute);
	}
	.pa-pil__name {
		font-size: var(--fs-h3);
		font-weight: 700;
		color: #fff;
		letter-spacing: -0.01em;
	}
	.pa-pil__body {
		margin-top: 0.8rem;
		max-width: 60ch;
		color: var(--tt-fog);
	}

	@media (min-width: 900px) {
		.pa-pil__list {
			grid-template-columns: repeat(3, 1fr);
			gap: 1.1rem;
		}
		.pa-pil__step {
			display: flex;
			flex-direction: column;
		}
		.pa-pil__cadence {
			margin-left: 0;
		}
		.pa-pil__top {
			flex-wrap: wrap;
		}
	}

	/* ======================= PHASE TIMELINE ====================== */
	.pa-tl {
		position: relative;
		overflow: clip;
		background: var(--tt-ink);
	}
	.pa-tl__bg {
		position: absolute;
		inset: 0;
		opacity: 0.35;
	}
	.pa-tl__glow {
		position: absolute;
		top: 18%;
		left: -12%;
		width: 46vw;
		height: 46vw;
		max-width: 640px;
		max-height: 640px;
		background: radial-gradient(circle, rgba(178, 39, 37, 0.26), transparent 64%);
		filter: blur(30px);
		pointer-events: none;
	}
	.pa-tl .tt-container {
		position: relative;
		z-index: 1;
	}
	.pa-tl__head {
		max-width: 760px;
		margin-bottom: clamp(2.5rem, 5vw, 4.5rem);
	}
	.pa-tl__kicker {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		color: var(--tt-fog);
	}
	.pa-tl__tick {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--tt-red-bright);
		box-shadow: 0 0 10px var(--tt-red-bright);
	}
	.pa-tl__title {
		margin-top: 1.1rem;
		font-size: var(--fs-h2);
		font-weight: 800;
		letter-spacing: -0.02em;
		color: #fff;
	}
	.pa-tl__intro {
		margin-top: 1.3rem;
	}
	.pa-tl__grid {
		position: relative;
		display: grid;
		gap: 2.5rem;
	}
	.pa-tl__rail {
		display: none;
	}
	.pa-tl__steps {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: clamp(1rem, 2vw, 1.5rem);
	}
	.pa-tl__step {
		position: relative;
		display: grid;
		grid-template-columns: auto 1fr;
		gap: clamp(1rem, 2.5vw, 1.8rem);
		padding: clamp(1.6rem, 3vw, 2.4rem);
		border: 1px solid var(--tt-line);
		border-radius: var(--tt-radius-lg);
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent);
		transition:
			border-color 0.5s ease,
			background 0.5s ease;
	}
	.pa-tl__step.is-active {
		border-color: rgba(178, 39, 37, 0.5);
		background: linear-gradient(180deg, rgba(178, 39, 37, 0.08), transparent);
	}
	.pa-tl__step-num {
		font-size: clamp(1.8rem, 1.2rem + 2vw, 2.8rem);
		font-weight: 800;
		line-height: 1;
		color: var(--tt-ink-3);
		transition: color 0.5s ease;
	}
	.pa-tl__step.is-active .pa-tl__step-num {
		color: var(--tt-red-bright);
	}
	.pa-tl__step-top {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.8rem;
		margin-bottom: 1rem;
	}
	.pa-tl__step-icon {
		display: grid;
		place-items: center;
		width: 40px;
		height: 40px;
		border-radius: 10px;
		color: var(--tt-fog);
		border: 1px solid var(--tt-line);
		background: rgba(255, 255, 255, 0.02);
		transition:
			color 0.4s ease,
			border-color 0.4s ease;
	}
	.pa-tl__step.is-active .pa-tl__step-icon {
		color: #fff;
		border-color: rgba(178, 39, 37, 0.6);
	}
	.pa-tl__step-tag {
		font-family: var(--tt-font-display);
		font-size: 0.95rem;
		letter-spacing: 0.14em;
		color: #fff;
	}
	.pa-tl__step-window {
		margin-left: auto;
		font-size: 0.8rem;
		letter-spacing: 0.02em;
		color: var(--tt-mute);
	}
	.pa-tl__step.is-active .pa-tl__step-window {
		color: var(--tt-red-bright);
	}
	.pa-tl__step-title {
		font-size: var(--fs-h3);
		font-weight: 700;
		color: #fff;
		letter-spacing: -0.01em;
	}
	.pa-tl__step-lead {
		margin-top: 0.7rem;
		font-size: var(--fs-lead);
		color: var(--tt-fog);
		max-width: 60ch;
	}
	.pa-tl__step-items {
		list-style: none;
		margin: 1.3rem 0 0;
		padding: 0;
		display: grid;
		gap: 0.65rem;
	}
	.pa-tl__step-items li {
		position: relative;
		padding-left: 1.4rem;
		font-size: 0.94rem;
		color: var(--tt-mute);
	}
	.pa-tl__step-items li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.62em;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--tt-red);
	}

	.pa-tl__followup {
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: center;
		gap: 1.2rem;
		margin-top: clamp(1.6rem, 3vw, 2.4rem);
		padding: clamp(1.4rem, 3vw, 2rem);
		border: 1px dashed var(--tt-line-strong);
		border-radius: var(--tt-radius-lg);
		background: rgba(255, 255, 255, 0.015);
	}
	.pa-tl__followup-icon {
		display: grid;
		place-items: center;
		width: 46px;
		height: 46px;
		border-radius: 11px;
		color: var(--tt-gold);
		border: 1px solid var(--tt-line);
		background: rgba(255, 255, 255, 0.02);
	}
	.pa-tl__followup-tag {
		color: var(--tt-gold);
	}
	.pa-tl__followup-text {
		margin-top: 0.35rem;
		max-width: 62ch;
		color: var(--tt-fog);
	}

	@media (min-width: 940px) {
		.pa-tl__grid {
			grid-template-columns: 260px 1fr;
			gap: clamp(3rem, 5vw, 5rem);
			align-items: start;
		}
		.pa-tl__rail {
			display: block;
			position: sticky;
			top: calc(var(--tt-header-h) + 3rem);
		}
		.pa-tl__rail-tag {
			display: block;
			margin-bottom: 1.4rem;
			color: var(--tt-mute-2);
		}
		.pa-tl__rail-list {
			list-style: none;
			margin: 0;
			padding: 0;
			display: grid;
			gap: 0.2rem;
		}
		.pa-tl__rail-item {
			display: flex;
			align-items: baseline;
			gap: 1rem;
			padding: 0.7rem 0;
			border-bottom: 1px solid var(--tt-line);
			opacity: 0.45;
			transition:
				opacity 0.4s ease,
				transform 0.4s ease;
		}
		.pa-tl__rail-item.is-active {
			opacity: 1;
			transform: translateX(6px);
		}
		.pa-tl__rail-idx {
			font-size: 0.78rem;
			color: var(--tt-mute);
		}
		.pa-tl__rail-item.is-active .pa-tl__rail-idx {
			color: var(--tt-red-bright);
		}
		.pa-tl__rail-label {
			font-family: var(--tt-font-display);
			font-size: 1.25rem;
			letter-spacing: 0.06em;
			color: #fff;
		}
		.pa-tl__progress {
			position: relative;
			margin-top: 1.6rem;
			margin-left: 2px;
			width: 2px;
			height: 120px;
			background: var(--tt-line);
			border-radius: 2px;
			overflow: hidden;
		}
		.pa-tl__progress-bar {
			position: absolute;
			inset: 0;
			transform-origin: top;
			background: linear-gradient(180deg, var(--tt-red-bright), var(--tt-red));
			transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
		}
	}

	/* ====================== DAILY COMMITMENT ===================== */
	.pa-day {
		background: var(--tt-black);
	}
	.pa-day__head {
		max-width: 720px;
		margin-bottom: clamp(2rem, 4vw, 3rem);
	}
	.pa-day__title {
		font-size: var(--fs-h3);
		font-weight: 800;
		color: #fff;
	}
	.pa-day__intro {
		margin-top: 1rem;
		font-size: var(--fs-body);
	}
	.pa-day__list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 1rem;
		grid-template-columns: 1fr;
		counter-reset: none;
	}
	.pa-day__item {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: clamp(1.4rem, 2.6vw, 1.8rem);
		border: 1px solid var(--tt-line);
		border-radius: var(--tt-radius-lg);
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent);
	}
	.pa-day__num {
		position: absolute;
		top: clamp(1.1rem, 2.4vw, 1.5rem);
		right: clamp(1.1rem, 2.4vw, 1.5rem);
		font-size: 0.8rem;
		color: var(--tt-mute-2);
	}
	.pa-day__icon {
		display: grid;
		place-items: center;
		width: 42px;
		height: 42px;
		border-radius: 10px;
		color: var(--tt-fog);
		border: 1px solid var(--tt-line);
		background: rgba(255, 255, 255, 0.02);
	}
	.pa-day__when {
		margin-top: 1rem;
		color: var(--tt-red-bright);
	}
	.pa-day__task {
		margin-top: 0.5rem;
		font-size: 1.1rem;
		font-weight: 700;
		color: #fff;
		letter-spacing: -0.01em;
		line-height: 1.25;
	}
	.pa-day__note {
		margin-top: 0.6rem;
		font-size: 0.9rem;
		color: var(--tt-mute);
	}

	@media (min-width: 720px) {
		.pa-day__list {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	@media (min-width: 1040px) {
		.pa-day__list {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	/* ======================== DISCLOSURES ======================== */
	.pa-disc {
		background: var(--tt-ink);
	}
	.pa-disc__panel {
		padding: clamp(1.8rem, 4vw, 3rem);
		border: 1px solid var(--tt-line-strong);
		border-radius: var(--tt-radius-lg);
		background: linear-gradient(180deg, rgba(178, 39, 37, 0.05), rgba(255, 255, 255, 0.01));
	}
	.pa-disc__head {
		display: flex;
		align-items: center;
		gap: 1.1rem;
		padding-bottom: 1.6rem;
		border-bottom: 1px solid var(--tt-line);
	}
	.pa-disc__icon {
		display: grid;
		place-items: center;
		width: 52px;
		height: 52px;
		flex: none;
		border-radius: 13px;
		color: var(--tt-red-bright);
		border: 1px solid rgba(178, 39, 37, 0.4);
		background: rgba(178, 39, 37, 0.08);
	}
	.pa-disc__idx {
		font-family: var(--tt-font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.1em;
		color: var(--tt-red-bright);
	}
	.pa-disc__title {
		margin-top: 0.3rem;
		font-size: var(--fs-h3);
		font-weight: 800;
		color: #fff;
	}
	.pa-disc__list {
		display: grid;
		gap: 0;
		margin: 0;
	}
	.pa-disc__item {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 1.1rem;
		padding: 1.15rem 0;
		border-bottom: 1px solid var(--tt-line);
	}
	.pa-disc__item dt {
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--tt-red-bright);
		padding-top: 0.1rem;
	}
	.pa-disc__item dd {
		margin: 0;
		font-size: 0.98rem;
		color: var(--tt-fog);
	}
	.pa-disc__foot {
		margin-top: 1.6rem;
		font-size: 0.9rem;
		color: var(--tt-mute);
		max-width: 64ch;
	}

	/* ============================ CTA ============================ */
	.pa-cta {
		position: relative;
		overflow: clip;
		background: var(--tt-black);
		text-align: center;
	}
	.pa-cta__glow {
		position: absolute;
		left: 50%;
		bottom: -40%;
		width: 80vw;
		height: 80vw;
		max-width: 900px;
		max-height: 900px;
		transform: translateX(-50%);
		background: radial-gradient(circle, rgba(178, 39, 37, 0.28), transparent 60%);
		filter: blur(30px);
		pointer-events: none;
	}
	.pa-cta__inner {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.pa-cta__kicker {
		justify-content: center;
	}
	.pa-cta__title {
		margin-top: 1.2rem;
		font-size: var(--fs-h1);
		font-weight: 800;
		letter-spacing: -0.03em;
		color: #fff;
		max-width: 16ch;
	}
	.pa-cta__text {
		margin-top: 1.4rem;
		text-align: center;
	}
	.pa-cta__actions {
		margin-top: 2.2rem;
	}
	.pa-cta__fine {
		margin-top: 1.8rem;
		max-width: 52ch;
		text-transform: none;
		letter-spacing: 0.01em;
		line-height: 1.6;
		color: var(--tt-mute-2);
	}
</style>
