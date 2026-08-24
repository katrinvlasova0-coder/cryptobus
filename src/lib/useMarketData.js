import { useEffect, useState, useCallback, useRef } from 'react';

/** Static indicative mid prices so the marketing calculator works offline. */
const INDICATIVE_PAIRS = [
  { pair: 'BTC/USD', price: 97500, change_24h: 1.2 },
  { pair: 'ETH/USD', price: 3450, change_24h: -0.4 },
  { pair: 'SOL/USD', price: 178, change_24h: 2.1 },
  { pair: 'XRP/USD', price: 2.35, change_24h: 0.6 },
  { pair: 'USDT/USD', price: 1.0, change_24h: 0.0 },
  { pair: 'USDC/USD', price: 1.0, change_24h: 0.0 },
  { pair: 'BTC/EUR', price: 90200, change_24h: 1.1 },
  { pair: 'ETH/EUR', price: 3190, change_24h: -0.3 },
];

export function useMarketData(intervalMs = 60000) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const timer = useRef(null);

  const load = useCallback(async () => {
    setData({
      status: 'live',
      pairs: INDICATIVE_PAIRS,
      updated_at: new Date().toISOString(),
      source: 'indicative',
    });
    setLoading(false);
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
