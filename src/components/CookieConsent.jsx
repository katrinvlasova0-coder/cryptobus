import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'cryptobus_cookie_consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) !== 'true') {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 99999,
        padding: '1rem',
        background: '#0f172a',
        color: '#f8fafc',
        borderTop: '1px solid #1f2937',
        boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.35)',
      }}
    >
      <div
        style={{
          maxWidth: '960px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <p style={{ flex: '1 1 280px', margin: 0, fontSize: '0.9rem', lineHeight: 1.5, color: '#cbd5e1' }}>
          We use cookies to ensure the website works correctly and to improve your experience.
          By continuing to use the site, you agree to our cookie policy.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <Link
            to="/legal/cookies"
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              border: '1px solid #334155',
              borderRadius: '6px',
              background: 'transparent',
              color: '#f8fafc',
              textDecoration: 'none',
            }}
          >
            Learn more
          </Link>
          <button
            type="button"
            onClick={accept}
            style={{
              padding: '0.5rem 1.25rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              border: 'none',
              borderRadius: '6px',
              background: '#3b82f6',
              color: '#0a0e14',
              cursor: 'pointer',
            }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
