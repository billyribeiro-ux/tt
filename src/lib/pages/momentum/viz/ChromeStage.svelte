<script lang="ts">
	/**
	 * ChromeStage — the Overture's background "room" for /momentum.
	 *
	 * WHAT IT IS. A dark brushed-metal ground plane behind a perforated carbon dot
	 * field, lit by one travelling white key light (the chrome specular), one
	 * neutral ambient, and one low cyan rim. It reproduces the MOTIF measured in
	 * momentum-course-1920.png — black perforated carbon mesh, vignetted, with a
	 * chrome specular and a cyan accent — and nothing else.
	 *
	 * WHAT IT IS NOT. It never rasterises the brand mark. The chrome MOMENTUM
	 * wordmark stays an HTML <img> layered above this canvas by Overture.svelte, so
	 * it is crisp, selectable by alt text, indexable, and survives a WebGL failure.
	 * The 3D is the room; the mark is the subject.
	 *
	 * EVIDENCE. Every colour constant below carries its locator. CAPTURED values
	 * were sampled from the downloaded reference PNGs (per the direction brief's
	 * pixel sampling — see the honest gap noted at COLOURS). Geometry, camera,
	 * light intensities, spacing and tone mapping are NOT captured: the reference
	 * capture contains no Elementor CSS and no 3D of any kind. They are this
	 * page's own inference from the measured motif and are labelled as such.
	 *
	 * THRELTE. This is the first Threlte mount in the repo (@threlte/core 8.5.16 is
	 * installed but was unimported anywhere under src/). Threlte is used rather
	 * than the imperative NeuralScene.svelte precedent because it owns the
	 * renderer's lifecycle: createRendererContext (renderer.svelte.js) calls
	 * renderer.setAnimationLoop(null) and renderer.dispose() in its own unmount
	 * effect, and createDisposalContext (disposal.svelte.js) disposes every
	 * <T>-mounted disposable. NeuralScene's teardown disposes only the Timer and
	 * the renderer — not one geometry or material — and the stack rules forbid
	 * repeating that. We ALSO dispose every geometry and material explicitly here,
	 * because the ones passed through `args` are constructed by this component and
	 * are not owned by Threlte's disposal map.
	 *
	 * SINGLE-FILE CONSTRAINT — a deliberate, documented divergence from the viz
	 * spec. The spec asks for `renderMode="on-demand"` driven by `useTask` +
	 * `invalidate()`, and `renderMode="manual"` plus exactly one `advance()` under
	 * reduced motion. Those three functions come from `useThrelte()` / `useTask()`,
	 * which call `getContext` and therefore only work inside a component that is a
	 * CHILD of <Canvas>. This agent owns exactly one file, so no child component
	 * exists to call them from. The equivalent behaviour is achieved with the
	 * documented Canvas props instead:
	 *   - animating (motion allowed AND in view AND not failed) -> renderMode="always".
	 *   - otherwise -> renderMode="on-demand". Threlte's scheduler starts with
	 *     frameInvalidated = true and useProps() calls invalidate() on every prop
	 *     write (scheduler.svelte.js, useProps.svelte.js), so mounting composites
	 *     exactly one frame and nothing further renders until something genuinely
	 *     changes. That is strictly better than "manual": a resize still repaints
	 *     one frame instead of leaving a stretched still.
	 * No loop of any kind runs under reduced motion or off-screen.
	 */

	import { onMount } from 'svelte';
	import { browser } from '$app/env';
	import { Canvas, T } from '@threlte/core';
	import {
		ACESFilmicToneMapping,
		CircleGeometry,
		Color,
		InstancedMesh,
		Matrix4,
		Mesh,
		MeshStandardMaterial,
		PlaneGeometry
	} from 'three';
	import { ui } from '$lib/pages/momentum/state/ui.svelte';

	type Props = {
		/**
		 * Dot columns in the perforation grid. Clamped with `rows` so the instance
		 * count never exceeds MAX_DOTS (one draw call).
		 * @default 64
		 */
		columns?: number;
		/**
		 * Dot rows in the perforation grid.
		 * @default 36
		 */
		rows?: number;
		/**
		 * Seconds for one full key-light sweep cycle (left, right, back). Larger is
		 * slower. Ignored entirely under reduced motion — no loop is started.
		 * @default 8
		 */
		sweepSeconds?: number;
	};

	let { columns = 64, rows = 36, sweepSeconds = 8 }: Props = $props();

	/* ---- COLOURS ----------------------------------------------------------
	   CAPTURED values, sampled from the downloaded reference PNGs. HONEST GAP:
	   this component did not re-run the sampling; these are the direction brief's
	   measurements, and they are byte-identical to the tokens already committed in
	   momentum.css (--mo-carbon, --mo-chrome-lo, --mo-cyan) plus the specular
	   highlight, which momentum.css records in prose rather than as a token
	   because no CSS rule consumes it (it equals the repo's --tt-white). They
	   are duplicated here as hex ints because three.js takes numbers and the
	   repo's existing viz code does not read CSS custom properties (the same
	   convention BioMarketMonitor and EEGWaveform follow).                     */

	/** CAPTURED: the background field of both card images, #010101. */
	const CARBON = 0x010101;
	/** CAPTURED: the dominant shadow tone of the chrome scanline, #505356. */
	const CHROME_LO = 0x505356;
	/** CAPTURED: the chrome specular highlight, #ffffff. */
	const CHROME_HI = 0xffffff;
	/** CAPTURED: the course card's sub-line cyan, #05dafa. */
	const CYAN = 0x05dafa;
	/**
	 * NOT captured. A neutral grey between the two measured chrome tones
	 * (#505356 and #919395), specified by the direction brief's viz spec as the
	 * ambient colour. Recorded here as an inference, not a sampled pixel.
	 */
	const AMBIENT = 0x8a8d90;

	/* ---- SCENE CONSTANTS (inference, not captured) ------------------------ */

	/** Hard cap. One InstancedMesh, one draw call, whatever the props ask for. */
	const MAX_DOTS = 2400;
	/** World spacing between dot centres. */
	const DOT_SPACING = 0.25;
	/** Dot radius — 36% of the spacing, which reads as perforation, not polka dots. */
	const DOT_RADIUS = 0.045;
	/** Segments per dot. 8 is a cheap circle at this on-screen size. */
	const DOT_SEGMENTS = 8;
	/** Depth of the dot field and of the metal ground behind it. */
	const DOTS_Z = -1.5;
	const FIELD_Z = -2.4;

	type StageResources = {
		planeGeometry: PlaneGeometry;
		planeMaterial: MeshStandardMaterial;
		dotGeometry: CircleGeometry;
		dotMaterial: MeshStandardMaterial;
		field: Mesh;
		dots: InstancedMesh;
	};

	/**
	 * `bind:this` rather than the attachment NeuralScene.svelte:16-21 uses, on
	 * purpose: `onMount` registers its effect during script execution, so it runs
	 * BEFORE an element attachment's effect and would see `undefined`. `bind:this`
	 * is assigned synchronously while the DOM is created, i.e. before any effect.
	 */
	let hostEl: HTMLDivElement | undefined = $state.raw(undefined);
	let resources = $state.raw<StageResources | null>(null);
	let failed = $state(false);
	let inView = $state(true);
	/**
	 * REDUCED MOTION IS READ TWICE. `ui.reducedMotion` is written by the route's
	 * $effect, but a viz can mount before that effect syncs the store — the exact
	 * bug documented in project-alpha/viz/NeuroTradeHud.svelte:19-27. So this
	 * component also queries matchMedia directly at mount and tracks `change`.
	 */
	let systemReduced = $state(false);

	/**
	 * Resting sweep phase, deliberately off-centre so the single static frame drawn
	 * under reduced motion still shows a chrome specular lobe rather than a
	 * symmetric hotspot dead behind the wordmark.
	 */
	const REST_PHASE = 0.08;

	/** Sweep phase, 0..1. Written only by the rAF loop below. */
	let sweep = $state(REST_PHASE);

	/**
	 * Per-visit variation, following the repo pattern of folding one Math.random()
	 * seed into hand-written maths (WaveDivider.svelte:71-85) rather than replaying
	 * a fixed loop. Non-reactive on purpose: it must never restart the loop.
	 */
	const seed = browser ? Math.random() * 1000 : 0;

	const animating = $derived(
		resources !== null && !failed && inView && !systemReduced && !ui.reducedMotion
	);

	/**
	 * The travelling key light. A sine ping-pong rather than a wrapped ramp: a ramp
	 * would snap back to the left edge every cycle and read as a glitch.
	 */
	const keyPosition = $derived<[number, number, number]>([
		Math.sin(sweep * Math.PI * 2) * 9.5,
		3.2,
		5.4
	]);

	/** Deterministic value noise, the same shape as three/brainGeometry.ts:7-10. */
	function hash(n: number): number {
		const x = Math.sin(n * 127.1 + seed) * 43758.5453;
		return x - Math.floor(x);
	}

	function buildResources(): StageResources {
		// The metal ground. metalness 0.9 + no environment map means it reads as
		// near-black except where a light's specular lobe crosses it, which IS the
		// chrome travel this stage exists to produce.
		const planeGeometry = new PlaneGeometry(30, 18, 2, 2);
		const planeMaterial = new MeshStandardMaterial({
			color: CARBON,
			metalness: 0.9,
			roughness: 0.35
		});
		const field = new Mesh(planeGeometry, planeMaterial);
		field.position.z = FIELD_Z;

		// The perforation. Clamp the requested grid down to MAX_DOTS by area, then
		// clamp the instance count itself so no prop combination can exceed the cap.
		const wanted = Math.max(2, Math.round(columns)) * Math.max(2, Math.round(rows));
		const shrink = wanted > MAX_DOTS ? Math.sqrt(MAX_DOTS / wanted) : 1;
		const cols = Math.max(2, Math.floor(Math.max(2, Math.round(columns)) * shrink));
		const rowCount = Math.max(2, Math.floor(Math.max(2, Math.round(rows)) * shrink));
		const count = Math.min(cols * rowCount, MAX_DOTS);

		const dotGeometry = new CircleGeometry(DOT_RADIUS, DOT_SEGMENTS);
		const dotMaterial = new MeshStandardMaterial({
			color: CHROME_HI,
			metalness: 0.35,
			roughness: 0.45
		});
		const dots = new InstancedMesh(dotGeometry, dotMaterial, count);
		dots.position.z = DOTS_Z;
		// The field is intentionally larger than any viewport; culling it per-frame
		// against a bounding sphere it always intersects is wasted work.
		dots.frustumCulled = false;

		const matrix = new Matrix4();
		const color = new Color();
		const halfW = ((cols - 1) * DOT_SPACING) / 2;
		const halfH = ((rowCount - 1) * DOT_SPACING) / 2;
		const maxDist = Math.hypot(halfW, halfH) || 1;

		for (let i = 0; i < count; i++) {
			const x = (i % cols) * DOT_SPACING - halfW;
			const y = Math.floor(i / cols) * DOT_SPACING - halfH;
			matrix.makeTranslation(x, y, 0);
			dots.setMatrixAt(i, matrix);

			// Vignette: full --mo-chrome-lo at the centre, falling to near-black at
			// the corners. This is the ramp measured in the card art, drawn rather
			// than post-processed.
			const t = Math.min(1, Math.hypot(x, y) / maxDist);
			const falloff = (1 - t) ** 2.2;
			const jitter = 0.82 + hash(i) * 0.36;
			color.set(CHROME_LO).multiplyScalar((0.14 + falloff * 0.86) * jitter);
			dots.setColorAt(i, color);
		}
		dots.instanceMatrix.needsUpdate = true;
		if (dots.instanceColor) dots.instanceColor.needsUpdate = true;

		return { planeGeometry, planeMaterial, dotGeometry, dotMaterial, field, dots };
	}

	function handleError(error: unknown) {
		failed = true;
		console.error('[Momentum] ChromeStage failed to initialise; showing the CSS fallback.', error);
	}

	onMount(() => {
		if (!browser) return;

		let built: StageResources | null = null;
		try {
			built = buildResources();
			resources = built;
		} catch (error) {
			handleError(error);
		}

		const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		systemReduced = motionQuery.matches;
		const onMotionChange = (event: MediaQueryListEvent) => {
			systemReduced = event.matches;
		};
		motionQuery.addEventListener('change', onMotionChange);

		// Off-screen pause. EEGWaveform and BioMarketMonitor keep animating out of
		// view; this closes that gap rather than copying it.
		let visibility: IntersectionObserver | undefined;
		const host = hostEl;
		if (host) {
			visibility = new IntersectionObserver(
				([entry]) => {
					inView = entry.isIntersecting;
				},
				{ rootMargin: '160px 0px' }
			);
			visibility.observe(host);
		}

		// Context-loss handling. Threlte owns the <canvas> element, so this
		// component has no direct reference to it. `webglcontextlost` does not
		// bubble, but the capture phase always traverses the ancestor chain down to
		// the target regardless of the bubbles flag, so a capturing listener on the
		// host receives it.
		const onContextLost = (event: Event) => {
			event.preventDefault();
			failed = true;
			console.error('[Momentum] The ChromeStage WebGL context was lost.');
		};
		const onContextRestored = () => {
			failed = false;
		};
		host?.addEventListener('webglcontextlost', onContextLost, true);
		host?.addEventListener('webglcontextrestored', onContextRestored, true);

		return () => {
			motionQuery.removeEventListener('change', onMotionChange);
			visibility?.disconnect();
			host?.removeEventListener('webglcontextlost', onContextLost, true);
			host?.removeEventListener('webglcontextrestored', onContextRestored, true);

			// Explicit disposal of everything this component constructed. Threlte
			// disposes the renderer and any <T>-mounted disposable, but the geometries
			// and materials below were built here and handed to three.js directly, so
			// they are ours to free. InstancedMesh.dispose() only dispatches a
			// 'dispose' event, so calling it here as well as via Threlte is safe.
			if (built) {
				built.dots.dispose();
				built.dotGeometry.dispose();
				built.dotMaterial.dispose();
				built.planeGeometry.dispose();
				built.planeMaterial.dispose();
			}
		};
	});

	/**
	 * The only loop in this component. It exists solely while motion is allowed AND
	 * the stage is on screen AND the scene is healthy; `animating` going false
	 * cancels it through the effect's own teardown. Writing `sweep` re-derives
	 * `keyPosition`, and Threlte's useProps() invalidates the frame on that write.
	 */
	$effect(() => {
		if (!animating) return;
		const period = Math.max(0.5, sweepSeconds) * 1000;
		const started = performance.now();
		let raf = requestAnimationFrame(function step(now: number) {
			raf = requestAnimationFrame(step);
			sweep = (REST_PHASE + (now - started) / period) % 1;
		});
		return () => cancelAnimationFrame(raf);
	});
