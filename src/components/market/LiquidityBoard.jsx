import { useMemo, useState } from "react";
import { useMarketData, formatPrice, formatChange } from "@/lib/useMarketData";

const PAIRS = ["BTC/USD", "ETH/USD", "SOL/USD", "XRP/USD", "USDT/USD"];

export default function LiquidityBoard() {
  const { data } = useMarketData(60000);
  const [active, setActive] = useState("BTC/USD");

  const pairs = data?.pairs || [];
  const isLive = data?.status === "live" && pairs.length > 0;

  const current = useMemo(() => pairs.find((p) => p.pair === active), [pairs, active]);
  const mid = current?.price ?? null;

  // Indicative depth ladder derived from mid price (RFQ execution model)
  const ladder = useMemo(() => {
    if (!mid) return { asks: [], bids: [] };
    const spreadBps = 12;
    const step = mid * (spreadBps / 10000);
    const asks = Array.from({ length: 6 }, (_, i) => {
      const price = mid + step * (i + 1);
      const amount = (Math.random() * 0.8 + 0.2) * (1 / (i + 1));
      return { price, amount: Number(amount.toFixed(4)), total: price * amount };
    });
    const bids = Array.from({ length: 6 }, (_, i) => {
      const price = mid - step * (i + 1);
      const amount = (Math.random() * 0.8 + 0.2) * (1 / (i + 1));
      return { price, amount: Number(amount.toFixed(4)), total: price * amount };
    });
    return { asks, bids };
  }, [mid]);

  const maxTotal = Math.max(...ladder.asks.map((a) => a.total), ...ladder.bids.map((b) => b.total), 1);

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Live RFQ / Liquidity Board</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Indicative</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {PAIRS.map((p) => (
            <button key={p} onClick={() => setActive(p)}
              className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors ${active === p ? "bg-electric text-graphite font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {!isLive || !current ? (
        <div className="p-12 text-center text-sm text-muted-foreground">
          Market data temporarily unavailable. Reference rates will display here when the feed is restored.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-px bg-border">
          <div className="bg-card">
            <div className="grid grid-cols-3 px-4 py-2 text-[11px] uppercase tracking-wider text-muted-foreground">
              <span>Price ({current.quote})</span>
              <span className="text-right">Amount</span>
              <span className="text-right">Total</span>
            </div>
            {ladder.asks.slice().reverse().map((a, i) => (
              <div key={i} className="relative grid grid-cols-3 px-4 py-1.5 text-xs font-mono">
                <div className="absolute right-0 top-0 bottom-0 bg-destructive/10" style={{ width: `${(a.total / maxTotal) * 100}%` }} />
                <span className="relative text-destructive">{formatPrice(a.price)}</span>
                <span className="relative text-right text-muted-foreground">{a.amount}</span>
                <span className="relative text-right text-muted-foreground">{formatPrice(a.total)}</span>
              </div>
            ))}
          </div>
          <div className="bg-card">
            <div className="px-4 py-3 border-y border-border flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Reference rate</div>
                <div className="font-mono text-lg font-semibold">{formatPrice(mid)}</div>
              </div>
              <div className="text-right">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">24h</div>
                <div className={`font-mono text-sm font-medium ${current.change_24h >= 0 ? "text-success" : "text-destructive"}`}>
                  {formatChange(current.change_24h)}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 px-4 py-2 text-[11px] uppercase tracking-wider text-muted-foreground">
              <span>Price ({current.quote})</span>
              <span className="text-right">Amount</span>
              <span className="text-right">Total</span>
            </div>
            {ladder.bids.map((b, i) => (
              <div key={i} className="relative grid grid-cols-3 px-4 py-1.5 text-xs font-mono">
                <div className="absolute right-0 top-0 bottom-0 bg-success/10" style={{ width: `${(b.total / maxTotal) * 100}%` }} />
                <span className="relative text-success">{formatPrice(b.price)}</span>
                <span className="relative text-right text-muted-foreground">{b.amount}</span>
                <span className="relative text-right text-muted-foreground">{formatPrice(b.total)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isLive && current && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-border border-t border-border text-center">
          <div className="bg-card px-4 py-3"><div className="text-[11px] uppercase tracking-wider text-muted-foreground">Indicative Spread</div><div className="font-mono text-sm">~12 bps</div></div>
          <div className="bg-card px-4 py-3"><div className="text-[11px] uppercase tracking-wider text-muted-foreground">Pair</div><div className="font-mono text-sm">{current.pair}</div></div>
          <div className="bg-card px-4 py-3 col-span-2 sm:col-span-1"><div className="text-[11px] uppercase tracking-wider text-muted-foreground">Execution</div><div className="font-mono text-sm">RFQ / OTC</div></div>
        </div>
      )}
    </div>
  );
}