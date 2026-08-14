<script lang="ts">
	import '../app.css';
	// Latin subset only; the full CSS files also pull devanagari + latin-ext woff2s
	// (~500 KB of glyphs an English-only site never renders).
	import '@fontsource/poppins/latin-400.css';
	import '@fontsource/poppins/latin-500.css';
	import '@fontsource/poppins/latin-600.css';
	import '@fontsource/poppins/latin-700.css';
	import '@fontsource/poppins/latin-800.css';
	// Italics are loaded here, not per-route. /momentum imported 400-italic on its
	// own page and /project-alpha imported its italics from another family
	// entirely; both meant an italic that rendered on one route and was
	// synthesised on the next. 400 covers italic body copy, 700 the italic display
	// lines in project-alpha's hero and FinalCTA — the only weights any italic
	// rule on the site inherits.
	import '@fontsource/poppins/latin-400-italic.css';
	import '@fontsource/poppins/latin-700-italic.css';
	import '@fontsource/allerta-stencil/latin-400.css';
	import '@fontsource/reenie-beanie/latin-400.css';

	import { onNavigate, beforeNavigate } from '$app/navigation';
	import { updated } from '$app/state';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import FbGroup from '$lib/sections/FbGroup.svelte';
	import { enableMotionClass, prefersReducedMotion, refreshTriggers } from '$lib/motion';

	let { children } = $props();

	/**
	 * FORCE A REAL PAGE LOAD ONCE A NEW BUILD IS LIVE.
	 *
	 * `version.pollInterval` (vite.config.ts) makes `updated.current` flip to true when
	 * the server reports a newer build. Without this hook that signal is inert: the
	 * visitor keeps client-side navigating on the old bundle and never sees the new
	 * site. Setting `location.href` turns the next navigation into a full document
	 * request, which fetches the new HTML and the new chunks.
	 *
	 * `willUnload` is checked because the browser is already leaving the app in that
	 * case, and reassigning location would fight it.
	 */
	beforeNavigate((navigation) => {
		if (updated.current && !navigation.willUnload && navigation.to?.url) {
			location.href = navigation.to.url.href;
		}
	});

	// Cinematic cross-route transitions via the View Transitions API.
	// Skipped for reduced-motion users and browsers without support.
	onNavigate((navigation) => {
		if (!document.startViewTransition || prefersReducedMotion()) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	$effect(() => {
		enableMotionClass();
		const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
		fonts?.ready.then(refreshTriggers);
		// Re-sync ScrollTrigger positions once late assets (images) have loaded.
		const onLoad = () => refreshTriggers();
		window.addEventListener('load', onLoad);
		return () => window.removeEventListener('load', onLoad);
	});
</script>

<a href="#main" class="skip-link">Skip to content</a>

<div class="app grain">
	<Header />
	<main id="main" tabindex="-1">
		{@render children()}
	</main>
	<FbGroup />
	<Footer />
</div>

<style>
	.app {
		position: relative;
		min-height: 100vh;
	}
	main {
		display: block;
	}
	main:focus {
		outline: none;
	}
</style>
