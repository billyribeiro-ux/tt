/**
 * Trick Trades — content model.
 * Copy is transcribed from the live tricktrades.com homepage ("Freedom") source.
 * All numbers/prices/names are real; nothing here is fabricated.
 */

export const site = {
	name: 'Trick Trades',
	legalEntity: '2121926 Alberta Ltd',
	domain: 'https://tricktrades.com',
	tagline: 'Master the skill. Master the emotion. Get your freedom.',
	description:
		'If you are losing money trading, watch the quick video before you do anything else today. Trick Trades is a 100% educational day-trading mentorship led by Pat "Trick" Mitchell.',
	studentsTrained: 30000,
	// The real VSL — hosted on muse.ai (embed id from the live source)
	videoEmbed: 'https://muse.ai/embed/Zrq42Gq?search=0&links=0&logo=0&title=0',
	videoPoster:
		'https://trick-trades-media-storage.storage.googleapis.com/wp-content/uploads/2024/02/06134452/pat_barn.jpg',
	support: 'support@tricktrades.com',
	social: {
		facebookGroup: 'https://tricktrades.com/private-facebook-group'
	}
};

export type NavItem = { label: string; href: string; children?: NavItem[] };

export const nav: NavItem[] = [
	{ label: 'Home', href: '/' },
	{ label: 'Join', href: '/size-up-join' },
	{
		label: 'Academy',
		href: '/day-trading-academy',
		children: [
			{ label: 'All Courses', href: '/day-trading-academy' },
			{ label: 'Day Trading Boot Camp', href: '/day-trading-bootcamp' },
			{ label: 'Crystal Ball', href: '/crystal-ball-course' },
			{ label: 'Crystal Ball: Gold Edition', href: '/crystal-ball-gold-edition-course' },
			{ label: 'Momentum Course', href: '/momentum-course' }
		]
	},
	{ label: 'Project ALPHA', href: '/project-alpha' },
	{
		label: 'Digital Store',
		href: '/digital-store',
		children: [
			{ label: 'Trick Trades Core', href: '/trick-trades-core' },
			{ label: 'Instant Downloads', href: '/digital-store' },
			{ label: 'Polaris', href: '/polaris' }
		]
	},
	{
		label: 'Resources',
		href: '/contact-us',
		children: [
			{ label: 'Contact Us', href: '/contact-us' },
			{ label: 'Newsletter', href: '/the-situation-room' },
			{ label: 'Testimonials', href: '/testimonials' },
			{ label: 'Cancellation Policy', href: '/cancellation-policy' }
		]
	},
	{ label: 'Trade Recaps', href: '/category/daily-trade-recaps' }
];

export const painPoints = [
	{
		n: '01',
		title: 'Account is Shrinking',
		body: 'The hope of morning green turns red with regret. Another trade whittles away any recent success. Soon, the account can no longer be refunded. It’s only a matter of time.'
	},
	{
		n: '02',
		title: 'Time is Running Out',
		body: 'It’s the one thing in life we can’t ever get back. With each promise, the clock ticks and the people we love who depend on us start looking for answers, and results.'
	},
	{
		n: '03',
		title: 'Doubters Everywhere',
		body: 'With time and money in short supply, the dream of becoming a professional trader starts to fade. Dreaded Plan B will soon be back on the table.'
	}
];

export const questions = [
	{
		q: 'What do you really want?',
		body: 'A fire of creativity deep inside can solve any problem. But without the passion to do something extraordinary, for something greater than yourself, that fire fails to ignite. What’s beyond the money for you?'
	},
	{
		q: 'What are you tolerating?',
		body: 'Trading struggles come from habits and behaviors that don’t get desired results. To become profitable, a level of intolerance towards damaging actions must be obeyed. What will you no longer tolerate?'
	},
	{
		q: 'What will you give up?',
		body: 'With focus on the big picture and an eye on what needs to change, a process of letting go must begin. Only then can real learning and listening inspire real progress. What must you let go of?'
	}
];

export const mastery = [
	{
		icon: 'Barbell',
		title: 'Mastery of Skill',
		body: 'A highly trained body executes actions on demand with precision and results.'
	},
	{
		icon: 'Brain',
		title: 'Mastery of Emotion',
		body: 'A highly trained mind maintains focus under extreme pressure, pushing out instruction the body responds to without hesitation.'
	},
	{
		icon: 'ChartLineUp',
		title: 'Massive Results',
		body: 'Mind and body performing under stress achieves consistency over time. Setbacks are minimal. Growth is constant.'
	}
];

