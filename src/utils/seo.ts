export function breadcrumbSchema(items: { name: string; slug: string }[]) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": item.name,
      "item": `https://www.getemoji.online/${item.slug}`,
    })),
  });
}

export function productSchema(name: string, char: string, desc: string) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${char} ${name} Emoji`,
    "description": desc,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
    },
  });
}

export function collectionSchema(name: string, desc: string, itemCount: number) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": name,
    "description": desc,
    "numberOfItems": itemCount,
  });
}

export function webAppSchema() {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "GetEmoji.Online",
    "url": "https://www.getemoji.online",
    "description": "Free emoji copy and paste tool. Browse thousands of emojis and click to copy instantly.",
    "applicationCategory": "Utility",
    "operatingSystem": "All",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  });
}

export function faqSchema(items: { q: string; a: string }[]) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a,
      },
    })),
  });
}
