<script lang="ts">
	import ListIcon from 'phosphor-svelte/lib/ListIcon';
	import XIcon from 'phosphor-svelte/lib/XIcon';
	import LightningIcon from 'phosphor-svelte/lib/LightningIcon';
	import type { Attachment } from 'svelte/attachments';
	import { scrollToTarget } from '$lib/motion';
	import { site, external } from '$lib/data/site';
	import Button from './Button.svelte';

	const links = [
		{ label: 'The Struggle', href: '#struggle' },
		{ label: 'The Formula', href: '#formula' },
		{ label: 'Mentorship', href: '#mentorship' },
		{ label: 'Proof', href: '#proof' },
		{ label: 'Pricing', href: '#pricing' },
		{ label: 'FAQ', href: '#faq' }
	];

	let scrollY = $state(0);
	let innerHeight = $state(0);
	let scrollHeight = $state(1);
	let open = $state(false);

	const scrolled = $derived(scrollY > 20);
	const progress = $derived(Math.min(1, scrollY / Math.max(1, scrollHeight - innerHeight)));

	// Track total scroll height — re-measured on resize and whenever the document
	// itself grows/shrinks (FAQ accordions etc.), so the progress bar never lies.
	$effect(() => {
		const measure = () => (scrollHeight = document.documentElement.scrollHeight);
		measure();
		const ro = new ResizeObserver(measure);
		ro.observe(document.documentElement);
		window.addEventListener('resize', measure);
		return () => {
			ro.disconnect();
			window.removeEventListener('resize', measure);
		};
	});

	function go(e: MouseEvent, href: string) {
		if (!href.startsWith('#')) return;
		e.preventDefault();
		open = false;
		scrollToTarget(href);
	}

	// Lock body scroll while the mobile menu is open.
	$effect(() => {
		if (typeof document === 'undefined') return;
		document.body.style.overflow = open ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	});

	/**
	 * The full modal contract for the mobile menu: move focus in, trap Tab,
	 * close on Escape, make the page behind inert, restore focus on close.
	 */
	const modalMenu: Attachment = (node) => {
		const menu = node as HTMLElement;
		const previouslyFocused = document.activeElement as HTMLElement | null;
		const focusables = () =>
			Array.from(
				menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
			);
		// Everything except the menu (and the fixed header holding the close burger)
		// becomes inert while the dialog is open.
		const inerted: Element[] = [];
		for (const child of Array.from(document.body.children)) {
			if (child.contains(menu) || child.tagName === 'SCRIPT') continue;
			if (!(child as HTMLElement).inert) {
				(child as HTMLElement).inert = true;
				inerted.push(child);
			}
		}
		const app = document.querySelector<HTMLElement>('.app');
		const header = app?.querySelector<HTMLElement>('header');
		const appInerted: HTMLElement[] = [];
		if (app && app.contains(menu)) {
			for (const child of Array.from(app.children) as HTMLElement[]) {
				if (child === header || child.contains(menu)) continue;
				if (!child.inert) {
					child.inert = true;
					appInerted.push(child);
				}
			}
		}
		focusables()[0]?.focus();
		const onKeydown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				e.preventDefault();
				open = false;
				return;
			}
			if (e.key !== 'Tab') return;
			const items = focusables();
			// Include the burger (inside the non-inert header) in the cycle.
			const burger = header?.querySelector<HTMLElement>('.hdr__burger');
			const cycle = burger ? [burger, ...items] : items;
			if (!cycle.length) return;
			const idx = cycle.indexOf(document.activeElement as HTMLElement);
			const next = e.shiftKey
				? cycle[(idx - 1 + cycle.length) % cycle.length]
				: cycle[(idx + 1) % cycle.length];
			e.preventDefault();
			next.focus();
		};
		document.addEventListener('keydown', onKeydown, true);
		return () => {
			document.removeEventListener('keydown', onKeydown, true);
			for (const el of inerted) (el as HTMLElement).inert = false;
			for (const el of appInerted) el.inert = false;
			previouslyFocused?.focus();
		};
	};
</script>

<svelte:window bind:scrollY bind:innerHeight />

