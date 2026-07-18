<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import Hero from '$lib/sections/Hero.svelte';
	import Struggle from '$lib/sections/Struggle.svelte';
	import Questions from '$lib/sections/Questions.svelte';
	import Mastery from '$lib/sections/Mastery.svelte';
	import Formula from '$lib/sections/Formula.svelte';
	import PatBio from '$lib/sections/PatBio.svelte';
	import Membership from '$lib/sections/Membership.svelte';
	import ReasonsNot from '$lib/sections/ReasonsNot.svelte';
	import Proof from '$lib/sections/Proof.svelte';
	import Guarantee from '$lib/sections/Guarantee.svelte';
	import Pricing from '$lib/sections/Pricing.svelte';
	import Faq from '$lib/sections/Faq.svelte';
	import FinalCta from '$lib/sections/FinalCta.svelte';
	import { site, faqs, plans } from '$lib/data/site';

	const jsonLd = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': ['EducationalOrganization', 'Organization'],
				'@id': site.domain + '/#organization',
				name: site.name,
				url: site.domain,
				email: site.support,
				description: site.description,
				logo: { '@type': 'ImageObject', url: site.domain + '/logo-300.png' },
				founder: { '@type': 'Person', name: 'Pat “Trick” Mitchell' }
			},
			{
				'@type': 'WebSite',
				'@id': site.domain + '/#website',
				url: site.domain,
				name: site.name,
				publisher: { '@id': site.domain + '/#organization' },
				inLanguage: 'en-US'
			},
			{
				'@type': 'FAQPage',
				'@id': site.domain + '/#faq',
				mainEntity: faqs.map((f) => ({
					'@type': 'Question',
					name: f.q,
					acceptedAnswer: { '@type': 'Answer', text: f.a }
				}))
			},
			{
				'@type': 'Product',
				name: 'Trick Trades Size UP! Membership',
				description:
					'Day-trading education & daily live mentorship: video lessons, the Size UP app, live premarket plan, and 24/7 community.',
				brand: { '@id': site.domain + '/#organization' },
				offers: plans.map((p) => ({
					'@type': 'Offer',
					name: p.name,
					price: p.price,
					priceCurrency: 'USD',
					// plan hrefs are absolute checkout URLs on the live store
					url: p.href,
					availability: 'https://schema.org/InStock'
				}))
			}
		]
	};
</script>

<Seo
	title="Trick Trades | Day Trading Education & Mentorship by Pat “Trick” Mitchell"
	path="/"
	{jsonLd}
/>

<Hero />
<Struggle />
<Questions />
<Mastery />
<Formula />
<PatBio />
<Membership />
<ReasonsNot />
<Proof />
<Guarantee />
<Pricing />
<Faq />
<FinalCta />
