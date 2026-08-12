<script lang="ts">
	/**
	 * /momentum — the page-level cinematographer.
	 *
	 * WHAT THIS FILE OWNS, AND ONLY THIS:
	 *   1. The CHAPTER RAIL (>=1280px, aria-hidden, decorative): six indices and six
	 *      dots, one per section id, plus a progress fill driven by ui.scrollProgress.
	 *      It carries NO words — no chapter names, no labels — because the reference
	 *      capture evidences no name for any section on this page and inventing six
	 *      would be inventing copy.
	 *   2. The POINTER AURA (fine pointer + motion allowed only). It is the sole
	 *      consumer of --mo-pointer-x / --mo-pointer-y, which momentum.css declares
	 *      on `.mo-scope` and reads back in its `.mo-aura` rule.
	 *   3. The two CROSS-SECTION motion beats that no single section can own:
	 *      the scroll-velocity-linked skew on `.mo-paths__card` (Beat 1's tail), and
	 *      Beat 4 on Close — the plate's centre-out clip wipe and the two CTAs'
	 *      scatter-and-lock. Close deliberately exposes those three class hooks and
	 *      implements neither, so this is the only writer.
	 *   4. ScrollTrigger.refresh() after mount and again once the display face has
	 *      swapped in — Allerta Stencil changes heading heights, and every trigger
	 *      created before that would otherwise be measured against fallback metrics.
	 *
	 * WHAT THIS FILE DELIBERATELY DOES NOT OWN. The reduced-motion sync, the Lenis
	 * lifecycle and the scroll-spy listener live in the ROUTE's $effect
	 * (src/routes/momentum/+page.svelte), mirroring project-alpha/+page.svelte:41-84.
	 * Tying Lenis to the route rather than to a child component keeps its lifetime
	 * exactly equal to the page's, and keeps this component free to be removed
	 * without taking smooth scrolling and the scroll-spy with it.
	 *
	 * SECTION-LOCAL BEATS BELONG TO THEIR SECTIONS, and this file must never
	 * duplicate them. Verified by reading each component:
	 *   Overture.svelte  — the load timeline (chrome wipe, sheen, sub-lockup, cue).
	 *   Paths.svelte     — the two-door parting, the plate shutters, splitReveal,
	 *                      tilt() and magnetic(). Only the velocity skew was left here.
	 *   Voice.svelte     — the avatar's circular clip wipe, splitReveal, drawLine. Its
	 *                      GSAP parallax is gone; the avatar's drift is now a CSS
	 *                      view() timeline on the <img> inside the clipped <picture>.
	 *   Ledger.svelte    — the tape's scrub (it owns MomentumTape's `progress` prop,
	 *                      so no other component can reach it).
	 *   Close.svelte     — no GSAP at all any more. The plate's drift became a CSS
	 *                      scroll-driven animation on the `translate` property, so the
	 *                      old rule still stands and has only got stricter: Director
	 *                      must write ONLY clip-path on `.mo-close__plate`. A running
	 *                      CSS animation beats an inline style, so a transform written
	 *                      here would now be swallowed rather than merely fighting.
	 *   Disclosure.svelte— no GSAP at all any more. Its reveal() was deleted outright
	 *                      (legal fine print must be readable the instant it is on
	 *                      screen); its boundary hairline draws via a CSS timeline.
	 */
	import { onMount } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import { browser } from '$app/env';
	import { SECTION_IDS } from '$lib/pages/momentum/data/content';
	import { ui } from '$lib/pages/momentum/state/ui.svelte';
	import { ensureGsap, ScrollTrigger } from '$lib/pages/momentum/motion/gsap-setup';

	const matches = (q: string) => (browser ? window.matchMedia(q).matches : false);

	/**
	 * Read at component init rather than in onMount, so a reduced-motion visitor
	 * never gets a frame of choreography built and then reverted. `ui.reducedMotion`
	 * is OR-ed in because the route's $effect is its only writer and can run after
	 * this component initialises (the bug documented in
	 * project-alpha/viz/NeuroTradeHud.svelte:19-27).
	 */
	let systemReduced = $state(matches('(prefers-reduced-motion: reduce)'));
	let finePointer = $state(matches('(hover: hover) and (pointer: fine)'));

	const reduced = $derived(systemReduced || ui.reducedMotion);
	const auraOn = $derived(finePointer && !reduced);

	onMount(() => {
		const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
		const pointerMq = window.matchMedia('(hover: hover) and (pointer: fine)');
		// Re-read after mount: SSR renders with both at their `false` fallback.
		systemReduced = motionMq.matches;
		finePointer = pointerMq.matches;

		const onMotion = () => (systemReduced = motionMq.matches);
		const onPointer = () => (finePointer = pointerMq.matches);
		motionMq.addEventListener('change', onMotion);
		pointerMq.addEventListener('change', onPointer);

		return () => {
			motionMq.removeEventListener('change', onMotion);
			pointerMq.removeEventListener('change', onPointer);
		};
	});

	/**
	 * The pointer aura's lerp loop.
	 *
	 * The custom properties are written on the SCOPE root, not on the aura element,
	 * because momentum.css declares their defaults there (`.mo-scope`) and the aura
	 * inherits them — writing on the root keeps one authority for the value.
	 *
	 * The loop stops itself once the cursor has settled and restarts on the next
	 * pointermove, rather than burning a requestAnimationFrame forever while the
	 * page sits idle (project-alpha's equivalent loop, CinematicDirector.svelte:472-478,
	 * never stops; this is a deliberate improvement, not a copy).
	 */
	const pointerAura: Attachment<HTMLElement> = (node) => {
		const scope = node.closest<HTMLElement>('.mo-scope') ?? node;
		let currentX = window.innerWidth * 0.5;
		let currentY = window.innerHeight * 0.5;
		let targetX = currentX;
		let targetY = currentY;
		let frame = 0;

		const step = () => {
			const dx = targetX - currentX;
			const dy = targetY - currentY;
			currentX += dx * 0.13;
			currentY += dy * 0.13;
			scope.style.setProperty('--mo-pointer-x', `${currentX}px`);
			scope.style.setProperty('--mo-pointer-y', `${currentY}px`);
			// Settled: park the loop. `frame = 0` is what lets movePointer restart it.
			if (Math.abs(dx) < 0.15 && Math.abs(dy) < 0.15) {
				frame = 0;
				return;
			}
			frame = requestAnimationFrame(step);
		};

		const movePointer = (event: PointerEvent) => {
			targetX = event.clientX;
			targetY = event.clientY;
			if (!frame) frame = requestAnimationFrame(step);
		};

		window.addEventListener('pointermove', movePointer, { passive: true });

		return () => {
			window.removeEventListener('pointermove', movePointer);
			if (frame) cancelAnimationFrame(frame);
			scope.style.removeProperty('--mo-pointer-x');
			scope.style.removeProperty('--mo-pointer-y');
		};
	};

	/**
	 * The cross-section choreography.
	 *
	 * Written as an $effect keyed on `reduced` so a mid-session preference flip tears
	 * everything down through ctx.revert() and rebuilds (or stays torn down). Every
	 * trigger is created inside ONE gsap.context().
	 *
	 * Selector strings resolve against the live DOM at creation time. That is safe
	 * here: a Svelte component's children are created during the render pass, before
	 * any effect runs, so all six sections' elements already exist when this effect
	 * first executes. Every lookup is still length-checked, so a section being
	 * removed later can never throw.
	 */
	$effect(() => {
		if (reduced) return;

		const gsap = ensureGsap();
		let cancelled = false;
		let resetSkew: (() => void) | undefined;
		let skewTargets: HTMLElement[] = [];

		const ctx = gsap.context(() => {
			/* ----------------------------------------------------------------
			   BEAT 1, tail — VELOCITY-LINKED SKEW on the two doors.
			   The only piece of Beat 1 that is not section-local: it reads the
			   page's scroll velocity, which no per-card trigger can. Hard-capped
			   at +/-6deg so it reads as weight rather than as a gimmick, and the
			   divisor is negative so the cards lean INTO the direction of travel.
			   `overwrite: 'auto'` is per-property in GSAP 3, so it only ever kills
			   another skewY tween — never Paths' own x / rotate / opacity / filter
			   entrance, and never tilt()'s rotationX / rotationY.
			   ---------------------------------------------------------------- */
			const paths = document.getElementById('paths');
			const cards = paths
				? gsap.utils.toArray<HTMLElement>(paths.querySelectorAll('.mo-paths__card'))
				: [];
			if (paths && cards.length) {
				skewTargets = cards;
				ScrollTrigger.create({
					trigger: paths,
					start: 'top bottom',
					end: 'bottom top',
					onUpdate: (self) => {
						const skewY = gsap.utils.clamp(-6, 6, self.getVelocity() / -260);
						gsap.to(cards, { skewY, duration: 0.5, ease: 'power3', overwrite: 'auto' });
					}
				});
				resetSkew = () => {
					gsap.to(cards, { skewY: 0, duration: 0.5, ease: 'power3', overwrite: 'auto' });
				};
			}

			/* ----------------------------------------------------------------
			   BEAT 4 — CLOSE. The page bookends itself.

			   The plate wipes open from the CENTRE OUT, deliberately mirroring the
			   Overture's left-to-right chrome wipe (Overture.svelte:126-131). Only
			   `clip-path` is animated here: Close.svelte already attaches
			   parallax(-40) to this same element, which owns its transform, and two
			   writers on one transform is a real defect.
			   ---------------------------------------------------------------- */
			const close = document.getElementById('close');
			const plate = close?.querySelector<HTMLImageElement>('.mo-close__plate');
			if (close && plate) {
				gsap.fromTo(
					plate,
					{ clipPath: 'inset(0% 50% 0% 50%)' },
					{
						clipPath: 'inset(0% 0% 0% 0%)',
						duration: 1.1,
						ease: 'expo.inOut',
						// The plate is fully visible until the trigger fires; nothing can
						// leave it clipped if the tween is never reached.
						immediateRender: false,
						// Drop the clip once it is at rest: no lingering compositing layer.
						onComplete: () => gsap.set(plate, { clipPath: 'none' }),
						scrollTrigger: { trigger: close, start: 'top 78%', once: true }
					}
				);
			}

			/* The two destinations arrive scattered and lock into the row. They carry
			   no magnetic() (Close deliberately omits it), so `x` is free here. */
			const closeCtas = close
				? gsap.utils.toArray<HTMLElement>(close.querySelectorAll('.mo-close__cta'))
				: [];
			if (closeCtas.length) {
				gsap.fromTo(
					closeCtas,
					{
						x: (i: number) => (i === 0 ? -40 : 40),
						rotate: (i: number) => (i === 0 ? -3 : 3),
						opacity: 0
					},
					{
						x: 0,
						rotate: 0,
						opacity: 1,
						duration: 0.9,
						ease: 'expo.out',
						stagger: 0.09,
						immediateRender: false,
						onComplete: () => gsap.set(closeCtas, { clearProps: 'willChange' }),
						scrollTrigger: { trigger: close, start: 'top 78%', once: true }
					}
				);
			}
		});

		if (resetSkew) ScrollTrigger.addEventListener('scrollEnd', resetSkew);

		/* Measure once the layout has settled, and again once the display face has
		   swapped in. The site layout refreshes on fonts.ready too
		   (+layout.svelte:33-41), but that effect runs once for the whole app — on a
		   client-side navigation to /momentum it has already fired long before this
		   page's triggers exist, so this refresh is not a duplicate. */
		const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
		const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
		fonts?.ready
			.then(() => {
				if (!cancelled) ScrollTrigger.refresh();
			})
			.catch(() => {});

		return () => {
			cancelled = true;
			cancelAnimationFrame(frame);
			if (resetSkew) ScrollTrigger.removeEventListener('scrollEnd', resetSkew);
			// The per-update skew tweens are created after the context was built, so
			// they are not in its recording; clear the property explicitly.
			if (skewTargets.length) gsap.set(skewTargets, { clearProps: 'skewY' });
			ctx.revert();
		};
	});
