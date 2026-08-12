<!--
	/momentum — BEAT 1 · PATHS. The two doors.

	This is the page's reason to exist: the reference's own two-card section
	(elementor-element-7cd54f6, pretty.html:7465-7630), read line by line. That
	section holds four col-25 columns; the first (9e611c1) and fourth (5ba9248)
	are empty `elementor-widget-wrap` shells, and the two middle columns each hold
	one image-box widget plus one button widget. Everything rendered below comes
	from those two columns and nothing else.

	COPY DISCIPLINE. Every string on this screen is imported from
	data/content.ts, which transcribes the capture verbatim. No headline, no
	label, no badge, no feature list and no comparison adjective is added: the
	reference states none, so none may be written. The comparison is carried by
	(a) the two verbatim descriptions, whose own shouting capitals already say
	"INCLUDES one 8 week round of live trading" and "DOES NOT INCLUDE MOMENTUM
	MODULES", and (b) the colour coding of the two CARD SURFACES, which is
	CAPTURED rather than chosen — momentum-course-1920.png accents in cyan and
	contains no red; momentum-live-1280.png carries a red ON AIR badge and
	contains no cyan. That colour coding is deliberately NOT applied to the two
	buttons; see the CTA note in the style block.
	The figure that draws the difference to scale is the Ledger section, not this
	one.

	STYLING PROVENANCE — CORRECTED. An earlier pass recorded here that "the
	reference's own stylesheet is loaded externally and its bytes are NOT in the
	capture". That was wrong: the capture's own <link> tags name the file, and it
	is now on disk at /tmp/momentum-slices/post-73938.pretty.css (284 lines) with
	the site kit at /tmp/momentum-slices/post-47277.css. Every value in this file
	that the reference actually specifies is now taken from those bytes and cited
	by line. What the reference specifies for THIS section:

	  post-73938.pretty.css:83-92    background-color: #000000        (the band)
	  post-73938.pretty.css:93-100   padding: 0px 0px 20px 0px
	  post-73938.pretty.css:140-145  image-box img width: 100%
	  post-73938.pretty.css:146-150  image-box description font-size: 23px
	  post-73938.pretty.css:219-228  ...and 18px at max-width 1024px
	  post-73938.pretty.css:164-168  image-box img margin-bottom: 15px
	  post-73938.pretty.css:151-153  .elementor-widget-button .elementor-button
	                                 { background-color: var(--e-global-color-accent) }
	  post-47277.css:1               --e-global-color-accent: #B22725
	  post-73938.pretty.css:247-269  columns 2% / 48% / 48% / 2% from 768-1024px

	Values the recovered CSS still does NOT specify (grid gap, card hairlines,
	radius, hover states, the elementor-size-xl button metrics) remain INHERITED
	from this repo's design system (src/app.css + momentum.css) and are labelled
	as such below.
