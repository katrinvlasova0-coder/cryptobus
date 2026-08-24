import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import HeroCalculator from '@/components/landing/HeroCalculator';
import { useLeadModal } from '@/components/LeadModal';

export default function HeroSection() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card/60 text-xs text-muted-foreground mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-live" />
              Cryptobus — Crypto for Business
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
              PAY AN INVOICE.
              <br />
              <span className="text-gradient">GET CRYPTO.</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-lg">
              Buy crypto. Pay invoices. Settle globally. One platform — built for businesses that
              need corporate crypto infrastructure, not another retail trading app.
            </p>
            <p className="mt-3 text-sm text-muted-foreground/80 max-w-lg">
              Cryptobus provides businesses with a simple way to execute corporate crypto
              transactions and international settlements through a secure B2B infrastructure.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="bg-electric hover:bg-electric/90 text-graphite font-semibold glow-electric"
                onClick={() =>
                  openLeadModal({ source: 'hero-open-account', title: 'Open Business Account' })
                }
              >
                Open Business Account
              </Button>
              <Link to="/how-it-works">
                <Button size="lg" variant="outline">
                  How It Works
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="font-mono text-foreground font-semibold">0.5%</span> transaction fee
              <span className="text-border">·</span>
              <span>KYB verified businesses</span>
              <span className="text-border">·</span>
              <span>Global settlement infrastructure</span>
            </div>
          </div>
          <div
            className="animate-fade-up flex justify-center lg:justify-end"
            style={{ animationDelay: '0.1s' }}
          >
            <HeroCalculator />
          </div>
        </div>
      </div>
    </section>
  );
}
