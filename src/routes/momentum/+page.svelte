<script lang="ts">
	/**
	 * /momentum — the route shell.
	 *
	 * Owns four things and nothing else: the document head, the `.mo-scope` wrapper,
	 * the page's DOM ORDER, and the page-lifetime side effects (reduced-motion sync,
	 * Lenis, scroll progress and the scroll-spy). Every beat of choreography belongs
	 * to a section or to Director.svelte.
	 *
	 * momentum.css must be the FIRST import: it declares every --mo-* custom property
	 * on `.mo-scope` and the shared `.mo-section` / `.mo-wrap` / `.mo-cta` vocabulary
	 * the six sections build on.
	 *
	 * The Poppins italic face is imported here, route-locally, exactly as
	 * project-alpha/+page.svelte:3-12 pulls DM Sans italic: the pull quote in Voice
	 * is a real <em>, and without the italic file the browser would synthesise an
	 * oblique from the upright at display size.
	 */
	import '$lib/pages/momentum/momentum.css';
	import '@fontsource/poppins/latin-400-italic.css';

	import Seo from '$lib/components/Seo.svelte';
	import { site } from '$lib/data/site';
	import { images, meta, offerList, SECTION_IDS } from '$lib/pages/momentum/data/content';
	import type { SectionId } from '$lib/pages/momentum/data/content';
	import { ui } from '$lib/pages/momentum/state/ui.svelte';
	import { ensureGsap } from '$lib/pages/momentum/motion/gsap-setup';
	import { initSmoothScroll, destroySmoothScroll } from '$lib/pages/momentum/motion/smooth-scroll';

	import Director from '$lib/pages/momentum/motion/Director.svelte';
	import Overture from '$lib/pages/momentum/sections/Overture.svelte';
	import Paths from '$lib/pages/momentum/sections/Paths.svelte';
	import Voice from '$lib/pages/momentum/sections/Voice.svelte';
	import Ledger from '$lib/pages/momentum/sections/Ledger.svelte';
	import Close from '$lib/pages/momentum/sections/Close.svelte';
	import Disclosure from '$lib/pages/momentum/sections/Disclosure.svelte';

	/**
	 * The page's own lifecycle, mirroring project-alpha/+page.svelte:41-84.
	 *
	 * It is deliberately here rather than in Director.svelte: Lenis' lifetime must
	 * equal the route's exactly, and the scroll-spy must keep running even if the
	 * decorative Director were ever removed.
	 *
	 * Writing `ui.reducedMotion` and reading it in the same effect is stable, not a
	 * loop: Svelte does not re-run an effect for an assignment that does not change
	 * the value, and a genuine mid-session flip SHOULD re-run this — the cleanup
	 * destroys Lenis and the rebuild re-inits it with the new preference.
	 */
	$effect(() => {
		const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
		const applyMotionPref = () => {
			ui.reducedMotion = motionMq.matches;
		};
		applyMotionPref();
		motionMq.addEventListener('change', applyMotionPref);

		ensureGsap();
		// Returns null immediately under reduced motion: no Lenis, no ticker callback,
		// no root classes — a reduced-motion visitor gets plain native scrolling.
		initSmoothScroll(ui.reducedMotion);

		const onScroll = () => {
			const doc = document.documentElement;
			const max = doc.scrollHeight - window.innerHeight;
			ui.scrollProgress = max > 0 ? Math.min(1, window.scrollY / max) : 0;

			// The reading line sits 28% down the viewport. Document-absolute tops via
			// getBoundingClientRect rather than offsetTop: `.mo-scope` is
			// `position: relative`, so offsetTop would be measured against the scope,
			// not the document.
			const line = window.scrollY + window.innerHeight * 0.28;
			let current: SectionId = SECTION_IDS[0];
			for (const id of SECTION_IDS) {
				const el = document.getElementById(id);
				if (el && el.getBoundingClientRect().top + window.scrollY <= line) current = id;
			}
			// MEASURED, not theoretical: Disclosure is 446px tall on a 1440x900 desktop,
			// which is shorter than the 0.72 * viewport of document that sits below the
			// reading line at maximum scroll — so it could never become current and the
			// rail's last dot never lit. At the very bottom of the document, the last
			// section IS the one being read.
			if (max > 0 && window.scrollY >= max - 2) current = SECTION_IDS[SECTION_IDS.length - 1];
			ui.activeSection = current;
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		onScroll();

		return () => {
			motionMq.removeEventListener('change', applyMotionPref);
			window.removeEventListener('scroll', onScroll);
			destroySmoothScroll();
		};
	});

	/**
	 * STRUCTURED DATA — certified facts only.
	 *
	 * Every value below is either captured verbatim (title, description, the two
	 * offer descriptions, both hrefs, the og:image and its verified 1605x398
	 * intrinsic size) or is a fact about this document (there are two destinations).
	 *
	 * DELIBERATELY ABSENT: no Course, no Product, no Offer, no price, no
	 * availability, no provider offer, no course instance, no rating, no date. The
	 * capture evidences no price, cohort date, seat count, duration in a
	 * machine-readable form, or provider relationship for either destination, and a
	 * schema.org type whose required properties would have to be invented is worse
	 * than no type at all. An ItemList of two ListItems states exactly what the page
	 * states: here are two things, here is what each one says, here is where each
	 * one goes.
	 *
	 * ListItem.name carries the offer's VERBATIM description because the capture
	 * gives neither destination a product name — only that one sentence. Nothing is
	 * composed, shortened or paraphrased to fill the field.
	 */
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: meta.title,
		description: meta.description,
		url: site.domain + meta.path,
		isPartOf: { '@type': 'WebSite', name: site.name, url: site.domain },
		primaryImageOfPage: {
			'@type': 'ImageObject',
			url: site.domain + images.welcome.src,
			width: images.welcome.width,
			height: images.welcome.height,
			caption: images.welcome.alt
		},
		mainEntity: {
			'@type': 'ItemList',
			numberOfItems: offerList.length,
			itemListOrder: 'https://schema.org/ItemListUnordered',
			itemListElement: offerList.map((offer, i) => ({
				'@type': 'ListItem',
				position: i + 1,
				name: offer.description,
				url: offer.href
			}))
		}
	};