</script>

<!--
	The aura is momentum.css's `.mo-scope .mo-aura` rule (position: fixed; z-index: -1
	inside the scope's own stacking context). It is rendered only where it can mean
	something — a fine pointer, with motion allowed — so it is never a static blob on
	a touch device.
-->
{#if auraOn}
	<div class="mo-aura" aria-hidden="true" {@attach pointerAura}></div>
{/if}

<!--
	The chapter rail. Decorative and aria-hidden: it is a position readout, not
	navigation — the real navigation is the page itself and the Overture's cue. It is
	non-interactive by construction (no anchors, no buttons), so hiding it from
	assistive technology removes nothing a keyboard or screen-reader user could use.

	IT CARRIES NO NUMERAL, deliberately. It used to render a two-digit index 01..06,
	one per section in SECTION_IDS, revealed on the active stop. That put a second,
	incompatible numbering system on screen beside the section heads, which count the
	page's two titled beats as "01 / 02" (Paths) and "02 / 02" (Ledger): at desktop
	widths a reader saw the rail say 04 while the head next to it said 02 / 02. The
	counter that contradicted the content was the rail's, so the rail's is the one
	that went. One dot per section still reports position without asserting a count.
-->
<aside class="mo-rail" aria-hidden="true" style:--mo-rail-progress={ui.scrollProgress}>
	<div class="mo-rail__track">
		<span class="mo-rail__fill"></span>
		{#each SECTION_IDS as id (id)}
			<span class="mo-rail__item" class:is-active={ui.activeSection === id}>
				<span class="mo-rail__dot"></span>
			</span>
		{/each}
	</div>
</aside>

<style>
	/* Z-INDEX BUDGET (from the direction brief): the site header is 100 and the
	   mobile menu is 99, so every fixed layer this page creates stays below them.
	   The rail sits at 40 INSIDE `.mo-scope`, whose own `isolation: isolate` and
	   `z-index: 1` (momentum.css) mean it can never paint over the header. */
	.mo-rail {
		position: fixed;
		z-index: 40;
		top: 50%;
		right: 1.5rem;
		transform: translateY(-50%);
		/* Shown only on large desktop — 1280px is the repo's canonical breakpoint
		   (app.css:60-66). Below that the rail would compete with content. */
		display: none;
		pointer-events: none;
	}

	.mo-rail__track {
		position: relative;
		display: grid;
		gap: 0.7rem;
		justify-items: end;
		padding-right: 4px;
	}

	/* The spine, and the travelled portion of it. */
	.mo-rail__track::before {
		content: '';
		position: absolute;
		top: 4px;
		right: 0;
		bottom: 4px;
		width: 1px;
		background: var(--tt-line-strong);
	}

	/* The ONLY consumer of ui.scrollProgress on this page: the fill is scaled from
	   the top by document progress, so the rail doubles as a reading gauge. */
	.mo-rail__fill {
		position: absolute;
		top: 4px;
		right: 0;
		bottom: 4px;
		width: 1px;
		background: linear-gradient(180deg, var(--mo-cyan), var(--mo-cyan-glow));
		transform: scaleY(var(--mo-rail-progress, 0));
		transform-origin: top center;
	}

	.mo-rail__item {
		display: inline-flex;
		align-items: center;
		/* `color` is not text here — the dot below draws its ring from currentColor,
		   so this is the resting ring colour and the active rule below is the lit one.
		   --tt-mute-2 (#80828e, app.css:34-35) is the repo's mid grey, which is the
		   reason it works for a rail that floats over both the black bands and the
		   white Voice band. */
		color: var(--tt-mute-2);
		transition:
			color 0.45s var(--mo-ease-expo),
			transform 0.55s var(--mo-ease-expo);
	}

	.mo-rail__item.is-active {
		color: var(--tt-white);
		transform: translateX(-5px);
	}

	.mo-rail__dot {
		position: relative;
		z-index: 1;
		width: 7px;
		height: 7px;
		border: 1px solid currentColor;
		border-radius: 50%;
		background: var(--tt-black);
		transition:
			background 0.35s ease,
			border-color 0.35s ease,
			box-shadow 0.35s ease;
	}

	/* Cyan marks position, matching the page's interaction colour (momentum.css uses
	   it for :focus-visible). It is a 7px dot, not a wash. */
	.mo-rail__item.is-active .mo-rail__dot {
		background: var(--mo-cyan);
		border-color: var(--mo-cyan);
		box-shadow: 0 0 12px rgb(var(--mo-cyan-rgb) / 0.65);
	}

	@media (min-width: 1280px) {
		.mo-rail {
			display: block;
		}
	}
</style>
