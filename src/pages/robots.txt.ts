import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  return new Response('User-agent: *\nAllow: /\nSitemap: https://www.getemoji.online/sitemap.xml', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
