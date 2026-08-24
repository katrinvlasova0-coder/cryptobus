import PageHeader from "@/components/site/PageHeader";
import { ShieldCheck, FileCheck2, Search, Eye, KeyRound, Users, ScrollText, Lock, Wallet } from "lucide-react";

const SECTIONS = [
  { icon: FileCheck2, title: "Business Verification (KYB)", desc: "Every corporate client completes Know-Your-Business verification before any transaction." },
  { icon: Users, title: "KYC for Directors & UBOs", desc: "Directors and ultimate beneficial owners undergo identity verification." },
  { icon: Search, title: "AML Screening", desc: "Anti-money-laundering screening on parties and transactions." },
  { icon: ShieldCheck, title: "Sanctions Screening", desc: "Screening against applicable sanctions lists before settlement." },
  { icon: Eye, title: "Transaction Monitoring", desc: "Ongoing monitoring of transaction patterns and risk." },
  { icon: Wallet, title: "Wallet Screening", desc: "Approved withdrawal address whitelisting and wallet screening." },
  { icon: KeyRound, title: "Two-Factor Authentication", desc: "2FA for account access and sensitive actions." },
  { icon: Users, title: "Role-Based Access", desc: "Granular permissions for corporate team members." },
  { icon: ScrollText, title: "Audit Logs", desc: "Comprehensive audit trail of account and transaction activity." },
  { icon: Lock, title: "Encryption", desc: "Encryption in transit and at rest for sensitive data." },
  { icon: Wallet, title: "Withdrawal Address Whitelisting", desc: "Funds may only move to pre-approved, verified addresses." }
];

export default function Security() {
  return (
    <>
      <PageHeader eyebrow="Security & Compliance" title="Security & Compliance" subtitle="Cryptobus is built around corporate compliance and operated under a Czech CASP license via Teleport financial services s.r.o." />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="glass rounded-2xl p-6 mb-8 text-sm text-muted-foreground leading-relaxed">
          <p className="font-medium text-foreground mb-2">Regulatory status</p>
          <p>
            Cryptobus is operated by <span className="text-foreground">Teleport financial services s.r.o.</span> (IČO 21369909),
            registered at Cimburkova 916/8, Žižkov, 130 00 Prague 3, Czech Republic, and entered in the Commercial Register
            kept by the Municipal Court in Prague. The company holds a <span className="text-foreground">CASP (Crypto-Asset Service Provider)</span> license.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SECTIONS.map((s) => (
            <div key={s.title} className="glass rounded-2xl p-6">
              <div className="h-11 w-11 rounded-xl bg-electric/10 border border-electric/20 flex items-center justify-center mb-4">
                <s.icon className="h-5 w-5 text-electric" />
              </div>
              <h3 className="font-display text-base font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 glass rounded-2xl p-6 text-sm text-muted-foreground">
          Cryptobus does not facilitate circumventing banking AML/KYC checks, sanctions, currency controls, or crypto exchange restrictions. The platform simplifies legitimate corporate crypto and international settlements while maintaining full compliance. All corporate clients complete KYB; directors and UBOs complete required checks.
        </div>
      </div>
    </>
  );
}