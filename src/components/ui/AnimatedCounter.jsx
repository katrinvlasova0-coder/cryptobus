import { useEffect, useRef, useState } from "react";

export default function AnimatedCounter({ value, duration = 1600, prefix = "", suffix = "", decimals = 0, className = "" }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  const displayRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    displayRef.current = display;
  }, [display]);

  const animateTo = (target, ms) => {
    cancelAnimationFrame(rafRef.current);
    const from = displayRef.current;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / ms, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const next = from + (target - from) * eased;
      displayRef.current = next;
      setDisplay(next);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          animateTo(value, duration);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initial reveal only
  }, []);

  useEffect(() => {
    if (!started.current) return undefined;
    animateTo(value, Math.min(900, duration));
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  const formatted = display.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });

  return (
    <span ref={ref} className={className}>
      {prefix}{formatted}{suffix}
    </span>
  );
}
