import { useState } from "react";
import { ChevronDown } from "lucide-react";
import PageHeader from "@/components/site/PageHeader";

const FAQS = [
  { q: "What is Cryptobus?", a: "Cryptobus is a B2B crypto exchange and settlement platform built for businesses that need to buy crypto, pay commercial invoices, or execute international settlements." },
  { q: "What is the transaction fee?", a: "0.5% per transaction. Simple, transparent pricing with no hidden fees." },
  { q: "Who can open an account?", a: "Corporate clients. Every business completes KYB verification, and directors and UBOs complete required identity checks." },
  { q: "How do I buy crypto?", a: "Open an account, complete KYB, select your currency and crypto asset, receive a live quote, transfer funds, and receive crypto to your approved wallet." },
  { q: "How do invoice payments work?", a: "Upload your invoice, enter beneficiary details, choose a settlement method, and Cryptobus performs compliance checks before executing the approved settlement." },
  { q: "Is Cryptobus licensed or regulated?", a: "Any statements about licensing, regulation, banking partners, or insurance will appear on this site only after being confirmed by the platform administrator." },
  { q: "Which countries are supported?", a: "Availability depends on regulatory and compliance requirements. See our Global Coverage section for supported, restricted, and coming-soon jurisdictions." },
  { q: "Do you support large OTC transactions?", a: "Yes. Our OTC desk handles large corporate crypto transactions with tailored quotes and settlement." }
];

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <>
      <PageHeader eyebrow="FAQ" title="Frequently Asked Questions" subtitle="Everything businesses need to know about Cryptobus." />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 space-y-3">
        {FAQS.map((f, i) => (
          <div key={i} className="glass rounded-xl overflow-hidden">
            <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full flex items-center justify-between p-5 text-left">
              <span className="font-medium">{f.q}</span>
              <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{f.a}</div>}
          </div>
        ))}
      </div>
    </>
  );
}