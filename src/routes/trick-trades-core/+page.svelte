<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import CoreHero from '$lib/pages/trick-trades-core/CoreHero.svelte';
	import CoreSessions from '$lib/pages/trick-trades-core/CoreSessions.svelte';
	import CoreTopics from '$lib/pages/trick-trades-core/CoreTopics.svelte';
	import CorePricing from '$lib/pages/trick-trades-core/CorePricing.svelte';
	import { BUY_URL, packages } from '$lib/pages/trick-trades-core/data';

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Product',
		name: 'Trick Trades Core',
		category: 'Binaural meditation program',
		description:
			'A binaural-beats meditation program that rewires the subconscious survival responses that sabotage traders — four daily sessions across five behavioural topics.',
		brand: { '@type': 'Brand', name: 'Trick Trades' },
		url: BUY_URL,
		offers: packages.map((p) => ({
			'@type': 'Offer',
			name: p.name,
			price: p.price,
			priceCurrency: 'USD',
			url: BUY_URL,
			availability: 'https://schema.org/InStock'
		}))
	};
</script>

<Seo
	title="Trick Trades Core — Binaural Meditation for Traders"
	description="Binaural-beats meditation that rewires the survival responses sabotaging traders — 4 daily sessions, 5 patterns. From $25, Volume One $97."
	path="/trick-trades-core"
	breadcrumbs={[{ name: 'Trick Trades Core', path: '/trick-trades-core' }]}
	{jsonLd}
/>

<CoreHero />
<CoreSessions />
<CoreTopics />
<CorePricing />
