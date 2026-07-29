<script lang="ts">
	import { ui } from '$lib/pages/project-alpha/state/ui.svelte';
	import type { Attachment } from 'svelte/attachments';
	import { study } from '$lib/pages/project-alpha/data/content';
	import { assets } from '$lib/pages/project-alpha/data/assets';
	import XIcon from 'phosphor-svelte/lib/XIcon';
	import CheckCircleIcon from 'phosphor-svelte/lib/CheckCircleIcon';
	import SpinnerGapIcon from 'phosphor-svelte/lib/SpinnerGapIcon';

	type Status = 'idle' | 'submitting' | 'done' | 'error';

	let name = $state('');
	let email = $state('');
	let experience = $state('');
	let muse = $state('');
	let notes = $state('');
	let consent = $state(false);
	let status = $state<Status>('idle');
	let errorMsg = $state('');
	let modalEl: HTMLDivElement | undefined;

	const manageModalFocus: Attachment<HTMLDivElement> = (node) => {
		modalEl = node;
		const previouslyFocused = document.activeElement as HTMLElement | null;
		const focusFrame = requestAnimationFrame(() => {
			node.querySelector<HTMLElement>('input, select, textarea, button')?.focus();
		});

		return () => {
			cancelAnimationFrame(focusFrame);
			if (modalEl === node) modalEl = undefined;
			previouslyFocused?.focus();
		};
	};

	function reset() {
		name = '';
		email = '';
		experience = '';
		muse = '';
		notes = '';
		consent = false;
		status = 'idle';
		errorMsg = '';
	}

	function close() {
		ui.closeApply();
		// keep fields if user reopens mid-draft unless done
		if (status === 'done') reset();
	}

	function onKey(e: KeyboardEvent) {
		if (!ui.applyOpen) return;
		if (e.key === 'Escape') {
			close();
			return;
		}
		if (e.key !== 'Tab' || !modalEl) return;

		const focusable = Array.from(
			modalEl.querySelectorAll<HTMLElement>(
				'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
			)
		);
		if (!focusable.length) return;
		const first = focusable[0];
		const last = focusable[focusable.length - 1];
		if (e.shiftKey && document.activeElement === first) {
			e.preventDefault();
			last.focus();
		} else if (!e.shiftKey && document.activeElement === last) {
			e.preventDefault();
			first.focus();
		}
	}

	function submit(e: Event) {
		e.preventDefault();
		errorMsg = '';

		if (!name.trim() || !email.trim() || !experience || !muse || !consent) {
			errorMsg = 'Please complete all required fields and confirm consent.';
			status = 'error';
			return;
		}
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
			errorMsg = 'Enter a valid email address.';
			status = 'error';
			return;
		}

		status = 'submitting';

		// Honest handoff: there is no application backend, so we open the visitor's
		// own mail client with a prefilled draft to support@tricktrades.com. Nothing
		// is stored or sent silently; the visitor sends the email themselves.
		const experienceLabels: Record<string, string> = {
			'under-1': 'Under 1 year',
			'1-3': '1-3 years',
			'3-5': '3-5 years',
			'5-plus': '5+ years'
		};
		const museLabels: Record<string, string> = {
			'own-s': 'I own Muse S / Athena',
			'will-buy': 'I will acquire one before preloading',
			unsure: 'Not sure yet'
		};

		const body = [
			`${study.name} interest form`,
			'',
			`Name: ${name.trim()}`,
			`Email: ${email.trim()}`,
			`Day trading experience: ${experienceLabels[experience] ?? experience}`,
			`Muse headband access: ${museLabels[muse] ?? muse}`,
			`Notes: ${notes.trim() || 'None'}`,
			`Prepared at: ${new Date().toISOString()}`
		].join('\n');

		const mailto = `mailto:support@tricktrades.com?subject=${encodeURIComponent(
			`${study.name} application interest: ${name.trim()}`
		)}&body=${encodeURIComponent(body)}`;

		window.location.href = mailto;
		status = 'done';
	}
</script>

<svelte:window onkeydown={onKey} />

