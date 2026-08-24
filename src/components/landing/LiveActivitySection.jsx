import AnimatedCounter from "@/components/ui/AnimatedCounter";

const STATS = [
  { label: "24H Volume", value: 0, prefix: "$", suffix: "", decimals: 0, demo: true },
  { label: "Transactions Today", value: 0, prefix: "", suffix: "", decimals: 0, demo: true },
  { label: "Active Orders", value: 0, prefix: "", suffix: "", decimals: 0, demo: true },
  { label: "Business Clients", value: 0, prefix: "", suffix: "", decimals: 0, demo: true },
  { label: "Markets", value: 8, prefix: "", suffix: "", decimals: 0, demo: true },
  { label: "Countries Covered", value: 0, prefix: "", suffix: "+", decimals: 0, demo: true }
];

export default function LiveActivitySection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-10">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-electric mb-2">Cryptobus Live</div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">Platform Activity</h2>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground">Indicative · marketing preview</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-px bg-border rounded-2xl overflow-hidden glass">
          {STATS.map((s) => (
            <div key={s.label} className="bg-card/80 p-5">
              <div className="text-xs text-muted-foreground mb-2">{s.label}</div>
              <AnimatedCounter value={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals} className="font-display text-2xl font-bold" />
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Figures shown are illustrative placeholders for the marketing site. Live production metrics will appear once operations data is connected.
        </p>
      </div>
    </section>
  );
}