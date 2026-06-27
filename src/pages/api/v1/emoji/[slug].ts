import type { APIRoute, GetStaticPaths } from 'astro';
import { loadData } from '../../../../data';

const data = loadData();

export const getStaticPaths: GetStaticPaths = () => {
  return data.allEmojis.map(e => ({ params: { slug: e.slug } }));
};

export const GET: APIRoute = ({ params }) => {
  const { slug } = params;
  const item = data.allEmojis.find(e => e.slug === slug);
  if (!item) {
    return new Response(JSON.stringify({ success: false, error: 'Emoji not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  return new Response(JSON.stringify({
    success: true,
    data: {
      char: item.char,
      name: item.name,
      slug: item.slug,
      category: item.catSlug,
      description: item.desc,
      url: `https://www.getemoji.online/${item.slug}/`,
    },
    attribution: 'Powered by GetEmoji.Online — https://www.getemoji.online',
  }, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
