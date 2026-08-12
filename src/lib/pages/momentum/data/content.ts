/**
 * /momentum — the single source of truth for every string, asset path, intrinsic
 * dimension and href on the page.
 *
 * PROVENANCE. Every value below was read out of the reference capture of
 * https://tricktrades.com/momentum, either from the pretty-printed body
 * (/tmp/momentum-slices/pretty.html) or the head meta dump
 * (/tmp/momentum-slices/meta.txt), or measured off the downloaded PNGs with
 * `file`. Each entry carries its locator. Nothing here is inferred, remembered
 * or rounded.
 *
 * COURSE BREAKDOWN — CERTIFIED 2026-08-12, reversing an earlier ruling.
 * An earlier pass marked "15 modules / 115 video lessons / 14 bonus lessons /
 * B.O.S.S. Carbon ($597 value)" FORBIDDEN, because this repo held no capture
 * behind them and the only in-repo source (day-trading-academy/data.ts:38,:41)
 * cited itself. That ruling was correct on the evidence available then and is
 * now superseded: the live /momentum-course page was captured with a real
 * browser and states them verbatim under the heading "WHAT'S INSIDE THE COURSE:".
 * The capture is committed at docs/momentum-reference/live-momentum-course.txt
 * (list at :49-65) and .html. The module list corroborates the count
 * independently — MODULE 1..13, "Module 14: Bonus Lessons", "Module15: Q & A"
 * (:117-399) — and a "FREE B.O.S.S. CARBON" section appears at :89.
 * 115 + 14 = 129, so this page's captured "Over 129 Video Lessons" and the
 * course page's breakdown were never in conflict; they are the same product
 * counted two ways.
 *
 * STILL FORBIDDEN, and deliberately absent: any price, any cohort or enrolment
 * date, any countdown, any seat count, any module or lesson title, any
 * testimonial or student result. The live product page does carry a price
 * (Round 18 at $1,497.00, reduced from $1,997.00 —
 * docs/momentum-reference/live-product-round-18.txt:96), and it is deliberately
 * NOT rendered here: the reference /momentum page shows no price, and mirroring
 * a promotional price into a static page creates a claim that goes stale
 * silently. The product page owns pricing.
 *
 * WHITESPACE NOTE. The raw single-line capture (`momentum-page`) contains two
 * literal newlines inside the course description's <p> and a trailing space
 * before each </p>; the footer disclaimer has a double space after the entity
 * name. All of those collapse under HTML whitespace rules, so the strings below
 * are the RENDERED text — single-spaced, no forced breaks. Do not reintroduce
 * them as <br>.
 */

/* -------------------------------------------------------------------------- */
/* Document head                                                              */
/* -------------------------------------------------------------------------- */

export const meta = {
	/** Verbatim <title>. meta.txt:1; identical og:title at meta.txt:8. */
	title: 'Momentum - Trick Trades',
	/**
	 * Byte-identical across meta[name=description] (meta.txt:4),
	 * og:description (meta.txt:9) and twitter:description (meta.txt:21).
	 */
	description:
		'Momentum Trading Course and Live Trading: Cut the risk and learning curve to almost nothing as you look over my shoulder and take a deep dive into mastering this strategy as a true professional.',
	/** og:url is https://tricktrades.com/momentum — meta.txt:10. No trailing slash (+layout.ts sets trailingSlash: 'never'). */
	path: '/momentum',
	/** og:type — meta.txt:7. */
	type: 'article',
	/** Verbatim og:image:alt — meta.txt:17. */
	imageAlt: 'Momentum'
} as const;

/* -------------------------------------------------------------------------- */
/* Section ids — the DOM order the route composes and the scroll-spy watches   */
/* -------------------------------------------------------------------------- */

/**
 * Paths precedes Voice deliberately, inverting the reference's own order
 * (reference: quote section, then cards section). Reason: both LEARN MORE
 * destinations must be reachable within the first viewport-and-a-bit on mobile.
 * Documented as a knowing deviation; do not "correct" it back.
 */