</script>

<!--
	Every prop is a captured value.
	`title` already contains the site name, so Seo.svelte:40 leaves it untouched and
	the rendered <title> is byte-identical to the reference's.
	`imageWidth`/`imageHeight` are the verified intrinsic size of the og:image
	(1605x398, `file` on the download); Seo.svelte's 1200x800 defaults describe a
	different asset and must not be inherited.
-->
<Seo
	title={meta.title}
	description={meta.description}
	path={meta.path}
	image={images.welcome.src}
	imageAlt={meta.imageAlt}
	imageWidth={images.welcome.width}
	imageHeight={images.welcome.height}
	type={meta.type}
	breadcrumbs={[{ name: 'Momentum', path: meta.path }]}
	{jsonLd}
/>

<!--
	DOM ORDER IS BINDING, and it deliberately inverts the reference's own order
	(reference: quote section, then cards section). Paths — which holds both LEARN
	MORE destinations — comes BEFORE Voice so the first CTA is reachable inside
	roughly one viewport-and-a-bit on a phone; leaving the pull quote between the
	title card and the doors pushes it past ~1.9 viewports. Voice then reads as the
	reason to believe, immediately after the choice. Documented in
	data/content.ts:53-58 so no reviewer "corrects" it back.

	The order here is the same array the scroll-spy walks, SECTION_IDS:
	overture, paths, voice, ledger, close, disclosure.
-->
<div class="mo-scope">
	<Director />
	<Overture />
	<Paths />
	<Voice />
	<Ledger />
	<Close />
	<Disclosure />
</div>
