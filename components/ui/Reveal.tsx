"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * Fades content in as it scrolls into view. Server HTML is fully visible;
 * only elements that start below the fold are hidden, and only once JS runs.
 * Plain CSS transitions on transform + opacity, so it costs no animation library.
 */
export function Reveal({
  children,
  delay = 0,
  x = 0,
  y = 24,
  className = "",
}: {
  children: ReactNode;
  /** ms */
  delay?: number;
  /** px offset to travel from */
  x?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
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

  const style: CSSProperties = {
    transform: state === "hidden" ? `translate3d(${x}px, ${y}px, 0)` : undefined,
    transitionDelay: state === "shown" ? `${delay}ms` : undefined,
  };

  return (
    <div
      ref={ref}
      className={`${className} transition-[opacity,transform] duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${state === "hidden" ? "opacity-0" : "opacity-100"}`}
      style={style}
    >
      {children}
    </div>
  );
}
