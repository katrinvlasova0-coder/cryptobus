import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calculator, FileText, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMarketData, formatPrice } from "@/lib/useMarketData";

const FIAT = ["EUR", "USD", "GBP", "CHF"];
const CRYPTO = ["BTC", "ETH", "USDT", "USDC"];

export default function HeroCalculator() {
  const { data } = useMarketData(60000);
  const [mode, setMode] = useState("crypto");
  const [payCurrency, setPayCurrency] = useState("EUR");
  const [asset, setAsset] = useState("BTC");
  const [payAmount, setPayAmount] = useState(50000);

  const pairs = data?.pairs || [];
  const isLive = data?.status === "live";

  const rate = useMemo(() => {
    const direct = pairs.find((p) => p.pair === `${asset}/${payCurrency}`);
    if (direct) return { value: direct.price, note: `Live ${asset}/${payCurrency}` };
    const usd = pairs.find((p) => p.pair === `${asset}/USD`);
    if (usd) return { value: usd.price, note: `Indicative · USD reference` };
    return null;
  }, [pairs, asset, payCurrency]);

  const feeRate = 0.005;
  const received = rate ? (payAmount * (1 - feeRate)) / rate.value : null;

  return (
    <div className="glass rounded-2xl p-5 sm:p-6 w-full max-w-md">
      <div className="grid grid-cols-2 gap-2 p-1 bg-secondary/60 rounded-xl mb-5">
        <button onClick={() => setMode("crypto")}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${mode === "crypto" ? "bg-electric text-graphite" : "text-muted-foreground"}`}>
          <Calculator className="h-4 w-4" /> I Need Crypto
        </button>
        <button onClick={() => setMode("invoice")}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${mode === "invoice" ? "bg-electric text-graphite" : "text-muted-foreground"}`}>
          <FileText className="h-4 w-4" /> I Need to Pay an Invoice
        </button>
      </div>

      {mode === "crypto" ? (
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">You Pay</label>
            <div className="flex gap-2">
              <input type="number" value={payAmount} onChange={(e) => setPayAmount(Number(e.target.value))}
                className="flex-1 bg-background border border-border rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-electric" />
              <select value={payCurrency} onChange={(e) => setPayCurrency(e.target.value)}
                className="bg-background border border-border rounded-lg px-3 py-2.5 text-sm font-medium focus:outline-none">
                {FIAT.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">You Receive</label>
            <select value={asset} onChange={(e) => setAsset(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm font-medium focus:outline-none">
              {CRYPTO.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-2 pt-2 border-t border-border">
            <Row label="Exchange Rate" value={rate ? `${formatPrice(rate.value)} ${payCurrency}` : "—"} note={rate?.note} />
            <Row label="Cryptobus Fee" value="0.5%" />
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm text-muted-foreground">Estimated Received</span>
              <span className="font-mono text-lg font-semibold text-electric">{received != null ? `${received.toFixed(6)} ${asset}` : "—"}</span>
            </div>
          </div>
          <Link to="/exchange"><Button className="w-full bg-electric hover:bg-electric/90 text-graphite font-semibold">Get a Quote <ArrowRight className="h-4 w-4 ml-1" /></Button></Link>
        </div>
      ) : (
        <div className="space-y-4">
          <Field label="Invoice Amount"><input type="number" placeholder="0.00" className="flex-1 bg-background border border-border rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-electric" /></Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Invoice Currency"><select className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none">{FIAT.map((c) => <option key={c}>{c}</option>)}</select></Field>
            <Field label="Beneficiary Country"><input className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none" placeholder="Germany" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Payment Currency"><select className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none">{["EUR", "USD", "GBP", "CHF", "USDT", "USDC"].map((c) => <option key={c}>{c}</option>)}</select></Field>
            <Field label="Settlement Method"><select className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none"><option>Bank Transfer (SEPA/SWIFT)</option><option>Crypto Settlement</option><option>Hybrid</option></select></Field>
          </div>
          <Link to="/invoice-payments"><Button className="w-full bg-electric hover:bg-electric/90 text-graphite font-semibold">Pay an Invoice <ArrowRight className="h-4 w-4 ml-1" /></Button></Link>
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 text-success" />
        {isLive ? "Live reference rates · indicative quote" : "Market data temporarily unavailable"}
      </div>
    </div>
  );
}

function Row({ label, value, note }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <span className="text-sm text-muted-foreground">{label}</span>
        {note && <span className="block text-[10px] text-muted-foreground/70">{note}</span>}
      </div>
      <span className="font-mono text-sm">{value}</span>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}