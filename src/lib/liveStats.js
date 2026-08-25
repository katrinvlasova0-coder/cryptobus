/** Deterministic PRNG so all visitors see the same “day curve”. */
function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function dayKeyUTC(date) {
  return date.toISOString().slice(0, 10);
}

function dayProgressUTC(date) {
  const ms =
    date.getUTCHours() * 3600000 +
    date.getUTCMinutes() * 60000 +
    date.getUTCSeconds() * 1000 +
    date.getUTCMilliseconds();
  return ms / 86400000;
}

/**
 * Marketing platform stats that drift through the day.
 * Floors: volume ≥ $30M, transactions ≥ 500, clients ≥ 7000.
 */
export function getLiveStats(now = new Date()) {
  const key = dayKeyUTC(now);
  const rng = mulberry32(hashString(`cryptobus-live-${key}`));

  const volumeTarget = 30_000_000 + rng() * 48_000_000; // $30M–$78M EOD
  const txTarget = 500 + Math.floor(rng() * 1400); // 500–1900
  const clientsBase = 7000 + Math.floor(rng() * 2800); // 7000–9800
  const ordersBase = 48 + Math.floor(rng() * 55);
  const countries = 42 + Math.floor(rng() * 18);
  const markets = 8;

  // Start the day already above floors, then grow toward daily targets.
  const progress = dayProgressUTC(now);
  const growth = 0.42 + progress * 0.58;

  // Slow sine + minute tick for a living feel without big jumps.
  const t = now.getTime() / 1000;
  const wobble = 1 + Math.sin(t / 97) * 0.012 + Math.sin(t / 37) * 0.006;

  const volume = Math.max(30_000_000, Math.round(volumeTarget * growth * wobble));
  const transactions = Math.max(500, Math.round(txTarget * growth * (1 + Math.sin(t / 53) * 0.01)));
  const clients = Math.max(
    7000,
    clientsBase + Math.floor(progress * (18 + rng() * 40)) + Math.floor((Math.sin(t / 120) + 1) * 2),
  );
  const activeOrders = Math.max(
    24,
    Math.round(ordersBase * (0.85 + progress * 0.35) * (1 + Math.sin(t / 29) * 0.08)),
  );

  return {
    volume24h: volume,
    transactionsToday: transactions,
    activeOrders,
    businessClients: clients,
    markets,
    countriesCovered: countries,
    updatedAt: now.toISOString(),
  };
}

export function formatCompactUsd(value) {
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    return {
      prefix: '$',
      value: Number(m.toFixed(m >= 100 ? 1 : 2)),
      suffix: 'M',
      decimals: m >= 100 ? 1 : 2,
    };
  }
  return { prefix: '$', value, suffix: '', decimals: 0 };
}
