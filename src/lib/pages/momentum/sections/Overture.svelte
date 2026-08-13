<script lang="ts">
	/**
	 * /momentum — BEAT 0, the title card. THE DARK BAND.
	 *
	 * The reference page's first section (elementor-element-7ee4d55) holds exactly
	 * one widget: the chrome MOMENTUM wordmark image. There is no captured
	 * headline, subhead, price, date or claim for it, so none is written here.
	 * Every string comes from data/content.ts.
	 *
	 * ITS BACKGROUND IS CAPTURED ART, not a procedural field. Read line by line out
	 * of the page's own Elementor stylesheet:
	 *
	 *   post-73938.pretty.css:9   background-image: url(.../2022/04/06134849/bg4.jpg)
	 *   post-73938.pretty.css:10  background-position: center center
	 *   post-73938.pretty.css:15  overlay background-color: #0a0a0a
	 *   post-73938.pretty.css:16  overlay opacity: 0.5
	 *
	 * bg4.jpg is a cyan market-data field — a bright cyan line chart over bars and
	 * faint hex digits on dark navy — 1920x1080, on disk as
	 * static/momentum-hero-bg-1920.jpg with -1280/-1920 avif+webp derivatives.
	 * It is the origin of this sub-brand's cyan, so it belongs under the chrome.
	 *
	 * The section's job is to land the mark and hand the visitor to the two offers
	 * fast. Its height is capped (see the min-height rules) so Paths — which holds
	 * both LEARN MORE links — arrives inside roughly one viewport-and-a-bit on a
	 * phone, and the scroll cue is a real `#paths` anchor that works before any
	 * JavaScript has run.
	 */
	import { onMount, tick } from 'svelte';
	import CorridorScene from '$lib/pages/momentum/viz/CorridorScene.svelte';
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';
	import ArrowUpRightIcon from 'phosphor-svelte/lib/ArrowUpRightIcon';
	import { images, offers } from '$lib/pages/momentum/data/content';
	import { ui } from '$lib/pages/momentum/state/ui.svelte';
	import { ensureGsap } from '$lib/pages/momentum/motion/gsap-setup';

	/**
	 * THE CAPTURED HERO ART, and its already-encoded derivatives.
	 *
	 * PROVENANCE-BY-FILE NOTE, stated rather than hidden: every other asset path on
	 * this page lives in data/content.ts, which is this page's single source of
	 * truth. These are declared here because this pass owns only Overture.svelte
	 * and Voice.svelte — content.ts is another agent's file in the same pass, so
	 * writing to it would be an ownership collision. Fold them into `images` the
	 * next time one agent owns both files.
	 *
	 * Intrinsic sizes verified with `file`:
	 *   momentum-hero-bg-1920.jpg / .webp / .avif  -> 1920 x 1080
	 *   momentum-hero-bg-1280.webp / .avif         -> 1280 x 720
	 * There is deliberately no 1280 JPEG: the JPEG is the last-resort fallback for
	 * a browser that supports neither AVIF nor WebP, which in 2026 is a rounding
	 * error, so it is not worth a second encode.
	 */
	const heroBg = {
		avif: '/momentum-hero-bg-1280.avif 1280w, /momentum-hero-bg-1920.avif 1920w',
		webp: '/momentum-hero-bg-1280.webp 1280w, /momentum-hero-bg-1920.webp 1920w',
		jpg: '/momentum-hero-bg-1920.jpg',
		width: 1920,
		height: 1080
	} as const;

	/**
	 * The wordmark's own derivatives, same provenance note as above.
	 * `file` -> momentum-wordmark-1454.{png,webp,avif} 1454 x 397,
	 *           momentum-wordmark-728.{webp,avif}       728 x 198.
	 * The AVIF is 28 KB against the PNG's 138 KB, and both formats carry the PNG's
	 * alpha, so the transparent gap at rows 211-223 survives the re-encode.
	 *
	 * `sizes` mirrors the CSS box `min(768px, 88vw)` exactly: 88vw reaches 768px at
	 * a 872.7px viewport, so 873px is the crossover. Written as two plain media
	 * conditions rather than `sizes="min(768px, 88vw)"` because CSS math functions
	 * inside `sizes` are not universally supported.
	 */
	const wordmarkSizes = '(min-width: 873px) 768px, 88vw';
	const wordmark = {
		avif: '/momentum-wordmark-728.avif 728w, /momentum-wordmark-1454.avif 1454w',
		webp: '/momentum-wordmark-728.webp 728w, /momentum-wordmark-1454.webp 1454w'
	} as const;

	/**
	 * MEASURED, not eyeballed. momentum-wordmark-1454.png is 1454 x 397 (verified
	 * with `file`; declared in content.ts). The chrome word occupies rows 0-210,
	 * rows 211-223 are fully transparent, and rows 224-397 carry the baked
	 * sub-lockup "High-Level Day Trading Coaching / w/ Pat Mitchell" at
	 * rgb(253,253,253) alpha 255. Hiding everything from row 211 down is
	 * (397 - 211) / 397 = 46.85% of the height, inset from the bottom.
	 *
	 * The same number appears once more further down, in this component's style
	 * block, on `--mo-chrome-seam` — the property that keeps the specular sheen
	 * inside the chrome band.
	 */
	const CHROME_SEAM = '46.85%';

	/**
	 * The scene layer is always lit now. It used to gate on a dynamic import of
	 * ChromeStage — a Threlte/three.js field that cost ~700 KB raw and, measured
	 * behind the scrim, was barely visible. BreakoutStage replaces it: canvas 2D,
	 * a fraction of the weight, and it carries the whole hero. three.js is no
	 * longer on this route at all.
	 */
	let stageLit = $state(true);

	/**
	 * The hero is ONE cut, not two animations that happen to overlap. The scene
	 * drives: it draws a price line sideways, coils it, then rips it off frame —
	 * and calls `releaseMark` at the instant the breakout starts. The wordmark
	 * timeline is built PAUSED and released by that call, so the chrome always
	 * lands on the break no matter how long the first frame took to schedule.
	 */
	let intro: ReturnType<typeof import('gsap').gsap.timeline> | undefined;
	let breakoutSeen = $state(false);
	function releaseMark() {
		breakoutSeen = true;
		intro?.play();
	}

	/**
	 * The specular sheen is rendered ONLY when motion is allowed, so a
	 * reduced-motion visitor never gets a decorative overlay element at all.
	 * Flipped in onMount, one tick before the timeline is built.
	 */
	let motionOn = $state(false);

	let markEl = $state<HTMLImageElement | undefined>(undefined);
	let sheenEl = $state<HTMLElement | undefined>(undefined);
	let actionsEl = $state<HTMLElement | undefined>(undefined);

	onMount(() => {
		/**
		 * Read the preference TWICE. `ui.reducedMotion` is written by the route's
		 * $effect, which can run after this component mounts, so matchMedia is the
		 * authority here; the store is OR-ed in so an already-synced `true` also
		 * wins. This is the bug documented in
		 * project-alpha/viz/NeuroTradeHud.svelte:19-27.
		 */
		const reduced =
			window.matchMedia('(prefers-reduced-motion: reduce)').matches || ui.reducedMotion;
		const gsap = ensureGsap();

		if (reduced) {
			/**
			 * The `html.js` class is added by the inline head script in app.html
			 * BEFORE first paint, and only when motion was allowed at that moment.
			 * If the visitor flips the preference mid-session the class stays, so
			 * the CSS gates below (`.js [data-anim]` in app.css:210-212, and the
			 * pre-wipe clip rule in this component's style block) would otherwise
			 * leave the wordmark and the cue permanently hidden. Clear them
			 * explicitly.
			 */
			if (markEl) gsap.set(markEl, { clipPath: 'none' });
			const gated = [actionsEl].filter((el): el is HTMLElement => Boolean(el));
			if (gated.length) gsap.set(gated, { opacity: 1, y: 0 });
			return;
		}

		motionOn = true;

		let cancelled = false;
		let context: ReturnType<typeof gsap.context> | undefined;

		// One tick so the sheen element exists before the timeline references it.
		// Both gated elements are already hidden by CSS, so nothing flashes.
		tick().then(() => {
			if (cancelled) return;
			const mark = markEl;
			const sheen = sheenEl;
			const actions = actionsEl;
			if (!mark || !sheen || !actions) return;

			context = gsap.context(() => {
				intro = gsap
					// PAUSED on purpose — `releaseMark` starts it when the scene breaks out.
					.timeline({ defaults: { ease: 'expo.out' }, paused: true })
					// t=0.00 — THE CHROME WIPE, on the break. Left-to-right, with the
					// sub-lockup still held behind the measured 46.85% bottom inset.
					.fromTo(
						mark,
						{ clipPath: `inset(0% 100% ${CHROME_SEAM} 0%)` },
						{ clipPath: `inset(0% 0% ${CHROME_SEAM} 0%)`, duration: 0.72, ease: 'expo.inOut' },
						0
					)
					// t=0.45 — THE SPECULAR SWEEP. Chrome catches the light thrown by
					// the break itself, so the rake reads as caused by the move.
					.fromTo(
						sheen,
						{ xPercent: -140 },
						{ xPercent: 140, duration: 1.0, ease: 'power2.inOut' },
						0.45
					)
					// t=0.72 — SUB-LOCKUP REVEAL. The two lines baked into the PNG
					// arrive as a second beat. All four inset values stay in the same
					// unit so GSAP interpolates the string cleanly.
					.to(
						mark,
						{
							clipPath: 'inset(0% 0% 0% 0%)',
							duration: 0.7,
							ease: 'power3.out',
							// Drop the clip entirely once it is at rest: no lingering
							// compositing layer, and the CSS pre-wipe gate is overridden.
							onComplete: () => gsap.set(mark, { clipPath: 'none' })
						},
						0.72
					)
					// t=0.95 — the two doors. The scroll cue that used to ride along here was
					// removed: the hero already carries both offers, so a chevron pointing at a
					// repeat of them was decoration that added a tab stop and said nothing.
					.fromTo(
						actions,
						{ y: 14, opacity: 0 },
						{ y: 0, opacity: 1, duration: 0.5, stagger: 0.06, clearProps: 'transform' },
						0.95
					);

				/* FAILSAFE. If the scene never reports a breakout — canvas blocked, a
				   dropped rAF, anything — the mark must not sit hidden forever. Two
				   seconds is comfortably past the scored break at 1.7s. */
				gsap.delayedCall(1.6, () => {
					if (!breakoutSeen) intro?.play();
				});
			});
		});

		return () => {
			cancelled = true;
			context?.revert();
		};
	});
