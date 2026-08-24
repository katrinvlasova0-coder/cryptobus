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
  contactEmailPlaceholder: null, // publish when confirmed
};

export function companyFooterLine() {
  return `${COMPANY.legalName} · IČO ${COMPANY.ico} · ${COMPANY.address}`;
}
