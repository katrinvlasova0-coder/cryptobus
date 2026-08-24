import { Button } from '@/components/ui/button';
import PageHeader from '@/components/site/PageHeader';
import { ArrowRight, Upload, FileCheck2, ShieldCheck, Banknote, FileDown } from 'lucide-react';
import { useLeadModal } from '@/components/LeadModal';

const STEPS = [
  { icon: Upload, text: 'Upload your commercial invoice' },
  { icon: FileCheck2, text: 'Enter beneficiary information' },
  { icon: Banknote, text: 'Select settlement method' },
  { icon: ShieldCheck, text: 'Cryptobus performs compliance checks' },
  { icon: Banknote, text: 'Fund the transaction' },
  { icon: FileCheck2, text: 'Cryptobus executes the approved settlement' },
  { icon: FileDown, text: 'Download transaction confirmation' },
];

export default function InvoicePayments() {
  const { openLeadModal } = useLeadModal();

  return (
    <>
      <PageHeader
        eyebrow="Invoice Payments"
        title="Pay Your Business Invoice"
        subtitle="Upload an invoice, choose a settlement method, and let Cryptobus handle compliance and execution."
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="glass rounded-2xl p-6">
            <h3 className="font-display text-xl font-bold mb-6">How invoice settlement works</h3>
            <ol className="space-y-4">
              {STEPS.map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="h-7 w-7 rounded-full bg-teal text-graphite flex items-center justify-center text-xs font-bold shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-sm text-muted-foreground pt-1">{s.text}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="glass rounded-2xl p-6">
            <h3 className="font-display text-xl font-bold mb-6">Compliance checks include</h3>
            <ul className="space-y-3">
              {[
                'Payer verification',
                'Beneficiary verification',
                'Invoice validation',
                'Purpose of payment',
                'Jurisdiction review',
                'Sanctions exposure',
                'Transaction risk assessment',
              ].map((c) => (
                <li key={c} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-success shrink-0" /> {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="glass rounded-2xl p-8 text-center">
          <Button
            size="lg"
            className="bg-electric text-graphite font-semibold"
            onClick={() =>
              openLeadModal({
                source: 'invoice-open-account',
                title: 'Open Business Account',
                message: 'Interested in invoice payments',
              })
            }
          >
            Open Business Account <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </>
  );
}
