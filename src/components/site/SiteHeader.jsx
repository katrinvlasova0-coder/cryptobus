import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLeadModal } from '@/components/LeadModal';
import BrandLogo from '@/components/site/BrandLogo';

const NAV = [
  { label: 'Exchange', to: '/exchange' },
  { label: 'Invoice Payments', to: '/invoice-payments' },
  { label: 'OTC', to: '/otc' },
  { label: 'Markets', to: '/markets' },
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Security', to: '/security' },
  { label: 'About', to: '/about' },
  { label: 'FAQ', to: '/faq' },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { openLeadModal } = useLeadModal();

  const openAccount = () => {
    openLeadModal({ source: 'header-open-account', title: 'Open Business Account' });
    setOpen(false);
  };

  const contact = () => {
    openLeadModal({ source: 'header-contact', title: 'Contact Cryptobus' });
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 glass-strong border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-3">
          <BrandLogo markClassName="h-8 w-8 sm:h-9 sm:w-9" />

          <nav className="hidden xl:flex items-center gap-0.5">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={`px-2.5 py-2 text-[13px] font-medium rounded-md transition-colors whitespace-nowrap ${
                  pathname === n.to
                    ? 'text-foreground bg-secondary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              onClick={contact}
            >
              Contact
            </Button>
            <Button
              size="sm"
              className="bg-electric hover:bg-electric/90 text-graphite font-semibold glow-electric"
              onClick={openAccount}
            >
              <span className="hidden lg:inline">Open Business Account</span>
              <span className="lg:hidden">Open Account</span>
            </Button>
            <button
              className="xl:hidden p-2 text-foreground"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          <button
            className="md:hidden p-2 text-foreground -mr-1"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="xl:hidden border-t border-border bg-card/95 backdrop-blur-xl max-h-[calc(100dvh-3.5rem)] overflow-y-auto">
          <div className="px-4 py-4 space-y-1">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary"
              >
                {n.label}
              </Link>
            ))}
            <div className="pt-3 flex flex-col gap-2 border-t border-border mt-3 md:hidden">
              <Button variant="outline" className="w-full" onClick={contact}>
                Contact
              </Button>
              <Button className="w-full bg-electric text-graphite font-semibold" onClick={openAccount}>
                Open Business Account
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
