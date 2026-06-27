import type { Emoji } from './categories';
import france from './countries/france.json' with { type: 'json' };
import japan from './countries/japan.json' with { type: 'json' };
import india from './countries/india.json' with { type: 'json' };
import italy from './countries/italy.json' with { type: 'json' };
import germany from './countries/germany.json' with { type: 'json' };
import spain from './countries/spain.json' with { type: 'json' };
import brazil from './countries/brazil.json' with { type: 'json' };
import korea from './countries/korea.json' with { type: 'json' };
import usa from './countries/usa.json' with { type: 'json' };
import uk from './countries/uk.json' with { type: 'json' };
import australia from './countries/australia.json' with { type: 'json' };

export interface CountryInfo {
  slug: string;
  name: string;
  flag: string;
  lang: string;
  hreflang: string;
  emojis: Emoji[];
}

const rawData: { slug: string; name: string; lang: string; hreflang: string; data: any[] }[] = [
  { slug: 'usa', name: 'USA', lang: 'us', hreflang: 'en-US', data: usa },
  { slug: 'uk', name: 'UK', lang: 'gb', hreflang: 'en-GB', data: uk },
  { slug: 'australia', name: 'Australia', lang: 'au', hreflang: 'en-AU', data: australia },
  { slug: 'france', name: 'France', lang: 'fr', hreflang: 'fr', data: france },
  { slug: 'japan', name: 'Japan', lang: 'jp', hreflang: 'ja', data: japan },
  { slug: 'india', name: 'India', lang: 'in', hreflang: 'hi', data: india },
  { slug: 'italy', name: 'Italy', lang: 'it', hreflang: 'it', data: italy },
  { slug: 'germany', name: 'Germany', lang: 'de', hreflang: 'de', data: germany },
  { slug: 'spain', name: 'Spain', lang: 'es', hreflang: 'es', data: spain },
  { slug: 'brazil', name: 'Brazil', lang: 'br', hreflang: 'pt', data: brazil },
  { slug: 'korea', name: 'Korea', lang: 'kr', hreflang: 'ko', data: korea },
];

const _cache: CountryInfo[] = rawData.map(r => ({
  slug: r.slug,
  name: r.name,
  flag: r.data.find((e: any) => e.name?.toLowerCase().includes('flag'))?.char || '🌍',
  lang: r.lang,
  hreflang: r.hreflang,
  emojis: r.data as Emoji[],
}));

export function getCountries(): CountryInfo[] {
  return _cache;
}
