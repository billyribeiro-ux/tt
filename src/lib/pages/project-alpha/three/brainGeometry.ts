/**
 * Procedural cortex envelope: elongated hemispheres, fissure, gyri.
 * Built for a research/clinical look, not a sphere “globe.”
 */
import { BufferGeometry, Float32BufferAttribute, Vector3 } from 'three';

function hash(n: number): number {
	const x = Math.sin(n * 127.1) * 43758.5453;
	return x - Math.floor(x);
}

function noise3(x: number, y: number, z: number): number {
	const ix = Math.floor(x);
	const iy = Math.floor(y);
	const iz = Math.floor(z);
	const fx = x - ix;
	const fy = y - iy;
	const fz = z - iz;
	const u = fx * fx * (3 - 2 * fx);
	const v = fy * fy * (3 - 2 * fy);
	const w = fz * fz * (3 - 2 * fz);

	const n000 = hash(ix + iy * 57 + iz * 131);
	const n100 = hash(ix + 1 + iy * 57 + iz * 131);
	const n010 = hash(ix + (iy + 1) * 57 + iz * 131);
	const n110 = hash(ix + 1 + (iy + 1) * 57 + iz * 131);
	const n001 = hash(ix + iy * 57 + (iz + 1) * 131);
	const n101 = hash(ix + 1 + iy * 57 + (iz + 1) * 131);
	const n011 = hash(ix + (iy + 1) * 57 + (iz + 1) * 131);
	const n111 = hash(ix + 1 + (iy + 1) * 57 + (iz + 1) * 131);

	const nx00 = n000 * (1 - u) + n100 * u;
	const nx10 = n010 * (1 - u) + n110 * u;
	const nx01 = n001 * (1 - u) + n101 * u;
	const nx11 = n011 * (1 - u) + n111 * u;
	const nxy0 = nx00 * (1 - v) + nx10 * v;
	const nxy1 = nx01 * (1 - v) + nx11 * v;
	return nxy0 * (1 - w) + nxy1 * w;
}

function fbm(x: number, y: number, z: number): number {
	let a = 0;
	let amp = 0.5;
	let f = 1;
	for (let i = 0; i < 4; i++) {
		a += noise3(x * f, y * f, z * f) * amp;
		f *= 2.1;
		amp *= 0.5;
	}
	return a;
}

export function brainPoint(nx: number, ny: number, nz: number, out: Vector3): Vector3 {
	// Ellipsoid cortex (not unit sphere proportions)
	let x = nx * 1.28;
	let y = ny * 0.82;
	let z = nz * 1.08;

	// Longitudinal fissure
	const fissure = Math.exp(-Math.abs(x) * 16) * 0.16;
	x += Math.sign(x || 1) * 0.085;
	y -= fissure * 0.4;

	// Frontal expansion
	if (z > 0) {
		z += z * 0.1;
		y += z * 0.035;
	}

	// Temporal lobes
	const temporal = Math.max(0, Math.abs(x) - 0.3) * Math.max(0, 0.15 - y);
	y -= temporal * 0.65;
	x += Math.sign(x || 1) * temporal * 0.3;

	// Posterior / occipital
	if (z < 0) z -= Math.abs(z) * 0.06;

	// Cerebellum suggestion
	if (z < -0.2 && y < 0.05) {
		const c = (-z - 0.2) * Math.max(0, 0.15 - y);
		y -= c * 0.4;
		z -= c * 0.12;
	}

	// Brainstem
	if (y < -0.5 && Math.abs(x) < 0.32) {
		const s = (-y - 0.5) * 1.1;
		x *= 1 - s * 0.5;
		z *= 1 - s * 0.35;
		y -= s * 0.2;
	}

	// Gyri / sulci
	const folds = fbm(x * 3.4, y * 3.4, z * 3.4) * 0.14 + fbm(x * 8 + 3, y * 8, z * 8) * 0.055;
	const foldAmt = folds * (1 - Math.exp(-Math.abs(nx) * 9) * 0.6);
	const len = Math.hypot(x, y, z) || 1;
	const s = 1 + foldAmt;
	out.set((x / len) * len * s, (y / len) * len * s, (z / len) * len * s);
	return out;
}

