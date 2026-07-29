<script lang="ts">
	import { onMount } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import { ui } from '$lib/pages/project-alpha/state/ui.svelte';
	import { ensureGsap, ScrollTrigger } from '$lib/pages/project-alpha/motion/gsap-setup';

	const chapters = [
		{ id: 'hero', number: '00', label: 'Calibrate' },
		{ id: 'hypothesis', number: '01', label: 'The variable' },
		{ id: 'equipment', number: '02', label: 'Instrument' },
		{ id: 'pillars', number: '03', label: 'Train' },
		{ id: 'journey', number: '04', label: 'Condition' },
		{ id: 'schedule', number: '05', label: 'Repeat' },
		{ id: 'assessments', number: '06', label: 'Measure' },
		{ id: 'notes', number: '07', label: 'Protect' },
		{ id: 'apply', number: '08', label: 'Enter' }
	] as const;

	let introRoot: HTMLDivElement | undefined;
	let showIntro = $state(true);

	const captureIntro: Attachment<HTMLDivElement> = (node) => {
		introRoot = node;
		return () => {
			if (introRoot === node) introRoot = undefined;
		};
	};

	onMount(() => {
		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
		const gsap = ensureGsap();
		const cleanups: Array<() => void> = [];
		const previousTimeScale = gsap.globalTimeline.timeScale();

		// Narrative motion should read as measured observation, not UI choreography.
		// Signal visualizations keep their own physiological clocks.
		gsap.globalTimeline.timeScale(0.82);

		document.documentElement.classList.add('cinematic-ready');

		const completeIntro = () => {
			showIntro = false;
			document.documentElement.classList.add('cinematic-intro-complete');
			window.dispatchEvent(new CustomEvent('alpha:intro-complete'));
			ScrollTrigger.refresh();
		};

		// The calibration film is a first-impression beat, not a toll booth:
		// it plays once per browser session and repeat visits go straight in.
		const introSeen = sessionStorage.getItem('alpha-intro-seen') === '1';

		if (reduceMotion || introSeen) {
			completeIntro();
			document.querySelectorAll<HTMLElement>('.reveal').forEach((el) => {
				el.style.opacity = '1';
				el.style.transform = 'none';
			});
		} else {
			sessionStorage.setItem('alpha-intro-seen', '1');
			if (introRoot) {
				const intro = gsap.timeline({
					defaults: { ease: 'power3.out' },
					onComplete: completeIntro
				});

				intro
					.fromTo(
						introRoot.querySelector('.intro-scan'),
						{ scaleX: 0, transformOrigin: 'left center' },
						{ scaleX: 1, duration: 0.7, ease: 'expo.inOut' }
					)
					.from(
						introRoot.querySelectorAll('.intro-word'),
						{ yPercent: 106, opacity: 0, stagger: 0.1, duration: 0.82 },
						0.15
					)
					.from(
						introRoot.querySelector('.intro-meta'),
						{ opacity: 0, letterSpacing: '0.45em', duration: 0.55 },
						0.42
					)
					.to(
						introRoot.querySelector('.intro-copy'),
						{
							y: -18,
							opacity: 0,
							duration: 0.45,
							ease: 'power2.in'
						},
						'+=0.35'
					)
					.to(
						introRoot,
						{
							clipPath: 'inset(0 0 100% 0)',
							duration: 0.9,
							ease: 'expo.inOut'
						},
						'-=0.15'
					);

				cleanups.push(() => intro.kill());
			}

			const context = gsap.context(() => {
				// In the trick-trades integration the sections live inside the
				// .alpha-scope wrapper (the site layout owns <main>), so scope there.
				const sections = gsap.utils.toArray<HTMLElement>('.alpha-scope section[id]');

				sections
					.filter((section) => section.id !== 'hero')
					.forEach((section) => {
						const label = section.querySelector('.section-label');
						const title = section.querySelector('.section-title');
						const description = section.querySelector('.section-desc');
						const introElements = [label, title, description].filter(Boolean);

						if (introElements.length) {
							const timeline = gsap.timeline({
								scrollTrigger: {
									trigger: section,
									start: 'top 76%',
									toggleActions: 'play none none none',
									once: true
								}
							});

							if (label) {
								timeline.from(label, {
									x: -28,
									opacity: 0,
									letterSpacing: '0.45em',
									duration: 0.55,
									ease: 'power3.out',
									immediateRender: false
								});
							}
							if (title) {
								timeline.from(
									title,
									{
										yPercent: 90,
										opacity: 0,
										clipPath: 'inset(0 0 100% 0)',
										duration: 0.9,
										ease: 'expo.out',
										immediateRender: false
									},
									'-=0.28'
								);
							}
							if (description) {
								timeline.from(
									description,
									{
										y: 24,
										opacity: 0,
										duration: 0.65,
										ease: 'power3.out',
										immediateRender: false
									},
									'-=0.5'
								);
							}
						}

						gsap.fromTo(
							section,
							{ backgroundPosition: '50% 0%' },
							{
								backgroundPosition: '50% 100%',
								ease: 'none',
								scrollTrigger: {
									trigger: section,
									start: 'top bottom',
									end: 'bottom top',
									scrub: 1.2
								}
							}
						);
					});

				/* ============================================================
				   Chapter signatures. Every section moves like a different
				   neural phenomenon; nothing repeats.
				   ============================================================ */

				/* 02 Instrument: SIGNAL ACQUISITION. Each device card locks on
				   like an electrode finding contact: a damped horizontal
				   oscillation that settles to zero while focus sharpens. */
				{
					const cards = gsap.utils.toArray<HTMLElement>('#equipment .equip-card');
					cards.forEach((card, i) => {
						const tl = gsap.timeline({
							scrollTrigger: {
								trigger: card.parentElement,
								start: 'top 80%',
								toggleActions: 'play none none none',
								once: true
							},
							delay: i * 0.09
						});
						tl.from(card, {
							opacity: 0,
							y: 38,
							filter: 'blur(7px)',
							duration: 0.55,
							ease: 'power2.out',
							immediateRender: false
						}).to(
							card,
							{
								keyframes: [
									{ x: 13, duration: 0.09 },
									{ x: -9, duration: 0.09 },
									{ x: 5, duration: 0.1 },
									{ x: -2, duration: 0.11 },
									{ x: 0, duration: 0.13 }
								],
								ease: 'none'
							},
							0.18
						);
					});
				}

				/* 03 Train: THREE FREQUENCY BANDS. Each pillar settles on its
				   own damped waveform; period tightens and amplitude drops
				   from band to band, so no two pillars move alike. */
				{
					const pillars = gsap.utils.toArray<HTMLElement>('#pillars .pillar');
					pillars.forEach((pillar, i) => {
						const amp = 20 - i * 5;
						const period = 0.34 - i * 0.08;
						const tl = gsap.timeline({
							scrollTrigger: {
								trigger: pillar.parentElement,
								start: 'top 78%',
								toggleActions: 'play none none none',
								once: true
							},
							delay: i * 0.14
						});
						tl.from(pillar, {
							opacity: 0,
							y: 84,
							duration: 0.7,
							ease: 'sine.out',
							immediateRender: false
						}).to(pillar, {
							keyframes: [
								{ y: -amp, duration: period },
								{ y: amp * 0.45, duration: period },
								{ y: -amp * 0.2, duration: period },
								{ y: 0, duration: period * 1.2 }
							],
							ease: 'sine.inOut'
						});
					});
				}

				/* 05 Repeat: SPIKE TRAIN. The protocol is rhythm, so the day
				   blocks fire on a strict metronome (constant interval, sharp
				   onset) and each block's time chips tick in like a clock. */
				{
					const dayline = document.querySelector('#schedule .dayline');
					if (dayline) {
						gsap.from(dayline, {
							scaleX: 0,
							transformOrigin: 'left center',
							duration: 1.15,
							ease: 'expo.inOut',
							immediateRender: false,
							scrollTrigger: { trigger: '#schedule', start: 'top 74%', once: true }
						});
					}
					const blocks = gsap.utils.toArray<HTMLElement>('#schedule .block');
					blocks.forEach((block, i) => {
						const tl = gsap.timeline({
							scrollTrigger: {
								trigger: block.parentElement,
								start: 'top 80%',
								toggleActions: 'play none none none',
								once: true
							},
							delay: i * 0.2
						});
						tl.from(block, {
							opacity: 0,
							scale: 0.92,
							y: 24,
							duration: 0.5,
							ease: 'back.out(2.4)',
							immediateRender: false
						}).from(
							block.querySelectorAll('.time'),
							{
								opacity: 0,
								x: -8,
								stagger: 0.07,
								duration: 0.22,
								ease: 'power1.out',
								immediateRender: false
							},
							0.22
						);
					});
				}

				/* 07 Protect: RETURN TO BASELINE. The calm chapter: notes
				   surface slowly from out-of-focus to rest, no overshoot,
				   the longest and gentlest movement on the page. */
				gsap.from('#notes .note', {
					opacity: 0,
					y: 30,
					filter: 'blur(10px)',
					stagger: 0.16,
					duration: 1.5,
					ease: 'sine.out',
					immediateRender: false,
					scrollTrigger: { trigger: '#notes .grid', start: 'top 80%', once: true }
				});

				gsap.from('#hypothesis .pill:first-child', {
					x: -90,
					rotate: -4,
					opacity: 0,
					duration: 0.9,
					ease: 'expo.out',
					immediateRender: false,
					scrollTrigger: { trigger: '#hypothesis .thesis-row', start: 'top 84%' }
				});
				gsap.from('#hypothesis .pill:last-child', {
					x: 90,
					rotate: 4,
					opacity: 0,
					duration: 0.9,
					ease: 'expo.out',
					immediateRender: false,
					scrollTrigger: { trigger: '#hypothesis .thesis-row', start: 'top 84%' }
				});
				gsap.from('#hypothesis .x', {
					scale: 0,
					rotate: -180,
					duration: 0.75,
					ease: 'back.out(2)',
					immediateRender: false,
					scrollTrigger: { trigger: '#hypothesis .thesis-row', start: 'top 84%' }
				});
				gsap.from('#hypothesis .hypothesis, #hypothesis .viz', {
					y: 60,
					opacity: 0,
					scale: 0.97,
					stagger: 0.16,
					duration: 1.1,
					ease: 'expo.out',
					immediateRender: false,
					scrollTrigger: { trigger: '#hypothesis .grid', start: 'top 80%' }
				});

				gsap.from('#equipment .icon-wrap', {
					rotateY: -150,
					scale: 0.45,
					opacity: 0,
					stagger: 0.1,
					duration: 0.85,
					ease: 'back.out(1.7)',
					immediateRender: false,
					scrollTrigger: { trigger: '#equipment .grid', start: 'top 78%' }
				});

				gsap.from('#pillars .bar', {
					scaleX: 0,
					transformOrigin: 'left center',
					stagger: 0.14,
					duration: 1.1,
					ease: 'expo.out',
					immediateRender: false,
					scrollTrigger: { trigger: '#pillars .grid', start: 'top 77%' }
				});

				/* 06 Measure: SNAPSHOT. Each assessment card is captured, not
				   revealed: an oscilloscope-shutter wipe followed by a brief
				   exposure flash, like the brain snapshot it describes. */
				{
					const cards = gsap.utils.toArray<HTMLElement>('#assessments .card');
					cards.forEach((card, i) => {
						const tl = gsap.timeline({
							scrollTrigger: {
								trigger: card.parentElement,
								start: 'top 80%',
								toggleActions: 'play none none none',
								once: true
							},
							delay: i * 0.16
						});
						tl.from(card, {
							clipPath: 'inset(0 0 100% 0 round 18px)',
							duration: 0.95,
							ease: 'expo.inOut',
							immediateRender: false
						}).to(
							card,
							{
								keyframes: [
									{ filter: 'brightness(1.32) saturate(1.1)', duration: 0.09 },
									{ filter: 'brightness(1) saturate(1)', duration: 0.42 }
								],
								ease: 'power1.out'
							},
							0.78
						);
					});
				}

				/* 08 Enter: PHASE-LOCK. The finale animates alpha coherence
				   itself: the three perk badges arrive desynchronized
				   (scattered offsets, opposing rotations) and lock into
				   alignment as the aperture opens. */
				gsap.from('#apply .cta', {
					clipPath: 'inset(12% 12% 12% 12% round 80px)',
					scale: 0.94,
					opacity: 0,
					duration: 1.35,
					ease: 'expo.out',
					immediateRender: false,
					scrollTrigger: { trigger: '#apply', start: 'top 76%' }
				});
				{
					const perks = gsap.utils.toArray<HTMLElement>('#apply .perks li');
					const scatterX = [-72, 58, -44];
					const scatterY = [26, -20, 32];
					const scatterR = [-6, 5, -4];
					perks.forEach((perk, i) => {
						gsap.from(perk, {
							x: scatterX[i % 3],
							y: scatterY[i % 3],
							rotate: scatterR[i % 3],
							opacity: 0,
							duration: 1.05,
							delay: 0.5 + i * 0.1,
							ease: 'expo.inOut',
							immediateRender: false,
							scrollTrigger: { trigger: '#apply', start: 'top 76%', once: true }
						});
					});
				}
				gsap.to('#apply .glow', {
					rotate: 18,
					scale: 1.35,
					ease: 'none',
					scrollTrigger: {
						trigger: '#apply',
						start: 'top bottom',
						end: 'bottom top',
						scrub: 1
					}
				});
			});

			cleanups.push(() => context.revert());
		}

		if (finePointer && !reduceMotion) {
			let currentX = window.innerWidth * 0.5;
			let currentY = window.innerHeight * 0.5;
			let targetX = currentX;
			let targetY = currentY;
			let pointerFrame = 0;

			const renderPointer = () => {
				currentX += (targetX - currentX) * 0.13;
				currentY += (targetY - currentY) * 0.13;
				document.documentElement.style.setProperty('--pointer-x', `${currentX}px`);
				document.documentElement.style.setProperty('--pointer-y', `${currentY}px`);
				pointerFrame = requestAnimationFrame(renderPointer);
			};
			const movePointer = (event: PointerEvent) => {
				targetX = event.clientX;
				targetY = event.clientY;
			};

			window.addEventListener('pointermove', movePointer, { passive: true });
			pointerFrame = requestAnimationFrame(renderPointer);
			cleanups.push(() => {
				window.removeEventListener('pointermove', movePointer);
				cancelAnimationFrame(pointerFrame);
			});

			const tiltCards = document.querySelectorAll<HTMLElement>(
				'.equip-card, .pillar, .block, #assessments .card, .note, .phase-content'
			);
			tiltCards.forEach((card) => {
				const move = (event: PointerEvent) => {
					const bounds = card.getBoundingClientRect();
					const px = (event.clientX - bounds.left) / bounds.width;
					const py = (event.clientY - bounds.top) / bounds.height;
					card.style.setProperty('--card-x', `${px * 100}%`);
					card.style.setProperty('--card-y', `${py * 100}%`);
					gsap.to(card, {
						rotateX: (0.5 - py) * 4.5,
						rotateY: (px - 0.5) * 5.5,
						y: -5,
						duration: 0.45,
						ease: 'power3.out',
						overwrite: 'auto'
					});
				};
				const leave = () => {
					gsap.to(card, {
						rotateX: 0,
						rotateY: 0,
						y: 0,
						duration: 0.75,
						ease: 'elastic.out(1, 0.55)',
						overwrite: 'auto'
					});
				};

				card.addEventListener('pointermove', move);
				card.addEventListener('pointerleave', leave);
				cleanups.push(() => {
					card.removeEventListener('pointermove', move);
					card.removeEventListener('pointerleave', leave);
				});
			});
		}

		requestAnimationFrame(() => ScrollTrigger.refresh());

		return () => {
			cleanups.forEach((cleanup) => cleanup());
			gsap.globalTimeline.timeScale(previousTimeScale);
			document.documentElement.classList.remove('cinematic-ready', 'cinematic-intro-complete');
		};
	});
