import type { APIRoute } from 'astro';
import { loadData, categories } from '../../../data';

export const GET: APIRoute = () => {
  const data = loadData();
  const result = categories.map(c => ({
    slug: c.slug,
    name: c.name,
    icon: c.icon,
    count: (data.emojisByCategory[c.slug] || []).length,
    url: `https://www.getemoji.online/${c.slug}/`,
  }));

  return new Response(JSON.stringify({
    success: true,
    count: result.length,
    data: result,
    attribution: 'Powered by GetEmoji.Online — https://www.getemoji.online',
  }, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
