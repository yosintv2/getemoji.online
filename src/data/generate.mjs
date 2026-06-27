import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');

const GROUP_MAP = {
  'smileys_emotion': 'smileys',
  'people_body': 'people',
  'animals_nature': 'animals',
  'food_drink': 'food',
  'travel_places': 'travel',
  'activities': 'activities',
  'objects': 'objects',
  'symbols': 'symbols',
  'flags': 'flags',
};

const SKIN_TONES = [
  { mod: '\u{1F3FB}', name: 'Light Skin Tone' },
  { mod: '\u{1F3FC}', name: 'Medium-Light Skin Tone' },
  { mod: '\u{1F3FD}', name: 'Medium Skin Tone' },
  { mod: '\u{1F3FE}', name: 'Medium-Dark Skin Tone' },
  { mod: '\u{1F3FF}', name: 'Dark Skin Tone' },
];

function titleCase(str) {
  return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function makeDesc(name, groupSlug, catName) {
  const tpl = {
    smileys: '{Name} emoji - a {name} used to express emotions and feelings in digital messages.',
    people: '{Name} emoji - a {name} symbol used in communication and social media interactions.',
    animals: '{Name} emoji - a {name} representing nature, wildlife, animals, and the environment.',
    food: '{Name} emoji - a {name} representing food, beverages, dining, and culinary experiences.',
    travel: '{Name} emoji - a {name} representing travel, places, landmarks, and transportation.',
    activities: '{Name} emoji - a {name} representing sports, activities, events, and hobbies.',
    objects: '{Name} emoji - a {name} representing objects, tools, items, and everyday things.',
    symbols: '{Name} emoji - a {name} symbol used for various meanings in digital communication.',
    flags: '{Name} emoji - the flag representing {name}.',
  }[groupSlug] || '{Name} emoji for digital communication.';
  return tpl
    .replace(/\{Name\}/g, titleCase(name))
    .replace(/\{name\}/g, name);
}

function loadExisting(dir) {
  const dirPath = path.resolve(ROOT, dir);
  const map = {};
  if (!fs.existsSync(dirPath)) return map;
  for (const file of fs.readdirSync(dirPath).filter(f => f.endsWith('.json'))) {
    const data = JSON.parse(fs.readFileSync(path.join(dirPath, file), 'utf-8'));
    for (const item of data) {
      if (item.slug && !map[item.slug]) map[item.slug] = item;
    }
  }
  return map;
}

async function main() {
  console.log('Fetching Unicode emoji data...');
  const url = 'https://raw.githubusercontent.com/muan/unicode-emoji-json/main/data-by-group.json';
  const res = await fetch(url);
  const groups = await res.json();

  const existing = loadExisting('data');
  const merged = { ...existing, ...loadExisting('others') };
  console.log(`Existing emojis loaded: ${Object.keys(merged).length}`);

  const categoryEmojis = {};

  for (const group of groups) {
    const groupSlug = GROUP_MAP[group.slug];
    if (!groupSlug) continue;

    const items = [];
    const seen = new Set();

    for (const emoji of group.emojis) {
      const eSlug = emoji.slug.replace(/_/g, '-');
      if (seen.has(eSlug)) continue;
      seen.add(eSlug);

      if (merged[eSlug]) {
        items.push({
          char: emoji.emoji,
          name: merged[eSlug].name,
          slug: eSlug,
          desc: merged[eSlug].desc,
        });
      } else {
        items.push({
          char: emoji.emoji,
          name: titleCase(emoji.name),
          slug: eSlug,
          desc: makeDesc(emoji.name, groupSlug, group.name),
        });
      }

      // Generate skin tone variants (only for non-ZWJ emojis)
      const isZwj = emoji.emoji.includes('\u{200D}');
      if (emoji.skin_tone_support && !isZwj) {
        for (const st of SKIN_TONES) {
          const stSlug = eSlug + '-' + slugify(st.name);
          if (seen.has(stSlug)) continue;
          seen.add(stSlug);

          const stName = titleCase(emoji.name) + ': ' + st.name;
          const base = emoji.emoji.replace(/\u{FE0F}/gu, '');
          const stChar = base + st.mod;

          if (merged[stSlug]) {
            items.push({
              char: stChar,
              name: merged[stSlug].name,
              slug: stSlug,
              desc: merged[stSlug].desc,
            });
          } else {
            items.push({
              char: stChar,
              name: stName,
              slug: stSlug,
              desc: titleCase(emoji.name) + ' emoji with ' + st.name.toLowerCase() + ' - used in digital communication.',
            });
          }
        }
      }
    }

    categoryEmojis[groupSlug] = items;
  }

  const dataDir = path.resolve(ROOT, 'data');
  let total = 0;
  for (const [slug, emojis] of Object.entries(categoryEmojis)) {
    fs.writeFileSync(path.join(dataDir, `${slug}.json`), JSON.stringify(emojis, null, 2) + '\n');
    console.log(`  ${slug}.json: ${emojis.length} emojis`);
    total += emojis.length;
  }

  console.log(`\nTotal emojis in data/: ${total}`);
}

main().catch(console.error);
