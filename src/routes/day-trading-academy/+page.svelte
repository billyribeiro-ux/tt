<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import Button from '$lib/components/Button.svelte';
	import { reveal, splitReveal, parallax, tilt } from '$lib/motion';
	import { site } from '$lib/data/site';
	import LightningIcon from 'phosphor-svelte/lib/LightningIcon';
	import CompassIcon from 'phosphor-svelte/lib/CompassIcon';
	import EyeIcon from 'phosphor-svelte/lib/EyeIcon';
	import ScalesIcon from 'phosphor-svelte/lib/ScalesIcon';
	import StackIcon from 'phosphor-svelte/lib/StackIcon';
	import CrownIcon from 'phosphor-svelte/lib/CrownIcon';
	import ArrowUpRightIcon from 'phosphor-svelte/lib/ArrowUpRightIcon';

	type Course = {
		name: string;
		tag: string;
		tagline: string;
		lessons: string;
		price: number | null;
		was: number | null;
		note: string | null;
		href: string;
		Icon: typeof LightningIcon;
	};

	// Real Trick Trades catalogue — names, prices, lesson counts and links transcribed
	// from tricktrades.com. Nothing here is fabricated; courses without a public flat
	// price (Momentum, Gold Edition) intentionally carry no invented figure.
	const courses: Course[] = [
		{
			name: 'Momentum',
			tag: 'Flagship coaching',
			tagline: 'High-level day-trading coaching with Pat Mitchell.',
			lessons: '15 modules · 115 lessons · +14 bonus',
			price: null,
			was: null,
			note: 'Includes B.O.S.S. Carbon — a $597 value',
			href: 'https://tricktrades.com/momentum-course',
			Icon: LightningIcon
		},
		{
			name: 'Day Trading Boot Camp',
			tag: 'Start here',
			tagline: 'The foundation — mechanics, strategy and mindset.',
			lessons: '50+ lessons · lifetime access',
			price: 97,
			was: 147,
			note: null,
			href: 'https://tricktrades.com/day-trading-bootcamp',
			Icon: CompassIcon
		},
		{
			name: 'Crystal Ball: Volume 1',
			tag: 'Price action',
			tagline: 'Dissect price action and see moves before they happen.',
			lessons: '8 modules · 2 quizzes',
			price: 399,
			was: null,
			note: null,
			href: 'https://tricktrades.com/crystal-ball-course',
			Icon: EyeIcon
		},
		{
			name: 'Crystal Ball: Volume 2',
			tag: 'Advanced',
			tagline: 'Patience, sizing, and support & resistance mastery.',
			lessons: '8 modules · 2 quizzes',
			price: 399,
			was: null,
			note: null,
			href: 'https://tricktrades.com/crystal-ball-course',
			Icon: ScalesIcon
		},
		{
			name: 'Crystal Ball: Bundle + Bonus',
			tag: 'Best value',
			tagline: 'Both volumes, plus a live-trading bonus hour.',
			lessons: 'Vol 1 + Vol 2 · +1 live hour',
			price: 649,
			was: null,
			note: null,
			href: 'https://tricktrades.com/crystal-ball-course',
			Icon: StackIcon
		},
		{
			name: 'Crystal Ball: Gold Edition',
			tag: 'Gold edition',
			tagline: 'Natural-movement theory, taught live.',
			lessons: '9 months of live trades',
			price: null,
			was: null,
			note: null,
			href: 'https://tricktrades.com/crystal-ball-gold-edition-course',
			Icon: CrownIcon
		}
	];

	const featured = courses[0];
	const FeaturedIcon = featured.Icon;
	const rest = courses.slice(1);

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		name: 'Trick Trades Day Trading Academy',
		description:
			'The Trick Trades course library — from beginner fundamentals to advanced price-action strategy.',
		numberOfItems: courses.length,
		itemListElement: courses.map((c, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			item: {
				'@type': 'Course',
				name: c.name,
				description: c.tagline,
				url: c.href,
				provider: {
					'@type': 'Organization',
					name: site.name,
					sameAs: site.domain
				},
				...(c.price
					? {
							offers: {
								'@type': 'Offer',
								price: c.price,
								priceCurrency: 'USD',
								url: c.href,
								availability: 'https://schema.org/InStock'
							}
						}
					: {})
			}
		}))
	};
