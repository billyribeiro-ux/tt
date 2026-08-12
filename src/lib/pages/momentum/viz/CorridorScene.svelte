<script lang="ts">
	/**
	 * MOMENTUM — "THE CORRIDOR". The shared 3D hero scene for both Momentum routes.
	 *
	 * Threlte + three.js, per the original brief. An earlier pass replaced Threlte
	 * with a 2D canvas on a performance argument; that was the wrong call — the ask
	 * was explicitly Threlte core, and a real 3D camera is what buys the depth that
	 * makes a hero read as cinema rather than as a moving wallpaper.
	 *
	 * WHAT IT IS. A corridor of light rushing at the viewer: a floor and ceiling of
	 * grid rails converging to a vanishing point, and a luminous price ribbon
	 * running down the centre that undulates, surges and rips upward. Depth fog
	 * swallows the far end, so the corridor has no visible seam and never repeats.
	 * The camera breathes and banks a few degrees, which is what sells it as a shot
	 * rather than a loop.
	 *
	 * IT NEVER STOPS. There is no intro that settles into a still. Rails stream
	 * forward forever, the ribbon keeps printing new geometry at the far end, and a
	 * surge fires every few seconds. There is no frame of this hero that is static.
	 *
	 * DECORATIVE, NOT DATA. No axis, no tick, no numeral, no symbol, no price, no
	 * claim. The ribbon is a procedural walk. `aria-hidden`, no accessible name.
	 *
	 * PERFORMANCE. Two BufferGeometries with pre-allocated, reused typed arrays —
	 * nothing is allocated per frame and nothing is rebuilt. `dpr` is capped at 2,
	 * `renderMode="on-demand"` is deliberately NOT used because this scene is always
	 * moving. `toneMapping` is ACESFilmic so the additive glow rolls off instead of
	 * clipping to flat white. Geometry and material disposal is handled by Threlte's
	 * own disposal context for `<T>`-created objects; the two geometries created in
	 * script are disposed explicitly on destroy.
	 *
	 * REDUCED MOTION. The task is never started: one frame is composed with the
	 * ribbon mid-surge and left alone.
	 */
	import { Canvas, T } from '@threlte/core';
	import CorridorTicker from '$lib/pages/momentum/viz/CorridorTicker.svelte';
	import { onDestroy } from 'svelte';
	import {
		BufferGeometry,
		BufferAttribute,
		Fog,
		AdditiveBlending,
		Color,
		DoubleSide,
		ACESFilmicToneMapping
	} from 'three';
	import { ui } from '$lib/pages/momentum/state/ui.svelte';

	type Props = {
		/** Fired once shortly after start, so a wordmark can land on the first surge. */
		onSurge?: () => void;
		/** Scene tint. Cyan for /momentum, red for the course page's own palette. */
		tint?: 'cyan' | 'red';
	};
	let { onSurge, tint = 'cyan' }: Props = $props();

	/* $derived, not a captured constant: `tint` is a prop and `ui.reducedMotion` is
	   written by the route's effect after this component initialises. Reading either
	   once would freeze the scene to whatever happened to be true at init. */
	const reduced = $derived(ui.reducedMotion);
	const KEY = $derived(tint === 'red' ? new Color('#ff4a46') : new Color('#22e6ff'));
	const RAIL = $derived(tint === 'red' ? new Color('#b22725') : new Color('#0a7f96'));

	/** Corridor depth in world units. The fog is tuned to hide the far end. */
	const DEPTH = 190;
	/** Number of rungs; each rung is a floor bar and a ceiling bar. */
	const RUNGS = 64;
	/** Ribbon resolution along Z. */
	const SEGS = 190;

	/* ---------------------------------------------------------------- rails -- */
	/* Two horizontal bars per rung (floor + ceiling), plus four long side rails.
	   Positions are rewritten in place each frame; the array is never reallocated. */
	const railGeo = new BufferGeometry();
	const railVerts = new Float32Array((RUNGS * 2 + 4) * 2 * 3);
	railGeo.setAttribute('position', new BufferAttribute(railVerts, 3));

	const HALF_W = 15;
	const HALF_H = 7.5;

	function writeRails(scroll: number) {
		let o = 0;
		const put = (x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) => {
			railVerts[o++] = x1;
			railVerts[o++] = y1;
			railVerts[o++] = z1;
			railVerts[o++] = x2;
			railVerts[o++] = y2;
			railVerts[o++] = z2;
		};
		const gap = DEPTH / RUNGS;
		for (let i = 0; i < RUNGS; i++) {
			// Modulo keeps rungs recycling forever with no seam.
			const z = -DEPTH + ((i * gap + scroll) % DEPTH);
			put(-HALF_W, -HALF_H, z, HALF_W, -HALF_H, z);
			put(-HALF_W, HALF_H, z, HALF_W, HALF_H, z);
		}
		// The four long rails that give the corridor its edges.
		put(-HALF_W, -HALF_H, -DEPTH, -HALF_W, -HALF_H, 8);
		put(HALF_W, -HALF_H, -DEPTH, HALF_W, -HALF_H, 8);
		put(-HALF_W, HALF_H, -DEPTH, -HALF_W, HALF_H, 8);
		put(HALF_W, HALF_H, -DEPTH, HALF_W, HALF_H, 8);
		railGeo.attributes.position.needsUpdate = true;
	}

	/* --------------------------------------------------------------- ribbon -- */
	/* A single line strip running the length of the corridor. New values are pushed
	   in at the far end and the whole strip shifts forward — the ribbon is being
	   printed continuously, not translated. */
	/* A QUAD STRIP, NOT A LINE. WebGL ignores `linewidth` on LineBasicMaterial —
	   every line renders 1px no matter what, which is why the first cut of this
	   scene read as a stray hairline instead of a ribbon. Two vertices per segment
	   (top and bottom edge) turned into triangles gives it real, tapering width
	   that catches the additive glow. */
	const RIB_W = 0.3;
	/* The ribbon runs down the RIGHT side of the corridor, not the centre. Centred,
	   it swept straight through the headline and body copy and cost more legibility
	   than it bought atmosphere — text always wins that trade. */
	const RIB_X = 5.4;
	const ribGeo = new BufferGeometry();
	const ribVerts = new Float32Array(SEGS * 2 * 3);
	ribGeo.setAttribute('position', new BufferAttribute(ribVerts, 3));
	{
		const idx = new Uint16Array((SEGS - 1) * 6);
		for (let i = 0, o = 0; i < SEGS - 1; i++) {
			const a = i * 2;
			idx[o++] = a;
			idx[o++] = a + 1;
			idx[o++] = a + 2;
			idx[o++] = a + 1;
			idx[o++] = a + 3;
			idx[o++] = a + 2;
		}
		ribGeo.setIndex(new BufferAttribute(idx, 1));
	}

	const ys = new Float32Array(SEGS);
	let y = 0;
	let vel = 0;
	let surge = 0;
	let nextSurge = 1.2;
	let seed = 20260812;
	function rand() {
		seed = (seed * 1664525 + 1013904223) | 0;
		return ((seed >>> 8) & 0xffffff) / 0xffffff;
	}

	function advance(dt: number) {
		if (surge > 0) {
			surge -= dt;
			vel += (2.6 + rand() * 1.6) * dt;
			vel *= 0.93;
			if (surge <= 0) nextSurge = 2.6 + rand() * 3.4;
		} else {
			nextSurge -= dt;
			vel += (0 - y) * dt * 1.4 + (rand() - 0.5) * dt * 5.5;
			vel *= 0.9;
			if (nextSurge <= 0) surge = 0.7 + rand() * 0.6;
		}
		y += vel * dt;
		if (y > 5.6) {
			y = 5.6;
			vel = -Math.abs(vel) * 0.35;
		}
		if (y < -5.6) {
			y = -5.6;
			vel = Math.abs(vel) * 0.35;
		}
		// Shift the strip one step toward the camera and print the new value at the back.
		ys.copyWithin(0, 1);
		ys[SEGS - 1] = y;
	}

	function writeRibbon() {
		const gap = DEPTH / (SEGS - 1);
		for (let i = 0; i < SEGS; i++) {
			const z = 8 - i * gap;
			// Taper toward the far end so the ribbon reads as receding, not as a wall.
			const wdt = RIB_W * (0.35 + 0.65 * (i / (SEGS - 1)));
			const o = i * 6;
			ribVerts[o] = RIB_X;
			ribVerts[o + 1] = ys[i] + wdt;
			ribVerts[o + 2] = z;
			ribVerts[o + 3] = RIB_X;
			ribVerts[o + 4] = ys[i] - wdt;
			ribVerts[o + 5] = z;
		}
		ribGeo.attributes.position.needsUpdate = true;
		ribGeo.computeBoundingSphere();
	}

	/** Seed the corridor so the very first painted frame is already full. */
	function prefill() {
		for (let i = 0; i < SEGS; i++) advance(1 / 60);
		writeRibbon();
		writeRails(0);
	}
	prefill();

	let scroll = $state(0);
	let camX = $state(0);
	let camY = $state(0);
	let roll = $state(0);
	let t = 0;
	let fired = false;

	/* Compose the reduced-motion still inside an effect so it also fires if the
	   preference is synced after init. `settled` guards it to once. */
	let settled = false;
	$effect(() => {
		if (!reduced || settled) return;
		settled = true;
		surge = 1;
		for (let i = 0; i < 40; i++) advance(1 / 60);
		writeRibbon();
		if (!fired) {
			fired = true;
			onSurge?.();
		}
	});

	onDestroy(() => {
		railGeo.dispose();
		ribGeo.dispose();
	});
