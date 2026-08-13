<script lang="ts">
	/**
	 * /momentum-course — THE CURRICULUM. Rail stop 03 (`mo-curriculum`).
	 *
	 * This page previously stated "15 modules / 115 video lessons" and never said
	 * what any of them were. A number is a claim; a syllabus is proof. This section
	 * prints all fifteen module titles, and the instructor's own framing lessons
	 * above them, so a buyer can read the product instead of being told its size.
	 *
	 * ZERO WRITTEN COPY. Every title is quoted exactly — capitalisation, punctuation,
	 * the lot — from docs/momentum-reference/live-momentum-course.txt, captured from
	 * the live course page with a real browser. Per-entry line numbers are in
	 * data/content.ts. The titles are uneven and shouty in places; that is left
	 * alone, because a real syllabus reads as real precisely because nobody tidied it.
	 *
	 * IT IS NOW THE PAGE'S CENTREPIECE, AND THE SPECTACLE IS THE PRODUCT BEING READ.
	 * A pinned aside holds CurriculumScene — a receding corridor of fifteen gates,
	 * one per real module — beside the list. One ScrollTrigger drives the whole
	 * scene: its progress aims the camera continuously down the corridor, marks the
	 * row you are level with, and swaps the big numeral and title in the aside. The
	 * list itself never moves out of reach: it scrolls normally, all fifteen titles
	 * stay readable, and nothing is hidden behind the pin.
	 *
	 * ONE WRITER PER VALUE. `travel` (fractional, the camera) and `index` (integer,
	 * the highlighted row and the readout) are written ONLY by that trigger's
	 * onUpdate; `shown` is written only by the swap timeline. They stay local to this
	 * component because nothing outside it reads them — a module-scope store for a
	 * value that never leaves one subtree would be scaffolding.
	 *
	 * NO ScrollTrigger SNAP, deliberately. Snap and Lenis are two animators fighting
	 * for window scroll. The scene reads its position from progress instead, which is
	 * why it can be continuous rather than stepped.
	 *
	 * REDUCED MOTION, the honest answer: no context is built, so ZERO ScrollTriggers
	 * exist — no pin, no scrub, no batch. `.js` is never on <html> (app.html:16-22),
	 * so every row is at its resting opacity, all fifteen titles are visible at once,
	 * the aside sits at module 01 and CurriculumScene paints one settled frame
	 * (CurriculumScene.svelte:502-515, its `if (reduced)` still path). Everything
	 * readable, nothing moving.
	 */
	import { onDestroy, onMount, untrack } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import { splitReveal } from '$lib/motion';
	import { curriculum, links } from '$lib/pages/momentum/data/content';
	import { ui } from '$lib/pages/momentum/state/ui.svelte';
	import { ensureGsap, ScrollTrigger } from '$lib/pages/momentum/motion/gsap-setup';
	import { courseSectionHead } from '$lib/pages/momentum-course/motion/course-signals';
	import CurriculumScene from '$lib/pages/momentum-course/viz/CurriculumScene.svelte';
	import '$lib/pages/momentum-course/course.css';

	/** The fifteen real modules. `count` is their length — never a typed-in 15. */
	const modules = curriculum.modules;
	const count = modules.length;

	/**
	 * Read at INIT and OR-ed with the store: the route's $effect is the only writer
	 * of `ui.reducedMotion` and it can run after this component initialises — the
	 * bug documented at project-alpha/viz/NeuroTradeHud.svelte:19-27.
	 */
	let systemReduced = $state(
		typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
	);
	const reduced = $derived(systemReduced || ui.reducedMotion);

	/** Continuous camera position, 0..count-1. CurriculumScene honours fractions. */
	let travel = $state(0);
	/** The module the reader is level with: highlights a row, feeds the readout. */
	let index = $state(0);
	/** The module the readout is currently PRINTING — it lags `index` by one swap. */
	let shown = $state(0);

	let root = $state<HTMLElement | undefined>(undefined);
	const captureRoot: Attachment<HTMLElement> = (node) => {
		root = node;
		return () => {
			if (root === node) root = undefined;
		};
	};

	let readout = $state<HTMLElement | undefined>(undefined);
	const captureReadout: Attachment<HTMLElement> = (node) => {
		readout = node;
		return () => {
			if (readout === node) readout = undefined;
		};
	};

	onMount(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		systemReduced = mq.matches;
		const onMotion = () => (systemReduced = mq.matches);
		mq.addEventListener('change', onMotion);
		return () => mq.removeEventListener('change', onMotion);
	});

	/**
	 * THE SECTION'S CHOREOGRAPHY. One gsap.context for the entrances, one
	 * gsap.matchMedia for the pin, both torn down together.
	 *
	 * Every from/fromTo carries `immediateRender: false`, which is what lets the CSS
	 * gate (`.js [data-anim] { opacity: 0 }`, app.css:210-215) hold an element
	 * invisible until its own beat instead of GSAP flashing an end state first.
	 */
	$effect(() => {
		if (reduced || !root) return;

		const gsap = ensureGsap();
		const el = root;

		const ctx = gsap.context(() => {
			gsap.fromTo(
				'.mc__lede li',
				{ opacity: 0, y: 14 },
				{
					opacity: 1,
					y: 0,
					duration: 0.6,
					stagger: 0.08,
					ease: 'power3.out',
					immediateRender: false,
					scrollTrigger: { trigger: '.mc__head', start: 'top 86%', once: true }
				}
			);

			/* The fifteen rows print in batches rather than one per trigger: a
			   fifteen-row stagger fired from a single trigger would still be running
			   when the reader is four modules further down. */
			ScrollTrigger.batch('.mc__row', {
				batchMax: 6,
				start: 'top 92%',
				once: true,
				onEnter: (batch) =>
					gsap.fromTo(
						batch,
						{ opacity: 0, y: 18, clipPath: 'inset(0 0 100% 0)' },
						{
							opacity: 1,
							y: 0,
							clipPath: 'inset(0 0 0% 0)',
							duration: 0.55,
							ease: 'expo.out',
							stagger: 0.045,
							immediateRender: false
						}
					)
			});

			gsap.fromTo(
				'.mc__foot',
				{ opacity: 0, y: 16 },
				{
					opacity: 1,
					y: 0,
					duration: 0.6,
					ease: 'power3.out',
					immediateRender: false,
					scrollTrigger: { trigger: '.mc__foot', start: 'top 94%', once: true }
				}
			);
		}, el);

		/* THE PIN. Only the aside is pinned, and only where there is a second column
		   to pin it into; below 1024px the same trigger runs WITHOUT a pin so the
		   scene still advances while it is on screen.

		   `scrub` is deliberately absent: this trigger drives no animation of its
		   own, and onUpdate already fires on every scroll tick, so a scrub value here
		   would be a property with no effect.

		   The pin target sits inside a plain `.mc__col` wrapper rather than being the
		   grid item itself — ScrollTrigger replaces a pinned element with a
		   pin-spacer, and a spacer standing in for a grid item is where grid pins go
		   wrong. */
		const mm = gsap.matchMedia();
		mm.add({ isWide: '(min-width: 1024px)', isCompact: '(max-width: 1023.98px)' }, (mmCtx) => {
			const isWide = mmCtx.conditions?.isWide === true;
			const grid = el.querySelector<HTMLElement>('.mc__grid');
			const aside = el.querySelector<HTMLElement>('.mc__aside');
			if (!grid || !aside) return;

			ScrollTrigger.create({
				trigger: grid,
				start: 'top 18%',
				/* MEASURED, not 'bottom bottom'. `bottom bottom` releases the pin when
				   the grid's bottom reaches the bottom of the VIEWPORT — which, with
				   the aside pinned near the top, is a full aside-height too early:
				   verified in the browser, the corridor flew off the top of the screen
				   while modules 12-15 were still being read. Ending after
				   (grid - aside) instead keeps it pinned until the last row is level
				   with the aside's own bottom edge. The function form is re-evaluated
				   on every refresh, so a webfont swap or a resize re-measures it. */
				end: () => '+=' + Math.max(160, grid.offsetHeight - aside.offsetHeight),
				invalidateOnRefresh: true,
				pin: isWide ? aside : false,
				pinSpacing: false,
				onUpdate: (self) => {
					const p = self.progress;
					// The camera travels continuously between the first and last gate…
					travel = p * (count - 1);
					// …while the list needs a whole module: 0..count-1, never count.
					index = Math.min(count - 1, Math.max(0, Math.floor(p * count)));
				}
			});
		});

		return () => {
			ctx.revert();
			mm.revert();
		};
	});

	/**
	 * THE NUMERAL SWAP. Out on a hard `power2.in`, in on an `expo.out` — the readout
	 * behaves like a mechanical counter rolling to the next module rather than a
	 * cross-fade. The new module is written at the timeline's midpoint, so the text
	 * only ever changes while the element is off its own line.
	 *
	 * A RUNNING SWAP IS NEVER INTERRUPTED, and that is the fix for a defect this
	 * had and the browser found: killing and restarting the timeline on every index
	 * change meant a fast scrub never reached the midpoint, so the readout sat at
	 * module 01 — or worse, mid-exit at opacity 0 — for the whole travel and only
	 * caught up once the scroll stopped. Instead the midpoint reads the LATEST
	 * index (so one swap can catch up several modules at once) and `onComplete`
	 * runs another only if the reader has moved on again.
	 */
	let swap: gsap.core.Timeline | undefined;
	let swapping = false;

	function runSwap(el: HTMLElement) {
		const target = index;
		if (target === shown) {
			swapping = false;
			return;
		}
		swapping = true;
		const gsap = ensureGsap();
		swap = gsap
			.timeline({
				onComplete: () => {
					swapping = false;
					runSwap(el);
				}
			})
			.to(el, { yPercent: -100, opacity: 0, duration: 0.28, ease: 'power2.in' })
			.add(() => {
				// The latest module, not the one captured when this started.
				shown = index;
			})
			.fromTo(
				el,
				{ yPercent: 100, opacity: 0 },
				{ yPercent: 0, opacity: 1, duration: 0.42, ease: 'expo.out', immediateRender: false }
			);
	}

	/* No teardown on this effect: it re-runs on every index change, and a teardown
	   here would be indistinguishable from a real unmount — which is exactly how a
	   swap gets killed mid-exit and leaves the readout invisible. Destruction is
	   handled once, in onDestroy. */
	$effect(() => {
		const target = index;
		const el = readout;

		if (reduced) {
			// A preference flip mid-swap must not strand the readout off its line.
			if (swap) {
				swap.kill();
				swap = undefined;
				swapping = false;
				if (el) ensureGsap().set(el, { yPercent: 0, opacity: 1 });
			}
			shown = target;
			return;
		}
		if (!el) return;
		if (!swapping) untrack(() => runSwap(el));
	});

	onDestroy(() => {
		swap?.kill();
		swap = undefined;
	});
