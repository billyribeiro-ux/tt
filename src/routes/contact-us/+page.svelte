<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import ContactHero from '$lib/pages/contact-us/ContactHero.svelte';
	import ContactChannels from '$lib/pages/contact-us/ContactChannels.svelte';
	import ContactSupport from '$lib/pages/contact-us/ContactSupport.svelte';
	import { site } from '$lib/data/site';

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'ContactPage',
		'@id': site.domain + '/contact-us#page',
		url: site.domain + '/contact-us',
		name: 'Contact Trick Trades',
		description:
			'How to reach the Trick Trades team: email support for account and billing questions, and the private Facebook group for the community.',
		about: {
			'@type': ['EducationalOrganization', 'Organization'],
			name: site.name,
			url: site.domain,
			email: site.support,
			contactPoint: {
				'@type': 'ContactPoint',
				contactType: 'customer support',
				email: site.support,
				availableLanguage: 'en'
			},
			sameAs: [site.social.facebookGroup]
		}
	};
</script>

<Seo
	title="Contact Us: Reach the Trick Trades Support Team"
	description="Get in touch with Trick Trades: email support for account and billing, or the private Facebook group. A real person reads every message."
	path="/contact-us"
	breadcrumbs={[{ name: 'Contact Us', path: '/contact-us' }]}
	{jsonLd}
/>

<ContactHero />
<ContactChannels />
<ContactSupport />
