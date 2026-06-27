import type { APIRoute } from 'astro';
import { categories } from '../data/categories';
import { loadData } from '../data';
import { getCountries } from '../data/countries';

export const GET: APIRoute = () => {
  const data = loadData();
  const countries = getCountries();
  const baseUrl = 'https://www.getemoji.online';

  const urls: string[] = [baseUrl];

  for (const c of categories) {
    urls.push(`${baseUrl}/${c.slug}/`);
  }

  for (const e of data.allEmojis) {
    urls.push(`${baseUrl}/${e.slug}/`);
  }

  for (const c of countries) {
    urls.push(`${baseUrl}/country/${c.slug}/`);
  }

  const today = new Date().toISOString().split('T')[0];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
