<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { site } from '$lib/data/site';
	import MomentumHero from '$lib/pages/momentum-course/MomentumHero.svelte';
	import MomentumScope from '$lib/pages/momentum-course/MomentumScope.svelte';
	import MomentumBoss from '$lib/pages/momentum-course/MomentumBoss.svelte';
	import MomentumEnroll from '$lib/pages/momentum-course/MomentumEnroll.svelte';

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Course',
		name: 'Momentum',
		description:
			'Trick Trades’ flagship program — high-level day-trading coaching with Pat Mitchell across 15 modules and 115 video lessons, plus 14 bonus lessons and B.O.S.S. Carbon (a $597 value) included.',
		url: 'https://tricktrades.com/momentum-course',
		provider: {
			'@type': 'Organization',
			name: site.name,
			sameAs: site.domain
		}
	};
</script>

<Seo
	title="Momentum — Flagship Coaching — Trick Trades"
	description="Trick Trades’ flagship program: high-level day-trading coaching with Pat Mitchell — 15 modules, 115 video lessons, 14 bonus lessons and B.O.S.S. Carbon included."
	path="/momentum-course"
	breadcrumbs={[
		{ name: 'Academy', path: '/day-trading-academy' },
		{ name: 'Momentum', path: '/momentum-course' }
	]}
	{jsonLd}
/>

<MomentumHero />
<MomentumScope />
<MomentumBoss />
<MomentumEnroll />
