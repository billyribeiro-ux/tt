<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { reveal, splitReveal, tilt } from '$lib/motion';
	import { courses } from './data';

	const featured = courses[0];
	const FeaturedIcon = featured.Icon;
	const rest = courses.slice(1);
</script>

<section id="courses" class="tt-section lib" aria-labelledby="lib-title">
	<span class="lib__glow" aria-hidden="true"></span>

	<div class="tt-container">
		<div class="section-head">
			<span class="idx">◆ The library</span>
			<span class="rule"></span>
			<span class="label lib__count">0{courses.length} programs</span>
		</div>

		<div class="lib__head">
			<h2 id="lib-title" class="lib__title" data-split {@attach splitReveal({ stagger: 0.03 })}>
				Pick your <span class="text-red">edge.</span>
			</h2>
			<p class="lib__intro prose">
				From the Boot Camp foundation to the Crystal Ball price-action series and one-on-one
				Momentum coaching — each course stands alone, and each one stacks.
			</p>
		</div>

		<!-- Featured: Momentum -->
		<article class="feat" data-anim {@attach reveal({ y: 48, duration: 1.05 })}>
			<span class="feat__reg feat__reg--tl" aria-hidden="true"></span>
			<span class="feat__reg feat__reg--br" aria-hidden="true"></span>

			<div class="feat__main">
				<div class="feat__top">
					<span class="feat__idx num">01</span>
					<span class="feat__icon"><FeaturedIcon size={22} weight="regular" /></span>
					<span class="feat__tag label">{featured.tag}</span>
				</div>

				<h3 class="feat__name">{featured.name}</h3>
				<p class="feat__tagline">{featured.tagline}</p>
				<p class="feat__lessons num">{featured.lessons}</p>
			</div>

			<div class="feat__aside">
				{#if featured.note}
					<p class="feat__note-label label">Bundled inside</p>
					<p class="feat__note">{featured.note}</p>
				{/if}
				<div class="feat__cta">
					<Button href={featured.href}>View course</Button>
				</div>
			</div>
		</article>

		<!-- Grid: the rest -->
		<ul class="grid" data-anim-stagger {@attach reveal({ stagger: 0.1, y: 40 })}>
			{#each rest as course, i (course.name)}
				{@const Icon = course.Icon}
				<li class="course" {@attach tilt(4)}>
					<div class="course__top">
						<span class="course__idx num">0{i + 2}</span>
						<span class="course__tag label">{course.tag}</span>
					</div>

					<span class="course__icon"><Icon size={22} weight="regular" /></span>

					<h3 class="course__name">{course.name}</h3>
					<p class="course__tagline">{course.tagline}</p>
					<p class="course__lessons num">{course.lessons}</p>

					<div class="course__foot">
						{#if course.price}
							<p class="course__price">
								<span class="course__cur">$</span><span class="num course__amt">{course.price}</span
								>
								{#if course.was}<del class="course__was num">${course.was}</del>{/if}
							</p>
						{:else}
							<p class="course__poa label">Pricing on course page</p>
						{/if}

						<Button href={course.href} variant="ghost" size="md">View course</Button>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.lib {
		position: relative;
		overflow: clip;
		background: var(--tt-ink);
		box-shadow:
			inset 0 1px 0 var(--tt-line),
			inset 0 -1px 0 var(--tt-line);
	}
	.lib__glow {
		position: absolute;
		z-index: 0;
		top: 8%;
		left: -10%;
		width: 44vw;
		max-width: 620px;
		aspect-ratio: 1;
		background: radial-gradient(circle, rgb(var(--tt-red-rgb) / 0.16), transparent 64%);
		filter: blur(14px);
		pointer-events: none;
	}
	.lib .tt-container {
		position: relative;
		z-index: 1;
	}
	.lib__count {
		flex: none;
		color: var(--tt-mute-2);
	}
	.lib__head {
		display: grid;
		gap: 1.2rem;
		margin-bottom: clamp(2.5rem, 5vw, 3.8rem);
	}
	.lib__title {
		font-size: var(--fs-h2);
		font-weight: 800;
		letter-spacing: -0.02em;
		color: #fff;
	}
	.lib__intro {
		max-width: 58ch;
	}
	@media (min-width: 900px) {
		.lib__head {
			grid-template-columns: 1fr 1fr;
			align-items: end;
			gap: clamp(2rem, 5vw, 4rem);
		}
	}

	/* ---- Featured (Momentum) ---- */
	.feat {
		position: relative;
		display: grid;
		gap: clamp(1.8rem, 4vw, 3rem);
		margin-bottom: clamp(1.6rem, 3vw, 2.2rem);
		padding: clamp(1.8rem, 4vw, 3rem);
		border: 1px solid rgb(var(--tt-red-rgb) / 0.42);
		border-radius: var(--tt-radius-lg);
		background:
			linear-gradient(180deg, rgb(var(--tt-red-rgb) / 0.1), transparent 42%), var(--tt-ink-2);
		box-shadow: var(--tt-shadow-card);
	}
	.feat__reg {
		position: absolute;
		width: 14px;
		height: 14px;
		border-color: rgba(255, 255, 255, 0.22);
		border-style: solid;
		border-width: 0;
		pointer-events: none;
	}
	.feat__reg--tl {
		top: 12px;
		left: 12px;
		border-top-width: 1px;
		border-left-width: 1px;
	}
	.feat__reg--br {
		right: 12px;
		bottom: 12px;
		border-right-width: 1px;
		border-bottom-width: 1px;
	}
	.feat__top {
		display: flex;
		align-items: center;
		gap: 0.9rem;
		margin-bottom: 1.3rem;
	}
	.feat__idx {
		font-size: clamp(1.4rem, 1rem + 1.5vw, 2rem);
		font-weight: 800;
		line-height: 1;
		color: var(--tt-red-bright);
	}
	.feat__icon {
		display: grid;
		place-items: center;
		width: 40px;
		height: 40px;
		border-radius: 10px;
		color: #fff;
		border: 1px solid rgb(var(--tt-red-rgb) / 0.5);
		background: rgb(var(--tt-red-rgb) / 0.08);
	}
	.feat__tag {
		margin-left: auto;
		color: var(--tt-red-bright);
	}
	.feat__name {
		font-size: var(--fs-h2);
		font-weight: 800;
		letter-spacing: -0.025em;
		color: #fff;
	}
	.feat__tagline {
		margin-top: 0.9rem;
		max-width: 34ch;
		font-size: var(--fs-lead);
		color: var(--tt-fog);
	}
	.feat__lessons {
		margin-top: 1.3rem;
		font-size: 0.82rem;
		letter-spacing: 0.04em;
		color: var(--tt-mute);
	}
	.feat__aside {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 1.4rem;
	}
	.feat__note-label {
		color: var(--tt-mute-2);
	}
	.feat__note {
		margin-top: -0.9rem;
		max-width: 26ch;
		font-size: 1rem;
		color: var(--tt-fog);
	}
	.feat__cta {
		margin-top: auto;
	}

	@media (min-width: 860px) {
		.feat {
			grid-template-columns: 1.35fr 0.65fr;
			align-items: stretch;
		}
		.feat__aside {
			padding-left: clamp(1.8rem, 4vw, 3rem);
			border-left: 1px solid var(--tt-line);
			justify-content: space-between;
		}
	}

	/* ---- Grid (remaining courses) ---- */
	.grid {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: clamp(1.1rem, 2.5vw, 1.6rem);
	}
	@media (min-width: 620px) {
		.grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	@media (min-width: 1000px) {
		.grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.course {
		display: flex;
		flex-direction: column;
		padding: clamp(1.5rem, 2.5vw, 2rem);
		border: 1px solid var(--tt-line);
		border-radius: var(--tt-radius-lg);
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent);
		will-change: transform;
		transition: border-color 0.4s ease;
	}
	.course:hover {
		border-color: var(--tt-line-strong);
	}
	.course__top {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
	}
	.course__idx {
		font-size: 0.9rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		color: var(--tt-red-bright);
	}
	.course__tag {
		color: var(--tt-mute);
	}
	.course__icon {
		display: grid;
		place-items: center;
		width: 40px;
		height: 40px;
		margin-top: 1.4rem;
		border-radius: 10px;
		color: var(--tt-fog);
		border: 1px solid var(--tt-line);
		background: rgba(255, 255, 255, 0.02);
	}
	.course__name {
		margin-top: 1.2rem;
		font-size: var(--fs-h4);
		font-weight: 700;
		letter-spacing: -0.01em;
		color: #fff;
	}
	.course__tagline {
		margin-top: 0.6rem;
		font-size: 0.95rem;
		color: var(--tt-fog);
	}
	.course__lessons {
		margin-top: 1rem;
		font-size: 0.76rem;
		letter-spacing: 0.03em;
		color: var(--tt-mute);
	}
	.course__foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-top: auto;
		padding-top: 1.5rem;
	}
	.course__price {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		color: #fff;
	}
	.course__cur {
		font-size: 1rem;
		font-weight: 700;
		color: var(--tt-fog);
	}
	.course__amt {
		font-size: clamp(1.7rem, 1.3rem + 1.5vw, 2.2rem);
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.02em;
	}
	.course__was {
		font-size: 0.85rem;
		color: var(--tt-mute-2);
		text-decoration-line: line-through;
	}
	.course__poa {
		color: var(--tt-mute-2);
	}

	@media (prefers-reduced-motion: reduce) {
		.course {
			transition: none;
		}
	}
</style>
