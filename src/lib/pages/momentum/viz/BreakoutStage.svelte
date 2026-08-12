<script lang="ts">
	/**
	 * /momentum — THE HERO SCENE. "The Breakout."
	 *
	 * WHAT THIS IS, AND WHAT IT IS NOT.
	 * This is DECORATIVE ART, not market data. It plots nothing, quotes nothing and
	 * claims nothing: no axis, no tick, no numeral, no symbol, no price. The path is
	 * generated from a fixed seed so it is identical on every load and on every
	 * machine — it is a drawn shape that behaves like price, in the same way a film
	 * title card behaves like a city without being a map. The element is
	 * aria-hidden and carries no accessible name, so nothing is announced as data.
	 *
	 * WHY CANVAS 2D AND NOT three.js.
	 * It replaces ChromeStage, a 447-line Threlte/three.js carbon-dot field that
	 * cost ~700 KB raw and was, on measurement, barely visible behind the scrim.
	 * Everything this scene needs — a glowing polyline, additive streaks, sparks,
	 * a drifting grid — is cheaper, sharper and far more controllable in 2D. It
	 * also removes three.js from this route entirely.
	 *
	 * THE SCORE. Four beats, then an ambient loop:
	 *   0.00-0.45s  CONSOLIDATION  the line draws sideways and choppy
	 *   0.45-0.85s  THE COIL       range tightens, the grid lifts, volume stacks
	 *   0.85-1.50s  THE BREAKOUT   it rips up and off frame, streaks and sparks
	 *   1.50-2.20s  SETTLE         glow decays, the scene breathes
	 *
	 * TIMING IS DELIBERATE AND WAS RETIMED ONCE. The first cut ran to 3.2s and left
	 * the hero with no wordmark and no CTA for 1.7 seconds — measured on a real
	 * capture, it read as an empty page, not as suspense. The whole score is now
	 * inside 1.5s, which is long enough to feel like a move and short enough that
	 * the mark is already landing while the eye is still arriving.
	 * `onBreakout` fires once at the top of beat three so the wordmark can land on
	 * it — the motion and the mark are one cut, not two animations that happen to
	 * overlap.
	 *
	 * REDUCED MOTION. No timeline, no rAF, no sparks: one composed still of the
	 * settled post-breakout frame is painted once and left alone.
	 */
	import { onMount } from 'svelte';
	import { ui } from '$lib/pages/momentum/state/ui.svelte';

	type Props = {
		/** Fired once, at the instant the breakout begins. */
		onBreakout?: () => void;
	};
	let { onBreakout }: Props = $props();

	let host = $state<HTMLDivElement | undefined>(undefined);
	let canvas = $state<HTMLCanvasElement | undefined>(undefined);

	/* Palette, matching the page tokens rather than re-inventing them:
	   --mo-cyan #05dafa, --mo-cyan-glow #52f0ff, the kit accent #B22725. */
	const CYAN = '5, 218, 250';
	const GLOW = '82, 240, 255';
	const RED = '178, 39, 37';

	/* Beat boundaries in seconds. Named so the draw code reads as the score above. */
	const T_COIL = 0.45;
	const T_BREAK = 0.85;
	const T_SETTLE = 1.5;
	const T_END = 2.2;

	/**
	 * Deterministic PRNG (mulberry32). A fixed seed means the silhouette is a
	 * designed shape, not a lottery: it looks the same for every visitor, and it
	 * can be judged in a screenshot.
	 */
	function rng(seed: number) {
		return () => {
			seed |= 0;
			seed = (seed + 0x6d2b79f5) | 0;
			let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
			t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
			return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
		};
	}

	/**
	 * The silhouette, in normalised space: x 0..1 left to right, y 0..1 where 0 is
	 * the top. Three movements — chop, coil, rip — so the shape itself tells the
	 * story before any of it animates.
	 */
	function buildPath(n: number) {
		const r = rng(20260812);
		const pts: { x: number; y: number; d: number }[] = [];
		let y = 0.66;
		for (let i = 0; i < n; i++) {
			const x = i / (n - 1);
			let amp: number;
			if (x < 0.5)
				amp = 0.055; // chop
			else if (x < 0.66)
				amp = 0.055 * (1 - (x - 0.5) / 0.16) + 0.012; // coil
			else amp = 0.02; // controlled during the rip
			// Parenthesised deliberately: `-a ** b` is a SyntaxError in JS, so the
			// exponentiation is grouped before the sign is applied.
			const drift = x < 0.66 ? (0.66 - y) * 0.09 : -((0.9 * (x - 0.66)) ** 1.55) * 0.62;
			y += (r() - 0.5) * amp * 0.5 + drift * 0.5;
			y = Math.max(0.06, Math.min(0.86, y));
			const prev = pts.length ? pts[pts.length - 1].y : y;
			pts.push({ x, y, d: Math.abs(y - prev) });
		}
		return pts;
	}

	const PTS = buildPath(280);
	/** Volume magnitude per point, normalised — drives the bars under the line. */
	const VMAX = Math.max(...PTS.map((p) => p.d)) || 1;

	onMount(() => {
		const el = canvas;
		const box = host;
		if (!el || !box) return;

		const ctx = el.getContext('2d', { alpha: true });
		if (!ctx) return;

		const reduced =
			window.matchMedia('(prefers-reduced-motion: reduce)').matches || ui.reducedMotion;

		let w = 0;
		let h = 0;
		let dpr = 1;
		let raf = 0;
		let start = 0;
		let inView = true;
		let fired = false;
		let disposed = false;

		/* Sparks thrown off the head during the rip. Plain objects, pooled by simple
		   array churn — the count is bounded by the emit rate below. */
		type Spark = { x: number; y: number; vx: number; vy: number; life: number; max: number };
		let sparks: Spark[] = [];
		const sr = rng(77);

		function resize() {
			const r = box!.getBoundingClientRect();
			// DPR capped at 2: beyond that this scene costs fill rate for nothing.
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			w = Math.max(1, Math.round(r.width));
			h = Math.max(1, Math.round(r.height));
			el!.width = Math.round(w * dpr);
			el!.height = Math.round(h * dpr);
			el!.style.width = w + 'px';
			el!.style.height = h + 'px';
			ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
		}

		/** Ease used for the draw head: slow through the chop, violent through the rip. */
		const easeDraw = (t: number) => (t < 0.62 ? t * 0.78 : 0.484 + (t - 0.62) ** 1.6 * 3.55);

		function grid(t: number) {
			const drift = (t * 9) % 64;
			// TENSION. Through the coil the grid lifts from 0.055 to 0.1 alpha and
			// settles back after the break — the frame itself tightens before the move.
			const coil = t < T_COIL ? 0 : Math.min(1, (t - T_COIL) / (T_BREAK - T_COIL));
			const relax = t < T_BREAK ? 1 : Math.max(0, 1 - (t - T_BREAK) / 0.8);
			const a = 0.055 + 0.045 * coil * relax;
			ctx!.lineWidth = 1;
			ctx!.strokeStyle = `rgba(${CYAN}, ${a.toFixed(4)})`;
			ctx!.beginPath();
			for (let x = -drift; x < w; x += 64) {
				ctx!.moveTo(Math.round(x) + 0.5, 0);
				ctx!.lineTo(Math.round(x) + 0.5, h);
			}
			for (let y = 0; y < h; y += 64) {
				ctx!.moveTo(0, Math.round(y) + 0.5);
				ctx!.lineTo(w, Math.round(y) + 0.5);
			}
			ctx!.stroke();
		}

		function volume(progress: number) {
			const base = h * 0.94;
			const bw = Math.max(2, w / PTS.length - 1.2);
			for (let i = 0; i < PTS.length; i++) {
				const p = PTS[i];
				if (p.x > progress) break;
				const mag = (p.d / VMAX) ** 0.75;
				const bh = mag * h * 0.14 + 1;
				// Bars brighten as the rip begins, so volume visibly confirms the move.
				// Bars in the breakout run take the kit accent #B22725 rather than cyan:
				// on this page red marks the decisive thing, and this is the decisive run.
				if (p.x > 0.66) {
					ctx!.fillStyle = `rgba(${RED}, 0.55)`;
				} else {
					ctx!.fillStyle = `rgba(${CYAN}, 0.13)`;
				}
				ctx!.fillRect(p.x * w - bw / 2, base - bh, bw, bh);
			}
		}

		function line(progress: number, glowAmt: number) {
			const drawTo = (lw: number, style: string, blur: number) => {
				ctx!.beginPath();
				let started = false;
				for (const p of PTS) {
					if (p.x > progress) break;
					const X = p.x * w;
					const Y = p.y * h;
					if (!started) {
						ctx!.moveTo(X, Y);
						started = true;
					} else ctx!.lineTo(X, Y);
				}
				ctx!.lineWidth = lw;
				ctx!.strokeStyle = style;
				ctx!.lineJoin = 'round';
				ctx!.lineCap = 'round';
				ctx!.shadowBlur = blur;
				ctx!.shadowColor = `rgba(${GLOW}, ${0.55 * glowAmt})`;
				ctx!.stroke();
				ctx!.shadowBlur = 0;
			};
			// Wide soft pass under a tight bright pass: cheap, convincing bloom.
			drawTo(7, `rgba(${CYAN}, ${0.1 + 0.16 * glowAmt})`, 26 * glowAmt);
			drawTo(2, `rgba(${GLOW}, ${0.85})`, 14 * glowAmt);
		}

		/** Position on the path at a given normalised x. */
		function at(x: number) {
			const i = Math.min(PTS.length - 1, Math.max(0, Math.round(x * (PTS.length - 1))));
			return PTS[i];
		}

		function streaks(progress: number, amt: number) {
			if (amt <= 0.01) return;
			const p = at(progress);
			const X = p.x * w;
			const Y = p.y * h;
			ctx!.lineCap = 'round';
			for (let i = 1; i <= 7; i++) {
				const back = i * 26 * amt;
				const a = (1 - i / 8) * 0.4 * amt;
				ctx!.strokeStyle = `rgba(${GLOW}, ${a})`;
				ctx!.lineWidth = 2.4 - i * 0.22;
				ctx!.beginPath();
				ctx!.moveTo(X - back, Y + i * 2.1);
				ctx!.lineTo(X - back - 20 * amt, Y + i * 2.6);
				ctx!.stroke();
			}
		}

		function head(progress: number, amt: number) {
			const p = at(progress);
			const X = p.x * w;
			const Y = p.y * h;
			ctx!.shadowBlur = 22;
			ctx!.shadowColor = `rgba(${GLOW}, 0.9)`;
			ctx!.fillStyle = `rgba(255,255,255,${0.85 + 0.15 * amt})`;
			ctx!.beginPath();
			ctx!.arc(X, Y, 2.6 + 2.2 * amt, 0, Math.PI * 2);
			ctx!.fill();
			ctx!.shadowBlur = 0;
			return { X, Y };
		}

		function emit(X: number, Y: number, amt: number) {
			const n = Math.round(3 * amt);
			for (let i = 0; i < n; i++) {
				sparks.push({
					x: X,
					y: Y,
					vx: (sr() * 0.6 + 0.25) * -90,
					vy: (sr() - 0.5) * 120,
					life: 0,
					max: 0.5 + sr() * 0.5
				});
			}
			if (sparks.length > 220) sparks = sparks.slice(-220);
		}

		function drawSparks(dt: number) {
			ctx!.globalCompositeOperation = 'lighter';
			for (const s of sparks) {
				s.life += dt;
				s.x += s.vx * dt;
				s.y += s.vy * dt;
				const k = 1 - s.life / s.max;
				if (k <= 0) continue;
				ctx!.fillStyle = `rgba(${GLOW}, ${k * 0.7})`;
				ctx!.fillRect(s.x, s.y, 2, 2);
			}
			ctx!.globalCompositeOperation = 'source-over';
			sparks = sparks.filter((s) => s.life < s.max);
		}

		/** One composed frame. `t` is seconds since the scene started. */
		function frame(t: number, dt: number) {
			ctx!.clearRect(0, 0, w, h);

			// Camera: a slow push-in through the intro, then a long breathing drift.
			const push = t < T_END ? 1 + 0.035 * Math.min(1, t / T_END) : 1.035;
			const breathe = 1 + Math.sin(t * 0.35) * 0.006;
			ctx!.save();
			ctx!.translate(w / 2, h / 2);
			ctx!.scale(push * breathe, push * breathe);
			ctx!.translate(-w / 2, -h / 2);

			grid(t);

			const raw = Math.min(1, t / T_SETTLE);
			const progress = Math.min(1, easeDraw(raw));

			// Breakout heat: 0 before the rip, 1 through it, decaying after.
			let amt = 0;
			if (t >= T_BREAK && t < T_SETTLE) amt = Math.min(1, (t - T_BREAK) / 0.25);
			else if (t >= T_SETTLE) amt = Math.max(0, 1 - (t - T_SETTLE) / 0.9);

			volume(progress);
			line(progress, 0.45 + 0.55 * amt);
			streaks(progress, amt);
			const { X, Y } = head(progress, amt);
			if (amt > 0.35 && t < T_SETTLE) emit(X, Y, amt);
			drawSparks(dt);

			ctx!.restore();

			if (!fired && t >= T_BREAK) {
				fired = true;
				onBreakout?.();
			}
		}

		/** The still used when motion is off: the settled frame, fully drawn. */
		function still() {
			ctx!.clearRect(0, 0, w, h);
			grid(0);
			volume(1);
			line(1, 0.5);
			head(1, 0);
			fired = true;
			onBreakout?.();
		}

		let last = 0;
		function loop(now: number) {
			if (disposed) return;
			if (!start) start = now;
			const t = (now - start) / 1000;
			const dt = Math.min(0.05, (now - (last || now)) / 1000);
			last = now;
			frame(t, dt);
			// After the score ends the scene keeps breathing, so the hero is never
			// a frozen image — but nothing new is emitted, so it costs almost nothing.
			raf = requestAnimationFrame(loop);
		}

		const ro = new ResizeObserver(() => {
			resize();
			if (reduced) still();
		});
		ro.observe(box);
		resize();

		if (reduced) {
			still();
		} else {
			const io = new IntersectionObserver(
				(entries) => {
					inView = entries[0].isIntersecting;
					if (inView && !raf) {
						last = 0;
						raf = requestAnimationFrame(loop);
					} else if (!inView && raf) {
						cancelAnimationFrame(raf);
						raf = 0;
					}
				},
				{ rootMargin: '120px 0px' }
			);
			io.observe(box);
			raf = requestAnimationFrame(loop);

			return () => {
				disposed = true;
				io.disconnect();
				ro.disconnect();
				if (raf) cancelAnimationFrame(raf);
				sparks = [];
			};
		}

		return () => {
			disposed = true;
			ro.disconnect();
			if (raf) cancelAnimationFrame(raf);
			sparks = [];
		};
	});
</script>

<div class="mo-breakout" bind:this={host} aria-hidden="true">
	<canvas bind:this={canvas}></canvas>
</div>

<style>
	.mo-breakout {
		position: absolute;
		inset: 0;
		overflow: hidden;
		/* Additive over the captured bg4 plate underneath: the drawn light adds to
		   the photograph rather than covering it, so the reference art still reads. */
		mix-blend-mode: screen;
	}
	.mo-breakout canvas {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
