<script lang="ts">
	/**
	 * /momentum-course — the page-level cinematographer.
	 *
	 * WHAT THIS FILE OWNS, AND ONLY THIS:
	 *   1. GLOBAL TIME. `gsap.globalTimeline.timeScale(0.86)`, restored to the
	 *      SAVED value on teardown — not to 1, which would leave the rest of the
	 *      site running at whatever this page happened to assume.
	 *   2. THE INTRO FILM, once per browser session. It plays, or it is skipped,
	 *      but either way it ALWAYS ends by adding `mc-intro-done` to <html> and
	 *      dispatching `mc:intro-complete`, so nothing downstream can be gated
	 *      behind a film that never plays. The contract's three strings live in
	 *      course-signals.ts; nobody retypes them.
	 *   3. THE POINTER AURA, rendered only where it can mean something: a fine
	 *      pointer, with motion allowed. Its rAF loop PARKS itself once the
	 *      cursor has settled and restarts on the next pointermove, rather than
	 *      burning a frame forever like project-alpha's equivalent
	 *      (CinematicDirector.svelte:472-478) does.
	 *   4. THE CHAPTER RAIL, and this is where the page goes past project-alpha
	 *      rather than matching it: alpha's rail is `aria-hidden` and
	 *      non-interactive (CinematicDirector.svelte:558), a readout only. This
	 *      one is a real <nav> of six <button>s that scroll to their section
	 *      through Lenis-aware `scrollToId`, are reachable by keyboard, and carry
	 *      `aria-current` on the active stop.
	 *   5. THE SECTION SPY that feeds it, on its own rAF-throttled passive scroll
	 *      listener.
	 *   6. ScrollTrigger.refresh() after mount and again on `document.fonts.ready`
	 *      — Allerta Stencil changes heading heights, so every trigger built
	 *      before the swap was measured against fallback metrics.
	 *
	 * WHAT THIS FILE DELIBERATELY DOES NOT OWN, so that nothing is written twice:
	 *   - The reduced-motion sync, the Lenis lifecycle and `ui.scrollProgress`
	 *     belong to the ROUTE's $effect (routes/momentum-course/+page.svelte:40-64),
	 *     which already writes all three. Tying them to the route keeps their
	 *     lifetime exactly equal to the page's.
	 *   - PER-SECTION CHOREOGRAPHY belongs to each section component, which is
	 *     the only writer of its own elements' transforms — the same split as
	 *     /momentum's Director (momentum/motion/Director.svelte:30-49). This file
	 *     creates NO ScrollTrigger of its own, which is also why it needs no
	 *     scroll-driven gsap.context: the only timeline it builds is the intro,
	 *     and that one is wrapped in a context so revert() can clean up after it.
	 *
	 * REDUCED MOTION, the honest answer at every beat: no film (and no overlay in
	 * the DOM at all), no aura element, no timeScale change, no rAF loop, no
	 * refresh. The rail still renders, still tracks and still navigates, and
	 * `scrollToId` falls back to `behavior: 'auto'` on its own
	 * (momentum/motion/smooth-scroll.ts:95-96).
	 */
	import { onMount } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import { browser } from '$app/env';
	import { ui } from '$lib/pages/momentum/state/ui.svelte';
	import { ensureGsap, ScrollTrigger } from '$lib/pages/momentum/motion/gsap-setup';
	import { scrollToId } from '$lib/pages/momentum/motion/smooth-scroll';
	import {
		COURSE_INTRO_CLASS,
		COURSE_INTRO_EVENT,
		COURSE_INTRO_KEY,
		COURSE_SECTIONS,
		pickActiveSection,
		type CourseSectionId
	} from './course-signals';
	import '../course.css';

	const matches = (q: string) => (browser ? window.matchMedia(q).matches : false);

	/**
	 * Read at component INIT, and OR-ed with the store rather than trusting it:
	 * the route's $effect is the only writer of `ui.reducedMotion` and it can run
	 * after this component initialises — the bug documented at
	 * project-alpha/viz/NeuroTradeHud.svelte:19-27.
	 */
	let systemReduced = $state(matches('(prefers-reduced-motion: reduce)'));
	let finePointer = $state(matches('(hover: hover) and (pointer: fine)'));

	const reduced = $derived(systemReduced || ui.reducedMotion);
	const auraOn = $derived(finePointer && !reduced);

	/**
	 * The rail is client-only. Its buttons do nothing without JavaScript, and
	 * server-rendering six inert controls into the accessibility tree would be
	 * offering navigation that cannot navigate.
	 */
	let mounted = $state(false);

	/**
	 * 'idle' until mount decides; then either 'play' (the film is in the DOM and
	 * running) or 'done' (it never rendered, or it has finished). It only ever
	 * moves forwards.
	 */
	let introPhase = $state<'idle' | 'play' | 'done'>('idle');
	let introRoot = $state<HTMLDivElement | undefined>(undefined);

	let active = $state<CourseSectionId>(COURSE_SECTIONS[0].id);

	const captureIntro: Attachment<HTMLDivElement> = (node) => {
		introRoot = node;
		return () => {
			if (introRoot === node) introRoot = undefined;
		};
	};

	/*
	 * sessionStorage throws rather than returning null in a few real
	 * configurations (Safari private browsing, third-party iframe with storage
	 * partitioned off). A film that plays twice is a far smaller problem than a
	 * page that fails to mount, so a storage failure is treated as "not seen"
	 * and is confined to these two helpers — nothing else here touches storage.
	 */
	function introAlreadySeen(): boolean {
		try {
			return sessionStorage.getItem(COURSE_INTRO_KEY) === '1';
		} catch {
			return false;
		}
	}
	function markIntroSeen() {
		try {
			sessionStorage.setItem(COURSE_INTRO_KEY, '1');
		} catch {
			/* storage unavailable; the film simply plays again next visit */
		}
	}

	let introFrame = 0;

	/**
	 * The single exit from the film, whichever way it ended: finished, skipped by
	 * the visitor, or never started.
	 *
	 * The <html> class is added SYNCHRONOUSLY and the event is dispatched on the
	 * next frame, and that ordering is the whole contract. Svelte mounts siblings
	 * in creation order, so this component — rendered above the sections — has
	 * already run its onMount by the time MomentumHero runs its own; a listener
	 * attached there would miss a synchronous dispatch. Setting the class first
	 * means the hero's rAF fallback sees a page that is already clear, and the
	 * one-frame-later event catches any listener attached in the same tick.
	 */
	function finishIntro() {
		if (introPhase === 'done') return;
		introPhase = 'done';
		document.documentElement.classList.add(COURSE_INTRO_CLASS);
		if (introFrame) cancelAnimationFrame(introFrame);
		introFrame = requestAnimationFrame(() => {
			introFrame = 0;
			window.dispatchEvent(new CustomEvent(COURSE_INTRO_EVENT));
			ScrollTrigger.refresh();
		});
	}

	onMount(() => {
		const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
		const pointerMq = window.matchMedia('(hover: hover) and (pointer: fine)');
		// Re-read after mount: the server rendered with both at their `false` fallback.
		systemReduced = motionMq.matches;
		finePointer = pointerMq.matches;

		const onMotion = () => (systemReduced = motionMq.matches);
		const onPointer = () => (finePointer = pointerMq.matches);
		motionMq.addEventListener('change', onMotion);
		pointerMq.addEventListener('change', onPointer);

		/* ---- the section spy -------------------------------------------------
		   Not gated on motion: the rail must track for a reduced-motion visitor
		   too. One rAF in flight at a time, so a fast scroll cannot queue a
		   backlog of reads. */
		let spyFrame = 0;
		const readSpy = () => {
			spyFrame = 0;
			active = pickActiveSection() ?? COURSE_SECTIONS[0].id;
		};
		const onScroll = () => {
			if (!spyFrame) spyFrame = requestAnimationFrame(readSpy);
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll, { passive: true });
		readSpy();

		mounted = true;

		// Decide the film only now: sessionStorage does not exist on the server.
		if (systemReduced || ui.reducedMotion || introAlreadySeen()) {
			finishIntro();
		} else {
			markIntroSeen();
			introPhase = 'play';
		}

		return () => {
			motionMq.removeEventListener('change', onMotion);
			pointerMq.removeEventListener('change', onPointer);
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
			if (spyFrame) cancelAnimationFrame(spyFrame);
			if (introFrame) cancelAnimationFrame(introFrame);
			document.documentElement.classList.remove(COURSE_INTRO_CLASS);
		};
	});

	/**
	 * B0 — GLOBAL TIME, and the two refreshes.
	 *
	 * Keyed on `reduced`, so a mid-session preference flip restores normal time
	 * and stops refreshing. `previous` is read immediately before the write and
	 * restored in the teardown, and Svelte runs a teardown before it re-runs the
	 * effect, so a flip can never save the already-slowed value and strand the
	 * site at 0.86.
	 */
	$effect(() => {
		if (reduced) return;

		const gsap = ensureGsap();
		const previous = gsap.globalTimeline.timeScale();
		// 0.86, INHERITED in spirit from project-alpha's 0.82
		// (CinematicDirector.svelte:38) and deliberately a little less heavy:
		// this page's spine is a syllabus that has to stay readable while it moves.
		gsap.globalTimeline.timeScale(0.86);

		let cancelled = false;
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
			gsap.globalTimeline.timeScale(previous);
		};
	});

	/**
	 * B1 — THE INTRO FILM.
	 *
	 * 2.3s end to end, and skippable at any point by scrolling, tapping or
	 * pressing a key. The skip kills the timeline and calls the same
	 * `finishIntro()` the onComplete would have, rather than seeking the timeline
	 * to its end and relying on GSAP's suppressEvents semantics to fire a
	 * callback — a skip must be deterministic.
	 */
	$effect(() => {
		if (introPhase !== 'play' || !introRoot) return;

		const gsap = ensureGsap();
		const root = introRoot;
		let skip = () => {};

		const ctx = gsap.context(() => {
			const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: finishIntro });

			tl.fromTo(
				root.querySelector('.mci-scan'),
				{ scaleX: 0, transformOrigin: 'left center' },
				{ scaleX: 1, duration: 0.66, ease: 'expo.inOut' }
			)
				.from(
					root.querySelectorAll('.mci-word'),
					{ yPercent: 106, opacity: 0, duration: 0.8, stagger: 0.1, immediateRender: false },
					0.15
				)
				.from(
					root.querySelector('.mci-meta'),
					{ opacity: 0, letterSpacing: '0.5em', duration: 0.55, immediateRender: false },
					0.42
				)
				.to(root, { clipPath: 'inset(0 0 100% 0)', duration: 0.85, ease: 'expo.inOut' }, '+=0.30');

			skip = () => {
				tl.kill();
				finishIntro();
			};
		}, root);

		const onSkip = () => skip();
		window.addEventListener('wheel', onSkip, { passive: true, once: true });
		window.addEventListener('touchstart', onSkip, { passive: true, once: true });
		window.addEventListener('pointerdown', onSkip, { once: true });
		window.addEventListener('keydown', onSkip, { once: true });

		return () => {
			window.removeEventListener('wheel', onSkip);
			window.removeEventListener('touchstart', onSkip);
			window.removeEventListener('pointerdown', onSkip);
			window.removeEventListener('keydown', onSkip);
			ctx.revert();
		};
	});

	/**
	 * B3 — THE POINTER AURA's lerp loop.
	 *
	 * The custom properties are written on the aura element itself, not on
	 * <html>: it is their only consumer, and a property written on the document
	 * root would survive a client-side navigation to another route.
	 */
	const pointerAura: Attachment<HTMLElement> = (node) => {
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
			node.style.setProperty('--mc-pointer-x', `${currentX}px`);
			node.style.setProperty('--mc-pointer-y', `${currentY}px`);
			// Settled: park. `frame = 0` is what lets movePointer restart it.
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
		};
	};
