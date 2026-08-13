<script lang="ts">
	/**
	 * The per-frame driver for CorridorScene (/momentum) and for
	 * momentum-course/viz/MomentumMarket.svelte (/momentum-course). TWO consumers,
	 * one contract: `step(dt)` with the delta already clamped below. It is shared
	 * rather than copied — a byte-identical second ticker file would be the same
	 * five lines maintained in two places.
	 *
	 * `useTask` must be called inside the Threlte `<Canvas>` context, so it cannot
	 * live in the parent's script block. This component renders nothing; it exists
	 * only to own the frame loop and hand the delta back to its parent.
	 */
	import { useTask } from '@threlte/core';

	type Props = { step: (dt: number) => void };
	let { step }: Props = $props();

	useTask((delta) => {
		// Clamped: a backgrounded tab returns a huge first delta, which would fling
		// the ribbon off screen and scroll the corridor through several recycles.
		step(Math.min(0.05, delta));
	});
</script>
