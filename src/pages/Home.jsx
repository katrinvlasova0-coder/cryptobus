import HeroSection from "@/components/landing/HeroSection";
import MarketTicker from "@/components/market/MarketTicker";
import LiveActivitySection from "@/components/landing/LiveActivitySection";
import LiquidityBoard from "@/components/market/LiquidityBoard";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import WhyEscrowXSection from "@/components/landing/WhyEscrowXSection";
import GlobalCoverageSection from "@/components/landing/GlobalCoverageSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CtaSection from "@/components/landing/CtaSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <MarketTicker />
      <LiveActivitySection />
      <section className="py-20 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="text-xs font-semibold uppercase tracking-wider text-electric mb-2">Markets</div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">Live Reference Rates</h2>
            <p className="mt-3 text-sm text-muted-foreground">Indicative liquidity for RFQ execution. Prices update automatically.</p>
          </div>
          <LiquidityBoard />
        </div>
      </section>
      <HowItWorksSection />
      <WhyEscrowXSection />
      <GlobalCoverageSection />
      <TestimonialsSection />
      <CtaSection />
    </>
  );
}