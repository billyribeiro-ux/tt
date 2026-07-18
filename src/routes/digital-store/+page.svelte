<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import Button from '$lib/components/Button.svelte';
	import { reveal, splitReveal, parallax, tilt, scrollToTarget } from '$lib/motion';
	import { site } from '$lib/data/site';
	import DownloadSimpleIcon from 'phosphor-svelte/lib/DownloadSimpleIcon';
	import FilmSlateIcon from 'phosphor-svelte/lib/FilmSlateIcon';
	import MonitorPlayIcon from 'phosphor-svelte/lib/MonitorPlayIcon';
	import StackIcon from 'phosphor-svelte/lib/StackIcon';
	import LightningIcon from 'phosphor-svelte/lib/LightningIcon';
	import InfinityIcon from 'phosphor-svelte/lib/InfinityIcon';

	// Every buy button routes to the real store checkout.
	const STORE_URL = 'https://tricktrades.com/digital-store';

	type Format = 'Download' | 'Stream';
	type Product = {
		name: string;
		price: number;
		format: Format;
		group?: string; // sub-grouping for the DVD catalog
		series?: string; // links a box set to its single-volume series
		premium?: boolean;
	};
	type Category = { id: string; idx: string; label: string; products: Product[] };

	// --- B.O.S.S. Series: three flagship systems + the bundle ---
	const bossSingles: Product[] = [
		{ name: 'B.O.S.S. Carbon', price: 597, format: 'Download' },
		{ name: 'B.O.S.S. SPY Sniper', price: 597, format: 'Download' },
		{ name: 'B.O.S.S. Swing', price: 597, format: 'Download' }
	];
	const bossPack: Product = { name: 'BossPack', price: 997, format: 'Download', premium: true };

	const boss: Category = {
		id: 'boss',
		idx: '01',
		label: 'B.O.S.S. Series',
		products: [...bossSingles, bossPack]
	};

	// --- Single DVDs: the two War Room series + two standalones ---
	const dvds: Category = {
		id: 'dvds',
		idx: '02',
		label: 'Single DVDs',
		products: [
			{ name: 'War Room Technicals Vol. 1', price: 447, format: 'Download', group: 'Technicals' },
			{ name: 'War Room Technicals Vol. 2', price: 447, format: 'Download', group: 'Technicals' },
			{ name: 'War Room Technicals Vol. 3', price: 447, format: 'Download', group: 'Technicals' },
			{ name: 'War Room Technicals Vol. 4', price: 447, format: 'Download', group: 'Technicals' },
			{ name: 'War Room Psychology Vol. 1', price: 447, format: 'Download', group: 'Psychology' },
			{ name: 'War Room Psychology Vol. 2', price: 447, format: 'Download', group: 'Psychology' },
			{ name: 'War Room Psychology Vol. 3', price: 447, format: 'Download', group: 'Psychology' },
			{ name: 'War Room Psychology Vol. 4', price: 447, format: 'Download', group: 'Psychology' },
			{ name: 'Monster IPO', price: 397, format: 'Download', group: 'Standalone' },
			{ name: 'Line In The Sand', price: 297, format: 'Download', group: 'Standalone' }
		]
	};

	// --- Streamed Box Sets: each collects a full four-volume series ---
	const boxSets: Category = {
		id: 'box-sets',
		idx: '03',
		label: 'Streamed Box Sets',
		products: [
			{ name: 'War Room Technicals Box Set', price: 1497, format: 'Stream', series: 'Technicals' },
			{ name: 'War Room Psychology Box Set', price: 1497, format: 'Stream', series: 'Psychology' }
		]
	};

	const categories: Category[] = [boss, dvds, boxSets];

	const dvdGroups = [
		{ key: 'Technicals', label: 'War Room · Technicals' },
		{ key: 'Psychology', label: 'War Room · Psychology' },
		{ key: 'Standalone', label: 'Standalone masterclasses' }
	];

	// Honest bundle economics, computed from the real prices above.
	const bossSinglesTotal = bossSingles.reduce((sum, p) => sum + p.price, 0); // 1,791
	const bossSaving = bossSinglesTotal - bossPack.price; // 794

	function seriesTotal(series: string): number {
		return dvds.products
			.filter((p) => p.group === series)
			.reduce((sum, p) => sum + p.price, 0);
	}

	// Hero catalog index + page-wide totals.
	const catalog = categories.map((c) => ({
		idx: c.idx,
		label: c.label,
		count: c.products.length,
		from: Math.min(...c.products.map((p) => p.price))
	}));
	const totalTitles = categories.reduce((sum, c) => sum + c.products.length, 0); // 16

	// Money formatting: big integer + tabular cents, thousands separated.
	const intPart = (n: number) => Math.trunc(n).toLocaleString('en-US');
	const decPart = (n: number) => (n - Math.trunc(n)).toFixed(2).slice(1); // ".00"

	function jump(e: MouseEvent, href: string) {
		e.preventDefault();
		scrollToTarget(href);
	}

	// schema.org ItemList of every product with its offer.
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		name: 'Trick Trades Digital Store — Instant Downloads',
		url: site.domain + '/digital-store',
		numberOfItems: totalTitles,
		itemListElement: categories
			.flatMap((c) => c.products.map((p) => ({ product: p, category: c.label })))
			.map((entry, i) => ({
				'@type': 'ListItem',
				position: i + 1,
				item: {
					'@type': 'Product',
					name: entry.product.name,
					category: entry.category,
					brand: { '@type': 'Organization', name: site.name },
					url: STORE_URL,
					offers: {
						'@type': 'Offer',
						price: entry.product.price,
						priceCurrency: 'USD',
						url: STORE_URL,
						availability: 'https://schema.org/InStock',
						itemCondition: 'https://schema.org/NewCondition'
					}
				}
			}))
	};
