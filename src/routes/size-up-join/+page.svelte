<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import Button from '$lib/components/Button.svelte';
	import { plans, site } from '$lib/data/site';
	import { reveal, splitReveal, parallax, counter, tilt, scrollToTarget } from '$lib/motion';

	import DeviceMobileIcon from 'phosphor-svelte/lib/DeviceMobileIcon';
	import MoonStarsIcon from 'phosphor-svelte/lib/MoonStarsIcon';
	import BellIcon from 'phosphor-svelte/lib/BellIcon';
	import ChatsCircleIcon from 'phosphor-svelte/lib/ChatsCircleIcon';
	import AppleLogoIcon from 'phosphor-svelte/lib/AppleLogoIcon';
	import AndroidLogoIcon from 'phosphor-svelte/lib/AndroidLogoIcon';
	import MonitorIcon from 'phosphor-svelte/lib/MonitorIcon';
	import CheckIcon from 'phosphor-svelte/lib/CheckIcon';
	import CheckCircleIcon from 'phosphor-svelte/lib/CheckCircleIcon';
	import ShieldCheckIcon from 'phosphor-svelte/lib/ShieldCheckIcon';

	const webinarHref = 'https://tricktrades.com/size-up-webinar';

	// Every fact here traces to $lib/data/site.ts — nothing invented.
	const appFeatures = [
		{
			icon: DeviceMobileIcon,
			title: 'iOS, Android & Desktop',
			body: 'One membership, every device. Open the Size UP! App anywhere and you’re trade-ready in seconds.'
		},
		{
			icon: MoonStarsIcon,
			title: 'Nightly video watch list',
			body: 'Recorded every night and viewable on any device — high-probability, cherry-picked setups for the next session.'
		},
		{
			icon: BellIcon,
			title: 'Live Pre-Market Plan of Attack',
			body: 'The PMPOA covered live on screen share at 9 a.m. EST sharp, so you go into the open with a real plan.'
		},
		{
			icon: ChatsCircleIcon,
			title: '24/7 community chat',
			body: 'Ask questions, get help, or make new friends any time — day, night and weekends. We never shut down.'
		}
	];

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Product',
		name: 'Trick Trades — Size UP! Membership',
		description:
			'Trick Trades’ flagship day-trading membership — the Size UP! App on iOS, Android & Desktop, a nightly video watch list, the live 9 a.m. EST Pre-Market Plan of Attack, 24/7 chat, and a 50+ lesson Boot Camp.',
		brand: { '@type': 'Brand', name: site.name },
		url: site.domain + '/size-up-join',
		offers: plans.map((p) => ({
			'@type': 'Offer',
			name: p.name,
			price: p.price,
			priceCurrency: 'USD',
			url: site.domain + p.href,
			availability: 'https://schema.org/InStock'
		}))
	};

	function jump(e: MouseEvent, href: string) {
		e.preventDefault();
		scrollToTarget(href);
	}
</script>

<Seo
	title="Join Size UP! — Trick Trades Membership"
	description="Size UP! is Trick Trades’ flagship day-trading membership — the Size UP! App on iOS, Android & Desktop, a nightly video watch list, the live 9 a.m. EST plan, 24/7 chat, and 50+ Boot Camp lessons. Guidance $247/mo, Mentoring $347/mo."
	path="/size-up-join"
	{jsonLd}
/>

