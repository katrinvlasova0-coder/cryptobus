export const VALIDATION_MESSAGES = {
  name: 'Enter your name (at least 2 characters)',
  email: 'Enter a valid email, e.g. name@company.com',
  phone: 'Enter a valid phone number with country code',
  company: 'Enter your company name',
};

export function isValidName(name) {
  const value = name?.trim() ?? '';
  return value.length >= 2 && /^[\p{L}\s'.-]+$/u.test(value);
}

export function isValidEmail(email) {
  const value = email?.trim() ?? '';
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value);
}

export function isValidPhone(phone) {
  const digits = String(phone ?? '').replace(/\D/g, '');
  return digits.length >= 8 && digits.length <= 15;
}

export function normalizePhone(phone) {
  const trimmed = phone?.trim() ?? '';
  if (!trimmed) return '';
  const digits = trimmed.replace(/\D/g, '');
  if (trimmed.startsWith('+')) return `+${digits}`;
  return trimmed;
}

export function validateLeadFields({
  name,
  email,
  phone,
  company,
  nameRequired = true,
  emailRequired = true,
  phoneRequired = true,
  companyRequired = false,
}) {
  const errors = {};

  if (nameRequired && !isValidName(name)) {
    errors.name = VALIDATION_MESSAGES.name;
  }
  if (emailRequired && !isValidEmail(email)) {
    errors.email = VALIDATION_MESSAGES.email;
  } else if (!emailRequired && email?.trim() && !isValidEmail(email)) {
    errors.email = VALIDATION_MESSAGES.email;
  }
  if (phoneRequired && !isValidPhone(phone)) {
    errors.phone = VALIDATION_MESSAGES.phone;
  } else if (!phoneRequired && phone?.trim() && !isValidPhone(phone)) {
    errors.phone = VALIDATION_MESSAGES.phone;
  }
  if (companyRequired && !(company?.trim()?.length >= 2)) {
    errors.company = VALIDATION_MESSAGES.company;
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
