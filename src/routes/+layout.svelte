<script lang="ts">
	import '../app.css';
	// Latin subset only; the full CSS files also pull devanagari + latin-ext woff2s
	// (~500 KB of glyphs an English-only site never renders).
	import '@fontsource/poppins/latin-400.css';
	import '@fontsource/poppins/latin-500.css';
	import '@fontsource/poppins/latin-600.css';
	import '@fontsource/poppins/latin-700.css';
	import '@fontsource/poppins/latin-800.css';
	import '@fontsource/allerta-stencil/latin-400.css';
	import '@fontsource/reenie-beanie/latin-400.css';

	import { onNavigate } from '$app/navigation';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import FbGroup from '$lib/sections/FbGroup.svelte';
	import { enableMotionClass, prefersReducedMotion, refreshTriggers } from '$lib/motion';

	let { children } = $props();

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