<!-- 1 — HERO ---------------------------------------------------------------->
<section class="tt-section join-hero" aria-labelledby="join-hero-title">
	<div class="join-hero__bg" aria-hidden="true">
		<div class="join-hero__grid grid-bg"></div>
		<div class="join-hero__glow" {@attach parallax(110)}></div>
	</div>

	<div class="tt-container join-hero__inner">
		<p class="join-hero__kicker label">
			<span class="join-hero__live" aria-hidden="true"></span>Size UP! Membership
		</p>

		<h1
			id="join-hero-title"
			class="join-hero__title"
			data-split
			{@attach splitReveal({ stagger: 0.026 })}
		>
			Get the whole system.
			<span class="script join-hero__script">then size up.</span>
		</h1>

		<div class="join-hero__stack" data-anim-stagger {@attach reveal({ stagger: 0.12, y: 26 })}>
			<p class="join-hero__lede">
				More value, expertise and educational material (that works) than any other trading service
				you can find. <strong>Period.</strong>
			</p>

			<div class="join-hero__cta">
				<Button href="#plans" onclick={(e) => jump(e, '#plans')}>See membership plans</Button>
				<Button href={webinarHref} variant="ghost">Watch the free webinar</Button>
			</div>

			<dl class="join-hero__trust">
				<div class="join-hero__trust-item">
					<dt class="num">
						<span {@attach counter(site.studentsTrained)}
							>{site.studentsTrained.toLocaleString('en-US')}</span
						>+
					</dt>
					<dd>Traders trained</dd>
				</div>
				<span class="join-hero__sep" aria-hidden="true"></span>
				<div class="join-hero__trust-item">
					<dt class="num">9:00 <span class="join-hero__unit">AM EST</span></dt>
					<dd>Live every trading day</dd>
				</div>
				<span class="join-hero__sep" aria-hidden="true"></span>
				<div class="join-hero__trust-item">
					<dt class="num">50+</dt>
					<dd>Boot Camp lessons</dd>
				</div>
			</dl>
		</div>
	</div>
</section>

