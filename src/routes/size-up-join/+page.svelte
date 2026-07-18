<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import Pricing from '$lib/sections/Pricing.svelte';
	import JoinHero from '$lib/pages/size-up-join/JoinHero.svelte';
	import JoinApp from '$lib/pages/size-up-join/JoinApp.svelte';
	import JoinGuarantee from '$lib/pages/size-up-join/JoinGuarantee.svelte';
	import { plans, site } from '$lib/data/site';

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Product',
		name: 'Trick Trades Size UP! Membership',
		description:
			'Trick Trades’ flagship day-trading membership: the Size UP! App on iOS, Android and Desktop, a nightly video watch list, the live 9 a.m. EST Pre-Market Plan of Attack, 24/7 chat, and a 50+ lesson Boot Camp.',
		brand: { '@type': 'Brand', name: site.name },
		url: site.domain + '/size-up-join',
		offers: plans.map((p) => ({
			'@type': 'Offer',
			name: p.name,
			price: p.price,
			priceCurrency: 'USD',
			url: site.domain + p.href,
			availability: 'https://schema.org/InStock'
		}))
	};
</script>

<Seo
	title="Join Size UP! Membership"
	description="The Trick Trades Size UP! membership: the app on iOS, Android and Desktop, a nightly watch list, the live 9 a.m. EST plan, 24/7 chat and 50+ Boot Camp lessons."
	path="/size-up-join"
	breadcrumbs={[{ name: 'Join Size UP!', path: '/size-up-join' }]}
	{jsonLd}
/>

<JoinHero />
<JoinApp />
<Pricing />
<JoinGuarantee />
