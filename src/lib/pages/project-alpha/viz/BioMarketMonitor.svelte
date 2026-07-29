<script lang="ts">
	/**
	 * Dual-domain monitor: EEG bands + ECG + synthetic session P&L path.
	 * Communicates the study thesis visually: brain state ↔ trading execution.
	 * Honest label: illustrative model, not live participant data.
	 */
	import { onMount } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import { browser } from '$app/env';
	import { ui } from '$lib/pages/project-alpha/state/ui.svelte';
	import { ALPHA_HZ, ecgSample, priceSample } from '$lib/pages/project-alpha/motion/signals';

	interface Props {
		height?: number;
	}

	let { height = 260 }: Props = $props();

	let host: HTMLDivElement | undefined;
	let removeSvg: (() => void) | undefined;
	let readouts = $state({
		alphaHz: 10 as number,
		alphaPct: 62,
		stressPct: 28,
		session: '+0.0R',
		bpm: 72
	});
	let activeStage = $state(0);

	const captureHost: Attachment<HTMLDivElement> = (node) => {
		host = node;
		return () => {
			if (host === node) host = undefined;
		};
	};

	onMount(() => {
		if (!browser || !host) return;

		let disposed = false;
		let raf = 0;
		let cleanupResize: (() => void) | undefined;
		let t0 = performance.now();

		void (async () => {
			try {
				const d3 = await import('d3');
				if (disposed || !host) return;

				const margin = { top: 12, right: 14, bottom: 36, left: 14 };
				const svg = d3
					.select(host)
					.append('svg')
					.attr('width', '100%')
					.attr('height', height)
					.attr('role', 'img')
					.attr('aria-label', 'Illustrative EEG, ECG, and trading path monitor for Project ALPHA');
				removeSvg = () => svg.remove();

				const defs = svg.append('defs');
				const glow = defs
					.append('filter')
					.attr('id', 'bio-glow')
					.attr('x', '-30%')
					.attr('y', '-80%')
					.attr('width', '160%')
					.attr('height', '260%');
				glow.append('feGaussianBlur').attr('stdDeviation', 2.4).attr('result', 'b');
				const m = glow.append('feMerge');
				m.append('feMergeNode').attr('in', 'b');
				m.append('feMergeNode').attr('in', 'SourceGraphic');

				const gGrid = svg.append('g').attr('class', 'grid');
				const gPrice = svg.append('g');
				const gEeg = svg.append('g');
				const gEcg = svg.append('g');
				const gLabels = svg.append('g');

				// Muse records raw EEG at 256 Hz. Keep a full 10-second epoch in
				// ring buffers so the strip advances at clinical-monitor pace
				// without sacrificing the temporal detail of alpha or beta bands.
				const sampleRate = 256;
				const windowSeconds = 10;
				const n = sampleRate * windowSeconds;
				const priceBuf = new Float32Array(n);
				const alphaBuf = new Float32Array(n);
				const betaBuf = new Float32Array(n);
				const ecgBuf = new Float32Array(n);
				const priceView = new Float32Array(n);
				const alphaView = new Float32Array(n);
				const betaView = new Float32Array(n);
				const ecgView = new Float32Array(n);
				let writeIndex = 0;

				const pricePath = gPrice
					.append('path')
					.attr('fill', 'none')
					.attr('stroke', '#d4a853')
					.attr('stroke-width', 1.8)
					.attr('stroke-linecap', 'round')
					.attr('opacity', 0.9);

				const priceArea = gPrice
					.append('path')
					.attr('stroke', 'none')
					.attr('fill', 'url(#price-fill)')
					.attr('opacity', 0.2);

				const alphaPath = gEeg
					.append('path')
					.attr('fill', 'none')
					.attr('stroke', '#3b8beb')
					.attr('stroke-width', 2.2)
					.attr('filter', 'url(#bio-glow)')
					.attr('stroke-linecap', 'round');

				const betaPath = gEeg
					.append('path')
					.attr('fill', 'none')
					.attr('stroke', '#b82020')
					.attr('stroke-width', 1.2)
					.attr('opacity', 0.55)
					.attr('stroke-linecap', 'round');

				const ecgPath = gEcg
					.append('path')
					.attr('fill', 'none')
					.attr('stroke', '#2bbfa0')
					.attr('stroke-width', 1.5)
					.attr('stroke-linecap', 'round')
					.attr('opacity', 0.85);

				const alphaBand = gEeg
					.append('rect')
					.attr('fill', 'rgba(59,139,235,0.06)')
					.attr('stroke', 'rgba(59,139,235,0.15)')
					.attr('stroke-width', 1)
					.attr('rx', 4);

				const grad = defs
					.append('linearGradient')
					.attr('id', 'price-fill')
					.attr('x1', '0%')
					.attr('y1', '0%')
					.attr('x2', '0%')
					.attr('y2', '100%');
				grad
					.append('stop')
					.attr('offset', '0%')
					.attr('stop-color', '#d4a853')
					.attr('stop-opacity', 0.45);
				grad
					.append('stop')
					.attr('offset', '100%')
					.attr('stop-color', '#d4a853')
					.attr('stop-opacity', 0);

				// Legend chips
				const legend = [
					{ c: '#3b8beb', t: `α EEG ${ALPHA_HZ.min}–${ALPHA_HZ.max} Hz` },
					{ c: '#b82020', t: 'β high (reactivity)' },
					{ c: '#2bbfa0', t: 'ECG cadence' },
					{ c: '#d4a853', t: 'Session path (R)' }
				];
				legend.forEach((item, i) => {
					const x = 12 + i * 128;
					const row = gLabels.append('g').attr('transform', `translate(${x}, 0)`);
					row
						.append('line')
						.attr('x1', 0)
						.attr('x2', 14)
						.attr('y1', 0)
						.attr('y2', 0)
						.attr('stroke', item.c)
						.attr('stroke-width', 2.5)
						.attr('stroke-linecap', 'round');
					row
						.append('text')
						.attr('x', 18)
						.attr('y', 4)
						.attr('fill', '#9a9590')
						.attr('font-size', 10)
						.attr('font-family', 'DM Sans, sans-serif')
						.text(item.t);
				});

				let w = 0;
				let innerH = height - margin.top - margin.bottom;

				function layout() {
					if (!host) return;
					w = host.clientWidth;
					innerH = height - margin.top - margin.bottom;
					svg.attr('viewBox', `0 0 ${w} ${height}`);
					gGrid.selectAll('*').remove();

					// ECG paper + chart grid
					const cols = 24;
					const rows = 8;
					for (let i = 0; i <= cols; i++) {
						const x = margin.left + (i / cols) * (w - margin.left - margin.right);
						gGrid
							.append('line')
							.attr('x1', x)
							.attr('x2', x)
							.attr('y1', margin.top)
							.attr('y2', height - margin.bottom)
							.attr('stroke', i % 4 === 0 ? 'rgba(59,139,235,0.12)' : 'rgba(36,36,41,0.8)')
							.attr('stroke-width', 1);
					}
					for (let j = 0; j <= rows; j++) {
						const y = margin.top + (j / rows) * innerH;
						gGrid
							.append('line')
							.attr('x1', margin.left)
							.attr('x2', w - margin.right)
							.attr('y1', y)
							.attr('y2', y)
							.attr('stroke', j % 2 === 0 ? 'rgba(59,139,235,0.1)' : 'rgba(36,36,41,0.65)')
							.attr('stroke-width', 1);
					}

					// Alpha zone in EEG lane (middle third)
					const eegTop = margin.top + innerH * 0.28;
					const eegH = innerH * 0.32;
					alphaBand
						.attr('x', margin.left)
						.attr('y', eegTop)
						.attr('width', Math.max(0, w - margin.left - margin.right))
						.attr('height', eegH);

					gLabels.attr('transform', `translate(0, ${height - 14})`);
				}

				layout();
				const ro = new ResizeObserver(layout);
				ro.observe(host);
				cleanupResize = () => ro.disconnect();

				const priceLine = d3
					.line<number>()
					.x((_, i) => margin.left + (i / (n - 1)) * Math.max(1, w - margin.left - margin.right))
					.y((d) => d)
					.curve(d3.curveMonotoneX);

				// Clinical traces must preserve QRS edges and carrier timing.
				const signalLine = d3
					.line<number>()
					.x((_, i) => margin.left + (i / (n - 1)) * Math.max(1, w - margin.left - margin.right))
					.y((d) => d)
					.curve(d3.curveLinear);

				const area = d3
					.area<number>()
					.x((_, i) => margin.left + (i / (n - 1)) * Math.max(1, w - margin.left - margin.right))
					.y0(() => margin.top + innerH * 0.22)
					.y1((d) => d)
					.curve(d3.curveMonotoneX);

				const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
				const smoothstep = (value: number) => {
					const x = clamp01(value);
					return x * x * (3 - 2 * x);
				};

				function hashNoise(index: number, seed: number) {
					const value = Math.sin(index * 127.1 + seed * 311.7) * 43758.5453123;
					return (value - Math.floor(value)) * 2 - 1;
				}

				function valueNoise(t: number, frequency: number, seed: number) {
					const position = t * frequency;
					const index = Math.floor(position);
					const fraction = position - index;
					const blend = smoothstep(fraction);
					const from = hashNoise(index, seed);
					const to = hashNoise(index + 1, seed);
					return from + (to - from) * blend;
				}

				// Every visit is a different session: a random seed folds into
				// every noise stream, so no two page loads replay the same feed.
				const sessionSeed = Math.floor(Math.random() * 100000) / 100;
				const S = (k: number) => k + sessionSeed;

				// Each 10 s epoch develops its own character (burst density,
				// volatility, reactivity), crossfaded so lanes stay continuous.
				const epochChar = (t: number, k: number) => {
					const position = t / windowSeconds;
					const index = Math.floor(position);
					const blend = smoothstep(position - index);
					return hashNoise(index, S(k)) * (1 - blend) + hashNoise(index + 1, S(k)) * blend;
				};

				function protocolState(t: number) {
					// An endless training session, not a one-way arc: focus wanders
					// through reactive, training, and disciplined states in slow
					// irregular cycles. It can relapse; it never freezes.
					const wander =
						valueNoise(t, 1 / 74, S(11)) * 0.55 +
						valueNoise(t, 1 / 31, S(13)) * 0.3 +
						valueNoise(t, 1 / 12, S(17)) * 0.15;
					const focus = clamp01(0.52 + wander * 0.66);
					const slowDrift = valueNoise(t, 0.018, S(19));
					const autonomicDrift = valueNoise(t, 0.055, S(23));
					const alphaHz = 9.1 + focus * 1.6 + slowDrift * 0.12 + autonomicDrift * 0.04;
					const alpha = clamp01(0.34 + focus * 0.48 + slowDrift * 0.03);
					const stress = clamp01(0.72 - focus * 0.52 + autonomicDrift * 0.04);
					const bpm = 82 - focus * 14 + autonomicDrift * 1.1 + slowDrift * 0.4;
					const stage = focus < 0.42 ? 0 : focus < 0.7 ? 1 : 2;
					return { progress: focus, alphaHz, alpha, stress, bpm, stage };
				}

				function eegTrace(
					t: number,
					frequencyHz: number,
					amplitude: number,
					phase: number,
					noise: number,
					seed: number
				) {
					const tau = Math.PI * 2;
					const envelope = clamp01(
						0.7 + valueNoise(t, 0.17, seed) * 0.2 + valueNoise(t, 0.047, seed + 1) * 0.1
					);
					const primary = Math.sin(t * tau * frequencyHz + phase) * 0.6;
					const neighbor =
						Math.sin(
							t * tau * (frequencyHz - 0.83) + phase * 1.71 + valueNoise(t, 0.08, seed + 2)
						) * 0.22;
					const sideband =
						Math.sin(t * tau * (frequencyHz + 1.37) + phase * 0.63) *
						(0.08 + valueNoise(t, 0.11, seed + 3) * 0.025);
					const broadband =
						valueNoise(t, 29, seed + 4) * noise +
						valueNoise(t, 43, seed + 5) * noise * 0.45 +
						valueNoise(t, 1.2, seed + 6) * 0.08;
					return (primary + neighbor + sideband) * amplitude * envelope + broadband;
				}

				function sampleValues(sampleTime: number) {
					const state = protocolState(Math.max(0, sampleTime));
					const reduced = ui.reducedMotion ? 0.35 : 1;

					// Lanes: session path top, true-frequency EEG center, ECG bottom.
					const priceMid = margin.top + innerH * 0.14;
					const eegMid = margin.top + innerH * 0.44;
					const ecgMid = margin.top + innerH * 0.78;
					const amp = innerH * 0.09 * reduced;

					// Market structure evolves as a slow, irregular path whose
					// volatility regime shifts epoch to epoch.
					const vol = 1 + epochChar(sampleTime, 139) * 0.38;
					const marketDrift =
						(valueNoise(sampleTime, 0.085, S(41)) * 0.48 +
							valueNoise(sampleTime, 0.026, S(47)) * 0.34 +
							priceSample(sampleTime * 0.08, sessionSeed) * 0.18) *
						vol;
					const px = marketDrift * amp * 1.1 + priceMid;
					const alphaBurst =
						0.82 + epochChar(sampleTime, 131) * 0.13 + valueNoise(sampleTime, 0.095, S(53)) * 0.16;
					const betaBurst =
						0.72 +
						Math.max(0, epochChar(sampleTime, 137)) * 0.24 +
						Math.max(0, valueNoise(sampleTime, 0.13, S(67))) * 0.32;
					const al =
						eegTrace(
							sampleTime,
							state.alphaHz,
							(0.78 * state.alpha + 0.16) * alphaBurst,
							0.2,
							0.055,
							S(71)
						) *
							amp +
						eegMid;
					const be =
						eegTrace(
							sampleTime,
							21.5 + valueNoise(sampleTime, 0.04, S(73)) * 0.65,
							(0.44 * state.stress + 0.1) * betaBurst,
							1.1,
							0.07,
							S(83)
						) *
							amp *
							0.82 +
						eegMid +
						8;
					// ecgSample's native cadence is 69 BPM; rescale time so the
					// rendered QRS cadence agrees with the displayed heart rate,
					// then add subtle respiratory wander and acquisition noise.
					const ecgTime =
						sampleTime * (state.bpm / 69) + valueNoise(sampleTime, 0.07, S(91)) * 0.006;
					const ec =
						(ecgSample(ecgTime, sessionSeed * 0.01) * 1.12 +
							valueNoise(sampleTime, 0.24, S(97)) * 0.035 +
							valueNoise(sampleTime, 38, S(101)) * 0.012) *
							amp +
						ecgMid;

					return { px, al, be, ec, state };
				}

				function writeSample(sample: ReturnType<typeof sampleValues>) {
					priceBuf[writeIndex] = sample.px;
					alphaBuf[writeIndex] = sample.al;
					betaBuf[writeIndex] = sample.be;
					ecgBuf[writeIndex] = sample.ec;
					writeIndex = (writeIndex + 1) % n;
				}

				function orderBuffer(source: Float32Array, target: Float32Array) {
					const tailLength = n - writeIndex;
					target.set(source.subarray(writeIndex), 0);
					target.set(source.subarray(0, writeIndex), tailLength);
					return target;
				}

				let sampledThrough = 0;
				let lastReadoutAt = -Infinity;
				let lastRenderedAt = -Infinity;

				function frame(now: number) {
					if (disposed) return;
					const t = (now - t0) / 1000;
					const sampleInterval = 1 / sampleRate;

					// Avoid a burst of catch-up work when a background tab resumes.
					if (t - sampledThrough > 0.25) sampledThrough = t - 0.25;
					while (sampledThrough + sampleInterval <= t) {
						sampledThrough += sampleInterval;
						writeSample(sampleValues(sampledThrough));
					}

					// Acquisition remains 256 Hz; the screen paints at a calm
					// 12 Hz, similar to an instrument display rather than a game.
					if (t - lastRenderedAt >= 1 / 12 || !Number.isFinite(lastRenderedAt)) {
						lastRenderedAt = t;
						pricePath.attr('d', priceLine(orderBuffer(priceBuf, priceView)) ?? '');
						priceArea.attr('d', area(orderBuffer(priceBuf, priceView)) ?? '');
						alphaPath.attr('d', signalLine(orderBuffer(alphaBuf, alphaView)) ?? '');
						betaPath.attr('d', signalLine(orderBuffer(betaBuf, betaView)) ?? '');
						ecgPath.attr('d', signalLine(orderBuffer(ecgBuf, ecgView)) ?? '');
					}

					// Human-readable instruments update at 2 Hz instead of flickering
					// at the display refresh rate.
					if (t - lastReadoutAt >= 0.5 || !Number.isFinite(lastReadoutAt)) {
						lastReadoutAt = t;
						const state = protocolState(t);
						// The session path wanders both ways; discipline tilts it
						// positive but never pins it.
						const rMult =
							(valueNoise(t, 0.021, S(109)) * 0.55 +
								(state.progress - 0.5) * 0.5 -
								(state.stress - 0.4) * 0.2) *
							1.4;
						const sign = rMult >= 0 ? '+' : '';
						activeStage = state.stage;
						readouts = {
							alphaHz: +state.alphaHz.toFixed(1),
							alphaPct: Math.round(state.alpha * 100),
							stressPct: Math.round(state.stress * 100),
							session: `${sign}${rMult.toFixed(1)}R`,
							bpm: Math.round(state.bpm)
						};
					}

					if (!ui.reducedMotion) raf = requestAnimationFrame(frame);
				}

				// Seed a coherent 10-second history so the monitor never starts
				// as an empty or physically discontinuous trace.
				for (let i = 0; i < n; i++) {
					const seedTime = (i - (n - 1)) / sampleRate;
					const sample = sampleValues(seedTime);
					writeSample(sample);
				}
				frame(performance.now());
			} catch (error) {
				console.error('[Project ALPHA] Dual-feed monitor initialization failed.', error);
			}
		})();

		return () => {
			disposed = true;
			cancelAnimationFrame(raf);
			cleanupResize?.();
			removeSvg?.();
		};
	});
