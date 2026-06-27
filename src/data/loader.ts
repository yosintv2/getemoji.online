import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { categories, categoryMap, type Emoji } from './categories';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');

function loadJsonDir(dir: string, parentCat?: string): Emoji[] {
  const dirPath = path.resolve(ROOT, dir);
  if (!fs.existsSync(dirPath)) return [];
  const results: Emoji[] = [];
  const files = fs.readdirSync(dirPath).sort();
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    const catSlug = file.replace(/\.json$/, '');
    try {
      const data = JSON.parse(fs.readFileSync(path.join(dirPath, file), 'utf-8'));
      for (const item of data) {
        if (item && item.char && item.name && item.slug) {
          results.push({
            char: item.char,
            name: item.name,
            slug: item.slug,
            desc: item.desc || '',
            catSlug: parentCat || catSlug,
          });
        }
      }
    } catch (e) {
      console.error(`Error loading ${file} from ${dir}:`, e);
    }
  }
  return results;
}

export function loadData() {
  const coreEmojis = loadJsonDir('data');
  const othersEmojis = loadJsonDir('others');
  const kaomojiEmojis = loadJsonDir('kaomoji');

  const allEmojisMap = new Map<string, Emoji>();
  for (const e of [...coreEmojis, ...othersEmojis, ...kaomojiEmojis]) {
    if (!allEmojisMap.has(e.slug)) {
      allEmojisMap.set(e.slug, e);
    }
  }

  const allEmojis = Array.from(allEmojisMap.values());

  const emojisByCategory: Record<string, Emoji[]> = {};
  for (const c of categories) {
    emojisByCategory[c.slug] = [];
  }
  for (const e of coreEmojis) {
    if (e.catSlug && emojisByCategory[e.catSlug]) {
      emojisByCategory[e.catSlug].push(e);
    }
  }

  const allTopics = othersEmojis.reduce((acc, e) => {
    if (e.catSlug && !acc.includes(e.catSlug)) acc.push(e.catSlug);
    return acc;
  }, [] as string[]);

  const topicEmojis: Record<string, Emoji[]> = {};
  for (const t of allTopics) {
    topicEmojis[t] = othersEmojis.filter(e => e.catSlug === t);
  }

  const allKaomoji = kaomojiEmojis.reduce((acc, e) => {
    if (e.catSlug && !acc.includes(e.catSlug)) acc.push(e.catSlug);
    return acc;
  }, [] as string[]);

  const kaomojiGroups: Record<string, Emoji[]> = {};
  for (const k of allKaomoji) {
    kaomojiGroups[k] = kaomojiEmojis.filter(e => e.catSlug === k);
  }

  return { allEmojis, emojisByCategory, topicEmojis, allTopics, kaomojiGroups, allKaomoji, coreEmojis, othersEmojis, kaomojiEmojis };
}

export function getSearchIndex(emojis: Emoji[]) {
  const seen = new Set<string>();
  return emojis
    .filter(e => {
      const lower = e.catSlug?.toLowerCase() || '';
      if (lower.includes('kaomoji')) return false;
      if (seen.has(e.char)) return false;
      seen.add(e.char);
      return true;
    })
    .map(e => ({
      name: e.name,
      char: e.char,
      slug: e.slug,
    }));
}