/** The "Massive Results Formula" — each pillar pairs a fix + what we teach. */
export const formula = [
	{
		pillar: 'Structured Learning & Testing',
		lead: 'The path to excellence is to do the right thing at the right time, all the time. We show you how.',
		fixTitle: 'Fix Hesitation',
		fix: 'When you don’t know what to do, uncertainty carries a burden that will not fix itself. Without action, opportunity is lost.'
	},
	{
		pillar: 'The Right Tools',
		lead: 'Regardless of skill, if you’re not using the right tools, in the right way, you’re done. We show you what.',
		fixTitle: 'Fix Fear',
		fix: 'When you don’t trust yourself, or have been damaged by other “gurus,” your career dies in its tracks. Without confidence, skill never develops.'
	},
	{
		pillar: 'Live Morning Training',
		lead: 'Knowing the crucial moments to enter and exit often comes down to split-second decisions. We show you when.',
		fixTitle: 'Fix Greed',
		fix: 'You’re here because you’re not listening to what the market has to say. Without self-control, the things you need are taken from you.'
	},
	{
		pillar: 'The Right Stocks',
		lead: 'Not just any stock will do. Putting your money into the wrong stocks decreases your odds. We show you where.',
		fixTitle: 'Fix FOMO',
		fix: 'Without foresight, you’ll always chase. A solid understanding of price action gives you the confidence that there’s no such thing as missing out.'
	},
	{
		pillar: 'Daily Coaching',
		lead: 'With over a decade of experience, there’s reasons behind every detail we teach. We show you why.',
		fixTitle: 'Fix Self Talk',
		fix: 'The voice in your head is the biggest “boss fight” you’ll ever face. We help you retrain the stories in your mind that hold you back.'
	}
];

export const membership = [
	{
		icon: 'GraduationCap',
		title: 'The Best Market Education on the Planet',
		body: 'In-depth trade recaps, a critical video lesson library, daily breakdowns, and live lessons every day so you can have complete confidence in yourself.'
	},
	{
		icon: 'UsersThree',
		title: 'Open Connection to Trained Members',
		body: 'Unlike other chat rooms, you have complete freedom to ask the entire community questions — and they WILL get answered. You’ll never feel intimidated or lost.'
	},
	{
		icon: 'Broadcast',
		title: 'The Morning Premarket Plan of Attack',
		body: 'Live on mic with screen share before the market opens. Pat teaches live and interacts with EVERYBODY all morning. Education continues all afternoon.'
	},
	{
		icon: 'MoonStars',
		title: 'Prepare for Success Every Night',
		body: 'A video watch list is recorded every night for the next day and accessible in the members area — high-probability, cherry-picked opportunities.'
	},
	{
		icon: 'Alarm',
		title: 'Go-Time is Live Every Trading Day',
		body: 'The watch list is covered again in the PMPOA live on screen share every morning at 9 a.m. Eastern sharp, so you have a solid plan going into the open.'
	},
	{
		icon: 'ChatsCircle',
		title: 'Live Chat is 24/7',
		body: 'Get help, ask questions, or make new friends any time. We’re an engaging community that communicates day and night — even weekends. We never shut down.'
	}
];

export const reasonsNot = [
	{
		title: 'Looking to Get Rich Quick',
		body: 'If you think you’re going to come into our room and get rich off a couple trades, that’s not going to happen. The market is not a get-rich-quick pursuit. We are dedicated to CONSISTENCY and EDUCATION. Most day traders make very little or no money day trading.'
	},
	{
		title: 'Looking for the Easy Way',
		body: '“Do you have a free trial?” “Do you send alerts?” “Can you trade my money?” All that says is “I don’t have the drive to work hard.” The market can give you more time and freedom — but it takes the ability to listen and follow directions through every peak and valley.'
	},
	{
		title: 'Not Willing To Put in the Time',
		body: 'Many assume they can absorb everything in a few weeks, say “I got this,” and leave. They return with their tail between their legs. This is an ongoing process. The Trick Trades methodology is based on simplicity — caveman simple — but you have to commit.'
	}
];

export const notList = [
	'We do not trade your money',
	'We are not an alert service',
	'We do not make or give financial advice',
	'We are not a Discord room'
];

export const testimonials = [
	{
		name: 'Brian Tarr',
		role: 'Truck Driver',
		quote:
			'Having a trading clinic with Kelvo was awesome! To have an educator go over your trades one-on-one is an amazing benefit that Trick Trades offers with our membership. He went over the fine details of what I’ve been doing, what mistakes were made, and how my overall progress has been. I highly recommend.'
	},
	{
		name: 'Eric Dudenhofer',
		role: 'Nurse Practitioner, ER',
		quote:
			'Signing up for Trick Trades gives you access to information that is applicable to trading. The service also lets you set up appointments with all coaches. This mentoring is ongoing and actionable. Kelvo is an amazing coach. It is worth more than double the price.'
	},
	{
		name: 'Richard Becher',
		role: 'IT Consultant',
		quote:
			'I’ve been part of Trick Trades for a little over 2 months. To offer a mentoring component freely available as part of the package is INSANELY generous. Kelvo is a fantastic guide — I appreciate his ability to call out BS while offering support and encouragement at the same time.'
	}
];

export const featuredOn = ['CBS', 'FOX', 'NBC', 'USA Today', 'MarketWatch', 'Benzinga', 'Google News'];

export type Plan = {
	id: string;
	name: string;
	price: number;
	cadence: string;
	blurb: string;
	cta: string;
	href: string;
	featured?: boolean;
	inheritLabel?: string;
	features: string[];
};

