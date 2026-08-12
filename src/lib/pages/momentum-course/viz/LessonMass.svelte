<script lang="ts">
	/**
	 * /momentum-course — the lesson mass.
	 *
	 * WHAT IT IS. One mark per lesson, and nothing else. The course's certified
	 * breakdown — 115 Video Lessons and 14 Bonus Lessons — is drawn as a field of
	 * small marks that starts as a seeded scatter and consolidates, front to back,
	 * into two packed blocks as `progress` runs 0 -> 1. The scrubbed consolidation
	 * IS the idea: three claims stated as numerals become one picture with mass.
	 *
	 * ⛔ IT IS NOT DATA, AND MUST NEVER BECOME DATA. There is no axis, no tick, no
	 * gridline, no numeral inside the canvas, no time on any dimension, and no
	 * value on any dimension. The canvas is `aria-hidden`, the figure carries a
	 * name that says what the marks are, and the figcaption prints the two
	 * certified labels as real, selectable DOM text. A field of marks on a trading
	 * page is one label away from reading as a chart, so it is given none.
	 *
	 * ⛔ THE HONESTY CONSTRAINT ON THE PACKING, spelled out because it is easy to
	 * get wrong and impossible to see afterwards: the column count is derived from
	 * the CANVAS WIDTH, never from 15. Packing 115 marks into 15 columns would
	 * draw a lessons-per-module split — "modules of 7, 8, 7..." — and no such
	 * split exists in the evidence. The two blocks assert exactly two things: 115
	 * of one kind, 14 of another. Nothing is ever added to square a block off: the
	 * last row is drawn with however many marks are left, ragged or not, because
	 * completing it would mean inventing a lesson.
	 *
	 * ⛔ 129 IS NEVER PRINTED. 115 + 14 marks are drawn — content.ts:292-297
	 * sanctions using the count "only to count drawn tick marks" — but the sum
	 * appears nowhere on screen, in no label, and in no accessible name.
	 *
	 * COST CONTROL. There is NO animation loop here, and that is a design choice,
	 * not an omission: the field moves only because the scroll moves it, so a
	 * `requestAnimationFrame` chain would burn a frame budget redrawing an
	 * identical picture. It repaints on exactly two events — `progress` changed,
	 * or the ResizeObserver fired — and each repaint is coalesced onto a single
	 * frame, so a burst of scrub updates costs one paint. That is also what makes
	 * it free off-screen: a scrubbed trigger stops writing `progress` once its
	 * section has passed, and a component nobody is scrolling past paints nothing
	 * at all. devicePixelRatio is capped at 2.
	 *
	 * REDUCED MOTION. `progress` is ignored and the field paints its one settled
	 * frame: every mark packed, upright, at full opacity. No scatter, no travel,
	 * no flare, no loop, no observer beyond the resize one — and the figcaption is
	 * unchanged, so the honest content is identical either way.
	 */
	import type { Attachment } from 'svelte/attachments';
	import { onMount } from 'svelte';
	import { browser } from '$app/env';
	import { ui } from '$lib/pages/momentum/state/ui.svelte';
	import { ledger } from '$lib/pages/momentum/data/content';
	import {
		clamp01,
		createValueNoise,
		lerp,
		mixRgba,
		readColorToken
	} from '$lib/pages/momentum-course/motion/course-signals';

	interface Props {
		/**
		 * 0 = fully scattered, 1 = fully packed. The Scope section drives this from
		 * a scrubbed ScrollTrigger; out-of-range values are clamped, so a scrub that
		 * overshoots degrades to "settled" rather than to something undefined.
		 */
		progress?: number;
	}

	let { progress = 0 }: Props = $props();

	/**
	 * THE ONLY TWO FIGURES THIS COMPONENT KNOWS, and it does not know either as a
	 * literal. Both are read out of `ledger.breakdown.items` (content.ts:339-349),
	 * whose entries carry their own capture locators —
	 * docs/momentum-reference/live-momentum-course.txt:57 for the video lessons
	 * and :61 for the bonus lessons. That object is declared `as const`, so the
	 * label comparison below is checked against the literal union at compile time:
	 * renaming or dropping an entry in content.ts fails `svelte-check` here rather
	 * than silently drawing the wrong number of marks.
	 *
	 * The throw is the deliberate loud failure for the one case types cannot
	 * catch (a runtime edit to the data module). A field of marks that quietly
	 * draws the wrong count is worse than a page that refuses to render, because
	 * the first one ships.
	 */
	function certified(label: 'Video Lessons' | 'Bonus Lessons') {
		const item = ledger.breakdown.items.find((entry) => entry.label === label);
		if (!item) {
			throw new Error(`LessonMass: no certified figure for "${label}" in ledger.breakdown.items`);
		}
		return item;
	}

	const videoLessons = certified('Video Lessons');
	const bonusLessons = certified('Bonus Lessons');

	/** Mark counts. Parsed from the certified strings; never typed in by hand. */
	const courseCount = Number.parseInt(videoLessons.figure, 10);
	const bonusCount = Number.parseInt(bonusLessons.figure, 10);
	/** Drawn, never printed, never announced. See the header note on 129. */
	const totalMarks = courseCount + bonusCount;

	/**
	 * The colour key, and the only text this component renders. Each row is the
	 * certified figure and its certified label, concatenated in that order and
	 * nothing else — "115 Video Lessons", "14 Bonus Lessons". It is a key, not a
	 * restatement: the canvas draws two colours of mark and this is what says
	 * which is which.
	 */
	const key = [
		{ figure: videoLessons.figure, label: videoLessons.label, bonus: false },
		{ figure: bonusLessons.figure, label: bonusLessons.label, bonus: true }
	];

	/**
	 * `matchMedia` is read at component INIT and OR-ed with the store, never
	 * trusted from the store alone: the route's $effect is the only writer of
	 * `ui.reducedMotion` and a viz component can mount before it runs, which is
	 * the exact bug documented at project-alpha/viz/NeuroTradeHud.svelte:19-27.
	 */
	let systemReduced = $state(
		browser && window.matchMedia('(prefers-reduced-motion: reduce)').matches
	);
	const reduced = $derived(systemReduced || ui.reducedMotion);

	/** What the canvas actually paints: the settled frame when motion is off. */
	const effectiveProgress = $derived(reduced ? 1 : clamp01(progress));

	/**
	 * Read through a function rather than closed over directly. The attachment
	 * below must NOT track `effectiveProgress` in its own effect — that would tear
	 * down and rebuild the canvas, its seeds and its observer on every scrub
	 * frame. Passing a getter and reading it in a child effect is the pattern the
	 * Svelte docs prescribe for exactly this ("Controlling when attachments
	 * re-run").
	 */
	const readProgress = () => effectiveProgress;

	onMount(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		// Re-read after mount: the server renders with the `false` fallback.
		systemReduced = mq.matches;
		const onChange = () => (systemReduced = mq.matches);
		mq.addEventListener('change', onChange);
		return () => mq.removeEventListener('change', onChange);
	});

	/* ----------------------------------------------------------------------
	   Layout constants. None of these is captured from a reference — there is no
	   reference for this figure; it is new work. They are chosen so the field
	   reads as a dense tally at every width the page can produce.
	   ---------------------------------------------------------------------- */

	/**
	 * Target horizontal pitch, in CSS px, from which the column count derives. It
	 * is a range rather than a constant, and the low end was screenshotted rather
	 * than guessed: at a fixed 21px a 326px-wide field on a 390px phone packed the
	 * marks into 13 columns and 11 rows, which flattened every mark into a square.
	 * The pitch closes up as the field narrows, so the marks stay strokes.
	 */
	const PITCH_MIN = 12;
	const PITCH_MAX = 22;
	/** Horizontal inset so a rotated mark at the edge cannot clip. */
	const PAD = 3;
	/** Share of the scrub spent staggering; the rest is each mark's own travel. */
	const STAGGER = 0.55;

	/** Expo-out. Exact at both ends, so a settled mark is settled, not 0.999. */
	const easeOut = (t: number) => (t >= 1 ? 1 : t <= 0 ? 0 : 1 - Math.pow(2, -9 * t));

	const massField: Attachment<HTMLDivElement> = (host) => {
		const canvasEl = host.querySelector('canvas');
		const context2d = canvasEl?.getContext('2d');
		if (!canvasEl || !context2d) return;
		// Re-bound after the guard so both are non-nullable INSIDE layout() and
		// paint(): TypeScript's control-flow narrowing does not cross a function
		// boundary, and a non-null assertion at every use would assert away the one
		// check that matters if this markup ever changes.
		const canvas = canvasEl;
		const ctx = context2d;

		let disposed = false;
		let frame = 0;
		let pending = 0;

		const dpr = Math.min(window.devicePixelRatio || 1, 2);

		/* CAPTURED colours, read off :root so they cannot rot when app.css moves.
		   The fallbacks are the literals those tokens hold today: --tt-fog is
		   #c9cbd3 (app.css:32), --tt-red-bright is #ff3333 (app.css:12) and
		   --tt-white is #ffffff (app.css:31). */
		const course = readColorToken('--tt-fog', '#c9cbd3');
		const bonus = readColorToken('--tt-red-bright', '#ff3333');
		const white = readColorToken('--tt-white', '#ffffff');

		/* Per-instance seed, per-mark constants. Computed once: they are unitless
		   (-1..1) and get multiplied by the live width/height at paint time, so a
		   resize re-packs the field without re-rolling the scatter. */
		const { hash } = createValueNoise();
		const seedX = new Float32Array(totalMarks);
		const seedY = new Float32Array(totalMarks);
		const seedRot = new Float32Array(totalMarks);
		const seedScale = new Float32Array(totalMarks);
		const seedAlpha = new Float32Array(totalMarks);
		for (let i = 0; i < totalMarks; i++) {
			seedX[i] = hash(i, 1);
			seedY[i] = hash(i, 2);
			seedRot[i] = hash(i, 3);
			seedScale[i] = hash(i, 4);
			seedAlpha[i] = hash(i, 5);
		}

		/** Packed destinations, rewritten by layout(), read by paint(). */
		const slotX = new Float32Array(totalMarks);
		const slotY = new Float32Array(totalMarks);

		let w = 0;
		let h = 0;
		let markW = 3;
		let markH = 12;

		function layout() {
			w = host.clientWidth;
			h = host.clientHeight;
			canvas.width = Math.max(1, Math.round(w * dpr));
			canvas.height = Math.max(1, Math.round(h * dpr));
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			if (w < 8 || h < 8) return;

			// ⛔ COLUMNS COME FROM THE WIDTH. See the honesty note in the header:
			// deriving them from the module count would draw a split that does not
			// exist in the evidence.
			const inner = w - PAD * 2;
			const pitch = Math.max(PITCH_MIN, Math.min(PITCH_MAX, inner / 24));
			// Floor: the accent block is one row or it looks like a rendering fault.
			// Measured at 390px, 13 columns wrapped the 14 bonus marks as 13 + 1 and
			// left a single orphan mark under the row.
			const minCols = Math.max(8, bonusCount);
			const target = Math.max(minCols, Math.min(64, Math.round(inner / pitch)));

			// Aesthetic tie-break, and ONLY that: among the column counts within ±18%
			// of the width-derived target, take the one whose last row is fullest.
			// Measured at 1100px the raw target packs 115 as 52 + 52 + 11 and the
			// stub row reads as a half-finished render; the window picks 58 + 57
			// instead. It attaches no meaning to the number of columns — there is no
			// axis, no gridline and no label, so nothing can be read off a row.
			let cols = target;
			let bestFill = -1;
			const lo = Math.max(minCols, Math.floor(target * 0.82));
			const hi = Math.min(64, Math.ceil(target * 1.18));
			for (let c = lo; c <= hi; c++) {
				const remainder = courseCount % c;
				// Ties resolve back toward the width-derived target.
				const score = (remainder === 0 ? 1 : remainder / c) - Math.abs(c - target) * 0.001;
				if (score > bestFill) {
					bestFill = score;
					cols = c;
				}
			}

			const courseRows = Math.ceil(courseCount / cols);
			const bonusRows = Math.ceil(bonusCount / cols);
			const rows = courseRows + bonusRows;

			// The one gutter in the picture: it separates the two blocks, and it is
			// the only reason a reader can see there are two.
			const gutter = Math.min(h * 0.09, 18);
			const cellW = inner / cols;
			// Rows normally fill the box. The cap only binds when the box is tall
			// enough that the rows would drift absurdly far apart (few columns, few
			// rows), and whatever it leaves over centres the block rather than
			// stranding it at the top.
			const rowPitch = Math.min((h - gutter) / rows, cellW * 4.5);
			const originY = (h - (rows * rowPitch + gutter)) / 2;

			markW = Math.max(2, Math.min(4.5, cellW * 0.2));
			// A mark is a STROKE. The lower bound is what stops the row pitch alone
			// from flattening it into a square on a phone; the upper bounds stop it
			// from closing the gap between two rows.
			markH = Math.min(Math.max(rowPitch * 0.62, markW * 2.4), rowPitch * 0.88, cellW * 3);

			for (let i = 0; i < totalMarks; i++) {
				const inBonus = i >= courseCount;
				const local = inBonus ? i - courseCount : i;
				const row = (inBonus ? courseRows : 0) + Math.floor(local / cols);
				const col = local % cols;
				slotX[i] = PAD + (col + 0.5) * cellW;
				slotY[i] = originY + (row + 0.5) * rowPitch + (inBonus ? gutter : 0);
			}
		}

		function paint(p: number) {
			if (disposed || w < 8 || h < 8) return;
			ctx.clearRect(0, 0, w, h);

			const cx = w / 2;
			const cy = h / 2;
			const span = 1 - STAGGER;
			const last = Math.max(1, totalMarks - 1);

			for (let i = 0; i < totalMarks; i++) {
				// Front-to-back: the first mark has landed before the last has left.
				const t = clamp01((p - (i / last) * STAGGER) / span);
				const e = easeOut(t);
				// A single arch, zero at both ends, so nothing is left flaring at rest.
				const flare = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI);

				const inBonus = i >= courseCount;
				const base = inBonus ? bonus : course;
				const settled = inBonus ? 0.92 : 0.52 + seedAlpha[i] * 0.13;
				const alpha = Math.min(1, lerp(0.05, settled, e) + flare * 0.26);
				if (alpha <= 0.004) continue;

				const x = lerp(cx + seedX[i] * w * 0.58, slotX[i], e);
				const y = lerp(cy + seedY[i] * h * 0.85, slotY[i], e);
				const scale = lerp(1 + seedScale[i] * 0.45, 1, e);
				const mw = markW * scale;
				const mh = markH * scale;

				// In flight a mark runs hot and cools into its own colour as it lands.
				const fill = mixRgba(base, white, flare * 0.65, alpha);

				ctx.fillStyle = fill;

				// Bloom on the 14 bonus marks, and only there — it is what makes them
				// read as the accent rather than as red versions of the same mark. A
				// coloured shadow on the mark itself, NOT the stacked additive pass an
				// earlier revision used: screenshotted at 1100px, the stacked rectangles
				// overlapped their neighbours and merged into one red slab with square
				// corners. A shadow is the only soft falloff a 2D context has, and 14 of
				// them is nothing.
				if (inBonus) {
					ctx.shadowColor = mixRgba(base, white, flare * 0.65, Math.min(1, alpha * 0.8));
					ctx.shadowBlur = Math.max(7, mw * 2.6);
				}

				if (e >= 0.995) {
					// Settled: no transform, which is also the whole reduced-motion frame.
					ctx.fillRect(x - mw / 2, y - mh / 2, mw, mh);
				} else {
					ctx.save();
					ctx.translate(x, y);
					ctx.rotate(seedRot[i] * 0.85 * (1 - e));
					ctx.fillRect(-mw / 2, -mh / 2, mw, mh);
					ctx.restore();
				}

				// Reset immediately: canvas context state survives both the next mark and
				// the next paint(), so a stray shadow would leak onto every grey mark.
				if (inBonus) {
					ctx.shadowBlur = 0;
					ctx.shadowColor = 'transparent';
				}
			}
		}

		/** Coalesce every repaint request onto one frame. */
		function request(p: number) {
			pending = p;
			if (frame || disposed) return;
			frame = requestAnimationFrame(() => {
				frame = 0;
				paint(pending);
			});
		}

		layout();

		const ro = new ResizeObserver(() => {
			layout();
			// Assigning canvas.width above cleared the backing store; repaint the
			// last known progress or the field is blank until the next scrub tick.
			request(pending);
		});
		ro.observe(host);

		// The only reactive read in this component's render path. It runs after the
		// attachment body, so it owns the first paint as well as every repaint.
		$effect(() => {
			request(readProgress());
		});

		return () => {
			disposed = true;
			cancelAnimationFrame(frame);
			ro.disconnect();
		};
	};
