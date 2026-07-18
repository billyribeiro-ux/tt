<script lang="ts">
	import { reveal } from '$lib/motion';
	import { featuredOn } from '$lib/data/site';
</script>

<section class="t-press tt-section" aria-labelledby="t-press-title">
	<div class="tt-container">
		<header class="section-head">
			<span class="idx">02 / 02</span>
			<span class="rule"></span>
			<span class="label">In the press</span>
		</header>

		<div class="t-press__grid">
			<div class="t-press__lead">
				<h2 id="t-press-title" class="t-press__title">
					As featured <span class="text-red">on.</span>
				</h2>
				<p class="t-press__note prose">
					Beyond the member room, Trick Trades and Pat &ldquo;Trick&rdquo; Mitchell&rsquo;s approach
					have been featured across national news and finance outlets.
				</p>
			</div>

			<ul class="t-press__logos" data-anim-stagger {@attach reveal({ stagger: 0.08, y: 20 })}>
				{#each featuredOn as name (name)}
					<li class="t-press__logo">{name}</li>
				{/each}
			</ul>
		</div>
	</div>
</section>

<style>
	.t-press {
		/* Compact press band: trim the tt-section rhythm so it doesn't leave dead space. */
		padding-block: clamp(3.5rem, 2rem + 5vw, 6rem);
		background: var(--tt-ink);
		border-top: 1px solid var(--tt-line);
	}
	.t-press__grid {
		display: grid;
		gap: clamp(2rem, 4vw, 3.5rem);
		align-items: center;
	}
	.t-press__title {
		font-size: var(--fs-h2);
		font-weight: 800;
		letter-spacing: -0.02em;
		color: #fff;
	}
	.t-press__note {
		margin-top: 1.2rem;
		font-size: var(--fs-body);
		max-width: 46ch;
	}
	.t-press__logos {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.9rem 1.9rem;
		align-items: center;
	}
	.t-press__logo {
		position: relative;
		font-family: var(--tt-font-display);
		font-size: clamp(1.15rem, 1rem + 0.9vw, 1.7rem);
		letter-spacing: 0.08em;
		color: var(--tt-fog);
		white-space: nowrap;
	}
	.t-press__logo + .t-press__logo::before {
		content: '';
		position: absolute;
		left: -0.95rem;
		top: 50%;
		width: 1px;
		height: 1.1em;
		background: var(--tt-line-strong);
		transform: translateY(-50%);
	}

	@media (min-width: 1024px) {
		.t-press__grid {
			grid-template-columns: 0.9fr 1.1fr;
		}
	}
</style>
