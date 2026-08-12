<script lang="ts">
	/**
	 * /momentum-course — the inter-section divider.
	 *
	 * WHAT IT IS. A ladder of vertical rungs marching right-to-left across a
	 * horizontal spine. `stage` (0..4, one per gap between the six sections)
	 * drives a single `coherence` value, and coherence drives EVERYTHING: how
	 * many rungs there are, how straight they sit, how bright the spine is, and
	 * how far the colour has travelled from grey to the brand red. So the five
	 * dividers do not repeat — the ladder visibly resolves as the page advances,
	 * which is the whole point of putting ornament between sections instead of
	 * decorating a void. Same contract as project-alpha's WaveDivider
	 * (viz/WaveDivider.svelte:95), whose `coherence` works the same way.
	 *
	 * ⛔ IT IS NOT DATA, AND MUST NEVER BECOME DATA. No numerals, no axis, no
	 * tick labels, no legend, `aria-hidden` on the wrapper. A ladder of red marks
	 * on a financial page is one label away from reading as a price chart, and
	 * this page is allowed to state exactly five figures (15 modules, 115 video
	 * lessons, 14 bonus lessons, B.O.S.S. Carbon's $597, and the module numerals)
	 * — none of which live here.
	 *
	 * COST CONTROL, all three of the things that make a canvas divider cheap:
	 *   - rAF runs ONLY while an IntersectionObserver says the divider is near the
	 *     viewport (rootMargin 140px), so four off-screen dividers cost nothing;
	 *   - a ResizeObserver repaints ONE frame even while off-screen, because
	 *     assigning canvas.width clears the backing store and a resized,
	 *     unpainted divider would otherwise be blank when it scrolls in;
	 *   - devicePixelRatio is capped at 2, so a 3x phone does not paint 9x the
	 *     pixels for a decorative hairline.
	 *
	 * REDUCED MOTION. The loop is never started and no observer is created. The
	 * `.mc-divider__rule` hairline below is in the markup unconditionally and is
	 * hidden only once the canvas is actually live, so the honest still state is
	 * also the no-JS state: a visitor with JavaScript off sees the same hairline
	 * rather than an empty 56-96px gap.
	 */
	import type { Attachment } from 'svelte/attachments';
	import { onMount } from 'svelte';
	import { browser } from '$app/env';
	import { ui } from '$lib/pages/momentum/state/ui.svelte';
	import {
		clamp01,
		createValueNoise,
		lerp,
		mixRgba,
		readColorToken
	} from '$lib/pages/momentum-course/motion/course-signals';

	interface Props {
		/**
		 * 0..4 in DOM order, one per gap between the six sections. Values above 5
		 * are clamped by `coherence`, so an out-of-range stage degrades to "fully
		 * resolved" instead of drawing something undefined.
		 */
		stage?: number;
	}

	let { stage = 0 }: Props = $props();

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

	/** True only while the canvas loop is actually painting. */
	let live = $state(false);

	onMount(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		// Re-read after mount: the server renders with the `false` fallback.
		systemReduced = mq.matches;
		const onChange = () => (systemReduced = mq.matches);
		mq.addEventListener('change', onChange);
		return () => mq.removeEventListener('change', onChange);
	});

	/**
	 * The whole instrument, as one attachment. Attachments run inside an effect,
	 * so reading `reduced` here means a mid-session preference flip tears the
	 * loop down through this function's cleanup and does not rebuild it.
	 */
	const ladder: Attachment<HTMLDivElement> = (host) => {
		if (reduced) return;

		const canvasEl = host.querySelector('canvas');
		const context2d = canvasEl?.getContext('2d');
		if (!canvasEl || !context2d) return;
		// Re-bound after the guard so both are non-nullable INSIDE resize() and
		// draw(): TypeScript's control-flow narrowing does not cross a function
		// boundary, and the alternative — a `!` on every use — would assert away
		// the one check that matters if this markup ever changes.
		const canvas = canvasEl;
		const ctx = context2d;

		let disposed = false;
		let raf = 0;
		let visible = false;

		const dpr = Math.min(window.devicePixelRatio || 1, 2);

		/* CAPTURED colours, read off :root so they cannot rot when app.css moves.
		   The fallbacks are the literals those tokens hold today: --tt-mute-2 is
		   #80828e (app.css:35) and --tt-red-bright is #ff3333 (app.css:12). */
		const cold = readColorToken('--tt-mute-2', '#80828e');
		const hot = readColorToken('--tt-red-bright', '#ff3333');

		// Per-instance seed: two dividers at the same stage still never draw alike.
		const { noise } = createValueNoise();

		let w = 0;
		let h = 0;
		function resize() {
			w = host.clientWidth;
			h = host.clientHeight;
			canvas.width = Math.max(1, Math.round(w * dpr));
			canvas.height = Math.max(1, Math.round(h * dpr));
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		}

		const t0 = performance.now();

		function draw(now: number) {
			raf = 0;
			if (disposed) return;
			const c = ctx;
			const t = (now - t0) / 1000;
			const mid = h / 2;

			/* `stage` is read here rather than in the attachment body on purpose:
			   a read inside a rAF callback is untracked, so changing the prop
			   re-colours the next frame instead of rebuilding the whole loop. */
			const coherence = clamp01(stage / 5);

			const rungs = Math.round(lerp(18, 34, coherence)); // density resolves
			const spineAlpha = lerp(0.18, 0.5, coherence); // the spine firms up
			const jitter = lerp(1, 0.25, coherence); // the wobble settles
			const speed = lerp(0.05, 0.09, coherence); // and it picks up pace

			c.clearRect(0, 0, w, h);

			// The spine, faded at both ends so the ladder has no hard start or stop.
			const grad = c.createLinearGradient(0, 0, w, 0);
			grad.addColorStop(0, mixRgba(cold, hot, coherence, 0));
			grad.addColorStop(0.5, mixRgba(cold, hot, coherence, spineAlpha));
			grad.addColorStop(1, mixRgba(cold, hot, coherence, 0));
			c.strokeStyle = grad;
			c.lineWidth = 1;
			c.beginPath();
			c.moveTo(0, mid + 0.5);
			c.lineTo(w, mid + 0.5);
			c.stroke();

			// The rungs. `p` is each rung's position across the divider, marching
			// leftwards; the modulo wrap is what makes it a tape rather than a row.
			const maxRung = h * 0.34;
			c.lineWidth = 1;
			for (let i = 0; i < rungs; i++) {
				const p = (((i / rungs - t * speed) % 1) + 1) % 1;
				const x = p * w;

				// Two octaves: a long swell plus a fast flicker, both seeded.
				const swell = noise(i * 0.35 + t * 0.18, 1, 1);
				const flick = noise(i * 1.7 + t * 0.9, 1, 2);
				const height = maxRung * (0.28 + Math.abs(swell) * 0.62 + Math.abs(flick) * 0.16);
				const offset = flick * jitter * (h * 0.06);

				// Fade in at the right edge, out at the left: no popping.
				const edge = Math.sin(p * Math.PI);
				const alpha = lerp(0.22, 0.7, coherence) * edge;
				if (alpha <= 0.004) continue;

				// Leading rungs run hotter than trailing ones, and the whole ramp
				// travels from grey to red as coherence rises.
				c.strokeStyle = mixRgba(cold, hot, coherence * (0.4 + 0.6 * p), alpha);
				c.beginPath();
				c.moveTo(Math.round(x) + 0.5, mid + offset - height / 2);
				c.lineTo(Math.round(x) + 0.5, mid + offset + height / 2);
				c.stroke();
			}

			if (visible) raf = requestAnimationFrame(draw);
		}

		resize();

		const ro = new ResizeObserver(() => {
			resize();
			// Setting canvas.width above cleared the buffer; repaint one frame even
			// while off-screen, or the divider is blank when it scrolls in.
			if (raf === 0) raf = requestAnimationFrame(draw);
		});
		ro.observe(host);

		const io = new IntersectionObserver(
			([entry]) => {
				visible = entry.isIntersecting;
				if (visible && raf === 0) raf = requestAnimationFrame(draw);
			},
			{ rootMargin: '140px 0px' }
		);
		io.observe(host);

		live = true;
		raf = requestAnimationFrame(draw);

		return () => {
			disposed = true;
			live = false;
			cancelAnimationFrame(raf);
			ro.disconnect();
			io.disconnect();
		};
	};
</script>

<div class="mc-divider" class:is-live={live} aria-hidden="true" {@attach ladder}>
	<span class="mc-divider__rule"></span>
	<canvas></canvas>
</div>

<style>
	.mc-divider {
		position: relative;
		width: min(1100px, calc(100% - 2rem));
		height: var(--mc-divider-h);
		margin-inline: auto;
	}

	/* The still state, and the no-JS state. Present unconditionally; hidden only
	   once the canvas is confirmed painting, so there is never a frame with
	   neither and never a frame with both. */
	.mc-divider__rule {
		position: absolute;
		left: 0;
		right: 0;
		top: 50%;
		height: 1px;
		background: linear-gradient(90deg, transparent, var(--tt-line-strong), transparent);
	}

	.mc-divider.is-live .mc-divider__rule {
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