export const plans: Plan[] = [
	{
		id: 'guidance',
		name: 'Size UP Guidance',
		price: 247,
		cadence: '/month',
		blurb: 'Introduction to Pat’s proven day-trading strategy, video lessons and daily guidance for each trading day.',
		cta: 'Join Size UP Guidance',
		href: '/product/size-up-guidance',
		features: [
			'The Size UP! App (iOS, Android, Desktop)',
			'Boot Camp: 50+ game-changing lessons on skills & emotions',
			'Complete instruction & dissection of Smart Money Tactics',
			'How to find and plot the secret levels — self-sufficiently',
			'The selective basket of stocks Pat uses every single day',
			'The Standard Risk strategy to avoid dirty losses',
			'Nightly video watch list, viewable on any device',
			'Live screenshare at 8:45 a.m. EST to guide your morning',
			'Live Pre-Market Plan of Attack (PMPOA) every day at 9 a.m. EST',
			'24/7 helpful & friendly chat room — your questions WILL get answered',
			'Trade recaps + entry/exit charts posted in our private FB group',
			'Morning newsletter briefing sent to your inbox'
		]
	},
	{
		id: 'mentoring',
		name: 'Size UP Mentoring',
		price: 347,
		cadence: '/month',
		blurb: 'Weekly mentoring that builds on the week’s lessons plus forward-thinking conversation on self-improvement and market analysis.',
		cta: 'Join Size UP Mentorship',
		href: '/product/size-up-mentorship',
		featured: true,
		inheritLabel: 'All of Size UP Guidance, plus:',
		features: [
			'Advanced Size UP analysis, insights & trade-plan prep for the week ahead',
			'Weekly LIVE Mentoring class (recorded if you miss it)',
			'Weekly dissection of trend-formation strategy',
			'Candlestick subtleties that separate a losing trade from a monster win',
			'The sneaky smart levels that can make huge profits',
			'How to professionally average in',
			'When and where to correctly pay yourself',
			'Advanced trading psychology to take advantage of DUMB MONEY',
			'How to find hidden trend formations on the daily chart',
			'The subtle nuances on the intraday chart — get inside Pat’s head',
			'The only times Pat holds overnight',
			'A review of some of your toughest trades'
		]
	}
];

export const faqs = [
	{
		q: 'Is it worth the price?',
		a: 'What’s the price of continuing the path you’re on? Compare the cost of your time and losing trades, and you’ll see the value of what I teach far exceeds my low monthly rates. By not learning from a true master, is it worth the cost?'
	},
	{
		q: 'Will it be like all the others?',
		a: 'TrickTrades, my Strategy, Boot Camp, the Community and the Daily Live Trading experience is nothing like you’ve ever seen before. The keys to the kingdom are here. The only thing that will stop you is if you show up and don’t listen.'
	},
	{
		q: 'Will I understand what to do?',
		a: 'Our education is designed for both new and experienced traders. To ensure everyone understands Pat’s strategy, we have a 50-lesson Boot Camp that covers every detail required to become a successful day trader.'
	},
	{
		q: 'What if I’m a beginner?',
		a: 'It’s almost better if you don’t have a lot of experience — you don’t have to be re-wired to get rid of bad habits. This is a family-oriented community that embraces new and struggling day traders.'
	},
	{
		q: 'Do you put out a watch list?',
		a: 'Yes! Every night I post a video watchlist (the PMPOA) you can watch on the website, covering exactly what I’m looking to trade with all the levels and targets. The next morning I dial it in to premarket action.'
	},
	{
		q: 'Do you trade crypto or forex?',
		a: 'No. We strictly day trade REAL stocks and options. There’s a reason we play the same stocks Smart Money plays. Our strategy is time-tested and proven over 10 years.'
	},
	{
		q: 'Do you trade penny stocks?',
		a: 'Absolutely not. Penny stocks will decimate your account. We trade what Smart Money trades — market leaders that are liquid and easy to trade. Once you see how profitable it is, you’ll never want to trade anything else.'
	},
	{
		q: 'I don’t have a big account — can I still trade?',
		a: 'Of course! Most members started with a few hundred to a few thousand dollars. With our options strategy you don’t even need to worry about the PDT rule — just open a cash options account.'
	},
	{
		q: 'Is there a long-term commitment?',
		a: 'Nope. You can cancel any time with a click of the mouse from your account dashboard.'
	}
];

export const guarantee = {
	title: 'Trick Trades “No Trader Left Behind” Guarantee',
	body: [
		'Our mission is simple: provide you with the educational resources required so you can master a level of trading that delivers your freedom.',
		'We’ve created a framework of strategies and systems that keep you safe from unnecessary loss while you gain the experience to gradually increase risk over time — steadily growing your account as you pull profits from the market.',
		'This framework includes training courses, daily live trading guidance, technical support, and multiple channels of communication to help you wherever you are in your learning process.',
		'When you trust this process and allow yourself to grow, your dream of becoming a professional trader becomes real — day by day, trade by trade, lesson by lesson. There’s no going back. And no trader gets left behind. That’s our guarantee to you.'
	]
};
