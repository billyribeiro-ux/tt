<script lang="ts">
	import { reveal } from '$lib/motion';
	import { external } from '$lib/data/site';
	import ArrowUpRightIcon from 'phosphor-svelte/lib/ArrowUpRightIcon';

	// Honest guidance — the more of this you include, the faster we can actually help.
	const tips = [
		{
			title: 'The email on your account',
			body: 'So we can find you. Write from it if you can, or tell us what it is — we can only look up an account by the address it was created with.'
		},
		{
			title: 'What it involves',
			body: 'Membership, a specific course, billing, or logging in. Naming the product up front saves a round-trip.'
		},
		{
			title: 'What you expected vs. what happened',
			body: 'A sentence or two — and a screenshot if there is one. Concrete detail is the difference between one reply and five.'
		}
	];

	// Real self-serve destinations — homepage anchors and live-site policy pages.
	const pointers = [
		{ label: 'Read the common questions', href: '/#faq' },
		{ label: 'Compare the plans', href: '/#pricing' },
		{ label: 'Cancellation policy', href: external.cancellationPolicy }
	];
</script>

<section class="c-sup tt-section" aria-labelledby="c-sup-title">
	<div class="tt-container">
		<header class="section-head">
			<span class="idx">02 / 02</span>
			<span class="rule"></span>
			<span class="label">Before you write</span>
		</header>

		<div class="c-sup__grid">
			<div class="c-sup__lead">
				<h2 id="c-sup-title" class="c-sup__title">
					Three lines that earn a <span class="text-red">faster</span> answer.
				</h2>
				<p class="c-sup__note prose">
					We answer messages in the order they arrive, as quickly as we responsibly can — there is
					no automated queue here, just people reading email between live sessions. Give us the
					details below and the reply that comes back can actually solve it, instead of asking for
					more.
				</p>

				<div class="c-sup__pointers">
					<span class="label c-sup__pointers-tag">Often quicker than waiting</span>
					<ul>
						{#each pointers as p (p.label)}
							<li>
								<a href={p.href}>
									{p.label}<ArrowUpRightIcon size={15} weight="bold" aria-hidden="true" />
								</a>
							</li>
						{/each}
					</ul>
				</div>
			</div>

			<ol class="c-sup__list" data-anim-stagger {@attach reveal({ stagger: 0.1, y: 26 })}>
				{#each tips as tip, i (tip.title)}
					<li class="c-sup__item">
						<span class="c-sup__num num">0{i + 1}</span>
						<div class="c-sup__item-body">
							<h3 class="c-sup__item-title">{tip.title}</h3>
							<p class="c-sup__item-text">{tip.body}</p>
						</div>
					</li>
				{/each}
			</ol>
		</div>
	</div>
</section>

<style>
	.c-sup {
		background: var(--tt-ink);
		border-top: 1px solid var(--tt-line);
	}
	.c-sup__grid {
		display: grid;
		gap: clamp(2.4rem, 5vw, 4rem);
	}
	.c-sup__title {
		font-size: var(--fs-h2);
		font-weight: 800;
		letter-spacing: -0.02em;
		color: #fff;
		max-width: 15ch;
	}
	.c-sup__note {
		margin-top: 1.4rem;
		font-size: var(--fs-body);
		max-width: 54ch;
	}
	.c-sup__pointers {
		margin-top: 2rem;
		padding-top: 1.6rem;
		border-top: 1px solid var(--tt-line);
	}
	.c-sup__pointers-tag {
		display: block;
		margin-bottom: 1rem;
		color: var(--tt-mute-2);
	}
	.c-sup__pointers ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.55rem;
	}
	.c-sup__pointers a {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--tt-fog);
		transition: color 0.25s ease;
	}
	.c-sup__pointers a:hover {
		color: var(--tt-red-bright);
	}

	.c-sup__list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0;
		align-self: start;
	}
	.c-sup__item {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 1.2rem;
		padding: 1.4rem 0;
		border-top: 1px solid var(--tt-line);
	}
	.c-sup__item:last-child {
		border-bottom: 1px solid var(--tt-line);
	}
	.c-sup__num {
		font-size: 0.9rem;
		font-weight: 700;
		color: var(--tt-red-bright);
		padding-top: 0.15rem;
	}
	.c-sup__item-title {
		font-size: var(--fs-h4);
		font-weight: 700;
		color: #fff;
		letter-spacing: -0.01em;
		line-height: 1.25;
	}
	.c-sup__item-text {
		margin-top: 0.5rem;
		max-width: 56ch;
		color: var(--tt-mute);
		font-size: 0.96rem;
	}

	@media (min-width: 900px) {
		.c-sup__grid {
			grid-template-columns: 1fr 1fr;
			align-items: start;
		}
	}
</style>
