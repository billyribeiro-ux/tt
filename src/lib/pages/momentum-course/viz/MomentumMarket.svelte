<script lang="ts">
	/**
	 * /momentum-course — MOMENTUM MARKET. The hero's 3D scene.
	 *
	 * WHAT IT IS, AND WHY IT IS NOT THE CORRIDOR.
	 * The hero used to mount momentum/viz/CorridorScene with `tint="red"`: a corridor
	 * of rails and a light ribbon. It is competent and it says SPEED, but it says
	 * nothing about TRADING — it would sit equally well on a hosting company's home
	 * page. This scene is built out of the course's own vocabulary instead, so the
	 * ornament IS the syllabus:
	 *
	 *   a tape of candles printing, seen as a physical object in space  — Module 02,
	 *       "Learn These Candlestick Basics..." (content.ts:438-441)
	 *   a trend that forms                                              — Module 04,
	 *       "Learn Trend Formation..." (content.ts:446-449)
	 *   a STUFF CANDLE at the top of the trend — a long upper wick and a close back
	 *       under the open                     — live-momentum-course.txt:161,
	 *       "The STUFF CANDLE - why it's important and how to CORRECTLY recognize it"
	 *   a break that runs, with volume behind it — live-momentum-course.txt:183,
	 *       "SPEED & DISTANCE -the ultimate factor in a winning trade..."
	 *   two parallel channel rails fitted to the tape's own history, which the break
	 *       exits                              — live-momentum-course.txt:213,
	 *       "The Trading Channel", and :221 "Trend Lines"
	 *   a fixed-height risk box that appears under the break
	 *                                          — live-momentum-course.txt:197,
	 *       "Creating & Using Standard Risk Boxes For Ultimate Risk Management".
	 *       Its height is a CONSTANT, never computed from the move: that is what
	 *       makes a risk box "standard", and it is the one thing about the box a
	 *       viewer could read off it.
	 *
	 * ⛔ COLOUR IS ENERGY, NEVER DIRECTION. A candle's colour comes from
	 * `|close - open| / SPEED_REF` — how FAST it moved, not which way. There is no
	 * green anywhere in app.css and a green/red tape would read as profit and loss
	 * on a page that must not imply results. The break glows because it is fast,
	 * which is literally the lesson at :183.
	 *
	 * ⛔ DECORATIVE, NOT DATA. No axis, no gridline, no tick, no numeral, no symbol,
	 * no price, no percentage, no date, no claim. The walk is a seeded procedure and
	 * plots nothing that exists. `aria-hidden` on the wrapper, no accessible name,
	 * `pointer-events: none` so it can never take a click from the enrol CTA.
	 *
	 * ⛔ IT NEVER GATES CONTENT. There is deliberately NO callback prop — no
	 * `onSurge`, no `onBreak`, no "ready" signal of any kind. The hero's h1 is the
	 * LCP element and its entrance runs on mount; a handshake this component could
	 * offer is exactly how the nine-second blank hero documented in
	 * MomentumHero.svelte:87-101 gets reborn. Decoration never gates content.
	 *
	 * PERFORMANCE, the same contract CorridorScene keeps (momentum/viz/CorridorScene.svelte:24-30):
	 *   - NINE BufferGeometries with pre-allocated, reused typed arrays. Nothing is
	 *     allocated per frame — no object, no array, no string, no Vector3 — and no
	 *     geometry is ever rebuilt. 640 vertices in total (4 × 136 for the bodies,
	 *     both bloom shells and the volume lane; 68 wick verts; 36 for the channel
	 *     and the risk box), counted, not estimated.
	 *   - `dpr` capped at [1, 2].
	 *   - Threlte's default `renderMode` is `on-demand` (@threlte/core 8.5.16,
	 *     context/fragments/scheduler.svelte.js:11) and a `<T>` prop write calls
	 *     `invalidate()` (components/T/utils/useProps.svelte.js:94). The camera's
	 *     position is written every frame, which is what keeps the frame invalidated
	 *     while the scene is live — and when the hero scrolls away, `frame()` returns
	 *     early, the camera stops moving and the renderer stops drawing as well.
	 *   - `frustumCulled={false}` on every node: the geometry bounds are rewritten
	 *     each frame, and a bounding sphere computed once at init (when the arrays
	 *     are still zeroed) would cull a mesh that is plainly in shot. This is
	 *     cheaper than recomputing bounding spheres and cannot go stale.
	 *   - the nine script-created geometries are disposed in `onDestroy`. Materials
	 *     are created by `<T.*>` and belong to Threlte's ref-counted disposal
	 *     context (context/fragments/disposal.svelte.js).
	 *
	 * FAKE BLOOM. There is no `postprocessing` package in this repo, so the glow is
	 * stacked additive passes at falling opacity — the same trick, for the same
	 * reason, as CorridorScene.svelte:267-286. Each shell is its OWN geometry rather
	 * than the body geometry re-used at a larger `scale`, because scaling a mesh
	 * scales about the group origin and would fan the candles apart; the shells are
	 * written inflated around each candle's own centre instead.
	 *
	 * DEPTH FALLOFF is baked into the vertex colours rather than into a `Fog`. This
	 * scene rewrites its colour attribute every frame anyway, so one multiply is
	 * free, and it keeps the falloff independent of which Scene object the renderer
	 * treats as its root.
	 *
	 * REDUCED MOTION. The ticker is never mounted and no loop runs. A `settled`-
	 * guarded effect advances the same deterministic walk until every beat is on
	 * screen at once and paints ONE frame: the tape full, the trend formed, the stuff
	 * candle printed, the channel broken with the rail still lit, and the risk box at
	 * full alpha. A composed still, not a frozen scrub.
	 */
	import { Canvas, T } from '@threlte/core';
	import CorridorTicker from '$lib/pages/momentum/viz/CorridorTicker.svelte';
	import { onDestroy, onMount } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import { browser } from '$app/env';
	import {
		BufferGeometry,
		BufferAttribute,
		CustomBlending,
		AddEquation,
		SrcAlphaFactor,
		OneFactor,
		ZeroFactor,
		DoubleSide,
		ACESFilmicToneMapping
	} from 'three';
	import { ui } from '$lib/pages/momentum/state/ui.svelte';
	import { clamp01, readColorToken } from '$lib/pages/momentum-course/motion/course-signals';

	/**
	 * ⛔ NO PROPS, and that is the contract, not an omission.
	 *
	 * It carried an `intensity` and an `offsetX` briefly. Its ONE consumer
	 * (MomentumHero.svelte) passed neither, so both were permanently their own
	 * defaults: `intensity` could only ever be 1 and `offsetX` could only ever be
	 * 0. Two props, two `$derived`, two clamps and four multiplications that no
	 * caller could reach — dead scaffolding, and the numbers they guarded read
	 * more honestly written where they are used. The bloom opacities are on the
	 * two shell materials in the markup; the placement is `groupX` below.
	 *
	 * Nothing may be added here that the hero could WAIT on — no `onReady`, no
	 * `onBreak`, no readiness signal — because that is exactly how the
	 * nine-second blank hero at MomentumHero.svelte:87-101 is reborn. Decoration
	 * never gates content.
	 */
	const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);

	/**
	 * `matchMedia` is read at component INIT and OR-ed with the store, never trusted
	 * from the store alone: the route's $effect is the only writer of
	 * `ui.reducedMotion` and this component can mount before it runs — the exact bug
	 * documented at project-alpha/viz/NeuroTradeHud.svelte:19-27.
	 */
	let systemReduced = $state(
		browser && window.matchMedia('(prefers-reduced-motion: reduce)').matches
	);
	const reduced = $derived(systemReduced || ui.reducedMotion);

	onMount(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		// Re-read after mount: the server renders with the `false` fallback.
		systemReduced = mq.matches;
		const onChange = () => (systemReduced = mq.matches);
		mq.addEventListener('change', onChange);
		return () => mq.removeEventListener('change', onChange);
	});

	/* ======================================================================
	   PALETTE.

	   Every colour is READ off :root through `readColorToken`
	   (momentum-course/motion/course-signals.ts:230) so it cannot rot the next
	   time app.css moves. The fallbacks are the literals those tokens hold today,
	   each cited. CorridorScene's `#ff4a46` (line 61) and `#05060a` (line 232) are
	   NOT site tokens and are deliberately not copied here.
	   ====================================================================== */
	interface C3 {
		r: number;
		g: number;
		b: number;
	}
	const px = (name: string, fallback: string): C3 => {
		const c = readColorToken(name, fallback);
		return { r: c.r / 255, g: c.g / 255, b: c.b / 255 };
	};
	/** Candle body at rest — CAPTURED, app.css:35. */
	const C_BODY = px('--tt-mute-2', '#80828e');
	/** Candle body at full speed — CAPTURED, app.css:12. */
	const C_HOT = px('--tt-red-bright', '#ff3333');
	/** Wicks and the volume row — CAPTURED, app.css:33. */
	const C_WICK = px('--tt-mute', '#8b8d98');
	/** The channel rails — CAPTURED, app.css:10. */
	const C_RAIL = px('--tt-red', '#b22725');
	/** The standard risk box — CAPTURED, app.css:32. */
	const C_RISK = px('--tt-fog', '#c9cbd3');

	/* ======================================================================
	   GEOMETRY CONSTANTS.

	   HONEST NOTE: there is no reference capture for this hero's visual design —
	   the live /momentum-course hero is a heading, a bullet list and a Buy Now
	   button (live-momentum-course.txt:45-67). Every number below is therefore
	   CHOSEN, not captured. They are not, however, guessed: each was tuned by
	   running this file's own simulation and geometry writers headless and
	   measuring the result, and the ones that moved because of a measurement carry
	   that measurement in their comment.
	   ====================================================================== */

	/** Candles on the tape. */
	const CANDLES = 34;
	/** Index of the tape's centre, so local x runs symmetrically about 0. */
	const CENTRE = (CANDLES - 1) / 2;
	/** Spacing between candles, world units. */
	const PITCH = 0.3;
	/** Half the body width: 0.184 wide, so ~39% of the pitch stays as a gap. */
	const BODY_HW = 0.092;
	/** A doji still has to be visible, so a body never collapses below this. */
	const MIN_BODY = 0.035;
	/** Seconds a candle takes to print. The tape holds ~14s of history. */
	const BAR = 0.42;
	/** The body size that counts as "full speed" for the heat ramp. */
	const SPEED_REF = 0.42;
	/**
	 * Baseline of the volume row and its maximum height, in DRAWN units. It is its
	 * own lane under the price lane, as on any chart, and it is placed low enough to
	 * clear both the deepest wick and the lower channel rail — both MEASURED, not
	 * eyeballed (the price band bottoms out near −2.3 and the capped rails near −2.1).
	 */
	const VOL_Y = -3.6;
	const VOL_H = 1;
	const VOL_HW = 0.075;
	/**
	 * Master gain on the volume row's COLOUR only. Its heights are untouched, so
	 * the row reads exactly as it did — see the note in `writeTape` for why it
	 * exists and how it was set.
	 *
	 * MEASURED, both sides, same method: screenshot the built page at 1440x900
	 * with `.mo-hero__inner` hidden so only the canvas and its backdrop are in
	 * frame, then take the peak and the count of pixels over luminance 120 in the
	 * volume lane's band (x 720-1400, y 490-620), three samples 3s apart.
	 *     1.0  peak 209, 213, 222   over-120  3983, 3495, 3755
	 *     0.5  peak 168, 176, 180   over-120  1590, 1669, 2884
	 * The tape's own band measures peak 248-255 either way, so at 0.5 the row is
	 * clearly subordinate to it, which is the whole claim `writeTape` makes.
	 */
	const VOL_GAIN = 0.5;
	/** Standard risk. A CONSTANT height — see the header. */
	const RISK_H = 0.55;
	/** Rail half-thickness, and the same for its glow pass. */
	const RAIL_T = 0.016;
	const RAIL_T_GLOW = 0.075;
	/** The channel is fitted to this slice only, so the newest candles can leave it. */
	const FIT_LO = 3;
	const FIT_HI = 27;
	/** Seconds for the fitted channel to catch up. Slow, so a break really breaks. */
	const CHAN_TAU = 0.9;
	/**
	 * The channel's half-width and slope are BOUNDED at both ends. Unbounded, the
	 * fit's own outliers drove them well past the tape: measured over twelve
	 * simulated minutes the rails swept y −4.62..+3.74 against a tape that only ever
	 * occupied −2.1..+3.0, so at the extremes they read as two diagonal lines
	 * crossing the frame rather than as a channel the price sits inside. The caps sit
	 * just above the measured MEANS (width 0.83, |slope| 0.182), so they shape only
	 * the outliers and leave the ordinary fit untouched.
	 */
	const CHAN_MIN_W = 0.28;
	const CHAN_MAX_W = 1;
	const CHAN_MAX_M = 0.2;
	/**
	 * How far the viewport can rise above the fitted channel before the rails have
	 * faded out, in drawn units.
	 *
	 * This exists because the channel is fitted to HISTORY: once price breaks out,
	 * the viewport follows the price and the channel is left behind and below. Held
	 * at full strength it went on being drawn straight through the volume lane
	 * (measured: the rails reached −3.29 against a lane that starts at −3.60). A
	 * channel price has left is a channel that is no longer in force, so it
	 * dissolves — which is both the honest reading and the thing that clears the
	 * lane. It comes back as soon as the fit catches up.
	 */
	const CHAN_STALE = 1.6;
	/**
	 * Seconds for the VIEWPORT to recentre on the tape.
	 *
	 * MEASURED, not assumed. Running the walk for ten simulated minutes (1,400
	 * bars) put its mean centre at +1.087 in pre-scale units and its excursions
	 * between 0.010 and 1.999 — it does not sit on zero, because the regime cycle
	 * has net positive drift, and it never will. Drawing it against a fixed origin
	 * therefore hangs the whole tape off-centre.
	 *
	 * So the scene does what every chart does: it tracks its own window. Everything
	 * priced — bodies, wicks, both rails, the risk box — is drawn relative to
	 * `viewY`, an eased centre of the visible high/low. It is deliberately SLOW, so
	 * a break visibly runs up out of the middle of the frame before the viewport
	 * eases after it: that lag is the drama, and a viewport that kept up would
	 * flatten every break into a straight line. It is not slower than this because
	 * the lag IS the tape's overshoot, and at 1.6s the break ran 5.2 units above
	 * centre and straight out of the top of the frame.
	 */
	const VIEW_TAU = 0.9;

	/** Where the tape sits and how it is turned. */
	const GROUP_Z = -4;
	const GROUP_ROT_X = 0.07;
	/**
	 * NEGATIVE, and that sign is derived rather than guessed. For a rotation θ about
	 * Y, a point at local x maps to world z = −x·sin θ. The OLDEST candle is at
	 * local x = −4.95 and must RECEDE (world z more negative, further from a camera
	 * at +z), which needs −x·sin θ < 0, i.e. sin θ < 0. So θ is negative and the
	 * NEWEST candle — local x = +4.95 — is the one nearest the lens.
	 */
	const GROUP_ROT_Y = -0.34;
	const SIN_Y = Math.sin(GROUP_ROT_Y);
	const COS_Y = Math.cos(GROUP_ROT_Y);

	/** Camera. A held shot, not a fixed lens. */
	const FOV = 58;
	const CAM_Z = 9;

	/* Local x of the tape's two ends, and the newest end's distance from the lens.
	   These drive the placement maths below; they are derived from the constants
	   above so they cannot drift out of step with them. */
	const X_END = CENTRE * PITCH;
	const D_NEAR = CAM_Z - (GROUP_Z - X_END * SIN_Y);
	/** Half the visible height, in world units, at the newest candle's depth. */
	const HALF_H_NEAR = Math.tan((FOV * 0.5 * Math.PI) / 180) * D_NEAR;
	/** Where the newest candle should land across the frame, −1..1. */
	const TARGET_NDC = 0.86;

	/**
	 * The element's aspect ratio, measured (never assumed) by the ResizeObserver in
	 * `host` below. The SSR default is the shape a 1440×760 hero has on a laptop;
	 * the first measurement replaces it before the first frame.
	 */
	let aspect = $state(1.9);
	/**
	 * A portrait hero cannot fit the tape beside the copy — the tape is 9.9 world
	 * units wide and a phone's frame is barely 7 at that depth. So on portrait the
	 * tape is CENTRED and allowed to bleed off both edges (a tape reading past the
	 * frame is honest), it drops below the headline, and the wrapper swaps to a
	 * top-down mask. One threshold drives both the JS placement and the CSS mask, so
	 * the two can never disagree.
	 */
	const portrait = $derived(aspect < 1.25);
	/**
	 * Landscape: solve for the group x that puts the NEWEST candle at TARGET_NDC.
	 * Clamped, so an extreme aspect cannot fling the tape out of the world. That
	 * lands the tape's visible run at roughly 54%–93% of the frame width, right of
	 * the h1 — and the wrapper's own mask fades whatever crosses under the copy.
	 */
	const groupX = $derived(
		portrait ? 0 : clamp(TARGET_NDC * HALF_H_NEAR * aspect - X_END * COS_Y, 3.6, 7.2)
	);
	/**
	 * The composition — price band plus the volume lane under it — MEASURES −3.60 to
	 * +3.00 in drawn units, so its own centre sits 0.30 below the price line. These
	 * two numbers place that centre in the frame: a touch above the middle in
	 * landscape (the tape then spans roughly 19%–72% of the frame height), and low
	 * down in portrait, where it has to clear the whole stack of copy.
	 */
	const groupY = $derived(portrait ? -2.47 : 0.85);

	/* ======================================================================
	   THE WALK.

	   A five-regime machine, each regime named for the lesson it draws. Seeded
	   LCG lifted verbatim from CorridorScene:142-146, so the tape is IDENTICAL on
	   every machine, every reload and between server and client — the same reason
	   CurriculumScene hashes its module titles rather than calling Math.random
	   (CurriculumScene.svelte:16-22).
	   ====================================================================== */
	let seed = 20260813;
	function rand() {
		seed = (seed * 1664525 + 1013904223) | 0;
		return ((seed >>> 8) & 0xffffff) / 0xffffff;
	}

	const R_BASE = 0;
	const R_TREND = 1;
	const R_STUFF = 2;
	const R_BREAK = 3;
	const R_COOL = 4;

	/*
	 * Per PRINTED BAR, in world units — the same unit as the candle bodies, which
	 * is what makes these numbers legible against a body 0.184 wide. MEASURED mean
	 * printed body height, over twelve simulated minutes: base 0.17, trend 0.24,
	 * break 0.45. `base` is deliberately about as tall as it is wide — chop reads as
	 * squares — and the first cut had it at 0.10, which printed dashes, not candles.
	 *
	 * `PULL` is a mean reversion, and it is THE BOUND on this process — there is
	 * deliberately no hard clamp. A clamp was written first (the
	 * CorridorScene:161-168 soft-reflect idiom) and measurement retired it: it fired
	 * zero times in 1,400 bars, which makes it dead scaffolding.
	 *
	 * ⚠ THE PULL IS ANCHORED TO `viewY`, NOT TO ZERO, and that is load-bearing.
	 * Anchored to zero it is a force proportional to the ABSOLUTE level, so once the
	 * walk settled at its natural equilibrium (measured: +1.087) every `base` bar
	 * carried a systematic downward term LARGER than its own noise, and "base"
	 * printed as a steady decline rather than as chop. Anchored to the viewport it
	 * acts only on the departure from the tape's own recent centre — which is both
	 * the honest behaviour and precisely the quantity that has to stay inside the
	 * frame. It is weakest during the break, so a break is allowed to actually run.
	 */
	const DRIFT = [0, 0.14, 0, 0.4, -0.1];
	const VOLAT = [0.34, 0.4, 0.4, 0.52, 0.3];
	const PULL = [0.14, 0.1, 0.1, 0.05, 0.22];

	let regime = R_BASE;
	let regimeT = 0;
	let regimeDur = 2.4;

	/* The forming bar. */
	let barT = 0;
	let barOpen = 0;
	let barClose = 0;
	let wobA = 0;
	let wobP = 0;
	let volSeed = 0.2;
	/** The stuff candle's two shape parameters, set on entering that regime. */
	let stuffAmp = 0;
	let stuffDip = 0;

	/* The printed tape. Slot CANDLES-1 is the bar currently forming. */
	const cOpen = new Float32Array(CANDLES);
	const cClose = new Float32Array(CANDLES);
	const cHigh = new Float32Array(CANDLES);
	const cLow = new Float32Array(CANDLES);
	const cVolume = new Float32Array(CANDLES);

	/**
	 * The viewport's centre, in price units. Every priced y is drawn relative to
	 * this — see `yd` and the note on VIEW_TAU.
	 */
	let viewY = 0;
	let viewSet = false;

	/** The fitted channel, in the same shifting local-x space as the candles. */
	let railM = 0;
	let railB = 0;
	let railW = CHAN_MIN_W;
	let railFitted = false;
	/** Fires to 1 on the bar CLOSE that breaks the upper rail, then decays. */
	let railHeat = 0;
	/** Hysteresis latch for that test — see the note where it is armed. */
	let wasAbove = false;

	/** The standard risk box. */
	let riskAlpha = 0;
	let riskTop = 0;
	/** The box's left edge as a FRACTIONAL candle index, so it slides with the tape. */
	let riskAnchor = CANDLES - 1;

	/** The one camera event: a short dolly in on the break. */
	let dollyT = -1;

	function enterRegime(next: number) {
		regime = next;
		regimeT = 0;
		if (next === R_BASE) regimeDur = 2.2 + rand() * 0.9;
		else if (next === R_TREND) regimeDur = 3.4 + rand() * 1.2;
		else if (next === R_STUFF) {
			// Exactly ONE candle: a wick of vol × 5.2 over a close back under the open
			// (live-momentum-course.txt:161). MEASURED across 64 of them: a 2.08 wick
			// over a 0.22 body. `regimeDur` is deliberately NOT set here — this regime
			// is counted in bars, not seconds, and the transition below short-circuits
			// on the regime itself, so a duration would be a value nothing reads.
			stuffAmp = VOLAT[R_TREND] * 5.2;
			stuffDip = VOLAT[R_TREND] * 0.55;
		} else if (next === R_BREAK) {
			regimeDur = 1.6 + rand() * 0.5;
			riskTop = barOpen;
			riskAnchor = CANDLES - 1;
			dollyT = 0;
		} else regimeDur = 1.4;
	}

	/** Start a fresh bar at the newest slot. */
	function openBar(open: number) {
		barT = 0;
		barOpen = open;
		if (regime === R_STUFF) {
			barClose = open - stuffDip;
		} else {
			barClose =
				open + DRIFT[regime] + (rand() * 2 - 1) * VOLAT[regime] - (open - viewY) * PULL[regime];
		}
		wobA = VOLAT[regime] * (0.3 + rand() * 0.55);
		wobP = rand();
		volSeed = 0.1 + rand() * 0.14;
		cOpen[CANDLES - 1] = open;
		cClose[CANDLES - 1] = open;
		cHigh[CANDLES - 1] = open;
		cLow[CANDLES - 1] = open;
		cVolume[CANDLES - 1] = volSeed;
	}

	/** Price inside the forming bar, at fraction `f` of the way through it. */
	function priceAt(f: number) {
		if (regime === R_STUFF) {
			// Up hard, all the way back, then a shade under the open: one long upper
			// wick, a small body, no lower wick.
			const rise = Math.sin(Math.PI * Math.min(1, f / 0.72));
			const d = clamp01((f - 0.72) / 0.28);
			return barOpen + stuffAmp * rise - stuffDip * (d * d * (3 - 2 * d));
		}
		const s = f * f * (3 - 2 * f);
		// The wobble envelope is zero at both ends, so the open and the close are
		// exact and only the high and the low are ever wobble.
		const wob = wobA * Math.sin((f * 2.4 + wobP) * Math.PI * 2) * Math.sin(Math.PI * f);
		return barOpen + (barClose - barOpen) * s + wob;
	}

	/** Local x of candle `i`, slid by the fraction of the bar in progress. */
	function xOf(i: number) {
		return (i - CENTRE - clamp01(barT / BAR)) * PITCH;
	}

	/** Depth + far-end dissolve, folded into one gain per candle. */
	function fadeOf(i: number) {
		const dep = i / (CANDLES - 1);
		return (0.34 + 0.66 * dep) * clamp01(i / 3.5);
	}

	/** A price, in the drawn space. The ONE place the viewport is applied. */
	function yd(v: number) {
		return v - viewY;
	}

	/** Ease the viewport onto the centre of the visible high/low. */
	function trackView(dt: number) {
		let hi = cHigh[FIT_LO];
		let lo = cLow[FIT_LO];
		for (let i = FIT_LO + 1; i < CANDLES; i++) {
			if (cHigh[i] > hi) hi = cHigh[i];
			if (cLow[i] < lo) lo = cLow[i];
		}
		const centre = (hi + lo) * 0.5;
		if (!viewSet) {
			viewSet = true;
			viewY = centre;
			return;
		}
		viewY += (centre - viewY) * (1 - Math.exp(-dt / VIEW_TAU));
	}

	/** Refit the channel to the tape's HISTORY and ease the rails toward it. */
	function fitChannel(dt: number) {
		let n = 0;
		let sx = 0;
		let sy = 0;
		let sxx = 0;
		let sxy = 0;
		for (let i = FIT_LO; i <= FIT_HI; i++) {
			const x = xOf(i);
			const y = cClose[i];
			n++;
			sx += x;
			sy += y;
			sxx += x * x;
			sxy += x * y;
		}
		const den = n * sxx - sx * sx;
		if (den === 0) return;
		// The slope is capped BEFORE the intercept is taken from it, so the capped
		// line still passes through the window's centroid — `(sy - m * sx) / n` is
		// mean(y) − m·mean(x). Taking the intercept from the uncapped slope instead
		// would leave the drawn rails offset from the candles they are fitted to.
		const m = clamp((n * sxy - sx * sy) / den, -CHAN_MAX_M, CHAN_MAX_M);
		const b = (sy - m * sx) / n;
		// RMS of the residuals, NOT the largest one. Sized off the largest residual,
		// the rails were permanently as wide as the worst candle in the window — so a
		// single leftover spike held them open long after it had aged out, and NOTHING
		// ever crossed them. Measured: zero crossings in twelve simulated minutes.
		let sq = 0;
		for (let i = FIT_LO; i <= FIT_HI; i++) {
			const r = cClose[i] - (m * xOf(i) + b);
			sq += r * r;
		}
		const w = clamp(Math.sqrt(sq / n) * 1.9, CHAN_MIN_W, CHAN_MAX_W);
		if (!railFitted) {
			railFitted = true;
			railM = m;
			railB = b;
			railW = w;
			return;
		}
		// Frame-rate independent easing: the same glide at 60Hz and at 120Hz.
		const k = 1 - Math.exp(-dt / CHAN_TAU);
		railM += (m - railM) * k;
		railB += (b - railB) * k;
		railW += (w - railW) * k;
	}

	/** One simulation step. Writes no geometry — see `writeAll`. */
	function advance(dt: number) {
		regimeT += dt;
		barT += dt;

		const f = barT / BAR;
		if (f >= 1) {
			// Commit the bar exactly on its close, shift the tape one slot toward the
			// older end, and open the next bar. `copyWithin` leaves the last slot
			// duplicated; `openBar` overwrites it (CorridorScene:170 idiom).
			const over = barT - BAR;
			const close = barClose;
			cClose[CANDLES - 1] = close;
			if (close > cHigh[CANDLES - 1]) cHigh[CANDLES - 1] = close;
			if (close < cLow[CANDLES - 1]) cLow[CANDLES - 1] = close;

			// THE RAIL FLARE, tested HERE and only here: a channel break is a bar
			// event, not a tick event — a candle CLOSES outside the channel. Tested
			// every frame against the live price it fired 189 times in twelve
			// simulated minutes, several times per break, and the rail strobed
			// instead of marking the moment. The hysteresis below is the second half
			// of the same fix: the close has to come back a third of the channel's
			// width inside the rail before another break can be flagged.
			const rail = railB + railM * xOf(CANDLES - 1) + railW;
			if (!wasAbove && close > rail) {
				railHeat = 1;
				wasAbove = true;
			} else if (wasAbove && close < rail - railW * 0.33) {
				wasAbove = false;
			}

			cOpen.copyWithin(0, 1);
			cClose.copyWithin(0, 1);
			cHigh.copyWithin(0, 1);
			cLow.copyWithin(0, 1);
			cVolume.copyWithin(0, 1);
			if (riskAnchor > -CANDLES) riskAnchor -= 1;

			barOpen = close;
			// base -> trend -> stuff (exactly one candle) -> break -> cool -> base.
			if (regime === R_STUFF || regimeT >= regimeDur) {
				enterRegime(
					regime === R_BASE
						? R_TREND
						: regime === R_TREND
							? R_STUFF
							: regime === R_STUFF
								? R_BREAK
								: regime === R_BREAK
									? R_COOL
									: R_BASE
				);
			}
			openBar(close);
			// Carry the overshoot instead of discarding it, or the tape prints very
			// slightly slower than BAR and the cadence drifts over a long session.
			barT = over > 0 ? over : 0;
		} else {
			const p = priceAt(f);
			const last = CANDLES - 1;
			cClose[last] = p;
			if (p > cHigh[last]) cHigh[last] = p;
			if (p < cLow[last]) cLow[last] = p;
			// Volume grows with the body, so the break's bars are the tall ones.
			cVolume[last] = clamp01(volSeed + (Math.abs(p - barOpen) / SPEED_REF) * 0.85);
		}

		fitChannel(dt);
		trackView(dt);

		// The flare itself decays every frame; it is only ARMED on a bar close, above.
		railHeat *= Math.exp(-dt * 2.4);

		// The standard risk box: 0.35s in on the break, 0.6s out when it ends.
		if (regime === R_BREAK) riskAlpha = Math.min(1, riskAlpha + dt / 0.35);
		else riskAlpha = Math.max(0, riskAlpha - dt / 0.6);

		if (dollyT >= 0) {
			dollyT += dt;
			if (dollyT > 1.7) dollyT = -1;
		}
	}

	/** The dolly's shape: in over 0.5s, back out over the 1.2s that follow. */
	function dollyAt() {
		if (dollyT < 0) return 0;
		const u = dollyT < 0.5 ? dollyT / 0.5 : 1 - (dollyT - 0.5) / 1.2;
		const s = clamp01(u);
		return 0.6 * s * s * (3 - 2 * s);
	}

	/* ======================================================================
	   GEOMETRY. Nine BufferGeometries, every array allocated ONCE here and
	   rewritten in place — CorridorScene:74-104, 174-190.
	   ====================================================================== */

	/** One geometry and the two typed arrays that are rewritten into it each frame. */
	interface Buffers {
		geo: BufferGeometry;
		pos: Float32Array;
		col: Float32Array;
	}

	/** Build an indexed quad geometry: `n` quads, 4 verts and 6 indices each. */
	function quads(n: number): Buffers {
		const geo = new BufferGeometry();
		const pos = new Float32Array(n * 12);
		const col = new Float32Array(n * 12);
		const idx = new Uint16Array(n * 6);
		for (let i = 0, o = 0; i < n; i++) {
			const a = i * 4;
			idx[o++] = a;
			idx[o++] = a + 1;
			idx[o++] = a + 2;
			idx[o++] = a;
			idx[o++] = a + 2;
			idx[o++] = a + 3;
		}
		geo.setAttribute('position', new BufferAttribute(pos, 3));
		// ⚠ The colour attribute is set HERE, in the same place as the positions, and
		// is written in the same loop as them below. A `vertexColors` material whose
		// geometry has no colour attribute renders BLACK under additive blending —
		// i.e. invisible, which looks exactly like "the scene failed to load".
		geo.setAttribute('color', new BufferAttribute(col, 3));
		geo.setIndex(new BufferAttribute(idx, 1));
		return { geo, pos, col };
	}

	/** Build a line-segment geometry: `n` segments, 2 verts each. */
	function segments(n: number): Buffers {
		const geo = new BufferGeometry();
		const pos = new Float32Array(n * 6);
		const col = new Float32Array(n * 6);
		geo.setAttribute('position', new BufferAttribute(pos, 3));
		geo.setAttribute('color', new BufferAttribute(col, 3));
		return { geo, pos, col };
	}

	/**
	 * ⛔ ADDITIVE, AND IT MUST NEVER WRITE THE DESTINATION ALPHA. This is
	 * `AdditiveBlending` for the colour channels and a HARD NO-OP for the alpha
	 * channel, and the second half is not a refinement — without it this scene
	 * punches black holes through the hero.
	 *
	 * WHY, from three's own source. Threlte's renderer is created with
	 * `alpha: true` (@threlte/core 8.5.16 context/fragments/renderer.svelte.js:19-24),
	 * so this canvas is a TRANSPARENT surface composited over the hero's grid and
	 * red glow. `AdditiveBlending` on a material whose `premultipliedAlpha` is
	 * false — the default — resolves to
	 * `gl.blendFuncSeparate(SRC_ALPHA, ONE, ONE, ONE)`
	 * (three 0.185 src/renderers/webgl/WebGLState.js:678-680). Read the last two
	 * factors: the ALPHA channel is `srcA * 1 + dstA * 1`, and `srcA` is
	 * `material.opacity`, which knows nothing about the vertex colour. So every
	 * quad drove the canvas alpha to 1 over its whole area whatever it drew, and
	 * the browser then composited that as `srcRGB + (1 - 1) * page` — the page
	 * BEHIND it deleted.
	 *
	 * MEASURED on the production build before this fix, sampling the row through
	 * the risk box at 1440x900: the hero's own red glow read (50,17,17) either
	 * side of the box and (0,0,0) inside it. Over a white test backdrop the same
	 * box read a solid 0 across ~480x50px. The wicks and the volume lane were
	 * flat-shaded for the same reason, and the far-end depth dissolve — which
	 * fades a candle's colour to zero at `fadeOf(0)` — turned to black instead of
	 * to nothing.
	 *
	 * `blendSrcAlpha: ZeroFactor, blendDstAlpha: OneFactor` leaves the alpha
	 * channel at the renderer's clear value of 0 everywhere, so the composite is
	 * `srcRGB + (1 - 0) * page` — light ADDED to the page, which is what an
	 * additive pass is supposed to mean and what every comment in this file has
	 * always claimed it did. A colour of zero now genuinely contributes nothing.
	 * `ZeroFactor` is 200, not 0 (three src/constants.js:212), so it survives
	 * WebGLState's `blendSrcAlpha || blendSrc` defaulting at line 717.
	 *
	 * `blendSrc: SrcAlphaFactor` is kept, so `opacity` still scales the colour of
	 * the two bloom shells and the channel's glow pass exactly as before.
	 */
	const ADD = {
		transparent: true,
		blending: CustomBlending,
		blendEquation: AddEquation,
		blendSrc: SrcAlphaFactor,
		blendDst: OneFactor,
		blendEquationAlpha: AddEquation,
		blendSrcAlpha: ZeroFactor,
		blendDstAlpha: OneFactor,
		depthWrite: false
	} as const;

	const body = quads(CANDLES);
	const shellA = quads(CANDLES);
	const shellB = quads(CANDLES);
	const volume = quads(CANDLES);
	const rails = quads(2);
	const railGlow = quads(2);
	const riskFill = quads(1);
	/* 1px is the right weight for a wick. The `linewidth` trap CorridorScene:110-114
	   documents applies to a RIBBON that needed real width, not to a hairline that
	   wants to be one. */
	const wicks = segments(CANDLES);
	const riskEdge = segments(4);

	/** Write one axis-aligned quad, corners TL, TR, BR, BL. Allocates nothing. */
	function putQuad(
		buf: Buffers,
		q: number,
		x0: number,
		x1: number,
		y0: number,
		y1: number,
		r: number,
		g: number,
		b: number
	) {
		const o = q * 12;
		const pos = buf.pos;
		pos[o] = x0;
		pos[o + 1] = y1;
		pos[o + 2] = 0;
		pos[o + 3] = x1;
		pos[o + 4] = y1;
		pos[o + 5] = 0;
		pos[o + 6] = x1;
		pos[o + 7] = y0;
		pos[o + 8] = 0;
		pos[o + 9] = x0;
		pos[o + 10] = y0;
		pos[o + 11] = 0;
		for (let v = 0; v < 4; v++) {
			const c = o + v * 3;
			buf.col[c] = r;
			buf.col[c + 1] = g;
			buf.col[c + 2] = b;
		}
	}

	/** Write one line segment, both ends the same colour. Allocates nothing. */
	function putSeg(
		buf: Buffers,
		s: number,
		x0: number,
		y0: number,
		x1: number,
		y1: number,
		r: number,
		g: number,
		b: number
	) {
		const o = s * 6;
		buf.pos[o] = x0;
		buf.pos[o + 1] = y0;
		buf.pos[o + 2] = 0;
		buf.pos[o + 3] = x1;
		buf.pos[o + 4] = y1;
		buf.pos[o + 5] = 0;
		for (let v = 0; v < 2; v++) {
			const c = o + v * 3;
			buf.col[c] = r;
			buf.col[c + 1] = g;
			buf.col[c + 2] = b;
		}
	}

	/** The tape: bodies, both bloom shells, wicks and the volume row, in one pass. */
	function writeTape() {
		for (let i = 0; i < CANDLES; i++) {
			const x = xOf(i);
			const o = cOpen[i];
			const c = cClose[i];
			let top = yd(o > c ? o : c);
			let bot = yd(o > c ? c : o);
			if (top - bot < MIN_BODY) {
				const m = (top + bot) * 0.5;
				top = m + MIN_BODY * 0.5;
				bot = m - MIN_BODY * 0.5;
			}
			const heat = clamp01(Math.abs(c - o) / SPEED_REF);
			const fade = fadeOf(i);
			// Speed, not direction. A fast candle is both redder AND brighter; the
			// gain runs past 1 on purpose, because ACES tone mapping rolls the
			// overshoot off into a glow instead of clipping it to flat white.
			const gain = (0.8 + heat * 1.45) * fade;
			const r = (C_BODY.r + (C_HOT.r - C_BODY.r) * heat) * gain;
			const g = (C_BODY.g + (C_HOT.g - C_BODY.g) * heat) * gain;
			const b = (C_BODY.b + (C_HOT.b - C_BODY.b) * heat) * gain;

			putQuad(body, i, x - BODY_HW, x + BODY_HW, bot, top, r, g, b);

			// The two bloom shells, inflated about THIS candle's own centre.
			const cy = (top + bot) * 0.5;
			const hh = (top - bot) * 0.5;
			const aw = BODY_HW * 2.1;
			const ah = hh * 1.5 + 0.03;
			putQuad(shellA, i, x - aw, x + aw, cy - ah, cy + ah, r, g, b);
			const bw = BODY_HW * 3.8;
			const bh = hh * 2.2 + 0.075;
			putQuad(shellB, i, x - bw, x + bw, cy - bh, cy + bh, r, g, b);

			// Wick, high to low. On a stuff candle this is the whole point of the
			// candle: a long spike above a small body (live-momentum-course.txt:161).
			const wg = 0.62 * fade;
			putSeg(
				wicks,
				i,
				x,
				yd(cHigh[i]),
				x,
				yd(cLow[i]),
				C_WICK.r * wg,
				C_WICK.g * wg,
				C_WICK.b * wg
			);

			// Volume row. HEIGHT IS THE READ — the colour only has to be enough to see
			// the bar by, because the row must not compete for attention with either
			// the tape above it or the hero's own copy in front of it.
			//
			// `VOL_GAIN` is what makes the second half of that true, and it is set
			// from a measurement rather than from taste. This lane runs behind the
			// hero's "What's inside" link (its box measures 114x20 at 1440x900), whose
			// text is `--tt-fog` — #c9cbd3, luminance 201. Ungained, the brightest
			// bars sampled 222 across the lane and 189 inside that link's own box:
			// background within 6% of the link text's own brightness, directly behind
			// it. The gain drops the lane's peak to 168-180 and roughly halves the
			// pixels it puts over luminance 120 (numbers on VOL_GAIN).
			//
			// HONEST RESIDUAL: this does not clear the link, it subordinates it. The
			// bars move, so on any given frame a tall one can still cross the text —
			// the worst of three samples still read 166 behind the glyphs. What it
			// buys is that the link is now plainly the brighter of the two. Clearing
			// the lane completely would mean moving the tape, not dimming it.
			const vol = cVolume[i];
			const vg = VOL_GAIN * (0.26 + 0.6 * vol) * fade;
			putQuad(
				volume,
				i,
				x - VOL_HW,
				x + VOL_HW,
				VOL_Y,
				VOL_Y + VOL_H * vol,
				C_WICK.r * vg,
				C_WICK.g * vg,
				C_WICK.b * vg
			);
		}
	}

	/** The trading channel: two parallel rails plus one glow pass. */
	function writeChannel() {
		const xL = xOf(0) - PITCH * 0.5;
		const xR = xOf(CANDLES - 1) + PITCH * 0.5;
		const yL = yd(railB + railM * xL);
		const yR = yd(railB + railM * xR);
		// The flare, less however far the viewport has walked away from the channel.
		const stale = clamp01(Math.abs((yL + yR) * 0.5) / CHAN_STALE);
		const gain = (0.55 + 0.95 * railHeat) * (1 - 0.8 * stale);
		// The fade is per VERTEX, not per rail: the rails have to dissolve into the
		// far end on the same ramp the candles do, or they read as a hard edge that
		// the tape merely stops at. That, plus the fact that a rail is SLOPED (its
		// two ends sit at different heights), is why these two quads are written by
		// hand rather than through `putQuad`, which takes one colour and one y pair.
		// Corner order is kept identical to putQuad's — TL, TR, BR, BL — so verts 0
		// and 3 are the old end and verts 1 and 2 are the new one.
		const fL = fadeOf(0) * gain;
		const fR = fadeOf(CANDLES - 1) * gain;
		// Vertical thickness, not perpendicular: the slope stays gentle enough that
		// the two read the same, and this costs no trig.
		for (let s = 0; s < 2; s++) {
			const off = s === 0 ? railW : -railW;
			const o = s * 12;
			const p = rails.pos;
			p[o] = xL;
			p[o + 1] = yL + off + RAIL_T;
			p[o + 2] = 0;
			p[o + 3] = xR;
			p[o + 4] = yR + off + RAIL_T;
			p[o + 5] = 0;
			p[o + 6] = xR;
			p[o + 7] = yR + off - RAIL_T;
			p[o + 8] = 0;
			p[o + 9] = xL;
			p[o + 10] = yL + off - RAIL_T;
			p[o + 11] = 0;
			const q = railGlow.pos;
			q[o] = xL;
			q[o + 1] = yL + off + RAIL_T_GLOW;
			q[o + 2] = 0;
			q[o + 3] = xR;
			q[o + 4] = yR + off + RAIL_T_GLOW;
			q[o + 5] = 0;
			q[o + 6] = xR;
			q[o + 7] = yR + off - RAIL_T_GLOW;
			q[o + 8] = 0;
			q[o + 9] = xL;
			q[o + 10] = yL + off - RAIL_T_GLOW;
			q[o + 11] = 0;
			for (let v = 0; v < 4; v++) {
				const c = o + v * 3;
				const k = v === 0 || v === 3 ? fL : fR;
				const cr = C_RAIL.r * k;
				const cg = C_RAIL.g * k;
				const cb = C_RAIL.b * k;
				rails.col[c] = cr;
				rails.col[c + 1] = cg;
				rails.col[c + 2] = cb;
				railGlow.col[c] = cr;
				railGlow.col[c + 1] = cg;
				railGlow.col[c + 2] = cb;
			}
		}
	}

	/**
	 * The standard risk box: a fixed-height rectangle sitting under the entry.
	 *
	 * The alpha lives in the vertex COLOURS rather than in a material opacity —
	 * under additive blending a colour of zero contributes nothing, so at rest this
	 * box is genuinely absent rather than drawn-but-invisible, and its alpha can be
	 * animated without touching a Threlte-owned material prop every frame.
	 */
	function writeRisk() {
		const anchor = clamp(riskAnchor, 0, CANDLES - 1);
		const a = riskAlpha * fadeOf(anchor);
		const x0 = (riskAnchor - CENTRE - clamp01(barT / BAR)) * PITCH;
		const x1 = xOf(CANDLES - 1) + BODY_HW * 1.8;
		const y1 = yd(riskTop);
		const y0 = y1 - RISK_H;
		const fg = 0.09 * a;
		putQuad(riskFill, 0, x0, x1, y0, y1, C_RISK.r * fg, C_RISK.g * fg, C_RISK.b * fg);
		const eg = 0.42 * a;
		const er = C_RISK.r * eg;
		const ey = C_RISK.g * eg;
		const eb = C_RISK.b * eg;
		// The four edges, written out one at a time. An array of corner coordinates
		// would read better and would be a fresh allocation on every single frame.
		putSeg(riskEdge, 0, x0, y1, x1, y1, er, ey, eb);
		putSeg(riskEdge, 1, x1, y1, x1, y0, er, ey, eb);
		putSeg(riskEdge, 2, x1, y0, x0, y0, er, ey, eb);
		putSeg(riskEdge, 3, x0, y0, x0, y1, er, ey, eb);
	}

	const touched = [
		body.geo,
		shellA.geo,
		shellB.geo,
		volume.geo,
		wicks.geo,
		rails.geo,
		railGlow.geo,
		riskFill.geo,
		riskEdge.geo
	];

	function writeAll() {
		writeTape();
		writeChannel();
		writeRisk();
		for (let i = 0; i < touched.length; i++) {
			const g = touched[i];
			g.attributes.position.needsUpdate = true;
			g.attributes.color.needsUpdate = true;
		}
	}

	/** Seed the tape so the very first painted frame is already full. */
	function prefill() {
		enterRegime(R_BASE);
		openBar(0);
		// Enough steps to print every slot at least once.
		const steps = Math.ceil((CANDLES + 2) * BAR * 60);
		for (let i = 0; i < steps; i++) advance(1 / 60);
	}
	if (browser) {
		prefill();
		writeAll();
	}

	let camX = $state(0);
	let camY = $state(0);
	let camZ = $state(CAM_Z);
	let roll = $state(0);
	let t = 0;
	/** Plain locals: read only inside callbacks, never in the markup. */
	let onScreen = true;

	/** One frame. Handed the clamped delta by CorridorTicker. */
	function frame(dt: number) {
		// Off-screen the scene stops simulating AND stops writing the camera, which
		// leaves the frame un-invalidated, so `on-demand` stops rendering too.
		if (!onScreen) return;
		t += dt;
		advance(dt);
		writeAll();
		camX = Math.sin(t * 0.21) * 0.7;
		camY = Math.cos(t * 0.17) * 0.42;
		roll = Math.sin(t * 0.15) * 0.03;
		camZ = CAM_Z - dollyAt();
	}

	/**
	 * THE COMPOSED STILL — the whole scene in one frame, for reduced motion.
	 *
	 * It advances the same deterministic walk until every beat is on screen at once:
	 * mid-break, with the risk box fully open and the channel rail still lit from
	 * the close that broke it. Because the walk is seeded, that frame is the SAME
	 * frame on every machine, and it is a real state of this scene rather than a
	 * special-cased drawing. MEASURED with this seed: it arrives at step 882, 14.7
	 * simulated seconds, with the flare at 0.96 and the dolly at 0.57 — 33 of the 34
	 * candles carrying a body, all 34 a wick, all 34 a volume bar.
	 *
	 * The 3,000-step bound is a loop guard, not a fallback: it is nearly four times
	 * the measured cost, and it exists so that changing a constant above can never
	 * turn this into a hang.
	 *
	 * ⚠ SUGGESTION DELIBERATELY NOT TAKEN: svelte-autofixer flags the writes to
	 * `camX`/`camY`/`roll`/`camZ` here and suggests `$derived`. They cannot be
	 * derived — they are one composed camera pose for a one-shot still, not a
	 * function of any reactive input. `advance` and `writeAll` touch only plain
	 * locals and typed arrays, never a rune, and this effect reads none of what it
	 * writes, so there is no cycle. Same shape as CorridorScene:209-220.
	 *
	 * Composed inside an effect so it also fires when the preference is synced after
	 * init, `settled` guarding it to once.
	 */
	let settled = false;
	$effect(() => {
		if (!reduced || settled) return;
		settled = true;
		for (let i = 0; i < 3000 && !(regime === R_BREAK && riskAlpha >= 1 && railHeat > 0.35); i++)
			advance(1 / 60);
		writeAll();
		// A held frame, not a reset one: the camera sits mid-breath and mid-dolly.
		camX = 0.34;
		camY = -0.16;
		roll = 0.014;
		camZ = CAM_Z - dollyAt();
	});

	/**
	 * Measures the frame (never assumes it) and parks the loop when the hero has
	 * left. `rootMargin` gives it 200px of warning so it is already running by the
	 * time it is back in shot.
	 */
	const host: Attachment<HTMLDivElement> = (node) => {
		const measure = () => {
			const r = node.getBoundingClientRect();
			if (r.width > 0 && r.height > 0) aspect = r.width / r.height;
		};
		measure();
		const ro = new ResizeObserver(measure);
		ro.observe(node);
		const io = new IntersectionObserver(
			(entries) => {
				onScreen = entries[0]?.isIntersecting ?? true;
			},
			{ rootMargin: '200px 0px' }
		);
		io.observe(node);
		return () => {
			ro.disconnect();
			io.disconnect();
		};
	};

	onDestroy(() => {
		for (let i = 0; i < touched.length; i++) touched[i].dispose();
	});
