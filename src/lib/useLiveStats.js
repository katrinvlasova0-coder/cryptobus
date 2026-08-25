import { useEffect, useState } from 'react';
import { getLiveStats } from '@/lib/liveStats';

const TICK_MS = 4000;

export function useLiveStats(intervalMs = TICK_MS) {
  const [stats, setStats] = useState(() => getLiveStats());

  useEffect(() => {
    setStats(getLiveStats());
    const id = setInterval(() => setStats(getLiveStats()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return stats;
}
