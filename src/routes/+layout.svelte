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
	import { createSmoother, enableMotionClass, refreshTriggers } from '$lib/motion';

	let { children } = $props();

	$effect(() => {
		enableMotionClass();
		const dispose = createSmoother();
		const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
		fonts?.ready.then(refreshTriggers);
		return dispose;
	});
</script>

<div class="app grain">
	<Header />
	<div id="smooth-wrapper">
		<div id="smooth-content">
			<main>
				{@render children()}
			</main>
			<Footer />
		</div>
	</div>
</div>

<style>
	.app {
		position: relative;
		min-height: 100vh;
	}
	/* ScrollSmoother transforms #smooth-content; the header lives outside it so it stays pinned. */
	#smooth-wrapper {
		position: relative;
	}
	main {
		display: block;
	}
</style>
