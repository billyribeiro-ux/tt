<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import AcademyHero from '$lib/pages/day-trading-academy/AcademyHero.svelte';
	import CourseLibrary from '$lib/pages/day-trading-academy/CourseLibrary.svelte';
	import AcademyJoin from '$lib/pages/day-trading-academy/AcademyJoin.svelte';
	import { courses } from '$lib/pages/day-trading-academy/data';
	import { site } from '$lib/data/site';

	// Absolute, per-course URL. The three Crystal Ball products share one course
	// page, so each carries a distinct fragment — keeping every structured-data
	// entry a unique URL instead of three conflicting offers on the same one.
	const courseUrl = (c: (typeof courses)[number]) =>
		site.domain + c.href + (c.anchor ? `#${c.anchor}` : '');

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		name: 'Trick Trades Day Trading Academy',
		description:
			'The Trick Trades course library — from beginner fundamentals to advanced price-action strategy.',
		numberOfItems: courses.length,
		itemListElement: courses.map((c, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			item: {
				'@type': 'Course',
				name: c.name,
				description: c.tagline,
				url: courseUrl(c),
				provider: {
					'@type': 'Organization',
					name: site.name,
					sameAs: site.domain
				},
				...(c.price
					? {
							offers: {
								'@type': 'Offer',
								price: c.price,
								priceCurrency: 'USD',
								url: courseUrl(c),
								availability: 'https://schema.org/InStock'
							}
						}
					: {})
			}
		}))
	};
</script>

<Seo
	title="Day Trading Academy — Trick Trades Courses"
	description="A full library of day-trading courses — from beginner fundamentals to advanced price-action strategy. Boot Camp, Crystal Ball, Momentum and more."
	path="/day-trading-academy"
	breadcrumbs={[{ name: 'Day Trading Academy', path: '/day-trading-academy' }]}
	{jsonLd}
/>

<AcademyHero />
<CourseLibrary />
<AcademyJoin />