<!-- 2 — THE SIZE UP! APP ----------------------------------------------------->
<section class="tt-section join-app" aria-labelledby="join-app-title">
	<div class="tt-container join-app__inner">
		<div class="join-app__lead">
			<div class="section-head">
				<span class="idx">01 / 03</span>
				<span class="rule"></span>
				<span class="label">The Size UP! App</span>
			</div>

			<h2
				id="join-app-title"
				class="join-app__title"
				data-split
				{@attach splitReveal({ stagger: 0.026 })}
			>
				Your entire edge, on every screen.
			</h2>

			<p class="join-app__copy">
				Guidance, the nightly watch list, the live plan and the room travel with you — the Size UP!
				App runs on iOS, Android and Desktop, so you’re trade-ready wherever the day takes you.
			</p>

			<div class="app-win" data-anim {@attach reveal({ y: 40, scale: 0.97, duration: 1.1 })}>
				<div class="app-win__bar">
					<span class="app-win__dots" aria-hidden="true"><i></i><i></i><i></i></span>
					<span class="app-win__tag label">
						<span class="app-win__live" aria-hidden="true"></span>Size UP! · Live
					</span>
				</div>
				<div class="app-win__body">
					<ul class="app-win__plats">
						<li>
							<span class="app-win__pico"><AppleLogoIcon weight="fill" size={18} /></span>
							<span>iOS</span>
						</li>
						<li>
							<span class="app-win__pico"><AndroidLogoIcon weight="fill" size={18} /></span>
							<span>Android</span>
						</li>
						<li>
							<span class="app-win__pico"><MonitorIcon weight="regular" size={18} /></span>
							<span>Desktop</span>
						</li>
					</ul>
					<hr class="app-win__rule" />
					<dl class="app-win__status">
						<div class="app-win__row"><dt>Nightly watch list</dt><dd class="num">Ready</dd></div>
						<div class="app-win__row"><dt>Pre-Market Plan</dt><dd class="num">9:00 AM EST</dd></div>
						<div class="app-win__row"><dt>Community chat</dt><dd class="num">24 / 7</dd></div>
					</dl>
				</div>
			</div>
		</div>

		<ul class="join-app__feats" data-anim-stagger {@attach reveal({ stagger: 0.1, y: 28 })}>
			{#each appFeatures as f, i (f.title)}
				{@const Icon = f.icon}
				<li class="feat">
					<span class="feat__idx num">{String(i + 1).padStart(2, '0')}</span>
					<span class="feat__ico" aria-hidden="true"><Icon weight="regular" size={24} /></span>
					<div class="feat__text">
						<h3 class="feat__title">{f.title}</h3>
						<p class="feat__body">{f.body}</p>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</section>

<!-- 3 — PLANS ---------------------------------------------------------------->
<section id="plans" class="tt-section join-plans" aria-labelledby="join-plans-title">
	<div class="join-plans__glow" aria-hidden="true"></div>

	<div class="tt-container">
		<header class="join-plans__head">
			<div class="section-head">
				<span class="idx">02 / 03</span>
				<span class="rule"></span>
				<span class="label">Membership plans</span>
			</div>

			<div class="join-plans__headrow">
				<h2
					id="join-plans-title"
					class="join-plans__title"
					data-split
					{@attach splitReveal({ stagger: 0.026 })}
				>
					Two ways to size up.
				</h2>

				<span class="join-plans__billing">
					<span class="join-plans__billing-dot" aria-hidden="true"></span>
					Monthly billing
				</span>
			</div>
		</header>

		<div class="join-plans__grid" data-anim-stagger {@attach reveal({ stagger: 0.14, y: 44 })}>
			{#each plans as plan, i (plan.id)}
				<article class="plan" class:plan--featured={plan.featured} {@attach tilt(4)}>
					{#if plan.featured}
						<span class="plan__ribbon">Most Popular</span>
					{/if}

					<div class="plan__head">
						<span class="plan__idx num">0{i + 1} / 0{plans.length}</span>
						<h3 class="plan__name">{plan.name}</h3>
					</div>

					<p class="plan__price">
						<span class="plan__cur">$</span><span class="num plan__amt">{plan.price}</span><span
							class="plan__cad">{plan.cadence}</span
						>
					</p>

					<p class="plan__blurb">{plan.blurb}</p>

					<div class="plan__cta">
						<Button href={plan.href} variant={plan.featured ? 'primary' : 'ghost'} block>
							{plan.cta}
						</Button>
					</div>

					<hr class="plan__rule" />

					{#if plan.inheritLabel}
						<p class="plan__inherit">{plan.inheritLabel}</p>
					{/if}

					<ul class="plan__feats">
						{#each plan.features as feature (feature)}
							<li class="plan__feat">
								<span class="plan__ico" aria-hidden="true">
									{#if plan.featured}
										<CheckCircleIcon weight="fill" size={17} />
									{:else}
										<CheckIcon weight="bold" size={15} />
									{/if}
								</span>
								<span class="plan__ftxt">{feature}</span>
							</li>
						{/each}
					</ul>
				</article>
			{/each}
		</div>

		<p class="join-plans__assure">
			<span class="join-plans__assure-ico" aria-hidden="true">
				<ShieldCheckIcon weight="fill" size={18} />
			</span>
			<span>Cancel anytime with one click from your dashboard. No long-term commitment.</span>
		</p>
	</div>
</section>

<!-- 4 — NO TRADER LEFT BEHIND ------------------------------------------------>
<section class="tt-section join-nt" aria-labelledby="join-nt-title">
	<div class="tt-container">
		<div class="join-nt__panel">
			<span class="join-nt__mark join-nt__mark--tl" aria-hidden="true"></span>
			<span class="join-nt__mark join-nt__mark--br" aria-hidden="true"></span>

			<div class="join-nt__grid">
				<div class="join-nt__body" data-anim {@attach reveal({ y: 30 })}>
					<div class="section-head">
						<span class="idx">03 / 03</span>
						<span class="rule"></span>
						<span class="label">The guarantee</span>
					</div>
					<h2 id="join-nt-title" class="join-nt__title">
						No trader <span class="text-red">left behind.</span>
					</h2>
					<p class="join-nt__copy">
						Our mission is simple: provide you with the educational resources required so you can
						master a level of trading that delivers your freedom.
					</p>
				</div>

				<aside class="join-nt__aside" data-anim {@attach reveal({ y: 30, delay: 0.1 })}>
					<p class="join-nt__still label">Not ready to join?</p>
					<p class="join-nt__stillcopy">
						Start with the free training — see the strategy in action before you commit a single
						dollar.
					</p>
					<Button href={webinarHref} variant="light">Watch the free webinar</Button>
				</aside>
			</div>
		</div>
	</div>
</section>

<style>
	/* ============================================================= 1 — HERO */
	.join-hero {
		position: relative;
		padding-top: calc(var(--tt-header-h) + clamp(2.4rem, 7vw, 5.5rem));
		overflow: clip;
	}
	.join-hero__bg {
		position: absolute;
		inset: 0;
		z-index: 0;
	}
	.join-hero__grid {
		position: absolute;
		inset: -10% 0 0;
		opacity: 0.5;
	}
	.join-hero__glow {
		position: absolute;
		top: -22%;
		right: -12%;
		width: 72vw;
		height: 72vw;
		max-width: 920px;
		max-height: 920px;
		background: radial-gradient(circle, rgba(178, 39, 37, 0.4), transparent 62%);
		filter: blur(22px);
	}

	.join-hero__inner {
		position: relative;
		z-index: 1;
	}
	.join-hero__kicker {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		color: var(--tt-fog);
	}
	.join-hero__live {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--tt-red-bright);
		box-shadow: 0 0 12px var(--tt-red-bright);
	}

	.join-hero__title {
		margin-top: 1.4rem;
		max-width: 15ch;
		font-size: var(--fs-h1);
		font-weight: 800;
		letter-spacing: -0.03em;
		line-height: 0.98;
		color: #fff;
	}
	.join-hero__script {
		display: block;
		margin-top: 0.08em;
		font-size: 1.14em;
		line-height: 0.8;
		color: var(--tt-red-bright);
	}

	.join-hero__lede {
		margin-top: 1.7rem;
		max-width: 46ch;
		font-size: var(--fs-lead);
		color: var(--tt-fog);
	}
	.join-hero__lede strong {
		color: #fff;
	}

	.join-hero__cta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.9rem;
		margin-top: 2rem;
	}

	.join-hero__trust {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 1.4rem;
		margin: 2.6rem 0 0;
		padding-top: 1.8rem;
		border-top: 1px solid var(--tt-line);
	}
	.join-hero__sep {
		width: 1px;
		height: 34px;
		background: var(--tt-line-strong);
	}
	.join-hero__trust-item dt {
		display: flex;
		align-items: baseline;
		gap: 0.12rem;
		font-size: clamp(1.4rem, 1rem + 1.8vw, 2rem);
		font-weight: 700;
		color: #fff;
		line-height: 1;
	}
	.join-hero__unit {
		font-size: 0.5em;
		letter-spacing: 0.06em;
		color: var(--tt-mute);
	}
	.join-hero__trust-item dd {
		margin: 0.34rem 0 0;
		font-size: 0.76rem;
		letter-spacing: 0.02em;
		color: var(--tt-mute);
	}

	@media (min-width: 820px) {
		.join-hero__title {
			margin-top: 1.8rem;
		}
	}

	/* ==================================================== 2 — THE SIZE UP! APP */
	.join-app {
		position: relative;
		background: var(--tt-ink);
		box-shadow:
			inset 0 1px 0 var(--tt-line),
			inset 0 -1px 0 var(--tt-line);
		overflow: clip;
	}
	.join-app__inner {
		display: grid;
		gap: clamp(2.4rem, 5vw, 4rem);
		align-items: start;
	}
	.join-app__title {
		max-width: 14ch;
		font-size: var(--fs-h2);
		color: var(--tt-white);
	}
	.join-app__copy {
		margin-top: 1.3rem;
		max-width: 48ch;
		font-size: var(--fs-lead);
		color: var(--tt-fog);
	}

	/* Editorial "app window" — a terminal-style panel, real labels only */
	.app-win {
		margin-top: clamp(2rem, 4vw, 2.8rem);
		max-width: 460px;
		border: 1px solid var(--tt-line-strong);
		border-radius: var(--tt-radius);
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent 40%), var(--tt-ink-2);
		box-shadow: var(--tt-shadow-card);
		overflow: hidden;
	}
	.app-win__bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.7rem 1rem;
		border-bottom: 1px solid var(--tt-line);
		background: rgba(255, 255, 255, 0.02);
	}
	.app-win__dots {
		display: inline-flex;
		gap: 6px;
	}
	.app-win__dots i {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: var(--tt-line-strong);
	}
	.app-win__tag {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--tt-fog);
	}
	.app-win__live {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--tt-red-bright);
		box-shadow: 0 0 10px var(--tt-red-bright);
	}
	.app-win__body {
		padding: clamp(1.1rem, 3vw, 1.5rem);
	}
	.app-win__plats {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
	}
	.app-win__plats li {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.4rem 0.75rem;
		font-family: var(--tt-font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.06em;
		color: var(--tt-fog);
		border: 1px solid var(--tt-line);
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.02);
	}
	.app-win__pico {
		display: inline-flex;
		color: var(--tt-white);
	}
	.app-win__rule {
		margin: 1.1rem 0;
		border: 0;
		height: 1px;
		background: var(--tt-line);
	}
	.app-win__status {
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
	}
	.app-win__row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}
	.app-win__row dt {
		font-size: 0.86rem;
		color: var(--tt-mute);
	}
	.app-win__row dd {
		margin: 0;
		font-size: 0.8rem;
		letter-spacing: 0.04em;
		color: var(--tt-gold);
	}

	/* Feature list — hairline rows, small monochrome icons, mono index */
	.join-app__feats {
		list-style: none;
		margin: 0;
		padding: 0;
		border-top: 1px solid var(--tt-line);
	}
	.feat {
		display: grid;
		grid-template-columns: auto auto 1fr;
		align-items: start;
		gap: 0.7rem 1.1rem;
		padding: clamp(1.3rem, 3vw, 1.7rem) 0;
		border-bottom: 1px solid var(--tt-line);
	}
	.feat__idx {
		font-size: 0.72rem;
		letter-spacing: 0.1em;
		color: var(--tt-red-bright);
		padding-top: 0.35rem;
	}
	.feat__ico {
		display: inline-flex;
		color: var(--tt-fog);
		padding-top: 0.1rem;
	}
	.feat__title {
		font-size: var(--fs-h4);
		font-weight: 700;
		line-height: 1.2;
		color: var(--tt-white);
	}
	.feat__body {
		margin-top: 0.4rem;
		max-width: 44ch;
		font-size: 0.95rem;
		color: var(--tt-mute);
	}

	@media (min-width: 900px) {
		.join-app__inner {
			grid-template-columns: 1.02fr 0.98fr;
			gap: clamp(3rem, 6vw, 5rem);
		}
	}

	/* ========================================================= 3 — PLANS */
	.join-plans {
		position: relative;
		overflow: clip;
	}
	.join-plans__glow {
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
	.join-plans .tt-container {
		position: relative;
		z-index: 1;
	}

	.join-plans__head {
		margin-bottom: clamp(2.2rem, 5vw, 3.4rem);
	}
	.join-plans__headrow {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: space-between;
		gap: 1.2rem;
		margin-top: 0.6rem;
	}
	.join-plans__title {
		font-size: var(--fs-h2);
		max-width: 14ch;
	}
	.join-plans__billing {
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
	.join-plans__billing-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--tt-red-bright);
		box-shadow: 0 0 10px var(--tt-red-bright);
	}

	.join-plans__grid {
		display: grid;
		gap: clamp(1.3rem, 3vw, 1.9rem);
	}

	.plan {
		position: relative;
		display: flex;
		flex-direction: column;
		padding: clamp(1.5rem, 3vw, 2.2rem);
		border: 1px solid var(--tt-line);
		border-radius: var(--tt-radius-lg);
		background: var(--tt-ink-2);
		box-shadow: var(--tt-shadow-card);
		will-change: transform;
	}
	.plan--featured {
		z-index: 2;
		border-color: rgba(178, 39, 37, 0.55);
		background: linear-gradient(180deg, rgba(178, 39, 37, 0.1), transparent 40%), var(--tt-ink-2);
		box-shadow:
			var(--tt-glow-red),
			var(--tt-shadow-lg);
		padding-top: clamp(2.3rem, 4vw, 3rem);
	}

	.plan__ribbon {
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

	.plan__head {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.plan__idx {
		font-size: 0.7rem;
		letter-spacing: 0.18em;
		color: var(--tt-mute);
	}
	.plan__name {
		font-size: var(--fs-h4);
		color: var(--tt-white);
	}

	.plan__price {
		display: flex;
		align-items: baseline;
		gap: 0.12rem;
		margin-top: 1.3rem;
		color: var(--tt-white);
	}
	.plan__cur {
		align-self: flex-start;
		margin-top: 0.4rem;
		font-size: 1.4rem;
		font-weight: 700;
		color: var(--tt-fog);
	}
	.plan__amt {
		font-size: clamp(2.8rem, 1.8rem + 3vw, 4rem);
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.03em;
	}
	.plan__cad {
		margin-left: 0.25rem;
		font-family: var(--tt-font-mono);
		font-size: 0.85rem;
		color: var(--tt-mute);
	}
	.plan--featured .plan__amt {
		font-size: clamp(3.1rem, 1.9rem + 3.4vw, 4.6rem);
	}

	.plan__blurb {
		margin-top: 1rem;
		max-width: 40ch;
		color: var(--tt-fog);
		font-size: 0.98rem;
	}

	.plan__cta {
		margin-top: 1.6rem;
	}

	.plan__rule {
		margin: 1.6rem 0 1.2rem;
		border: 0;
		height: 1px;
		background: var(--tt-line);
	}

	.plan__inherit {
		margin-bottom: 1rem;
		font-family: var(--tt-font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--tt-red-bright);
	}

	.plan__feats {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.72rem;
	}
	.plan__feat {
		display: flex;
		align-items: flex-start;
		gap: 0.7rem;
	}
	.plan__ico {
		display: flex;
		flex: none;
		margin-top: 0.16em;
		color: var(--tt-gold);
	}
	.plan--featured .plan__ico {
		color: var(--tt-red-bright);
	}
	.plan__ftxt {
		font-size: 0.92rem;
		line-height: 1.5;
		color: var(--tt-fog);
	}

	.join-plans__assure {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.6rem;
		margin-top: clamp(2rem, 4vw, 3rem);
		text-align: center;
		font-size: 0.9rem;
		color: var(--tt-mute);
	}
	.join-plans__assure-ico {
		display: inline-flex;
		flex: none;
		color: var(--tt-red-bright);
	}

	@media (min-width: 880px) {
		.join-plans__grid {
			grid-template-columns: 1fr 1.06fr;
			align-items: center;
		}
		.plan--featured {
			padding-block: clamp(2.6rem, 4vw, 3.4rem);
		}
	}

	/* ============================================== 4 — NO TRADER LEFT BEHIND */
	.join-nt__panel {
		position: relative;
		overflow: hidden;
		padding: clamp(1.9rem, 5vw, 3.6rem);
		border: 1px solid var(--tt-line-strong);
		border-radius: var(--tt-radius-lg);
		background: radial-gradient(120% 150% at 12% -10%, rgba(178, 39, 37, 0.12), transparent 46%),
			var(--tt-ink);
		box-shadow: var(--tt-shadow-card);
	}
	.join-nt__mark {
		position: absolute;
		width: 15px;
		height: 15px;
		opacity: 0.55;
	}
	.join-nt__mark--tl {
		top: 16px;
		left: 16px;
		border-top: 1px solid var(--tt-line-strong);
		border-left: 1px solid var(--tt-line-strong);
	}
	.join-nt__mark--br {
		bottom: 16px;
		right: 16px;
		border-bottom: 1px solid var(--tt-line-strong);
		border-right: 1px solid var(--tt-line-strong);
	}

	.join-nt__grid {
		display: grid;
		gap: clamp(2rem, 5vw, 3.5rem);
		align-items: center;
	}
	.join-nt__title {
		margin-top: 0.4rem;
		font-size: var(--fs-h2);
		max-width: 12ch;
	}
	.join-nt__copy {
		margin-top: 1.3rem;
		max-width: 52ch;
		font-size: var(--fs-lead);
		color: var(--tt-fog);
	}

	.join-nt__aside {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 1rem;
		padding-top: 0.4rem;
	}
	.join-nt__still {
		color: var(--tt-red-bright);
	}
	.join-nt__stillcopy {
		max-width: 40ch;
		font-size: var(--fs-body);
		color: var(--tt-mute);
	}

	@media (min-width: 860px) {
		.join-nt__grid {
			grid-template-columns: 1.35fr 0.65fr;
		}
		.join-nt__aside {
			padding-left: clamp(1.5rem, 3vw, 2.5rem);
			border-left: 1px solid var(--tt-line);
		}
	}
</style>
