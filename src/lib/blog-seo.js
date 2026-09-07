export const SITE_ORIGIN = 'https://cryp2bus.com';
export const ORGANIZATION_NAME = 'Cryptobus';

export function canonicalBlogUrl(slug) {
  return `${SITE_ORIGIN}/blog/${slug}/`;
}

export function canonicalBlogIndexUrl() {
  return `${SITE_ORIGIN}/blog/`;
}

export function buildArticleJsonLd(post) {
  const url = canonicalBlogUrl(post.slug);
  const orgId = `${SITE_ORIGIN}/#organization`;

  const graph = [
    {
      '@type': 'Organization',
      '@id': orgId,
      name: ORGANIZATION_NAME,
      url: `${SITE_ORIGIN}/`,
      email: 'Hello@cryp2bus.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Cimburkova 916/8, Žižkov',
        addressLocality: 'Prague',
        postalCode: '130 00',
        addressCountry: 'CZ',
      },
    },
    {
      '@type': 'Article',
      headline: post.title,
      description: post.description,
      datePublished: post.datePublished,
      dateModified: post.dateModified || post.datePublished,
      inLanguage: 'en',
      isAccessibleForFree: true,
      image: post.coverImage || undefined,
      mainEntityOfPage: url,
      author: {
        '@type': 'Organization',
        name: post.author?.name || 'Cryp2bus Editorial',
        url: `${SITE_ORIGIN}/`,
      },
      publisher: { '@id': orgId },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_ORIGIN}/` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: canonicalBlogIndexUrl() },
        { '@type': 'ListItem', position: 3, name: post.title, item: url },
      ],
    },
  ];

  if (post.faq?.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: post.faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}
