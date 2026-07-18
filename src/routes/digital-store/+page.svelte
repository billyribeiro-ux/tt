<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import StoreHero from '$lib/pages/digital-store/StoreHero.svelte';
	import StoreCatalog from '$lib/pages/digital-store/StoreCatalog.svelte';
	import StoreOutro from '$lib/pages/digital-store/StoreOutro.svelte';
	import { categories, STORE_URL, totalTitles } from '$lib/pages/digital-store/data';
	import { site } from '$lib/data/site';

	// schema.org ItemList of every product with its offer.
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		name: 'Trick Trades Digital Store — Instant Downloads',
		url: site.domain + '/digital-store',
		numberOfItems: totalTitles,
		itemListElement: categories
			.flatMap((c) => c.products.map((p) => ({ product: p, category: c.label })))
			.map((entry, i) => ({
				'@type': 'ListItem',
				position: i + 1,
				item: {
					'@type': 'Product',
					name: entry.product.name,
					category: entry.category,
					brand: { '@type': 'Organization', name: site.name },
					url: STORE_URL,
					offers: {
						'@type': 'Offer',
						price: entry.product.price,
						priceCurrency: 'USD',
						url: STORE_URL,
						availability: 'https://schema.org/InStock',
						itemCondition: 'https://schema.org/NewCondition'
					}
				}
			}))
	};
</script>

<Seo
	title="Digital Store — Trick Trades Instant Downloads"
	description="Own the education forever. Downloadable B.O.S.S. strategy systems, War Room DVDs, and streamed box sets from Pat “Trick” Mitchell — one-time purchase, instant access, lifetime ownership."
	path="/digital-store"
	{jsonLd}
/>

<StoreHero />
<StoreCatalog />
<StoreOutro />