</script>

<Seo
	title="Day Trading Academy — Trick Trades Courses"
	description="A full library of day-trading courses — from beginner fundamentals to advanced price-action strategy. Built on real trading experience, not theory. Boot Camp, Crystal Ball, Momentum and more."
	path="/day-trading-academy"
	{jsonLd}
/>

<!-- ===================== HERO ===================== -->
<section class="tt-section aca-hero" aria-labelledby="aca-hero-title">
	<div class="aca-hero__bg" aria-hidden="true">
		<div class="aca-hero__grid grid-bg"></div>
		<div class="aca-hero__glow" {@attach parallax(90)}></div>
	</div>

	<div class="tt-container aca-hero__inner">
		<p class="eyebrow aca-hero__kicker">
			<span class="aca-hero__dot" aria-hidden="true"></span>The Academy
		</p>

		<h1 id="aca-hero-title" class="aca-hero__title" data-split {@attach splitReveal({ stagger: 0.026 })}>
			A full library of courses — from fundamentals to
			<span class="text-red">price-action mastery.</span>
		</h1>

		<div class="aca-hero__foot" data-anim-stagger {@attach reveal({ stagger: 0.12, y: 24 })}>
			<p class="aca-hero__lede prose">
				Built on real trading experience, not theory. Six programs that carry you from your first
				green candle to reading price action before the move happens — self-paced, and taught by
				Pat “Trick” Mitchell.
			</p>

			<dl class="aca-hero__meta">
				<div class="aca-hero__metric">
					<dt class="num aca-hero__metric-n">0{courses.length}</dt>
					<dd class="aca-hero__metric-l">Courses in the library</dd>
				</div>
				<div class="aca-hero__metric">
					<dt class="num aca-hero__metric-n">115</dt>
					<dd class="aca-hero__metric-l">Video lessons in Momentum</dd>
				</div>
				<div class="aca-hero__metric">
					<dt class="num aca-hero__metric-n">10+ yrs</dt>
					<dd class="aca-hero__metric-l">Of proven strategy</dd>
				</div>
			</dl>
		</div>
	</div>
</section>

