<script lang="ts">
	import { reveal, splitReveal } from '$lib/motion';

	import DeviceMobileIcon from 'phosphor-svelte/lib/DeviceMobileIcon';
	import MoonStarsIcon from 'phosphor-svelte/lib/MoonStarsIcon';
	import BellIcon from 'phosphor-svelte/lib/BellIcon';
	import ChatsCircleIcon from 'phosphor-svelte/lib/ChatsCircleIcon';
	import AppleLogoIcon from 'phosphor-svelte/lib/AppleLogoIcon';
	import AndroidLogoIcon from 'phosphor-svelte/lib/AndroidLogoIcon';
	import MonitorIcon from 'phosphor-svelte/lib/MonitorIcon';

	// Every fact here traces to $lib/data/site.ts — nothing invented.
	const appFeatures = [
		{
			icon: DeviceMobileIcon,
			title: 'iOS, Android & Desktop',
			body: 'One membership, every device. Open the Size UP! App anywhere and you’re trade-ready in seconds.'
		},
		{
			icon: MoonStarsIcon,
			title: 'Nightly video watch list',
			body: 'Recorded every night and viewable on any device — high-probability, cherry-picked setups for the next session.'
		},
		{
			icon: BellIcon,
			title: 'Live Pre-Market Plan of Attack',
			body: 'The PMPOA covered live on screen share at 9 a.m. EST sharp, so you go into the open with a real plan.'
		},
		{
			icon: ChatsCircleIcon,
			title: '24/7 community chat',
			body: 'Ask questions, get help, or make new friends any time — day, night and weekends. We never shut down.'
		}
	];
</script>

