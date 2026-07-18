/**
 * Day Trading Academy — course catalogue.
 * Shared by the section components and the +page.svelte JSON-LD.
 *
 * Names, prices, lesson counts and course pages are the real Trick Trades
 * catalogue transcribed from tricktrades.com. Nothing here is fabricated;
 * courses without a public flat price (Momentum, Gold Edition) intentionally
 * carry no invented figure. `href` points at each dedicated on-site course
 * route; the three Crystal Ball products live on one course page and are
 * disambiguated for structured data via `anchor`.
 */
import LightningIcon from 'phosphor-svelte/lib/LightningIcon';
import CompassIcon from 'phosphor-svelte/lib/CompassIcon';
import EyeIcon from 'phosphor-svelte/lib/EyeIcon';
import ScalesIcon from 'phosphor-svelte/lib/ScalesIcon';
import StackIcon from 'phosphor-svelte/lib/StackIcon';
import CrownIcon from 'phosphor-svelte/lib/CrownIcon';

export type Course = {
	name: string;
	tag: string;
	tagline: string;
	lessons: string;
	price: number | null;
	was: number | null;
	note: string | null;
	href: string;
	/** Fragment on the shared course page so each product's structured-data URL is unique. */
	anchor?: string;
	Icon: typeof LightningIcon;
};

export const courses: Course[] = [
	{
		name: 'Momentum',
		tag: 'Flagship coaching',
		tagline: 'High-level day-trading coaching with Pat Mitchell.',
		lessons: '15 modules · 115 lessons · +14 bonus',
		price: null,
		was: null,
		note: 'Includes B.O.S.S. Carbon — a $597 value',
		href: '/momentum-course',
		Icon: LightningIcon
	},
	{
		name: 'Day Trading Boot Camp',
		tag: 'Start here',
		tagline: 'The foundation — mechanics, strategy and mindset.',
		lessons: '50+ lessons · lifetime access',
		price: 97,
		was: 147,
		note: null,
		href: '/day-trading-bootcamp',
		Icon: CompassIcon
	},
	{
		name: 'Crystal Ball: Volume 1',
		tag: 'Price action',
		tagline: 'Dissect price action and see moves before they happen.',
		lessons: '8 modules · 2 quizzes',
		price: 399,
		was: null,
		note: null,
		href: '/crystal-ball-course',
		anchor: 'volume-1',
		Icon: EyeIcon
	},
	{
		name: 'Crystal Ball: Volume 2',
		tag: 'Advanced',
		tagline: 'Patience, sizing, and support & resistance mastery.',
		lessons: '8 modules · 2 quizzes',
		price: 399,
		was: null,
		note: null,
		href: '/crystal-ball-course',
		anchor: 'volume-2',
		Icon: ScalesIcon
	},
	{
		name: 'Crystal Ball: Bundle + Bonus',
		tag: 'Best value',
		tagline: 'Both volumes, plus a live-trading bonus hour.',
		lessons: 'Vol 1 + Vol 2 · +1 live hour',
		price: 649,
		was: null,
		note: null,
		href: '/crystal-ball-course',
		anchor: 'bundle',
		Icon: StackIcon
	},
	{
		name: 'Crystal Ball: Gold Edition',
		tag: 'Gold edition',
		tagline: 'Natural-movement theory, taught live.',
		lessons: '9 months of live trades',
		price: null,
		was: null,
		note: null,
		href: '/crystal-ball-gold-edition-course',
		Icon: CrownIcon
	}
];
