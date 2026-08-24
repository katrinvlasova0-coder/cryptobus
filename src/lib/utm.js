const UTM_STORAGE_KEY = 'cryptobus_utm';
const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'fbclid',
  'gclid',
];

function readStored() {
  if (typeof window === 'undefined') return {};
  try {
    const raw =
      sessionStorage.getItem(UTM_STORAGE_KEY) ?? localStorage.getItem(UTM_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeStored(params) {
  if (typeof window === 'undefined') return;
  const json = JSON.stringify(params);
  try {
    sessionStorage.setItem(UTM_STORAGE_KEY, json);
  } catch {
    // ignore
  }
  try {
    localStorage.setItem(UTM_STORAGE_KEY, json);
  } catch {
    // ignore
  }
}

function fromSearch(search) {
  const query = new URLSearchParams(search.startsWith('?') ? search : `?${search}`);
  const next = {};
  for (const key of UTM_KEYS) {
    const value = query.get(key)?.trim();
    if (value) next[key] = value;
  }
  return next;
}

export function captureUtms(search) {
  if (typeof window === 'undefined') return {};
  const fromUrl = fromSearch(search ?? window.location.search);
  if (Object.keys(fromUrl).length === 0) return readStored();
  const merged = { ...readStored(), ...fromUrl };
  writeStored(merged);
  return merged;
}

export function getUtms() {
  if (typeof window === 'undefined') return {};
  return captureUtms();
}

export function formatUtms(params = getUtms()) {
  return UTM_KEYS.filter((key) => params[key])
    .map((key) => `${key}=${params[key]}`)
    .join('&');
}

export function hasUtms(params = getUtms()) {
  return UTM_KEYS.some((key) => Boolean(params[key]));
}
