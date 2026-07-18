<script lang="ts">
	import ListIcon from 'phosphor-svelte/lib/ListIcon';
	import XIcon from 'phosphor-svelte/lib/XIcon';
	import CaretDownIcon from 'phosphor-svelte/lib/CaretDownIcon';
	import type { Attachment } from 'svelte/attachments';
	import { page } from '$app/state';
	import { nav, external } from '$lib/data/site';
	import Button from './Button.svelte';

	let scrollY = $state(0);
	let innerHeight = $state(0);
	let scrollHeight = $state(1);
	let open = $state(false);
	/** Which desktop dropdown is open (nav item label), if any. */
	let dropdown = $state<string | null>(null);
	/** Which mobile group is expanded. */
	let mobileGroup = $state<string | null>(null);

	const scrolled = $derived(scrollY > 20);
	const progress = $derived(Math.min(1, scrollY / Math.max(1, scrollHeight - innerHeight)));
	const path = $derived(page.url.pathname);

	// Track total scroll height, re-measured on resize and whenever the document
	// itself grows or shrinks (FAQ accordions etc.), so the progress bar never lies.
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

	// Lock body scroll while the mobile menu is open.
	$effect(() => {
		if (typeof document === 'undefined') return;
		document.body.style.overflow = open ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	});

	// Close any open dropdown when navigating.
	$effect(() => {
		void path;
		dropdown = null;
		open = false;
	});

	const isActive = (href: string) =>
		href !== '/' && !href.startsWith('http') && path.startsWith(href);

	function toggleDropdown(label: string) {
		dropdown = dropdown === label ? null : label;
	}

	/** Close a desktop dropdown when focus or the pointer leaves the whole item. */
	const dropdownItem = (label: string): Attachment => {
		return (node) => {
			const el = node as HTMLElement;
			const maybeClose = () => {
				requestAnimationFrame(() => {
					if (!el.contains(document.activeElement)) {
						dropdown = dropdown === label ? null : dropdown;
					}
				});
			};
			const onKey = (e: KeyboardEvent) => {
				if (e.key === 'Escape' && dropdown === label) {
					dropdown = null;
					el.querySelector<HTMLElement>('button')?.focus();
				}
			};
			const enter = () => (dropdown = label);
			const leave = () => (dropdown = dropdown === label ? null : dropdown);
			const fine = window.matchMedia('(pointer: fine)').matches;
			if (fine) {
				el.addEventListener('pointerenter', enter);
				el.addEventListener('pointerleave', leave);
			}
			el.addEventListener('focusout', maybeClose);
			el.addEventListener('keydown', onKey);
			return () => {
				if (fine) {
					el.removeEventListener('pointerenter', enter);
					el.removeEventListener('pointerleave', leave);
				}
				el.removeEventListener('focusout', maybeClose);
				el.removeEventListener('keydown', onKey);
			};
		};
	};

	/**
	 * The full modal contract for the mobile menu: move focus in, trap Tab,
	 * close on Escape, make the page behind inert, restore focus on close.
	 */
	const modalMenu: Attachment = (node) => {
		const menu = node as HTMLElement;
		const previouslyFocused = document.activeElement as HTMLElement | null;
		const focusables = () =>
			Array.from(
				menu.querySelectorAll<HTMLElement>(
					'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
				)
			);
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
	<div class="tt-container tt-container--wide hdr__bar">
		<a href="/" class="brand" aria-label="Trick Trades home">
			<img class="brand__logo" src="/logo-300.png" alt="" width="34" height="34" />
			<span class="brand__name">TRICK<span>TRADES</span></span>
		</a>

		<nav class="hdr__nav" aria-label="Primary">
			<ul class="hdr__list">
				{#each nav as item (item.label)}
					<li class="hdr__item" {@attach item.children ? dropdownItem(item.label) : undefined}>
						{#if item.children}
							<button
								type="button"
								class="hdr__link hdr__link--btn"
								class:hdr__link--active={isActive(item.href)}
								aria-expanded={dropdown === item.label}
								aria-controls="dd-{item.label.replaceAll(' ', '-')}"
								onclick={() => toggleDropdown(item.label)}
							>
								{item.label}
								<CaretDownIcon size={12} weight="bold" aria-hidden="true" />
							</button>
							<ul
								class="hdr__dd"
								id="dd-{item.label.replaceAll(' ', '-')}"
								data-open={dropdown === item.label}
							>
								{#each item.children as child (child.label)}
									<li>
										<a
											class="hdr__dd-link"
											class:hdr__dd-link--active={isActive(child.href)}
											href={child.href}
										>
											{child.label}
										</a>
									</li>
								{/each}
							</ul>
						{:else}
							<a
								class="hdr__link"
								class:hdr__link--active={item.href === '/' ? path === '/' : isActive(item.href)}
								href={item.href}
							>
								{item.label}
							</a>
						{/if}
					</li>
				{/each}
			</ul>
		</nav>

		<div class="hdr__actions">
			<a class="hdr__login" href={external.login}>Login</a>
			<Button href="/size-up-join" size="md" arrow={false}>Join Now</Button>
		</div>

		<button
			type="button"
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
	<div
		class="menu"
		id="mobile-menu"
		role="dialog"
		aria-modal="true"
		aria-label="Menu"
		{@attach modalMenu}
	>
		<nav class="menu__nav" aria-label="Menu">
			<ul class="menu__list">
				{#each nav as item, i (item.label)}
					<li class="menu__item" style:--i={i}>
						{#if item.children}
							<button
								type="button"
								class="menu__link menu__link--btn"
								aria-expanded={mobileGroup === item.label}
								aria-controls="mg-{item.label.replaceAll(' ', '-')}"
								onclick={() => (mobileGroup = mobileGroup === item.label ? null : item.label)}
							>
								<span class="menu__idx" aria-hidden="true">0{i + 1}</span>
								{item.label}
								<span class="menu__caret" data-open={mobileGroup === item.label} aria-hidden="true">
									<CaretDownIcon size={18} weight="bold" />
								</span>
							</button>
							{#if mobileGroup === item.label}
								<ul class="menu__sub" id="mg-{item.label.replaceAll(' ', '-')}">
									{#each item.children as child (child.label)}
										<li>
											<a class="menu__sub-link" href={child.href}>{child.label}</a>
										</li>
									{/each}
								</ul>
							{/if}
						{:else}
							<a class="menu__link" href={item.href}>
								<span class="menu__idx" aria-hidden="true">0{i + 1}</span>
								{item.label}
							</a>
						{/if}
					</li>
				{/each}
			</ul>
		</nav>
		<div class="menu__cta">
			<Button href="/size-up-join" block>Join Now</Button>
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
		gap: clamp(1rem, 2vw, 2rem);
		height: var(--tt-header-h);
	}

	.brand {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		margin-right: auto;
		flex: none;
	}
	.brand__logo {
		width: 34px;
		height: 34px;
		border-radius: 8px;
		object-fit: cover;
		box-shadow: 0 6px 18px -6px rgb(var(--tt-red-bright-rgb) / 0.5);
	}
	.brand__name {
		font-family: var(--tt-font-display);
		font-size: 1.1rem;
		letter-spacing: 0.13em;
		color: var(--tt-white);
		white-space: nowrap;
	}
	.brand__name span {
		color: var(--tt-red-bright);
	}

	/* ---- Desktop nav with dropdowns ---- */
	.hdr__nav {
		display: none;
	}
	.hdr__list {
		display: flex;
		align-items: center;
		gap: clamp(0.2rem, 1vw, 0.8rem);
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.hdr__item {
		position: relative;
	}
	.hdr__link {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.55rem 0.65rem;
		font-size: 0.82rem;
		font-weight: 500;
		letter-spacing: 0.02em;
		color: var(--tt-fog);
		border-radius: 8px;
		transition:
			color 0.25s ease,
			background 0.25s ease;
		white-space: nowrap;
	}
	.hdr__link:hover,
	.hdr__item:has(.hdr__dd[data-open='true']) .hdr__link--btn {
		color: var(--tt-white);
		background: rgba(255, 255, 255, 0.05);
	}
	.hdr__link--active {
		color: var(--tt-white);
	}
	.hdr__link--active::after {
		content: '';
		position: absolute;
		left: 0.65rem;
		right: 0.65rem;
		bottom: 0.15rem;
		height: 2px;
		border-radius: 1px;
		background: var(--tt-red-bright);
	}

	.hdr__dd {
		position: absolute;
		top: calc(100% + 0.55rem);
		left: 50%;
		translate: -50% 0;
		min-width: 232px;
		margin: 0;
		padding: 0.5rem;
		list-style: none;
		background: rgba(16, 16, 19, 0.96);
		backdrop-filter: blur(18px);
		border: 1px solid var(--tt-line-strong);
		border-radius: var(--tt-radius);
		box-shadow: var(--tt-shadow-card);
		opacity: 0;
		visibility: hidden;
		translate: -50% 6px;
		transition:
			opacity 0.22s ease,
			translate 0.22s cubic-bezier(0.22, 1, 0.36, 1),
			visibility 0.22s;
	}
	.hdr__dd[data-open='true'] {
		opacity: 1;
		visibility: visible;
		translate: -50% 0;
	}
	.hdr__dd-link {
		display: block;
		padding: 0.6rem 0.8rem;
		font-size: 0.84rem;
		font-weight: 500;
		color: var(--tt-fog);
		border-radius: 8px;
		transition:
			color 0.2s ease,
			background 0.2s ease;
	}
	.hdr__dd-link:hover {
		color: var(--tt-white);
		background: rgb(var(--tt-red-rgb) / 0.16);
	}
	.hdr__dd-link--active {
		color: var(--tt-red-bright);
	}

	.hdr__actions {
		display: none;
		align-items: center;
		gap: 1rem;
		flex: none;
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

	/* ---- Mobile menu overlay ---- */
	.menu {
		position: fixed;
		inset: 0;
		z-index: 99;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: calc(var(--tt-header-h) + 1.5rem) 1.5rem 2.5rem;
		overflow-y: auto;
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
	.menu__list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
	}
	.menu__item {
		border-bottom: 1px solid var(--tt-line);
		animation: linkIn 0.5s both cubic-bezier(0.22, 1, 0.36, 1);
		animation-delay: calc(var(--i) * 0.05s + 0.08s);
	}
	.menu__link {
		display: flex;
		align-items: baseline;
		gap: 0.9rem;
		width: 100%;
		padding: 0.85rem 0;
		font-family: var(--tt-font-display);
		font-size: clamp(1.35rem, 6.5vw, 2rem);
		letter-spacing: 0.02em;
		color: var(--tt-white);
		text-align: left;
	}
	.menu__idx {
		font-family: var(--tt-font-mono);
		font-size: 0.75rem;
		color: var(--tt-red-bright);
	}
	.menu__caret {
		margin-left: auto;
		display: inline-grid;
		place-items: center;
		color: var(--tt-mute);
		transition: rotate 0.25s ease;
	}
	.menu__caret[data-open='true'] {
		rotate: 180deg;
	}
	.menu__sub {
		list-style: none;
		margin: 0;
		padding: 0 0 1rem 2.1rem;
		display: grid;
		gap: 0.15rem;
	}
	.menu__sub-link {
		display: block;
		padding: 0.45rem 0;
		font-size: 0.95rem;
		font-weight: 500;
		color: var(--tt-fog);
	}
	.menu__sub-link:active,
	.menu__sub-link:hover {
		color: var(--tt-white);
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
		margin-top: auto;
	}
	.menu__login {
		font-size: 0.9rem;
		color: var(--tt-fog);
	}

	/* Industry-standard desktop breakpoint for the full nav */
	@media (min-width: 1024px) {
		.hdr__nav {
			display: block;
		}
		.hdr__actions {
			display: flex;
		}
		.hdr__burger {
			display: none;
		}
	}
</style>
