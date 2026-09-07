export type FallbackCategory =
  | 'Invoice Settlement'
  | 'Corporate Treasury'
  | 'Cross-border Payments'
  | 'Compliance'
  | 'Ops Playbooks';

export interface SafeTemplate {
  id: string;
  category: FallbackCategory;
  cluster: string;
  keywordDe: string;
  keywordEn: string;
  titleDe: string;
  titleEn: string;
  descriptionDe: string;
  descriptionEn: string;
  unsplashQuery: string;
  headingsDe: [string, string, string, string, string, string];
  headingsEn: [string, string, string, string, string, string];
  factsDe: string[];
  factsEn: string[];
  listDe: string[];
  listEn: string[];
  tableHeadersDe: [string, string, string];
  tableHeadersEn: [string, string, string];
  tableRows: Array<[string, string, string]>;
  faqDe: Array<{ question: string; answer: string }>;
  faqEn: Array<{ question: string; answer: string }>;
}

function t(
  id: string,
  category: FallbackCategory,
  keyword: string,
  title: string,
  description: string,
  unsplashQuery: string,
  headings: SafeTemplate['headingsEn'],
  facts: string[],
  list: string[],
  tableHeaders: SafeTemplate['tableHeadersEn'],
  tableRows: Array<[string, string, string]>,
  faq: Array<{ question: string; answer: string }>,
): SafeTemplate {
  return {
    id,
    category,
    cluster: category,
    keywordDe: keyword,
    keywordEn: keyword,
    titleDe: title,
    titleEn: title,
    descriptionDe: description,
    descriptionEn: description,
    unsplashQuery,
    headingsDe: headings,
    headingsEn: headings,
    factsDe: facts,
    factsEn: facts,
    listDe: list,
    listEn: list,
    tableHeadersDe: tableHeaders,
    tableHeadersEn: tableHeaders,
    tableRows,
    faqDe: faq,
    faqEn: faq,
  };
}

const INVOICE_FACTS = [
  'A business crypto invoice settlement is a payment against a commercial invoice, not a retail trade. The invoice number, amount, currency or asset, and counterparty legal name belong in the same file as the on-chain or desk confirmation.',
  'USDT and USDC are commonly used for B2B settlement because teams want a stable unit of account. They still carry operational, counterparty, and network risk. Choosing an asset is a policy decision, not a return promise.',
  'Before payment, finance should confirm beneficiary wallet ownership, network (for example TRC-20 vs ERC-20), and whether the supplier expects a full amount after fees. Wrong-network transfers are a frequent ops failure.',
  'Maker-checker approval matters: one person prepares the payment pack, another releases funds. Screenshots alone are weak evidence; keep a dated payment memo with invoice ID and tx hash or desk ticket.',
  'Accounting needs an evidence pack: invoice PDF, rate source if converted, fee lines, and settlement timestamp. Controllers care about auditability more than speed slogans.',
  'Sanctions and KYB on the counterparty sit beside classic vendor onboarding. A crypto rail does not remove AML expectations for the business that pays.',
  'Cryptobus provides crypto transaction infrastructure for businesses. It is not an investment advisory firm and does not promise returns on any asset used for settlement.',
  'This briefing is educational. Live corridors, bank partners, and internal policies remain the controlling sources as of the action date.',
];

const TREASURY_FACTS = [
  'Corporate crypto treasury starts with custody model, conversion policy, and dual control — not with a price chart. Wallets and desks are tools inside a written policy.',
  'Cold, warm, and hot balances should map to named owners and spend limits. A single shared seed phrase is an ops anti-pattern for a company account.',
  'Conversion rules define when treasury moves between fiat, stablecoins, and other assets. Rules should name triggers, approvers, and documentation — not “buy the dip” language.',
  'OTC desks are often used for larger sizes when public-exchange liquidity or slippage is a concern. Desk tickets, quotes, and settlement instructions belong in the treasury file.',
  'Reconcile balances daily or on a defined cadence. Unexplained dust, failed withdrawals, and pending desk trades should age into an open-items list.',
  'Holding crypto on a corporate balance sheet does not promise a return. Market moves can reduce fiat-equivalent value between receipt and conversion.',
  'Cryp2bus Editorial materials explain process. They do not replace your board policy, auditor requirements, or applicable crypto-asset rules.',
  'Primary sources for your firm are your signed policy, bank or CASP statements, and the counterparty contracts that define settlement.',
];

