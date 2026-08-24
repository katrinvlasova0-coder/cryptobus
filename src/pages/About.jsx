import { Button } from '@/components/ui/button';
import PageHeader from '@/components/site/PageHeader';
import { Target, Server, ShieldCheck, Globe2, Users, Mail } from 'lucide-react';
import { useLeadModal } from '@/components/LeadModal';

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
    icon: Users,
    title: 'Leadership',
    body: 'Leadership details will be published once confirmed by the platform administrator.',
  },
  {
    icon: Mail,
    title: 'Contact',
    body: 'Reach our team for corporate inquiries and onboarding support.',
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
