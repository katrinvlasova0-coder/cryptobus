import { Percent, Building2, Globe2, Coins, ShieldCheck, Headset } from "lucide-react";

const CARDS = [
  { icon: Percent, title: "0.5% Transaction Fee", desc: "Transparent B2B pricing. No hidden transaction fees." },
  { icon: Building2, title: "Business First", desc: "Infrastructure designed specifically for corporate clients." },
  { icon: Globe2, title: "Global Settlement", desc: "Infrastructure for cross-border business transactions." },
  { icon: Coins, title: "Crypto Liquidity", desc: "Access major digital assets through one business account." },
  { icon: ShieldCheck, title: "Secure Transactions", desc: "KYB, AML screening, transaction monitoring and approved settlement instructions." },
  { icon: Headset, title: "Human Support", desc: "Dedicated support for corporate transactions." }
];

export default function WhyCryptobusSection() {
  return (
    <section className="py-20 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-semibold uppercase tracking-wider text-electric mb-2">Why Cryptobus</div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold">Built for Corporate Crypto</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CARDS.map((c) => (
            <div key={c.title} className="group glass rounded-2xl p-6 hover:border-electric/40 transition-colors">
              <div className="h-11 w-11 rounded-xl bg-electric/10 border border-electric/20 flex items-center justify-center mb-4 group-hover:bg-electric/20 transition-colors">
                <c.icon className="h-5 w-5 text-electric" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{c.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}