import { Button } from '@/components/ui/button';
import BrandLogo from '@/components/site/BrandLogo';
import { useLeadModal } from '@/components/LeadModal';

const PHOTO =
  'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1400&h=900&q=80&auto=format&fit=crop';

export default function ArticleConsultBanner() {
  const { openLeadModal } = useLeadModal();

  return (
    <aside className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 my-16">
      <div className="grid lg:grid-cols-2 min-h-[280px] border-y border-border">
        <div className="relative min-h-[200px] lg:min-h-[320px]">
          <img src={PHOTO} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-graphite/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-graphite/50" />
        </div>
        <div className="relative flex flex-col justify-center px-6 py-12 lg:px-14 bg-graphite">
          <BrandLogo className="mb-8" markClassName="h-10 w-10" />
          <p className="text-xs font-semibold uppercase tracking-wider text-electric mb-3">
            For business teams
          </p>
          <p className="font-display text-3xl sm:text-4xl font-semibold text-foreground leading-tight mb-4 max-w-lg">
            Pay invoices. Settle in crypto.
          </p>
          <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-md">
            Open a business account to buy crypto, pay suppliers, and settle cross-border
            invoices on Cryptobus.
          </p>
          <Button
            className="w-fit bg-electric hover:bg-electric/90 text-graphite font-semibold"
            onClick={() =>
              openLeadModal({
                source: 'blog-mid-cta',
                title: 'Open Business Account',
              })
            }
          >
            Open Business Account
          </Button>
        </div>
      </div>
    </aside>
  );
}