<section class="tt-section join-app" aria-labelledby="join-app-title">
	<div class="tt-container join-app__inner">
		<div class="join-app__lead">
			<div class="section-head">
				<span class="idx">01 / 02</span>
				<span class="rule"></span>
				<span class="label">The Size UP! App</span>
			</div>

			<h2
				id="join-app-title"
				class="join-app__title"
				data-split
				{@attach splitReveal({ stagger: 0.026 })}
			>
				Your entire edge, on every screen.
			</h2>

			<p class="join-app__copy">
				Guidance, the nightly watch list, the live plan and the room travel with you — the Size UP!
				App runs on iOS, Android and Desktop, so you’re trade-ready wherever the day takes you.
			</p>

			<div class="app-win" data-anim {@attach reveal({ y: 40, scale: 0.97, duration: 1.1 })}>
				<div class="app-win__bar">
					<span class="app-win__dots" aria-hidden="true"><i></i><i></i><i></i></span>
					<span class="app-win__tag label">
						<span class="app-win__live" aria-hidden="true"></span>Size UP! · Live
					</span>
				</div>
				<div class="app-win__body">
					<ul class="app-win__plats">
						<li>
							<span class="app-win__pico"><AppleLogoIcon weight="fill" size={18} /></span>
							<span>iOS</span>
						</li>
						<li>
							<span class="app-win__pico"><AndroidLogoIcon weight="fill" size={18} /></span>
							<span>Android</span>
						</li>
						<li>
							<span class="app-win__pico"><MonitorIcon weight="regular" size={18} /></span>
							<span>Desktop</span>
						</li>
					</ul>
					<hr class="app-win__rule" />
					<dl class="app-win__status">
						<div class="app-win__row"><dt>Nightly watch list</dt><dd class="num">Ready</dd></div>
						<div class="app-win__row"><dt>Pre-Market Plan</dt><dd class="num">9:00 AM EST</dd></div>
						<div class="app-win__row"><dt>Community chat</dt><dd class="num">24 / 7</dd></div>
					</dl>
				</div>
			</div>
		</div>

		<ul class="join-app__feats" data-anim-stagger {@attach reveal({ stagger: 0.1, y: 28 })}>
			{#each appFeatures as f, i (f.title)}
				{@const Icon = f.icon}
				<li class="feat">
					<span class="feat__idx num">{String(i + 1).padStart(2, '0')}</span>
					<span class="feat__ico" aria-hidden="true"><Icon weight="regular" size={24} /></span>
					<div class="feat__text">
						<h3 class="feat__title">{f.title}</h3>
						<p class="feat__body">{f.body}</p>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.join-app {
		position: relative;
		background: var(--tt-ink);
		box-shadow:
			inset 0 1px 0 var(--tt-line),
			inset 0 -1px 0 var(--tt-line);
		overflow: clip;
	}
	.join-app__inner {
		display: grid;
		gap: clamp(2.4rem, 5vw, 4rem);
		align-items: start;
	}
	.join-app__title {
		max-width: 14ch;
		font-size: var(--fs-h2);
		color: var(--tt-white);
	}
	.join-app__copy {
		margin-top: 1.3rem;
		max-width: 48ch;
		font-size: var(--fs-lead);
		color: var(--tt-fog);
	}

	/* Editorial "app window" — a terminal-style panel, real labels only */
	.app-win {
		margin-top: clamp(2rem, 4vw, 2.8rem);
		max-width: 460px;
		border: 1px solid var(--tt-line-strong);
		border-radius: var(--tt-radius);
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent 40%), var(--tt-ink-2);
		box-shadow: var(--tt-shadow-card);
		overflow: hidden;
	}
	.app-win__bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.7rem 1rem;
		border-bottom: 1px solid var(--tt-line);
		background: rgba(255, 255, 255, 0.02);
	}
	.app-win__dots {
		display: inline-flex;
		gap: 6px;
	}
	.app-win__dots i {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: var(--tt-line-strong);
	}
	.app-win__tag {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--tt-fog);
	}
	.app-win__live {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--tt-red-bright);
		box-shadow: 0 0 10px var(--tt-red-bright);
	}
	.app-win__body {
		padding: clamp(1.1rem, 3vw, 1.5rem);
	}
	.app-win__plats {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
	}
	.app-win__plats li {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.4rem 0.75rem;
		font-family: var(--tt-font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.06em;
		color: var(--tt-fog);
		border: 1px solid var(--tt-line);
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.02);
	}
	.app-win__pico {
		display: inline-flex;
		color: var(--tt-white);
	}
	.app-win__rule {
		margin: 1.1rem 0;
		border: 0;
		height: 1px;
		background: var(--tt-line);
	}
	.app-win__status {
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
	}
	.app-win__row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}
	.app-win__row dt {
		font-size: 0.86rem;
		color: var(--tt-mute);
	}
	.app-win__row dd {
		margin: 0;
		font-size: 0.8rem;
		letter-spacing: 0.04em;
		color: var(--tt-gold);
	}

	/* Feature list — hairline rows, small monochrome icons, mono index */
	.join-app__feats {
		list-style: none;
		margin: 0;
		padding: 0;
		border-top: 1px solid var(--tt-line);
	}
	.feat {
		display: grid;
		grid-template-columns: auto auto 1fr;
		align-items: start;
		gap: 0.7rem 1.1rem;
		padding: clamp(1.3rem, 3vw, 1.7rem) 0;
		border-bottom: 1px solid var(--tt-line);
	}
	.feat__idx {
		font-size: 0.72rem;
		letter-spacing: 0.1em;
		color: var(--tt-red-bright);
		padding-top: 0.35rem;
	}
	.feat__ico {
		display: inline-flex;
		color: var(--tt-fog);
		padding-top: 0.1rem;
	}
	.feat__title {
		font-size: var(--fs-h4);
		font-weight: 700;
		line-height: 1.2;
		color: var(--tt-white);
	}
	.feat__body {
		margin-top: 0.4rem;
		max-width: 44ch;
		font-size: 0.95rem;
		color: var(--tt-mute);
	}

	@media (min-width: 900px) {
		.join-app__inner {
			grid-template-columns: 1.02fr 0.98fr;
			gap: clamp(3rem, 6vw, 5rem);
		}
	}
</style>
