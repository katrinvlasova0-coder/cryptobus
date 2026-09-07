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
    'usdc-vs-usdt-supplier',
    'Invoice Settlement',
    'USDC vs USDT business payments',
    'USDC vs USDT for supplier payments: what finance teams compare',
    'A practical comparison of USDC and USDT for B2B supplier payments: networks, ops friction, and evidence — educational, not investment advice.',
    'finance team comparing documents office',
    [
      'What finance actually compares',
      'Network and acceptance realities',
      'Five checks before choosing an asset',
      'Accounting and reconciliation notes',
      'When to keep both options available',
      'Sources and limits of this briefing',
    ],
    INVOICE_FACTS,
    [
      'List which suppliers accept which asset and network.',
      'Compare all-in fees for your typical invoice sizes.',
      'Confirm treasury can fund either rail on payday.',
      'Align AP memo fields for both assets.',
      'Document who approves asset switches mid-run.',
      'Revisit the choice when a major supplier changes terms.',
    ],
    ['Factor', 'USDC lens', 'USDT lens'],
    [
      ['Supplier acceptance', 'Named network list', 'Named network list'],
      ['Ops friction', 'Wallet + memo discipline', 'Wallet + memo discipline'],
      ['Evidence', 'Hash + invoice pack', 'Hash + invoice pack'],
    ],
    DEFAULT_FAQ('USDC vs USDT business payments'),
  ),
  t(
    'otc-desk-business',
    'Corporate Treasury',
    'OTC crypto for business',
    'When businesses use OTC crypto desks instead of public exchanges',
    'When corporate treasury routes size through an OTC desk versus public exchange execution — educational sizing and control notes, not investment advice.',
    'trading desk monitors professional',
    [
      'What “OTC for business” usually means',
      'Size, timing and discretion trade-offs',
      'Five readiness checks before a desk ticket',
      'Evidence treasury and accounting need',
      'Failure modes and escalations',
      'Sources and limits',
    ],
    TREASURY_FACTS,
    [
      'Define minimum size that routes to a desk.',
      'Capture quote validity windows in the payable SLA.',
      'Keep dual control on who can accept a desk quote.',
      'Store tickets with invoice IDs.',
      'Reconcile desk fills the same day.',
      'Do not treat desk access as a trading mandate.',
    ],
    ['Situation', 'Often exchange', 'Often OTC desk'],
    [
      ['Small top-ups', 'Yes', 'Rarely'],
      ['Large payable blocks', 'May move market', 'Common'],
      ['Evidence pack', 'Exchange fills', 'Desk ticket + fill'],
    ],
    DEFAULT_FAQ('OTC crypto for business'),
  ),
  t(
    'multi-currency-crypto-invoices',
    'Cross-border Payments',
    'multi-currency crypto invoices',
    'Multi-currency invoice settlement with crypto: a corridor checklist',
    'Corridor checklist for multi-currency B2B invoices settled in crypto: FX notes, asset choice, and ops evidence — educational only.',
    'world map business meeting',
    [
      'Invoice currency versus settlement asset',
      'Corridor facts that change the playbook',
      'Five checklist items before go-live',
      'FX notes controllers expect',
      'Exception handling across currencies',
      'Sources and limits',
    ],
    XBORDER_FACTS,
    [
      'Write the invoice currency of record explicitly.',
      'Map settlement asset and network per corridor.',
      'Decide who owns FX difference explanations.',
      'Align supplier acknowledgments with received amounts.',
      'Keep a dated corridor matrix for AP.',
      'Review the matrix when banking partners change cut-offs.',
    ],
    ['Item', 'Owner', 'Evidence'],
    [
      ['Currency of record', 'AP', 'Invoice PDF'],
      ['Settlement asset', 'Treasury', 'Payable policy'],
      ['FX note', 'Controller', 'Conversion ticket'],
    ],
    DEFAULT_FAQ('multi-currency crypto invoices'),
  ),
  t(
    'aml-invoice-controls',
    'Compliance',
    'AML crypto invoice payments',
    'AML controls for crypto invoice payments: a practical control map',
    'A practical AML control map for crypto invoice payments: screening, monitoring, escalation, and evidence — educational compliance briefing.',
    'security compliance audit meeting',
    [
      'Where AML sits in a crypto payable',
      'Screening versus monitoring',
      'Five control-map checks',
      'Escalation and freeze playbooks',
      'Evidence auditors ask for',
      'Sources and limits',
    ],
    COMPLIANCE_FACTS,
    [
      'Name the owner of sanctions and counterparty screening.',
      'Define when a payable must pause for review.',
      'Keep screening results with invoice IDs.',
      'Separate marketing claims from control procedures.',
      'Train ops on escalation contacts.',
      'Retest the map after corridor expansion.',
    ],
    ['Control', 'Owner', 'Trigger'],
    [
      ['Counterparty screen', 'Compliance', 'New vendor / change'],
      ['Payment monitoring', 'Ops / compliance', 'Unusual size or corridor'],
      ['Escalation log', 'Compliance', 'Alert or dispute'],
    ],
    DEFAULT_FAQ('AML crypto invoice payments'),
  ),
  t(
    'maker-checker-payments',
    'Ops Playbooks',
    'crypto payment approval workflow',
    'Roles and approvals for business crypto payments: maker-checker design',
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
    DEFAULT_FAQ('crypto payment approval workflow'),
  ),
];
