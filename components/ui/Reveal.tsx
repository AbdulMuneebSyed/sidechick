"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";

type Variant = "rise" | "settle" | "shutter" | "stagger" | "none";

/**
 * Reveals content as it scrolls into view. Server HTML is fully visible;
 * only elements that start below the fold are hidden, and only once JS runs.
 * The look of each variant lives in globals.css ([data-reveal]), on transform,
 * opacity and clip-path only. "none" only sets data-state, for children that
 * choreograph themselves (.draw-x, .strike, .rk-draw …).
 */
export function Reveal({
  children,
  as: Tag = "div",
  variant = "rise",
  delay = 0,
  x = 0,
  y = 24,
  className = "",
  style,
}: {
  children: ReactNode;
  as?: ElementType;
  variant?: Variant;
  /** ms */
  delay?: number;
  /** px offset to travel from (rise only) */
  x?: number;
  y?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<"idle" | "hidden" | "shown">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let first = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState(first ? "idle" : "shown");
          io.disconnect();
        } else if (first) setState("hidden");
        first = false;
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal={variant}
      data-state={state}
      className={className}
      style={{ "--d": `${delay}ms`, "--rx": `${x}px`, "--ry": `${y}px`, ...style } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
