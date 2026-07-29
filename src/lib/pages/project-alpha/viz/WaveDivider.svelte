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
		const ro = new ResizeObserver(resize);
		ro.observe(host);
		const io = new IntersectionObserver(
			([entry]) => {
				visible = entry.isIntersecting;
				if (visible && raf === 0) raf = requestAnimationFrame(draw);
			},
			{ rootMargin: '120px 0px' }
		);
		io.observe(host);

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

			// Reactivity begins jagged and recedes as the protocol advances.
			ctx.strokeStyle = `rgba(184,32,32,${0.56 - coherence * 0.44})`;
			ctx.lineWidth = 1.1;
			ctx.beginPath();
			const n = Math.floor(w / 3);
			for (let i = 0; i <= n; i++) {
				const x = (i / n) * w;
				const u = t * 1.2 + i * 0.055;
				const y =
					mid +
					eegBandSample(u, { freqHz: 22, amp: 1 - coherence * 0.72, phase: stage }) * 9 +
					ecgSample(u * 0.48, 0.1) * (7 - coherence * 5);
				if (i === 0) ctx.moveTo(x, y);
				else ctx.lineTo(x, y);
			}
			ctx.stroke();

			// Alpha coherence grows chapter by chapter.
			ctx.strokeStyle = `rgba(59,139,235,${0.48 + coherence * 0.4})`;
			ctx.lineWidth = 1.6;
			ctx.beginPath();
			for (let i = 0; i <= n; i++) {
				const x = (i / n) * w;
				const u = t * 0.8 + i * 0.04;
				const y =
					mid +
					eegBandSample(u, {
						freqHz: ALPHA_HZ.center,
						amp: 0.55 + coherence * 0.5,
						phase: 0
					}) *
						(7 + coherence * 3) +
					ecgSample(u * 0.35, 0.2) * (5 - coherence * 2);
				if (i === 0) ctx.moveTo(x, y);
				else ctx.lineTo(x, y);
			}
			ctx.stroke();

			// Gold micro "price tick" overlay
			ctx.strokeStyle = `rgba(212,168,83,${0.18 + coherence * 0.32})`;
			ctx.lineWidth = 1;
			ctx.beginPath();
			for (let i = 0; i <= n; i++) {
				const x = (i / n) * w;
				const u = t * 0.5 + i * 0.03;
				const y = mid + Math.sin(u * 2.2) * 4 + Math.sin(u * 0.4) * 3;
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
