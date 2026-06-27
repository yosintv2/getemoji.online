import type { APIRoute } from 'astro';
import { loadData } from '../data';

const data = loadData();
const emojis = data.allEmojis.slice(0, 24).map(e => ({ c: e.char, n: e.name, s: e.slug }));

export const GET: APIRoute = () => {
  const js = `(function(){var s=document.currentScript;var theme=s.getAttribute('data-theme')||'light';var count=parseInt(s.getAttribute('data-count')||'12');var c=document.createElement('div');c.id='getemoji-widget';c.innerHTML='<div style="font-family:-apple-system,BlinkMacSystemFont,\\'Segoe UI\\',Roboto,sans-serif;border-radius:16px;overflow:hidden;border:1px solid '+(theme==='dark'?'#333':'#e5e7eb')+';background:'+(theme==='dark'?'#1e293b':'#fff')+';max-width:400px"><div style="padding:12px 16px;background:'+(theme==='dark'?'#0f172a':'#fef3c7')+';display:flex;align-items:center;justify-content:space-between"><span style="font-weight:800;font-size:14px;color:'+(theme==='dark'?'#fff':'#1f2937')+'">\\u2728 GetEmoji</span><a href="https://www.getemoji.online/" target="_blank" rel="noopener" style="font-size:11px;color:'+(theme==='dark'?'#94a3b8':'#6b7280')+';text-decoration:none">More emojis \\u2192</a></div><div id="ge-grid" style="display:grid;grid-template-columns:repeat(6,1fr);gap:4px;padding:12px">Loading...</div><div style="padding:8px 16px;border-top:1px solid '+(theme==='dark'?'#333':'#e5e7eb')+';text-align:center"><span style="font-size:10px;color:'+(theme==='dark'?'#64748b':'#9ca3af')+'">Powered by <a href="https://www.getemoji.online/" target="_blank" rel="noopener" style="color:'+(theme==='dark'?'#fbbf24':'#eab308')+';text-decoration:none;font-weight:600">GetEmoji.Online</a></span></div></div>';s.parentNode.insertBefore(c,s.nextSibling);var emojis=${JSON.stringify(emojis)};var grid=document.getElementById('ge-grid');if(grid){grid.innerHTML=emojis.slice(0,count).map(function(e){return '<div style="display:flex;align-items:center;justify-content:center;font-size:24px;cursor:pointer;padding:6px;border-radius:8px;transition:all 0.2s" onclick="navigator.clipboard.writeText(\\''+e.c+'\\');var t=this;t.style.background=\\'#fef3c7\\';setTimeout(function(){t.style.background=\\'transparent\\'},500)" title="'+e.n+'">'+e.c+'</div>';}).join('');}})();`;
  return new Response(js, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