</script>

<Seo
	title="Digital Store — Trick Trades Instant Downloads"
	description="Own the education forever. Downloadable B.O.S.S. strategy systems, War Room DVDs, and streamed box sets from Pat “Trick” Mitchell — one-time purchase, instant access, lifetime ownership."
	path="/digital-store"
	{jsonLd}
/>

{#snippet price(amount: number)}
	<span class="price">
		<span class="price__cur">$</span><span class="price__int num">{intPart(amount)}</span><span
			class="price__dec num">{decPart(amount)}</span
		>
	</span>
{/snippet}

{#snippet catHead(c: Category)}
	{@const count = c.products.length}
	{@const from = Math.min(...c.products.map((p) => p.price))}
	<header class="cat__head" data-anim {@attach reveal({ y: 28 })}>
		<p class="cat__kicker label">
			<span class="cat__idx">{c.idx}</span> / 03 — {count} {count === 1 ? 'title' : 'titles'}
		</p>
		<div class="cat__titlerow">
			<h2 class="cat__title">{c.label}</h2>
			<span class="cat__from num">from ${intPart(from)}</span>
		</div>
		<hr class="cat__rule hairline" />
	</header>
{/snippet}

<!-- ============================ HERO ============================ -->
<section class="tt-section store-hero" aria-labelledby="ds-title">
	<div class="store-hero__bg" aria-hidden="true">
		<div class="store-hero__grid grid-bg"></div>
		<div class="store-hero__glow" {@attach parallax(90)}></div>
	</div>

	<div class="tt-container store-hero__inner">
		<div class="store-hero__copy">
			<p class="store-hero__kicker label">
				<span class="store-hero__dot" aria-hidden="true"></span>Instant Downloads
			</p>

			<h1 id="ds-title" class="store-hero__title" data-split {@attach splitReveal({ stagger: 0.028 })}>
				Own the education. <span class="text-red">Forever.</span>
			</h1>

			<div class="store-hero__stack" data-anim-stagger {@attach reveal({ stagger: 0.12, y: 24 })}>
				<p class="store-hero__sub prose">
					Downloadable courses & masterclasses — instant access the moment you buy.
				</p>

				<div class="store-hero__cta">
					<Button href="#boss" onclick={(e) => jump(e, '#boss')}>Browse the catalog</Button>
					<span class="store-hero__meta label">
						<LightningIcon size={14} weight="fill" />
						{totalTitles} titles · lifetime access
					</span>
				</div>
			</div>
		</div>

		<aside class="catalog" data-anim {@attach reveal({ y: 40, duration: 1.1 })}>
			<div class="catalog__head">
				<span class="label">Catalog</span>
				<span class="label catalog__yr">2026</span>
			</div>
			<ul class="catalog__list">
				{#each catalog as c (c.label)}
					<li class="catalog__row">
						<span class="catalog__idx num">{c.idx}</span>
						<span class="catalog__name">{c.label}</span>
						<span class="catalog__count num">{c.count} titles</span>
						<span class="catalog__from num">from ${intPart(c.from)}</span>
					</li>
				{/each}
			</ul>
			<div class="catalog__foot">
				<span class="catalog__foot-item"><DownloadSimpleIcon size={14} /> Download</span>
				<span class="catalog__foot-item"><MonitorPlayIcon size={14} /> Stream</span>
				<span class="catalog__foot-item"><InfinityIcon size={14} /> Lifetime</span>
			</div>
		</aside>
	</div>
</section>

<!-- ============================ STORE ============================ -->
<section class="tt-section store" aria-label="Digital store catalog">
	<div class="store__bg grid-bg" aria-hidden="true"></div>

	<div class="tt-container store__inner">
		<!-- 01 · B.O.S.S. Series ------------------------------------ -->
		<div class="cat anchor" id="boss">
			{@render catHead(boss)}

			<div class="boss-grid" data-anim-stagger {@attach reveal({ stagger: 0.1, y: 36 })}>
				{#each bossSingles as p, i (p.name)}
					<article class="card" {@attach tilt(4)}>
						<div class="card__top">
							<span class="card__idx num">0{i + 1}</span>
							<span class="card__fmt"><DownloadSimpleIcon size={14} weight="bold" /> {p.format}</span>
						</div>
						<h3 class="card__name">{p.name}</h3>
						<div class="card__foot">
							{@render price(p.price)}
							<Button href={STORE_URL} variant="ghost" size="md" magnet={false}>Get it</Button>
						</div>
					</article>
				{/each}
			</div>

			<article class="pack" data-anim {@attach reveal({ y: 40, duration: 1.05 })} {@attach tilt(3)}>
				<span class="pack__glow" aria-hidden="true"></span>
				<div class="pack__intro">
					<span class="pack__tag label"><StackIcon size={14} weight="bold" /> Bundle · all three systems</span>
					<h3 class="pack__name">{bossPack.name}</h3>
					<p class="pack__note">
						Carbon, SPY Sniper and Swing in a single download —
						<strong>save ${intPart(bossSaving)}</strong> versus buying each system on its own.
					</p>
				</div>
				<div class="pack__buy">
					<div class="pack__prices">
						{@render price(bossPack.price)}
						<span class="pack__was num">${intPart(bossSinglesTotal)}</span>
					</div>
					<Button href={STORE_URL} variant="primary">Get the BossPack</Button>
				</div>
			</article>
		</div>

		<!-- 02 · Single DVDs ---------------------------------------- -->
		<div class="cat anchor" id="dvds">
			{@render catHead(dvds)}

			<div class="dvd-groups">
				{#each dvdGroups as g (g.key)}
					<div class="dvd-group">
						<p class="dvd-group__label label">{g.label}</p>
						<ul class="dvd-rows" data-anim-stagger {@attach reveal({ stagger: 0.06, y: 18 })}>
							{#each dvds.products.filter((p) => p.group === g.key) as p, i (p.name)}
								<li class="row">
									<span class="row__idx num">0{i + 1}</span>
									<h3 class="row__name">{p.name}</h3>
									<span class="row__fmt"><FilmSlateIcon size={14} /> {p.format}</span>
									<span class="row__price">{@render price(p.price)}</span>
									<div class="row__cta">
										<Button
											href={STORE_URL}
											variant="ghost"
											size="md"
											arrow={false}
											magnet={false}>Get it</Button
										>
									</div>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</div>

		<!-- 03 · Streamed Box Sets ---------------------------------- -->
		<div class="cat anchor" id="box-sets">
			{@render catHead(boxSets)}

			<div class="box-grid" data-anim-stagger {@attach reveal({ stagger: 0.12, y: 40 })}>
				{#each boxSets.products as p (p.name)}
					{@const singles = p.series ? seriesTotal(p.series) : 0}
					{@const save = singles - p.price}
					<article class="box" {@attach tilt(3)}>
						<span class="box__glow" aria-hidden="true"></span>
						<span class="box__tag label"><MonitorPlayIcon size={14} weight="bold" /> Stream · box set</span>
						<h3 class="box__name">{p.name}</h3>
						<p class="box__note">
							All four volumes of the series — streamed, not shipped. Lifetime access.
						</p>
						<div class="box__foot">
							<div class="box__pricing">
								{@render price(p.price)}
								{#if save > 0}
									<span class="box__save num">Save ${intPart(save)} vs. singles</span>
								{/if}
							</div>
							<Button href={STORE_URL} variant="primary">Stream the set</Button>
						</div>
					</article>
				{/each}
			</div>
		</div>
	</div>
</section>

<!-- ============================ OUTRO ============================ -->
<section class="tt-section outro" aria-labelledby="outro-title">
	<div class="tt-container outro__inner" data-anim {@attach reveal({ y: 32 })}>
		<span class="outro__mark" aria-hidden="true"><InfinityIcon size={40} weight="thin" /></span>
		<h2 id="outro-title" class="outro__title">
			One payment. <span class="script outro__script">yours forever.</span>
		</h2>
		<p class="outro__body prose">
			Every title in the store is a one-time purchase with lifetime access. Download or start
			streaming the second you check out — no subscription, no renewals, no expiry. Buy it once and
			it stays in your library for good.
		</p>
		<dl class="outro__meta">
			<div class="outro__meta-item">
				<dt class="label">Delivery</dt>
				<dd class="num">Instant</dd>
			</div>
			<div class="outro__meta-item">
				<dt class="label">Access</dt>
				<dd class="num">Lifetime</dd>
			</div>
			<div class="outro__meta-item">
				<dt class="label">Billing</dt>
				<dd class="num">One-time</dd>
			</div>
		</dl>
		<div class="outro__cta">
			<Button href={STORE_URL}>Enter the store</Button>
		</div>
	</div>
</section>

<style>
	/* ============================ HERO ============================ */
	.store-hero {
		position: relative;
		padding-top: calc(var(--tt-header-h) + clamp(2rem, 6vw, 4.5rem));
		overflow: clip;
	}
	.store-hero__bg {
		position: absolute;
		inset: 0;
		z-index: 0;
	}
	.store-hero__grid {
		position: absolute;
		inset: -10% 0 0;
		opacity: 0.45;
	}
	.store-hero__glow {
		position: absolute;
		top: -22%;
		right: -12%;
		width: 68vw;
		height: 68vw;
		max-width: 860px;
		max-height: 860px;
		background: radial-gradient(circle, rgba(178, 39, 37, 0.4), transparent 62%);
		filter: blur(22px);
	}

	.store-hero__inner {
		position: relative;
		z-index: 1;
		display: grid;
		gap: clamp(2.5rem, 5vw, 4rem);
		align-items: end;
	}

	.store-hero__kicker {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		color: var(--tt-fog);
	}
	.store-hero__dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--tt-red-bright);
		box-shadow: 0 0 12px var(--tt-red-bright);
	}

	.store-hero__title {
		margin-top: 1.4rem;
		font-size: var(--fs-h1);
		font-weight: 800;
		letter-spacing: -0.03em;
		line-height: 0.98;
		color: #fff;
	}

	.store-hero__sub {
		margin-top: 1.5rem;
	}
	.store-hero__cta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1.2rem;
		margin-top: 2rem;
	}
	.store-hero__meta {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--tt-mute);
	}

	/* Terminal-style catalog index */
	.catalog {
		position: relative;
		padding: clamp(1.4rem, 3vw, 2rem);
		border: 1px solid var(--tt-line);
		border-radius: var(--tt-radius-lg);
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent 60%), var(--tt-ink-2);
		box-shadow: var(--tt-shadow-card);
	}
	.catalog__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 1rem;
		border-bottom: 1px solid var(--tt-line);
		color: var(--tt-mute-2);
	}
	.catalog__yr {
		color: var(--tt-red-bright);
	}
	.catalog__list {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.catalog__row {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: baseline;
		gap: 0.3rem 1rem;
		padding: 1rem 0;
		border-bottom: 1px solid var(--tt-line);
	}
	.catalog__idx {
		grid-row: span 2;
		align-self: center;
		font-size: 0.82rem;
		color: var(--tt-red-bright);
	}
	.catalog__name {
		font-family: var(--tt-font-display);
		font-size: 1.15rem;
		letter-spacing: 0.02em;
		color: #fff;
	}
	.catalog__count {
		font-size: 0.72rem;
		text-align: right;
		color: var(--tt-mute);
	}
	.catalog__from {
		grid-column: 2 / 4;
		font-size: 0.74rem;
		letter-spacing: 0.04em;
		color: var(--tt-fog);
	}
	.catalog__foot {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-top: 1.2rem;
		font-family: var(--tt-font-mono);
		font-size: 0.68rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--tt-mute-2);
	}
	.catalog__foot-item {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}

	/* ======================= SHARED PRICE ======================== */
	.price {
		display: inline-flex;
		align-items: baseline;
		color: #fff;
	}
	.price__cur {
		align-self: flex-start;
		margin-top: 0.15em;
		font-size: 0.9rem;
		font-weight: 700;
		color: var(--tt-fog);
	}
	.price__int {
		font-size: clamp(1.7rem, 1.2rem + 1.4vw, 2.3rem);
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.03em;
	}
	.price__dec {
		font-size: 0.9rem;
		font-weight: 700;
		color: var(--tt-mute);
	}

	/* =========================== STORE =========================== */
	.store {
		position: relative;
		background: var(--tt-ink);
		overflow: clip;
		box-shadow:
			inset 0 1px 0 var(--tt-line),
			inset 0 -1px 0 var(--tt-line);
	}
	.store__bg {
		position: absolute;
		inset: 0;
		z-index: 0;
		opacity: 0.3;
	}
	.store__inner {
		position: relative;
		z-index: 1;
	}

	.cat + .cat {
		margin-top: clamp(4rem, 8vw, 7rem);
	}

	.cat__head {
		margin-bottom: clamp(1.8rem, 4vw, 2.8rem);
	}
	.cat__kicker {
		display: inline-flex;
		align-items: baseline;
		gap: 0.4rem;
		color: var(--tt-mute);
	}
	.cat__idx {
		color: var(--tt-red-bright);
	}
	.cat__titlerow {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.6rem 1.5rem;
		margin-top: 0.7rem;
	}
	.cat__title {
		font-size: var(--fs-h2);
		font-weight: 800;
		letter-spacing: -0.02em;
		color: #fff;
	}
	.cat__from {
		font-size: 0.8rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--tt-mute);
	}
	.cat__rule {
		margin-top: clamp(1.2rem, 3vw, 1.8rem);
	}

	/* --- B.O.S.S. single cards --- */
	.boss-grid {
		display: grid;
		gap: clamp(1rem, 2.4vw, 1.4rem);
	}
	.card {
		display: flex;
		flex-direction: column;
		min-height: 240px;
		padding: clamp(1.4rem, 3vw, 1.9rem);
		border: 1px solid var(--tt-line);
		border-radius: var(--tt-radius-lg);
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent 55%), var(--tt-ink-2);
		box-shadow: var(--tt-shadow-card);
		will-change: transform;
		transition: border-color 0.4s ease;
	}
	.card:hover {
		border-color: var(--tt-line-strong);
	}
	.card__top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}
	.card__idx {
		font-size: 0.78rem;
		color: var(--tt-mute-2);
	}
	.card__fmt {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-family: var(--tt-font-mono);
		font-size: 0.66rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--tt-fog);
	}
	.card__name {
		margin-top: 1.4rem;
		font-size: var(--fs-h4);
		font-weight: 700;
		letter-spacing: -0.01em;
		color: #fff;
	}
	.card__foot {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: space-between;
		gap: 1rem;
		margin-top: auto;
		padding-top: 1.6rem;
	}

	/* --- BossPack premium banner --- */
	.pack {
		position: relative;
		display: grid;
		gap: 1.6rem;
		margin-top: clamp(1rem, 2.4vw, 1.4rem);
		padding: clamp(1.6rem, 3.4vw, 2.6rem);
		border: 1px solid rgba(178, 39, 37, 0.5);
		border-radius: var(--tt-radius-lg);
		background:
			linear-gradient(180deg, rgba(178, 39, 37, 0.12), transparent 45%),
			var(--tt-ink-2);
		box-shadow:
			var(--tt-glow-red),
			var(--tt-shadow-lg);
		overflow: clip;
		will-change: transform;
	}
	.pack__glow {
		position: absolute;
		z-index: 0;
		top: -40%;
		right: -8%;
		width: 42%;
		aspect-ratio: 1;
		background: radial-gradient(circle, rgba(255, 51, 51, 0.28), transparent 66%);
		filter: blur(14px);
		pointer-events: none;
	}
	.pack__intro,
	.pack__buy {
		position: relative;
		z-index: 1;
	}
	.pack__tag {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		color: var(--tt-red-bright);
	}
	.pack__name {
		margin-top: 0.9rem;
		font-size: var(--fs-h3);
		font-weight: 800;
		letter-spacing: -0.02em;
		color: #fff;
	}
	.pack__note {
		margin-top: 0.8rem;
		max-width: 46ch;
		color: var(--tt-fog);
		font-size: 0.98rem;
	}
	.pack__note strong {
		color: #fff;
	}
	.pack__buy {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1.2rem 1.8rem;
	}
	.pack__prices {
		display: flex;
		align-items: baseline;
		gap: 0.9rem;
	}
	.pack .price__int {
		font-size: clamp(2.4rem, 1.6rem + 2.4vw, 3.4rem);
	}
	.pack__was {
		font-size: 1rem;
		color: var(--tt-mute-2);
		text-decoration: line-through;
	}

	/* --- Single DVD catalog rows --- */
	.dvd-groups {
		display: grid;
		gap: clamp(1.8rem, 4vw, 2.6rem);
	}
	.dvd-group__label {
		display: block;
		margin-bottom: 0.4rem;
		color: var(--tt-mute-2);
	}
	.dvd-rows {
		list-style: none;
		margin: 0;
		padding: 0;
		border-top: 1px solid var(--tt-line);
	}
	.row {
		display: grid;
		grid-template-columns: 2.2rem 1fr auto;
		grid-template-areas:
			'idx name price'
			'idx fmt cta';
		align-items: center;
		gap: 0.35rem 1rem;
		padding: 1.1rem 0;
		border-bottom: 1px solid var(--tt-line);
		transition: border-color 0.4s ease;
	}
	.row:hover {
		border-bottom-color: var(--tt-line-strong);
	}
	.row__idx {
		grid-area: idx;
		font-size: 0.8rem;
		color: var(--tt-red-bright);
	}
	.row__name {
		grid-area: name;
		font-size: 1.05rem;
		font-weight: 600;
		letter-spacing: -0.005em;
		color: #fff;
	}
	.row__fmt {
		grid-area: fmt;
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-family: var(--tt-font-mono);
		font-size: 0.64rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--tt-mute);
	}
	.row__price {
		grid-area: price;
		justify-self: end;
	}
	.row .price__int {
		font-size: 1.4rem;
	}
	.row__cta {
		grid-area: cta;
		justify-self: end;
	}

	/* --- Streamed box sets --- */
	.box-grid {
		display: grid;
		gap: clamp(1.1rem, 2.6vw, 1.6rem);
	}
	.box {
		position: relative;
		display: flex;
		flex-direction: column;
		padding: clamp(1.6rem, 3.2vw, 2.4rem);
		border: 1px solid var(--tt-line-strong);
		border-radius: var(--tt-radius-lg);
		background:
			linear-gradient(180deg, rgba(245, 196, 81, 0.07), transparent 42%),
			var(--tt-ink-2);
		box-shadow: var(--tt-shadow-card);
		overflow: clip;
		will-change: transform;
	}
	.box__glow {
		position: absolute;
		z-index: 0;
		top: -35%;
		left: -10%;
		width: 46%;
		aspect-ratio: 1;
		background: radial-gradient(circle, rgba(230, 161, 47, 0.2), transparent 66%);
		filter: blur(16px);
		pointer-events: none;
	}
	.box > * {
		position: relative;
		z-index: 1;
	}
	.box__tag {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		color: var(--tt-gold);
	}
	.box__name {
		margin-top: 1rem;
		font-size: var(--fs-h3);
		font-weight: 800;
		letter-spacing: -0.02em;
		color: #fff;
	}
	.box__note {
		margin-top: 0.8rem;
		max-width: 42ch;
		color: var(--tt-fog);
		font-size: 0.96rem;
	}
	.box__foot {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: space-between;
		gap: 1.2rem;
		margin-top: auto;
		padding-top: 1.8rem;
	}
	.box__pricing {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}
	.box .price__int {
		font-size: clamp(2.2rem, 1.6rem + 2vw, 3rem);
	}
	.box__save {
		font-size: 0.72rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--tt-gold);
	}

	/* =========================== OUTRO =========================== */
	.outro {
		position: relative;
		text-align: center;
		background:
			radial-gradient(ellipse 70% 60% at 50% 0%, rgba(178, 39, 37, 0.14), transparent 60%),
			var(--tt-black);
	}
	.outro__inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		max-width: 720px;
	}
	.outro__mark {
		display: grid;
		place-items: center;
		width: 74px;
		height: 74px;
		border-radius: 50%;
		color: var(--tt-red-bright);
		border: 1px solid var(--tt-line-strong);
		background: rgba(255, 255, 255, 0.02);
	}
	.outro__title {
		margin-top: 1.6rem;
		font-size: var(--fs-h2);
		font-weight: 800;
		letter-spacing: -0.02em;
		color: #fff;
	}
	.outro__script {
		color: var(--tt-red-bright);
		font-size: 1.25em;
	}
	.outro__body {
		margin-top: 1.4rem;
		text-align: center;
	}
	.outro__meta {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1.2rem 2.4rem;
		margin: 2.4rem 0 0;
		padding: 1.6rem 0;
		border-top: 1px solid var(--tt-line);
		border-bottom: 1px solid var(--tt-line);
	}
	.outro__meta-item {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}
	.outro__meta-item dt {
		color: var(--tt-mute-2);
	}
	.outro__meta-item dd {
		margin: 0;
		font-size: 1.05rem;
		font-weight: 700;
		color: #fff;
	}
	.outro__cta {
		margin-top: 2.2rem;
	}

	/* ========================= RESPONSIVE ======================== */
	@media (min-width: 720px) {
		.row {
			grid-template-columns: 2.6rem minmax(0, 1fr) 8.5rem 7.5rem auto;
			grid-template-areas: 'idx name fmt price cta';
			gap: 1.4rem;
			padding: 1.15rem 0;
		}
		.row__price {
			justify-self: end;
		}
	}

	@media (min-width: 760px) {
		.boss-grid {
			grid-template-columns: repeat(3, 1fr);
		}
		.pack {
			grid-template-columns: 1.4fr 1fr;
			align-items: center;
			gap: 2.6rem;
		}
		.pack__buy {
			justify-content: flex-end;
		}
		.box-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (min-width: 900px) {
		.store-hero__inner {
			grid-template-columns: 1.08fr 0.92fr;
		}
		.store-hero__title {
			margin-top: 1.8rem;
		}
	}
</style>
