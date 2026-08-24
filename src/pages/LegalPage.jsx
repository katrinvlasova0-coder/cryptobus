import { useParams, Link } from 'react-router-dom';
import PageHeader from '@/components/site/PageHeader';

const DOCS = {
  terms: {
    title: 'Terms of Service',
    sections: [
      {
        title: '1. Agreement',
        text: 'These Terms of Service govern access to and use of the Cryptobus website and related marketing materials operated under cryp2bus.com. By using the site, you agree to these Terms.',
      },
      {
        title: '2. Nature of the service',
        text: 'This website presents information about Cryptobus B2B crypto transaction infrastructure. Availability of any product or service is subject to KYB/KYC, AML checks, and applicable regulatory requirements. Nothing on this site constitutes an offer to the public in a restricted jurisdiction.',
      },
      {
        title: '3. Lead requests',
        text: 'By submitting a contact or account request form, you confirm that the information provided is accurate and that you are authorized to act on behalf of the stated company where applicable.',
      },
      {
        title: '4. No investment advice',
        text: 'Cryptobus does not provide investment, legal, or tax advice. Crypto assets are volatile. You are solely responsible for assessing suitability for your business.',
      },
      {
        title: '5. Intellectual property',
        text: 'All trademarks, logos, and content on this site are owned by Cryptobus or its licensors and may not be used without prior written permission.',
      },
      {
        title: '6. Limitation of liability',
        text: 'To the maximum extent permitted by law, Cryptobus is not liable for indirect, incidental, or consequential damages arising from use of this website or reliance on its content.',
      },
      {
        title: '7. Changes',
        text: 'We may update these Terms from time to time. The version published on this page is the current version.',
      },
      {
        title: '8. Contact',
        text: 'For questions about these Terms, contact us via the request form on this website or the contact details published once confirmed by the platform operator.',
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    sections: [
      {
        title: '1. Controller',
        text: 'Cryptobus (website cryp2bus.com) processes personal data submitted through lead forms and collected via necessary cookies as described in this Policy.',
      },
      {
        title: '2. Data we collect',
        text: 'We may collect: name, email, phone, company name, message content, OTC request details, UTM / campaign parameters, technical data (IP address, browser type, device), and cookie consent status.',
      },
      {
        title: '3. Purposes',
        text: 'Personal data is processed to: respond to business inquiries; evaluate onboarding interest; improve the website; measure marketing attribution; and comply with applicable law.',
      },
      {
        title: '4. Legal bases',
        text: 'Processing is based on your consent (form checkbox and cookie banner), legitimate interest in operating a B2B marketing site, and where applicable pre-contractual steps at your request.',
      },
      {
        title: '5. Storage and security',
        text: 'Lead data is stored in our CRM / Google Sheets infrastructure used across Cryptobus marketing properties. We apply organizational and technical measures appropriate to the risk.',
      },
      {
        title: '6. Sharing',
        text: 'Data may be shared with service providers that process data on our behalf (hosting, analytics, spreadsheet / CRM tools). We do not sell personal data.',
      },
      {
        title: '7. Retention',
        text: 'Lead data is retained for as long as needed to handle your request and for legitimate business records, unless a longer period is required by law or you request deletion where applicable.',
      },
      {
        title: '8. Your rights',
        text: 'Depending on your jurisdiction, you may request access, rectification, erasure, restriction, objection, or data portability, and you may withdraw consent at any time without affecting prior lawful processing.',
      },
      {
        title: '9. Cookies',
        text: 'See our Cookie Policy for details on cookie use and how to manage preferences.',
      },
      {
        title: '10. Contact',
        text: 'To exercise privacy rights, use the contact form on this site or the privacy contact address once published by the platform operator.',
      },
    ],
  },
  aml: {
    title: 'AML Policy',
    sections: [
      {
        title: '1. Overview',
        text: 'Cryptobus applies anti-money-laundering (AML) controls consistent with a B2B crypto settlement model. Clients are expected to use the platform only for legitimate corporate purposes.',
      },
      {
        title: '2. Customer due diligence',
        text: 'Corporate clients complete KYB. Directors and ultimate beneficial owners complete identity checks. Enhanced due diligence may apply based on risk.',
      },
      {
        title: '3. Screening',
        text: 'Parties, transactions, and wallets may be screened against applicable sanctions and watchlists before settlement.',
      },
      {
        title: '4. Monitoring',
        text: 'Transaction patterns may be monitored. Suspicious activity may be escalated, delayed, or declined.',
      },
      {
        title: '5. Prohibited use',
        text: 'Cryptobus does not facilitate circumventing banking AML/KYC checks, sanctions, currency controls, or exchange restrictions.',
      },
    ],
  },
  kyc: {
    title: 'KYC / KYB Policy',
    sections: [
      {
        title: '1. KYB for companies',
        text: 'Every corporate client completes Know-Your-Business verification before transactions are enabled.',
      },
      {
        title: '2. KYC for individuals',
        text: 'Directors and UBOs undergo identity verification as required by risk and regulation.',
      },
      {
        title: '3. Documents',
        text: 'Typical documents may include company registration extracts, ownership charts, proof of address, and government-issued ID for relevant individuals. Exact requirements depend on jurisdiction and risk profile.',
      },
      {
        title: '4. Ongoing review',
        text: 'Cryptobus may request updated information and may suspend access if verification cannot be completed.',
      },
    ],
  },
  risk: {
    title: 'Risk Disclosure',
    sections: [
      {
        title: '1. Volatility',
        text: 'Crypto-asset prices can move quickly and substantially. Businesses may lose value between quote and settlement.',
      },
      {
        title: '2. Operational risk',
        text: 'Network congestion, wallet errors, banking delays, and compliance reviews may affect timing of settlements.',
      },
      {
        title: '3. Regulatory risk',
        text: 'Rules applicable to crypto and cross-border payments change over time and may restrict availability in certain countries.',
      },
      {
        title: '4. No guarantee',
        text: 'Indicative rates shown on the marketing site are not executable quotes. Final pricing is confirmed only through an approved RFQ / OTC process.',
      },
    ],
  },
  cookies: {
    title: 'Cookie Policy',
    sections: [
      {
        title: '1. What are cookies',
        text: 'Cookies are small text files stored on your device. Similar technologies (localStorage / sessionStorage) may be used for the same purposes.',
      },
      {
        title: '2. How we use them',
        text: 'We use cookies and storage to: remember cookie consent; keep UTM campaign attribution during your visit; and ensure basic site functionality.',
      },
      {
        title: '3. Types',
        text: 'Strictly necessary cookies support consent and core navigation. Preference / attribution storage helps connect marketing traffic to lead submissions.',
      },
      {
        title: '4. Managing cookies',
        text: 'You can clear or block cookies in your browser settings. If you disable cookies, some features (including remembering consent) may not work correctly.',
      },
      {
        title: '5. More information',
        text: 'See also our Privacy Policy for how personal data related to cookies is handled.',
      },
    ],
  },
  restricted: {
    title: 'Restricted Countries',
    sections: [
      {
        title: '1. Availability',
        text: 'Cryptobus availability depends on regulatory and compliance requirements. Support for a country on the marketing coverage map does not guarantee account approval.',
      },
      {
        title: '2. Restricted / prohibited',
        text: 'We do not onboard clients from jurisdictions subject to comprehensive sanctions or where providing the service would breach applicable law. The definitive restricted list is maintained by compliance and may change without notice.',
      },
      {
        title: '3. Coming soon',
        text: 'Some markets may be marked as coming soon while licensing, banking rails, or local requirements are being assessed.',
      },
      {
        title: '4. Questions',
        text: 'If you are unsure whether your company can be onboarded, submit a request via the contact form and our team will advise.',
      },
    ],
  },
  complaints: {
    title: 'Complaints',
    sections: [
      {
        title: '1. How to complain',
        text: 'If you have a complaint about Cryptobus marketing communications or an onboarding interaction, submit details via the website contact form with the subject “Complaint”.',
      },
      {
        title: '2. What to include',
        text: 'Please include your name, company, contact details, a clear description of the issue, and any relevant reference numbers or dates.',
      },
      {
        title: '3. Handling',
        text: 'We aim to acknowledge complaints promptly and investigate in good faith. Complex matters may take longer where compliance review is required.',
      },
      {
        title: '4. Escalation',
        text: 'Where required by law, you may also have the right to escalate to a competent authority or dispute-resolution body in your jurisdiction.',
      },
    ],
  },
};

export default function LegalPage() {
  const { slug } = useParams();
  const doc = DOCS[slug];

  if (!doc) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold mb-4">Document not found</h1>
        <Link to="/" className="text-electric hover:underline">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <>
      <PageHeader eyebrow="Legal" title={doc.title} subtitle="Cryptobus · cryp2bus.com" />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <p className="text-xs text-muted-foreground">Last updated: 24 August 2026</p>
        {doc.sections.map((s) => (
          <section key={s.title}>
            <h2 className="font-display font-semibold text-lg mb-2">{s.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
          </section>
        ))}
        <Link to="/" className="inline-block text-sm text-electric hover:underline">
          ← Back to home
        </Link>
      </div>
    </>
  );
}
