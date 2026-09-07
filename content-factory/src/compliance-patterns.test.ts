import { FORBIDDEN_PATTERNS } from '../config/forbidden-patterns';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function shouldMatch(pattern: RegExp, text: string, label: string): void {
  assert(pattern.test(text), `expected to MATCH (${label}): ${text}`);
}

function shouldNotMatch(pattern: RegExp, text: string, label: string): void {
  assert(!pattern.test(text), `expected NOT to match (${label}): ${text}`);
}

shouldNotMatch(
  FORBIDDEN_PATTERNS.guaranteedReturns,
  'This briefing never promises returns or profits. Outcomes depend on markets, ops, and policy.',
  'educational no-guarantee sentence',
);

shouldMatch(
  FORBIDDEN_PATTERNS.guaranteedReturns,
  'We guarantee that you will earn guaranteed returns on USDT.',
  'solicitation returns promise',
);

shouldMatch(
  FORBIDDEN_PATTERNS.guaranteedReturns,
  'This method offers risk-free profits for every invoice.',
  'risk-free profits',
);

shouldNotMatch(
  FORBIDDEN_PATTERNS.investmentAdvice,
  'Cryp2bus Editorial content is educational only and does not solicit speculative token purchases.',
  'educational disclaimer',
);

shouldMatch(
  FORBIDDEN_PATTERNS.investmentAdvice,
  'This is personalized investment advice: buy this token now.',
  'investment solicitation',
);

shouldMatch(
  FORBIDDEN_PATTERNS.investmentAdvice,
  'Buy this coin now before it is guaranteed to moon.',
  'buy this coin now',
);

shouldNotMatch(
  FORBIDDEN_PATTERNS.fakeExpertAuthor,
  'Cryp2bus Editorial publishes educational settlement explainers.',
  'allowed editorial byline',
);

shouldMatch(
  FORBIDDEN_PATTERNS.fakeExpertAuthor,
  'Written by Dr. Stefan Kaufmann, crypto guru 1.',
  'invented expert',
);

console.log('✅ compliance-patterns.test.ts passed');
