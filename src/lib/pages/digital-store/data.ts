// Every buy button routes to the real store checkout.
export const STORE_URL = 'https://tricktrades.com/digital-store';

export type Format = 'Download' | 'Stream';
export type Product = {
	name: string;
	price: number;
	format: Format;
	group?: string; // sub-grouping for the DVD catalog
	series?: string; // links a box set to its single-volume series
	premium?: boolean;
};
export type Category = { id: string; idx: string; label: string; products: Product[] };

// --- B.O.S.S. Series: three flagship systems + the bundle ---
export const bossSingles: Product[] = [
	{ name: 'B.O.S.S. Carbon', price: 597, format: 'Download' },
	{ name: 'B.O.S.S. SPY Sniper', price: 597, format: 'Download' },
	{ name: 'B.O.S.S. Swing', price: 597, format: 'Download' }
];
export const bossPack: Product = {
	name: 'BossPack',
	price: 997,
	format: 'Download',
	premium: true
};

export const boss: Category = {
	id: 'boss',
	idx: '01',
	label: 'B.O.S.S. Series',
	products: [...bossSingles, bossPack]
};

// --- Single DVDs: the two War Room series + two standalones ---
export const dvds: Category = {
	id: 'dvds',
	idx: '02',
	label: 'Single DVDs',
	products: [
		{ name: 'War Room Technicals Vol. 1', price: 447, format: 'Download', group: 'Technicals' },
		{ name: 'War Room Technicals Vol. 2', price: 447, format: 'Download', group: 'Technicals' },
		{ name: 'War Room Technicals Vol. 3', price: 447, format: 'Download', group: 'Technicals' },
		{ name: 'War Room Technicals Vol. 4', price: 447, format: 'Download', group: 'Technicals' },
		{ name: 'War Room Psychology Vol. 1', price: 447, format: 'Download', group: 'Psychology' },
		{ name: 'War Room Psychology Vol. 2', price: 447, format: 'Download', group: 'Psychology' },
		{ name: 'War Room Psychology Vol. 3', price: 447, format: 'Download', group: 'Psychology' },
		{ name: 'War Room Psychology Vol. 4', price: 447, format: 'Download', group: 'Psychology' },
		{ name: 'Monster IPO', price: 397, format: 'Download', group: 'Standalone' },
		{ name: 'Line In The Sand', price: 297, format: 'Download', group: 'Standalone' }
	]
};

// --- Streamed Box Sets: each collects a full four-volume series ---
export const boxSets: Category = {
	id: 'box-sets',
	idx: '03',
	label: 'Streamed Box Sets',
	products: [
		{ name: 'War Room Technicals Box Set', price: 1497, format: 'Stream', series: 'Technicals' },
		{ name: 'War Room Psychology Box Set', price: 1497, format: 'Stream', series: 'Psychology' }
	]
};

export const categories: Category[] = [boss, dvds, boxSets];

/** Category-count denominator for the "0N / 0M" kickers — derived, never hardcoded. */
export const CATEGORY_COUNT = categories.length;
export const CATEGORY_COUNT_LABEL = String(CATEGORY_COUNT).padStart(2, '0');

export const dvdGroups = [
	{ key: 'Technicals', label: 'War Room · Technicals' },
	{ key: 'Psychology', label: 'War Room · Psychology' },
	{ key: 'Standalone', label: 'Standalone masterclasses' }
];

// Honest bundle economics, computed from the real prices above.
export const bossSinglesTotal = bossSingles.reduce((sum, p) => sum + p.price, 0); // 1,791
export const bossSaving = bossSinglesTotal - bossPack.price; // 794

export function seriesTotal(series: string): number {
	return dvds.products.filter((p) => p.group === series).reduce((sum, p) => sum + p.price, 0);
}

// Hero catalog index + page-wide totals.
export const catalog = categories.map((c) => ({
	idx: c.idx,
	label: c.label,
	count: c.products.length,
	from: Math.min(...c.products.map((p) => p.price))
}));
export const totalTitles = categories.reduce((sum, c) => sum + c.products.length, 0); // 16

// Money formatting: big integer + tabular cents, thousands separated.
export const intPart = (n: number) => Math.trunc(n).toLocaleString('en-US');
export const decPart = (n: number) => (n - Math.trunc(n)).toFixed(2).slice(1); // ".00"
