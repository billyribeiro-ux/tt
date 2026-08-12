<script lang="ts">
	/**
	 * /momentum — BEAT 2 · VOICE. THE WHITE BAND.
	 *
	 * The human beat: Pat's portrait and the page's only pull quote — and the
	 * page's biggest visual cut. Black -> WHITE -> black is not an accident to be
	 * smoothed away, it is the reference's own score and it is played here as a
	 * hard cut with no gradient blend on either edge.
	 *
	 * EVIDENCE. Every colour and every type size in this section is read out of
	 * the page's own Elementor stylesheet, which was recovered after this page was
	 * first built (it was originally built all-dark because these bytes were
	 * believed missing):
	 *
	 *   post-73938.pretty.css:48       section c778b3c background-color: #ffffff
	 *   post-73938.pretty.css:56       section c778b3c padding: 40px 0px 25px 0px
	 *   post-73938.pretty.css:80-82    quote 5c034b7 font-size: 29px
	 *   post-73938.pretty.css:216-218  quote 5c034b7 font-size: 19px at <=1024px
	 *   post-73938.pretty.css:271-273  quote 5c034b7 text-align: center at <=767px
	 *   post-73938.pretty.css:66-68    .elementor-widget-text-editor colour is
	 *                                  var(--e-global-color-text)
	 *   post-47277.css:1               --e-global-color-text: #707070
	 *   post-73938.pretty.css:230-245  columns 20% / 59.333% / 20%, inner
	 *                                  20% (portrait) / 79.999% (quote) at >=768px
	 *   post-73938.pretty.css:247-256  columns 2% / 93% / 2% at 768-1024px
	 *   custom-frontend.pretty.css:486-490  elementor-column-gap-default is 10px of
	 *                                  padding per column side, i.e. a 20px gutter
	 *                                  (the capture's own container carries
	 *                                  `elementor-column-gap-default`, pretty.html:7393)
	 *
	 * The portrait is the reference's <img> at pretty.html:7409-7422
	 * (PatProfilePic1sm.png, served and displayed at its intrinsic 220x220). The
	 * quote is the reference's ONLY <em>, pretty.html:7442-7446, reproduced
	 * verbatim from data/content.ts including its curly U+201C / U+201D marks.
	 *
	 * NOTHING ELSE IS RENDERED HERE. The reference attributes the quote to nobody
	 * in text — no name line, no role, no company — so none is written. "Pat
	 * Mitchell" appears only as the portrait's alt, which is functional a11y
	 * labelling drawn from captured text (the footer disclaimer and the live-card
	 * art), not an invented attribution.
	 *
	 * CONTRAST, computed rather than assumed (sRGB relative luminance, WCAG 2.x):
	 *   #707070 on #ffffff -> 4.95:1  (AA for normal text at both 19px and 29px)
	 *   #b22725 on #ffffff -> 6.54:1  (the accent rule; decorative, but visible)
	 * The page-scope focus ring (--mo-cyan, momentum.css) would be ~1.4:1 on this
	 * band and would fail — but this section contains no focusable element, so no
	 * override is written here rather than shipping a rule with nothing to match.
	 * That belongs in momentum.css if a focusable control ever lands on a light
	 * band; it is reported, not silently patched from the wrong file.
	 */
	import { onMount } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import { drawLine, prefersReducedMotion, splitReveal } from '$lib/motion';
	import { ensureGsap } from '$lib/pages/momentum/motion/gsap-setup';
	import { images, pullQuote } from '$lib/pages/momentum/data/content';

	/**
	 * The portrait's derivatives. `file` -> pat-avatar-220.{png,webp,avif} 220x220;
	 * the AVIF is 5.3 KB against the PNG's 45 KB and preserves the alpha, which
	 * matters twice over here: the PNG's corners are transparent, so on a WHITE
	 * band the portrait sits correctly with no visible plate.
	 *
	 * PROVENANCE-BY-FILE NOTE: every other asset path on this page lives in
	 * data/content.ts. These two are declared here because this pass owns only
	 * Overture.svelte and Voice.svelte, and content.ts belongs to another agent in
	 * the same pass. Fold them into `images` when one agent owns both files.
	 * There is one width only, so no srcset and no `sizes` — the reference serves
	 * and displays this portrait at its intrinsic size.
	 */
	const avatar = {
		avif: '/pat-avatar-220.avif',
		webp: '/pat-avatar-220.webp'
	} as const;

	let root: HTMLElement | undefined;

	const captureRoot: Attachment<HTMLElement> = (node) => {
		root = node;
		return () => {
			if (root === node) root = undefined;
		};
	};

	/**
	 * The portrait's circular wipe.
	 *
	 * This is the one bespoke tween this section owns; every other movement here
	 * reuses a shared attachment from $lib/motion. It animates the clip-path the
	 * portrait's frame already carries in CSS, so the resting state is the visible
	 * one: if JS never runs, if GSAP fails to load, or if the tween is reverted,
	 * the portrait is a full circle. No initial state hides content.
	 *
	 * `circle()` rather than a border-radius because the PNG is ALREADY circular
	 * (all four corners are alpha 0), so a 50% circle clip is visually a no-op on
	 * the resting frame and the wipe matches the art instead of fighting it.
	 *
	 * `immediateRender: false` so the from-state is only applied when the
	 * ScrollTrigger fires — the same guard Journey.svelte:32-44 uses.
	 *
	 * Reduced motion is read DIRECTLY off matchMedia via prefersReducedMotion()
	 * rather than through the page's ui store: a section can mount before the
	 * route's $effect has synced that store.
	 */
	onMount(() => {
		if (!root || prefersReducedMotion()) return;
		const gsap = ensureGsap();
		const ctx = gsap.context(() => {
			gsap.from('.mo-voice__avatar', {
				clipPath: 'circle(0% at 50% 50%)',
				duration: 0.8,
				ease: 'expo.out',
				immediateRender: false,
				scrollTrigger: { trigger: '.mo-voice', start: 'top 80%', once: true }
			});
		}, root);
		return () => ctx.revert();
	});