</script>

<div class="mc-market" class:is-portrait={portrait} aria-hidden="true" {@attach host}>
	<Canvas toneMapping={ACESFilmicToneMapping} dpr={[1, 2]}>
		<T.PerspectiveCamera
			makeDefault
			fov={FOV}
			near={0.1}
			far={100}
			position={[camX, camY, camZ]}
			rotation={[0, 0, roll]}
		/>

		<T.Group position={[groupX, groupY, GROUP_Z]} rotation={[GROUP_ROT_X, GROUP_ROT_Y, 0]}>
			<!-- The volume row, farthest back in the stack so the tape always wins. -->
			<T.Mesh geometry={volume.geo} frustumCulled={false}>
				<T.MeshBasicMaterial vertexColors side={DoubleSide} {...ADD} />
			</T.Mesh>

			<!-- The trading channel: glow pass under the rails themselves. -->
			<T.Mesh geometry={railGlow.geo} frustumCulled={false}>
				<T.MeshBasicMaterial vertexColors opacity={0.14} side={DoubleSide} {...ADD} />
			</T.Mesh>
			<T.Mesh geometry={rails.geo} frustumCulled={false}>
				<T.MeshBasicMaterial vertexColors side={DoubleSide} {...ADD} />
			</T.Mesh>

			<!-- The standard risk box. Its alpha lives in the vertex colours, so at
			     rest it contributes nothing at all — see the note on `ADD` for the
			     blend state that finally makes that sentence true. -->
			<T.Mesh geometry={riskFill.geo} frustumCulled={false}>
				<T.MeshBasicMaterial vertexColors side={DoubleSide} {...ADD} />
			</T.Mesh>
			<T.LineSegments geometry={riskEdge.geo} frustumCulled={false}>
				<T.LineBasicMaterial vertexColors {...ADD} />
			</T.LineSegments>

			<!-- Wicks, then the two bloom shells, then the bodies on top. -->
			<T.LineSegments geometry={wicks.geo} frustumCulled={false}>
				<T.LineBasicMaterial vertexColors {...ADD} />
			</T.LineSegments>
			<T.Mesh geometry={shellB.geo} frustumCulled={false}>
				<T.MeshBasicMaterial vertexColors opacity={0.05} side={DoubleSide} {...ADD} />
			</T.Mesh>
			<T.Mesh geometry={shellA.geo} frustumCulled={false}>
				<T.MeshBasicMaterial vertexColors opacity={0.16} side={DoubleSide} {...ADD} />
			</T.Mesh>
			<T.Mesh geometry={body.geo} frustumCulled={false}>
				<T.MeshBasicMaterial vertexColors side={DoubleSide} {...ADD} />
			</T.Mesh>
		</T.Group>

		{#if !reduced}
			<CorridorTicker step={frame} />
		{/if}
	</Canvas>
</div>

<style>
	.mc-market {
		position: absolute;
		inset: 0;
		overflow: hidden;
		/* The scene sits under the hero copy and must never take a click from the
		   enrol CTA. CorridorScene's own wrapper omits this and is safe only by
		   z-index ordering; this one does not rely on that. */
		pointer-events: none;
		/* The mask is what keeps the headline legible: the tape fades out entirely
		   before it reaches the h1's column. `#000` here is an ALPHA STENCIL, not a
		   colour — only the alpha channel of a mask image is read, so there is no
		   site token to use and nothing to keep in step with app.css. Same shape and
		   same prefix order as sections/Hero.svelte:151-158. */
		-webkit-mask-image: linear-gradient(100deg, transparent 26%, #000 62%);
		mask-image: linear-gradient(100deg, transparent 26%, #000 62%);
	}

	/* Portrait: the tape is centred and bleeds off both edges (see `portrait` in
	   the script), so the mask has to run top-down instead — it clears the band the
	   headline occupies and lets the tape read low, behind the CTA and the figures. */
	.mc-market.is-portrait {
		-webkit-mask-image: linear-gradient(180deg, transparent 26%, #000 66%);
		mask-image: linear-gradient(180deg, transparent 26%, #000 66%);
		opacity: 0.55;
	}

	.mc-market :global(canvas) {
		display: block;
		width: 100% !important;
		height: 100% !important;
	}
</style>
