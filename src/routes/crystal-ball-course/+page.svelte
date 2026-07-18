<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { site } from '$lib/data/site';
	import CrystalHero from '$lib/pages/crystal-ball-course/CrystalHero.svelte';
	import CrystalVolumes from '$lib/pages/crystal-ball-course/CrystalVolumes.svelte';
	import CrystalMethod from '$lib/pages/crystal-ball-course/CrystalMethod.svelte';
	import CrystalEnroll from '$lib/pages/crystal-ball-course/CrystalEnroll.svelte';

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Course',
		name: 'Crystal Ball',
		description:
			'Pat Mitchell’s price-action series: two volumes that teach you to dissect price action and see moves before they happen. Eight modules per volume, plus a live-trading bonus hour in the bundle.',
		url: 'https://tricktrades.com/crystal-ball-course',
		provider: {
			'@type': 'Organization',
			name: site.name,
			sameAs: site.domain
		},
		offers: {
			'@type': 'Offer',
			price: 399,
			priceCurrency: 'USD',
			url: 'https://tricktrades.com/crystal-ball-course',
			availability: 'https://schema.org/InStock'
		}
	};
</script>

<Seo
	title="Crystal Ball Price-Action Course | Trick Trades"
	description="Pat Mitchell’s price-action series: dissect price action and see moves before they happen. Two volumes, eight modules each, plus a live bonus hour."
	path="/crystal-ball-course"
	breadcrumbs={[
		{ name: 'Academy', path: '/day-trading-academy' },
		{ name: 'Crystal Ball', path: '/crystal-ball-course' }
	]}
	{jsonLd}
/>

<CrystalHero />
<CrystalVolumes />
<CrystalMethod />
<CrystalEnroll />
