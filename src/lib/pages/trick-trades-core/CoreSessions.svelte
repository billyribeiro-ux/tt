<script lang="ts">
	import { reveal, splitReveal } from '$lib/motion';
	import SunHorizonIcon from 'phosphor-svelte/lib/SunHorizonIcon';
	import WaveformIcon from 'phosphor-svelte/lib/WaveformIcon';
	import LightningIcon from 'phosphor-svelte/lib/LightningIcon';
	import MoonIcon from 'phosphor-svelte/lib/MoonIcon';
	import SparkleIcon from 'phosphor-svelte/lib/SparkleIcon';

	// The four daily sessions. Durations and states are the real program spec.
	const sessions = [
		{
			name: 'Focus Session',
			len: '15 min',
			slot: 'Morning',
			state: 'Mindset',
			Icon: SunHorizonIcon,
			body: 'A short pre-market reset. Walk into the open calm, clear, and deliberate instead of already reacting.'
		},
		{
			name: 'Market Session',
			len: '1.5 hrs',
			slot: 'Live open',
			state: 'Alpha state',
			Icon: WaveformIcon,
			body: 'Alpha-state brainwave training played during live trading, so focus holds when the money is real and the pressure is on.'
		},
		{
			name: 'Power Session',
			len: '1 hr',
			slot: 'Afternoon',
			state: 'Subliminal',
			Icon: LightningIcon,
			body: 'A full hour of subliminal affirmations layered beneath the audio, quietly reinforcing the disciplined behavior you want to default to.'
		},
		{
			name: 'Sleep Session',
			len: '7 hrs',
			slot: 'Overnight',
			state: 'Delta wave',
			Icon: MoonIcon,
			body: 'Seven hours of delta-wave audio for the deep, overnight subconscious rewiring that does the heavy lifting while you sleep.'
		}
	];
</script>

