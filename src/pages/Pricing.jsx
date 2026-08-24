import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/site/PageHeader';
import { ArrowRight } from 'lucide-react';
import { useLeadModal } from '@/components/LeadModal';

export default function Pricing() {
  const { openLeadModal } = useLeadModal();

  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="Simple B2B Pricing"
        subtitle="One transparent fee. No complicated pricing tiers. No hidden transaction fees."
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-10" />
            <div className="relative">
              <div className="text-xs font-semibold uppercase tracking-wider text-electric mb-3">
                Transaction Fee
              </div>
              <div className="font-display text-7xl font-bold">
                0.5<span className="text-3xl text-muted-foreground">%</span>
              </div>
              <p className="mt-4 text-muted-foreground">
                Per transaction. No setup fees. No hidden costs.
              </p>
              <p className="mt-2 text-sm text-muted-foreground/80">
                One of the most competitive B2B crypto transaction fees — just 0.5%.
              </p>
              <Button
                size="lg"
                className="mt-8 bg-electric text-graphite font-semibold"
                onClick={() =>
                  openLeadModal({ source: 'pricing-open-account', title: 'Open Business Account' })
                }
              >
                Open Business Account <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
          <div className="glass rounded-2xl p-10 flex flex-col justify-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-teal mb-3">
              OTC Desk
            </div>
            <h3 className="font-display text-2xl font-bold mb-3">
              Need to execute a large transaction?
            </h3>
            <p className="text-muted-foreground mb-6">
              For large corporate OTC deals, our desk provides tailored quotes and settlement.
            </p>
            <Link to="/otc">
              <Button size="lg" variant="outline">
                Contact OTC Desk <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