</script>

<figure
	class="mc-mass"
	aria-label="A field of marks, one for each lesson. The counts are listed below."
>
	<div class="mc-mass__field" {@attach massField}>
		<canvas aria-hidden="true"></canvas>
	</div>
	<figcaption class="mc-mass__key">
		{#each key as item (item.label)}
			<span class="mc-mass__key-item">
				<span class="mc-mass__swatch" class:is-bonus={item.bonus}></span>
				<span class="label">{item.figure} {item.label}</span>
			</span>
		{/each}
	</figcaption>
</figure>

<style>
	.mc-mass {
		display: grid;
		gap: clamp(0.9rem, 2vw, 1.35rem);
		margin: 0;
	}

	/* A fixed block height, so the box the canvas paints into is reserved on the
	   server-rendered first paint and hydration shifts nothing. Without
	   JavaScript this stays empty and the key below is the whole figure — an
	   honest gap, not a broken one: the certified counts are DOM text either way.

	   The band is deliberately WIDE AND SHORT, and the number was screenshotted
	   rather than guessed: the column count rises with width, so a wide field
	   needs FEWER rows, and at 300px tall a 1100px-wide field packed 129 marks
	   into the middle third and left two empty bands. */
	.mc-mass__field {
		position: relative;
		width: 100%;
		height: clamp(180px, 15vw, 240px);
	}

	canvas {
		position: absolute;
		inset: 0;
		display: block;
		width: 100%;
		height: 100%;
	}

	.mc-mass__key {
		display: flex;
		flex-wrap: wrap;
		gap: 0.55rem 1.75rem;
	}

	.mc-mass__key-item {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
	}

	/* The key's swatch is one mark, at rest, in the mark's own colour. */
	.mc-mass__swatch {
		flex: none;
		width: 3px;
		height: 15px;
		background: var(--tt-fog);
		opacity: 0.68;
	}

	.mc-mass__swatch.is-bonus {
		background: var(--tt-red-bright);
		opacity: 1;
		box-shadow: 0 0 9px rgb(var(--tt-red-bright-rgb) / 0.55);
	}
</style>
