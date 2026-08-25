import PageHeader from "@/components/site/PageHeader";
import MarketTicker from "@/components/market/MarketTicker";
import LiquidityBoard from "@/components/market/LiquidityBoard";
import { useMarketData, formatPrice, formatChange } from "@/lib/useMarketData";

export default function Markets() {
  const { data, loading } = useMarketData(90000);
  const pairs = data?.pairs || [];
  const hasPairs = pairs.length > 0;

  return (
    <>
      <PageHeader eyebrow="Markets" title="Live Markets" subtitle="Reference rates sourced from market data feeds when available. Indicative for RFQ execution." />
      <MarketTicker />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <LiquidityBoard />
        <div className="glass rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border"><h3 className="font-display text-lg font-semibold">All Pairs</h3></div>
          {loading && !data ? (
            <div className="p-10 text-center text-sm text-muted-foreground">Loading…</div>
          ) : hasPairs ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                  <th className="px-5 py-3 font-medium">Pair</th><th className="px-5 py-3 font-medium text-right">Price</th><th className="px-5 py-3 font-medium text-right">24h Change</th>
                </tr></thead>
                <tbody>
                  {pairs.map((p) => (
                    <tr key={p.pair} className="border-b border-border/50 hover:bg-secondary/30">
                      <td className="px-5 py-3 font-mono font-medium">{p.pair}</td>
                      <td className="px-5 py-3 font-mono text-right">{formatPrice(p.price)}</td>
                      <td className={`px-5 py-3 font-mono text-right ${p.change_24h >= 0 ? "text-success" : "text-destructive"}`}>{formatChange(p.change_24h)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-10 text-center text-sm text-muted-foreground">Market data temporarily unavailable.</div>
          )}
        </div>
      </div>
    </>
  );
}