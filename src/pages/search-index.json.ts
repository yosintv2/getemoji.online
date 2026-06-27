import type { APIRoute } from 'astro';
import { loadData, getSearchIndex } from '../data';

export const GET: APIRoute = () => {
  const data = loadData();
  const index = getSearchIndex(data.allEmojis);

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
