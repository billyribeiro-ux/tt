<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { reveal } from '$lib/motion';
	import InfinityIcon from 'phosphor-svelte/lib/InfinityIcon';
	import { STORE_URL } from './data';
</script>

<section class="tt-section outro" aria-labelledby="outro-title">
	<div class="tt-container outro__inner" data-anim {@attach reveal({ y: 32 })}>
		<span class="outro__mark" aria-hidden="true"><InfinityIcon size={40} weight="thin" /></span>
		<h2 id="outro-title" class="outro__title">
			One payment. <span class="script outro__script">yours forever.</span>
		</h2>
		<p class="outro__body prose">
			Every title in the store is a one-time purchase with lifetime access. Download or start
			streaming the second you check out. No subscription, no renewals, no expiry. Buy it once and
			it stays in your library for good.
		</p>
		<dl class="outro__meta">
			<div class="outro__meta-item">
				<dt class="label">Delivery</dt>
				<dd class="num">Instant</dd>
			</div>
			<div class="outro__meta-item">
				<dt class="label">Access</dt>
				<dd class="num">Lifetime</dd>
			</div>
			<div class="outro__meta-item">
				<dt class="label">Billing</dt>
				<dd class="num">One-time</dd>
			</div>
		</dl>
		<div class="outro__cta">
			<Button href={STORE_URL}>Enter the store</Button>
		</div>
	</div>
</section>

<style>
	.outro {
		position: relative;
		text-align: center;
		background:
			radial-gradient(ellipse 70% 60% at 50% 0%, rgb(var(--tt-red-rgb) / 0.14), transparent 60%),
			var(--tt-black);
	}
	.outro__inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		max-width: 720px;
	}
	.outro__mark {
		display: grid;
		place-items: center;
		width: 74px;
		height: 74px;
		border-radius: 50%;
		color: var(--tt-red-bright);
		border: 1px solid var(--tt-line-strong);
		background: rgba(255, 255, 255, 0.02);
	}
	.outro__title {
		margin-top: 1.6rem;
		font-size: var(--fs-h2);
		font-weight: 800;
		letter-spacing: -0.02em;
		color: #fff;
	}
	.outro__script {
		color: var(--tt-red-bright);
		font-size: 1.25em;
	}
	.outro__body {
		margin-top: 1.4rem;
		text-align: center;
	}
	.outro__meta {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1.2rem 2.4rem;
		margin: 2.4rem 0 0;
		padding: 1.6rem 0;
		border-top: 1px solid var(--tt-line);
		border-bottom: 1px solid var(--tt-line);
	}
	.outro__meta-item {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}
	.outro__meta-item dt {
		color: var(--tt-mute-2);
	}
	.outro__meta-item dd {
		margin: 0;
		font-size: 1.05rem;
		font-weight: 700;
		color: #fff;
	}
	.outro__cta {
		margin-top: 2.2rem;
	}
</style>
