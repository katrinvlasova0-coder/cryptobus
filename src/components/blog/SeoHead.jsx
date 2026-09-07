import { useEffect } from 'react';

function upsertMeta(selector, attributes) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    document.head.appendChild(el);
  }
  Object.entries(attributes).forEach(([key, value]) => {
    if (value) el.setAttribute(key, value);
  });
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export default function SeoHead({
  title,
  description,
  canonical,
  image,
  jsonLd,
  type = 'article',
}) {
  useEffect(() => {
    const previousTitle = document.title;
    if (title) document.title = title;
    if (description) {
      upsertMeta('meta[name="description"]', { name: 'description', content: description });
    }
    if (canonical) upsertLink('canonical', canonical);
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title });
    upsertMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: description,
    });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical });
    if (image) upsertMeta('meta[property="og:image"]', { property: 'og:image', content: image });
    upsertMeta('meta[name="twitter:card"]', {
      name: 'twitter:card',
      content: image ? 'summary_large_image' : 'summary',
    });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
    upsertMeta('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: description,
    });

    let script = document.getElementById('cryptobus-jsonld');
    if (jsonLd) {
      if (!script) {
        script = document.createElement('script');
        script.id = 'cryptobus-jsonld';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    }

    return () => {
      document.title = previousTitle;
      script?.remove();
    };
  }, [title, description, canonical, image, jsonLd, type]);

  return null;
}
