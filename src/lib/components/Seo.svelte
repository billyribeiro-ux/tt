<script lang="ts">
	import { site } from '$lib/data/site';

	type Props = {
		title?: string;
		description?: string;
		path?: string;
		image?: string;
		type?: string;
		jsonLd?: unknown;
	};

	let {
		title = 'Trick Trades — Master the Skill. Master the Emotion. Get Your Freedom.',
		description = site.description,
		path = '/',
		image = site.videoPoster,
		type = 'website',
		jsonLd
	}: Props = $props();

	const canonical = $derived(site.domain + (path === '/' ? '' : path));
	const fullTitle = $derived(title.includes(site.name) ? title : `${title} — ${site.name}`);
	// JSON-LD must be injected via {@html}. We build it only from our own controlled
	// site data and escape every `<` to <, which neutralizes any tag breakout / XSS.
	const jsonLdTag = $derived(
		jsonLd
			? '<script type="application/ld+json">' +
					JSON.stringify(jsonLd).replace(/</g, '\\u003c') +
					'</' +
					'script>'
			: ''
	);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	<meta
		name="robots"
		content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
	/>

	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={image} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="800" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />

	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html jsonLdTag}
</svelte:head>
