import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, FileCheck2, Wallet, ShieldCheck, Banknote, FileDown } from "lucide-react";

const BUY_STEPS = [
  { icon: Banknote, text: "Open your Cryptobus Business Account" },
  { icon: ShieldCheck, text: "Complete KYB verification" },
  { icon: Wallet, text: "Select currency and crypto asset" },
  { icon: FileCheck2, text: "Receive a live quote" },
  { icon: Banknote, text: "Transfer funds" },
  { icon: Wallet, text: "Receive crypto to your approved wallet" }
];

const INVOICE_STEPS = [
  { icon: Upload, text: "Upload your commercial invoice" },
  { icon: FileCheck2, text: "Enter beneficiary information" },
  { icon: Wallet, text: "Select settlement method" },
  { icon: ShieldCheck, text: "Cryptobus performs compliance checks" },
  { icon: Banknote, text: "Fund the transaction" },
  { icon: FileCheck2, text: "Cryptobus executes the approved settlement" },
  { icon: FileDown, text: "Download transaction confirmation" }
];

export default function HowItWorksSection() {
  return (
    <section className="py-20 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-semibold uppercase tracking-wider text-electric mb-2">How It Works</div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold">Corporate Crypto Without the Complexity</h2>
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <FlowCard title="Buy Crypto" steps={BUY_STEPS} cta="Buy Crypto" to="/exchange" accent="electric" />
          <FlowCard title="Pay an Invoice" steps={INVOICE_STEPS} cta="Pay an Invoice" to="/invoice-payments" accent="teal" />
        </div>
      </div>
    </section>
  );
}

function FlowCard({ title, steps, cta, to, accent }) {
  const dot = accent === "electric" ? "bg-electric" : "bg-teal";
  return (
    <div className="glass rounded-2xl p-6 sm:p-8">
      <h3 className="font-display text-xl font-bold mb-6">{title}</h3>
      <ol className="space-y-4 mb-8">
        {steps.map((s, i) => (
          <li key={i} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className={`h-7 w-7 rounded-full ${dot} text-graphite flex items-center justify-center text-xs font-bold shrink-0`}>{i + 1}</div>
              {i < steps.length - 1 && <div className="w-px flex-1 bg-border mt-1 min-h-[20px]" />}
            </div>
            <span className="text-sm text-muted-foreground pt-1">{s.text}</span>
          </li>
        ))}
      </ol>
      <Link to={to}><Button variant="outline" className="w-full">{cta} <ArrowRight className="h-4 w-4 ml-1" /></Button></Link>
    </div>
  );
}