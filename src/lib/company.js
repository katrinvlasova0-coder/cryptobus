/** Legal entity operating Cryptobus (cryp2bus.com). */
export const COMPANY = {
  brand: 'Cryptobus',
  domain: 'cryp2bus.com',
  legalName: 'Teleport financial services s.r.o.',
  license: 'CASP (Crypto-Asset Service Provider)',
  licenseNote: 'Licensed via Teleport financial services s.r.o. (CASP)',
  ico: '21369909',
  legalForm: 'Společnost s ručením omezeným (s.r.o.)',
  country: 'Czech Republic',
  address: 'Cimburkova 916/8, Žižkov, 130 00 Prague 3, Czech Republic',
  courtRegistry: 'Municipal Court in Prague',
  email: 'Hello@cryp2bus.com',
  phone: '+48573569975',
  phoneDisplay: '+48 573 569 975',
};

export function companyFooterLine() {
  return `${COMPANY.legalName} · IČO ${COMPANY.ico} · ${COMPANY.address}`;
}

export function mailtoHref() {
  return `mailto:${COMPANY.email}`;
}

export function telHref() {
  return `tel:${COMPANY.phone.replace(/\s+/g, '')}`;
}
