import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PageHeader from '@/components/site/PageHeader';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { isValidEmail, isValidName } from '@/lib/formValidation';
import { submitLead } from '@/lib/submitLead';

const EMPTY = {
  company: '',
  contact_person: '',
  email: '',
  phone: '',
  transaction_type: 'OTC Block Trade',
  side: 'buy',
  asset: 'BTC',
  currency: 'USD',
  estimated_size: '',
  preferred_settlement_date: '',
};

export default function Otc() {
  const [form, setForm] = useState(EMPTY);
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!consent) {
      toast({ title: 'Consent required', description: 'Please accept the privacy policy.', variant: 'destructive' });
      return;
    }
    if (!isValidName(form.contact_person) || !isValidEmail(form.email) || !(form.company || '').trim()) {
      toast({ title: 'Check the form', description: 'Company, contact person and email are required.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      await submitLead({
        name: form.contact_person,
        email: form.email,
        phone: form.phone,
        company: form.company,
        source: 'otc-quote',
        consent: true,
        message: `OTC quote request`,
        extra: {
          form: 'otc',
          transaction_type: form.transaction_type,
          side: form.side,
          asset: form.asset,
          currency: form.currency,
          estimated_size: form.estimated_size,
          preferred_settlement_date: form.preferred_settlement_date,
        },
      });
      toast({ title: 'Request submitted', description: 'Our OTC desk will contact you shortly.' });
      setForm(EMPTY);
      setConsent(false);
    } catch (err) {
      toast({ title: 'Error', description: err.message || 'Could not submit request', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="OTC Desk"
        title="Cryptobus OTC"
        subtitle="For large corporate crypto transactions. Request a quote from our OTC desk — discreet, compliant, and tailored to your size."
      />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <form onSubmit={submit} className="glass rounded-2xl p-6 sm:p-8 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Company">
              <Input required value={form.company} onChange={set('company')} />
            </Field>
            <Field label="Contact Person">
              <Input required value={form.contact_person} onChange={set('contact_person')} />
            </Field>
            <Field label="Email">
              <Input type="email" required value={form.email} onChange={set('email')} />
            </Field>
            <Field label="Phone">
              <Input type="tel" value={form.phone} onChange={set('phone')} placeholder="+1 555 000 0000" />
            </Field>
            <Field label="Transaction Type">
              <Input value={form.transaction_type} onChange={set('transaction_type')} />
            </Field>
            <Field label="Buy / Sell">
              <select
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm"
                value={form.side}
                onChange={set('side')}
              >
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>
            </Field>
            <Field label="Asset">
              <select
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm"
                value={form.asset}
                onChange={set('asset')}
              >
                {['BTC', 'ETH', 'USDT', 'USDC', 'SOL', 'XRP'].map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </Field>
            <Field label="Currency">
              <select
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm"
                value={form.currency}
                onChange={set('currency')}
              >
                {['USD', 'EUR', 'GBP', 'CHF'].map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </Field>
            <Field label="Estimated Size">
              <Input type="number" value={form.estimated_size} onChange={set('estimated_size')} placeholder="0" />
            </Field>
            <Field label="Preferred Settlement Date">
              <Input
                type="date"
                value={form.preferred_settlement_date}
                onChange={set('preferred_settlement_date')}
              />
            </Field>
          </div>
          <label className="flex items-start gap-2 text-sm text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1"
            />
            <span>
              I agree to the processing of my personal data in accordance with the{' '}
              <Link to="/legal/privacy" className="text-electric hover:underline">
                Privacy Policy
              </Link>
            </span>
          </label>
          <Button type="submit" disabled={loading || !consent} className="w-full bg-electric text-graphite font-semibold">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting…
              </>
            ) : (
              'Request OTC Quote'
            )}
          </Button>
        </form>
      </div>
    </>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
