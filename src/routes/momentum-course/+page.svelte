<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { site } from '$lib/data/site';
	import { ui } from '$lib/pages/momentum/state/ui.svelte';
	import { ensureGsap } from '$lib/pages/momentum/motion/gsap-setup';
	import { initSmoothScroll, destroySmoothScroll } from '$lib/pages/momentum/motion/smooth-scroll';
	import CourseDirector from '$lib/pages/momentum-course/motion/CourseDirector.svelte';
	import CourseDivider from '$lib/pages/momentum-course/viz/CourseDivider.svelte';
	import MomentumHero from '$lib/pages/momentum-course/MomentumHero.svelte';
	import MomentumScope from '$lib/pages/momentum-course/MomentumScope.svelte';
	import MomentumCurriculum from '$lib/pages/momentum-course/MomentumCurriculum.svelte';
	import MomentumBoss from '$lib/pages/momentum-course/MomentumBoss.svelte';
	import MomentumVoices from '$lib/pages/momentum-course/MomentumVoices.svelte';
	import MomentumEnroll from '$lib/pages/momentum-course/MomentumEnroll.svelte';
	/* CourseDivider reads `--mc-divider-h` for its own height and CourseDirector
	   reads the `--mc-z-*` budget, both declared on :root in course.css. The
	   director and four of the six sections already import that file; the route
	   imports it too because the route is what renders the five dividers, and an
	   implicit dependency on somebody else's import is how a stylesheet goes
	   missing. Vite dedupes, so this costs nothing. */
	import '$lib/pages/momentum-course/course.css';

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
	 *
	 * `ui.scrollProgress` is written here and read in exactly one place — the chapter
	 * rail's fill in CourseDirector — so this listener must stay.
	 *
	 * THERE IS DELIBERATELY NO `activeSection` WRITER HERE. project-alpha's route
	 * runs the section spy itself (+page.svelte:65-72) and writes a store the
	 * director reads. CourseDirector owns its own spy instead
	 * (CourseDirector.svelte:167-177, via `pickActiveSection`), so the value has one
	 * writer and one reader inside one component. Adding a second writer in this
	 * route would be scaffolding — and `ui.activeSection` is typed to /momentum's
	 * own eight section ids, none of which exist on this page.
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

<!--
	THE COMPOSITION. Six sections, five gaps, one director.

	CourseDirector is rendered FIRST and exactly once. It takes no props: it reads
	`ui.reducedMotion` / `ui.scrollProgress` from the store the effect above writes,
	and owns the intro film, the pointer aura, the chapter rail and the section spy.
	Rendering it above the sections is what guarantees its `onMount` — and therefore
	the `mc-intro-done` handshake — runs before MomentumHero's does.

	CourseDivider's `stage` is its DOM position in the run of five, 0..4. That value
	drives rung density, spine alpha, jitter and the grey-to-red ramp, so the ladder
	visibly resolves as the page advances; two dividers at the same stage would read
	as a repeat rather than as progress.
-->
<CourseDirector />

<MomentumHero />
<CourseDivider stage={0} />
<MomentumScope />
<CourseDivider stage={1} />
<MomentumCurriculum />
<CourseDivider stage={2} />
<MomentumBoss />
<CourseDivider stage={3} />
<MomentumVoices />
<CourseDivider stage={4} />
<MomentumEnroll />
