<script lang="ts">
	/**
	 * /momentum-course — THE HERO. Rail stop 01 (`mo-hero`).
	 *
	 * WHAT CHANGED, AND WHY.
	 *
	 * 1. IT IS ONE CUT, NOT THREE FADES. The kicker, the headline, the lede, the
	 *    CTA row and the three figures used to arrive from three unrelated
	 *    attachments (`reveal` on a wrapper, `splitReveal` on the h1, `counter` on
	 *    each figure), each with its own ScrollTrigger and its own idea of when
	 *    "now" was. They are now ONE timeline with explicit positions, so the beat
	 *    is composed rather than coincidental.
	 *
	 * 2. IT WAITS FOR THE FILM. CourseDirector plays a 2.3s intro once per session
	 *    over the whole page. A hero that plays underneath an opaque overlay has
	 *    played to nobody, so this timeline is built only on the intro handshake —
	 *    `mc:intro-complete`, or the `mc-intro-done` class if the event already
	 *    went past (motion/course-signals.ts:95-114 defines both). Same
	 *    belt-and-braces shape as project-alpha/sections/Hero.svelte:104-107.
	 *
	 * 3. THE TWO SCROLL SCRUBS ARE BORN DISABLED. A scrubbed exit that is live
	 *    while the entrance is still running fights it for the same properties.
	 *    They are enabled and refreshed in the entrance's own onComplete.
	 *
	 * 4. counter() IS GONE FROM THE FIGURES. Counting 0 -> 115 renders every
	 *    intermediate number on screen; each of those is a figure the evidence does
	 *    not contain (the same rule content.ts:294-295 already states for the
	 *    Ledger's ticks). The three figures now print their captured values and are
	 *    animated as objects instead.
	 *
	 * 5. NO HARDCODED FACTS. The three figures and their labels come from
	 *    `ledger.breakdown.items` (content.ts:342-349, each line carrying its
	 *    locator in the live capture) and the enrolment href from `links.course`
	 *    (content.ts:181), instead of being retyped here.
	 *
	 * REDUCED MOTION. `.js` is never added to <html> (app.html:16-22), so every
	 * [data-anim]/[data-split] element sits at its CSS resting state and is fully
	 * visible. No timeline is built, no ScrollTrigger is created, `splitReveal` and
	 * `parallax` both return immediately (motion.ts:107, 168) and CorridorScene
	 * composes a single still frame (CorridorScene.svelte:32-33). The CTA is
	 * reachable the moment the page paints.
	 */
	import { onMount } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import Button from '$lib/components/Button.svelte';
	import { splitReveal, parallax } from '$lib/motion';
	import LightningIcon from 'phosphor-svelte/lib/LightningIcon';
	import CorridorScene from '$lib/pages/momentum/viz/CorridorScene.svelte';
	import { ledger, links } from '$lib/pages/momentum/data/content';
	import { ui } from '$lib/pages/momentum/state/ui.svelte';
	import { ensureGsap } from '$lib/pages/momentum/motion/gsap-setup';
	import { jumpToId } from '$lib/pages/momentum/motion/smooth-scroll';
	import {
		COURSE_INTRO_CLASS,
		COURSE_INTRO_EVENT
	} from '$lib/pages/momentum-course/motion/course-signals';

	/**
	 * Read at INIT and OR-ed with the store, never trusting the store alone: the
	 * route's $effect is the only writer of `ui.reducedMotion` and it can run after
	 * this component initialises — the bug documented at
	 * project-alpha/viz/NeuroTradeHud.svelte:19-27.
	 */
	let systemReduced = $state(
		typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
	);
	const reduced = $derived(systemReduced || ui.reducedMotion);

	/** Flipped once the intro film has finished, been skipped, or never existed. */
	let heroReady = $state(false);

	let root = $state<HTMLElement | undefined>(undefined);
	const captureRoot: Attachment<HTMLElement> = (node) => {
		root = node;
		return () => {
			if (root === node) root = undefined;
		};
	};

	onMount(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		systemReduced = mq.matches;
		const onMotion = () => (systemReduced = mq.matches);
		mq.addEventListener('change', onMotion);

		const start = () => (heroReady = true);

		/*
		 * With motion off there is no film to wait for and no `.js` gate hiding
		 * anything, so the handshake is skipped entirely rather than being made a
		 * precondition of a hero that is already at rest.
		 */
		if (mq.matches) {
			start();
			return () => mq.removeEventListener('change', onMotion);
		}

		window.addEventListener(COURSE_INTRO_EVENT, start, { once: true });

		let failsafe = 0;

		/*
		 * ONE FRAME LATER, EVERY CASE IS DECIDABLE. Both onMounts on the page have
		 * run and Svelte has flushed their state, so by now:
		 *
		 *   - the class is on <html>  -> the handshake already went past (repeat
		 *     visit, or reduced motion): catch up and start now;
		 *   - `.mc-intro` is rendered -> the film IS playing: wait for the event,
		 *     with a backstop past its worst case (2.3s of timeline at the
		 *     director's 0.86 global timeScale = 2.67s, plus a frame);
		 *   - neither                 -> there is no director on this route, so
		 *     nothing will ever dispatch. With `.js` on <html> every [data-anim]
		 *     element here is opacity:0 until the timeline runs, so waiting would
		 *     mean a blank hero. Start immediately instead.
		 *
		 * The listener is still live in the middle case AND in the last one, so a
		 * director that turns up late is still honoured — the timeline is built
		 * once, by whichever path gets there first.
		 */
		const frame = requestAnimationFrame(() => {
			if (document.documentElement.classList.contains(COURSE_INTRO_CLASS)) {
				window.removeEventListener(COURSE_INTRO_EVENT, start);
				start();
				return;
			}
			if (document.querySelector('.mc-intro')) {
				failsafe = window.setTimeout(start, 3400);
				return;
			}
			start();
		});

		return () => {
			mq.removeEventListener('change', onMotion);
			window.removeEventListener(COURSE_INTRO_EVENT, start);
			cancelAnimationFrame(frame);
			if (failsafe) clearTimeout(failsafe);
		};
	});

	/**
	 * THE ENTRANCE.
	 *
	 * Every tween is a fromTo with `immediateRender: false`, which is what lets the
	 * CSS gate (`.js [data-anim] { opacity: 0 }`, app.css:210-215) hold each
	 * element invisible until its own beat starts instead of GSAP flashing an end
	 * state first.
	 *
	 * The positions are absolute seconds, re-timed from the direction brief's
	 * relative offsets: read literally they resolved against the 2.0s background
	 * tween and pushed the CTA to ~2.9s, which — stacked on top of the 2.7s film —
	 * put the page's primary action nearly six seconds from load. The shape and the
	 * order are the brief's; only the clock is tightened.
	 */
	$effect(() => {
		if (reduced || !heroReady || !root) return;

		const gsap = ensureGsap();
		const el = root;

		const ctx = gsap.context(() => {
			const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

			tl.fromTo(
				'.mo-hero__bg',
				{ opacity: 0, scale: 1.05 },
				{ opacity: 1, scale: 1, duration: 2, immediateRender: false },
				0
			)
				.fromTo(
					'.mo-hero__kicker',
					{ opacity: 0, y: 18 },
					{ opacity: 1, y: 0, duration: 0.7, immediateRender: false },
					0.15
				)
				// 0.34 -> ~1.3s belongs to the h1: `splitReveal` owns it, attached
				// below with the matching delay. One writer per element.
				.fromTo(
					'.mo-hero__lede',
					{ opacity: 0, y: 26 },
					{ opacity: 1, y: 0, duration: 0.9, immediateRender: false },
					0.95
				)
				.fromTo(
					'.mo-hero__cta > *',
					{ opacity: 0, y: 18 },
					{ opacity: 1, y: 0, duration: 0.7, stagger: 0.1, immediateRender: false },
					1.32
				)
				.fromTo(
					'.mo-hero__stat',
					{ opacity: 0, clipPath: 'inset(0 0 100% 0)' },
					{
						opacity: 1,
						clipPath: 'inset(0 0 0% 0)',
						duration: 0.7,
						stagger: 0.08,
						immediateRender: false
					},
					1.62
				);

			/* The two scrubbed exits. Created disabled so they cannot claim
			   `.mo-hero__inner`'s y or `.mo-hero__bg`'s scale while the entrance is
			   still writing them; enabled and re-measured once it lands. */
			const copyExit = gsap.to('.mo-hero__inner', {
				yPercent: 10,
				opacity: 0.35,
				ease: 'none',
				scrollTrigger: { trigger: el, start: 'top top', end: 'bottom 12%', scrub: 1.6 }
			});
			const bgExit = gsap.to('.mo-hero__bg', {
				scale: 0.94,
				ease: 'none',
				scrollTrigger: { trigger: el, start: 'top top', end: 'bottom 12%', scrub: 1.8 }
			});
			copyExit.scrollTrigger?.disable();
			bgExit.scrollTrigger?.disable();

			tl.eventCallback('onComplete', () => {
				copyExit.scrollTrigger?.enable();
				bgExit.scrollTrigger?.enable();
				copyExit.scrollTrigger?.refresh();
				bgExit.scrollTrigger?.refresh();
			});
		}, el);

		return () => ctx.revert();
	});