const XBORDER_FACTS = [
  'Cross-border crypto settlement is often compared with bank wires on cost, speed, cut-off times, and evidence quality. The right comparison is corridor-specific, not global slogans.',
  'Wires can take banking days and intermediate banks. Crypto settlement can be faster on-chain or via a desk, but compliance screening and conversion still take calendar time.',
  'FX risk appears when the invoice currency differs from the settlement asset. Teams should record the rate source and time used for the books.',
  'Multi-currency corridors need a checklist: invoice currency, settlement asset, network, beneficiary details, and who owns exceptions when a payment fails.',
  'Banking partners and payment institutions may still sit at the edge of the flow. Crypto does not erase KYB, travel-rule, or local transfer rules where they apply.',
  'Ops should define escalation when a hash is not confirmed, a desk trade fails, or a supplier disputes amount received after fees.',
  'Cryptobus can help businesses buy crypto, pay invoices, and settle cross-border. It does not guarantee a wire-like outcome in every corridor.',
  'Verify corridor facts with your compliance owner and primary payment partners as of the action date. Educational tables are not a priced offer.',
];

const COMPLIANCE_FACTS = [
  'KYB for a business crypto account usually asks for company registry extracts, ownership chart, directors, and a description of expected payment activity.',
  'Timelines depend on document quality and jurisdiction. Incomplete beneficial-owner data is a common delay. Name an internal owner for each document pack.',
  'AML controls for invoice payments include counterparty screening, purpose-of-payment notes, and escalation when activity does not match the stated business profile.',
  'A control map should list who screens, who approves exceptions, and what evidence is retained. Controls without retention are hard to audit.',
  'Travel-rule and information-sharing obligations can apply depending on the institutions and corridors involved. Follow the rules that apply to your setup; this briefing is not legal advice.',
  'Cryptobus is operated in a regulated crypto-asset services context for business infrastructure. Editorial content does not invent approvals your firm has not obtained.',
  'Do not treat educational AML checklists as a solicitation to buy tokens, or as a promise that any payment will clear.',
  'Keep policy versions dated. When regulators or partners update forms, archive the previous pack with an as-of stamp.',
];

const OPS_FACTS = [
  'Accounting handoff for crypto settlements needs a standard evidence pack: invoice, approval trail, settlement proof, fees, and book rate if converted.',
  'Finance and ops should agree who posts the journal and who investigates exceptions. Ambiguous ownership creates duplicate posts or silent gaps.',
  'Roles and approvals for business crypto payments usually follow maker-checker design: preparer, reviewer, releaser. Combine roles only with a written exception.',
  'Access rights on wallets, exchanges, and desks should match HR status. Offboarding must revoke keys and API credentials the same day.',
  'Playbooks should name failure modes: wrong network, underpayment after fees, stuck pending trade, and supplier dispute. Each mode needs a first action and an owner.',
  'Training should use the firm’s own invoice templates and approval matrix, not generic retail trading tips.',
  'Cryp2bus Editorial publishes educational ops briefings. Outcomes still depend on your policies, counterparties, and applicable law.',
  'Open a Cryptobus business account only when your internal owners, KYB pack, and payment policy are ready — not as a substitute for those controls.',
];

