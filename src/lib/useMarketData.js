import { useEffect, useState, useCallback, useRef } from 'react';

/**
 * Reference rates snapshot from CoinGecko (2026-08-24 UTC).
 * Used as fallback when live fetch is unavailable; refresh periodically.
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

const COINGECKO_URL =
  'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,ripple,tether,usd-coin&vs_currencies=usd,eur&include_24hr_change=true';

function mapCoinGecko(json) {
  if (!json?.bitcoin?.usd) return null;
  const round = (n, d = 2) => Number(Number(n).toFixed(d));
  return [
    { pair: 'BTC/USD', price: round(json.bitcoin.usd, 0), change_24h: round(json.bitcoin.usd_24h_change ?? 0) },
    { pair: 'ETH/USD', price: round(json.ethereum.usd, 2), change_24h: round(json.ethereum.usd_24h_change ?? 0) },
    { pair: 'SOL/USD', price: round(json.solana.usd, 2), change_24h: round(json.solana.usd_24h_change ?? 0) },
    { pair: 'XRP/USD', price: round(json.ripple.usd, 2), change_24h: round(json.ripple.usd_24h_change ?? 0) },
    { pair: 'USDT/USD', price: round(json.tether.usd, 4), change_24h: round(json.tether.usd_24h_change ?? 0) },
    { pair: 'USDC/USD', price: round(json['usd-coin'].usd, 4), change_24h: round(json['usd-coin'].usd_24h_change ?? 0) },
    { pair: 'BTC/EUR', price: round(json.bitcoin.eur, 0), change_24h: round(json.bitcoin.eur_24h_change ?? 0) },
    { pair: 'ETH/EUR', price: round(json.ethereum.eur, 2), change_24h: round(json.ethereum.eur_24h_change ?? 0) },
  ];
}

export function useMarketData(intervalMs = 60000) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const timer = useRef(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(COINGECKO_URL, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const pairs = mapCoinGecko(json);
      if (!pairs) throw new Error('empty');
      setData({
        status: 'ok',
        pairs,
        updated_at: new Date().toISOString(),
        source: 'coingecko',
      });
    } catch {
      setData({
        status: 'ok',
        pairs: INDICATIVE_PAIRS,
        updated_at: new Date().toISOString(),
        source: 'indicative',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    timer.current = setInterval(load, intervalMs);
    return () => clearInterval(timer.current);
  }, [load, intervalMs]);

  return { data, loading, reload: load };
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
