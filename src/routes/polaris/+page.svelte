<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import PolarisHero from '$lib/pages/polaris/PolarisHero.svelte';
	import PolarisTiers from '$lib/pages/polaris/PolarisTiers.svelte';
	import PolarisProcess from '$lib/pages/polaris/PolarisProcess.svelte';
	import PolarisInclusions from '$lib/pages/polaris/PolarisInclusions.svelte';
	import PolarisFinalCta from '$lib/pages/polaris/PolarisFinalCta.svelte';
	import { BUY_URL, POLARIS_PRICE, tiers } from '$lib/pages/polaris/data';

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Service',
		serviceType: 'Financial coaching',
		name: 'Polaris',
		description: `A 90-day, 1:1 financial and budget coaching program for day traders — so you stop overleveraging and trade from a position of strength. Two tiers, each $${POLARIS_PRICE} per month.`,
		provider: { '@type': 'Organization', name: 'Trick Trades' },
		url: BUY_URL,
		offers: tiers.map((t) => ({
			'@type': 'Offer',
			name: t.name,
			price: POLARIS_PRICE,
			priceCurrency: 'USD',
			url: BUY_URL,
			availability: 'https://schema.org/InStock'
		}))
	};
</script>

<Seo
	title="Polaris — Financial Coaching for Day Traders | Trick Trades"
	description={`Polaris is a 90-day, 1:1 financial and budget coaching program so day traders stop overleveraging and trade from a position of strength. Two tiers, each $${POLARIS_PRICE} per month.`}
	path="/polaris"
	{jsonLd}
/>

<PolarisHero />
<PolarisTiers />
<PolarisProcess />
<PolarisInclusions />
<PolarisFinalCta />