</script>

<!--
	The film. It is rendered only when it will actually play, so a reduced-motion
	visitor, a repeat visit within the session and a no-JS visitor never get a
	full-bleed overlay in the document at all. It is `pointer-events: none`, so
	even mid-play the page underneath stays operable.

	The only words on it are "Momentum." (the hero's own h1, MomentumHero.svelte:37)
	and "Flagship coaching" (the hero's own kicker, MomentumHero.svelte:28). No new
	copy, no figure, no claim.
-->
{#if introPhase === 'play'}
	<div class="mc-intro" {@attach captureIntro} aria-hidden="true">
		<div class="mc-intro__copy">
			<p class="mci-meta">Flagship coaching</p>
			<p class="mc-intro__statement">
				<span class="mc-intro__mask"><span class="mci-word">Momentum.</span></span>
			</p>
			<span class="mci-scan"></span>
		</div>
	</div>
{/if}

{#if auraOn}
	<div class="mc-aura" aria-hidden="true" {@attach pointerAura}></div>
{/if}

<!--
	The chapter rail: real navigation, not a readout. Six buttons, one per
	section, each scrolling through Lenis-aware `scrollToId` (never `jumpTo`,
	which starts a second native smooth-scroll animation alongside Lenis' own —
	momentum/motion/smooth-scroll.ts:73-79 states exactly that).

	The numeral and the dot are decorative and hidden from assistive technology;
	the accessible name comes from `aria-label`, so the stop is announced by its
	full label whether or not the label is visually revealed.
-->
{#if mounted && introPhase !== 'play'}
	<nav class="mc-rail" aria-label="Page sections" style:--mc-rail-progress={ui.scrollProgress}>
		<span class="mc-rail__track" aria-hidden="true"><span class="mc-rail__fill"></span></span>
		<ul class="mc-rail__list">
			{#each COURSE_SECTIONS as section (section.id)}
				<li class="mc-rail__item">
					<button
						type="button"
						class="mc-rail__stop"
						class:is-active={active === section.id}
						aria-label={section.label}
						aria-current={active === section.id ? 'true' : undefined}
						onclick={() => scrollToId(section.id, 84)}
					>
						<span class="mc-rail__label" aria-hidden="true">{section.label}</span>
						<span class="mc-rail__n" aria-hidden="true">{section.n}</span>
						<span class="mc-rail__dot" aria-hidden="true"></span>
					</button>
				</li>
			{/each}
		</ul>
	</nav>
{/if}

<style>
	/* ==================================================================
	   THE INTRO FILM
	   ================================================================== */

	.mc-intro {
		position: fixed;
		inset: 0;
		/* Below the site header (100) and the mobile menu (99) by design — see
		   the z-index budget in course.css. */
		z-index: var(--mc-z-intro);
		display: grid;
		place-items: center;
		overflow: hidden;
		/* Never a toll booth: the page underneath stays clickable and scrollable
		   for the 2.3s the film runs. */
		pointer-events: none;
		/* CAPTURED: --tt-black is #0a0a0b (app.css:23), the page's own ground. */
		background: var(--tt-black);
		/* The end state of the wipe is `inset(0 0 100% 0)`; declaring the start
		   here means GSAP animates a property that already has a value. */
		clip-path: inset(0);
	}

	.mc-intro__copy {
		position: relative;
		width: min(980px, calc(100% - 2rem));
		text-align: center;
	}

	.mci-meta {
		margin: 0 0 0.9rem;
		/* INHERITED from the site's `.label` utility (app.css:228-234): same mono
		   face, same uppercase, same mute. The tracking is 0.28em there too — it
		   is restated rather than composed because the film animates it from
		   0.5em and the tween needs an explicit resting value to land on. */
		font-family: var(--tt-font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.28em;
		text-transform: uppercase;
		color: var(--tt-mute);
	}

	.mc-intro__statement {
		margin: 0;
		/* CAPTURED from the hero's own title rule (MomentumHero.svelte:105-112),
		   so the film's word and the h1 it hands over to are the same lockup. */
		font-size: var(--fs-mega);
		font-weight: 800;
		line-height: 0.86;
		letter-spacing: -0.04em;
		color: var(--tt-white);
	}

	/* The mask the word rises out of. `overflow: clip` plus the padding/negative
	   margin pair is the repo's existing mask idiom (app.css:220-223 for
	   SplitText, CinematicDirector.svelte:625-631 for alpha's intro): the padding
	   keeps descenders and the letter-spacing overhang from being sheared, and
	   the equal negative margin takes the space back out of the layout. */
	.mc-intro__mask {
		display: inline-block;
		overflow: clip;
		padding: 0.14em 0.08em 0.18em;
		margin: -0.14em -0.08em -0.18em;
	}

	.mci-word {
		display: block;
	}

	.mci-scan {
		display: block;
		width: min(420px, 70%);
		height: 1px;
		margin: 1.3rem auto 0;
		background: linear-gradient(90deg, transparent, var(--tt-red-bright), transparent);
		box-shadow: 0 0 16px rgb(var(--tt-red-bright-rgb) / 0.55);
	}

	/* ==================================================================
	   THE POINTER AURA
	   ================================================================== */

	.mc-aura {
		position: fixed;
		z-index: var(--mc-z-aura);
		left: var(--mc-pointer-x);
		top: var(--mc-pointer-y);
		width: 46vw;
		height: 46vw;
		border-radius: 50%;
		transform: translate(-50%, -50%);
		background: radial-gradient(circle, rgb(var(--tt-red-rgb) / 0.1), transparent 68%);
		/* Screen can only lighten, so white body text is left exactly as it was
		   and only the dark ground lifts. That is what makes it safe above the
		   content rather than behind it. */
		mix-blend-mode: screen;
		pointer-events: none;
	}

	/* ==================================================================
	   THE CHAPTER RAIL
	   ================================================================== */

	.mc-rail {
		position: fixed;
		z-index: var(--mc-z-rail);
		top: 50%;
		right: 1.5rem;
		transform: translateY(-50%);
		/* Shown only on large desktop. 1280px is the repo's canonical breakpoint
		   (app.css:60-66); below it the rail would compete with the content it is
		   supposed to index, and every stop it offers is reachable by scrolling. */
		display: none;
	}

	/* The spine, aligned to the centre of the 7px dots. */
	.mc-rail__track {
		position: absolute;
		top: 6px;
		bottom: 6px;
		right: 3px;
		width: 1px;
		background: var(--tt-line-strong);
	}

	/* The travelled portion. This is the page's ONLY consumer of
	   `ui.scrollProgress`, which the route has been computing since it was built
	   and which nothing has read until now. */
	.mc-rail__fill {
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, var(--tt-red), var(--tt-red-bright));
		transform: scaleY(var(--mc-rail-progress, 0));
		transform-origin: top center;
	}

	.mc-rail__list {
		position: relative;
		display: grid;
		gap: 0.7rem;
		justify-items: end;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.mc-rail__item {
		display: flex;
	}

	.mc-rail__stop {
		position: relative;
		display: grid;
		/* Two columns only. The label is absolutely positioned out to the left, so
		   the button's hit area stays a narrow strip and the rail cannot swallow
		   clicks meant for the content beside it. */
		grid-template-columns: 1.7rem 7px;
		align-items: center;
		gap: 0.5rem;
		padding: 0;
		/* `color` is not text here: the dot draws its ring from currentColor, so
		   this is the resting ring colour. --tt-mute-2 (app.css:35) is the repo's
		   AA-verified mid grey. */
		color: var(--tt-mute-2);
		transition:
			color 0.45s var(--mc-ease-expo),
			transform 0.55s var(--mc-ease-expo);
	}

	.mc-rail__stop.is-active {
		color: var(--tt-white);
		transform: translateX(-5px);
	}

	.mc-rail__label {
		position: absolute;
		right: calc(100% + 0.55rem);
		top: 50%;
		font-family: var(--tt-font-mono);
		font-size: 0.58rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		white-space: nowrap;
		color: var(--tt-fog);
		opacity: 0;
		transform: translate(-6px, -50%);
		transition:
			opacity 0.35s ease,
			transform 0.35s var(--mc-ease-expo);
	}

	.mc-rail__stop:hover .mc-rail__label,
	.mc-rail__stop:focus-visible .mc-rail__label,
	.mc-rail__stop.is-active .mc-rail__label {
		opacity: 1;
		transform: translate(0, -50%);
	}

	.mc-rail__n {
		font-family: var(--tt-font-mono);
		font-size: 0.58rem;
		font-variant-numeric: tabular-nums;
		text-align: right;
	}

	.mc-rail__dot {
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

	.mc-rail__stop.is-active .mc-rail__dot {
		background: var(--tt-red-bright);
		border-color: var(--tt-red-bright);
		box-shadow: 0 0 12px rgb(var(--tt-red-bright-rgb) / 0.6);
	}

	@media (min-width: 1280px) {
		.mc-rail {
			display: block;
		}
	}
</style>