</script>

<section id="mo-hero" class="mo-hero" aria-labelledby="mo-hero-title" {@attach captureRoot}>
	<div class="mo-hero__bg" data-anim aria-hidden="true">
		<div class="mo-hero__grid grid-bg"></div>
		<div class="mo-hero__glow" {@attach parallax(120)}></div>
		<!-- The 340px lightning glyph that used to sit here is gone. At 6% opacity it
		     read as a smudge, not an ornament, and it was the single least professional
		     thing on the page. The corridor carries this layer now. -->
		<CorridorScene tint="red" />
	</div>

	<div class="tt-container mo-hero__inner">
		<p class="eyebrow mo-hero__kicker" data-anim>
			<LightningIcon size={16} weight="fill" aria-hidden="true" />Flagship coaching
		</p>

		<!-- NOT GATED ON THE INTRO FILM, and that is a deliberate reversal.
		     This h1 is the LCP element. It was attached only once `heroReady` flipped
		     on the `mc:intro-complete` handshake, and `.js [data-split]` (app.css:216)
		     holds a split heading at opacity 0 until its attachment runs — so the
		     largest contentful paint could not happen until the film ended plus the
		     0.34s delay plus the 0.95s reveal. Measured on the production build that
		     was LCP 4380-4872ms, which is Google's "poor" band; with the film skipped
		     via sessionStorage the same page measured 1868ms. The film was the entire
		     cost.
		     Content does not wait on decoration. The reveal now starts on mount and
		     plays underneath the overlay, so the film wipes away to disclose a frame
		     that is already composed — which is a better cut as well as a faster one.
		     `heroReady` still gates the rest of the hero timeline below. -->
		<h1
			id="mo-hero-title"
			class="mo-hero__title"
			data-split
			{@attach splitReveal({ stagger: 0.03, delay: 0.34, duration: 0.95 })}
		>
			<span class="mo-hero__word">Momentum.</span>
		</h1>

		<div class="mo-hero__foot">
			<p class="mo-hero__lede prose" data-anim>
				The most complete program Trick Trades offers: high-level day-trading coaching with Pat
				“Trick” Mitchell. Fifteen modules and 115 video lessons that carry you from setup to
				professional execution, plus fourteen bonus lessons.
			</p>

			<div class="mo-hero__cta" data-anim-stagger>
				<Button href={links.course}>Enroll in Momentum</Button>
				<a class="mo-hero__link" href="#mo-scope" onclick={(e) => jumpToId(e, 'mo-scope')}>
					What’s inside
				</a>
			</div>

			<!-- The three certified figures, printed exactly as captured
			     (content.ts:342-349): "15 Modules", "115 Video Lessons",
			     "14 Bonus Lessons". -->
			<dl class="mo-hero__stats" data-anim-stagger>
				{#each ledger.breakdown.items as item, i (item.label)}
					<div class="mo-hero__stat" class:mo-hero__stat--ruled={i > 0}>
						<dt class="num mo-hero__stat-n">{item.figure}</dt>
						<dd class="mo-hero__stat-l">{item.label}</dd>
					</div>
				{/each}
			</dl>
		</div>
	</div>
</section>

<style>
	.mo-hero {
		position: relative;
		overflow: clip;
		padding-top: calc(var(--tt-header-h) + clamp(2.5rem, 6vw, 5rem));
		padding-bottom: clamp(3.5rem, 6vw, 6rem);
	}
	.mo-hero__bg {
		position: absolute;
		inset: 0;
		z-index: 0;
	}
	.mo-hero__grid {
		position: absolute;
		inset: -12% 0 0;
		opacity: 0.4;
	}
	.mo-hero__glow {
		position: absolute;
		top: -18%;
		right: -14%;
		width: 68vw;
		height: 68vw;
		max-width: 860px;
		max-height: 860px;
		background: radial-gradient(circle, rgb(var(--tt-red-rgb) / 0.42), transparent 62%);
		filter: blur(24px);
	}
	.mo-hero__inner {
		position: relative;
		z-index: 1;
	}
	.mo-hero__kicker {
		gap: 0.5rem;
	}
	.mo-hero__title {
		margin-top: 1.4rem;
		font-size: var(--fs-mega);
		font-weight: 800;
		line-height: 0.86;
		letter-spacing: -0.04em;
		color: #fff;
	}
	.mo-hero__word {
		display: inline-block;
	}
	.mo-hero__foot {
		display: grid;
		gap: clamp(1.8rem, 4vw, 2.6rem);
		margin-top: clamp(1.8rem, 4vw, 2.6rem);
	}
	.mo-hero__lede {
		max-width: 58ch;
	}
	.mo-hero__cta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1.4rem;
	}
	.mo-hero__link {
		display: inline-flex;
		align-items: center;
		font-family: var(--tt-font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--tt-fog);
		border-bottom: 1px solid transparent;
		transition:
			color 0.25s ease,
			border-color 0.25s ease;
	}
	.mo-hero__link:hover {
		color: #fff;
		border-color: var(--tt-line-strong);
	}
	.mo-hero__stats {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 1.4rem;
		margin: 0;
		padding-top: 1.8rem;
		border-top: 1px solid var(--tt-line);
	}
	.mo-hero__stat--ruled {
		padding-left: 1.4rem;
		border-left: 1px solid var(--tt-line-strong);
	}
	.mo-hero__stat-n {
		font-size: clamp(1.8rem, 1.2rem + 2.4vw, 3rem);
		font-weight: 800;
		line-height: 1;
		color: #fff;
	}
	.mo-hero__stat-l {
		margin-top: 0.4rem;
		font-size: 0.78rem;
		letter-spacing: 0.02em;
		color: var(--tt-mute);
	}

	@media (min-width: 1024px) {
		.mo-hero__foot {
			grid-template-columns: 1.15fr 0.85fr;
			align-items: end;
		}
		.mo-hero__stats {
			grid-column: 1 / -1;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.mo-hero__link {
			transition: none;
		}
	}
</style>
