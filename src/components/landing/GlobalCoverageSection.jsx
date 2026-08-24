import { useState } from "react";

const REGIONS = [
  {
    name: "Europe",
    countries: [
      ["Germany", "supported"], ["France", "supported"], ["Netherlands", "supported"], ["Switzerland", "supported"], ["Spain", "supported"], ["Italy", "supported"], ["Belgium", "supported"], ["Austria", "supported"], ["Portugal", "supported"], ["Ireland", "supported"], ["Luxembourg", "supported"], ["Sweden", "supported"], ["Denmark", "supported"], ["Norway", "supported"], ["Finland", "supported"], ["Iceland", "supported"], ["Poland", "supported"], ["Czech Republic", "supported"], ["Hungary", "supported"], ["Slovakia", "supported"], ["Romania", "supported"], ["Bulgaria", "supported"], ["Croatia", "supported"], ["Slovenia", "supported"], ["Estonia", "supported"], ["Latvia", "supported"], ["Lithuania", "supported"], ["Greece", "supported"], ["Malta", "supported"], ["Cyprus", "supported"], ["Liechtenstein", "supported"], ["Monaco", "supported"]
    ]
  },
  { name: "United Kingdom", countries: [["United Kingdom", "supported"], ["Gibraltar", "supported"], ["Isle of Man", "supported"], ["Jersey", "supported"], ["Guernsey", "supported"]] },
  { name: "Middle East", countries: [["UAE", "supported"], ["Saudi Arabia", "supported"], ["Qatar", "supported"], ["Kuwait", "supported"], ["Bahrain", "supported"], ["Oman", "supported"]] },
  {
    name: "Asia-Pacific",
    countries: [
      ["China", "supported"], ["Hong Kong", "supported"], ["Singapore", "supported"], ["Japan", "supported"], ["South Korea", "supported"], ["Taiwan", "supported"], ["India", "supported"], ["Indonesia", "supported"], ["Malaysia", "supported"], ["Thailand", "supported"], ["Vietnam", "supported"], ["Philippines", "supported"], ["Australia", "coming_soon"], ["New Zealand", "coming_soon"]
    ]
  },
  { name: "North America", countries: [["United States", "supported"], ["Canada", "supported"], ["Mexico", "supported"]] },
  { name: "Latin America", countries: [["Brazil", "supported"], ["Argentina", "supported"], ["Chile", "supported"], ["Colombia", "supported"], ["Peru", "supported"], ["Uruguay", "supported"], ["Ecuador", "supported"], ["Panama", "supported"], ["Costa Rica", "supported"], ["Dominican Republic", "supported"], ["Guatemala", "supported"], ["El Salvador", "supported"], ["Honduras", "supported"], ["Paraguay", "supported"], ["Bolivia", "supported"], ["Venezuela", "supported"]] }
];

const STATUS_STYLE = {
  supported: "text-success border-success/30 bg-success/10",
  restricted: "text-destructive border-destructive/30 bg-destructive/10",
  coming_soon: "text-muted-foreground border-border bg-secondary"
};

export default function GlobalCoverageSection() {
  const [active, setActive] = useState("Europe");
  const region = REGIONS.find((r) => r.name === active);

  return (
    <section className="py-20 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-electric mb-2">Global Coverage</div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold">Business Without Borders</h2>
          <p className="mt-4 text-sm text-muted-foreground">Availability depends on regulatory and compliance requirements.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {REGIONS.map((r) => (
            <button key={r.name} onClick={() => setActive(r.name)}
              className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors ${active === r.name ? "bg-electric text-graphite border-electric" : "border-border text-muted-foreground hover:text-foreground"}`}>
              {r.name}
            </button>
          ))}
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {region.countries.map(([name, status]) => (
              <div key={name} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50">
                <span className="text-sm font-medium">{name}</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full border ${STATUS_STYLE[status]}`}>{status.replace("_", " ")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}