export function createBrainGeometry(segW = 88, segH = 56): BufferGeometry {
	const positions: number[] = [];
	const uvs: number[] = [];
	const indices: number[] = [];
	const tmp = new Vector3();

	for (let iy = 0; iy <= segH; iy++) {
		const v = iy / segH;
		const phi = v * Math.PI;
		for (let ix = 0; ix <= segW; ix++) {
			const u = ix / segW;
			const theta = u * Math.PI * 2;
			const nx = Math.sin(phi) * Math.cos(theta);
			const ny = Math.cos(phi);
			const nz = Math.sin(phi) * Math.sin(theta);
			brainPoint(nx, ny, nz, tmp);
			positions.push(tmp.x, tmp.y, tmp.z);
			uvs.push(u, 1 - v);
		}
	}

	const stride = segW + 1;
	for (let iy = 0; iy < segH; iy++) {
		for (let ix = 0; ix < segW; ix++) {
			const a = iy * stride + ix;
			const b = a + stride;
			const c = a + 1;
			const d = b + 1;
			indices.push(a, b, c, c, b, d);
		}
	}

	const geo = new BufferGeometry();
	geo.setAttribute('position', new Float32BufferAttribute(positions, 3));
	geo.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
	geo.setIndex(indices);
	geo.computeVertexNormals();
	geo.scale(1.08, 1.08, 1.08);
	// Keep origin at anatomical center of the generator (no geo.center())
	// so electrode sites from brainPoint() stay aligned.
	return geo;
}

/**
 * Approximate 10–20 style electrode sites on the cortex surface.
 * Used for professional EEG montage markers (not decorative particles).
 */
export const EEG_SITES: {
	id: string;
	dir: [number, number, number];
	band: 'frontal' | 'central' | 'parietal' | 'occipital' | 'temporal';
}[] = [
	{ id: 'Fp1', dir: [-0.35, 0.55, 0.75], band: 'frontal' },
	{ id: 'Fp2', dir: [0.35, 0.55, 0.75], band: 'frontal' },
	{ id: 'F3', dir: [-0.55, 0.45, 0.55], band: 'frontal' },
	{ id: 'F4', dir: [0.55, 0.45, 0.55], band: 'frontal' },
	{ id: 'F7', dir: [-0.85, 0.15, 0.4], band: 'temporal' },
	{ id: 'F8', dir: [0.85, 0.15, 0.4], band: 'temporal' },
	{ id: 'C3', dir: [-0.7, 0.35, 0.05], band: 'central' },
	{ id: 'C4', dir: [0.7, 0.35, 0.05], band: 'central' },
	{ id: 'Cz', dir: [0, 0.95, 0], band: 'central' },
	{ id: 'T3', dir: [-0.98, 0, 0], band: 'temporal' },
	{ id: 'T4', dir: [0.98, 0, 0], band: 'temporal' },
	{ id: 'P3', dir: [-0.5, 0.4, -0.55], band: 'parietal' },
	{ id: 'P4', dir: [0.5, 0.4, -0.55], band: 'parietal' },
	{ id: 'Pz', dir: [0, 0.7, -0.55], band: 'parietal' },
	{ id: 'O1', dir: [-0.3, 0.15, -0.9], band: 'occipital' },
	{ id: 'O2', dir: [0.3, 0.15, -0.9], band: 'occipital' },
	// Muse-relevant forehead / temporal cluster (consumer EEG focus)
	{ id: 'AF7', dir: [-0.55, 0.35, 0.72], band: 'frontal' },
	{ id: 'AF8', dir: [0.55, 0.35, 0.72], band: 'frontal' },
	{ id: 'TP9', dir: [-0.9, -0.15, -0.15], band: 'temporal' },
	{ id: 'TP10', dir: [0.9, -0.15, -0.15], band: 'temporal' }
];

export function electrodeWorldPosition(dir: [number, number, number], out: Vector3): Vector3 {
	const len = Math.hypot(dir[0], dir[1], dir[2]) || 1;
	brainPoint(dir[0] / len, dir[1] / len, dir[2] / len, out);
	out.multiplyScalar(1.04);
	return out;
}
