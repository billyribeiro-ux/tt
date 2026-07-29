<script lang="ts">
	/**
	 * Section divider: ECG QRS + alpha sine fused into one scrolling path.
	 */
	import { onMount } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import { browser } from '$app/env';
	import { ui } from '$lib/pages/project-alpha/state/ui.svelte';
	import { ecgSample, eegBandSample, ALPHA_HZ } from '$lib/pages/project-alpha/motion/signals';

	interface Props {
		stage?: number;
	}

	let { stage = 0 }: Props = $props();
	let host: HTMLDivElement | undefined;
	let canvasEl: HTMLCanvasElement | undefined;

	const captureHost: Attachment<HTMLDivElement> = (node) => {
		host = node;
		return () => {
			if (host === node) host = undefined;
		};
	};

	const captureCanvas: Attachment<HTMLCanvasElement> = (node) => {
		canvasEl = node;
		return () => {
			if (canvasEl === node) canvasEl = undefined;
		};
	};

	onMount(() => {
		if (!browser || !host || !canvasEl || ui.reducedMotion) return;
		let disposed = false;
		let raf = 0;
		let visible = false;
		const canvas = canvasEl;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		function resize() {
			if (!host || !ctx) return;
			const w = host.clientWidth;
			const h = 48;
			canvas.width = w * dpr;
			canvas.height = h * dpr;
			canvas.style.width = `${w}px`;
			canvas.style.height = `${h}px`;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		}
		resize();
		// Setting canvas dimensions clears the backing store, so every resize
		// (including the observer's initial async fire) must repaint one frame
		// even while the divider is off-screen.
		const ro = new ResizeObserver(() => {
			resize();
			if (raf === 0) raf = requestAnimationFrame(draw);
		});
		ro.observe(host);
		const io = new IntersectionObserver(
			([entry]) => {
				visible = entry.isIntersecting;
				if (visible && raf === 0) raf = requestAnimationFrame(draw);
			},
			{ rootMargin: '120px 0px' }
		);
		io.observe(host);

		// Every divider is its own signal: a per-instance seed plus slow
		// aperiodic drift means no divider repeats itself, and no two
		// dividers on the page ever draw the same trace.
		const seed = Math.random() * 1000;
		const hash = (index: number, k: number) => {
			const v = Math.sin(index * 127.1 + (seed + k) * 311.7) * 43758.5453123;
			return (v - Math.floor(v)) * 2 - 1;
		};
		const vn = (t: number, freq: number, k: number) => {
			const pos = t * freq;
			const idx = Math.floor(pos);
			const f = pos - idx;
			const b = f * f * (3 - 2 * f);
			return hash(idx, k) + (hash(idx + 1, k) - hash(idx, k)) * b;
		};

		const t0 = performance.now();
		function draw(now: number) {
			raf = 0;
			if (disposed || !ctx || !host) return;
			const t = (now - t0) / 1000;
			const w = host.clientWidth;
			const h = 48;
			const mid = h / 2;
			const coherence = Math.min(1, Math.max(0, stage / 8));
			ctx.clearRect(0, 0, w, h);

			// faint baseline
			ctx.strokeStyle = 'rgba(46,46,53,0.9)';
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(0, mid);
			ctx.lineTo(w, mid);
			ctx.stroke();

			// Slowly wandering signal character: frequency wobble, spindle
			// bursts, and cadence drift, all aperiodic.
			const betaWobble = vn(t, 0.11, 1) * 1.6;
			const alphaWobble = vn(t, 0.07, 2) * 0.45;
			const spindle = 0.55 + Math.max(0, vn(t, 0.16, 3)) * 0.6;
			const cadence = 1 + vn(t, 0.05, 4) * 0.12;

			// Reactivity begins jagged and recedes as the protocol advances.
			ctx.strokeStyle = `rgba(184,32,32,${0.56 - coherence * 0.44})`;
			ctx.lineWidth = 1.1;
			ctx.beginPath();
			const n = Math.floor(w / 3);
			for (let i = 0; i <= n; i++) {
				const x = (i / n) * w;
				const u = t * 1.2 * cadence + i * 0.055;
				const burst = 0.7 + vn(u, 0.9, 5) * 0.35;
				const y =
					mid +
					eegBandSample(u, {
						freqHz: 22 + betaWobble,
						amp: (1 - coherence * 0.72) * burst,
						phase: stage + seed
					}) *
						9 +
					ecgSample(u * 0.48, seed * 0.1) * (7 - coherence * 5) +
					vn(u, 6.5, 6) * 1.6;
				if (i === 0) ctx.moveTo(x, y);
				else ctx.lineTo(x, y);
			}
			ctx.stroke();

			// Alpha coherence grows chapter by chapter; its spindles come and go.
			ctx.strokeStyle = `rgba(59,139,235,${0.48 + coherence * 0.4})`;
			ctx.lineWidth = 1.6;
			ctx.beginPath();
			for (let i = 0; i <= n; i++) {
				const x = (i / n) * w;
				const u = t * 0.8 * cadence + i * 0.04;
				const y =
					mid +
					eegBandSample(u, {
						freqHz: ALPHA_HZ.center + alphaWobble,
						amp: (0.55 + coherence * 0.5) * spindle,
						phase: seed
					}) *
						(7 + coherence * 3) +
					ecgSample(u * 0.35, seed * 0.2) * (5 - coherence * 2) +
					vn(u, 4.2, 7) * 1.1;
				if (i === 0) ctx.moveTo(x, y);
				else ctx.lineTo(x, y);
			}
			ctx.stroke();

			// Gold micro "price tick" overlay: an irregular walk, not a sine.
			ctx.strokeStyle = `rgba(212,168,83,${0.18 + coherence * 0.32})`;
			ctx.lineWidth = 1;
			ctx.beginPath();
			for (let i = 0; i <= n; i++) {
				const x = (i / n) * w;
				const u = t * 0.5 + i * 0.03;
				const y = mid + vn(u, 0.7, 8) * 4.5 + vn(u, 2.6, 9) * 2.4 + vn(u, 9.5, 10) * 0.9;
				if (i === 0) ctx.moveTo(x, y);
				else ctx.lineTo(x, y);
			}
			ctx.stroke();

			if (visible) raf = requestAnimationFrame(draw);
		}
		draw(performance.now());

		return () => {
			disposed = true;
			cancelAnimationFrame(raf);
			ro.disconnect();
			io.disconnect();
		};
	});
</script>

<div class="wave-div" {@attach captureHost} aria-hidden="true">
	<canvas {@attach captureCanvas}></canvas>
	{#if ui.reducedMotion}
		<div class="static-line"></div>
	{/if}
</div>

<style>
	.wave-div {
		width: min(1100px, calc(100% - 2rem));
		margin: 0 auto;
		height: 48px;
		position: relative;
	}

	.static-line {
		position: absolute;
		left: 0;
		right: 0;
		top: 50%;
		height: 1px;
		background: linear-gradient(90deg, transparent, #2e2e35, transparent);
	}

	canvas {
		position: absolute;
		inset: 0;
		display: block;
	}
</style>
