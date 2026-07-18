<script lang="ts">
	import { reveal, splitReveal, parallax } from '$lib/motion';
	import { site } from '$lib/data/site';
	import EnvelopeSimpleIcon from 'phosphor-svelte/lib/EnvelopeSimpleIcon';
	import ChatsCircleIcon from 'phosphor-svelte/lib/ChatsCircleIcon';
</script>

<section class="c-hero" aria-label="Contact Trick Trades">
	<div class="c-hero__bg" aria-hidden="true">
		<div class="c-hero__grid grid-bg"></div>
		<div class="c-hero__glow" {@attach parallax(120)}></div>
	</div>

	<div class="tt-container c-hero__inner">
		<div class="c-hero__copy">
			<p class="c-hero__kicker label">
				<span class="c-hero__dot" aria-hidden="true"></span>Contact · Support
			</p>

			<h1 class="c-hero__title" data-split {@attach splitReveal({ stagger: 0.03 })}>
				A real person reads <span class="text-red">every</span> message.
			</h1>

			<div class="c-hero__stack" data-anim-stagger {@attach reveal({ stagger: 0.12, y: 26 })}>
				<p class="c-hero__lede">
					Trick Trades is an <strong>education-first</strong> mentorship, not a call center. There
					is no ticket bot and no phone tree here, just the team behind the room. The quickest way
					to reach us is <strong>email</strong>; for day-to-day questions, the private Facebook
					group is often faster still.
				</p>

				<dl class="c-hero__meta">
					<div class="c-hero__meta-item">
						<dt class="label">Best for account &amp; billing</dt>
						<dd class="num">
							<a href="mailto:{site.support}">{site.support}</a>
						</dd>
					</div>
					<span class="c-hero__meta-sep" aria-hidden="true"></span>
					<div class="c-hero__meta-item">
						<dt class="label">Best for quick questions</dt>
						<dd>Private Facebook group</dd>
					</div>
				</dl>
			</div>
		</div>

		<!-- Decorative "message" card. Echoes the mailto, not real correspondence. -->
		<div
			class="c-hero__panel"
			aria-hidden="true"
			{@attach parallax(-40)}
			data-anim
			{@attach reveal({ y: 60, scale: 0.97, duration: 1.2 })}
		>
			<div class="c-panel__head">
				<span class="label c-panel__tag"><span class="c-panel__dot"></span>New message</span>
				<span class="label c-panel__to">To · Support</span>
			</div>
			<div class="c-panel__field">
				<span class="c-panel__ico"><EnvelopeSimpleIcon size={18} weight="regular" /></span>
				<span class="num c-panel__addr">{site.support}</span>
			</div>
			<div class="c-panel__lines">
				<span></span>
				<span></span>
				<span></span>
			</div>
			<div class="c-panel__foot">
				<span class="c-panel__chip"
					><ChatsCircleIcon size={16} weight="regular" />Facebook group</span
				>
				<span class="c-panel__send">Send</span>
			</div>
		</div>
	</div>
</section>

<style>
	.c-hero {
		position: relative;
		padding-top: calc(var(--tt-header-h) + clamp(2rem, 6vw, 5rem));
		padding-bottom: clamp(3rem, 6vw, 5rem);
		overflow: clip;
	}
	.c-hero__bg {
		position: absolute;
		inset: 0;
		z-index: 0;
	}
	.c-hero__grid {
		position: absolute;
		inset: -10% 0 0;
		opacity: 0.5;
	}
	.c-hero__glow {
		position: absolute;
		top: -18%;
		right: -12%;
		width: 70vw;
		height: 70vw;
		max-width: 880px;
		max-height: 880px;
		background: radial-gradient(circle, rgb(var(--tt-red-rgb) / 0.4), transparent 62%);
		filter: blur(20px);
	}
	.c-hero__inner {
		position: relative;
		z-index: 1;
		display: grid;
		gap: clamp(2.5rem, 5vw, 4rem);
		align-items: center;
	}
	.c-hero__kicker {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		color: var(--tt-fog);
	}
	.c-hero__dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--tt-red-bright);
		box-shadow: 0 0 12px var(--tt-red-bright);
	}
	.c-hero__title {
		margin-top: 1.4rem;
		font-size: var(--fs-h1);
		font-weight: 800;
		letter-spacing: -0.03em;
		line-height: 0.98;
		color: #fff;
		max-width: 16ch;
	}
	.c-hero__lede {
		margin-top: 1.6rem;
		max-width: 54ch;
		font-size: var(--fs-lead);
		color: var(--tt-fog);
	}
	.c-hero__lede strong {
		color: #fff;
		font-weight: 600;
	}
	.c-hero__meta {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: 1.4rem;
		margin: 2.6rem 0 0;
		padding-top: 1.8rem;
		border-top: 1px solid var(--tt-line);
	}
	.c-hero__meta-sep {
		align-self: stretch;
		width: 1px;
		background: var(--tt-line-strong);
	}
	.c-hero__meta-item dt {
		color: var(--tt-mute-2);
	}
	.c-hero__meta-item dd {
		margin: 0.5rem 0 0;
		font-size: clamp(1rem, 0.9rem + 0.5vw, 1.2rem);
		font-weight: 600;
		color: #fff;
		line-height: 1.15;
	}
	.c-hero__meta-item dd a {
		color: #fff;
		border-bottom: 1px solid var(--tt-line-strong);
		transition: color 0.25s ease;
	}
	.c-hero__meta-item dd a:hover {
		color: var(--tt-red-bright);
	}

	/* Decorative message card */
	.c-hero__panel {
		position: relative;
		padding: clamp(1.3rem, 2.6vw, 1.9rem);
		border: 1px solid var(--tt-line-strong);
		border-radius: var(--tt-radius-lg);
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01));
		box-shadow: var(--tt-shadow-card);
	}
	.c-panel__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding-bottom: 1.1rem;
		border-bottom: 1px solid var(--tt-line);
	}
	.c-panel__tag {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--tt-fog);
	}
	.c-panel__dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--tt-red-bright);
		box-shadow: 0 0 10px var(--tt-red-bright);
	}
	.c-panel__to {
		color: var(--tt-mute-2);
	}
	.c-panel__field {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		margin-top: 1.2rem;
		padding: 0.85rem 1rem;
		border: 1px solid var(--tt-line);
		border-radius: 10px;
		background: rgba(255, 255, 255, 0.02);
	}
	.c-panel__ico {
		display: grid;
		place-items: center;
		color: var(--tt-red-bright);
	}
	.c-panel__addr {
		font-size: 0.92rem;
		color: #fff;
	}
	.c-panel__lines {
		display: grid;
		gap: 0.75rem;
		margin: 1.4rem 0;
	}
	.c-panel__lines span {
		height: 8px;
		border-radius: 4px;
		background: var(--tt-line);
	}
	.c-panel__lines span:nth-child(2) {
		width: 82%;
	}
	.c-panel__lines span:nth-child(3) {
		width: 54%;
	}
	.c-panel__foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding-top: 1.1rem;
		border-top: 1px solid var(--tt-line);
	}
	.c-panel__chip {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		font-size: 0.78rem;
		color: var(--tt-mute);
	}
	.c-panel__send {
		padding: 0.5rem 1.1rem;
		border-radius: 999px;
		font-size: 0.78rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: #fff;
		background: linear-gradient(180deg, var(--tt-red-hot), var(--tt-red) 60%, var(--tt-red-600));
	}

	@media (min-width: 1024px) {
		.c-hero__inner {
			grid-template-columns: 1.05fr 0.95fr;
		}
	}
</style>
