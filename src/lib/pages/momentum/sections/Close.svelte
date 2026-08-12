<!--
@component
BEAT 4 · CLOSE — the page bookends itself.

Content is exactly two things, both captured:
  1. momentum-welcome-1605.png, the reference's own og:image (meta.txt:13, dims
     declared 1605x398 at meta.txt:15-16, `file` on the download agrees). Its alt
     is the verbatim og:image:alt "Momentum" (meta.txt:17).
  2. The same two destinations as Paths, same visible "LEARN MORE" label
     (pretty.html:7539, :7613), same hrefs (pretty.html:7536, :7610), and the
     same disambiguating accessible names.

NOTHING INVENTED. There is no closing headline, no urgency line, no deadline, no
seat count and no price anywhere in the capture, so none is written here. Every
string and asset path comes from data/content.ts; nothing is inlined.

  3. One short label above each button, `offer.shortLabel` — the opening sentence
     of that offer's own captured description, verbatim, minus its full stop.
     This is the one thing here the reference does not lay out this way, and it
     is not new copy: the reference never needs it because there each LEARN MORE
     sits directly under its own description. This section has no counterpart in
     the capture and shows the two buttons alone, which left two identical red
     "LEARN MORE" pills adjacent — stacked full-width on a phone — with nothing
     on screen to say which door was which. The accessible names already
     distinguished them; the labels make that true for sighted readers too.

THE BAND. #000000, the same value post-73938.pretty.css:83-92 gives the
reference's two-card section. The VALUE is captured; APPLYING it here is a
page-scope decision, and the reason is the artwork: this plate's field measures
#010101-#060606, so it only reads as a frameless plate of light — rather than as
a black box sitting on a slightly different black — when the band behind it is
at least as dark as the art. Pairing it with Paths on one shared pure-black band
also makes the page's two "here are your two doors" beats a matched pair, with
the single white Voice band cut between them.

MOTION.
  · The plate's scroll drift is now a CSS SCROLL-DRIVEN ANIMATION, replacing the
    GSAP parallax(-40) this section used to attach. See the style block for the
    baseline verdict and the fallback.
  · Everything else in Beat 4 belongs to motion/Director.svelte, which owns this
    page's ScrollTriggers inside one gsap.context(). It is already wired — the
    plate's centre-out clip wipe (Director.svelte:204-219) and the two CTAs'
    scatter-and-lock (:227-246) both exist and both fire at 'top 78%'. The hooks
    it resolves against are, verbatim:
        .mo-close__plate                    — the <img> to wipe
        .mo-close__cta.mo-cta--course       — the left-hand CTA
        .mo-close__cta.mo-cta--live         — the right-hand CTA
    Director must keep writing ONLY clip-path on the plate. The old contract said
    that because GSAP's parallax owned the plate's `transform`; it still holds,
    now for a slightly different reason — the CSS drift below animates the
    `translate` property, and a CSS animation wins over inline styles for as long
    as it is running, so a GSAP transform write there would be silently swallowed.
Deliberately NO data-anim / data-anim-stagger attribute is set on anything here.
app.css:210-218 hides those elements via `.js [data-anim] { opacity: 0 }`, and an
element marked that way with no matching tween stays invisible forever. This
section is fully visible on its own; Director's tweens are an enhancement on top.
-->
<script lang="ts">
	import { images, offerList } from '$lib/pages/momentum/data/content';

	/** The og:image plate. The only one of the five captured assets not yet used. */
	const plate = images.welcome;

	/*
	 * AVIF/WebP re-encodings of the captured PNG. Both widths were verified on
	 * disk rather than inferred from the filename: `webpinfo` reports 803x199 and
	 * 1605x398, and the same two sizes were read out of each AVIF's `ispe` box.
	 *
	 * Order matters: <source> is first-match-wins, so AVIF precedes WebP and the
	 * captured PNG stays as the <img> fallback for anything that takes neither.
	 * The PNG is 508.9 KB; the 803w AVIF is 8.0 KB.
	 */
	const PLATE_AVIF = '/momentum-welcome-803.avif 803w, /momentum-welcome-1605.avif 1605w';
	const PLATE_WEBP = '/momentum-welcome-803.webp 803w, /momentum-welcome-1605.webp 1605w';

	/* Taken straight from this plate's own rule below — width: min(1100px, 92vw). */
	const PLATE_SIZES = 'min(1100px, 92vw)';