</script>

<!-- `mo-band--light` is momentum.css's band contract (see its PUBLIC API header):
     it paints --mo-surface #ffffff, sets --mo-body to the captured #707070, and
     — critically — re-points --mo-focus off the dark band's cyan, which is
     1.69:1 on white, onto the kit accent at 6.54:1. Every colour in this section
     is read from those tokens so the band, not this file, owns the inversion. -->
<section id="voice" class="mo-band--light mo-voice-band" {@attach captureRoot}>
	<div class="mo-wrap">
		<div class="mo-voice">
			<!-- AVIF -> WebP -> the original PNG, all three with alpha. The frame is
			     the <picture>: it owns the circular clip so the GSAP wipe and the
			     drift below animate two different nodes and never fight. Intrinsic
			     220x220 verified with `file`; width/height + aspect-ratio, no CLS. -->
			<picture class="mo-voice__avatar">
				<source type="image/avif" srcset={avatar.avif} />
				<source type="image/webp" srcset={avatar.webp} />
				<img
					src={images.avatar.src}
					width={images.avatar.width}
					height={images.avatar.height}
					alt={images.avatar.alt}
					loading="lazy"
					decoding="async"
				/>
			</picture>

			<div class="mo-voice__body">
				<!-- I read pretty.html:7441-7447: the source is a BARE <em> sitting
				     directly inside the text-editor widget container, with no <p> of its
				     own. The <em> is reproduced exactly; the <p> around it is this
				     page's addition, because a standalone sentence needs a block
				     container and splitReveal measures line boxes on a block. The curly
				     quotes are part of the string itself — do not add a second pair. -->
				<p
					class="mo-voice__quote"
					{@attach splitReveal({ stagger: 0.028, duration: 0.85, start: 'top 82%' })}
				>
					<em>{pullQuote}</em>
				</p>

				<svg
					class="mo-voice__rule"
					viewBox="0 0 320 1"
					preserveAspectRatio="none"
					aria-hidden="true"
					focusable="false"
					{@attach drawLine({ scrub: false, duration: 1.2 })}
				>
					<path d="M0 0.5H320" vector-effect="non-scaling-stroke" />
				</svg>
			</div>
		</div>
	</div>
