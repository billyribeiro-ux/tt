<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { site } from '$lib/data/site';
	import BootcampHero from '$lib/pages/day-trading-bootcamp/BootcampHero.svelte';
	import BootcampDuality from '$lib/pages/day-trading-bootcamp/BootcampDuality.svelte';
	import BootcampFoundation from '$lib/pages/day-trading-bootcamp/BootcampFoundation.svelte';
	import BootcampWhoFor from '$lib/pages/day-trading-bootcamp/BootcampWhoFor.svelte';
	import BootcampEnroll from '$lib/pages/day-trading-bootcamp/BootcampEnroll.svelte';

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Course',
		name: 'Day Trading Boot Camp',
		description:
			'The Trick Trades foundation course — 50+ game-changing lessons on the skills and emotions of day trading: mechanics, strategy and mindset.',
		url: 'https://tricktrades.com/day-trading-bootcamp',
		provider: {
			'@type': 'Organization',
			name: site.name,
			sameAs: site.domain
		},
		offers: {
			'@type': 'Offer',
			price: 97,
			priceCurrency: 'USD',
			url: 'https://tricktrades.com/day-trading-bootcamp',
			availability: 'https://schema.org/InStock'
		}
	};
</script>

<Seo
	title="Day Trading Boot Camp — Trick Trades"
	description="The foundation course: 50+ game-changing lessons on the skills and emotions of day trading — mechanics, strategy and mindset. Lifetime access, one-time $97."
	path="/day-trading-bootcamp"
	breadcrumbs={[
		{ name: 'Academy', path: '/day-trading-academy' },
		{ name: 'Day Trading Boot Camp', path: '/day-trading-bootcamp' }
	]}
	{jsonLd}
/>

<BootcampHero />
<BootcampDuality />
<BootcampFoundation />
<BootcampWhoFor />
<BootcampEnroll />