</script>

{#if showIntro}
	<div class="intro-film" {@attach captureIntro} aria-hidden="true">
		<div class="intro-grid"></div>
		<div class="intro-copy">
			<p class="intro-meta">Project ALPHA · Signal calibration</p>
			<div class="intro-statement">
				<span class="intro-mask"><span class="intro-word noise">Noise</span></span>
				<span class="intro-mask"><span class="intro-word arrow">→</span></span>
				<span class="intro-mask"><span class="intro-word alpha">Control</span></span>
			</div>
			<div class="intro-scan"></div>
			<p class="intro-foot">Train the state. Measure the trade.</p>
		</div>
	</div>
{/if}

<div class="pointer-aura" aria-hidden="true"></div>

<aside class="chapter-rail" aria-hidden="true">
	<p class="rail-label">Protocol / Scroll</p>
	<div class="rail-track">
		{#each chapters as chapter (chapter.id)}
			<div class="rail-item" class:active={ui.activeSection === chapter.id}>
				<span class="rail-dot"></span>
				<span class="rail-number">{chapter.number}</span>
				<span class="rail-name">{chapter.label}</span>
			</div>
		{/each}
	</div>
</aside>

<style>
	.intro-film {
		position: fixed;
		inset: 0;
		z-index: 1000;
		display: grid;
		place-items: center;
		overflow: hidden;
		pointer-events: none;
		background:
			radial-gradient(circle at 50% 45%, rgba(59, 139, 235, 0.1), transparent 28%), #070709;
		clip-path: inset(0);
	}

	.intro-grid {
		position: absolute;
		inset: 0;
		opacity: 0.14;
		background-image:
			linear-gradient(rgba(59, 139, 235, 0.13) 1px, transparent 1px),
			linear-gradient(90deg, rgba(59, 139, 235, 0.13) 1px, transparent 1px);
		background-size: 56px 56px;
		mask-image: radial-gradient(circle at center, #000 0%, transparent 72%);
	}

	.intro-copy {
		position: relative;
		width: min(980px, calc(100% - 2rem));
		text-align: center;
	}

	.intro-meta,
	.intro-foot {
		margin: 0;
		font-size: 0.66rem;
		font-weight: 700;
		letter-spacing: 0.28em;
		text-transform: uppercase;
		color: var(--alpha-faint);
	}

	.intro-statement {
		display: flex;
		justify-content: center;
		align-items: baseline;
		gap: clamp(0.6rem, 3vw, 2rem);
		margin: 1.1rem 0 0.95rem;
		font-family: var(--font-display);
		font-size: clamp(2rem, 10vw, 8.5rem);
		font-weight: 650;
		line-height: 1;
		letter-spacing: -0.065em;
	}

	.intro-mask {
		display: inline-block;
		flex: 0 0 auto;
		overflow: clip;
		padding: 0.14em 0.08em 0.18em;
		margin: -0.14em -0.08em -0.18em;
	}

	.intro-word {
		display: block;
	}

	.intro-word.noise {
		color: #6f7077;
		filter: blur(0.4px);
	}

	.intro-word.arrow {
		font-family: var(--font-sans);
		font-size: 0.34em;
		color: var(--alpha-red-bright);
	}

	.intro-word.alpha {
		color: #f1f6ff;
		text-shadow: 0 0 45px rgba(59, 139, 235, 0.28);
	}

	.intro-scan {
		height: 1px;
		width: min(480px, 75%);
		margin: 0 auto 1.25rem;
		background: linear-gradient(90deg, transparent, var(--alpha-blue), transparent);
		box-shadow: 0 0 16px rgba(59, 139, 235, 0.65);
	}

	.pointer-aura {
		position: fixed;
		z-index: 2;
		left: var(--pointer-x, 50vw);
		top: var(--pointer-y, 50vh);
		width: 32rem;
		height: 32rem;
		border-radius: 50%;
		transform: translate(-50%, -50%);
		background: radial-gradient(circle, rgba(59, 139, 235, 0.045), transparent 68%);
		mix-blend-mode: screen;
		pointer-events: none;
	}

	.chapter-rail {
		position: fixed;
		z-index: 40;
		top: 50%;
		right: 1.75rem;
		transform: translateY(-50%);
		display: none;
		width: 105px;
	}

	.rail-label {
		margin: 0 0 0.75rem 17px;
		font-size: 0.52rem;
		font-weight: 700;
		letter-spacing: 0.17em;
		text-transform: uppercase;
		color: #55535a;
		white-space: nowrap;
	}

	.rail-track {
		position: relative;
		display: grid;
		gap: 0.32rem;
	}

	.rail-track::before {
		content: '';
		position: absolute;
		left: 3px;
		top: 8px;
		bottom: 8px;
		width: 1px;
		background: rgba(255, 255, 255, 0.08);
	}

	.rail-item {
		position: relative;
		display: grid;
		grid-template-columns: 8px 20px 1fr;
		align-items: center;
		gap: 0.45rem;
		min-height: 20px;
		color: #55535a;
		transition:
			color 0.45s ease,
			transform 0.55s var(--ease-out-expo);
	}

	.rail-item.active {
		color: var(--alpha-text);
		transform: translateX(-5px);
	}

	.rail-dot {
		position: relative;
		z-index: 1;
		width: 7px;
		height: 7px;
		border: 1px solid currentColor;
		border-radius: 50%;
		background: var(--alpha-bg);
		transition:
			background 0.35s ease,
			box-shadow 0.35s ease;
	}

	.rail-item.active .rail-dot {
		background: var(--alpha-blue);
		border-color: var(--alpha-blue);
		box-shadow: 0 0 12px var(--alpha-blue);
	}

	.rail-number {
		font-size: 0.52rem;
		font-variant-numeric: tabular-nums;
	}

	.rail-name {
		font-size: 0.57rem;
		font-weight: 650;
		letter-spacing: 0.11em;
		text-transform: uppercase;
		white-space: nowrap;
		opacity: 0;
		transform: translateX(7px);
		transition:
			opacity 0.35s ease,
			transform 0.45s var(--ease-out-expo);
	}

	.rail-item.active .rail-name {
		opacity: 1;
		transform: none;
	}

	@media (min-width: 1320px) {
		.chapter-rail {
			display: block;
		}
	}

	@media (hover: none), (pointer: coarse), (prefers-reduced-motion: reduce) {
		.pointer-aura {
			display: none;
		}
	}
</style>