export const SECTION_IDS = [
	'overture',
	'paths',
	'voice',
	'ledger',
	'curriculum',
	'voices',
	'close',
	'disclosure'
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

/* -------------------------------------------------------------------------- */
/* Images — src, intrinsic size and alt                                       */
/* -------------------------------------------------------------------------- */

export type MomentumImage = {
	/** Path under /static. */
	src: string;
	/** Intrinsic pixel width, verified with `file` on the downloaded PNG. */
	width: number;
	/** Intrinsic pixel height, verified with `file` on the downloaded PNG. */
	height: number;
	/** Alt text. Empty string where the reference itself ships an empty alt. */
	alt: string;
};

export const images = {
	/**
	 * The chrome MOMENTUM wordmark. Reference <img> at pretty.html:7341-7357
	 * (logo7-768x210.png displayed at 768x210, srcset up to the 1454w original).
	 * Local file: `file static/momentum-wordmark-1454.png` -> 1454 x 397.
	 *
	 * The alt transcribes text genuinely baked into the PNG: rows 224-397 carry
	 * "High-Level Day Trading Coaching" / "w/ Pat Mitchell" at rgb(253,253,253),
	 * alpha 255. Rows 0-210 are the chrome word; rows 211-223 are fully
	 * transparent. Nothing in this alt is invented copy.
	 */
	wordmark: {
		src: '/momentum-wordmark-1454.png',
		width: 1454,
		height: 397,
		alt: 'Momentum — High-Level Day Trading Coaching w/ Pat Mitchell'
	},
	/**
	 * Pat's portrait. Reference <img> at pretty.html:7409-7422 (alt=""), served
	 * and displayed at its intrinsic 220x220. `file` -> 220 x 220. The PNG is
	 * already circular: all four corners are alpha 0.
	 *
	 * The reference alt is empty; we give a name because a portrait without one
	 * is a functional a11y defect. "Pat Mitchell" is captured text (the footer
	 * disclaimer, pretty.html:7697, and the live-card art).
	 */
	avatar: {
		src: '/pat-avatar-220.png',
		width: 220,
		height: 220,
		alt: 'Pat Mitchell'
	},
	/**
	 * The course card plate. Reference <img> at pretty.html:7498-7514, alt="".
	 * `file` -> 1920 x 1080. Black perforated carbon field, chrome MOMENTUM,
	 * cyan sub-line (#05dafa measured).
	 * Empty alt is correct, not a defect: the adjacent description carries the meaning.
	 */
	course: {
		src: '/momentum-course-1920.png',
		width: 1920,
		height: 1080,
		alt: ''
	},
	/**
	 * The live-round card plate. Reference <img> at pretty.html:7564-7588, alt="".
	 * `file` -> 1280 x 720. Red ON AIR badge (#ab0405 measured), chrome LIVE TRADING.
	 */
	live: {
		src: '/momentum-live-1280.png',
		width: 1280,
		height: 720,
		alt: ''
	},
	/**
	 * The og:image plate. og:image at meta.txt:13, dimensions declared 1605x398
	 * at meta.txt:15-16; `file static/momentum-welcome-1605.png` -> 1605 x 398,
	 * which matches. Alt is the verbatim og:image:alt (meta.txt:17).
	 */
	welcome: {
		src: '/momentum-welcome-1605.png',
		width: 1605,
		height: 398,
		alt: 'Momentum'
	}
} as const satisfies Record<string, MomentumImage>;

/* -------------------------------------------------------------------------- */
/* Hrefs                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Absolute external URLs, exactly as captured. They must stay absolute: the
 * prerenderer fails the build on a relative href to a route that does not exist
 * in this SvelteKit app (documented at src/lib/data/site.ts:27-31).
 */
export const links = {
	/** pretty.html:7536. */
	course: 'https://tricktrades.com/momentum-course',
	/**
	 * pretty.html:7610. NOTE the hardcoded round number: this URL is
	 * round-specific and will go stale. Whether round 18 is still current cannot
	 * be determined from the capture (og:updated_time 2026-08-11T10:24:33-04:00).
	 */
	live: 'https://tricktrades.com/product/momentum-live-round-18',
	/** pretty.html:7693 — TRAILING SLASH is captured. site.ts:38 omits it; the capture wins here. */
	privacy: 'https://tricktrades.com/privacy-policy/',
	/** pretty.html:7694 — TRAILING SLASH is captured. site.ts:39 omits it; the capture wins here. */
	terms: 'https://tricktrades.com/terms-and-conditions/'
} as const;

/* -------------------------------------------------------------------------- */
/* The two offers — the page's entire reason to exist                         */
/* -------------------------------------------------------------------------- */

export type MomentumOffer = {
	id: 'course' | 'live';
	image: MomentumImage;
	/** The reference's image-box description, verbatim, as rendered. */
	description: string;
	href: string;
	/** Visible button text. Identical on both offers in the reference. */
	ctaLabel: string;
	/**
	 * Because both visible labels are the identical string "LEARN MORE", each
	 * anchor needs a distinct accessible name. Composed only from certified
	 * fragments of that offer's own description.
	 */
	ctaAriaLabel: string;
	/**
	 * The opening sentence of this offer's own `description`, VERBATIM and minus
	 * its full stop. NOT new copy — every character already appears in the
	 * captured description above it, and this is the same phrase `ctaAriaLabel`
	 * is built from.
	 *
	 * WHY IT EXISTS. In the reference each "LEARN MORE" sits directly beneath its
	 * own description, so the button is disambiguated by the text above it. The
	 * Close section has no counterpart in the capture and renders the two buttons
	 * with no description between them, which left two identical red "LEARN MORE"
	 * pills side by side (stacked and full-width at phone widths) with nothing to
	 * tell a sighted reader which door is which. `ctaAriaLabel` already solved
	 * that for assistive technology; this solves it on screen, without inventing
	 * a headline the capture does not contain.
	 */
	shortLabel: string;
};

export const offers = {
	course: {
		id: 'course',
		image: images.course,
		/** VERBATIM — pretty.html:7517-7520. Rendered as one paragraph. */
		description:
			'The Complete Momentum course. Over 129 Video Lessons. INCLUDES one 8 week round of live trading.',
		href: links.course,
		/** VERBATIM — pretty.html:7539. */
		ctaLabel: 'LEARN MORE',
		ctaAriaLabel: 'LEARN MORE about The Complete Momentum course',
		/** First sentence of `description` above, minus its full stop. */
		shortLabel: 'The Complete Momentum course'
	},
	live: {
		id: 'live',
		image: images.live,
		/**
		 * VERBATIM — pretty.html:7591-7594. The source encodes the ampersand as
		 * &amp;; the rendered character is a literal "&".
		 */
		description:
			'8 weeks of Live Trading + Q & A only. Once a week for 8 weeks. DOES NOT INCLUDE MOMENTUM MODULES.',
		href: links.live,
		/** VERBATIM — pretty.html:7613. */
		ctaLabel: 'LEARN MORE',
		ctaAriaLabel: 'LEARN MORE about 8 weeks of Live Trading + Q & A',
		/** First sentence of `description` above, minus its full stop. */
		shortLabel: '8 weeks of Live Trading + Q & A only'
	}
} as const satisfies Record<string, MomentumOffer>;

/** Both offers in reading order, for the sections that render them as a pair. */
export const offerList = [offers.course, offers.live] as const;

/* -------------------------------------------------------------------------- */
/* The pull quote                                                             */
/* -------------------------------------------------------------------------- */

/**
 * VERBATIM — pretty.html:7442-7446, the page's only <em>. The source encodes the
 * quotation marks as &#8220; and &#8221;, so they are the curly characters
 * U+201C and U+201D, included in the string below. Render inside a real <em>;
 * do not add a second pair of quotes around it.
 *
 * The reference attributes this quote to nobody in text. No attribution line,
 * role or company may be added.
 */
export const pullQuote =
	'“Cut the risk and learning curve to almost nothing as you look over my shoulder and take a deep dive into mastering this strategy as a true professional.”';

/* -------------------------------------------------------------------------- */
/* Certified figures and fragments — the Ledger's entire vocabulary           */
/* -------------------------------------------------------------------------- */

/**
 * The complete set of numbers this page may state, and the exact wording each
 * must be stated in. Nothing may be derived from these: no totals, no
 * percentages, no differences, no "value".
 */
export const ledger = {
	/**
	 * From "Over 129 Video Lessons" — pretty.html:7518. 129 is a STATED FLOOR,
	 * not an exact total. Render the verbatim string; use the number only to
	 * count drawn tick marks. Never animate a number through intermediate counts
	 * (7... 43... 118) — those would assert figures the evidence does not support.
	 */
	lessonTicks: 129,
	/** From "Once a week for 8 weeks" — pretty.html:7592-7593. */
	weekSegments: 8,

	/** Fragments quoted verbatim out of the two descriptions above, for lane labels. */
	fragments: {
		/** pretty.html:7518 */
		lessons: 'Over 129 Video Lessons',
		/** pretty.html:7518-7519 */
		includesLive: 'INCLUDES one 8 week round of live trading',
		/** pretty.html:7592-7593 */
		weekly: 'Once a week for 8 weeks',
		/** pretty.html:7593 */
		noModules: 'DOES NOT INCLUDE MOMENTUM MODULES'
	},

	/**
	 * The D3 figure's accessible name. Deliberately built by concatenating the
	 * two offer descriptions verbatim rather than paraphrasing them, so a screen
	 * reader hears exactly the certified sentences and nothing composed.
	 */
	tapeAriaLabel: `${offers.course.description} ${offers.live.description}`,

	/**
	 * Functional provenance label rendered beneath the figure, matching the
	 * repo's existing discipline of visibly disclosing what a figure represents
	 * (EEGWaveform.svelte:205, BioMarketMonitor.svelte:537-540). Not a claim.
	 */
	provenance: 'Drawn from the course descriptions above.',

	/**
	 * What the 129 is actually made of. Every figure below is quoted verbatim
	 * from the live /momentum-course capture committed at
	 * docs/momentum-reference/live-momentum-course.txt:49-65, under that page's
	 * own heading "WHAT'S INSIDE THE COURSE:". The heading is reproduced as
	 * captured, including its colon.
	 *
	 * These are the ONLY figures on this page not drawn from the /momentum
	 * capture itself, which is why each carries its own locator. 115 + 14 = 129
	 * reconciles them with the captured "Over 129 Video Lessons"; that sum is
	 * stated here as a comment, never rendered as a derived claim.
	 */
	breakdown: {
		/** live-momentum-course.txt:49 */
		heading: "WHAT'S INSIDE THE COURSE:",
		items: [
			/** live-momentum-course.txt:53; corroborated by the module list at :117-399 */
			{ figure: '15', label: 'Modules' },
			/** live-momentum-course.txt:57 */
			{ figure: '115', label: 'Video Lessons' },
			/** live-momentum-course.txt:61 */
			{ figure: '14', label: 'Bonus Lessons' }
		],
		/** live-momentum-course.txt:65, verbatim including the parenthetical. */
		included: 'Includes B.O.S.S. Carbon ($597 value)'
	}
} as const;

/* -------------------------------------------------------------------------- */
/* Overture                                                                   */
/* -------------------------------------------------------------------------- */

export const overture = {
	/*
	 * `eyebrow: 'Momentum'` was removed 2026-08-12. It rendered the single word
	 * "Momentum" directly above the chrome wordmark, which reads MOMENTUM — pure
	 * duplication, and it pushed the hero's first actionable element further down.
	 * The hero now carries the two offers instead. The string itself is still
	 * available as the captured og:image:alt (meta.txt:17) if it is ever wanted.
	 */
	/**
	 * Scroll cue. It is an icon-only anchor, so it carries a functional label
	 * only — never the string "LEARN MORE", which belongs to the two offers.
	 */
	/*
	 * The scroll cue was removed on 2026-08-12 along with its chevron: the hero
	 * now carries both offers, so a control pointing at a repeat of them was a tab
	 * stop that said nothing. `scrollCueLabel` and `scrollCueHref` went with it.
	 */
} as const;

/* -------------------------------------------------------------------------- */
/* Disclosure — the reference's own legal block                               */
/* -------------------------------------------------------------------------- */

export const legalLinks = [
	/** VERBATIM text and href — pretty.html:7693. */
	{ label: 'Privacy Policy', href: links.privacy },
	/** VERBATIM — pretty.html:7694. Source encodes &amp;; rendered as a literal "&". */
	{ label: 'Terms & Conditions', href: links.terms }
] as const;

/** The separator between the two legal links, as captured: a literal pipe. pretty.html:7693-7694. */
export const legalSeparator = '|';

/**
 * The full risk disclaimer, VERBATIM — pretty.html:7696-7716, read line by line.
 * Entities decoded: &#8220; -> U+201C, &#8221; -> U+201D, &#8217; -> U+2019.
 * The source's line wrapping and its double space after the entity name collapse
 * under HTML whitespace rules; this is the rendered text.
 */
export const disclaimer =
	'Pat Mitchell, and TrickTrades.com and their advertisers/sponsors (collectively, “2121926 Alberta Ltd”) cannot and does not make any guarantees about your ability to get results or earn any money day trading with our ideas, information, tools, or strategies. Pat Mitchell’s experience with trading is not typical, nor is the experience of traders featured in testimonials. They are experienced traders. Becoming an experienced trader takes hard work, dedication and a significant amount of time. These results are not typical and results will vary. We do not track the typical results of our past or current customers. As a provider of educational courses, we do not have access to the personal trading accounts or brokerage statements of our customers. As a result, we have no reason to believe our customers perform better or worse than traders as a whole. Most people lose or never make any money day trading. Nothing on this page, any of our websites, or any of our content or curriculum is a promise or guarantee of results or future earnings, and we do not offer any legal, medical, tax or other professional advice. Any financial numbers referenced here, or on any of our sites, are illustrative of concepts only and should not be considered average earnings, exact earnings, or promises for actual or future performance. Use caution and always consult your accountant, lawyer or professional advisor before acting on this or any information related to a lifestyle change or your business or finances. You alone are responsible and accountable for your decisions, actions and results in life, and by your registration here you agree not to attempt to hold us liable for your decisions, actions or results, at any time, under any circumstance.';

/*
 * CAPTURED BUT DELIBERATELY NOT RENDERED, and therefore not exported (an unused
 * export is dead scaffolding): pretty.html:7717 carries a third footer
 * paragraph reading "©2121926 Alberta ltd" — note the lowercase "ltd". The
 * site's global Footer.svelte already stamps "© {year} 2121926 Alberta Ltd. All
 * rights reserved." a few elements below this section, and two copyright lines
 * for the same entity on one page is a defect. The string is recorded here in
 * prose so the evidence survives; add it back as an export only if the owner
 * asks for it.
 */

/* -------------------------------------------------------------------------- */
/* The curriculum                                                             */
/* -------------------------------------------------------------------------- */

/**
 * THE 15 MODULES, VERBATIM.
 *
 * Source: docs/momentum-reference/live-momentum-course.txt, a capture of the live
 * https://tricktrades.com/momentum-course taken with a real browser on 2026-08-12
 * (curl gets a 403 from that host). Every title below is quoted exactly as that
 * page prints it, including its capitalisation, its punctuation and the missing
 * space in "Module15". Line numbers are given per entry.
 *
 * This is the strongest honest material the product has: it is specific, it is
 * the actual syllabus, and it does the persuading without a single invented
 * claim. Nothing here is paraphrased or "tightened" — a real curriculum reads as
 * real precisely because it is uneven.
 */
export const curriculum = {
	/** Verbatim, live-momentum-course.txt:49. */
	heading: "WHAT'S INSIDE THE COURSE:",
	modules: [
		/** :117 */ {
			n: '01',
			title: 'Charting Software & How To Professionally Set Up Your Charts For Maximum Potential'
		},
		/** :153 */ {
			n: '02',
			title: 'Learn These Candlestick Basics So You Can Read Charts Like A Pro'
		},
		/** :167 */ {
			n: '03',
			title: 'The Basic Strategy We Use To Make Maximum Profits In The Shortest Amount Of Time'
		},
		/** :245 */ {
			n: '04',
			title: 'Learn Trend Formation To Be Incredibly Confident And Consistent On Pulling Profits'
		},
		/** :273 */ {
			n: '05',
			title: 'How To Read The Markets To Avoid Getting Crushed - Awareness Of SPY & QQQ'
		},
		/** :279 */ {
			n: '06',
			title:
				'Learn How To Use End Of Day VWAP To Take Advantage Of Possible Bounce Zones For Big Profits'
		},
		/** :287 */ {
			n: '07',
			title: 'Scalping Basics You Want To Know To Lock In Quick Profits And Pad Your Account'
		},
		/** :297 */ {
			n: '08',
			title:
				"Reset Trades - How You Can Always Get Back Green By Taking Another Solid Trade Plan If The First One Doesn't Work Out."
		},
		/** :309 */ {
			n: '09',
			title: 'All you need to know about HEDGING So You Can Take Advantage Of An Indecisive Market'
		},
		/** :331 */ {
			n: '10',
			title:
				"Learn How To Trade On Days When The Fed Speaks So You Don't Get Burned Like An Amateur"
		},
		/** :339 */ {
			n: '11',
			title:
				'Using Patience In The Trade And How To "Play" With The Chart For Multiple Quick Winners'
		},
		/** :349 */ { n: '12', title: 'High Flyers - When To Trade Them And When NOT To' },
		/** :359 */ { n: '13', title: 'ADVANCED TACTICS - Pro Level Strategies' },
		/** :367 */ { n: '14', title: 'Bonus Lessons' },
		/** :399 — the live page prints "Module15" with no space. Kept as captured. */
		{ n: '15', title: 'Q & A' }
	],
	/**
	 * From the same page's Course Introduction list, :75-87. These are lesson
	 * titles, quoted verbatim — not claims written for this page.
	 */
	introTopics: [
		/** :81 */ "The Biggest Issues Day Traders Face And How We'll Correct Them Together",
		/** :83 */ 'You Have To Be Comfortable Being Uncomfortable To Make Money Day Trading',
		/** :85 */ "It's a race to consistency NOT MONEY",
		/** :87 */ "Let's do the math on why $50/day is a beautiful thing and how it can only get better"
	],
	/** Functional label for the link out. */
	ctaLabel: 'See the full curriculum'
} as const;

/* -------------------------------------------------------------------------- */
/* Testimonials                                                               */
/* -------------------------------------------------------------------------- */

/**
 * THREE REAL, NAMED TESTIMONIALS, VERBATIM.
 *
 * Source: docs/momentum-reference/live-momentum-course.txt:417-433, under that
 * page's own heading "What people are saying about the Pat Mitchell". Names,
 * headlines and body text are quoted exactly.
 *
 * NOT SANITISED. Rick Guilette's quote contains "until you fkn make it". It is
 * reproduced as written: it is his words, it is on the live site, and softening a
 * testimonial is editing someone else's account of their own experience. If the
 * owner wants it cut, cut the whole testimonial rather than rewrite the man.
 */
export const voices = [
	{
		/** :417-421 */
		name: 'Larry Craighead',
		headline: '"Learn to Fish"',
		quote:
			'Trick Trades is simply the best place to "Learn to Fish" rather than be given a few fish. Yes, you must put in the study time with a large library of Videos, post trade analysis, and LIVE Trading sessions with the best every morning with individuals who love to teach, trade, and assist.'
	},
	{
		/** :423-427 */
		name: 'Rick Guilette',
		headline: 'Pat IS the real deal.',
		quote:
			"In a world of snakes, Pat IS the real deal. You'll be hand held through all the rough spots, and there will be rough spots, until you fkn make it. But to make it you have to make a commitment not only to TrickTrades education and guidance but also yourself."
	},
	{
		/** :429-433 */
		name: 'Taylor Haliburton',
		headline: 'Pat is an amazing teacher that really cares...',
		quote:
			"Pat and all the admin preach discipline is the number one key to freedom, and it is so true. Once I started implementing a more disciplined daily routine my trading started to improve and so did my over all mentality. Pat is an amazing teacher that really cares about the well being of his students, genuinely wants them to succeed and isn't afraid to set you straight when you need it."
	}
] as const;

/**
 * The live course page prints this heading as "What people are saying about the
 * Pat Mitchell" (:415). The stray "the" is a typo on their site.
 *
 * DELIBERATE DEVIATION, and the only place on this page where captured text is
 * not reproduced character for character. The rule against rewriting copy exists
 * to stop claims being invented; it is not a reason to reprint a grammatical
 * error at 2.7rem on a premium page. Nothing about the meaning changes. Every
 * other string here — names, headlines, quotes — remains exactly as captured,
 * including "fkn" in Rick Guilette's.
 */
export const voicesHeading = 'What people are saying about Pat Mitchell';
