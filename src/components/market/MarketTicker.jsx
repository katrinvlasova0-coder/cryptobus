import { useMarketData, formatPrice, formatChange } from "@/lib/useMarketData";

function timeUtc(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" }) + " UTC";
}

export default function MarketTicker() {
  const { data, loading } = useMarketData(60000);
  const pairs = data?.pairs || [];
  const isLive = data?.status === "live" && pairs.length > 0;

  const items = isLive ? pairs : [];

  return (
    <div className="border-y border-border bg-card/40 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center gap-4 h-12">
        <div className="flex items-center gap-2 shrink-0 pr-4 border-r border-border">
          <span className="relative flex h-2 w-2">
            <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${isLive ? "animate-ping bg-success" : "bg-muted-foreground"}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isLive ? "bg-success" : "bg-muted-foreground"}`}></span>
          </span>
          <span className="text-xs font-semibold tracking-wider">{isLive ? "LIVE" : "OFFLINE"}</span>
        </div>

        <div className="flex-1 overflow-hidden relative">
          {loading && !data ? (
            <div className="text-xs text-muted-foreground">Loading market data…</div>
          ) : isLive ? (
            <div className="flex gap-8 marquee-track whitespace-nowrap">
              {[...items, ...items].map((p, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="font-mono font-medium text-foreground">{p.pair}</span>
                  <span className="font-mono text-muted-foreground">{formatPrice(p.price)}</span>
                  <span className={`font-mono text-xs ${p.change_24h >= 0 ? "text-success" : "text-destructive"}`}>
                    {formatChange(p.change_24h)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-muted-foreground">Market data temporarily unavailable</div>
          )}
        </div>

        <div className="hidden md:block shrink-0 pl-4 border-l border-border text-xs text-muted-foreground font-mono">
          Last updated: {timeUtc(data?.updated_at)}
        </div>
      </div>
    </div>
  );
}