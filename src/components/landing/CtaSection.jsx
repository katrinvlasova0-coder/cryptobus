import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useLeadModal } from '@/components/LeadModal';

export default function CtaSection() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-20 border-t border-border">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative glass rounded-3xl p-10 sm:p-14 text-center overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
          <div className="relative">
            <h2 className="font-display text-3xl sm:text-4xl font-bold">
              One platform. <span className="text-gradient">0.5% per transaction.</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
              Simple pricing. No hidden fees. Open your Cryptobus business account and start
              executing corporate crypto transactions.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <Button
                size="lg"
                className="bg-electric hover:bg-electric/90 text-graphite font-semibold glow-electric"
                onClick={() =>
                  openLeadModal({ source: 'cta-open-account', title: 'Open Business Account' })
                }
              >
                Open Business Account <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
              <Link to="/pricing">
                <Button size="lg" variant="outline">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
