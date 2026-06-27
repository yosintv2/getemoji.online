export interface Emoji {
  char: string;
  name: string;
  slug: string;
  desc: string;
  catSlug?: string;
}

export interface Category {
  slug: string;
  name: string;
  icon: string;
  desc: string;
}

export const categories: Category[] = [
  { slug: 'smileys', name: 'Smileys & Emotion', icon: '😀', desc: 'Copy and paste smiley face emojis, emoticons, and emotional expressions.' },
  { slug: 'people', name: 'People & Body', icon: '👋', desc: 'Copy and paste people emojis, hand gestures, and body part symbols.' },
  { slug: 'animals', name: 'Animals & Nature', icon: '🐶', desc: 'Copy and paste animal emojis, nature symbols, and weather icons.' },
  { slug: 'food', name: 'Food & Drink', icon: '🍕', desc: 'Copy and paste food emojis, drink symbols, and dining icons.' },
  { slug: 'travel', name: 'Travel & Places', icon: '✈️', desc: 'Copy and paste travel emojis, landmark symbols, and transportation icons.' },
  { slug: 'activities', name: 'Activities', icon: '⚽', desc: 'Copy and paste activity emojis, sport symbols, and hobby icons.' },
  { slug: 'objects', name: 'Objects', icon: '💡', desc: 'Copy and paste object emojis, tool symbols, and household item icons.' },
  { slug: 'symbols', name: 'Symbols', icon: '❤️', desc: 'Copy and paste symbol emojis, zodiac signs, and currency icons.' },
  { slug: 'flags', name: 'Flags', icon: '🏁', desc: 'Copy and paste flag emojis, country symbols, and pride flags.' },
];

export const categoryMap: Record<string, string> = {};
for (const c of categories) {
  categoryMap[c.slug] = c.name;
}
