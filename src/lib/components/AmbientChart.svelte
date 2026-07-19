<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import type { CandlestickData, Time } from 'lightweight-charts';
	import { prefersReducedMotion } from '$lib/motion';
	import { aaplSession } from '$lib/data/aapl-intraday';

	/**
	 * Ambient market tape: one real AAPL session (1m candles) printing on an
	 * endless, seamless loop. Rendered with TradingView Lightweight Charts as a
	 * near-invisible background texture: no axes, no labels, no interaction.
	 *
	 * Craft rules:
	 * - Lazy: the library is dynamically imported after first paint (idle
	 *   callback), so the hero's LCP is untouched.
	 * - Honest: candle shapes are a real captured session (see aapl-intraday.ts).
	 *   On each loop the replay is price-shifted so its first open equals the
	 *   previous close; the seam is invisible and no fabricated shapes are drawn.
	 *   Decorative only; the chart asserts no numbers.
	 * - Considerate: printing pauses while the tab is hidden or the hero is
	 *   off-screen; reduced-motion users get the session fully drawn and still.
	 */

	const WINDOW = 150; // candles in view; the tape glides instead of compressing
	const TICK_MS = 47; // one intracandle tick per 0.047s
	const SUB_STEPS = 14; // ticks per candle: each 1m candle forms in ~0.65s, a lively tape
	const REBASE_AT = 8000; // trim chart memory after ~1.5 hours of viewing
	const SPAN = 60; // one minute per candle

	const session = aaplSession;
	const N = session.length;
	const baseTime = session[0].time;
	// Price drift per stitched loop: makes loop L's first open equal loop L-1's close.
	const seamDelta = session[N - 1].close - session[0].open;

	/** The i-th candle of the endless tape: real shapes, stitched seams, monotonic time. */
	function barAt(i: number): CandlestickData<Time> {
		const k = i % N;
		const offset = Math.floor(i / N) * seamDelta;
		const b = session[k];
		return {
			time: (baseTime + i * SPAN) as Time,
			open: b.open + offset,
			high: b.high + offset,
			low: b.low + offset,
			close: b.close + offset
		};
	}

	/**
	 * The forming candle's price at progress t (0..1): a walk from open to the
	 * first extreme, on to the second, then settling at close, always inside the
	 * candle's REAL high/low envelope. Up candles sweep low first then high;
	 * down candles sweep high first. A tiny deterministic flutter makes the walk
	 * read as live ticks. The caller grows high/low from the prices actually
	 * walked, so the wick stretches exactly like a real 1m bar printing.
	 */
	function walkPrice(i: number, t: number): number {
		const full = barAt(i);
		const up = full.close >= full.open;
		const path = up
			? [full.open, full.low, full.high, full.close]
			: [full.open, full.high, full.low, full.close];
		const legs = [
			Math.abs(path[1] - path[0]),
			Math.abs(path[2] - path[1]),
			Math.abs(path[3] - path[2])
		];
		const total = legs[0] + legs[1] + legs[2] || 1;
		const b0 = legs[0] / total;
		const b1 = b0 + legs[1] / total;
		let price: number;
		if (t <= b0) price = path[0] + (path[1] - path[0]) * (b0 > 0 ? t / b0 : 1);
		else if (t <= b1)
			price = path[1] + (path[2] - path[1]) * (b1 - b0 > 0 ? (t - b0) / (b1 - b0) : 1);
		else price = path[2] + (path[3] - path[2]) * (1 - b1 > 0 ? (t - b1) / (1 - b1) : 1);
		const flutter = Math.sin(i * 12.9898 + t * 78.233) * (full.high - full.low) * 0.06;
		return Math.min(full.high, Math.max(full.low, price + flutter));
	}

	const ambient: Attachment = (node) => {
		const el = node as HTMLElement;
		let disposed = false;
		let chart: import('lightweight-charts').IChartApi | undefined;
		let timer: ReturnType<typeof setInterval> | undefined;
		let inView = true;
		let observer: IntersectionObserver | undefined;

		const start = async () => {
			// Defer the library until the browser is idle; the hero owns first paint.
			await new Promise<void>((resolve) => {
				if ('requestIdleCallback' in window) {
					requestIdleCallback(() => resolve(), { timeout: 2500 });
				} else {
					setTimeout(resolve, 1200);
				}
			});
			if (disposed) return;

			const { createChart, CandlestickSeries, ColorType } = await import('lightweight-charts');
			if (disposed) return;

			chart = createChart(el, {
				autoSize: true,
				layout: {
					background: { type: ColorType.Solid, color: 'transparent' },
					// Real-terminal touch: muted mono numerals on the right price scale
					textColor: 'rgb(139 141 152 / 0.9)',
					fontFamily: "ui-monospace, 'SFMono-Regular', 'JetBrains Mono', 'Menlo', monospace",
					fontSize: 11,
					// TradingView's license asks for attribution; with the footer credit
					// removed, the library's own tiny corner logo is the compliant path.
					// At ambient opacity it is barely perceptible.
					attributionLogo: true
				},
				grid: { vertLines: { visible: false }, horzLines: { visible: false } },
				rightPriceScale: { visible: true, borderVisible: false },
				leftPriceScale: { visible: false },
				timeScale: { visible: false, borderVisible: false },
				crosshair: {
					vertLine: { visible: false, labelVisible: false },
					horzLine: { visible: false, labelVisible: false }
				},
				handleScroll: false,
				handleScale: false,
				kineticScroll: { touch: false, mouse: false }
			});
			// Monochrome brand candles: bright red up, embered red down.
			const series = chart.addSeries(CandlestickSeries, {
				upColor: 'rgb(255 51 51 / 0.9)',
				downColor: 'rgb(178 39 37 / 0.45)',
				borderVisible: false,
				wickUpColor: 'rgb(255 51 51 / 0.55)',
				wickDownColor: 'rgb(178 39 37 / 0.4)',
				priceLineVisible: false,
				lastValueVisible: false
			});
			// Breathe within the band; the CSS mask handles the fade toward the copy.
			series.priceScale().applyOptions({ scaleMargins: { top: 0.14, bottom: 0.08 } });

			if (prefersReducedMotion()) {
				// Reduced motion: the real session, fully printed, perfectly still.
				series.setData(session.map((_, j) => barAt(j)));
				chart.timeScale().fitContent();
				return;
			}

			let i = WINDOW; // index of the candle currently forming
			let sub = 0; // 0..SUB_STEPS within the forming candle
			let hi = 0; // running extremes of the forming candle
			let lo = 0;
			let rebase = 0; // logical-index shift applied after each memory trim
			const seed = (from: number) => {
				const data: CandlestickData<Time>[] = [];
				for (let j = from; j < from + WINDOW; j++) data.push(barAt(j));
				series.setData(data);
				rebase = from;
				chart?.timeScale().setVisibleLogicalRange({ from: 0, to: WINDOW });
			};
			seed(0);

			const tick = () => {
				if (disposed || document.hidden || !inView || !chart) return;
				const full = barAt(i);
				if (sub === 0) {
					// New minute: the candle is born at its open.
					hi = full.open;
					lo = full.open;
				}
				sub += 1;
				if (sub >= SUB_STEPS) {
					// Minute complete: settle on the candle's exact real OHLC.
					series.update(full);
					sub = 0;
					i += 1;
					if (i - rebase > REBASE_AT) seed(i - WINDOW); // trim memory, visually identical
				} else {
					const price = walkPrice(i, sub / SUB_STEPS);
					hi = Math.max(hi, price);
					lo = Math.min(lo, price);
					series.update({ time: full.time, open: full.open, high: hi, low: lo, close: price });
				}
				// Fractional glide: the tape slides continuously as the candle forms.
				const pos = i - rebase + sub / SUB_STEPS;
				chart.timeScale().setVisibleLogicalRange({ from: pos - WINDOW, to: pos + 2 });
			};
			timer = setInterval(tick, TICK_MS);

			// Only spend frames while the hero is actually on screen.
			observer = new IntersectionObserver(([entry]) => (inView = entry.isIntersecting), {
				threshold: 0
			});
			observer.observe(el);
		};

		void start();

		return () => {
			disposed = true;
			if (timer) clearInterval(timer);
			observer?.disconnect();
			chart?.remove();
		};
	};
</script>

<div class="ambient" aria-hidden="true" {@attach ambient}></div>

<style>
	.ambient {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}
</style>