const DEFAULT_FAQ = (topic: string): Array<{ question: string; answer: string }> => [
  {
    question: `What is ${topic}?`,
    answer: `${topic} is an educational business-crypto topic. Your invoices, policies, and payment partners remain the primary sources for any live settlement.`,
  },
  {
    question: 'Does this article promise returns or profits?',
    answer:
      'No. This briefing never promises returns or profits. Crypto used for settlement can change in fiat value, and operational failures can delay or reverse a payment.',
  },
  {
    question: 'Is this investment advice?',
    answer:
      'No. Cryp2bus Editorial content is educational only. It does not solicit token purchases as speculative positions and does not replace your own advisory relationships.',
  },
  {
    question: 'What is Cryptobus?',
    answer:
      'Cryptobus (Cryp2bus) provides crypto transaction infrastructure for businesses — exchange, invoice payments, and OTC-style settlement flows. It is not an investment advisory firm.',
  },
  {
    question: 'How do I get started with business crypto payments?',
    answer:
      'Open a Cryptobus business account to buy crypto, pay invoices, and settle cross-border.',
  },
  {
    question: 'Where should I verify facts for a live payment?',
    answer:
      'Use your signed invoices, internal policy, KYB/AML procedures, and primary statements from your banks or crypto-asset service providers as of the action date.',
  },
];

