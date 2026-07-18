import { site } from '$lib/data/site';

export const prerender = true;

const routes = [
	{ path: '/', priority: '1.0', changefreq: 'weekly' },
	{ path: '/size-up-join', priority: '0.9', changefreq: 'weekly' }
];

export function GET() {
	const urls = routes
		.map(
			(r) => `	<url>
		<loc>${site.domain}${r.path === '/' ? '' : r.path}</loc>
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
