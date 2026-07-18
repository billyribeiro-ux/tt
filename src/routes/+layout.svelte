<script lang="ts">
	import '../app.css';
	import '@fontsource/poppins/400.css';
	import '@fontsource/poppins/500.css';
	import '@fontsource/poppins/600.css';
	import '@fontsource/poppins/700.css';
	import '@fontsource/poppins/800.css';
	import '@fontsource/allerta-stencil/400.css';
	import '@fontsource/reenie-beanie/400.css';

	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { enableMotionClass, refreshTriggers } from '$lib/motion';

	let { children } = $props();

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

<div class="app grain">
	<Header />
	<main>
		{@render children()}
	</main>
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
</style>