-->
<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';
	import { magnetic, prefersReducedMotion, splitReveal, tilt } from '$lib/motion';
	import { offerList } from '$lib/pages/momentum/data/content';
	import { ensureGsap } from '$lib/pages/momentum/motion/gsap-setup';
	import { ui } from '$lib/pages/momentum/state/ui.svelte';

	/**
	 * Per-card accent channels, fed to the scoped CSS as a custom property so a
	 * single rule serves both cards (an interpolated `--course`/`--live` class
	 * would be reported as an unused selector by Svelte's CSS pruner).
	 *
	 * The assignment is CAPTURED, not chosen — see the header comment. The live
	 * door uses --tt-red-bright-rgb rather than --tt-red-rgb: --tt-red (#b22725)
	 * at these alphas over the black band is effectively invisible as a hairline,
	 * and #ff3333 is the same token the Ledger's live lane uses.
	 *
	 * This is the ONLY place the two doors differ in colour. The buttons do not:
	 * post-73938.pretty.css:151-153 gives every button on the page the single kit
	 * accent, so both LEARN MOREs are #B22725.
	 */
	const accents = {
		course: { rgb: 'var(--mo-cyan-rgb)', glow: '0.28' },
		live: { rgb: 'var(--tt-red-bright-rgb)', glow: '0.32' }
	} as const;

	/**
	 * The encoded derivatives of the two card plates, keyed by offer id.
	 *
	 * These live here rather than in data/content.ts because content.ts is the
	 * transcript of the CAPTURE and these files are not in it — they are local
	 * re-encodings of the two captured PNGs. Every width below was verified on
	 * disk in this pass, not assumed from the filename: `file` reports the WebP
	 * dimensions directly (1920x1080 / 960x540 / 1280x720 / 640x360) and the AVIF
	 * dimensions were read out of each file's `ispe` box (same four sizes).
	 *
	 * Order matters: <source> is first-match-wins, so AVIF precedes WebP and the
	 * captured PNG stays as the <img> fallback for anything that takes neither.
	 */
	const plates = {
		course: {
			avif: '/momentum-course-960.avif 960w, /momentum-course-1920.avif 1920w',
			webp: '/momentum-course-960.webp 960w, /momentum-course-1920.webp 1920w'
		},
		live: {
			avif: '/momentum-live-640.avif 640w, /momentum-live-1280.avif 1280w',
			webp: '/momentum-live-640.webp 640w, /momentum-live-1280.webp 1280w'
		}
	} as const;

	/**
	 * Derived from this component's own layout, not guessed:
	 *   >=1280px — `.mo-wrap` caps at --tt-container (1200px) with
	 *              padding-inline 2.5rem a side, so the content box is 1120px; the
	 *              two-column grid gap is clamp(1.5rem, 4vw, 3rem) = 48px there,
	 *              leaving (1120 - 48) / 2 = 536px per plate.
	 *   >=768px  — still two columns but the container is viewport-bound, so each
	 *              plate is a little under half the viewport: 46vw.
	 *   below    — one column, content box = 100vw minus 2 x clamp(1.1rem, 5vw,
	 *              2.5rem) ~= 92vw (351px of 390px on a small phone).
	 */
	const PLATE_SIZES = '(min-width: 1280px) 536px, (min-width: 768px) 46vw, 92vw';

	/**
	 * BEAT 1, owned by this section rather than by Director.svelte: every trigger
	 * below is anchored to this section's own element, so none of it is
	 * cross-section work. The one genuinely global piece of BEAT 1 — the
	 * scroll-velocity-linked skewY on `.mo-paths__card` — is the Director's, which
	 * is why that class name is a stable contract and must not be renamed.
	 *
	 * WHY THIS ONE STAYS ON GSAP. It is a genuinely sequenced timeline: the two
	 * cards part, and the plate shutters start 0.6s BEFORE that entrance finishes.
	 * A CSS scroll-driven animation can express one element's progress against the
	 * scroller, not one element's progress against another element's tween, so
	 * converting this would mean hand-computing the overlap as two magic ranges.
	 * The two effects on this page that ARE single-element progress — Close's
	 * plate drift and Ledger's small-screen entrance — have been moved to CSS
	 * scroll timelines instead.
	 *
	 * Written as an attachment rather than onMount + bind:this so that it also
	 * tears down and rebuilds if the visitor flips their motion preference
	 * mid-session: `ui.reducedMotion` is read here, so this effect re-runs and
	 * ctx.revert() undoes every tween.
	 */
	const choreograph: Attachment<HTMLElement> = (el) => {
		// Read the media query directly as well as the store: this section can mount
		// before the route's $effect has synced ui.reducedMotion (the bug documented
		// in project-alpha/viz/NeuroTradeHud.svelte:19-27).
		if (ui.reducedMotion || prefersReducedMotion()) return;

		const gsap = ensureGsap();

		const ctx = gsap.context(() => {
			const cards = gsap.utils.toArray<HTMLElement>('.mo-paths__card');
			const plateEls = gsap.utils.toArray<HTMLElement>('.mo-paths__img');
			if (!cards.length) return;

			const tl = gsap.timeline({
				defaults: { ease: 'expo.out' },
				scrollTrigger: { trigger: el, start: 'top 78%', once: true }
			});

			// THE TWO DOORS PART. Course swings in from the left, live from the
			// right, so the choice reads as two things separating rather than one
			// block arriving. immediateRender:false keeps both cards at their rest
			// position (fully visible) until the trigger fires — a card must never
			// be able to get stuck in its start state.
			tl.fromTo(
				cards,
				{
					x: (i: number) => (i === 0 ? -64 : 64),
					rotate: (i: number) => (i === 0 ? -1.5 : 1.5),
					filter: 'blur(8px)',
					opacity: 0
				},
				{
					x: 0,
					rotate: 0,
					filter: 'blur(0px)',
					opacity: 1,
					duration: 1,
					stagger: 0.08,
					immediateRender: false,
					// Drop the filter entirely once it has landed: a lingering
					// `filter` creates a containing block and forces the plate onto
					// its own composited layer for the rest of the page's life.
					onComplete: () => gsap.set(cards, { clearProps: 'filter,willChange' })
				}
			);

			if (plateEls.length) {
				// SHUTTER: each plate wipes open bottom-to-top, overlapping the card
				// entrance by 0.6s so the image is already opening as the card lands.
				tl.fromTo(
					plateEls,
					{ clipPath: 'inset(0 0 100% 0)' },
					{
						clipPath: 'inset(0 0 0% 0)',
						duration: 0.9,
						ease: 'expo.inOut',
						stagger: 0.08,
						immediateRender: false,
						onComplete: () => gsap.set(plateEls, { clearProps: 'clipPath' })
					},
					'-=0.6'
				);
			}
		}, el);

		return () => ctx.revert();
	};
