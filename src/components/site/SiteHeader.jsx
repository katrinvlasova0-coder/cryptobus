import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLeadModal } from '@/components/LeadModal';

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
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-electric to-teal flex items-center justify-center">
              <div className="absolute inset-0.5 rounded-md bg-graphite flex items-center justify-center">
                <span className="font-display font-bold text-sm text-electric">C</span>
              </div>
            </div>
            <span className="font-display text-lg font-bold tracking-tight">
              CRYPTO<span className="text-electric">BUS</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={`px-3 py-2 text-[13px] font-medium rounded-md transition-colors ${
                  pathname === n.to
                    ? 'text-foreground bg-secondary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
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
              Open Business Account
            </Button>
          </div>

          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-card/95 backdrop-blur-xl">
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
            <div className="pt-3 flex flex-col gap-2 border-t border-border mt-3">
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