</script>

<div class="mo-stage" class:is-failed={failed} aria-hidden="true" bind:this={hostEl}>
	{#if resources}
		<div class="mo-stage__canvas">
			<svelte:boundary onerror={handleError}>
				<Canvas
					renderMode={animating ? 'always' : 'on-demand'}
					dpr={[1, 2]}
					shadows={false}
					toneMapping={ACESFilmicToneMapping}
				>
					<!-- Camera, lights and objects are all inference: the reference capture
					     contains no 3D and no Elementor CSS to inherit values from. -->
					<T.PerspectiveCamera makeDefault position={[0, 0, 6]} fov={38} />

					<T.AmbientLight color={AMBIENT} intensity={0.4} />
					<!-- The travelling key. This is the chrome specular. -->
					<T.DirectionalLight color={CHROME_HI} intensity={2.6} position={keyPosition} />
					<!-- The cyan rim, justified by the Momentum sub-brand and by nothing else. -->
					<T.DirectionalLight color={CYAN} intensity={0.35} position={[-6, -3.2, 3.2]} />

					<T is={resources.field} />
					<T is={resources.dots} />
				</Canvas>
			</svelte:boundary>
		</div>
	{/if}

	{#if failed}
		<!-- Ordered BEFORE the veil so the same vignette blends the fallback too. -->
		<div class="mo-stage__fallback grid-bg"></div>
	{/if}

	<!-- Blends the plate into --tt-black and echoes the white lens-flare star that
	     sits at the top-right terminal of the final M in momentum-course-1920.png.
	     Kept in CSS on purpose: the viz spec's DATA rule is "no textures, no
	     loaders, no external assets", and a soft additive flare in WebGL needs
	     either a texture or a custom shader. -->
	<div class="mo-stage__veil"></div>
</div>

<style>
	.mo-stage {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
		/* INHERITED from the repo token --tt-black via the page scope; the reference's
		   own section background is not in the capture. */
		background: var(--tt-black);
	}

	.mo-stage__canvas {
		position: absolute;
		inset: 0;
		opacity: 1;
		/* Only used for the failure fade. Overture's load timeline animates the HOST
		   element, not this one, so GSAP and this transition never touch the same
		   property on the same node. */
		transition: opacity 0.6s ease;
	}

	.mo-stage.is-failed .mo-stage__canvas {
		opacity: 0;
	}

	/* `rgb(10 10 11 / …)` is --tt-black (#0a0a0b) written as raw channels. app.css
	   ships no --tt-black-rgb token, and translucent stops need one, so the literal
	   is the token's own value, not a new colour. */
	.mo-stage__veil {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(
				34% 42% at 78% 22%,
				rgb(255 255 255 / 0.07) 0%,
				rgb(255 255 255 / 0.02) 45%,
				transparent 72%
			),
			radial-gradient(ellipse 70% 62% at 50% 45%, transparent 42%, rgb(10 10 11 / 0.55) 100%),
			linear-gradient(180deg, transparent 58%, rgb(10 10 11 / 0.9) 92%, var(--tt-black) 100%);
	}

	/* Shown only when WebGL is unavailable or the context is lost. No invented art:
	   the repo's own global .grid-bg texture (app.css:286-294) carries `background-image`,
	   `background-size` and its radial mask, so the cyan wash goes on ::before rather
	   than overwriting it. */
	.mo-stage__fallback {
		position: absolute;
		inset: 0;
	}

	.mo-stage__fallback::before {
		content: '';
		position: absolute;
		inset: 0;
		background: radial-gradient(
			ellipse 62% 58% at 50% 42%,
			rgb(var(--mo-cyan-rgb) / 0.08),
			transparent 70%
		);
	}
</style>
