"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animates a published figure such as "10–15%" from zero when it scrolls into view.
 * The server renders the final text, so the figure is always correct without JS.
 */
export function parseFigure(text: string) {
  const m = text.match(/^(\d+)\s*([–-])\s*(\d+)(%?)$/) ?? text.match(/^(\d+)(%?)$/);
  if (!m) return null;
  return m.length === 5
    ? { from: Number(m[1]), to: Number(m[3]), sep: m[2], suffix: m[4] }
    : { from: null, to: Number(m[1]), sep: "", suffix: m[2] };
}

export function CountUp({ text, duration = 1400 }: { text: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [progress, setProgress] = useState(1);
  const fig = parseFigure(text);

  useEffect(() => {
    const el = ref.current;
    if (!el || !parseFigure(text) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          setProgress(1 - Math.pow(1 - t, 3));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        setProgress(0);
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => (io.disconnect(), cancelAnimationFrame(raf));
  }, [text, duration]);

  if (!fig) return <span>{text}</span>;
  const n = (v: number) => Math.round(v * progress);
  return (
    <span ref={ref} className="tabular-nums" aria-label={text}>
      <span aria-hidden>
        {fig.from !== null && (
          <>
            {n(fig.from)}
            {fig.sep}
          </>
        )}
        {n(fig.to)}
        {fig.suffix}
      </span>
    </span>
  );
}
