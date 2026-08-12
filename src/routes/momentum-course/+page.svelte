<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { site } from '$lib/data/site';
	import { ui } from '$lib/pages/momentum/state/ui.svelte';
	import { ensureGsap } from '$lib/pages/momentum/motion/gsap-setup';
	import { initSmoothScroll, destroySmoothScroll } from '$lib/pages/momentum/motion/smooth-scroll';
	import MomentumHero from '$lib/pages/momentum-course/MomentumHero.svelte';
	import MomentumScope from '$lib/pages/momentum-course/MomentumScope.svelte';
	import MomentumCurriculum from '$lib/pages/momentum-course/MomentumCurriculum.svelte';
	import MomentumBoss from '$lib/pages/momentum-course/MomentumBoss.svelte';
	import MomentumVoices from '$lib/pages/momentum-course/MomentumVoices.svelte';
	import MomentumEnroll from '$lib/pages/momentum-course/MomentumEnroll.svelte';

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Course',
		name: 'Momentum',
		description:
			'Trick Trades’ flagship program: high-level day-trading coaching with Pat Mitchell across 15 modules and 115 video lessons, plus 14 bonus lessons and B.O.S.S. Carbon (a $597 value) included.',
		url: 'https://tricktrades.com/momentum-course',
		provider: {
			'@type': 'Organization',
			name: site.name,
			sameAs: site.domain
		}
	};

	/**
	 * THE MOTION STACK, matched to /project-alpha's route (+page.svelte:47-95),
	 * which is the floor for this site rather than the target. Before this the page
	 * had NO smooth scroll, NO scroll-progress signal and NO reduced-motion sync —
	 * only per-element reveal attachments — so its choreography stopped at "things
	 * fade in".
	 *
	 * Reduced motion is read from matchMedia and mirrored into `ui`, then Lenis is
	 * initialised with that value so it is never started for a visitor who asked for
	 * stillness. Everything is torn down on destroy: the listener, the media-query
	 * subscription and Lenis itself.
	 */
	$effect(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		const sync = () => {
			ui.reducedMotion = mq.matches;
		};
		sync();
		mq.addEventListener('change', sync);

		ensureGsap();
		initSmoothScroll(ui.reducedMotion);

		const onScroll = () => {
			const doc = document.documentElement;
			const max = doc.scrollHeight - window.innerHeight;
			ui.scrollProgress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		onScroll();

		return () => {
			mq.removeEventListener('change', sync);
			window.removeEventListener('scroll', onScroll);
			destroySmoothScroll();
		};
	});
</script>

<Seo
	title="Momentum Flagship Coaching | Trick Trades"
	description="Trick Trades’ flagship program: day-trading coaching with Pat Mitchell. 15 modules, 115 video lessons, 14 bonus lessons and B.O.S.S. Carbon included."
	path="/momentum-course"
	breadcrumbs={[
		{ name: 'Academy', path: '/day-trading-academy' },
		{ name: 'Momentum', path: '/momentum-course' }
	]}
	{jsonLd}
/>

<MomentumHero />
<MomentumScope />
<MomentumCurriculum />
<MomentumBoss />
<MomentumVoices />
<MomentumEnroll />
