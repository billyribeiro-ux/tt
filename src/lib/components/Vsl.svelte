<script lang="ts">
	import PlayIcon from 'phosphor-svelte/lib/PlayIcon';
	import { site } from '$lib/data/site';

	type Props = {
		poster?: string;
		src?: string;
		label?: string;
	};
	let {
		poster = site.videoPoster,
		src = site.videoEmbed,
		label = 'Watch the film'
	}: Props = $props();

	let playing = $state(false);
	const iframeSrc = $derived(src + (src.includes('?') ? '&' : '?') + 'autoplay=1');
</script>

<div class="vsl" class:vsl--playing={playing}>
	<div class="vsl__frame">
		{#if playing}
			<iframe
				src={iframeSrc}
				title="Trick Trades: {label}"
				allow="autoplay; fullscreen; picture-in-picture"
				allowfullscreen
				loading="eager"
			></iframe>
		{:else}
			<button class="vsl__facade" type="button" onclick={() => (playing = true)}>
				{#if poster === site.videoPoster}
					<!-- Self-hosted, pre-optimized variants of the real poster (same photo,
					     18–56 KB AVIF/WebP vs the 118 KB cross-origin JPEG). -->
					<picture>
						<source
							type="image/avif"
							srcset="/pat-barn-640.avif 640w, /pat-barn-1200.avif 1200w"
							sizes="(min-width: 900px) 46vw, 92vw"
						/>
						<source
							type="image/webp"
							srcset="/pat-barn-640.webp 640w, /pat-barn-1200.webp 1200w"
							sizes="(min-width: 900px) 46vw, 92vw"
						/>
						<img
							class="vsl__poster"
							src="/pat-barn-1200.jpg"
							alt="Pat “Trick” Mitchell of Trick Trades"
							width="1200"
							height="800"
							loading="eager"
							fetchpriority="high"
						/>
					</picture>
				{:else}
					<img
						class="vsl__poster"
						src={poster}
						alt="Pat “Trick” Mitchell of Trick Trades"
						width="1200"
						height="800"
						loading="eager"
						fetchpriority="high"
					/>
				{/if}
				<span class="vsl__scrim" aria-hidden="true"></span>
				<span class="vsl__play">
					<span class="vsl__pulse" aria-hidden="true"></span>
					<PlayIcon weight="fill" size={26} />
				</span>
				<span class="vsl__meta">
					<span class="vsl__dot" aria-hidden="true"></span>
					{label}
				</span>
			</button>
		{/if}
	</div>
	<span class="vsl__corner vsl__corner--tl" aria-hidden="true"></span>
	<span class="vsl__corner vsl__corner--br" aria-hidden="true"></span>
</div>

<style>
	.vsl {
		position: relative;
		border-radius: var(--tt-radius-lg);
	}
	.vsl__frame {
		position: relative;
		aspect-ratio: 16 / 9;
		border-radius: var(--tt-radius-lg);
		overflow: hidden;
		background: #000;
		box-shadow:
			0 0 0 1px var(--tt-line-strong),
			0 40px 90px -30px rgba(0, 0, 0, 0.9),
			0 0 80px -30px rgba(178, 39, 37, 0.6);
	}
	.vsl__frame iframe {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		border: 0;
	}
	.vsl__facade {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		padding: 0;
		display: block;
		cursor: pointer;
	}
	.vsl__frame picture {
		position: absolute;
		inset: 0;
	}
	.vsl__poster {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
	}
	.vsl__facade:hover .vsl__poster {
		transform: scale(1.04);
	}
	.vsl__scrim {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(60% 60% at 50% 45%, transparent, rgba(0, 0, 0, 0.35)),
			linear-gradient(180deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.55));
	}
	.vsl__play {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: grid;
		place-items: center;
		width: 84px;
		height: 84px;
		border-radius: 50%;
		color: #fff;
		background: linear-gradient(150deg, var(--tt-red-bright), var(--tt-red-600));
		box-shadow: 0 20px 50px -12px rgba(255, 51, 51, 0.8);
		transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
	}
	.vsl__facade:hover .vsl__play {
		transform: translate(-50%, -50%) scale(1.08);
	}
	.vsl__pulse {
		position: absolute;
		inset: 0;
		border-radius: 50%;
		border: 2px solid rgba(255, 51, 51, 0.6);
		animation: vslPulse 2.4s ease-out infinite;
	}
	@keyframes vslPulse {
		0% {
			transform: scale(1);
			opacity: 0.7;
		}
		100% {
			transform: scale(1.8);
			opacity: 0;
		}
	}
	.vsl__meta {
		position: absolute;
		left: 1.25rem;
		bottom: 1.15rem;
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		font-family: var(--tt-font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: #fff;
	}
	.vsl__dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--tt-red-bright);
		box-shadow: 0 0 12px var(--tt-red-bright);
		animation: vslBlink 1.6s steps(1) infinite;
	}
	@keyframes vslBlink {
		50% {
			opacity: 0.25;
		}
	}
	/* Corner registration marks, a subtle editorial detail */
	.vsl__corner {
		position: absolute;
		width: 22px;
		height: 22px;
		z-index: 2;
		pointer-events: none;
	}
	.vsl__corner--tl {
		top: -6px;
		left: -6px;
		border-top: 2px solid var(--tt-red-bright);
		border-left: 2px solid var(--tt-red-bright);
	}
	.vsl__corner--br {
		bottom: -6px;
		right: -6px;
		border-bottom: 2px solid var(--tt-red-bright);
		border-right: 2px solid var(--tt-red-bright);
	}
	@media (prefers-reduced-motion: reduce) {
		.vsl__pulse,
		.vsl__dot {
			animation: none;
		}
	}
</style>
