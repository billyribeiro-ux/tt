<script lang="ts">
	/**
	 * Professional research hero: cortex mesh + 10–20 style EEG montage.
	 * Alpha-band activity as subtle surface modulation, not game particles.
	 * Context: Muse neurofeedback × live trading protocol.
	 */
	import { onMount } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import { browser } from '$app/env';
	import { ui } from '$lib/pages/project-alpha/state/ui.svelte';
	import { ALPHA_HZ, alphaPower } from '$lib/pages/project-alpha/motion/signals';

	let canvasEl: HTMLCanvasElement | undefined;
	let failed = $state(false);

	const captureCanvas: Attachment<HTMLCanvasElement> = (node) => {
		canvasEl = node;
		return () => {
			if (canvasEl === node) canvasEl = undefined;
		};
	};

	onMount(() => {
		if (!browser || !canvasEl) {
			failed = true;
			return;
		}

		if (ui.reducedMotion) {
			// Still draw one static frame later if possible; allow empty stage
		}

		let disposed = false;
		let raf = 0;
		let renderer: import('three').WebGLRenderer | undefined;
		let timer: import('three').Timer | undefined;
		let resizeObs: ResizeObserver | undefined;
		let visibilityObs: IntersectionObserver | undefined;
		let onPointer: ((e: PointerEvent) => void) | undefined;
		let onContextLost: ((e: Event) => void) | undefined;
		let onContextRestored: (() => void) | undefined;
		let inView = true;

		void (async () => {
			try {
				const [THREE, brainGeometry] = await Promise.all([
					import('three'),
					import('$lib/pages/project-alpha/three/brainGeometry')
				]);
				const { createBrainGeometry, EEG_SITES, electrodeWorldPosition } = brainGeometry;
				if (disposed || !canvasEl) return;

				const scene = new THREE.Scene();
				const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 50);
				camera.position.set(0, 0.15, 5);

				renderer = new THREE.WebGLRenderer({
					canvas: canvasEl,
					alpha: true,
					antialias: true,
					powerPreference: 'high-performance'
				});
				renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
				renderer.setClearColor(0x000000, 0);
				onContextLost = (event: Event) => {
					event.preventDefault();
					failed = true;
					console.error('[Project ALPHA] The neural scene WebGL context was lost.');
				};
				onContextRestored = () => {
					failed = false;
				};
				canvasEl.addEventListener('webglcontextlost', onContextLost);
				canvasEl.addEventListener('webglcontextrestored', onContextRestored);

				const root = new THREE.Group();
				// Clinical orientation: superior up, frontal slightly toward camera
				root.rotation.x = 0.12;
				root.rotation.y = -0.35;
				scene.add(root);

				// Soft key / rim light via emissive materials only (no particle lights)
				const ambient = new THREE.AmbientLight(0x8aa4c8, 0.55);
				scene.add(ambient);
				const key = new THREE.DirectionalLight(0xd8e6ff, 0.85);
				key.position.set(2.2, 2.5, 3);
				scene.add(key);
				const rim = new THREE.DirectionalLight(0x3b8beb, 0.35);
				rim.position.set(-2.5, 0.5, -2);
				scene.add(rim);
				const fill = new THREE.DirectionalLight(0xb82020, 0.12);
				fill.position.set(0, -1.5, 2);
				scene.add(fill);

				// --- Cortex (solid + fine wire overlay for instrumentation read) ---
				const brainGeo = createBrainGeometry();
				const cortexMat = new THREE.MeshStandardMaterial({
					color: 0x1a2230,
					metalness: 0.15,
					roughness: 0.72,
					emissive: 0x0a1525,
					emissiveIntensity: 0.35,
					transparent: true,
					opacity: 0.92
				});
				const cortex = new THREE.Mesh(brainGeo, cortexMat);
				root.add(cortex);

				const wireMat = new THREE.MeshBasicMaterial({
					color: 0x3b8beb,
					wireframe: true,
					transparent: true,
					opacity: 0.11
				});
				const wire = new THREE.Mesh(brainGeo.clone(), wireMat);
				wire.scale.setScalar(1.003);
				root.add(wire);

				// Inner translucent "signal volume"
				const innerMat = new THREE.MeshStandardMaterial({
					color: 0x3b8beb,
					metalness: 0.05,
					roughness: 0.45,
					emissive: 0x1a4a8a,
					emissiveIntensity: 0.4,
					transparent: true,
					opacity: 0.08,
					depthWrite: false
				});
				const inner = new THREE.Mesh(brainGeo.clone(), innerMat);
				inner.scale.setScalar(0.94);
				root.add(inner);

				// --- EEG montage (electrode discs + thin leads) ---
				const electrodeGroup = new THREE.Group();
				root.add(electrodeGroup);

				const discGeo = new THREE.SphereGeometry(0.028, 12, 12);
				const museGeo = new THREE.SphereGeometry(0.036, 12, 12);
				const leadPositions: number[] = [];
				const electrodes: {
					mesh: import('three').Mesh;
					base: import('three').Vector3;
					id: string;
					isMuse: boolean;
				}[] = [];
				const electrodePositions: Record<string, import('three').Vector3> = {};
				const signalMaterials: import('three').LineDashedMaterial[] = [];

				const museIds = new Set(['AF7', 'AF8', 'TP9', 'TP10', 'Fp1', 'Fp2']);
				const tmp = new THREE.Vector3();

				for (const site of EEG_SITES) {
					electrodeWorldPosition(site.dir, tmp);
					// geometry is centered: positions already in local brain space
					const pos = tmp.clone();
					const isMuse = museIds.has(site.id);
					const mat = new THREE.MeshStandardMaterial({
						color: isMuse ? 0x3b8beb : 0x6b7a8f,
						metalness: 0.55,
						roughness: 0.35,
						emissive: isMuse ? 0x1a4a9a : 0x111820,
						emissiveIntensity: isMuse ? 0.65 : 0.2
					});
					const mesh = new THREE.Mesh(isMuse ? museGeo : discGeo, mat);
					mesh.position.copy(pos);
					electrodeGroup.add(mesh);
					electrodes.push({ mesh, base: pos.clone(), id: site.id, isMuse });
					electrodePositions[site.id] = pos.clone();

					// Lead toward crown for clinical diagram feel
					leadPositions.push(pos.x, pos.y, pos.z, pos.x * 0.15, 1.15, pos.z * 0.15);
				}

				const leadGeo = new THREE.BufferGeometry();
				leadGeo.setAttribute(
					'position',
					new THREE.Float32BufferAttribute(new Float32Array(leadPositions), 3)
				);
				const leads = new THREE.LineSegments(
					leadGeo,
					new THREE.LineBasicMaterial({
						color: 0x3a4558,
						transparent: true,
						opacity: 0.35
					})
				);
				electrodeGroup.add(leads);

				// Signal routes between Muse-relevant sites. These are explanatory
				// paths for the acquisition system, not anatomical claims.
				const signalPairs = [
					['AF7', 'Fp1'],
					['Fp1', 'Fp2'],
					['Fp2', 'AF8'],
					['AF7', 'TP9'],
					['AF8', 'TP10'],
					['TP9', 'TP10']
				] as const;
				for (const [from, to] of signalPairs) {
					const a = electrodePositions[from];
					const b = electrodePositions[to];
					if (!a || !b) continue;
					const middle = a
						.clone()
						.add(b)
						.multiplyScalar(0.5)
						.normalize()
						.multiplyScalar(Math.max(a.length(), b.length()) * 1.16);
					const curve = new THREE.QuadraticBezierCurve3(a, middle, b);
					const material = new THREE.LineDashedMaterial({
						color: 0x65a7ff,
						transparent: true,
						opacity: 0.22,
						dashSize: 0.055,
						gapSize: 0.038
					});
					const route = new THREE.Line(
						new THREE.BufferGeometry().setFromPoints(curve.getPoints(32)),
						material
					);
					route.computeLineDistances();
					electrodeGroup.add(route);
					signalMaterials.push(material);
				}

				// Muse headband arc (forehead): consumer EEG device the study actually uses
				const bandPts: import('three').Vector3[] = [];
				for (let i = 0; i <= 36; i++) {
					const a = 0.2 + (i / 36) * (Math.PI - 0.4);
					bandPts.push(
						new THREE.Vector3(
							Math.cos(a) * 0.92,
							0.38 + Math.sin(a) * 0.12,
							0.78 + Math.sin(a) * 0.08
						)
					);
				}
				const museBand = new THREE.Line(
					new THREE.BufferGeometry().setFromPoints(bandPts),
					new THREE.LineBasicMaterial({
						color: 0x3b8beb,
						transparent: true,
						opacity: 0.5
					})
				);
				root.add(museBand);

				// Subtle alpha activity: vertex colors on a low-opacity shell (no particles)
				const activityGeo = brainGeo.clone();
				const posAttr = activityGeo.getAttribute('position');
				const colors = new Float32Array(posAttr.count * 3);
				const activityColor = new THREE.BufferAttribute(colors, 3);
				activityGeo.setAttribute('color', activityColor);
				const activityMat = new THREE.MeshBasicMaterial({
					vertexColors: true,
					transparent: true,
					opacity: 0.22,
					depthWrite: false,
					blending: THREE.AdditiveBlending
				});
				const activity = new THREE.Mesh(activityGeo, activityMat);
				activity.scale.setScalar(1.01);
				root.add(activity);

				// Floor reference: calm "lab table" plane, not game grid spam
				const floor = new THREE.Mesh(
					new THREE.CircleGeometry(2.4, 64),
					new THREE.MeshBasicMaterial({
						color: 0x0c1018,
						transparent: true,
						opacity: 0.55
					})
				);
				floor.rotation.x = -Math.PI / 2;
				floor.position.y = -1.15;
				scene.add(floor);

				const ring = new THREE.Mesh(
					new THREE.RingGeometry(1.05, 1.08, 64),
					new THREE.MeshBasicMaterial({
						color: 0x3b8beb,
						transparent: true,
						opacity: 0.2,
						side: THREE.DoubleSide
					})
				);
				ring.rotation.x = -Math.PI / 2;
				ring.position.y = -1.14;
				scene.add(ring);

				// Slow, coherent wavefronts make the target band legible as a state
				// that expands through the system rather than as decorative sparks.
				const coherenceRings: import('three').Mesh[] = [];
				for (let i = 0; i < 4; i++) {
					const wave = new THREE.Mesh(
						new THREE.RingGeometry(0.96, 0.968, 96),
						new THREE.MeshBasicMaterial({
							color: i % 2 === 0 ? 0x3b8beb : 0x2bbfa0,
							transparent: true,
							opacity: 0,
							depthWrite: false,
							side: THREE.DoubleSide,
							blending: THREE.AdditiveBlending
						})
					);
					wave.position.z = -0.68;
					scene.add(wave);
					coherenceRings.push(wave);
				}

				// Sparse signal-sample field, kept intentionally restrained.
				const sampleCount = 180;
				const samplePositions = new Float32Array(sampleCount * 3);
				for (let i = 0; i < sampleCount; i++) {
					const theta = i * 2.399963229728653;
					const y = 1 - (i / (sampleCount - 1)) * 2;
					const radial = Math.sqrt(1 - y * y);
					const radius = 1.65 + ((i * 17) % 11) * 0.035;
					samplePositions[i * 3] = Math.cos(theta) * radial * radius;
					samplePositions[i * 3 + 1] = y * radius;
					samplePositions[i * 3 + 2] = Math.sin(theta) * radial * radius;
				}
				const sampleGeometry = new THREE.BufferGeometry();
				sampleGeometry.setAttribute('position', new THREE.BufferAttribute(samplePositions, 3));
				const sampleField = new THREE.Points(
					sampleGeometry,
					new THREE.PointsMaterial({
						color: 0x6ea9f2,
						size: 0.012,
						transparent: true,
						opacity: 0.22,
						depthWrite: false
					})
				);
				root.add(sampleField);

				const pointer = { x: 0, y: 0 };
				const target = { x: 0, y: 0 };
				let settledCameraZ = 5;
				onPointer = (e: PointerEvent) => {
					target.x = (e.clientX / window.innerWidth - 0.5) * 0.35;
					target.y = (e.clientY / window.innerHeight - 0.5) * 0.2;
				};
				window.addEventListener('pointermove', onPointer, { passive: true });

				function resize() {
					if (!canvasEl || !renderer) return;
					const parent = canvasEl.parentElement;
					const w = parent?.clientWidth || window.innerWidth;
					const h = parent?.clientHeight || window.innerHeight;
					camera.aspect = w / h;
					camera.updateProjectionMatrix();
					renderer.setSize(w, h, false);

					// Measured from the generated cortex bounds, with reserve for the
					// maximum pointer/yaw excursion. Fit the complete brain instead of
					// relying on a camera distance that only works for wide canvases.
					const verticalTangent = Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5));
					const horizontalHalfExtent = 2.24;
					const verticalHalfExtent = 1.42;
					const fitWidth = horizontalHalfExtent / (verticalTangent * camera.aspect);
					const fitHeight = verticalHalfExtent / verticalTangent;
					settledCameraZ = Math.max(4.35, fitWidth, fitHeight) * 1.06;

					const visibleHalfWidth = settledCameraZ * verticalTangent * camera.aspect;
					const horizontalReserve = Math.max(0, visibleHalfWidth - horizontalHalfExtent * 1.02);
					root.position.x = w > 1040 ? Math.min(0.58, horizontalReserve * 0.78) : 0;
				}
				resize();
				resizeObs = new ResizeObserver(resize);
				if (canvasEl.parentElement) resizeObs.observe(canvasEl.parentElement);
				visibilityObs = new IntersectionObserver(
					([entry]) => {
						inView = entry.isIntersecting;
					},
					{ rootMargin: '160px 0px' }
				);
				visibilityObs.observe(canvasEl);

				timer = new THREE.Timer();
				timer.connect(document);
				const colArr = activityColor.array as Float32Array;
				const pArr = posAttr.array as Float32Array;

				function paintActivity(t: number, aPow: number) {
					// Alpha-weighted cortical glow: frontal/parietal emphasis (protocol-relevant)
					for (let i = 0; i < posAttr.count; i++) {
						const x = pArr[i * 3];
						const y = pArr[i * 3 + 1];
						const z = pArr[i * 3 + 2];
						const frontal = Math.max(0, z) * 0.55;
						const wave =
							0.35 +
							aPow * 0.55 +
							Math.sin(t * ALPHA_HZ.center * 0.55 + x * 4 + z * 3) * 0.12 * aPow;
						const g = Math.min(1, Math.max(0, wave * (0.45 + frontal + y * 0.15)));
						// blue alpha channel tone
						colArr[i * 3] = 0.12 * g;
						colArr[i * 3 + 1] = 0.35 * g + 0.15 * aPow;
						colArr[i * 3 + 2] = 0.75 * g + 0.2;
					}
					activityColor.needsUpdate = true;
				}

				function tick(timestamp?: number) {
					if (disposed || !renderer) return;
					timer?.update(timestamp);
					const t = timer?.getElapsed() ?? 0;
					const aPow = ui.reducedMotion ? 0.55 : alphaPower(t);

					if (!inView && !ui.reducedMotion) {
						raf = requestAnimationFrame(tick);
						return;
					}

					if (!ui.reducedMotion) {
						pointer.x += (target.x - pointer.x) * 0.04;
						pointer.y += (target.y - pointer.y) * 0.04;
						root.rotation.y = -0.35 + pointer.x * 0.55 + Math.sin(t * 0.12) * 0.04;
						root.rotation.x = 0.12 - pointer.y * 0.35;
						// Micro breath: alpha linked, very subtle
						const s = 1 + aPow * 0.012 + Math.sin(t * 0.8) * 0.004;
						cortex.scale.setScalar(s);
						wire.scale.setScalar(s * 1.003);
						inner.scale.setScalar(s * 0.94);
						sampleField.rotation.y = -t * 0.025;
						sampleField.rotation.x = Math.sin(t * 0.16) * 0.04;
					}

					camera.position.z = settledCameraZ + Math.max(0, 1 - t / 3.2) * 0.9;
					paintActivity(t, aPow);
					wireMat.opacity = 0.08 + aPow * 0.08;
					innerMat.opacity = 0.05 + aPow * 0.07;
					cortexMat.emissiveIntensity = 0.25 + aPow * 0.25;
					(ring.material as import('three').MeshBasicMaterial).opacity = 0.12 + aPow * 0.14;

					// Muse electrodes pulse with alpha; others stay quiet
					for (const el of electrodes) {
						const mat = el.mesh.material as import('three').MeshStandardMaterial;
						if (el.isMuse) {
							mat.emissiveIntensity = 0.4 + aPow * 0.55 + Math.sin(t * 2.2) * 0.08;
						}
					}

					signalMaterials.forEach((material, i) => {
						material.dashSize = 0.045 + Math.sin(t * 1.2 + i) * 0.012;
						material.opacity = 0.12 + aPow * 0.18;
					});

					coherenceRings.forEach((wave, i) => {
						const progress = (t * 0.14 + i / coherenceRings.length) % 1;
						const size = 0.62 + progress * 1.55;
						wave.scale.setScalar(size);
						const material = wave.material as import('three').MeshBasicMaterial;
						material.opacity = Math.sin(progress * Math.PI) * (0.025 + aPow * 0.065);
					});

					renderer.render(scene, camera);
					if (!ui.reducedMotion) raf = requestAnimationFrame(tick);
				}
				tick();
				if (ui.reducedMotion) {
					// one static frame already rendered
				}
			} catch (error) {
				failed = true;
				console.error('[Project ALPHA] Neural scene initialization failed.', error);
			}
		})();

		return () => {
			disposed = true;
			cancelAnimationFrame(raf);
			if (onPointer) window.removeEventListener('pointermove', onPointer);
			if (canvasEl && onContextLost) {
				canvasEl.removeEventListener('webglcontextlost', onContextLost);
			}
			if (canvasEl && onContextRestored) {
				canvasEl.removeEventListener('webglcontextrestored', onContextRestored);
			}
			resizeObs?.disconnect();
			visibilityObs?.disconnect();
			timer?.dispose();
			renderer?.dispose();
		};
	});
</script>

<div class="stage" aria-hidden="true">
	<canvas {@attach captureCanvas} class="canvas" class:is-failed={failed}></canvas>
	{#if failed}
		<div class="fallback"></div>
	{/if}
	<div class="vignette"></div>
</div>

<style>
	.stage {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
		background: radial-gradient(
			ellipse 58% 68% at 72% 42%,
			rgba(14, 20, 32, 0.96) 0%,
			rgba(10, 10, 12, 0.72) 58%,
			transparent 82%
		);
	}

	.canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		display: block;
		opacity: 1;
		transition: opacity 0.8s ease;
	}

	.canvas.is-failed {
		opacity: 0;
	}

	.vignette {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(ellipse 48% 54% at 72% 40%, transparent 38%, rgba(10, 10, 12, 0.5) 100%),
			linear-gradient(180deg, transparent 45%, rgba(10, 10, 12, 0.92) 88%, #0a0a0c 100%);
	}

	.fallback {
		position: absolute;
		inset: 18% 22% 35%;
		border-radius: 50% 50% 45% 45%;
		background: radial-gradient(ellipse at 50% 45%, rgba(59, 139, 235, 0.15), transparent 65%);
		border: 1px solid rgba(59, 139, 235, 0.12);
	}
</style>
