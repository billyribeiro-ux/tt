<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { site } from '$lib/data/site';
	import GoldHero from '$lib/pages/crystal-ball-gold-edition-course/GoldHero.svelte';
	import GoldConcept from '$lib/pages/crystal-ball-gold-edition-course/GoldConcept.svelte';
	import GoldEnroll from '$lib/pages/crystal-ball-gold-edition-course/GoldEnroll.svelte';

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Course',
		name: 'Crystal Ball: Gold Edition',
		description:
			'The most advanced tier of the Crystal Ball series — natural-movement theory taught live across nine months of live trades with Pat Mitchell.',
		url: 'https://tricktrades.com/crystal-ball-gold-edition-course',
		provider: {
			'@type': 'Organization',
			name: site.name,
			sameAs: site.domain
		}
	};
</script>

<Seo
	title="Crystal Ball: Gold Edition — Trick Trades"
	description="The advanced tier of the Crystal Ball series: natural-movement theory, taught live across nine months of live trades with Pat Mitchell."
	path="/crystal-ball-gold-edition-course"
	breadcrumbs={[
		{ name: 'Academy', path: '/day-trading-academy' },
		{ name: 'Crystal Ball: Gold Edition', path: '/crystal-ball-gold-edition-course' }
	]}
	{jsonLd}
/>

<GoldHero />
<GoldConcept />
<GoldEnroll />
