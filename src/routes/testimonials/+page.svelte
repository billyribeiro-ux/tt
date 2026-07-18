<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import TestimonialsHero from '$lib/pages/testimonials/TestimonialsHero.svelte';
	import TestimonialsWall from '$lib/pages/testimonials/TestimonialsWall.svelte';
	import TestimonialsPress from '$lib/pages/testimonials/TestimonialsPress.svelte';
	import TestimonialsMore from '$lib/pages/testimonials/TestimonialsMore.svelte';
	import { site } from '$lib/data/site';

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'AboutPage',
		'@id': site.domain + '/testimonials#page',
		url: site.domain + '/testimonials',
		name: 'Trick Trades Testimonials',
		description:
			'Real member testimonials for Trick Trades — day-trading education and mentorship led by Pat “Trick” Mitchell.',
		about: {
			'@type': ['EducationalOrganization', 'Organization'],
			name: site.name,
			url: site.domain,
			founder: { '@type': 'Person', name: 'Pat “Trick” Mitchell' }
		}
	};
</script>

<Seo
	title="Testimonials — Real Trick Trades Member Stories"
	description="Hear from real Trick Trades members — a truck driver, an ER nurse practitioner, and an IT consultant — on the education, coaching, and mentoring inside the room."
	path="/testimonials"
	breadcrumbs={[{ name: 'Testimonials', path: '/testimonials' }]}
	{jsonLd}
/>

<TestimonialsHero />
<TestimonialsWall />
<TestimonialsPress />
<TestimonialsMore />
