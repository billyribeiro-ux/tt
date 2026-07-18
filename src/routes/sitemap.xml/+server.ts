import { site } from '$lib/data/site';

export const prerender = true;

// Every prerendered content route. lastmod is stamped at build time — the whole
// site is static, so a rebuild IS the moment content last changed.
const routes = [
	{ path: '/', priority: '1.0', changefreq: 'weekly' },
	{ path: '/size-up-join', priority: '0.9', changefreq: 'weekly' },
	{ path: '/project-alpha', priority: '0.8', changefreq: 'monthly' },
	{ path: '/day-trading-academy', priority: '0.8', changefreq: 'monthly' },
	{ path: '/day-trading-bootcamp', priority: '0.7', changefreq: 'monthly' },
	{ path: '/crystal-ball-course', priority: '0.7', changefreq: 'monthly' },
	{ path: '/crystal-ball-gold-edition-course', priority: '0.7', changefreq: 'monthly' },
	{ path: '/momentum-course', priority: '0.7', changefreq: 'monthly' },
	{ path: '/digital-store', priority: '0.8', changefreq: 'monthly' },
	{ path: '/trick-trades-core', priority: '0.7', changefreq: 'monthly' },
	{ path: '/polaris', priority: '0.7', changefreq: 'monthly' },
	{ path: '/testimonials', priority: '0.6', changefreq: 'monthly' },
	{ path: '/contact-us', priority: '0.5', changefreq: 'yearly' }
];

export function GET() {
	const lastmod = new Date().toISOString().slice(0, 10);
	const urls = routes
		.map(
			(r) => `	<url>
		<loc>${site.domain}${r.path === '/' ? '' : r.path}</loc>
		<lastmod>${lastmod}</lastmod>
		<changefreq>${r.changefreq}</changefreq>
		<priority>${r.priority}</priority>
	</url>`
		)
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
}
