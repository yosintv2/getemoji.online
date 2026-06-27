import type { APIRoute } from 'astro';
import { loadData } from '../../../data';

const data = loadData();

export const GET: APIRoute = ({ request }) => {
  const url = new URL(request.url);
  const category = url.searchParams.get('category');
  const search = url.searchParams.get('search');
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '100'), 500);
  const page = parseInt(url.searchParams.get('page') || '1');

  let results = data.allEmojis;
  if (category) {
    results = results.filter(e => e.catSlug === category);
  }
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(e => e.name.toLowerCase().includes(q) || e.char.includes(q));
  }

  const total = results.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const items = results.slice(start, start + limit).map(e => ({
    char: e.char,
    name: e.name,
    slug: e.slug,
    category: e.catSlug,
    description: e.desc,
    url: `https://www.getemoji.online/${e.slug}/`,
  }));

  return new Response(JSON.stringify({
    success: true,
    count: items.length,
    total,
    page,
    totalPages,
    data: items,
    attribution: 'Powered by GetEmoji.Online — https://www.getemoji.online',
  }, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