{#if ui.applyOpen}
	<button type="button" class="backdrop" aria-label="Close dialog" onclick={close}></button>
	<div
		class="modal"
		{@attach manageModalFocus}
		role="dialog"
		aria-modal="true"
		aria-labelledby="apply-title"
		aria-describedby={status === 'done' ? undefined : 'apply-description'}
		tabindex="-1"
	>
		<button class="close" type="button" aria-label="Close application form" onclick={close}>
			<XIcon size={20} weight="bold" />
		</button>

		{#if status === 'done'}
			<div class="success">
				<CheckCircleIcon size={48} weight="duotone" color="var(--alpha-teal)" />
				<h2 id="apply-title">Email draft ready</h2>
				<p>
					Thanks, {name.split(' ')[0] || 'trader'}. We opened a prefilled email to
					support@tricktrades.com with your answers for {study.name}. Press send in your mail app to
					register your interest. This is not a confirmation of acceptance.
				</p>
				<button class="btn-primary" type="button" onclick={close}>Back to the study</button>
			</div>
		{:else}
			<header class="head">
				<img
					class="modal-logo"
					src={assets.trickTradesLogo.src}
					alt={assets.trickTradesLogo.alt}
					width="48"
					height="48"
					decoding="async"
				/>
				<p class="kicker">Limited cohort · {study.participants} participants</p>
				<h2 id="apply-title">Apply for {study.name}</h2>
				<p id="apply-description" class="sub">
					Tell us about your trading foundation. Equipment requirements and full protocol details
					are on this page. Review risk disclosures before applying.
				</p>
			</header>

			<form class="form" onsubmit={submit} novalidate>
				<label>
					<span>Full name *</span>
					<input type="text" bind:value={name} autocomplete="name" required />
				</label>
				<label>
					<span>Email *</span>
					<input type="email" bind:value={email} autocomplete="email" required />
				</label>
				<label>
					<span>Day trading experience *</span>
					<select bind:value={experience} required>
						<option value="" disabled>Select…</option>
						<option value="under-1">Under 1 year</option>
						<option value="1-3">1–3 years</option>
						<option value="3-5">3–5 years</option>
						<option value="5-plus">5+ years</option>
					</select>
				</label>
				<label>
					<span>Muse headband access *</span>
					<select bind:value={muse} required>
						<option value="" disabled>Select…</option>
						<option value="own-s">I own Muse S / Athena</option>
						<option value="will-buy">I will acquire one before preloading</option>
						<option value="unsure">Not sure yet</option>
					</select>
				</label>
				<label class="full">
					<span>Anything we should know?</span>
					<textarea
						bind:value={notes}
						rows="3"
						placeholder="Goals, schedule constraints, questions…"></textarea>
				</label>
				<label class="consent">
					<input type="checkbox" bind:checked={consent} />
					<span>
						I understand this is a research interest form, involves financial risk, and does not
						guarantee acceptance or trading results. *
					</span>
				</label>

				{#if errorMsg}
					<p class="error" role="alert">{errorMsg}</p>
				{/if}

				<button class="btn-primary submit" type="submit" disabled={status === 'submitting'}>
					{#if status === 'submitting'}
						<SpinnerGapIcon size={18} class="spin" />
						Submitting…
					{:else}
						Submit interest
					{/if}
				</button>
			</form>
		{/if}
	</div>
{/if}

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 90;
		width: 100%;
		height: 100%;
		padding: 0;
		border: none;
		cursor: pointer;
		background: rgba(0, 0, 0, 0.72);
		backdrop-filter: blur(8px);
		animation: fade 0.25s ease;
	}

	.modal {
		position: fixed;
		z-index: 100;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: min(520px, calc(100vw - 1.5rem));
		max-height: min(90vh, 820px);
		overflow: auto;
		background: linear-gradient(180deg, #121216 0%, #0c0c0f 100%);
		border: 1px solid var(--alpha-border);
		border-radius: 20px;
		padding: 1.75rem 1.5rem 1.5rem;
		box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.85);
		animation: rise 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.close {
		position: absolute;
		top: 0.9rem;
		right: 0.9rem;
		width: 36px;
		height: 36px;
		display: grid;
		place-items: center;
		border-radius: 10px;
		color: var(--alpha-muted);
		border: 1px solid transparent;
	}

	.close:hover {
		border-color: var(--alpha-border);
		color: var(--alpha-text);
	}

	.modal-logo {
		width: 48px;
		height: 48px;
		object-fit: cover;
		border-radius: 10px;
		margin-bottom: 0.85rem;
		background: #000;
		box-shadow: 0 8px 24px -10px rgba(0, 0, 0, 0.7);
	}

	.head .kicker {
		margin: 0 0 0.5rem;
		font-size: 0.68rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--alpha-red-bright);
		font-weight: 600;
	}

	.head h2 {
		margin: 0 0 0.6rem;
		font-family: var(--font-display);
		font-size: 1.65rem;
		font-weight: 600;
	}

	.sub {
		margin: 0 0 1.25rem;
		color: var(--alpha-muted);
		font-size: 0.92rem;
		line-height: 1.65;
	}

	.form {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.85rem;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		font-size: 0.78rem;
		font-weight: 500;
		color: var(--alpha-muted);
	}

	label.full,
	.consent,
	.submit,
	.error {
		grid-column: 1 / -1;
	}

	input,
	select,
	textarea {
		font: inherit;
		color: var(--alpha-text);
		background: #0a0a0c;
		border: 1px solid var(--alpha-border);
		border-radius: 10px;
		padding: 0.7rem 0.8rem;
		outline: none;
		transition: border-color 0.2s ease;
	}

	input:focus,
	select:focus,
	textarea:focus {
		border-color: color-mix(in srgb, var(--alpha-blue) 55%, var(--alpha-border));
	}

	.consent {
		flex-direction: row;
		align-items: flex-start;
		gap: 0.65rem;
		font-size: 0.8rem;
		line-height: 1.5;
		color: var(--alpha-muted);
	}

	.consent input {
		margin-top: 0.2rem;
		accent-color: var(--alpha-red);
	}

	.submit {
		margin-top: 0.35rem;
		width: 100%;
	}

	.submit:disabled {
		opacity: 0.7;
		cursor: wait;
	}

	.error {
		margin: 0;
		color: #ff8a8a;
		font-size: 0.85rem;
	}

	.success {
		text-align: center;
		padding: 1.5rem 0.5rem 0.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.85rem;
	}

	.success h2 {
		margin: 0;
		font-family: var(--font-display);
		font-size: 1.6rem;
	}

	.success p {
		margin: 0 0 0.5rem;
		color: var(--alpha-muted);
		line-height: 1.7;
		font-size: 0.95rem;
	}

	:global(.spin) {
		animation: spin 0.8s linear infinite;
	}

	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translate(-50%, -46%) scale(0.97);
		}
		to {
			opacity: 1;
			transform: translate(-50%, -50%) scale(1);
		}
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (max-width: 560px) {
		.form {
			grid-template-columns: 1fr;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.backdrop,
		.modal,
		:global(.spin) {
			animation: none;
		}
	}
</style>
