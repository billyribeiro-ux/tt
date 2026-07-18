<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/Button.svelte';
	import Seo from '$lib/components/Seo.svelte';
</script>

<Seo title="Page not found" description="The page you’re looking for doesn’t exist." />

<section class="err tt-section">
	<div class="tt-container err__inner">
		<p class="label">Error / {page.status}</p>
		<h1 class="err__code num" aria-hidden="true">{page.status}</h1>
		<h2 class="err__title">
			{page.status === 404 ? 'This chart went off the screen.' : 'Something broke on our side.'}
		</h2>
		<p class="err__body">
			{page.status === 404
				? 'The page you’re after doesn’t exist — it may have moved, or the link was mistyped.'
				: (page.error?.message ?? 'An unexpected error occurred.')}
		</p>
		<div class="err__cta">
			<Button href="/">Back to the homepage</Button>
		</div>
	</div>
</section>

<style>
	.err {
		min-height: calc(100vh - var(--tt-header-h));
		display: grid;
		align-items: center;
		padding-top: var(--tt-header-h);
	}
	.err__inner {
		position: relative;
	}
	.err__code {
		font-size: var(--fs-mega);
		font-weight: 800;
		line-height: 0.9;
		letter-spacing: -0.04em;
		color: transparent;
		-webkit-text-stroke: 1px rgb(var(--tt-red-bright-rgb) / 0.5);
		margin-top: 1rem;
	}
	.err__title {
		margin-top: 1.2rem;
		font-size: var(--fs-h2);
		max-width: 16ch;
	}
	.err__body {
		margin-top: 1.2rem;
		max-width: 46ch;
		color: var(--tt-fog);
		font-size: var(--fs-lead);
	}
	.err__cta {
		margin-top: 2.4rem;
	}
</style>
