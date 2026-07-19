<script lang="ts">
	import LightningIcon from 'phosphor-svelte/lib/LightningIcon';
	import EnvelopeSimpleIcon from 'phosphor-svelte/lib/EnvelopeSimpleIcon';
	import FacebookLogoIcon from 'phosphor-svelte/lib/FacebookLogoIcon';
	import { site, external } from '$lib/data/site';

	// Internal routes are relative (prerendered here); WP-only pages (blog,
	// newsletter, legal) are absolute URLs to the live site.
	const columns = [
		{
			title: 'Academy',
			links: [
				{ label: 'Day Trading Boot Camp', href: '/day-trading-bootcamp' },
				{ label: 'Crystal Ball', href: '/crystal-ball-course' },
				{ label: 'Crystal Ball: Gold Edition', href: '/crystal-ball-gold-edition-course' },
				{ label: 'Momentum Course', href: '/momentum-course' },
				{ label: 'All Courses', href: '/day-trading-academy' }
			]
		},
		{
			title: 'Store',
			links: [
				{ label: 'Trick Trades Core', href: '/trick-trades-core' },
				{ label: 'Instant Downloads', href: '/digital-store' },
				{ label: 'Polaris', href: '/polaris' },
				{ label: 'Project ALPHA', href: '/project-alpha' }
			]
		},
		{
			title: 'Resources',
			links: [
				{ label: 'Contact Us', href: '/contact-us' },
				{ label: 'Newsletter', href: external.situationRoom },
				{ label: 'Testimonials', href: '/testimonials' },
				{ label: 'Trade Recaps', href: external.tradeRecaps },
				{ label: 'Cancellation Policy', href: external.cancellationPolicy }
			]
		},
		{
			title: 'Legal',
			links: [
				{ label: 'Privacy Policy', href: external.privacyPolicy },
				{ label: 'Disclaimer', href: external.disclaimer },
				{ label: 'Terms & Conditions', href: external.terms }
			]
		}
	];

	// Stamped at prerender time; a static rebuild is when "now" is decided.
	const year = new Date().getFullYear();
</script>

<footer class="ft">
	<!-- Risk disclosure: real, and required for a trading-education service -->
	<div class="ft__risk">
		<div class="tt-container ft__risk-inner">
			<span class="label">Risk Disclosure</span>
			<p>
				Trading is purely and 100% education. We do not trade your money, send alerts, or give
				financial advice. Day trading involves substantial risk. Most people lose or never make any
				money day trading; results shown are not typical. You must be 18 or older. Your decisions
				are yours alone to make.
			</p>
		</div>
	</div>

	<div class="tt-container ft__main">
		<div class="ft__brand">
			<a href="/" class="ft__logo" aria-label="Trick Trades home">
				<span class="ft__mark"><LightningIcon weight="fill" size={20} /></span>
				<span class="ft__word">TRICK<span>TRADES</span></span>
			</a>
			<p class="ft__tag">{site.tagline}</p>
			<div class="ft__social">
				<a href={site.social.facebookGroup} class="ft__soc" aria-label="Private Facebook group">
					<FacebookLogoIcon weight="fill" size={18} />
				</a>
				<a href="mailto:{site.support}" class="ft__soc" aria-label="Email support">
					<EnvelopeSimpleIcon weight="fill" size={18} />
				</a>
			</div>
		</div>

		<nav class="ft__cols" aria-label="Footer">
			{#each columns as col (col.title)}
				<div class="ft__col">
					<h3 class="ft__col-title label">{col.title}</h3>
					<ul>
						{#each col.links as link (link.label)}
							<li><a href={link.href}>{link.label}</a></li>
						{/each}
					</ul>
				</div>
			{/each}
		</nav>
	</div>

	<div class="tt-container ft__bottom">
		<p class="num">© {year} {site.legalEntity}. All rights reserved.</p>
		<p>
			Support: <a href="mailto:{site.support}">{site.support}</a>
		</p>
	</div>
</footer>

<style>
	.ft {
		position: relative;
		background: linear-gradient(180deg, var(--tt-black), #060607);
		border-top: 1px solid var(--tt-line);
	}
	.ft__risk {
		border-bottom: 1px solid var(--tt-line);
		background: rgb(var(--tt-red-rgb) / 0.05);
	}
	.ft__risk-inner {
		display: grid;
		gap: 0.6rem;
		padding-block: 1.6rem;
	}
	.ft__risk .label {
		color: var(--tt-red-bright);
	}
	.ft__risk p {
		max-width: 90ch;
		font-size: 0.82rem;
		line-height: 1.6;
		color: var(--tt-mute);
	}

	.ft__main {
		display: grid;
		grid-template-columns: 1fr;
		gap: 3rem;
		padding-block: clamp(3rem, 6vw, 5rem);
	}
	.ft__logo {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
	}
	.ft__mark {
		display: grid;
		place-items: center;
		width: 34px;
		height: 34px;
		border-radius: 9px;
		color: #fff;
		background: linear-gradient(150deg, var(--tt-red-bright), var(--tt-red-600));
	}
	.ft__word {
		font-family: var(--tt-font-display);
		font-size: 1.15rem;
		letter-spacing: 0.14em;
		color: #fff;
	}
	.ft__word span {
		color: var(--tt-red-bright);
	}
	.ft__tag {
		margin-top: 1.1rem;
		max-width: 34ch;
		color: var(--tt-mute);
		font-size: 0.95rem;
	}
	.ft__social {
		display: flex;
		gap: 0.6rem;
		margin-top: 1.4rem;
	}
	.ft__soc {
		display: grid;
		place-items: center;
		width: 40px;
		height: 40px;
		border-radius: 10px;
		color: var(--tt-fog);
		border: 1px solid var(--tt-line);
		transition:
			color 0.25s ease,
			border-color 0.25s ease,
			background 0.25s ease;
	}
	.ft__soc:hover {
		color: #fff;
		border-color: var(--tt-red);
		background: rgb(var(--tt-red-rgb) / 0.14);
	}

	.ft__cols {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 2rem 1.5rem;
	}
	.ft__col-title {
		margin-bottom: 1rem;
	}
	.ft__col ul {
		list-style: none;
		padding: 0;
		display: grid;
		gap: 0.6rem;
	}
	.ft__col a {
		font-size: 0.9rem;
		color: var(--tt-fog);
		transition: color 0.2s ease;
	}
	.ft__col a:hover {
		color: var(--tt-red-bright);
	}

	.ft__bottom {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1.5rem;
		justify-content: space-between;
		align-items: center;
		padding-block: 1.5rem;
		border-top: 1px solid var(--tt-line);
		font-size: 0.8rem;
		color: var(--tt-mute-2);
	}
	.ft__bottom a {
		color: var(--tt-fog);
	}
	.ft__bottom a:hover {
		color: var(--tt-red-bright);
	}

	@media (min-width: 720px) {
		.ft__main {
			grid-template-columns: 1.2fr 2fr;
		}
		.ft__cols {
			grid-template-columns: repeat(4, 1fr);
		}
	}
</style>
