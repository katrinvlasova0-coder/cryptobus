import { useEffect, useState, useCallback, useRef } from 'react';

/**
 * Reference rates snapshot (fallback when live feeds fail). Refresh periodically.
 */
const INDICATIVE_PAIRS = [
  { pair: 'BTC/USD', price: 79630, change_24h: 2.84 },
  { pair: 'ETH/USD', price: 2524.93, change_24h: 2.93 },
  { pair: 'SOL/USD', price: 96.42, change_24h: 1.11 },
  { pair: 'XRP/USD', price: 1.52, change_24h: -1.07 },
  { pair: 'USDT/USD', price: 0.9997, change_24h: -0.01 },
  { pair: 'USDC/USD', price: 0.9999, change_24h: 0.0 },
  { pair: 'BTC/EUR', price: 68245, change_24h: 3.0 },
  { pair: 'ETH/EUR', price: 2163.92, change_24h: 3.09 },
];

const BINANCE_SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'XRPUSDT', 'USDCUSDT', 'BTCEUR', 'ETHEUR'];

const BINANCE_URL = `https://api.binance.com/api/v3/ticker/24hr?symbols=${encodeURIComponent(
  JSON.stringify(BINANCE_SYMBOLS),
)}`;

const COINGECKO_URL =
  'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,ripple,tether,usd-coin&vs_currencies=usd,eur&include_24hr_change=true';

const DEFAULT_INTERVAL_MS = 90000;

function round(n, d = 2) {
  return Number(Number(n).toFixed(d));
}

function quoteOf(pair) {
  const i = pair.lastIndexOf('/');
  return i >= 0 ? pair.slice(i + 1) : 'USD';
}

function withQuotes(pairs) {
  return pairs.map((p) => ({ ...p, quote: quoteOf(p.pair) }));
}

function mapBinance(rows) {
  if (!Array.isArray(rows) || !rows.length) return null;
  const by = Object.fromEntries(rows.map((r) => [r.symbol, r]));
  const pick = (symbol, pair, priceDigits) => {
    const row = by[symbol];
    if (!row) return null;
    return {
      pair,
      price: round(Number(row.lastPrice), priceDigits),
      change_24h: round(Number(row.priceChangePercent)),
    };
  };

  const pairs = [
    pick('BTCUSDT', 'BTC/USD', 0),
    pick('ETHUSDT', 'ETH/USD', 2),
    pick('SOLUSDT', 'SOL/USD', 2),
    pick('XRPUSDT', 'XRP/USD', 4),
    // USDT ≈ USD on Binance spot; USDC/USDT last ≈ USDC/USD
    {
      pair: 'USDT/USD',
      price: 1,
      change_24h: 0,
    },
    pick('USDCUSDT', 'USDC/USD', 4),
    pick('BTCEUR', 'BTC/EUR', 0),
    pick('ETHEUR', 'ETH/EUR', 2),
  ].filter(Boolean);

  return pairs.length >= 4 ? withQuotes(pairs) : null;
}

function mapCoinGecko(json) {
  if (!json?.bitcoin?.usd) return null;
  return withQuotes([
    { pair: 'BTC/USD', price: round(json.bitcoin.usd, 0), change_24h: round(json.bitcoin.usd_24h_change ?? 0) },
    { pair: 'ETH/USD', price: round(json.ethereum.usd, 2), change_24h: round(json.ethereum.usd_24h_change ?? 0) },
    { pair: 'SOL/USD', price: round(json.solana.usd, 2), change_24h: round(json.solana.usd_24h_change ?? 0) },
    { pair: 'XRP/USD', price: round(json.ripple.usd, 4), change_24h: round(json.ripple.usd_24h_change ?? 0) },
    { pair: 'USDT/USD', price: round(json.tether.usd, 4), change_24h: round(json.tether.usd_24h_change ?? 0) },
    { pair: 'USDC/USD', price: round(json['usd-coin'].usd, 4), change_24h: round(json['usd-coin'].usd_24h_change ?? 0) },
    { pair: 'BTC/EUR', price: round(json.bitcoin.eur, 0), change_24h: round(json.bitcoin.eur_24h_change ?? 0) },
    { pair: 'ETH/EUR', price: round(json.ethereum.eur, 2), change_24h: round(json.ethereum.eur_24h_change ?? 0) },
  ]);
}

async function fetchJson(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function loadMarketPairs() {
  try {
    const rows = await fetchJson(BINANCE_URL);
    const pairs = mapBinance(rows);
    if (pairs) {
      return { status: 'ok', pairs, updated_at: new Date().toISOString(), source: 'binance' };
    }
  } catch {
    // try CoinGecko next
  }

  try {
    const json = await fetchJson(COINGECKO_URL);
    const pairs = mapCoinGecko(json);
    if (pairs) {
      return { status: 'ok', pairs, updated_at: new Date().toISOString(), source: 'coingecko' };
    }
  } catch {
    // fall through
  }

  return {
    status: 'ok',
    pairs: withQuotes(INDICATIVE_PAIRS),
    updated_at: new Date().toISOString(),
    source: 'indicative',
  };
}

// Shared store so ticker / markets / calculator share one poller.
let sharedData = null;
let sharedLoading = true;
const listeners = new Set();
let pollTimer = null;
let inFlight = null;
let pollIntervalMs = DEFAULT_INTERVAL_MS;

function emit() {
  listeners.forEach((fn) => fn());
}

async function refreshShared() {
  if (inFlight) return inFlight;
  inFlight = loadMarketPairs()
    .then((next) => {
      sharedData = next;
      sharedLoading = false;
      emit();
      return next;
    })
    .finally(() => {
      inFlight = null;
    });
  return inFlight;
}

function ensurePolling(intervalMs) {
  pollIntervalMs = Math.min(pollIntervalMs, intervalMs);
  if (pollTimer) return;
  refreshShared();
  pollTimer = setInterval(() => {
    refreshShared();
  }, pollIntervalMs);
}

function stopPollingIfIdle() {
  if (listeners.size === 0 && pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
    pollIntervalMs = DEFAULT_INTERVAL_MS;
  }
}

export function useMarketData(intervalMs = DEFAULT_INTERVAL_MS) {
  const [, bump] = useState(0);
  const intervalRef = useRef(intervalMs);

  const reload = useCallback(() => refreshShared(), []);

  useEffect(() => {
    intervalRef.current = intervalMs;
    const onChange = () => bump((n) => n + 1);
    listeners.add(onChange);
    ensurePolling(intervalMs);
    if (!sharedData) refreshShared();
    return () => {
      listeners.delete(onChange);
      stopPollingIfIdle();
    };
  }, [intervalMs]);

  return { data: sharedData, loading: sharedLoading && !sharedData, reload };
}

export function formatPrice(value) {
  if (value == null) return '—';
  if (value >= 1000) {
    return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  if (value >= 1) {
    return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  }
  return value.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 6 });
}

export function formatChange(value) {
  if (value == null) return '—';
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}