<header class="hdr" class:hdr--solid={scrolled}>
	<div class="hdr__progress" style:transform="scaleX({progress})" aria-hidden="true"></div>
	<div class="tt-container hdr__bar">
		<a href="/" class="brand" aria-label="Trick Trades home">
			<span class="brand__mark" aria-hidden="true"><LightningIcon weight="fill" size={20} /></span>
			<span class="brand__name">TRICK<span>TRADES</span></span>
		</a>

		<nav class="hdr__nav" aria-label="Primary">
			{#each links as link (link.href)}
				<a href={link.href} onclick={(e) => go(e, link.href)}>{link.label}</a>
			{/each}
		</nav>

		<div class="hdr__actions">
			<a class="hdr__login" href={external.login}>Login</a>
			<Button href="#pricing" size="md" arrow={false} onclick={(e) => go(e, '#pricing')}>
				Join Now
			</Button>
		</div>

		<button
			class="hdr__burger"
			aria-label={open ? 'Close menu' : 'Open menu'}
			aria-expanded={open}
			aria-controls="mobile-menu"
			onclick={() => (open = !open)}
		>
			{#if open}<XIcon size={26} weight="bold" aria-hidden="true" />{:else}<ListIcon
					size={26}
					weight="bold"
					aria-hidden="true"
				/>{/if}
		</button>
	</div>
</header>

{#if open}
	<div class="menu" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu" {@attach modalMenu}>
		<nav class="menu__nav" aria-label="Menu">
			{#each links as link, i (link.href)}
				<a href={link.href} style:--i={i} onclick={(e) => go(e, link.href)}>
					<span class="menu__idx" aria-hidden="true">0{i + 1}</span>
					{link.label}
				</a>
			{/each}
		</nav>
		<div class="menu__cta">
			<Button href="#pricing" block onclick={(e) => go(e, '#pricing')}>Join Now</Button>
			<a class="menu__login" href={external.login}>Member Login</a>
		</div>
	</div>
{/if}

<style>
	.hdr {
		position: fixed;
		inset: 0 0 auto;
		z-index: 100;
		transition:
			background 0.4s ease,
			box-shadow 0.4s ease,
			backdrop-filter 0.4s ease;
	}
	.hdr--solid {
		background: rgba(10, 10, 11, 0.72);
		backdrop-filter: blur(16px) saturate(1.4);
		box-shadow: 0 1px 0 var(--tt-line);
	}
	.hdr__progress {
		position: absolute;
		left: 0;
		bottom: 0;
		height: 2px;
		width: 100%;
		transform-origin: left;
		background: linear-gradient(90deg, var(--tt-red), var(--tt-red-bright), var(--tt-gold));
		opacity: 0;
		transition: opacity 0.3s ease;
	}
	.hdr--solid .hdr__progress {
		opacity: 1;
	}
	.hdr__bar {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		height: var(--tt-header-h);
	}

	.brand {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		margin-right: auto;
	}
	.brand__mark {
		display: grid;
		place-items: center;
		width: 34px;
		height: 34px;
		border-radius: 9px;
		color: #fff;
		background: linear-gradient(150deg, var(--tt-red-bright), var(--tt-red-600));
		box-shadow: 0 6px 18px -6px rgb(var(--tt-red-bright-rgb) / 0.7);
	}
	.brand__name {
		font-family: var(--tt-font-display);
		font-size: 1.15rem;
		letter-spacing: 0.14em;
		color: var(--tt-white);
	}
	.brand__name span {
		color: var(--tt-red-bright);
	}

	.hdr__nav {
		display: none;
		gap: 1.7rem;
	}
	.hdr__nav a {
		position: relative;
		font-size: 0.82rem;
		font-weight: 500;
		letter-spacing: 0.02em;
		color: var(--tt-fog);
		padding: 0.3rem 0;
		transition: color 0.25s ease;
	}
	.hdr__nav a::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: -2px;
		height: 2px;
		width: 100%;
		background: var(--tt-red-bright);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
	}
	.hdr__nav a:hover {
		color: var(--tt-white);
	}
	.hdr__nav a:hover::after {
		transform: scaleX(1);
	}

	.hdr__actions {
		display: none;
		align-items: center;
		gap: 1.1rem;
	}
	.hdr__login {
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--tt-fog);
		transition: color 0.25s ease;
	}
	.hdr__login:hover {
		color: var(--tt-white);
	}

	.hdr__burger {
		display: inline-grid;
		place-items: center;
		width: 44px;
		height: 44px;
		color: var(--tt-white);
	}

	/* Mobile menu overlay */
	.menu {
		position: fixed;
		inset: 0;
		z-index: 99;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 2rem;
		padding: 6rem 2rem 3rem;
		background:
			radial-gradient(120% 80% at 80% 0%, rgb(var(--tt-red-rgb) / 0.25), transparent 60%),
			rgba(8, 8, 9, 0.98);
		backdrop-filter: blur(6px);
		animation: menuIn 0.45s cubic-bezier(0.22, 1, 0.36, 1);
	}
	@keyframes menuIn {
		from {
			opacity: 0;
			clip-path: inset(0 0 100% 0);
		}
		to {
			opacity: 1;
			clip-path: inset(0 0 0 0);
		}
	}
	.menu__nav {
		display: flex;
		flex-direction: column;
	}
	.menu__nav a {
		display: flex;
		align-items: baseline;
		gap: 1rem;
		padding: 0.6rem 0;
		font-family: var(--tt-font-display);
		font-size: clamp(1.8rem, 11vw, 3rem);
		letter-spacing: 0.02em;
		color: var(--tt-white);
		border-bottom: 1px solid var(--tt-line);
		animation: linkIn 0.5s both cubic-bezier(0.22, 1, 0.36, 1);
		animation-delay: calc(var(--i) * 0.06s + 0.1s);
	}
	.menu__idx {
		font-family: var(--tt-font-body);
		font-size: 0.8rem;
		color: var(--tt-red-bright);
	}
	@keyframes linkIn {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.menu__cta {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
	}
	.menu__login {
		font-size: 0.9rem;
		color: var(--tt-fog);
	}

	@media (min-width: 992px) {
		.hdr__nav,
		.hdr__actions {
			display: flex;
		}
		.hdr__burger {
			display: none;
		}
	}
</style>
