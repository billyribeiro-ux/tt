<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { site } from '$lib/data/site';

	import AlphaHero from '$lib/pages/project-alpha/AlphaHero.svelte';
	import AlphaHypothesis from '$lib/pages/project-alpha/AlphaHypothesis.svelte';
	import AlphaEquipment from '$lib/pages/project-alpha/AlphaEquipment.svelte';
	import AlphaPillars from '$lib/pages/project-alpha/AlphaPillars.svelte';
	import AlphaProtocol from '$lib/pages/project-alpha/AlphaProtocol.svelte';
	import AlphaDailyRoutine from '$lib/pages/project-alpha/AlphaDailyRoutine.svelte';
	import AlphaDisclosures from '$lib/pages/project-alpha/AlphaDisclosures.svelte';
	import AlphaCta from '$lib/pages/project-alpha/AlphaCta.svelte';

	const applyUrl = 'https://tricktrades.com/project-alpha';

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'ResearchProject',
		name: 'Project ALPHA — Alpha Brainwave Training Study',
		url: applyUrl,
		description:
			'A 90-day neuroscience research study investigating whether alpha-brainwave (8–12 Hz) training improves day-trading performance, emotional regulation, and decision consistency.',
		funder: { '@type': 'Organization', name: site.name, url: site.domain },
		parentOrganization: { '@type': 'Organization', name: site.name, url: site.domain },
		knowsAbout: [
			'Alpha brainwave training',
			'EEG neurofeedback',
			'Trading psychology',
			'Emotional regulation',
			'Decision consistency'
		]
	};
</script>

<Seo
	title="Project ALPHA — Alpha Brainwave Training Study"
	description="A 90-day neuroscience study testing whether alpha-brainwave (8–12 Hz) training makes day traders calmer, sharper, and more consistent under pressure."
	path="/project-alpha"
	breadcrumbs={[{ name: 'Project ALPHA', path: '/project-alpha' }]}
	{jsonLd}
/>

<AlphaHero />
<AlphaHypothesis />
<AlphaEquipment />
<AlphaPillars />
<AlphaProtocol />
<AlphaDailyRoutine />
<AlphaDisclosures />
<AlphaCta />
