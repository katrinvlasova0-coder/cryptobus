import { formatUtms, getUtms, hasUtms } from '@/lib/utm';
import { normalizePhone } from '@/lib/formValidation';

const DEFAULT_WEBHOOK =
  'https://script.google.com/macros/s/AKfycbxgm1M73LWE_23wtbWzJjLBwd7P_s1t46Y2bwDNf2Wc9KKkGjjPtR91xFTkKdp64PHV/exec';

export async function submitLead({
  name,
  email,
  phone,
  company = '',
  message = '',
  source,
  consent = true,
  extra = {},
}) {
  const webhookUrl = import.meta.env.VITE_LEADS_WEBHOOK_URL || DEFAULT_WEBHOOK;
  if (!webhookUrl) {
    throw new Error('VITE_LEADS_WEBHOOK_URL is not configured');
  }

  const page =
    typeof window !== 'undefined'
      ? `${window.location.hostname}${window.location.pathname}`
      : 'cryp2bus.com';

  const utms = getUtms();
  const utmTag = formatUtms(utms);

  const detailParts = [
    page,
    company?.trim() && `company: ${company.trim()}`,
    message?.trim() && `message: ${message.trim()}`,
    ...Object.entries(extra)
      .filter(([, v]) => v != null && String(v).trim() !== '')
      .map(([k, v]) => `${k}: ${String(v).trim()}`),
    utmTag,
  ].filter(Boolean);

  const payload = {
    name: name?.trim() ?? '',
    email: email?.trim() ?? '',
    phone: phone ? normalizePhone(phone) : '',
    consent,
    project: import.meta.env.VITE_PROJECT_NAME || 'cryptobus',
    source: source || detailParts.join(' | '),
    timestamp: new Date().toISOString(),
    ...(company?.trim() ? { company: company.trim() } : {}),
    ...(message?.trim() ? { message: message.trim() } : {}),
    ...extra,
    ...(hasUtms(utms) ? utms : {}),
  };

  const response = await fetch(webhookUrl, {
    method: 'POST',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Webhook HTTP ${response.status}: ${text.slice(0, 200)}`);
  }

  try {
    const data = JSON.parse(text);
    if (data.result !== 'ok') {
      throw new Error(data.error || 'Webhook rejected the lead');
    }
  } catch (err) {
    if (err instanceof SyntaxError) {
      if (!text.toLowerCase().includes('ok')) {
        throw new Error('Unexpected webhook response');
      }
    } else {
      throw err;
    }
  }

  return true;
}
