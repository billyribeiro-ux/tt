<script lang="ts">
	import type { Snippet } from 'svelte';
	import { magnetic } from '$lib/motion';
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';

	type Props = {
		href?: string;
		variant?: 'primary' | 'ghost' | 'light';
		size?: 'md' | 'lg';
		arrow?: boolean;
		magnet?: boolean;
		block?: boolean;
		onclick?: (e: MouseEvent) => void;
		children: Snippet;
	};

	let {
		href,
		variant = 'primary',
		size = 'lg',
		arrow = true,
		magnet = true,
		block = false,
		onclick,
		children
	}: Props = $props();
</script>

{#snippet inner()}
	<span class="btn__glow" aria-hidden="true"></span>
	<span class="btn__label">{@render children()}</span>
	{#if arrow}
		<ArrowRightIcon class="btn__arrow" weight="bold" size={18} aria-hidden="true" />
	{/if}
{/snippet}

{#if href}
	<a
		{href}
		class="btn btn--{variant} btn--{size}"
		class:btn--block={block}
		{onclick}
		{@attach magnet ? magnetic() : undefined}
	>
		{@render inner()}
	</a>
{:else}
	<button
		type="button"
		class="btn btn--{variant} btn--{size}"
		class:btn--block={block}
		{onclick}
		{@attach magnet ? magnetic() : undefined}
	>
		{@render inner()}
	</button>
{/if}

<style>
	.btn {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.6em;
		font-family: var(--tt-font-body);
		font-weight: 700;
		letter-spacing: 0.01em;
		line-height: 1;
		border-radius: 999px;
		overflow: hidden;
		isolation: isolate;
		text-transform: uppercase;
		font-size: 0.82rem;
		/* No `transform` here — the magnetic() attachment drives transform per-frame
		   via GSAP; a CSS transition on the same property would fight every write. */
		transition:
			box-shadow 0.3s ease,
			color 0.3s ease;
	}
	.btn--md {
		padding: 0.85rem 1.5rem;
	}
	.btn--lg {
		padding: 1.15rem 2.2rem;
		font-size: 0.9rem;
	}
	.btn--block {
		display: flex;
		width: 100%;
	}

	.btn__label {
		position: relative;
		z-index: 2;
	}
	:global(.btn__arrow) {
		position: relative;
		z-index: 2;
		transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
	}
	.btn:hover :global(.btn__arrow) {
		transform: translateX(4px);
	}

	.btn__glow {
		position: absolute;
		inset: 0;
		z-index: 1;
		border-radius: inherit;
	}

	/* Primary — brand red with a molten sheen */
	.btn--primary {
		color: #fff;
		background: linear-gradient(180deg, var(--tt-red-hot), var(--tt-red) 55%, var(--tt-red-600));
		box-shadow:
			0 1px 0 rgba(255, 255, 255, 0.25) inset,
			0 14px 34px -12px rgb(var(--tt-red-rgb) / 0.85);
	}
	.btn--primary .btn__glow {
		background: radial-gradient(120% 140% at 50% -20%, rgba(255, 255, 255, 0.55), transparent 55%);
		opacity: 0.6;
		transition: opacity 0.4s ease;
	}
	.btn--primary:hover {
		box-shadow:
			0 1px 0 rgba(255, 255, 255, 0.3) inset,
			0 20px 46px -12px rgb(var(--tt-red-bright-rgb) / 0.9);
	}
	.btn--primary:hover .btn__glow {
		opacity: 1;
	}

	/* Ghost — outline on dark */
	.btn--ghost {
		color: var(--tt-white);
		background: rgba(255, 255, 255, 0.03);
		box-shadow: 0 0 0 1px var(--tt-line-strong) inset;
	}
	.btn--ghost:hover {
		background: rgba(255, 255, 255, 0.08);
		box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.35) inset;
	}

	/* Light — for bright sections */
	.btn--light {
		color: var(--tt-paper-ink);
		background: #fff;
		box-shadow: 0 14px 34px -14px rgba(0, 0, 0, 0.5);
	}
	.btn--light:hover {
		box-shadow: 0 20px 40px -14px rgba(0, 0, 0, 0.6);
	}
</style>
