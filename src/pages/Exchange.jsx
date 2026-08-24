import { Button } from '@/components/ui/button';
import PageHeader from '@/components/site/PageHeader';
import LiquidityBoard from '@/components/market/LiquidityBoard';
import { ArrowRight } from 'lucide-react';
import { useLeadModal } from '@/components/LeadModal';

export default function Exchange() {
  const { openLeadModal } = useLeadModal();

  return (
    <>
      <PageHeader
        eyebrow="Exchange"
        title="Buy Crypto for Your Business"
        subtitle="Request a live quote. Receive crypto to your approved wallet. One corporate account, major digital assets."
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <LiquidityBoard />
        <div className="glass rounded-2xl p-8 text-center">
          <h2 className="font-display text-2xl font-bold mb-3">Ready to execute?</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Open a business account, complete KYB, and request your first live quote.
          </p>
          <Button
            size="lg"
            className="bg-electric text-graphite font-semibold"
            onClick={() =>
              openLeadModal({ source: 'exchange-open-account', title: 'Open Business Account' })
            }
          >
            Open Business Account <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </>
  );
}
