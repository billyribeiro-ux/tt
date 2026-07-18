import type { Component } from 'svelte';
import type { IconComponentProps } from 'phosphor-svelte';
import RocketLaunchIcon from 'phosphor-svelte/lib/RocketLaunchIcon';
import AirplaneTiltIcon from 'phosphor-svelte/lib/AirplaneTiltIcon';
import PhoneCallIcon from 'phosphor-svelte/lib/PhoneCallIcon';
import TableIcon from 'phosphor-svelte/lib/TableIcon';
import CalendarCheckIcon from 'phosphor-svelte/lib/CalendarCheckIcon';
import ChatsCircleIcon from 'phosphor-svelte/lib/ChatsCircleIcon';
import ChartBarIcon from 'phosphor-svelte/lib/ChartBarIcon';
import TargetIcon from 'phosphor-svelte/lib/TargetIcon';
import ScalesIcon from 'phosphor-svelte/lib/ScalesIcon';
import PiggyBankIcon from 'phosphor-svelte/lib/PiggyBankIcon';
import CompassIcon from 'phosphor-svelte/lib/CompassIcon';

type Icon = Component<IconComponentProps>;

export const BUY_URL = 'https://tricktrades.com/polaris';

/**
 * The single real price on the page: both tiers cost the same amount per month.
 * Hoisted once so the number lives in exactly one place (spec row, tier cards,
 * pricing badge, JSON-LD offers and the SEO/JSON-LD copy all read from here).
 */
export const POLARIS_PRICE = 697; // USD per month, per tier
export const POLARIS_PRICE_LABEL = `$${POLARIS_PRICE}`;

export type Tier = {
	id: string;
	name: string;
	Icon: Icon;
	forWho: string;
	focus: string;
	blurb: string;
	points: string[];
};

// Two tiers, same price — the difference is your debt situation and budget horizon.
export const tiers: Tier[] = [
	{
		id: 'launch',
		name: 'Polaris Launch',
		Icon: RocketLaunchIcon,
		forWho: 'For traders carrying debt',
		focus: 'Immediate budget management',
		blurb: 'Stop the overleveraging now. We stabilise your cash flow and build a structured path out of the hole.',
		points: [
			'Built for traders struggling with debt',
			'Cap trading risk to what you can afford',
			'A clear plan to pay debt down',
			'Weekly accountability while you rebuild'
		]
	},
	{
		id: 'flight',
		name: 'Polaris Flight',
		Icon: AirplaneTiltIcon,
		forWho: 'For traders with little to no debt',
		focus: 'Long-term budget management',
		blurb: 'Compound your gains with discipline — and build guardrails so you never repeat the same mistakes.',
		points: [
			'Built for minimal or no-debt traders',
			'Allocate profits with intention, not impulse',
			'Systems that prevent repeat mistakes',
			'Steady march toward financial independence'
		]
	}
];

export type Step = { n: string; name: string; Icon: Icon; body: string };

export const steps: Step[] = [
	{
		n: '01',
		name: 'Breakthrough Call',
		Icon: PhoneCallIcon,
		body: 'A one-on-one consultation on your finances and your goals — an honest look at where you are and where you want to be.'
	},
	{
		n: '02',
		name: 'Data Input',
		Icon: TableIcon,
		body: 'We load your numbers into Polaris’s proprietary spreadsheets, so the full picture is finally clear on one screen.'
	},
	{
		n: '03',
		name: 'Weekly Collaboration',
		Icon: CalendarCheckIcon,
		body: 'Ninety days of structured, weekly coaching — adjusting the plan as your situation and the market change.'
	}
];

export type Inclusion = { Icon: Icon; t: string; d: string };

export const includes: Inclusion[] = [
	{ Icon: ChatsCircleIcon, t: '1:1 consultation', d: 'Direct, personal coaching — not a course you watch alone.' },
	{ Icon: ChartBarIcon, t: 'Budget breakdown', d: 'A clear map of what comes in, what goes out, and what to change.' },
	{ Icon: TargetIcon, t: 'Realistic goal-setting', d: 'Targets built on your numbers, not someone else’s highlight reel.' },
	{ Icon: ScalesIcon, t: 'Risk-tolerance assessment', d: 'How much you can actually afford to put at risk — and no more.' },
	{ Icon: PiggyBankIcon, t: 'Money-saving strategies', d: 'Practical ways to keep more of what you make.' },
	{ Icon: CompassIcon, t: 'Path to financial independence', d: 'A long-term direction, not just a short-term patch.' }
];

export type SpecRow = { k: string; v: string };

export const spec: SpecRow[] = [
	{ k: 'Format', v: '1:1 coaching' },
	{ k: 'Length', v: '90 days' },
	{ k: 'Cadence', v: 'Weekly' },
	{ k: 'Investment', v: `${POLARIS_PRICE_LABEL} / mo` },
	{ k: 'Focus', v: 'Budget & risk' }
];