</script>

<section
	id="mo-curriculum"
	class="mc mc-section mc-section--ink"
	aria-labelledby="mc-title"
	{@attach captureRoot}
>
	<div class="tt-container">
		<div class="section-head">
			<span class="idx">{courseSectionHead('mo-curriculum')}</span>
			<span class="rule"></span>
			<span class="label mc__count">The syllabus</span>
		</div>

		<div class="mc__head">
			<h2 id="mc-title" class="mc__title" data-split {@attach splitReveal({ stagger: 0.03 })}>
				Fifteen modules. <span class="text-red">Nothing hidden.</span>
			</h2>

			<!-- The instructor's own framing lessons, quoted. They set up the course far
			     better than anything written for this page could. -->
			<ul class="mc__lede" data-anim-stagger>
				{#each curriculum.introTopics as topic (topic)}
					<li>{topic}</li>
				{/each}
			</ul>
		</div>

		<div class="mc__grid">
			<div class="mc__col">
				<div class="mc__aside">
					<CurriculumScene index={travel} {modules} />

					<!-- A visual echo of the row you are level with. `aria-hidden`: the
					     <ol> beside it already carries all fifteen titles as real text,
					     and a duplicate that rewrites itself as you scroll would be
					     announced over and over. -->
					<div class="mc__readout" aria-hidden="true">
						<span class="mc__readout-inner" {@attach captureReadout}>
							<span class="mc__readout-n num">{modules[shown].n}</span>
							<span class="mc__readout-t">{modules[shown].title}</span>
						</span>
					</div>
				</div>
			</div>

			<ol class="mc__list" data-anim-stagger>
				{#each modules as m, i (m.n)}
					<li class="mc__row" class:is-current={i === index}>
						<span class="mc__n num" aria-hidden="true">{m.n}</span>
						<span class="mc__t">{m.title}</span>
					</li>
				{/each}
			</ol>
		</div>

		<p class="mc__foot" data-anim>
			<a class="mc__link" href={links.course}>Enroll and start module 01</a>
		</p>
	</div>
</section>

<style>
	/* The section band itself is `.mc-section.mc-section--ink` from course.css:101-115.
	   It used to be declared here, byte-identical to MomentumScope's copy, which is
	   how the two grey sections drifted into reading as one uninterrupted slab. */
	.mc {
		position: relative;
	}
	.mc__count {
		flex: none;
		color: var(--tt-mute-2);
	}

	.mc__head {
		display: grid;
		gap: 1.4rem;
		margin-bottom: clamp(2.5rem, 5vw, 4rem);
	}
	@media (min-width: 1024px) {
		.mc__head {
			grid-template-columns: 1fr 1fr;
			align-items: start;
			gap: clamp(2rem, 5vw, 4rem);
		}
	}
	.mc__title {
		font-size: var(--fs-h2);
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.025em;
		color: #fff;
		text-wrap: balance;
	}

	.mc__lede {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.65rem;
	}
	.mc__lede li {
		position: relative;
		padding-left: 1.4rem;
		font-size: var(--fs-body);
		line-height: 1.5;
		color: var(--tt-fog);
	}
	.mc__lede li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.62em;
		width: 8px;
		height: 1px;
		background: var(--tt-red-bright);
	}

	/* Two columns from 1024px: the corridor on the left, the syllabus on the right.
	   Below that they stack and the corridor simply leads the list. */
	.mc__grid {
		display: grid;
		gap: clamp(1.8rem, 4vw, 2.6rem);
	}
	@media (min-width: 1024px) {
		.mc__grid {
			grid-template-columns: minmax(0, 0.66fr) minmax(0, 1fr);
			align-items: start;
			gap: clamp(2rem, 4vw, 3.5rem);
		}
	}

	.mc__aside {
		display: grid;
		gap: 1.1rem;
		/* Consumed by CurriculumScene through `--mc-scene-h`, whose fallback names
		   this aside (CurriculumScene.svelte:590-592). Measured
		   against the pin, not guessed: the aside is pinned 18% down the viewport,
		   so scene + readout has to clear 82vh. At 30vh the pair comes to roughly
		   0.30vh + 170px, which fits from a 640px-tall window upwards. */
		--mc-scene-h: clamp(200px, 30vh, 360px);
	}

	/* The readout's outer box clips the numeral swap, so the outgoing module leaves
	   the line box rather than sliding over the scene above it. */
	.mc__readout {
		overflow: clip;
		padding-top: 0.9rem;
		border-top: 1px solid var(--tt-line);
	}
	.mc__readout-inner {
		display: grid;
		gap: 0.35rem;
	}
	.mc__readout-n {
		font-size: clamp(2.4rem, 1.6rem + 2.6vw, 3.4rem);
		font-weight: 800;
		line-height: 0.9;
		letter-spacing: -0.03em;
		color: var(--tt-red-bright);
	}
	.mc__readout-t {
		font-size: 0.9rem;
		line-height: 1.4;
		color: var(--tt-fog);
		text-wrap: pretty;
	}

	/* A ruled list, not fifteen cards. A curriculum is read as a table of contents;
	   fifteen bordered boxes would be a wall and would bury the titles.

	   `content-visibility: auto` was removed with the pin: it lets the browser skip
	   layout for off-screen rows, so the list reports its `contain-intrinsic-size`
	   guess instead of its real height — and the pin's `end: 'bottom bottom'` is
	   measured against exactly that height. */
	.mc__list {
		list-style: none;
		margin: 0;
		padding: 0;
		border-top: 1px solid var(--tt-line);
	}
	.mc__row {
		display: grid;
		grid-template-columns: 3.4rem 1fr;
		gap: 0.4rem 1.2rem;
		align-items: baseline;
		padding-block: clamp(0.9rem, 2vw, 1.25rem);
		padding-inline: 0.6rem;
		margin-inline: -0.6rem;
		border-bottom: 1px solid var(--tt-line);
		transition:
			background-color 0.35s ease,
			color 0.35s ease;
	}
	.mc__row:hover {
		background-color: rgb(var(--tt-red-rgb) / 0.05);
	}
	.mc__row.is-current {
		background-color: rgb(var(--tt-red-rgb) / 0.06);
	}
	.mc__n {
		font-size: 0.8rem;
		letter-spacing: 0.1em;
		color: var(--tt-mute-2);
		transition: color 0.35s ease;
	}
	.mc__row.is-current .mc__n {
		color: var(--tt-red-bright);
	}
	.mc__t {
		font-size: clamp(1rem, 0.92rem + 0.4vw, 1.2rem);
		line-height: 1.35;
		color: #fff;
		text-wrap: pretty;
	}

	.mc__foot {
		margin-top: clamp(2rem, 4vw, 3rem);
	}
	.mc__link {
		font-family: var(--tt-font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--tt-fog);
		border-bottom: 1px solid var(--tt-line-strong);
		transition: color 0.25s ease;
	}
	.mc__link:hover,
	.mc__link:focus-visible {
		color: #fff;
	}

	@media (prefers-reduced-motion: reduce) {
		.mc__row,
		.mc__n,
		.mc__link {
			transition: none;
		}
	}
</style>