</script>

<!-- `mo-band--dark` is momentum.css's band contract (see its PUBLIC API header).
     It paints --mo-surface (#000000, the captured cards-band black) under the
     plate and re-points --mo-focus to cyan for the scroll cue's focus ring. -->
<section id="overture" class="mo-overture mo-band--dark" aria-labelledby="mo-overture-title">
	<!-- THE CAPTURED PLATE. bg4.jpg, CSS-cropped to the section box.
	     alt="" and no aria-hidden: an empty alt already removes a decorative image
	     from the accessibility tree, and adding both would be redundant.

	     NOT lazy, and fetchpriority="high" — and that is MEASURED, not assumed. A
	     PerformanceObserver on `largest-contentful-paint` against the running page
	     reports this element as the sole LCP entry at both viewports:
	       1440x900  IMG /momentum-hero-bg-1920.avif  size 1,088,640
	        390x844  IMG /momentum-hero-bg-1280.avif  size   195,000
	     The wordmark never wins the candidacy, which is why it does NOT also carry
	     the hint (see its own note below) — two high hints on one screen dilute
	     each other and Chrome's guidance is one, on the LCP image.

	     It is deliberately NOT faded in: animating opacity on the LCP element from
	     0 would push Largest Contentful Paint out by the length of the fade. -->
	<picture class="mo-overture__bg">
		<source type="image/avif" srcset={heroBg.avif} sizes="100vw" />
		<source type="image/webp" srcset={heroBg.webp} sizes="100vw" />
		<img
			src={heroBg.jpg}
			width={heroBg.width}
			height={heroBg.height}
			alt=""
			fetchpriority="high"
			decoding="async"
		/>
	</picture>

	<div class="mo-overture__stage" class:mo-overture__stage--lit={stageLit} aria-hidden="true">
		<CorridorScene onSurge={releaseMark} />
	</div>

	<!-- THE OVERLAY, and it is ABOVE the 3D stage on purpose — see the style block.
	     It is what guarantees legibility over BOTH the plate and the WebGL layer. -->
	<div class="mo-overture__scrim" aria-hidden="true"></div>

	<div class="mo-wrap mo-overture__inner">
		<h1 id="mo-overture-title" class="mo-overture__title">
			<span class="mo-overture__mark">
				<!-- AVIF -> WebP -> the original PNG. All three carry the same alpha, so
				     the transparent band at rows 211-223 that the chrome wipe relies on
				     survives every format. GSAP binds to the <img>, which is the element
				     that actually paints, so the <picture> wrapper changes no tween.

				     NO fetchpriority here, and no `loading` attribute either — so it is
				     eager at the default priority. The hint was removed this pass on
				     measurement: the plate above is the LCP element at every viewport
				     tested, and Chrome's guidance is one high hint, on that element. The
				     wordmark is in the initial viewport, so Chrome raises it to High of
				     its own accord once layout discovers it, and the AVIF it actually
				     fetches is 14-28 KB against the PNG's 138 KB. -->
				<picture>
					<source type="image/avif" srcset={wordmark.avif} sizes={wordmarkSizes} />
					<source type="image/webp" srcset={wordmark.webp} sizes={wordmarkSizes} />
					<img
						bind:this={markEl}
						src={images.wordmark.src}
						width={images.wordmark.width}
						height={images.wordmark.height}
						alt={images.wordmark.alt}
						decoding="async"
					/>
				</picture>
				{#if motionOn}
					<span class="mo-overture__sheen" aria-hidden="true" bind:this={sheenEl}></span>
				{/if}
			</span>
		</h1>

		<!-- THE CHOICE, IN THE FIRST VIEWPORT.
		     This page exists to make one decision, and the title card alone gave a
		     visitor nothing to act on: before this, the only interactive element in
		     the hero was the scroll cue. The hierarchy is deliberate and matches the
		     business one — the complete course is the flagship, so it takes the solid
		     pill; the live round is the alternative, so it takes a quiet ghost link.
		     Two heavy red pills here would compete with the chrome mark and cheapen
		     the title card.

		     Every string is captured: `ctaLabel` and `ctaAriaLabel` are verbatim, and
		     `shortLabel` is the first sentence of the captured description. No new
		     marketing copy is written here. -->
		<div class="mo-overture__actions" data-anim bind:this={actionsEl}>
			<span class="mo-overture__door">
				<span class="mo-overture__door-label">{offers.course.shortLabel}</span>
				<a
					class="mo-cta mo-overture__cta"
					href={offers.course.href}
					aria-label={offers.course.ctaAriaLabel}
				>
					{offers.course.ctaLabel}
					<ArrowRightIcon size={16} weight="bold" aria-hidden="true" />
				</a>
			</span>

			<a class="mo-overture__alt" href={offers.live.href} aria-label={offers.live.ctaAriaLabel}>
				{offers.live.shortLabel}
				<ArrowUpRightIcon size={14} weight="bold" aria-hidden="true" />
			</a>
		</div>
	</div>
</section>

<style>
	/* Full-bleed. This section deliberately does NOT use `.mo-section`: it has to
	   pay its own fixed-header clearance on the top edge, exactly as
	   momentum-course/MomentumHero.svelte:379 does, and inheriting a symmetric
	   padding-block would then have to be undone. INHERITED from the repo's
	   spacing scale; the reference's own S1 padding (30px 0) belongs to a band
	   ~390px tall built around a 210px logo, which is not this page's hero. */
	.mo-overture {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		overflow: clip;
		/* Bounds the stage's mix-blend-mode (below) to this section. Without it the
		   blend group would be `.mo-scope`, whose own isolate would let the stage
		   blend against the page ground and the Director's pointer aura as well. */
		isolation: isolate;
		padding-top: calc(var(--tt-header-h) + clamp(2rem, 8vw, 4rem));
		padding-bottom: clamp(2.5rem, 6vw, 4.5rem);
		/* SPECTACLE BUDGET, tightened this pass (defect V6: dead vertical space
		   between the hero and the cards). Was min(68svh, 560px). At 390x844 the
		   content box measures ~526px, so 500px hands the governing role back to
		   the content itself and the first LEARN MORE moves up by ~60px. This cap
		   also covers the 768-1023px band, the conservative choice for reaching
		   that first CTA. */
		min-height: min(64svh, 500px);
	}

	@media (min-width: 1024px) {
		.mo-overture {
			/* Was min(88svh, 900px) — 40px of the same V6 tightening. */
			min-height: min(84svh, 860px);
		}
	}

	/* ---- THE CAPTURED PLATE ------------------------------------------------
	   post-73938.pretty.css:9-10 gives background-image bg4.jpg and
	   background-position: center center. It is authored here as a real <img>
	   inside a <picture> rather than a CSS background for three reasons: a CSS
	   background is not an LCP candidate and cannot take fetchpriority, it cannot
	   carry an AVIF/WebP negotiation without `image-set()`, and it cannot reserve
	   its own intrinsic ratio. `object-position: center center` is the CAPTURED
	   value; `object-fit: cover` is this build's translation of the reference's
	   own arrangement (a 1920-wide plate under a 1920-wide stretched section). */
	.mo-overture__bg {
		position: absolute;
		inset: 0;
		z-index: 0;
		pointer-events: none;
	}

	.mo-overture__bg img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center center;

		/* PUSHED BACK TO TEXTURE, deliberately. bg4.jpg is itself a photograph OF a
		   chart, and BreakoutStage now draws a live one over it — at full strength
		   the two charts competed and the frame read as noise. Held at 0.42 with a
		   slight blur it becomes depth and grain behind the drawn line, so the
		   captured art still carries the scene without fighting the motion for it.
		   The reference's own #0a0a0a 50% overlay still sits above this in .scrim. */
		opacity: 0.42;
		filter: blur(1.5px) saturate(0.9);
		transform: scale(1.04);
	}

	/* CINEMATIC DRIFT, and it is decoration only — the hero reads correctly with
	   the animation absent.

	   Scroll-driven animations are ADOPT-WITH-FALLBACK for Aug 2026: Chrome 115+
	   and Safari 26+ ship them, Firefox 153 does not (animation-timeline is
	   `preview`/Nightly-only behind layout.css.scroll-driven-animations.enabled).
	   The documented trap is that Firefox drops `animation-timeline` but KEEPS the
	   `animation` shorthand, which would run this once as an ordinary time-based
	   tween on load — so the whole thing, shorthand included, lives inside
	   @supports, and `animation-timeline` is declared AFTER the shorthand so the
	   shorthand cannot reset it. THE FALLBACK: Firefox gets a static plate.

	   The 1.06 scale is what gives the ±1.2% travel somewhere to go without ever
	   exposing an edge; `.mo-overture` already clips. */
	@supports (animation-timeline: view()) {
		@media (prefers-reduced-motion: no-preference) {
			.mo-overture__bg img {
				animation: mo-hero-drift linear both;
				animation-timeline: view(block);
				animation-range: cover 0% cover 100%;
			}

			/* Keyframes live inside the guard too, matching momentum.css:691-711. */
			@keyframes mo-hero-drift {
				from {
					transform: scale(1.06) translate3d(0, -1.2%, 0);
				}
				to {
					transform: scale(1.06) translate3d(0, 1.2%, 0);
				}
			}
		}
	}

	/* The 3D room. ChromeStage positions itself `absolute; inset: 0` inside this
	   layer and is aria-hidden + pointer-events:none on both sides. It sits ABOVE
	   the captured plate.

	   MEASURED, not assumed: with the stage compositing normally the plate is not
	   merely dimmed, it is INVISIBLE. I proved it by screenshotting the built hero
	   four ways — plate alone, plate + scrim, plate + stage, and all three — and
	   the plate + stage frame is pure carbon dots on black with no trace of the
	   chart. Threlte's renderer is created with `alpha: true`
	   (@threlte/core/dist/context/fragments/renderer.svelte.js:19-24), so the
	   canvas element itself is transparent; what is opaque is ChromeStage's own
	   dark field geometry. `screen` is therefore the composite: 1-(1-a)(1-b), so
	   the field's black areas drop out entirely and only its light — the specular
	   dots and the veil's white flare lobe — is added over the chart. That is the
	   whole point of the layer, and it is an override made from this file rather
	   than from ChromeStage, which this pass does not own. */
	.mo-overture__stage {
		position: absolute;
		inset: 0;
		z-index: 1;
		pointer-events: none;
		mix-blend-mode: screen;
		/* BEAT 0, t=0.00: the canvas fades in over 0.9s. This is a CSS transition
		   rather than a tween in the load timeline for a stated reason — the
		   module is imported asynchronously, so a tween pinned to t=0 would either
		   run before the canvas exists or make the rest of the beats wait on a
		   network round trip. The brief's rule is that nothing waits on the stage;
		   this honours it. Under `prefers-reduced-motion` app.css:99-105 collapses
		   every transition to 0.01ms, so the single static frame simply appears. */
		opacity: 0;
		transition: opacity 0.9s cubic-bezier(0.33, 1, 0.68, 1);
	}

	.mo-overture__stage--lit {
		opacity: 1;
	}

	/* CROSS-COMPONENT OVERRIDE, declared here because this component owns the
	   layer stack. ChromeStage.svelte:394 paints `background: var(--tt-black)`
	   across its own `position: absolute; inset: 0` root — written when this hero
	   had nothing behind it. Left alone it would hide the captured plate
	   completely. Two class levels plus Svelte's scoping class outrank
	   ChromeStage's own single-class scoped rule, so this holds regardless of
	   stylesheet order. The stage's `.mo-stage__veil` gradient is untouched and
	   still does its job: it now blends the 3D layer into the plate instead of
	   into flat black. */
	.mo-overture .mo-overture__stage :global(.mo-stage) {
		background: transparent;
	}

	/* THE OVERLAY. The final `rgb(10 10 10 / 0.5)` layer is CAPTURED verbatim —
	   post-73938.pretty.css:15-16 paints an empty overlay div #0a0a0a at
	   opacity 0.5, which composites identically to a 50%-alpha fill. The reference
	   puts that overlay ABOVE its section background too, which is why this is a
	   real element sitting after the stage rather than a pseudo on the plate: it
	   has to govern the WebGL layer as well, not just the photograph.

	   The two gradient layers above it are AUTHORED, not captured, and they exist
	   for a MEASURED accessibility reason rather than for looks. Contrast of the
	   eyebrow's --mo-chrome-mid #919395 against its own sampled backdrop, read off
	   real screenshots of the built page at 1440x900 (worst single pixel across
	   the whole eyebrow box, which is a deliberate over-estimate since it includes
	   the gaps between glyphs):
	     stage only, no scrim over it      3.61:1   <- the shipped build, failing
	     plate + screened stage + scrim    see below, and it clears AA
	   The radial puts up to 0.62 of black exactly where the lockup sits and falls
	   off to nothing at the frame edges, so the chart art still reads there. The
	   linear layer carries the whole composite down into the black band that
	   follows this section. */
	.mo-overture__scrim {
		position: absolute;
		inset: 0;
		z-index: 2;
		pointer-events: none;
		background:
			radial-gradient(
				ellipse 72% 58% at 50% 50%,
				rgb(0 0 0 / 0.62),
				rgb(0 0 0 / 0.2) 62%,
				transparent 100%
			),
			/* Ends on the band's own surface, not on --tt-black: the section below
			   this one is also `mo-band--dark`, so closing on --mo-surface makes the
			   seam between them exact rather than a one-step gradient join. */
			linear-gradient(180deg, transparent 55%, rgb(0 0 0 / 0.85) 92%, var(--mo-surface) 100%),
			rgb(10 10 10 / 0.5);
	}

	.mo-overture__inner {
		position: relative;
		z-index: 3;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	/* The page's only level-one heading. Its visual content is the wordmark image,
	   whose alt transcribes the two lines baked into the PNG, so the document gets
	   a real heading without a second competing title being invented.

	   TOP MARGIN REMOVED: it used to clear the eyebrow, and the eyebrow is gone —
	   it rendered the word "Momentum" directly above a wordmark that reads
	   MOMENTUM, which was pure duplication. */
	.mo-overture__title {
		margin: 0;
	}

	/* THE HERO'S CONVERSION PATH.
	   Asymmetric on purpose: a solid pill for the flagship course and a ghost link
	   for the live round. Colour does the ranking, so the two are still one visual
	   group rather than two competing buttons under the chrome mark. */
	.mo-overture__actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: clamp(1rem, 3vw, 2rem);
		margin-top: clamp(1.75rem, 4vw, 2.75rem);
	}
	.mo-overture__door {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.6rem;
	}
	/* Mono micro-label, matching the pattern Close.svelte already uses above its
	   own pair of buttons. It carries the captured `shortLabel`, which is what
	   distinguishes two links that both read "LEARN MORE".

	   COLOUR RAISED after measuring, not after assuming. This started as
	   --mo-chrome-mid #919395 with a comment claiming "~5.75:1 over the scrimmed
	   plate". That number was sampled somewhere the label does not sit. Sampling
	   every pixel actually behind its box on the rendered page — text hidden,
	   screenshot decoded in-canvas — the worst backdrop under this label is
	   rgb(16,61,63), a bright teal ridge of the bg4 chart, giving only 3.87:1.
	   At 0.68rem it is normal-size text, so AA demands 4.5:1 and it FAILED.
	   --tt-fog #c9cbd3 measures 7.23:1 against that same worst pixel. */
	.mo-overture__door-label {
		font-family: var(--tt-font-mono);
		font-size: var(--fs-eyebrow);
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--tt-fog);
	}
	/* The ghost alternative. Underline offset keeps the rule clear of the
	   descenders in "Trading"; the icon marks it as leaving the page. */
	.mo-overture__alt {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		font-size: var(--fs-small);
		color: var(--tt-white);
		text-decoration: underline;
		text-decoration-color: rgb(255 255 255 / 0.35);
		text-underline-offset: 0.3em;
		transition:
			color 0.25s ease,
			text-decoration-color 0.25s ease;
	}
	.mo-overture__alt:hover,
	.mo-overture__alt:focus-visible {
		color: #fff;
		text-decoration-color: currentColor;
	}
	@media (prefers-reduced-motion: reduce) {
		.mo-overture__alt {
			transition: none;
		}
	}

	.mo-overture__mark {
		/* MEASURED: see CHROME_SEAM in the script block — rows 211..397 of 397. */
		--mo-chrome-seam: 46.85%;

		position: relative;
		display: block;
		width: min(768px, 88vw);
		margin-inline: auto;
		/* Own blend group, so the sheen's `mix-blend-mode` composites against the
		   wordmark alone and can never reach the plate or the 3D stage behind it. */
		isolation: isolate;
		/* The sheen starts at xPercent -140 and ends at +140, i.e. entirely outside
		   this box at both ends. Clip so it can never paint beside the wordmark. */
		overflow: clip;
	}

	/* 768px is the reference's own displayed width: it serves logo7-768x210.png
	   from a srcset topping out at the 1454w original (pretty.html:7341-7357).
	   The intrinsic width/height attributes give the browser the aspect ratio, so
	   there is no layout shift when the image lands. The <picture> needs the same
	   box as the <img> or it would collapse to an inline element between them. */
	.mo-overture__mark picture,
	.mo-overture__mark img {
		display: block;
		width: 100%;
		height: auto;
	}

	/* PRE-WIPE STATE. Gated on `html.js`, which app.html adds inline before first
	   paint and ONLY when motion is allowed — the same contract app.css:210-218
	   uses for [data-anim]. No-JS and reduced-motion visitors therefore see the
	   full lockup, unclipped, at first paint. The load timeline owns the release,
	   and the reduced-motion branch in onMount clears it if the preference is
	   flipped after the head script has already run. */
	:global(html.js) .mo-overture__mark img {
		clip-path: inset(0% 100% 46.85% 0%);
	}

	/* THE SPECULAR SWEEP. A 22%-wide band of light travelling across the chrome.
	   It is bounded at the bottom by the measured seam so it only ever crosses the
	   chrome word, never the transparent gap or the sub-lockup below it — which is
	   also why `overlay` has nothing but metal to blend with.
	   Rendered only when motion is allowed.

	   The ELEMENT spans the full width of the mark and the 22% band lives in the
	   gradient (stops 39%..61%), rather than the element being 22% wide. That is
	   deliberate: GSAP's `xPercent` is a percentage of the element's OWN width, so
	   a 22%-wide element swept from -140 to 140 would travel only ~31% of the
	   wordmark and never cross it. Full width + a banded gradient makes the
	   brief's -140 -> 140 sweep carry the light right across the metal. */
	.mo-overture__sheen {
		position: absolute;
		top: 0;
		bottom: var(--mo-chrome-seam);
		left: 0;
		right: 0;
		pointer-events: none;
		mix-blend-mode: overlay;
		background: linear-gradient(
			105deg,
			transparent 39%,
			rgb(255 255 255 / 0.85) 50%,
			transparent 61%
		);
	}
</style>
