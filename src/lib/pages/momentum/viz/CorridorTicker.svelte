<script lang="ts">
	/**
	 * The per-frame driver for CorridorScene.
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
