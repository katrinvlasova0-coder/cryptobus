import { Button } from '@/components/ui/button';
import PageHeader from '@/components/site/PageHeader';
import { Target, Server, ShieldCheck, Globe2, Users, Mail, Building2 } from 'lucide-react';
import { useLeadModal } from '@/components/LeadModal';
import { COMPANY } from '@/lib/company';

const SECTIONS = [
  {
    icon: Target,
    title: 'Our Mission',
    body: 'Build a dedicated B2B transaction layer designed around corporate workflows — not retail trading.',
  },
  {
    icon: Server,
    title: 'Our Infrastructure',
    body: 'A secure settlement infrastructure connecting fiat and digital assets for businesses.',
  },
  {
    icon: ShieldCheck,
    title: 'Our Approach to Compliance',
    body: 'KYB, AML, sanctions screening, and transaction monitoring embedded into every flow.',
  },
  {
    icon: Globe2,
    title: 'Global Coverage',
    body: 'Cross-border business transactions, subject to regulatory and compliance requirements.',
  },
  {
    icon: Mail,
    title: 'Contact',
    body: 'Reach our team for corporate inquiries and onboarding support via the request form on this website.',
  },
];

export default function About() {
  const { openLeadModal } = useLeadModal();

  return (
    <>
      <PageHeader
        eyebrow="About Cryptobus"
        title="Built for Businesses That Need Crypto Infrastructure"
        subtitle="Not another retail trading app."
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <div className="glass rounded-2xl p-8 lg:p-10">
          <h2 className="font-display text-2xl font-bold mb-4">The problem we solve</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Traditional crypto platforms are primarily designed around retail traders or
              institutional investors. Businesses often face a different problem: they need to
              acquire digital assets or execute legitimate commercial settlements while navigating
              banking, compliance and operational complexity.
            </p>
            <p>
              Cryptobus creates a dedicated B2B transaction layer designed around corporate
              workflows — making it simple to buy crypto, pay invoices, and settle globally through
              one compliant business account.
            </p>
          </div>
        </div>

        <div className="glass rounded-2xl p-8 lg:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-11 w-11 rounded-xl bg-electric/10 border border-electric/20 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-electric" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold">Company & licensing</h2>
              <p className="text-sm text-muted-foreground">
                Cryptobus is operated by {COMPANY.legalName}
              </p>
            </div>
          </div>
          <dl className="grid sm:grid-cols-2 gap-4 text-sm">
            <Item label="Legal name" value={COMPANY.legalName} />
            <Item label="Legal form" value={COMPANY.legalForm} />
            <Item label="Registration number (IČO)" value={COMPANY.ico} />
            <Item label="License" value={COMPANY.license} />
            <Item label="Country" value={COMPANY.country} />
            <Item label="Court registry" value={COMPANY.courtRegistry} />
            <Item label="Registered address" value={COMPANY.address} className="sm:col-span-2" />
          </dl>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SECTIONS.map((s) => (
            <div key={s.title} className="glass rounded-2xl p-6">
              <div className="h-11 w-11 rounded-xl bg-teal/10 border border-teal/20 flex items-center justify-center mb-4">
                <s.icon className="h-5 w-5 text-teal" />
              </div>
              <h3 className="font-display text-base font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="glass rounded-2xl p-8 lg:p-10 border border-dashed border-border">
          <div className="flex items-center gap-3 mb-3">
            <Users className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-display text-xl font-bold">Leadership</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Leadership profiles, roles, and LinkedIn links will be published here soon. Content is
            being prepared and will appear on this page once confirmed.
          </p>
        </div>

        <div className="text-center">
          <Button
            size="lg"
            className="bg-electric text-graphite font-semibold"
            onClick={() =>
              openLeadModal({ source: 'about-open-account', title: 'Open Business Account' })
            }
          >
            Open Business Account
          </Button>
        </div>
      </div>
    </>
  );
}

function Item({ label, value, className = '' }) {
  return (
    <div className={`rounded-xl border border-border bg-card/40 p-4 ${className}`}>
      <dt className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{label}</dt>
      <dd className="text-foreground font-medium leading-relaxed">{value}</dd>
    </div>
  );
}