</section>

<style>
	/* ---- THE WHITE BAND ----------------------------------------------------
	   Full-bleed, and deliberately NOT `.mo-section`: the reference gives this
	   band its own padding (40px top / 25px bottom, post-73938.pretty.css:56),
	   which is far tighter than even the page's tightened section rhythm
	   (momentum.css:431-434, clamp(3.25rem, 2rem + 6vw, 6.5rem) = 52-104px).
	   That tightness is the point — a compact white slab between two black masses
	   reads as a cut rather than as another section, and it is also the single
	   largest saving against defect V6 (dead vertical space around Voice). This is
	   the one place where the reference's own padding maps one-to-one onto a
	   section of this build, which is why it is adopted verbatim here and not in
	   `.mo-section`.

	   NO background and NO color declaration: `mo-band--light` owns both. */
	.mo-voice-band {
		position: relative;
		padding-block: 40px 25px;
	}

	/* Stacked and centred on phones — which is also the CAPTURED behaviour below
	   767px — then portrait-beside-quote from 768px up. */
	.mo-voice {
		width: 100%;
		margin-inline: auto;
		display: grid;
		gap: clamp(1.25rem, 4vw, 2rem);
		justify-items: center;
		text-align: center;
	}

	.mo-voice__avatar {
		display: block;
		width: 220px;
		max-width: min(100%, 60vw);
		/* Guarantees a true circle for the clip below even before the image has
		   decoded, so the entrance wipe can never flash an ellipse. */
		aspect-ratio: 1 / 1;
		/* The resting state, and the end state of the entrance wipe. The PNG is
		   already circular (corners are alpha 0), so this clips nothing visible. */
		clip-path: circle(50% at 50% 50%);
	}

	.mo-voice__avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* A LIVING PORTRAIT, and it is decoration only — the section is complete and
	   correct with this animation absent.

	   The circular frame stays perfectly still while the portrait drifts inside
	   it, which is why the drift is on the <img> and the clip is on the <picture>.
	   The 1.08 scale is what gives the +/-2% travel headroom; at 220px that is
	   +/-4.4px inside 8.8px of slack, so an edge can never appear.

	   Scroll-driven animations are ADOPT-WITH-FALLBACK for Aug 2026: Chrome 115+
	   and Safari 26+ ship them; Firefox 153 does not (animation-timeline is
	   Nightly-only behind layout.css.scroll-driven-animations.enabled). The
	   documented trap is that Firefox drops `animation-timeline` but KEEPS the
	   `animation` shorthand, which would run this once as an ordinary time-based
	   tween on load — so the whole rule, shorthand included, lives inside
	   @supports, and `animation-timeline` is declared AFTER the shorthand so the
	   shorthand cannot reset it. THE FALLBACK: Firefox gets a still portrait. */
	@supports (animation-timeline: view()) {
		@media (prefers-reduced-motion: no-preference) {
			.mo-voice__avatar img {
				animation: mo-voice-settle linear both;
				animation-timeline: view(block);
				animation-range: cover 0% cover 100%;
			}

			/* Keyframes live inside the guard too, matching momentum.css:691-711. */
			@keyframes mo-voice-settle {
				from {
					transform: scale(1.08) translate3d(0, -2%, 0);
				}
				to {
					transform: scale(1.08) translate3d(0, 2%, 0);
				}
			}
		}
	}

	.mo-voice__body {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	/* CAPTURED type scale, consumed from momentum.css's published --mo-fs-quote
	   (declared at momentum.css:220-224) rather than restated here. That token is
	   a `cqi` clamp against the named `mo-wrap` container which reproduces the
	   captured 19px and 29px EXACTLY at the two ends of the reference's own 1024px
	   step and interpolates across it instead of jumping — strictly better than
	   the hard media-query pair this file used, and it is the contract the page
	   asked sections to read. `.mo-voice` sits inside `.mo-wrap`, so the container
	   resolves.

	   COLOUR IS NOT DECLARED: the quote inherits --mo-body from `mo-band--light`,
	   which resolves to the captured --e-global-color-text #707070, 4.95:1 on
	   white — AA for normal text at both 19px and 29px. Hard-coding it here would
	   break the band contract.

	   No max-width either: the reference lets its 79.999% column set the measure,
	   and the grid below reproduces that column.

	   The 1.4 line-height is NOT captured — it is kept from this build's previous
	   pass, because the reference inherits Astra's body leading and 1.65 on a 29px
	   pull quote reads as body copy rather than as a quote. */
	.mo-voice__quote {
		font-size: var(--mo-fs-quote);
		line-height: 1.4;
	}

	/* A real italic face, not a browser-synthesised oblique: the route imports
	   @fontsource/poppins/latin-400-italic.css, mirroring how project-alpha's
	   route pulls DM Sans italic. */
	.mo-voice__quote em {
		font-family: var(--tt-font-body);
		font-style: italic;
		font-weight: 400;
	}

	/* 1px hairline drawn by drawLine(). Stroke is set on the <svg> and inherits
	   to the <path>; non-scaling-stroke keeps it exactly 1px while the viewBox
	   stretches horizontally.

	   AUTHORED, not captured — the reference has no rule here. It is sized as a
	   short signature mark rather than a full-width divider, precisely so it does
	   not read as an attribution line the evidence does not support. The colour is
	   the band's own --mo-accent, which `mo-band--light` sets to the captured kit
	   accent #b22725 (6.54:1 on white) and `mo-band--dark` would set to
	   --tt-red-bright — so this rule inverts with the band instead of pinning one
	   colour. The page's cyan would be ~1.4:1 here and would effectively vanish. */
	.mo-voice__rule {
		width: 96px;
		max-width: 100%;
		height: 1px;
		margin-top: clamp(1.1rem, 2.5vw, 1.75rem);
		fill: none;
		stroke: var(--mo-accent);
		stroke-width: 1;
	}

	@media (min-width: 768px) {
		.mo-voice {
			/* CAPTURED: the reference gives this band 2% / 93% / 2% between 768 and
			   1024px, so the content sits in a 93% measure. */
			width: 93%;
			/* CAPTURED inner split: 20% portrait / 79.999% quote. Written as `fr` so
			   the 20px gutter comes out of the tracks instead of overflowing them —
			   percentage tracks plus a gap would total more than 100%. */
			grid-template-columns: 20fr 79.999fr;
			/* CAPTURED: elementor-column-gap-default is 10px of padding on each
			   column, i.e. a 20px gutter between them. */
			column-gap: 20px;
			align-items: center;
			justify-items: start;
			text-align: left;
		}

		.mo-voice__avatar {
			max-width: 100%;
		}

		.mo-voice__body {
			align-items: flex-start;
		}
	}

	/* 1025px, NOT the repo's 1024px breakpoint contract: the reference's own
	   switch is `@media (max-width: 1024px)`, so 1024px itself belongs to the
	   small side. Labelled here so nobody "corrects" it to 1024.
	   (The quote's own 1024px step is NOT restated here — --mo-fs-quote already
	   carries it, and carries it as a ramp rather than a jump.) */
	@media (min-width: 1025px) {
		.mo-voice {
			/* CAPTURED: 20% / 59.333% / 20% of the full-bleed section, with the inner
			   section boxed at the kit's container — read from momentum.css's
			   --mo-container, which is the same captured 1140px (post-47277.css:1).
			   `max-width: 100%` keeps it inside .mo-wrap's own padding on very wide
			   viewports, where 59.333vw would otherwise exceed the container. */
			width: min(59.333vw, var(--mo-container));
			max-width: 100%;
		}
	}
</style>
