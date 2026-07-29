/** Subtle magnetic pull toward the pointer for CTAs. */
export function magnetic(node: HTMLElement, strength = 0.28) {
	let frame = 0;

	function onMove(e: PointerEvent) {
		const rect = node.getBoundingClientRect();
		const x = e.clientX - rect.left - rect.width / 2;
		const y = e.clientY - rect.top - rect.height / 2;
		cancelAnimationFrame(frame);
		frame = requestAnimationFrame(() => {
			node.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
		});
	}

	function onLeave() {
		cancelAnimationFrame(frame);
		node.style.transform = 'translate3d(0,0,0)';
	}

	node.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
	node.addEventListener('pointermove', onMove);
	node.addEventListener('pointerleave', onLeave);

	return {
		destroy() {
			cancelAnimationFrame(frame);
			node.removeEventListener('pointermove', onMove);
			node.removeEventListener('pointerleave', onLeave);
		}
	};
}
