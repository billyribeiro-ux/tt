<script lang="ts">
	/**
	 * /momentum-course — THE CURRICULUM SCENE.
	 *
	 * WHAT IT IS. The page's through-line is "a corridor you walk down, and the
	 * walk IS the syllabus". This is that corridor, drawn for the Curriculum
	 * section: a receding run of FIFTEEN GATES, one per real module in
	 * `curriculum.modules` (momentum/data/content.ts:433-487). `index` is which
	 * module is being read, and the camera stands just short of that gate, looking
	 * down the rest of the hall. Scrub the pinned list and the viewer travels
	 * through the syllabus one module at a time; the corridor visibly EMPTIES as
	 * the syllabus is consumed, so how much hall is left is itself the progress
	 * signal — at module 15 exactly one lit doorway remains, because there is
	 * nothing after module 15.
	 *
	 * IT IS DRIVEN BY THE REAL DATA, NOT BY PARTICLES. Every gate's lateral
	 * offset, its proportions and the number of slats inside it come from a
	 * deterministic FNV-1a hash of that module's ACTUAL TITLE STRING. So the
	 * fifteen gates are fifteen distinct shapes, the corridor bends the same way
	 * on every visit and on every machine, and swapping the data swaps the
	 * architecture. Nothing here is random per-run and nothing is a generic
	 * particle field.
	 *
	 * ⛔ IT IS ORNAMENT, NOT DATA, AND MUST NEVER BECOME DATA. No numerals, no
	 * axis, no tick labels, no legend; `aria-hidden` on the wrapper. The accessible
	 * content is the section's own <ol> of the fifteen titles, which is real DOM
	 * text beside it. The hash-to-geometry mapping encodes nothing a reader could
	 * decode and asserts nothing: a longer title does not mean a bigger gate in any
	 * way a viewer is invited to read, and no figure is printed on the canvas.
	 *
	 * WHY CANVAS 2D AND NOT A SECOND THRELTE SCENE. The direction brief's cleanup
	 * contract is explicit — "No new three.js scene is added, so no second WebGL
	 * context." This route has exactly ONE, up in the hero, and this file adds
	 * none. That hero scene is no longer CorridorScene: it was REPLACED on this
	 * route by momentum-course/viz/MomentumMarket.svelte, a candle tape built out
	 * of the course's own vocabulary. The count is unchanged — one context, in the
	 * hero — only the identity of the component holding it. CorridorScene is still
	 * mounted on /momentum. The depth here is honest
	 * perspective maths (a focal length and a 1/z divide), the bloom is stacked
	 * additive passes with `globalCompositeOperation = 'lighter'` — the same fake
	 * bloom CorridorScene uses for the same reason (no `postprocessing` package is
	 * installed) — and there is no geometry or material to leak because there is no
	 * GPU resource to allocate.
	 *
	 * COST CONTROL, the three things that make a canvas scene cheap:
	 *   - the rAF loop runs ONLY while an IntersectionObserver says the scene is
	 *     near the viewport (rootMargin 160px), so a pinned aside scrolled past
	 *     costs nothing;
	 *   - NOTHING is allocated per frame. The per-module geometry lives in
	 *     pre-allocated Float32Arrays built once; the colour ramp is a fixed array
	 *     of 24 pre-built `rgba()` strings indexed by depth, with `globalAlpha`
	 *     carrying the fade, so not one string, object or array is created inside
	 *     `paint()`. The vanishing-point gradient is built in `resize()` and reused;
	 *   - devicePixelRatio is capped at 2.
	 *
	 * REDUCED MOTION. No loop is ever started and no IntersectionObserver is
	 * created. The camera is placed at `index` exactly and ONE settled frame is
	 * painted — the corridor is fully drawn and legible, just still, and the
	 * travelling light (the only purely temporal element) is omitted rather than
	 * frozen mid-sweep. `index` is read in the attachment body on that path, so a
	 * change repaints; on the animated path it is read inside the rAF callback,
	 * where it is untracked and therefore re-aims the camera instead of tearing the
	 * loop down and rebuilding it.
	 */
	import type { Attachment } from 'svelte/attachments';
	import { onMount, untrack } from 'svelte';
	import { browser } from '$app/env';
	import { ui } from '$lib/pages/momentum/state/ui.svelte';
	import { curriculum } from '$lib/pages/momentum/data/content';
	import {
		clamp01,
		lerp,
		mixRgba,
		readColorToken
	} from '$lib/pages/momentum-course/motion/course-signals';

	/** The ONLY field this scene reads off a curriculum entry. `n` is deliberately
	    not in this type: the canvas prints no numerals, so requiring it would be a
	    field nothing reads. TypeScript is structural, so the real `{ n, title }`
	    module objects satisfy it unchanged. */
	interface SceneModule {
		readonly title: string;
	}

	interface Props {
		/**
		 * Which module the camera stands at, 0-based.
		 *
		 * FRACTIONAL VALUES ARE HONOURED, and that is the whole contract: a pinned,
		 * scrubbed trigger can pass `s.progress * (count - 1)` for continuous travel
		 * down the corridor, or a plain integer for a step-and-glide. There is
		 * deliberately no second `progress` prop — two inputs racing to aim one
		 * camera is exactly the kind of ambiguity that ships as a bug.
		 *
		 * Out-of-range values are clamped, so `-1` or `99` cannot draw something
		 * undefined.
		 */
		index?: number;
		/**
		 * The modules. Defaults to the fifteen REAL titles in
		 * momentum/data/content.ts:433-487 — this component never invents a module
		 * and never pads the list to a rounder number.
		 *
		 * Pass a STABLE reference. An inline array literal is a new object on every
		 * render, which would rebuild the scene each time.
		 */
		modules?: readonly SceneModule[];
	}

	let { index = 0, modules = curriculum.modules }: Props = $props();

	/**
	 * `matchMedia` is read at component INIT and OR-ed with the store, never
	 * trusted from the store alone: the route's $effect is the only writer of
	 * `ui.reducedMotion` and a viz component can mount before it runs, which is the
	 * exact bug documented at project-alpha/viz/NeuroTradeHud.svelte:19-27.
	 */
	let systemReduced = $state(
		browser && window.matchMedia('(prefers-reduced-motion: reduce)').matches
	);
	const reduced = $derived(systemReduced || ui.reducedMotion);

	/** True once the canvas has actually put a frame on screen. Hides the CSS
	    still-state below, so there is never a frame with neither and never one
	    with both. */
	let painted = $state(false);

	onMount(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		// Re-read after mount: the server renders with the `false` fallback.
		systemReduced = mq.matches;
		const onChange = () => (systemReduced = mq.matches);
		mq.addEventListener('change', onChange);
		return () => mq.removeEventListener('change', onChange);
	});

	/* ----------------------------------------------------------------------
	   THE PER-MODULE SIGNATURE.

	   FNV-1a over the module's real title. Deterministic across machines, across
	   reloads and across server/client, which is what makes the corridor a fixed
	   piece of architecture rather than a lava lamp. `salt` gives one title
	   several independent channels.
	   ---------------------------------------------------------------------- */
	function titleHash(title: string, salt: number): number {
		let h = (2166136261 ^ salt) >>> 0;
		for (let i = 0; i < title.length; i++) {
			h ^= title.charCodeAt(i);
			h = Math.imul(h, 16777619) >>> 0;
		}
		// Top bits are the well-mixed ones in FNV-1a; take 24 of them as 0..1.
		return ((h >>> 8) & 0xffffff) / 0xffffff;
	}

	/** Most slats a gate can carry. Sizes the pre-allocated slat array. */
	const MAX_SLATS = 6;

	const scene: Attachment<HTMLDivElement> = (host) => {
		const list = modules;
		const count = list.length;
		if (count === 0) return;

		const canvasEl = host.querySelector('canvas');
		const context2d = canvasEl?.getContext('2d');
		if (!canvasEl || !context2d) return;
		// Re-bound after the guard so both are non-nullable INSIDE resize() and
		// paint(): TypeScript's control-flow narrowing does not cross a function
		// boundary, and a `!` on every use would assert away the one check that
		// matters if this markup ever changes.
		const canvas = canvasEl;
		const ctx = context2d;

		// Where the camera starts. On the still path `index` is read TRACKED, so a
		// change repaints the settled frame; on the animated path it is read through
		// `untrack` here and again inside the rAF callback, so changing it re-aims
		// the camera rather than tearing this whole setup down. Both paths therefore
		// open at the right module — including after a client-side nav that lands
		// mid-page. See the file header.
		const startIndex = reduced ? index : untrack(() => index);

		let disposed = false;
		let raf = 0;
		let visible = false;
		/**
		 * A PLAIN local, deliberately not the `painted` rune.
		 *
		 * The still path calls `paint()` synchronously inside this attachment, and an
		 * attachment runs in an effect — so READING `painted` there would enrol it in
		 * this effect's dependency set, and the write on the next line would then
		 * invalidate the very effect that performed it. That is
		 * `effect_update_depth_exceeded`, and it is not theoretical: it took down the
		 * reduced-motion render of this component until this local was introduced.
		 * `painted` is now only ever WRITTEN here, never read, and a write creates no
		 * dependency.
		 */
		let didPaint = false;

		const dpr = Math.min(window.devicePixelRatio || 1, 2);

		/* CAPTURED colours, read off :root so they cannot rot when app.css moves.
		   The fallbacks are the literals those tokens hold today: --tt-mute-2 is
		   #80828e (app.css:35) and --tt-red-bright is #ff3333 (app.css:12). */
		const cold = readColorToken('--tt-mute-2', '#80828e');
		const hot = readColorToken('--tt-red-bright', '#ff3333');

		/* The ramp: 24 opaque `rgba()` strings from grey to brand red, built ONCE.
		   Depth picks the index and `globalAlpha` carries the fade, which is how
		   this loop paints without allocating a single string per frame. */
		const RAMP_N = 24;
		const ramp = new Array<string>(RAMP_N);
		for (let i = 0; i < RAMP_N; i++) ramp[i] = mixRgba(cold, hot, i / (RAMP_N - 1), 1);
		const rampAt = (t: number) => ramp[(clamp01(t) * (RAMP_N - 1)) | 0];

		/* ---- per-module geometry, built once from the real titles ---- */
		const offX = new Float32Array(count); // lateral world offset: the corridor bends
		const offY = new Float32Array(count); // vertical world offset: it also rises and dips
		const wScale = new Float32Array(count); // gate proportions
		const hScale = new Float32Array(count);
		const slatN = new Uint8Array(count); // how many slats sit inside the gate
		const slatLen = new Float32Array(count * MAX_SLATS); // and how far each one reaches
		/* The corridor's centreline is a DAMPED WALK, not per-gate white noise: each
		   module nudges the line and the previous position carries 74% forward. The
		   first cut gave every gate an independent offset, and consecutive doorways
		   then jumped sideways by their full range — the corridor read as jitter
		   rather than as a hall that bends. Damped, it sways. Still 100% determined
		   by the real titles, still identical on every machine and every reload. */
		let axis = 0;
		let rise = 0;
		for (let i = 0; i < count; i++) {
			const title = list[i].title;
			axis = axis * 0.74 + (titleHash(title, 1) - 0.5) * 0.22;
			rise = rise * 0.74 + (titleHash(title, 2) - 0.5) * 0.14;
			offX[i] = axis;
			offY[i] = rise;
			wScale[i] = 0.86 + titleHash(title, 3) * 0.28;
			hScale[i] = 0.84 + titleHash(title, 4) * 0.32;
			slatN[i] = 2 + Math.floor(titleHash(title, 5) * (MAX_SLATS - 1));
			for (let j = 0; j < MAX_SLATS; j++) {
				// Anchored near the gate's own edges (50%–98% of its half-width) so a
				// slat reads as a RUNG OF THAT DOORWAY. An earlier 34%–84% range left
				// them floating in mid-air, visibly detached from the frame they
				// belong to.
				slatLen[i * MAX_SLATS + j] = 0.5 + titleHash(title, 40 + j) * 0.48;
			}
		}

		/* ---- camera / projection constants ----
		   TUNED AGAINST SCREENSHOTS, not guessed. The first cut put the camera ON
		   the active gate (standoff 0, near plane behind the eye), which let the
		   nearest gates reach scale 1.26 and blew them straight off the canvas — the
		   corridor cropped on the left and the active gate was a slab of red. These
		   values keep every projected scale below 1. */

		/** Distance from the eye to the projection plane, in module-spacings. */
		const FOCAL = 3.4;
		/** How far in FRONT of the eye the active module stands. This is what stops
		    the nearest gate filling the frame. */
		const STANDOFF = 0.9;
		/** How many modules ahead stay on screen before the fog closes. */
		const DEPTH = 8.5;
		/** The near plane. A gate has fully dissolved by the time it reaches it, so
		    nothing ever passes the eye and the 1/z divide can never blow up. */
		const NEAR = 0.15;
		/** Seconds for the travelling light to run the length of the corridor. */
		const SWEEP_PERIOD = 3.6;

		let w = 0;
		let h = 0;
		let vx = 0; // vanishing point
		let vy = 0;
		let baseHW = 0; // half-width of a gate at the camera plane
		let baseHH = 0;
		let projX = 0; // world offset -> screen, at scale 1
		let projY = 0;
		let vanish: CanvasGradient | null = null;

		function resize() {
			w = host.clientWidth;
			h = host.clientHeight;
			canvas.width = Math.max(1, Math.round(w * dpr));
			canvas.height = Math.max(1, Math.round(h * dpr));
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

			vx = w * 0.5;
			vy = h * 0.46; // just above centre: the floor gets more room than the ceiling
			baseHW = w * 0.36;
			baseHH = h * 0.34;
			projX = w * 0.62;
			projY = h * 0.62;

			// Built here, not per frame: a CanvasGradient is an allocation, and its
			// two endpoints only move when the element does.
			const g = ctx.createRadialGradient(vx, vy, 0, vx, vy, Math.max(1, Math.min(w, h) * 0.62));
			g.addColorStop(0, mixRgba(cold, hot, 1, 0.22));
			g.addColorStop(0.45, mixRgba(cold, hot, 1, 0.06));
			g.addColorStop(1, mixRgba(cold, hot, 1, 0));
			vanish = g;
		}

		/* Where the camera is, in module units. Eased toward `index` in the loop so
		   a stepped index glides; set exactly on the still path. */
		let travel = Math.max(0, Math.min(count - 1, startIndex));

		/* Scratch for sampleOffsets(): two numbers written in place rather than an
		   object returned, because an object would be a per-frame allocation. */
		let sampX = 0;
		let sampY = 0;
		function sampleOffsets(z: number) {
			const c = Math.max(0, Math.min(count - 1, z));
			const i0 = Math.floor(c);
			const i1 = i0 + 1 < count ? i0 + 1 : count - 1;
			const f = c - i0;
			sampX = lerp(offX[i0], offX[i1], f);
			sampY = lerp(offY[i0], offY[i1], f);
		}

		/**
		 * One frame. `t` is elapsed seconds and is 0 on the still path, which is how
		 * the travelling light is omitted rather than frozen. `active` is the module
		 * the section is highlighting, so the hot gate and the highlighted row in the
		 * <ol> are always the same module.
		 */
		function paint(t: number, active: number) {
			ctx.clearRect(0, 0, w, h);

			// Depth glow at the vanishing point. Stands in for the far end of the
			// corridor; the fog swallows the gates before they reach it.
			if (vanish) {
				ctx.fillStyle = vanish;
				ctx.fillRect(0, 0, w, h);
			}

			/* The camera blends where it STANDS with where it is LOOKING — 60% the
			   current module's position on the centreline, 40% a point 1.6 modules
			   ahead. Aiming it exactly at the current gate pinned that gate dead
			   centre and threw the rest of the corridor off to one side; the
			   look-ahead keeps the whole hall in frame and reads as a camera moving
			   down it rather than snapping to each doorway in turn. */
			sampleOffsets(travel);
			const standX = sampX;
			const standY = sampY;
			sampleOffsets(travel + 1.6);
			const camX = standX * 0.6 + sampX * 0.4;
			const camY = standY * 0.6 + sampY * 0.4;

			// Previous (farther) gate's corners, carried in eight scalars so the rails
			// can be chained without building an array of points.
			let hasPrev = false;
			let pLx = 0;
			let pRx = 0;
			let pTy = 0;
			let pBy = 0;

			// Far to near, so near gates overdraw far ones.
			for (let i = count - 1; i >= 0; i--) {
				const z = i - travel + STANDOFF;
				if (z <= NEAR || z > DEPTH) {
					// The visible set is contiguous (z falls as i falls), so this only
					// ever trims the two ends of the run.
					if (z <= NEAR) break;
					continue;
				}

				const s = FOCAL / (FOCAL + z);
				const cx = vx + (offX[i] - camX) * s * projX;
				const cy = vy + (offY[i] - camY) * s * projY;
				const hw = baseHW * s * wScale[i];
				const hh = baseHH * s * hScale[i];

				const fog = clamp01(1 - z / DEPTH);
				// Gates dissolve as they reach the eye instead of popping out of frame.
				// The ramp is a whole module long, so a module leaves over the same
				// scroll distance the next one takes to arrive.
				const pass = clamp01((z - NEAR) / 0.9);
				const alpha = fog * fog * pass * 0.92;
				if (alpha <= 0.004) {
					hasPrev = false;
					continue;
				}

				const lx = cx - hw;
				const rx = cx + hw;
				const ty = cy - hh;
				const by = cy + hh;

				/* The rails: four corner chains linking this gate to the one behind it.
				   One path, one stroke.

				   There is deliberately NO floor centreline. The first cut chained the
				   gates' bottom MIDPOINTS, and because every gate has its own lateral
				   offset that line zig-zagged across the floor and read as a stray
				   scribble rather than as a corridor — visible in the first screenshot
				   pass. The four corner chains already carry the perspective. */
				if (hasPrev) {
					ctx.globalAlpha = alpha * 0.42;
					ctx.strokeStyle = rampAt(clamp01(1 - z / 3.4) * 0.45);
					ctx.lineWidth = 1;
					ctx.beginPath();
					ctx.moveTo(pLx, pTy);
					ctx.lineTo(lx, ty);
					ctx.moveTo(pRx, pTy);
					ctx.lineTo(rx, ty);
					ctx.moveTo(pLx, pBy);
					ctx.lineTo(lx, by);
					ctx.moveTo(pRx, pBy);
					ctx.lineTo(rx, by);
					ctx.stroke();
				}

				const isActive = i === active;

				// The gate itself. Only the ACTIVE module gets the full brand red; its
				// neighbours are warmed just enough to read as the same material, or the
				// highlight would have no contrast to win against.
				ctx.globalAlpha = alpha;
				ctx.strokeStyle = rampAt(isActive ? 1 : clamp01(1 - z / 3.4) * 0.5);
				ctx.lineWidth = Math.max(0.7, (isActive ? 1.7 : 1.2) * s);
				ctx.strokeRect(lx, ty, hw * 2, hh * 2);

				// The slats — this module's own signature, and the only thing that
				// distinguishes gate 07 from gate 12. Near gates only: at depth they
				// would collapse into a smear and cost pixels for nothing.
				if (z < 4.2) {
					const n = slatN[i];
					const inner = clamp01(1 - z / 4.2);
					ctx.globalAlpha = alpha * inner * 0.6;
					ctx.lineWidth = Math.max(0.6, 1.1 * s);
					ctx.beginPath();
					for (let j = 0; j < n; j++) {
						const y = ty + ((j + 1) / (n + 1)) * hh * 2;
						const reach = hw * slatLen[i * MAX_SLATS + j];
						ctx.moveTo(cx - reach, y);
						ctx.lineTo(cx + reach, y);
					}
					ctx.stroke();
				}

				// Fake bloom on the module being read: two additive over-strokes at
				// falling opacity and rising width. Same trick, and the same reason,
				// as CorridorScene's stacked shells (momentum/viz/CorridorScene.svelte:267-286)
				// — there is no `postprocessing` package in this repo.
				if (isActive) {
					ctx.globalCompositeOperation = 'lighter';
					ctx.strokeStyle = ramp[RAMP_N - 1];
					ctx.globalAlpha = alpha * 0.26;
					ctx.lineWidth = Math.max(2, 5 * s);
					ctx.strokeRect(lx, ty, hw * 2, hh * 2);
					ctx.globalAlpha = alpha * 0.11;
					ctx.lineWidth = Math.max(4, 13 * s);
					ctx.strokeRect(lx, ty, hw * 2, hh * 2);
					ctx.globalCompositeOperation = 'source-over';
				}

				hasPrev = true;
				pLx = lx;
				pRx = rx;
				pTy = ty;
				pBy = by;
			}

			// The travelling light: one bar running the length of the corridor toward
			// the eye. It is the only element that exists purely because time passes,
			// which is why the still frame simply does not draw it.
			if (t > 0) {
				const lz = DEPTH * (1 - ((t / SWEEP_PERIOD) % 1));
				const s = FOCAL / (FOCAL + lz);
				// Depth `lz` in front of the EYE is module `travel + lz - STANDOFF`;
				// forgetting the standoff here would slide the light off the rails.
				sampleOffsets(travel + lz - STANDOFF);
				const cx = vx + (sampX - camX) * s * projX;
				const cy = vy + (sampY - camY) * s * projY;
				const hw = baseHW * s;
				const a = Math.sin((lz / DEPTH) * Math.PI) * 0.45;
				if (a > 0.004) {
					ctx.globalCompositeOperation = 'lighter';
					ctx.strokeStyle = ramp[RAMP_N - 1];
					ctx.globalAlpha = a;
					ctx.lineWidth = Math.max(0.8, 1.6 * s);
					ctx.beginPath();
					ctx.moveTo(cx - hw, cy);
					ctx.lineTo(cx + hw, cy);
					ctx.stroke();
					ctx.globalAlpha = a * 0.3;
					ctx.lineWidth = Math.max(3, 7 * s);
					ctx.stroke();
					ctx.globalCompositeOperation = 'source-over';
				}
			}

			ctx.globalAlpha = 1;
			if (!didPaint) {
				didPaint = true;
				painted = true;
			}
		}

		resize();

		/* ------------------------------------------------------------------
		   THE STILL PATH. No loop, no IntersectionObserver, one settled frame.
		   ------------------------------------------------------------------ */
		if (reduced) {
			paint(0, Math.round(travel));
			const roStill = new ResizeObserver(() => {
				if (disposed) return;
				resize();
				paint(0, Math.round(travel));
			});
			roStill.observe(host);
			return () => {
				disposed = true;
				painted = false;
				roStill.disconnect();
			};
		}

		/* ------------------------------------------------------------------
		   THE ANIMATED PATH.
		   ------------------------------------------------------------------ */
		const t0 = performance.now();
		let last = t0;

		function frame(now: number) {
			raf = 0;
			if (disposed) return;

			// Clamped: a backgrounded tab hands back a huge first delta, which would
			// fling the camera the length of the corridor in one step.
			const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
			last = now;

			// `index` is read HERE, inside the rAF callback, where it is untracked —
			// so aiming the camera at a new module re-aims the next frame instead of
			// tearing this loop down and rebuilding it.
			const target = Math.max(0, Math.min(count - 1, index));
			// Frame-rate independent easing: the same glide on 60Hz and on 120Hz.
			travel += (target - travel) * (1 - Math.exp(-dt * 5.5));
			if (Math.abs(target - travel) < 0.0005) travel = target;

			paint((now - t0) / 1000, Math.round(target));

			if (visible) raf = requestAnimationFrame(frame);
		}

		const ro = new ResizeObserver(() => {
			if (disposed) return;
			resize();
			// Assigning canvas.width above cleared the backing store; repaint one
			// frame even while off-screen, or a resized scene is blank when it
			// scrolls in.
			if (raf === 0) raf = requestAnimationFrame(frame);
		});
		ro.observe(host);

		const io = new IntersectionObserver(
			([entry]) => {
				visible = entry.isIntersecting;
				if (visible) {
					// Reset the clock so the first frame back does not integrate the
					// whole time the scene spent off-screen.
					last = performance.now();
					if (raf === 0) raf = requestAnimationFrame(frame);
				}
			},
			{ rootMargin: '160px 0px' }
		);
		io.observe(host);

		raf = requestAnimationFrame(frame);

		return () => {
			disposed = true;
			painted = false;
			cancelAnimationFrame(raf);
			ro.disconnect();
			io.disconnect();
		};
	};
</script>

<div class="mc-scene" class:is-painted={painted} aria-hidden="true" {@attach scene}>
	<span class="mc-scene__rule"></span>
	<canvas></canvas>
</div>

<style>
	.mc-scene {
		position: relative;
		width: 100%;
		/* Consumers tune the height by setting --mc-scene-h on any ancestor; the
		   fallback is the size the pinned Curriculum aside gives it today. */
		height: var(--mc-scene-h, clamp(200px, 26vh, 320px));
	}

	/* The still state, and the no-JS state: the corridor's spine. Present
	   unconditionally and hidden only once a real frame has been painted, so a
	   visitor with JavaScript off sees a hairline rather than an empty box. */
	.mc-scene__rule {
		position: absolute;
		left: 50%;
		top: 12%;
		bottom: 12%;
		width: 1px;
		background: linear-gradient(180deg, transparent, var(--tt-line-strong), transparent);
	}

	.mc-scene.is-painted .mc-scene__rule {
		display: none;
	}

	canvas {
		position: absolute;
		inset: 0;
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