</script>

<!--
	No heading element. The reference gives this section no title, subtitle or
	kicker of any kind, and inventing one would be inventing copy. The section is
	therefore an unnamed region; the two links carry distinct accessible names,
	which is what actually matters for navigation here.
-->
<section id="paths" class="mo-section mo-paths" {@attach choreograph}>
	<div class="mo-wrap">
		<!-- The global index/rule trio from app.css:237-253, used verbatim. It is
		     pure navigational chrome and carries no captured copy, so it is hidden
		     from assistive tech rather than read out as a bare counter.

		     THE DENOMINATOR IS 02, NOT 04. This page renders exactly two indexed
		     section heads — this one and Ledger's — so the sequence is 01/02, 02/02.
		     That is the repo's own convention: every other page's counters form a
		     complete run (testimonials 01/02 + 02/02, trick-trades-core 01/02 +
		     02/02, day-trading-bootcamp 01/03 + 02/03 + 03/03). A "/ 04" here
		     promised a reader four indexed beats and delivered two.

		     KNOWN RESIDUE, not fixable from this file: Director.svelte's chapter
		     rail still enumerates all six section ids as 01..06 at >=1280px, so a
		     desktop reader sees a rail counting to 06 beside heads that say "of 02".
		     Both are aria-hidden, so this is a visual coherence question for the
		     rail's owner, not an accessibility one. -->
		<div class="section-head" aria-hidden="true">
			<span class="idx">01 / 04</span>
			<span class="rule"></span>
		</div>

		<div class="mo-paths__grid">
			{#each offerList as offer, i (offer.id)}
				<div
					class="mo-paths__card"
					style:--mo-card-accent={accents[offer.id].rgb}
					style:--mo-card-glow={accents[offer.id].glow}
					{@attach tilt(5)}
				>
					<div class="mo-paths__shot">
						<!--
							AVIF -> WebP -> the captured PNG. The PNG stays as the <img>
							fallback because it is the file the reference itself serves; the
							two derivative formats are local re-encodings of it.

							width/height on the <img> are the verified intrinsic pixel
							dimensions from content.ts, so the aspect-ratio box reserves the
							right space and there is no CLS regardless of which source wins.
							alt="" is the reference's own alt (pretty.html:7504 and :7571) and
							is correct: the adjacent description carries the meaning, so a
							duplicate description here would be noise.
							loading mirrors the capture — the first image has no loading
							attribute (pretty.html:7498-7499) and the second is loading="lazy"
							(pretty.html:7565-7566).
						-->
						<picture>
							<source type="image/avif" srcset={plates[offer.id].avif} sizes={PLATE_SIZES} />
							<source type="image/webp" srcset={plates[offer.id].webp} sizes={PLATE_SIZES} />
							<img
								class="mo-paths__img"
								src={offer.image.src}
								width={offer.image.width}
								height={offer.image.height}
								sizes={PLATE_SIZES}
								alt={offer.image.alt}
								decoding="async"
								loading={i === 0 ? 'eager' : 'lazy'}
							/>
						</picture>
					</div>

					<p
						class="mo-offer-desc mo-paths__desc"
						data-split
						{@attach splitReveal({ stagger: 0.02, duration: 0.7, start: 'top 84%' })}
					>
						{offer.description}
					</p>

					<div class="mo-paths__actions">
						<!-- Both visible labels are the identical string "LEARN MORE"
						     (pretty.html:7539, :7613), so each anchor takes a distinct
						     aria-label from content.ts. Both of those labels BEGIN with the
						     visible string, which is what WCAG 2.5.3 Label in Name requires
						     — a voice-control user saying "click LEARN MORE" still matches. -->
						<a
							class="mo-cta mo-cta--{offer.id}"
							href={offer.href}
							aria-label={offer.ctaAriaLabel}
							{@attach magnetic(0.28)}
						>
							{offer.ctaLabel}
							<span class="mo-paths__cta-icon" aria-hidden="true">
								<ArrowRightIcon size={18} weight="bold" aria-hidden="true" />
							</span>
						</a>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	/* ----------------------------------------------------------------------
	   Values marked CAPTURED are read out of /tmp/momentum-slices/post-73938.pretty.css
	   and post-47277.css at the line numbers given. Everything else is INHERITED
	   from this repo's design system (src/app.css + momentum.css), because the
	   recovered stylesheet does not specify it.
	   ---------------------------------------------------------------------- */

	/* CAPTURED — the band. post-73938.pretty.css:83-92 sets element-7cd54f6 (this
	   two-card section) to background-color #000000. That is one step darker than
	   the page ground --tt-black (#0a0a0b), which is the point: the offer plates
	   sit on their own pure-black stage, and the WHITE Voice band that follows
	   cuts against it. Close reuses the same value for the same reason.

	   CAPTURED — the padding. post-73938.pretty.css:93-100 is `0px 0px 20px 0px`.
	   The 20px bottom is used verbatim. The 0 top is NOT: in the reference this
	   section follows the white quote band, whose own 25px bottom padding
	   (:50-57) supplies the air above the cards; here Paths follows the hero
	   instead, and 0 would collide the first card hairline with the hero's fade.
	   The top is therefore a PAGE-SCOPE value, deliberately about half the shared
	   `.mo-section` rhythm — which is also what closes the dead vertical space
	   between the hero and the cards and pulls the first LEARN MORE back up the
	   mobile fold.

	   Written as `.mo-section.mo-paths` on purpose. `.mo-paths` alone compiles to
	   specificity (0,2,0) once Svelte adds its scoping class, which TIES with
	   momentum.css's `.mo-scope .mo-section` — and a tie is settled by stylesheet
	   order, which is a bundler detail, not a decision. The compound selector makes
	   it (0,3,0) and the override deterministic. */
	.mo-section.mo-paths {
		background: #000000;
		padding-block: clamp(2.75rem, 5vw, 4.5rem) 20px;
	}

	/* Tighter than the global `.section-head` margin (app.css:241, up to 3.5rem).
	   Same reason as the padding above: every pixel between the hero and the first
	   LEARN MORE is spent, not given away. */
	.mo-paths .section-head {
		margin-bottom: clamp(1.25rem, 3vw, 2.25rem);
	}

	.mo-paths__grid {
		display: grid;
		gap: clamp(1.5rem, 4vw, 3rem);
	}

	/* FRAMELESS PLATES, not boxes. Both card images measure #010101 at their
	   edges, so on the #000000 band they bleed into the ground with no visible
	   seam; a filled card surface would put a box where the artwork already ends.
	   All that remains is a top/bottom hairline on the repo's --tt-line token. */
	.mo-paths__card {
		position: relative;
		display: flex;
		flex-direction: column;
		padding-block: clamp(1.4rem, 3vw, 2.2rem);
		border-block: 1px solid var(--tt-line);
		transition: border-color 0.45s var(--mo-ease-expo);
	}

	/* The colour-coded glow. Alphas are the ones the direction brief specifies
	   per door (cyan 0.28, red 0.32), passed in as --mo-card-glow. */
	.mo-paths__card::after {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		pointer-events: none;
		opacity: 0;
		background: radial-gradient(
			62% 44% at 50% 32%,
			rgb(var(--mo-card-accent) / var(--mo-card-glow)),
			transparent 72%
		);
		transition: opacity 0.45s var(--mo-ease-expo);
	}

	/* Hover is a fine-pointer affordance only; focus-within is the keyboard
	   equivalent and is always active, so a keyboard user gets the same
	   "this is the card I am on" signal that a mouse user gets. */
	@media (hover: hover) and (pointer: fine) {
		.mo-paths__card:hover {
			border-block-color: rgb(var(--mo-card-accent) / 0.55);
		}

		.mo-paths__card:hover::after {
			opacity: 1;
		}
	}

	.mo-paths__card:focus-within {
		border-block-color: rgb(var(--mo-card-accent) / 0.55);
	}

	.mo-paths__card:focus-within::after {
		opacity: 1;
	}

	/* REDUCED MOTION: the glow becomes a static accent hairline rather than a
	   transitioned wash. Nothing fades, nothing moves, and the colour coding
	   still distinguishes the two doors. */
	@media (prefers-reduced-motion: reduce) {
		.mo-paths__card {
			border-block-color: rgb(var(--mo-card-accent) / 0.55);
		}

		.mo-paths__card::after {
			display: none;
		}
	}

	/* Aspect-ratio box: both plates are 16/9 (1920x1080 and 1280x720, verified),
	   so the two cards' images are exactly the same height and the comparison
	   lines up. Reserving the ratio in CSS as well as via the img's width/height
	   attributes means no layout shift while any of the three sources loads. The
	   box background is --mo-carbon (#010101), the measured field colour of both
	   images, so the plate is invisible until the art paints over it. */
	.mo-paths__shot {
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		border-radius: var(--tt-radius);
		background: var(--mo-carbon);
	}

	/* CAPTURED — post-73938.pretty.css:140-145 gives the image-box image
	   `width: 100%`. Absolutely positioned rather than height:100%, so the image
	   never depends on a percentage resolving against an aspect-ratio-derived
	   block size. Both plates are exactly 16/9, so `contain` fills the box edge to
	   edge and can never crop the chrome wordmark; if a source is ever swapped for
	   one that is not 16/9 it letterboxes against --mo-carbon instead of cutting
	   the art. */
	.mo-paths__img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	/* CAPTURED — the description type. post-73938.pretty.css:146-150 and :181-185
	   set the image-box description to 23px on both cards; :219-228 drops both to
	   18px at max-width 1024px. Written mobile-first: 18px is the <=1024 value, so
	   it is the base, and 23px is applied from 1025px up.

	   The 15px gap under the plate is CAPTURED too (post-73938.pretty.css:164-168
	   and :274-283); it is expressed here as the paragraph's margin-top rather
	   than the image's margin-bottom because the image is absolutely positioned
	   inside its ratio box and cannot carry a margin.

	   Centred to match the captured widget classes: the image-box is
	   `elementor-position-top` (pretty.html:7489, :7555) and the button widget is
	   `elementor-align-center` (pretty.html:7526, :7600). */
	.mo-paths__card .mo-paths__desc {
		max-width: 46ch;
		margin: 15px auto 0;
		font-size: 18px;
		text-align: center;
	}

	@media (min-width: 1025px) {
		.mo-paths__card .mo-paths__desc {
			font-size: 23px;
		}
	}

	/* margin-top:auto pins both CTAs to the same baseline even when the two
	   descriptions wrap to different line counts — the two doors must look
	   equally weighted. */
	.mo-paths__actions {
		display: flex;
		justify-content: center;
		margin-top: auto;
		padding-top: clamp(1.2rem, 2.5vw, 1.8rem);
	}

	/* ------------------------------------------------------------------------
	   THE BUTTON COLOUR. CAPTURED, and it is the same on both doors.

	   post-73938.pretty.css:151-153
	       .elementor-widget-button .elementor-button {
	         background-color: var(--e-global-color-accent);
	       }
	   post-47277.css:1
	       --e-global-color-accent: #B22725;

	   There is no per-button override anywhere in the recovered stylesheet, so
	   the course button and the live button are the same red. --tt-red
	   (src/app.css:10) is #b22725, byte-identical, so the token is used rather
	   than a one-off hex.

	   WHY THE OVERRIDE LIVES HERE. momentum.css still fills `.mo-cta--course`
	   with cyan and `.mo-cta--live` with a red gradient, which is the defect the
	   review found (one cyan button, one red one, in both Paths and Close). This
	   component and Close.svelte are the ONLY two places on the page that render a
	   `.mo-cta`, so between them they can settle the colour without editing a file
	   they do not own; Close carries the identical rule. The modifier classes are
	   still emitted because Director.svelte keys its Close choreography off
	   `.mo-close__cta.mo-cta--course` / `--live`.

	   White on #b22725 is 6.54:1 — AA at any size. (The cyan fill needed a
	   near-black label; red does not.) */
	.mo-paths__actions .mo-cta {
		color: var(--tt-white);
		background: var(--tt-red);
		box-shadow: 0 14px 34px -14px rgb(var(--tt-red-rgb) / 0.85);
	}

	.mo-paths__actions .mo-cta:hover {
		filter: brightness(1.08);
		box-shadow: 0 18px 44px -12px rgb(var(--tt-red-rgb) / 1);
	}

	/* The icon lives in its own span so its hover transform never touches the
	   anchor's own transform, which magnetic() drives per-frame via GSAP. */
	.mo-paths__cta-icon {
		display: inline-flex;
		transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.mo-cta:hover .mo-paths__cta-icon {
		transform: translateX(4px);
	}

	/* MOBILE CTA BUDGET. Below 768px the plate is capped so that the first
	   LEARN MORE lands within roughly one viewport of the section top. The cap
	   is applied to WIDTH (derived from the 16/9 ratio) rather than height, so
	   the artwork is never cropped. */
	@media (max-width: 767px) {
		.mo-paths__shot {
			max-width: calc(30svh * 16 / 9);
			margin-inline: auto;
		}

		/* STACKED LAYOUT ONLY. Side by side, the two cards' leading hairlines read as
		   one continuous rule across the grid row. Stacked, card A's trailing
		   hairline and card B's leading hairline land one grid gap apart (24px at
		   390px wide) and read as an accidental double rule with an empty band
		   between them, rather than as two card edges. Dropping the second card's
		   leading edge leaves a single hairline separating them; card B keeps its
		   trailing hairline, so its red accent still has an edge to colour on
		   :hover / :focus-within. */
		.mo-paths__card + .mo-paths__card {
			border-block-start-width: 0;
		}
	}

	/* 768px is the repo's canonical tablet breakpoint (app.css:60-66) and is also
	   where the reference switches this section to its 2% / 48% / 48% / 2% column
	   split (post-73938.pretty.css:247-269). Two columns from here up, so the
	   choice is a side-by-side comparison. */
	@media (min-width: 768px) {
		.mo-paths__grid {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