</script>

<section id="close" class="mo-section mo-close">
	<div class="mo-wrap">
		<picture>
			<source type="image/avif" srcset={PLATE_AVIF} sizes={PLATE_SIZES} />
			<source type="image/webp" srcset={PLATE_WEBP} sizes={PLATE_SIZES} />
			<img
				class="mo-close__plate"
				src={plate.src}
				width={plate.width}
				height={plate.height}
				sizes={PLATE_SIZES}
				alt={plate.alt}
				decoding="async"
				loading="lazy"
			/>
		</picture>

		<div class="mo-close__actions">
			{#each offerList as offer (offer.id)}
				<div class="mo-close__door">
					<span class="mo-close__door-label">{offer.shortLabel}</span>
					<a
						class="mo-cta mo-cta--{offer.id} mo-close__cta"
						href={offer.href}
						aria-label={offer.ctaAriaLabel}>{offer.ctaLabel}</a
					>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	/* CAPTURED VALUE, page-scope application — see the component header. */
	.mo-close {
		background: #000000;
		text-align: center;
	}

	/* The plate.
	   width/height attributes are the intrinsic 1605x398 and `aspect-ratio` repeats
	   them, so the box is reserved before the bytes land — no CLS either way.
	   The displayed width is a page-scope layout decision: the recovered stylesheet
	   specifies nothing for this element, because the reference has no counterpart
	   for this section.

	   The PNG's field measures #010101-#060606, i.e. as dark as the band behind it,
	   so it reads as a frameless plate of light. No border, no radius, no plate
	   background — deliberately. */
	.mo-close__plate {
		width: min(1100px, 92vw);
		height: auto;
		aspect-ratio: 1605 / 398;
		margin: 0 auto clamp(2.25rem, 5vw, 3.5rem);
	}

	/* ------------------------------------------------------------------------
	   THE PLATE'S SCROLL DRIFT — a CSS scroll-driven animation.

	   This replaces the parallax(-40) attachment from $lib/motion that used to be
	   applied to the plate (an attach directive on the img). That created a
	   scrubbed ScrollTrigger (start 'top bottom', end 'bottom top') writing `y`
	   from 0 to -40 on every scroll event. `cover 0%` to `cover 100%` is exactly
	   that range, expressed declaratively and composited off the main thread.

	   The 40px of travel is preserved, recentred as +20px -> -20px so the plate
	   sits at its authored layout position when it is in the middle of the
	   viewport — i.e. the composition you see when you stop scrolling to look at
	   it is the one the CSS describes.

	   BASELINE (verified 12 Aug 2026): scroll-driven animations are Baseline
	   LIMITED — Chrome 115+ and Safari 26+ ship them; Firefox keeps them behind
	   layout.css.scroll-driven-animations.enabled (Nightly only). ADOPT-WITH-FALLBACK.

	   MODERN PATH  — everything inside @supports (animation-timeline: view()).
	   FALLBACK PATH — no declaration at all: Firefox and older engines paint the
	                   plate at its layout position, unmoved and fully visible. The
	                   drift is decoration and is never the only path to content.

	   The @supports wrapper is required, not stylistic: MDN records that Firefox
	   drops `animation-timeline` but keeps the `animation` shorthand, so an
	   unguarded rule would play these keyframes once as a time-based animation on
	   load and leave the plate parked 20px high. `animation-timeline` is declared
	   AFTER the shorthand for the same reason MDN gives — the shorthand resets it.

	   `translate` rather than `transform`: it keeps this animation on a property
	   Director does not touch, so the two writers can never collide. */
	@keyframes mo-close-drift {
		from {
			translate: 0 20px;
		}
		to {
			translate: 0 -20px;
		}
	}

	@media (prefers-reduced-motion: no-preference) {
		@supports (animation-timeline: view()) {
			.mo-close__plate {
				animation: mo-close-drift linear both;
				animation-timeline: view();
				animation-range: cover 0% cover 100%;
			}
		}
	}

	.mo-close__actions {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: center;
		gap: clamp(0.85rem, 2.5vw, 1.25rem);
	}

	/* One door = its label plus its button, kept together so the two can never be
	   separated by a wrap. AUTHORED layout; the capture has no counterpart for this
	   section. */
	.mo-close__door {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.6rem;
	}

	/* The label recedes so the plate and the two red pills stay the loudest things
	   in the band: it is the page's small-label idiom — mono, tracked, at the same
	   0.72rem the Disclosure links and Ledger provenance use — in --mo-mute, which
	   the dark band points at --tt-mute-2 (5.50:1 on #000, AA at this size).
	   AUTHORED values; nothing here is a captured metric. */
	.mo-close__door-label {
		font-family: var(--tt-font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.1em;
		line-height: 1.4;
		color: var(--mo-mute);
		text-wrap: balance;
	}

	/* ------------------------------------------------------------------------
	   THE BUTTON COLOUR. CAPTURED, identical on both doors, and identical to the
	   rule in Paths.svelte — the two files are the page's only `.mo-cta` render
	   sites, so between them they settle this without editing momentum.css, which
	   still fills `.mo-cta--course` with cyan and `.mo-cta--live` with a red
	   gradient. That split is the defect the review found (one cyan button and one
	   red one, side by side, in this very section).

	   post-73938.pretty.css:151-153
	       .elementor-widget-button .elementor-button {
	         background-color: var(--e-global-color-accent);
	       }
	   post-47277.css:1
	       --e-global-color-accent: #B22725;

	   --tt-red (src/app.css:10) is #b22725, byte-identical, so the token is used
	   rather than a one-off hex. White on it is 6.54:1 — AA at any size.

	   The `.mo-cta--course` / `--live` modifier classes are still emitted because
	   Director.svelte keys the scatter-and-lock off them; they simply no longer
	   decide the colour. */
	.mo-close__actions .mo-cta {
		color: var(--tt-white);
		background: var(--tt-red);
		box-shadow: 0 14px 34px -14px rgb(var(--tt-red-rgb) / 0.85);
	}

	.mo-close__actions .mo-cta:hover {
		filter: brightness(1.08);
		box-shadow: 0 18px 44px -12px rgb(var(--tt-red-rgb) / 1);
	}

	/* Stacked and full-width on small phones; a centred row from 480px up —
	   the 480px step is the repo's canonical breakpoint (app.css:60-66). */
	.mo-close__cta {
		width: 100%;
	}

	@media (min-width: 480px) {
		.mo-close__actions {
			flex-direction: row;
			flex-wrap: wrap;
			align-items: flex-start;
			/* Wider than the stacked gap, and deliberately so: side by side, each
			   door is as wide as its LABEL rather than its button, so the column
			   gap is the only thing separating one label from the next. At the
			   stacked 20px the two labels read as a single run-on line. */
			column-gap: clamp(1.75rem, 4vw, 3.5rem);
		}

		.mo-close__cta {
			width: auto;
		}
	}

	/* NOTE ON THE TERMINATING HAIRLINE. The direction brief asks Close to end on a
	   1px hairline rather than a dramatic full-bleed edge, and asks Disclosure —
	   the section immediately after it — to open on a 1px hairline. Drawing both
	   would stack two adjacent 1px rules into a 2px line, so the boundary rule is
	   drawn ONCE, by Disclosure's top hairline. Same pixel, same token
	   (var(--tt-line)); it is simply not painted twice. */
</style>