</script>

<div class="monitor card-surface">
	<div class="monitor-chrome">
		<div class="left">
			<span class="live"><span class="dot"></span> Dual feed</span>
			<span class="title">Brain state × session path</span>
			<span class="sampling">10 s epoch · 256 Hz acquisition model</span>
		</div>
		<div class="readouts" aria-live="off">
			<div class="chip alpha">
				<span class="k">α power</span>
				<span class="v">{readouts.alphaPct}%</span>
			</div>
			<div class="chip">
				<span class="k">α Hz</span>
				<span class="v">{readouts.alphaHz}</span>
			</div>
			<div class="chip stress">
				<span class="k">β stress</span>
				<span class="v">{readouts.stressPct}%</span>
			</div>
			<div class="chip ecg">
				<span class="k">HR model</span>
				<span class="v">{readouts.bpm}</span>
			</div>
			<div class="chip gold">
				<span class="k">Path</span>
				<span class="v">{readouts.session}</span>
			</div>
		</div>
	</div>
	<div class="host" {@attach captureHost} style:height="{height}px"></div>
	<div class="story-axis" aria-hidden="true">
		<span class:active={activeStage === 0} class:complete={activeStage > 0}
			><i class="red"></i> Reactive state</span
		>
		<b class:active={activeStage > 0}>→</b>
		<span class:active={activeStage === 1} class:complete={activeStage > 1}
			><i class="blue"></i> Alpha training</span
		>
		<b class:active={activeStage > 1}>→</b>
		<span class:active={activeStage === 2}><i class="gold"></i> Disciplined execution</span>
	</div>
	<p class="disclaimer">
		Illustrative model only, not live participant EEG, ECG, or brokerage data. Study measures real
		signals via Muse + Mind Monitor + Size UP.
	</p>