export const SAFE_TEMPLATES: SafeTemplate[] = [
  t(
    'usdt-invoice-checklist',
    'Invoice Settlement',
    'pay invoices with USDT',
    'How to pay business invoices with USDT: a settlement checklist',
    'Educational checklist for paying business invoices with USDT: beneficiary checks, networks, maker-checker, and accounting evidence — no return promises.',
    'business invoice payment desk laptop',
    [
      'What a USDT invoice settlement actually is',
      'Fields that must match the invoice',
      'Five checks before you release funds',
      'Evidence finance needs after payment',
      'Common failure modes on crypto rails',
      'Sources and limits of this briefing',
    ],
    INVOICE_FACTS,
    [
      'Confirm invoice number, amount, and supplier legal name.',
      'Verify wallet ownership and the correct network.',
      'Estimate fees so the received amount matches the invoice.',
      'Run maker-checker approval before release.',
      'Store tx hash or desk ticket with the invoice PDF.',
      'Hand the pack to accounting with an as-of timestamp.',
    ],
    ['Step', 'Owner', 'Evidence'],
    [
      ['Beneficiary check', 'Ops / AP', 'Signed invoice + wallet attestation'],
      ['Approval', 'Finance', 'Maker-checker log'],
      ['Settlement proof', 'Treasury', 'Tx hash or desk ticket'],
    ],
    DEFAULT_FAQ('pay invoices with USDT'),
  ),
  t(
    'corporate-treasury-controls',
    'Corporate Treasury',
    'corporate crypto treasury',
    'Corporate crypto treasury basics: wallets, conversion, controls',
    'How finance teams structure corporate crypto treasury: custody, conversion rules, OTC sizing, and dual control — educational, not investment advice.',
    'corporate treasury office screens',
    [
      'Treasury policy before tooling',
      'Custody, limits and dual control',
      'Five conversion-policy checks',
      'When OTC desks enter the picture',
      'Reconciliation and open items',
      'Sources and limits',
    ],
    TREASURY_FACTS,
    [
      'Write custody and spend-limit rules before funding wallets.',
      'Name conversion triggers and approvers in a dated policy.',
      'Separate retail trading habits from corporate settlement use.',
      'Keep desk quotes and tickets with treasury reconciliations.',
      'Reconcile balances on a fixed cadence.',
      'Escalate unexplained balances the same day they appear.',
    ],
    ['Control', 'Typical owner', 'Failure if missing'],
    [
      ['Dual control', 'Treasury + ops', 'Single-person drain risk'],
      ['Conversion policy', 'CFO / treasury', 'Ad-hoc speculative trades'],
      ['Daily reconcile', 'Controller', 'Silent balance drift'],
    ],
    DEFAULT_FAQ('corporate crypto treasury'),
  ),
  t(
    'cross-border-vs-wires',
    'Cross-border Payments',
    'cross-border crypto settlement',
    'Cross-border crypto settlement vs bank wires: cost, speed, ops',
    'A corridor-level comparison of cross-border crypto settlement and bank wires for ops and finance — educational, without guaranteed outcomes.',
    'global shipping containers logistics',
    [
      'What “settlement” means in each rail',
      'Cost, speed and cut-offs',
      'Five corridor checklist items',
      'FX and fee transparency',
      'Escalation when something fails',
      'Sources and limits',
    ],
    XBORDER_FACTS,
    [
      'Map invoice currency versus settlement asset for the corridor.',
      'Record expected timelines including compliance review.',
      'Compare all-in fees, not headline network fees alone.',
      'Define who owns exceptions when amounts differ after fees.',
      'Keep supplier confirmation alongside chain or desk proof.',
      'Review corridor facts when partners change forms or cut-offs.',
    ],
    ['Dimension', 'Bank wire', 'Crypto settlement'],
    [
      ['Typical speed', 'Banking days', 'Hours to days with screening'],
      ['Evidence', 'MT / statement', 'Hash / desk ticket + invoice'],
      ['Main ops risk', 'Intermediary delay', 'Wrong network / underpay'],
    ],
    DEFAULT_FAQ('cross-border crypto settlement'),
  ),
  t(
    'kyb-business-account',
    'Compliance',
    'KYB for business crypto accounts',
    'KYB for business crypto accounts: documents, timelines, owners',
    'Practical KYB mapping for business crypto accounts: documents, owners, timelines, and AML control adjacency — educational compliance briefing.',
    'compliance checklist documents office',
    [
      'What KYB usually requests',
      'Ownership and expected activity',
      'Five document-pack checks',
      'AML controls beside KYB',
      'Versioning when forms change',
      'Sources and limits',
    ],
    COMPLIANCE_FACTS,
    [
      'Assign an internal owner for registry and UBO documents.',
      'Describe expected invoice corridors in plain language.',
      'Screen counterparties before first payment where policy requires it.',
      'Retain screening and approval evidence with dates.',
      'Archive superseded KYB packs instead of overwriting them.',
      'Escalate mismatches between stated activity and live payments.',
    ],
    ['Document', 'Owner', 'Refresh trigger'],
    [
      ['Registry extract', 'Legal / ops', 'Annual or on change'],
      ['UBO chart', 'Compliance', 'Ownership change'],
      ['Activity profile', 'Finance', 'New corridor'],
    ],
    DEFAULT_FAQ('KYB for business crypto accounts'),
  ),
  t(
    'maker-checker-payments',
    'Ops Playbooks',
    'roles and approvals for crypto payments',
    'Roles and approvals for business crypto payments: maker-checker',
    'Maker-checker design for business crypto payments: roles, access revocation, failure playbooks, and accounting handoff — educational ops briefing.',
    'team approval workflow office meeting',
    [
      'Why maker-checker fits crypto rails',
      'Roles: prepare, review, release',
      'Five access and offboarding checks',
      'Failure modes and first actions',
      'Handoff to accounting',
      'Sources and limits',
    ],
    OPS_FACTS,
    [
      'Separate preparer and releaser accounts on every venue.',
      'Revoke access the same day employment or vendor status ends.',
      'Document wrong-network and underpayment playbooks.',
      'Require invoice ID on every approval comment.',
      'Ship a complete evidence pack to accounting after release.',
      'Train with your firm’s real approval matrix.',
    ],
    ['Role', 'Can prepare', 'Can release'],
    [
      ['AP analyst', 'Yes', 'No'],
      ['Treasury lead', 'Yes', 'Yes (with checker)'],
      ['Controller', 'Review only', 'Exception only'],
    ],
    DEFAULT_FAQ('roles and approvals for crypto payments'),
  ),
];