<section id="sessions" class="sess tt-section" aria-labelledby="sess-title">
	<span class="sess__glow" aria-hidden="true"></span>

	<div class="tt-container">
		<header class="sess__head">
			<div class="section-head">
				<span class="idx">01 / 02</span>
				<span class="rule"></span>
				<span class="label">A day on the program</span>
			</div>
			<h2 id="sess-title" class="sess__title" data-split {@attach splitReveal({ stagger: 0.03 })}>
				Four sessions, from the <span class="text-red">open bell</span> to deep sleep.
			</h2>
			<p class="sess__intro prose">
				The rewiring isn’t one download you listen to once. It’s a daily rhythm: a short morning
				reset, focus during the trade, reinforcement after, and the deep overnight work that changes
				the default.
			</p>
		</header>

		<ol class="sess__list" data-anim-stagger {@attach reveal({ stagger: 0.1, y: 34 })}>
			{#each sessions as s, i (s.name)}
				{@const Icon = s.Icon}
				<li class="sess__item">
					<div class="sess__marker" aria-hidden="true">
						<span class="sess__idx num">0{i + 1}</span>
						<span class="sess__line"></span>
					</div>

					<div class="sess__ico" aria-hidden="true"><Icon size={26} weight="light" /></div>

					<div class="sess__body">
						<div class="sess__row">
							<h3 class="sess__name">{s.name}</h3>
							<span class="sess__len num">{s.len}</span>
						</div>
						<div class="sess__tags">
							<span class="sess__tag">{s.slot}</span>
							<span class="sess__tag sess__tag--state">{s.state}</span>
						</div>
						<p class="sess__text">{s.body}</p>
					</div>
				</li>
			{/each}

			<li class="sess__item sess__item--bonus">
				<div class="sess__marker" aria-hidden="true">
					<span class="sess__idx num">+</span>
					<span class="sess__line"></span>
				</div>
				<div class="sess__ico" aria-hidden="true"><SparkleIcon size={26} weight="light" /></div>
				<div class="sess__body">
					<div class="sess__row">
						<h3 class="sess__name">Bonus Affirmations</h3>
						<span class="sess__len num">3 × 1 hr</span>
					</div>
					<div class="sess__tags">
						<span class="sess__tag">Included in Volume One</span>
					</div>
					<p class="sess__text">
						Three standalone one-hour affirmation disks to reinforce the work between sessions and
						on the days the market keeps you away from the desk.
					</p>
				</div>
			</li>
		</ol>
	</div>
</section>

<style>
	.sess {
		position: relative;
		background: var(--tt-ink);
		border-top: 1px solid var(--tt-line);
		border-bottom: 1px solid var(--tt-line);
		overflow: clip;
	}
	.sess__glow {
		position: absolute;
		top: 12%;
		left: -10%;
		width: 44vw;
		height: 44vw;
		max-width: 600px;
		max-height: 600px;
		z-index: 0;
		pointer-events: none;
		background: radial-gradient(circle, rgb(var(--tt-red-rgb) / 0.16), transparent 64%);
		filter: blur(26px);
	}
	.sess .tt-container {
		position: relative;
		z-index: 1;
	}
	.sess__head {
		max-width: 780px;
		margin-bottom: clamp(2.5rem, 5vw, 4rem);
	}
	.sess__title {
		font-size: var(--fs-h2);
		max-width: 18ch;
	}
	.sess__intro {
		margin-top: 1.3rem;
	}

	.sess__list {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.sess__item {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: clamp(1rem, 3vw, 2rem);
		padding: clamp(1.6rem, 3vw, 2.2rem) 0;
		border-top: 1px solid var(--tt-line);
	}
	.sess__item:last-child {
		border-bottom: 1px solid var(--tt-line);
	}

	.sess__marker {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.7rem;
	}
	.sess__idx {
		font-size: 1rem;
		font-weight: 700;
		color: var(--tt-red-bright);
		line-height: 1;
	}
	.sess__line {
		flex: 1;
		width: 1px;
		background: linear-gradient(180deg, var(--tt-line-strong), transparent);
	}
	.sess__item:last-child .sess__line {
		display: none;
	}

	.sess__ico {
		display: none;
		place-items: center;
		width: 52px;
		height: 52px;
		border-radius: 12px;
		color: var(--tt-fog);
		border: 1px solid var(--tt-line);
		background: rgba(255, 255, 255, 0.02);
	}
	.sess__item--bonus .sess__ico {
		color: var(--tt-gold);
		border-color: rgba(245, 196, 81, 0.35);
	}

	.sess__row {
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		gap: 0.7rem 1rem;
	}
	.sess__name {
		font-size: var(--fs-h4);
		font-weight: 700;
		color: var(--tt-white);
	}
	.sess__len {
		font-size: 0.82rem;
		letter-spacing: 0.04em;
		color: var(--tt-mute);
	}
	.sess__tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 0.7rem;
	}
	.sess__tag {
		font-family: var(--tt-font-mono);
		font-size: 0.64rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--tt-mute);
		padding: 0.28rem 0.6rem;
		border: 1px solid var(--tt-line);
		border-radius: 999px;
	}
	.sess__tag--state {
		color: var(--tt-red-bright);
		border-color: rgb(var(--tt-red-rgb) / 0.4);
	}
	.sess__text {
		margin-top: 0.9rem;
		max-width: 58ch;
		color: var(--tt-fog);
		font-size: 0.98rem;
	}

	@media (min-width: 480px) {
		.sess__item {
			grid-template-columns: auto auto 1fr;
		}
		.sess__ico {
			display: grid;
		}
	}
	@media (min-width: 768px) {
		/* Ledger rhythm: title on the left, duration pinned to the right edge of the
		   row so the sessions read like a run sheet instead of clustering left. */
		.sess__row {
			justify-content: space-between;
		}
		.sess__len {
			font-size: 0.9rem;
			color: var(--tt-fog);
		}
	}
</style>
