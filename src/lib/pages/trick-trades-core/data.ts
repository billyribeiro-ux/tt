/**
 * Trick Trades Core — page content model.
 * Shared by the section components and the +page.svelte JSON-LD.
 * Prices, session lengths and topics are the real program spec transcribed from
 * tricktrades.com/trick-trades-core; nothing here is fabricated.
 */

export const BUY_URL = 'https://tricktrades.com/trick-trades-core';

export type Package = {
	id: string;
	name: string;
	price: number;
	note: string;
	blurb: string;
	cta: string;
	featured: boolean;
	feats: string[];
};

export const packages: Package[] = [
	{
		id: 'single',
		name: 'Single Meditation',
		price: 25,
		note: 'per topic',
		blurb: 'Pick one topic — the pattern that costs you the most — and start rewiring it tonight.',
		cta: 'Buy a single meditation',
		featured: false,
		feats: [
			'Any one topic of the five',
			'All four daily sessions for that topic',
			'Meditation guide included',
			'Instant digital download'
		]
	},
	{
		id: 'volume-one',
		name: 'Complete Volume One',
		price: 97,
		note: 'save $28 vs à la carte',
		blurb:
			'Every topic, every daily session, plus the bonus affirmation disks — the whole rewire in one download.',
		cta: 'Get Volume One',
		featured: true,
		feats: [
			'All five topic meditations',
			'Focus, Market, Power & Sleep sessions',
			'Bonus affirmations — three 1-hour disks',
			'Meditation guide included',
			'Instant digital download'
		]
	}
];
