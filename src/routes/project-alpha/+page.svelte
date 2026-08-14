<script lang="ts">
	import '$lib/pages/project-alpha/alpha.css';
	/* NO @fontsource IMPORTS HERE. This route used to pull ten of them — five cuts
	   of DM Sans and five of Playfair Display — which made it the only page on the
	   site not set in the brand faces, and made those ten woff2s a cost no other
	   route paid. Neither family appears anywhere in the captured evidence under
	   docs/momentum-reference/. The page now uses the site's Poppins / Allerta
	   Stencil, loaded once in +layout.svelte for every route. See the header of
	   alpha.css for the full rationale. */

	import Seo from '$lib/components/Seo.svelte';
	import { site } from '$lib/data/site';
	import { study } from '$lib/pages/project-alpha/data/content';
	import { assets } from '$lib/pages/project-alpha/data/assets';
	import { ui } from '$lib/pages/project-alpha/state/ui.svelte';
	import { ensureGsap } from '$lib/pages/project-alpha/motion/gsap-setup';
	import {
		initSmoothScroll,
		destroySmoothScroll
	} from '$lib/pages/project-alpha/motion/smooth-scroll';

	import CinematicDirector from '$lib/pages/project-alpha/motion/CinematicDirector.svelte';
	import ApplyModal from '$lib/pages/project-alpha/ui/ApplyModal.svelte';
	import Hero from '$lib/pages/project-alpha/sections/Hero.svelte';
	import Hypothesis from '$lib/pages/project-alpha/sections/Hypothesis.svelte';
	import Equipment from '$lib/pages/project-alpha/sections/Equipment.svelte';
	import Pillars from '$lib/pages/project-alpha/sections/Pillars.svelte';
	import Journey from '$lib/pages/project-alpha/sections/Journey.svelte';
	import Schedule from '$lib/pages/project-alpha/sections/Schedule.svelte';
	import Assessments from '$lib/pages/project-alpha/sections/Assessments.svelte';
	import Notes from '$lib/pages/project-alpha/sections/Notes.svelte';
	import FinalCTA from '$lib/pages/project-alpha/sections/FinalCTA.svelte';
	import WaveDivider from '$lib/pages/project-alpha/viz/WaveDivider.svelte';

	// The sol page's own layout responsibilities, folded into this route:
	// reduced-motion sync, Lenis smooth scroll (route-scoped), and the
	// scroll-spy that drives the protocol rail in CinematicDirector.
	$effect(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		const applyMotionPref = () => {
			ui.reducedMotion = mq.matches;
		};
		applyMotionPref();
		mq.addEventListener('change', applyMotionPref);

		ensureGsap();
		initSmoothScroll(ui.reducedMotion);

		const ids = [
			'hero',
			'hypothesis',
			'equipment',
			'pillars',
			'journey',
			'schedule',
			'assessments',
			'notes',
			'apply'
		];
		const onScroll = () => {
			const doc = document.documentElement;
			const max = doc.scrollHeight - window.innerHeight;
			ui.scrollProgress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
			const y = window.scrollY + window.innerHeight * 0.28;
			let current = 'hero';
			for (const id of ids) {
				const el = document.getElementById(id);
				if (el && el.offsetTop <= y) current = id;
			}
			ui.activeSection = current;
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		onScroll();

		return () => {
			mq.removeEventListener('change', applyMotionPref);
			window.removeEventListener('scroll', onScroll);
			document.body.style.overflow = '';
			destroySmoothScroll();
		};
	});

	// Lock page scroll while the apply modal is open.
	$effect(() => {
		document.body.style.overflow = ui.applyOpen ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	});

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'ResearchProject',
		name: `${study.name}: Alpha Brainwave Training Study`,
		url: site.domain + '/project-alpha',
		description: study.tagline,
		sponsor: { '@type': 'Organization', name: study.org, url: site.domain },
		parentOrganization: { '@type': 'Organization', name: site.name, url: site.domain },
		investigator: {
			'@type': 'Person',
			name: study.investigator.name,
			jobTitle: study.investigator.role
		},
		image: site.domain + assets.projectAlpha.src,
		keywords: [
			'neurofeedback',
			'alpha brainwaves',
			'EEG',
			'day trading',
			'Muse',
			'emotional control'
		]
	};
</script>

<Seo
	title="Project ALPHA: Alpha Brainwave Training Study"
	description={study.tagline}
	path="/project-alpha"
	breadcrumbs={[{ name: 'Project ALPHA', path: '/project-alpha' }]}
	{jsonLd}
/>

<div class="alpha-scope">
	<CinematicDirector />
	<Hero />
	<WaveDivider stage={0} />
	<Hypothesis />
	<WaveDivider stage={1} />
	<Equipment />
	<WaveDivider stage={2} />
	<Pillars />
	<WaveDivider stage={3} />
	<Journey />
	<WaveDivider stage={5} />
	<Schedule />
	<WaveDivider stage={6} />
	<Assessments />
	<WaveDivider stage={7} />
	<Notes />
	<WaveDivider stage={8} />
	<FinalCTA />
	<ApplyModal />
</div>
