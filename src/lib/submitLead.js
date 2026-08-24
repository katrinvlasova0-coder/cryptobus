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

  // Apps Script web apps often respond with an opaque/redirect response.
  // Prefer a readable JSON confirmation; fall back to no-cors POST (same pattern as other landings).
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    if (response.ok) {
      try {
        const data = JSON.parse(text);
        if (data.result && data.result !== 'ok') {
          throw new Error(data.error || 'Webhook rejected the lead');
        }
      } catch (err) {
        if (err instanceof SyntaxError) {
          if (text && !text.toLowerCase().includes('ok') && text.trim().startsWith('<')) {
            // HTML error page after redirect — treat as soft success if status was ok, else no-cors fallback
            throw err;
          }
        } else {
          throw err;
        }
      }
      return true;
    }
  } catch {
    // fall through to no-cors
  }

  await fetch(webhookUrl, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  });

  return true;
}
