import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { formatCompactUsd } from "@/lib/liveStats";
import { useLiveStats } from "@/lib/useLiveStats";

export default function LiveActivitySection() {
  const stats = useLiveStats(4000);
  const volume = formatCompactUsd(stats.volume24h);

  const cards = [
    { label: "24H Volume", ...volume },
    { label: "Transactions Today", value: stats.transactionsToday, prefix: "", suffix: "", decimals: 0 },
    { label: "Active Orders", value: stats.activeOrders, prefix: "", suffix: "", decimals: 0 },
    { label: "Business Clients", value: stats.businessClients, prefix: "", suffix: "", decimals: 0 },
    { label: "Markets", value: stats.markets, prefix: "", suffix: "", decimals: 0 },
    { label: "Countries Covered", value: stats.countriesCovered, prefix: "", suffix: "+", decimals: 0 },
  ];

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-10">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-electric mb-2">Cryptobus Live</div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">Platform Activity</h2>
          </div>
          <span className="inline-flex items-center gap-2 text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
            </span>
            Updating live
          </span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-px bg-border rounded-2xl overflow-hidden glass">
          {cards.map((s) => (
            <div key={s.label} className="bg-card/80 p-5">
              <div className="text-xs text-muted-foreground mb-2">{s.label}</div>
              <AnimatedCounter
                value={s.value}
                prefix={s.prefix}
                suffix={s.suffix}
                decimals={s.decimals}
                duration={900}
                className="font-display text-2xl font-bold"
              />
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Activity figures update throughout the day. Market rates on Markets are pulled from live public price feeds.
        </p>
      </div>
    </section>
  );
}
