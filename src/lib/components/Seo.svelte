<script lang="ts">
	import { site } from '$lib/data/site';

	type Props = {
		title?: string;
		description?: string;
		path?: string;
		image?: string;
		imageAlt?: string;
		type?: string;
		jsonLd?: unknown;
		/** Breadcrumb trail for subpages: [{ name, path }]; home is prepended automatically. */
		breadcrumbs?: { name: string; path: string }[];
	};

	let {
		title = 'Trick Trades: Master the Skill. Master the Emotion. Get Your Freedom.',
		description = site.description,
		path = '/',
		image = site.videoPoster,
		imageAlt = 'Pat “Trick” Mitchell of Trick Trades',
		type = 'website',
		jsonLd,
		breadcrumbs
	}: Props = $props();

	const canonical = $derived(site.domain + (path === '/' ? '' : path));
	const fullTitle = $derived(title.includes(site.name) ? title : `${title} | ${site.name}`);
	const breadcrumbLd = $derived(
		breadcrumbs?.length
			? {
					'@context': 'https://schema.org',
					'@type': 'BreadcrumbList',
					itemListElement: [{ name: 'Home', path: '/' }, ...breadcrumbs].map((c, i) => ({
						'@type': 'ListItem',
						position: i + 1,
						name: c.name,
						item: site.domain + (c.path === '/' ? '' : c.path)
					}))
				}
			: undefined
	);
	// JSON-LD must be injected via {@html}. We build it only from our own controlled
	// site data and escape every `<` to <, which neutralizes any tag breakout / XSS.
	const ldTag = (data: unknown) =>
		'<script type="application/ld+json">' +
		JSON.stringify(data).replace(/</g, '\\u003c') +
		'</' +
		'script>';
	const jsonLdTag = $derived(
		(jsonLd ? ldTag(jsonLd) : '') + (breadcrumbLd ? ldTag(breadcrumbLd) : '')
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
	<meta property="og:image:alt" content={imageAlt} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />
	<meta name="twitter:image:alt" content={imageAlt} />

	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html jsonLdTag}
</svelte:head>
