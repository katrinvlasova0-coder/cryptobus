import React, { createContext, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { validateLeadFields } from '@/lib/formValidation';
import { submitLead } from '@/lib/submitLead';

const LeadModalContext = createContext();

export function LeadModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [context, setContext] = useState({ source: 'website', title: null });
  const openLeadModal = (opts = {}) => {
    setContext({
      source: opts.source || 'website',
      title: opts.title || null,
      message: opts.message || '',
      extra: opts.extra || {},
    });
    setIsOpen(true);
  };
  const closeLeadModal = () => setIsOpen(false);
  return (
    <LeadModalContext.Provider value={{ openLeadModal, closeLeadModal }}>
      {children}
      {isOpen && (
        <LeadModal
          onClose={closeLeadModal}
          source={context.source}
          title={context.title}
          initialMessage={context.message}
          extra={context.extra}
        />
      )}
    </LeadModalContext.Provider>
  );
}

export function useLeadModal() {
  return useContext(LeadModalContext);
}

const fieldStyle = {
  width: '100%',
  padding: '0.625rem 0.75rem',
  border: '1px solid #334155',
  borderRadius: '8px',
  fontSize: '0.95rem',
  boxSizing: 'border-box',
  background: '#0f172a',
  color: '#f8fafc',
};

function FieldError({ message }) {
  if (!message) return null;
  return <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.25rem' }}>{message}</p>;
}

function LeadModal({ onClose, source, title, initialMessage = '', extra = {} }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: initialMessage || '',
  });
  const [errors, setErrors] = useState({});
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) {
      setErrors((e) => ({ ...e, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!consent) return;

    const { valid, errors: validationErrors } = validateLeadFields(form);
    setErrors(validationErrors);
    if (!valid) return;

    setLoading(true);
    setSubmitError('');
    try {
      await submitLead({
        name: form.name,
        email: form.email,
        phone: form.phone,
        company: form.company,
        message: form.message,
        source,
        consent: true,
        extra,
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Lead submission error:', err);
      setSubmitError('Could not submit your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'name', label: 'Full name', type: 'text', placeholder: 'Jane Smith', autoComplete: 'name' },
    { name: 'email', label: 'Work email', type: 'email', placeholder: 'jane@company.com', autoComplete: 'email' },
    { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+1 555 000 0000', autoComplete: 'tel' },
    { name: 'company', label: 'Company', type: 'text', placeholder: 'Acme Ltd', autoComplete: 'organization', required: false },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: '#111827',
          borderRadius: '12px',
          padding: '2rem',
          maxWidth: '460px',
          width: '100%',
          position: 'relative',
          border: '1px solid #1f2937',
          color: '#f8fafc',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <button
          onClick={onClose}
          type="button"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#9ca3af',
          }}
        >
          ×
        </button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
            <h2 style={{ marginBottom: '0.5rem' }}>Request received</h2>
            <p style={{ color: '#9ca3af' }}>Our team will contact you within 24 hours.</p>
          </div>
        ) : (
          <>
            <h2 style={{ marginBottom: '0.25rem' }}>{title || 'Open Business Account'}</h2>
            <p style={{ color: '#9ca3af', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Leave your details and we will get back to you within 24 hours.
            </p>
            <form onSubmit={handleSubmit} noValidate>
              {fields.map(({ name, label, type, placeholder, autoComplete }) => (
                <div key={name} style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem', fontWeight: 500 }}>
                    {label}
                    {name !== 'company' && <span style={{ color: '#f87171' }}> *</span>}
                  </label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    value={form[name]}
                    onChange={(e) => handleChange(name, e.target.value)}
                    style={{
                      ...fieldStyle,
                      borderColor: errors[name] ? '#f87171' : '#334155',
                    }}
                  />
                  <FieldError message={errors[name]} />
                </div>
              ))}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem', fontWeight: 500 }}>
                  Message
                </label>
                <textarea
                  placeholder="Tell us about your use case"
                  value={form.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  rows={3}
                  style={{ ...fieldStyle, resize: 'vertical' }}
                />
              </div>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                  marginBottom: '1rem',
                  fontSize: '0.85rem',
                  lineHeight: 1.4,
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  style={{ marginTop: '0.2rem', flexShrink: 0 }}
                />
                <span>
                  I agree to the processing of my personal data in accordance with the{' '}
                  <Link
                    to="/legal/privacy"
                    style={{ color: '#60a5fa' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {!consent && (
                <p style={{ color: '#f87171', fontSize: '0.8rem', marginBottom: '1rem' }}>
                  Consent is required to submit the form
                </p>
              )}
              {submitError && (
                <p style={{ color: '#f87171', fontSize: '0.8rem', marginBottom: '1rem' }}>{submitError}</p>
              )}
              <button
                type="submit"
                disabled={loading || !consent}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: '#3b82f6',
                  color: '#0a0e14',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: loading || !consent ? 'not-allowed' : 'pointer',
                  opacity: loading || !consent ? 0.5 : 1,
                }}
              >
                {loading ? 'Submitting…' : 'Submit request'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