<!-- ===================== COURSE LIBRARY ===================== -->
<section id="courses" class="tt-section lib" aria-labelledby="lib-title">
	<span class="lib__glow" aria-hidden="true"></span>

	<div class="tt-container">
		<div class="section-head">
			<span class="idx">◆ The library</span>
			<span class="rule"></span>
			<span class="label lib__count">0{courses.length} programs</span>
		</div>

		<div class="lib__head">
			<h2 id="lib-title" class="lib__title" data-split {@attach splitReveal({ stagger: 0.03 })}>
				Pick your <span class="text-red">edge.</span>
			</h2>
			<p class="lib__intro prose">
				From the Boot Camp foundation to the Crystal Ball price-action series and one-on-one Momentum
				coaching — each course stands alone, and each one stacks.
			</p>
		</div>

		<!-- Featured: Momentum -->
		<article class="feat" data-anim {@attach reveal({ y: 48, duration: 1.05 })}>
			<span class="feat__reg feat__reg--tl" aria-hidden="true"></span>
			<span class="feat__reg feat__reg--br" aria-hidden="true"></span>

			<div class="feat__main">
				<div class="feat__top">
					<span class="feat__idx num">01</span>
					<span class="feat__icon"><FeaturedIcon size={22} weight="regular" /></span>
					<span class="feat__tag label">{featured.tag}</span>
				</div>

				<h3 class="feat__name">{featured.name}</h3>
				<p class="feat__tagline">{featured.tagline}</p>
				<p class="feat__lessons num">{featured.lessons}</p>
			</div>

			<div class="feat__aside">
				{#if featured.note}
					<p class="feat__note-label label">Bundled inside</p>
					<p class="feat__note">{featured.note}</p>
				{/if}
				<div class="feat__cta">
					<Button href={featured.href}>View course</Button>
				</div>
			</div>
		</article>

		<!-- Grid: the rest -->
		<ul class="grid" data-anim-stagger {@attach reveal({ stagger: 0.1, y: 40 })}>
			{#each rest as course, i (course.name)}
				{@const Icon = course.Icon}
				<li class="course" {@attach tilt(4)}>
					<div class="course__top">
						<span class="course__idx num">0{i + 2}</span>
						<span class="course__tag label">{course.tag}</span>
					</div>

					<span class="course__icon"><Icon size={22} weight="regular" /></span>

					<h3 class="course__name">{course.name}</h3>
					<p class="course__tagline">{course.tagline}</p>
					<p class="course__lessons num">{course.lessons}</p>

					<div class="course__foot">
						{#if course.price}
							<p class="course__price">
								<span class="course__cur">$</span><span class="num course__amt">{course.price}</span>
								{#if course.was}<del class="course__was num">${course.was}</del>{/if}
							</p>
						{:else}
							<p class="course__poa label">Pricing on course page</p>
						{/if}

						<Button href={course.href} variant="ghost" size="md">View course</Button>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</section>

<!-- ===================== CLOSING CTA ===================== -->
<section class="tt-section join" aria-labelledby="join-title">
	<div class="join__bg" aria-hidden="true">
		<div class="join__grid grid-bg"></div>
		<div class="join__glow" {@attach parallax(-60)}></div>
	</div>

	<div class="tt-container join__inner">
		<p class="label join__kicker">
			<span class="join__rule" aria-hidden="true"></span>Beyond the courses
		</p>

		<h2 id="join-title" class="join__title" data-split {@attach splitReveal({ stagger: 0.03 })}>
			Prefer daily live guidance? <span class="text-red">Join the membership.</span>
		</h2>

		<p class="join__lede" data-anim {@attach reveal({ y: 22 })}>
			Courses give you the playbook. The Size UP membership puts you in the room every morning — a
			live pre-market plan, a nightly video watch list, and a 24/7 community that answers.
		</p>

		<div class="join__cta" data-anim {@attach reveal({ y: 22, delay: 0.05 })}>
			<Button href="/size-up-join">
				Explore membership
			</Button>
			<a class="join__link" href="/size-up-join">
				See what's included <ArrowUpRightIcon size={15} weight="bold" aria-hidden="true" />
			</a>
		</div>
	</div>
</section>

<style>
	/* ===================== HERO ===================== */
	.aca-hero {
		position: relative;
		overflow: clip;
		padding-top: calc(var(--tt-header-h) + clamp(2.5rem, 6vw, 5rem));
	}
	.aca-hero__bg {
		position: absolute;
		inset: 0;
		z-index: 0;
	}
	.aca-hero__grid {
		position: absolute;
		inset: -12% 0 0;
		opacity: 0.45;
	}
	.aca-hero__glow {
		position: absolute;
		top: -18%;
		right: -12%;
		width: 66vw;
		height: 66vw;
		max-width: 820px;
		max-height: 820px;
		background: radial-gradient(circle, rgba(178, 39, 37, 0.4), transparent 62%);
		filter: blur(22px);
	}

	.aca-hero__inner {
		position: relative;
		z-index: 1;
	}
	.aca-hero__kicker {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
	}
	.aca-hero__dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--tt-red-bright);
		box-shadow: 0 0 12px var(--tt-red-bright);
	}
	.aca-hero__title {
		margin-top: 1.4rem;
		max-width: 18ch;
		font-size: var(--fs-h1);
		font-weight: 800;
		line-height: 0.98;
		letter-spacing: -0.03em;
		color: #fff;
	}
	.aca-hero__foot {
		display: grid;
		gap: clamp(2rem, 5vw, 3.5rem);
		margin-top: clamp(2rem, 4vw, 3rem);
	}
	.aca-hero__lede {
		max-width: 54ch;
	}
	.aca-hero__meta {
		display: flex;
		flex-wrap: wrap;
		gap: clamp(1.6rem, 5vw, 3.5rem);
		margin: 0;
		padding-top: 1.8rem;
		border-top: 1px solid var(--tt-line);
	}
	.aca-hero__metric-n {
		font-size: clamp(1.8rem, 1.2rem + 2vw, 2.6rem);
		font-weight: 700;
		line-height: 1;
		color: #fff;
	}
	.aca-hero__metric-l {
		margin-top: 0.5rem;
		font-size: 0.78rem;
		letter-spacing: 0.02em;
		color: var(--tt-mute);
	}

	@media (min-width: 900px) {
		.aca-hero__foot {
			grid-template-columns: 1.05fr 0.95fr;
			align-items: end;
		}
		.aca-hero__meta {
			padding-top: 0;
			border-top: 0;
			justify-content: flex-end;
			text-align: right;
		}
	}

	/* ===================== LIBRARY ===================== */
	.lib {
		position: relative;
		overflow: clip;
		background: var(--tt-ink);
		box-shadow:
			inset 0 1px 0 var(--tt-line),
			inset 0 -1px 0 var(--tt-line);
	}
	.lib__glow {
		position: absolute;
		z-index: 0;
		top: 8%;
		left: -10%;
		width: 44vw;
		max-width: 620px;
		aspect-ratio: 1;
		background: radial-gradient(circle, rgba(178, 39, 37, 0.16), transparent 64%);
		filter: blur(14px);
		pointer-events: none;
	}
	.lib .tt-container {
		position: relative;
		z-index: 1;
	}
	.lib__count {
		flex: none;
		color: var(--tt-mute-2);
	}
	.lib__head {
		display: grid;
		gap: 1.2rem;
		margin-bottom: clamp(2.5rem, 5vw, 3.8rem);
	}
	.lib__title {
		font-size: var(--fs-h2);
		font-weight: 800;
		letter-spacing: -0.02em;
		color: #fff;
	}
	.lib__intro {
		max-width: 58ch;
	}
	@media (min-width: 900px) {
		.lib__head {
			grid-template-columns: 1fr 1fr;
			align-items: end;
			gap: clamp(2rem, 5vw, 4rem);
		}
	}

	/* ---- Featured (Momentum) ---- */
	.feat {
		position: relative;
		display: grid;
		gap: clamp(1.8rem, 4vw, 3rem);
		margin-bottom: clamp(1.6rem, 3vw, 2.2rem);
		padding: clamp(1.8rem, 4vw, 3rem);
		border: 1px solid rgba(178, 39, 37, 0.42);
		border-radius: var(--tt-radius-lg);
		background:
			linear-gradient(180deg, rgba(178, 39, 37, 0.1), transparent 42%),
			var(--tt-ink-2);
		box-shadow: var(--tt-shadow-card);
	}
	.feat__reg {
		position: absolute;
		width: 14px;
		height: 14px;
		border-color: rgba(255, 255, 255, 0.22);
		border-style: solid;
		border-width: 0;
		pointer-events: none;
	}
	.feat__reg--tl {
		top: 12px;
		left: 12px;
		border-top-width: 1px;
		border-left-width: 1px;
	}
	.feat__reg--br {
		right: 12px;
		bottom: 12px;
		border-right-width: 1px;
		border-bottom-width: 1px;
	}
	.feat__top {
		display: flex;
		align-items: center;
		gap: 0.9rem;
		margin-bottom: 1.3rem;
	}
	.feat__idx {
		font-size: clamp(1.4rem, 1rem + 1.5vw, 2rem);
		font-weight: 800;
		line-height: 1;
		color: var(--tt-red-bright);
	}
	.feat__icon {
		display: grid;
		place-items: center;
		width: 40px;
		height: 40px;
		border-radius: 10px;
		color: #fff;
		border: 1px solid rgba(178, 39, 37, 0.5);
		background: rgba(178, 39, 37, 0.08);
	}
	.feat__tag {
		margin-left: auto;
		color: var(--tt-red-bright);
	}
	.feat__name {
		font-size: clamp(2rem, 1.4rem + 3vw, 3.4rem);
		font-weight: 800;
		letter-spacing: -0.025em;
		color: #fff;
	}
	.feat__tagline {
		margin-top: 0.9rem;
		max-width: 34ch;
		font-size: var(--fs-lead);
		color: var(--tt-fog);
	}
	.feat__lessons {
		margin-top: 1.3rem;
		font-size: 0.82rem;
		letter-spacing: 0.04em;
		color: var(--tt-mute);
	}
	.feat__aside {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 1.4rem;
	}
	.feat__note-label {
		color: var(--tt-mute-2);
	}
	.feat__note {
		margin-top: -0.9rem;
		max-width: 26ch;
		font-size: 1rem;
		color: var(--tt-fog);
	}
	.feat__cta {
		margin-top: auto;
	}

	@media (min-width: 860px) {
		.feat {
			grid-template-columns: 1.35fr 0.65fr;
			align-items: stretch;
		}
		.feat__aside {
			padding-left: clamp(1.8rem, 4vw, 3rem);
			border-left: 1px solid var(--tt-line);
			justify-content: space-between;
		}
	}

	/* ---- Grid (remaining courses) ---- */
	.grid {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: clamp(1.1rem, 2.5vw, 1.6rem);
	}
	@media (min-width: 620px) {
		.grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	@media (min-width: 1000px) {
		.grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.course {
		display: flex;
		flex-direction: column;
		padding: clamp(1.5rem, 2.5vw, 2rem);
		border: 1px solid var(--tt-line);
		border-radius: var(--tt-radius-lg);
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent);
		will-change: transform;
		transition: border-color 0.4s ease;
	}
	.course:hover {
		border-color: var(--tt-line-strong);
	}
	.course__top {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
	}
	.course__idx {
		font-size: 0.9rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		color: var(--tt-red-bright);
	}
	.course__tag {
		color: var(--tt-mute);
	}
	.course__icon {
		display: grid;
		place-items: center;
		width: 40px;
		height: 40px;
		margin-top: 1.4rem;
		border-radius: 10px;
		color: var(--tt-fog);
		border: 1px solid var(--tt-line);
		background: rgba(255, 255, 255, 0.02);
	}
	.course__name {
		margin-top: 1.2rem;
		font-size: var(--fs-h4);
		font-weight: 700;
		letter-spacing: -0.01em;
		color: #fff;
	}
	.course__tagline {
		margin-top: 0.6rem;
		font-size: 0.95rem;
		color: var(--tt-fog);
	}
	.course__lessons {
		margin-top: 1rem;
		font-size: 0.76rem;
		letter-spacing: 0.03em;
		color: var(--tt-mute);
	}
	.course__foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-top: auto;
		padding-top: 1.5rem;
	}
	.course__price {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		color: #fff;
	}
	.course__cur {
		font-size: 1rem;
		font-weight: 700;
		color: var(--tt-fog);
	}
	.course__amt {
		font-size: clamp(1.7rem, 1.3rem + 1.5vw, 2.2rem);
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.02em;
	}
	.course__was {
		font-size: 0.85rem;
		color: var(--tt-mute-2);
		text-decoration-line: line-through;
	}
	.course__poa {
		color: var(--tt-mute-2);
	}

	/* ===================== CLOSING CTA ===================== */
	.join {
		position: relative;
		overflow: clip;
		background: var(--tt-black);
		text-align: center;
	}
	.join__bg {
		position: absolute;
		inset: 0;
		z-index: 0;
	}
	.join__grid {
		position: absolute;
		inset: 0;
		opacity: 0.32;
	}
	.join__glow {
		position: absolute;
		left: 50%;
		bottom: -55%;
		width: min(1400px, 128vw);
		height: 100vh;
		transform: translateX(-50%);
		background: radial-gradient(
			ellipse 46% 60% at 50% 100%,
			rgba(255, 51, 51, 0.3),
			rgba(178, 39, 37, 0.4) 24%,
			transparent 66%
		);
		filter: blur(24px);
	}
	.join__inner {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		max-width: 54rem;
	}
	.join__kicker {
		display: inline-flex;
		align-items: center;
		gap: 0.9rem;
		color: var(--tt-mute);
	}
	.join__rule {
		width: 40px;
		height: 1px;
		background: var(--tt-red);
	}
	.join__title {
		margin-top: 1.4rem;
		font-size: var(--fs-h2);
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.025em;
		text-wrap: balance;
	}
	.join__lede {
		margin-top: 1.6rem;
		max-width: 48ch;
		font-size: var(--fs-lead);
		color: var(--tt-fog);
	}
	.join__cta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 1.4rem;
		margin-top: 2.4rem;
	}
	.join__link {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-family: var(--tt-font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--tt-fog);
		border-bottom: 1px solid transparent;
		transition:
			color 0.25s ease,
			border-color 0.25s ease;
	}
	.join__link:hover {
		color: #fff;
		border-color: var(--tt-line-strong);
	}

	@media (prefers-reduced-motion: reduce) {
		.course,
		.join__link {
			transition: none;
		}
	}
</style>
