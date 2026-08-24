import { Link } from 'react-router-dom';
import { useLeadModal } from '@/components/LeadModal';

const COLS = [
  {
    title: 'Products',
    links: [
      ['Exchange', '/exchange'],
      ['Markets', '/markets'],
      ['Invoice Payments', '/invoice-payments'],
      ['OTC', '/otc'],
      ['Pricing', '/pricing'],
    ],
  },
  {
    title: 'Company',
    links: [
      ['About', '/about'],
      ['Security', '/security'],
      ['How It Works', '/how-it-works'],
      ['FAQ', '/faq'],
    ],
  },
  {
    title: 'Legal',
    links: [
      ['Terms of Service', '/legal/terms'],
      ['Privacy Policy', '/legal/privacy'],
      ['AML Policy', '/legal/aml'],
      ['KYC/KYB Policy', '/legal/kyc'],
      ['Risk Disclosure', '/legal/risk'],
      ['Cookie Policy', '/legal/cookies'],
      ['Restricted Countries', '/legal/restricted'],
      ['Complaints', '/legal/complaints'],
    ],
  },
];

export default function SiteFooter() {
  const { openLeadModal } = useLeadModal();

  return (
    <footer className="border-t border-border bg-graphite/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-electric to-teal flex items-center justify-center">
                <span className="font-display font-bold text-sm text-graphite">C</span>
              </div>
              <span className="font-display text-lg font-bold">
                CRYPTO<span className="text-electric">BUS</span>
              </span>
            </div>
            <p className="text-sm text-foreground font-medium leading-relaxed">Crypto for Business.</p>
            <p className="text-sm text-muted-foreground mt-1">Pay an invoice. Get crypto.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Trust', 'Liquidity', 'Speed', 'Compliance'].map((t) => (
                <span
                  key={t}
                  className="text-[11px] px-2 py-1 rounded-full border border-border text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          {COLS.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map(([label, to]) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">
              Support
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  type="button"
                  onClick={() =>
                    openLeadModal({ source: 'footer-contact', title: 'Contact Cryptobus' })
                  }
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    openLeadModal({
                      source: 'footer-open-account',
                      title: 'Open Business Account',
                    })
                  }
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Open Account
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Cryptobus. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground max-w-2xl text-center sm:text-right">
            Cryptobus provides crypto transaction infrastructure for businesses. All corporate
            clients complete KYB. Availability depends on regulatory and compliance requirements.
          </p>
        </div>
      </div>
    </footer>
  );
}
