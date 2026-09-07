/** Patterns that break the MDX blog engine — used by validator and post-generation cleanup */
export const FORBIDDEN_PATTERNS = {
  jsxComponent: /<[A-Z][a-zA-Z]+[\s/>]/g,
  anchorId: /\{#[^}]+\}/,
  internalAnchorLink: /\[([^\]]+)\]\(#[^)]+\)/,
  scriptTag: /<script[\s>]/i,
  h1InBody: /^# [^#]/m,
  yamlBlockTags: /^tags:\s*\n\s*-/m,
  yamlBlockFaq: /^faq:\s*\n\s*-\s*question/m,
  imageJsx: /<Image[\s/>]/,
  keyTakeaways: /<KeyTakeaways/,
  callout: /<Callout/,
  mockAbsatzFiller: /Absatz \d+ vertieft/i,
  guaranteedReturns:
    /\b(?:guaranteed\s+(?:returns?|profits?|yield)|we\s+guarantee\s+(?:you\s+)?(?:returns?|profits?|gains?)|risk[- ]free\s+(?:returns?|profits?))\b/i,
  investmentAdvice:
    /\b(?:this\s+is\s+(?:personalized\s+)?investment\s+advice|buy\s+this\s+(?:token|coin)\s+now|guaranteed\s+to\s+(?:moon|pump))\b/i,
  fakeExpertAuthor:
    /dr\.\s*(?:stefan\s+kaufmann|markus\s+hoffmann)|elena\s+(?:marchetti|kowalski|berger)|pierre\s+dijon|michael\s+weber|crypto\s+guru\s+\d+/i,
} as const;

export const FORBIDDEN_PATTERN_MESSAGES: Record<keyof typeof FORBIDDEN_PATTERNS, string> = {
  jsxComponent: 'JSX components found — not allowed in MDX',
  anchorId: 'Anchor IDs {#id} found — not allowed in MDX',
  internalAnchorLink: 'Internal anchor links [text](#id) found — not allowed',
  scriptTag: '<script> tag found — not allowed in MDX',
  h1InBody: 'H1 (# Heading) in article body — not allowed',
  yamlBlockTags: 'YAML block array for tags — use an inline array',
  yamlBlockFaq: 'YAML block array for faq — use list syntax in frontmatter',
  imageJsx: '<Image /> JSX — only ![alt](url) is allowed',
  keyTakeaways: '<KeyTakeaways> component — not allowed',
  callout: '<Callout> component — not allowed',
  mockAbsatzFiller: 'Mock copy-paste filler (Absatz N vertieft) — article invalid',
  guaranteedReturns: 'Guaranteed returns / profits claim — not allowed',
  investmentAdvice: 'Investment solicitation / advice claim — not allowed',
  fakeExpertAuthor: 'Invented expert author — only Cryp2bus Editorial is allowed',
};