</script>

<div class="mo-corridor" aria-hidden="true">
	<Canvas toneMapping={ACESFilmicToneMapping} dpr={[1, 2]}>
		<!-- Fog swallows the far end so the corridor has no visible seam. Its colour
		     matches the page ground, not the rails, or the recycle point shows. -->
		<T.Scene fog={new Fog('#05060a', 26, 150)} />

		<T.PerspectiveCamera
			makeDefault
			fov={62}
			near={0.1}
			far={400}
			position={[camX, camY, 9]}
			rotation={[0, 0, roll]}
		/>

		<!-- The corridor. Additive so overlapping rails bloom where they converge. -->
		<T.LineSegments geometry={railGeo}>
			<T.LineBasicMaterial
				color={RAIL}
				transparent
				opacity={0.85}
				blending={AdditiveBlending}
				depthWrite={false}
			/>
		</T.LineSegments>

		<!-- The ribbon: one solid core plus two scaled shells at falling opacity.
		     Additive, so the shells read as bloom without a post-processing pass
		     (no `postprocessing` package is installed in this repo). -->
		<T.Mesh geometry={ribGeo}>
			<T.MeshBasicMaterial
				color={KEY}
				transparent
				opacity={0.98}
				side={DoubleSide}
				blending={AdditiveBlending}
				depthWrite={false}
			/>
		</T.Mesh>
		<T.Mesh geometry={ribGeo} scale={[1, 1.9, 1]}>
			<T.MeshBasicMaterial
				color={KEY}
				transparent
				opacity={0.16}
				side={DoubleSide}
				blending={AdditiveBlending}
				depthWrite={false}
			/>
		</T.Mesh>
		<T.Mesh geometry={ribGeo} scale={[1, 3.4, 1]}>
			<T.MeshBasicMaterial
				color={KEY}
				transparent
				opacity={0.05}
				side={DoubleSide}
				blending={AdditiveBlending}
				depthWrite={false}
			/>
		</T.Mesh>

		{#if !reduced}
			<CorridorTicker
				step={(dt: number) => {
					t += dt;
					scroll += dt * 26;
					advance(dt);
					advance(dt);
					writeRibbon();
					writeRails(scroll);
					// The camera breathes and banks: a held shot, not a fixed lens.
					camX = Math.sin(t * 0.23) * 0.85;
					camY = Math.cos(t * 0.19) * 0.5 + y * 0.12;
					roll = Math.sin(t * 0.17) * 0.035;
					if (!fired && t > 0.8) {
						fired = true;
						onSurge?.();
					}
				}}
			/>
		{/if}
	</Canvas>
</div>

<style>
	.mo-corridor {
		position: absolute;
		inset: 0;
		overflow: hidden;
	}
	.mo-corridor :global(canvas) {
		display: block;
		width: 100% !important;
		height: 100% !important;
	}
</style>