</div>

<style>
	.monitor {
		padding: 0.85rem 0.75rem 0.65rem;
		border-radius: 16px;
		overflow: hidden;
		background:
			radial-gradient(ellipse 80% 50% at 50% 0%, rgba(59, 139, 235, 0.06), transparent 55%),
			var(--alpha-surface);
	}

	.monitor-chrome {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 0 0.5rem 0.55rem;
	}

	.left {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.live {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--alpha-blue);
	}

	.dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--alpha-blue);
		box-shadow: 0 0 10px var(--alpha-blue);
		animation: pulse 2.8s ease-in-out infinite;
	}

	.title {
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--alpha-text);
	}

	.sampling {
		font-size: 0.52rem;
		font-weight: 650;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #555862;
	}

	.readouts {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.chip {
		display: flex;
		flex-direction: column;
		min-width: 58px;
		padding: 0.3rem 0.5rem;
		border-radius: 8px;
		border: 1px solid var(--alpha-border);
		background: rgba(10, 10, 12, 0.65);
		transition:
			border-color 0.8s ease,
			background 0.8s ease;
	}

	.chip .k {
		font-size: 0.58rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--alpha-faint);
	}

	.chip .v {
		font-family: var(--font-display);
		font-size: 0.95rem;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		color: var(--alpha-text);
	}

	.chip.alpha .v {
		color: var(--alpha-blue);
	}
	.chip.stress .v {
		color: var(--alpha-red-bright);
	}
	.chip.ecg .v {
		color: var(--alpha-teal);
	}
	.chip.gold .v {
		color: var(--alpha-gold);
	}

	.host {
		width: 100%;
	}

	.disclaimer {
		margin: 0.35rem 0.5rem 0;
		font-size: 0.68rem;
		color: var(--alpha-faint);
		line-height: 1.45;
	}

	.story-axis {
		display: grid;
		grid-template-columns: auto 1fr auto 1fr auto;
		align-items: center;
		gap: 0.65rem;
		margin: 0.25rem 0.5rem 0.7rem;
		padding: 0.65rem 0;
		border-top: 1px solid rgba(255, 255, 255, 0.06);
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
		font-size: 0.53rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--alpha-faint);
	}

	.story-axis span {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		opacity: 0.42;
		transform: translateY(0);
		transition:
			opacity 1.2s ease,
			color 1.2s ease,
			transform 1.2s var(--ease-out-expo);
	}

	.story-axis span.active {
		opacity: 1;
		color: var(--alpha-text);
		transform: translateY(-1px);
	}

	.story-axis span.complete {
		opacity: 0.72;
	}

	.story-axis b {
		height: 1px;
		font-size: 0;
		background: linear-gradient(90deg, rgba(184, 32, 32, 0.35), rgba(59, 139, 235, 0.35));
		opacity: 0.3;
		transform: scaleX(0.35);
		transform-origin: left center;
		transition:
			opacity 1.4s ease,
			transform 1.8s var(--ease-out-expo);
	}

	.story-axis b.active {
		opacity: 1;
		transform: scaleX(1);
	}

	.story-axis i {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: currentColor;
		box-shadow: 0 0 8px currentColor;
	}

	.story-axis .red {
		color: var(--alpha-red-bright);
	}

	.story-axis .blue {
		color: var(--alpha-blue);
	}

	.story-axis .gold {
		color: var(--alpha-gold);
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.4;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.dot {
			animation: none;
		}

		.story-axis span,
		.story-axis b {
			transition: none;
		}
	}

	@media (max-width: 620px) {
		.story-axis {
			grid-template-columns: 1fr;
		}

		.story-axis b {
			width: 1px;
			height: 12px;
			margin-left: 2px;
		}
	}
</style>
