<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { reveal, tilt } from '$lib/motion';
	import DownloadSimpleIcon from 'phosphor-svelte/lib/DownloadSimpleIcon';
	import FilmSlateIcon from 'phosphor-svelte/lib/FilmSlateIcon';
	import MonitorPlayIcon from 'phosphor-svelte/lib/MonitorPlayIcon';
	import StackIcon from 'phosphor-svelte/lib/StackIcon';
	import {
		type Category,
		boss,
		bossPack,
		bossSaving,
		bossSingles,
		bossSinglesTotal,
		boxSets,
		CATEGORY_COUNT_LABEL,
		decPart,
		dvdGroups,
		dvds,
		intPart,
		seriesTotal,
		STORE_URL
	} from './data';
</script>

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
			<span class="cat__idx">{c.idx}</span> / {CATEGORY_COUNT_LABEL} — {count}
			{count === 1 ? 'title' : 'titles'}
		</p>
		<div class="cat__titlerow">
			<h2 class="cat__title">{c.label}</h2>
			<span class="cat__from num">from ${intPart(from)}</span>
		</div>
		<hr class="cat__rule hairline" />
	</header>
{/snippet}

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

<style>
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
		border: 1px solid rgb(var(--tt-red-rgb) / 0.5);
		border-radius: var(--tt-radius-lg);
		background:
			linear-gradient(180deg, rgb(var(--tt-red-rgb) / 0.12), transparent 45%),
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
		background: radial-gradient(circle, rgb(var(--tt-red-bright-rgb) / 0.28), transparent 66%);
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
</style>
