"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { site } from "@/content/site";

/**
 * Hero product reel: a camera move over Indilabs' own three-step dashboard
 * (Frame 440 from indilabs.ai). It zooms into each step column in turn,
 * drifts down it, then pulls back out. No new UI is drawn.
 */

// Column centres measured on the 2476×2044 source image.
const COLS = [0.17, 0.5, 0.83];
const SCALE = 1.85;

type Shot = { fx: number; fy: number; s: number; hold: number; move: number; step: number | null };

const SHOTS: Shot[] = [
  { fx: 0.5, fy: 0.5, s: 1, hold: 2600, move: 1300, step: null },
  ...COLS.flatMap((fx, i) => [
    { fx, fy: 0.3, s: SCALE, hold: 300, move: 1300, step: i },
    { fx, fy: 0.62, s: SCALE, hold: 900, move: 2600, step: i },
  ]),
];

/** Translate that brings (fx, fy) to the centre at scale s, clamped so no edge shows. */
function transformFor({ fx, fy, s }: Shot) {
  const max = ((s - 1) / 2) * 100;
  const clamp = (v: number) => Math.max(-max, Math.min(max, v));
  const tx = clamp(-(fx - 0.5) * s * 100);
  const ty = clamp(-(fy - 0.5) * s * 100);
  return `translate(${tx}%, ${ty}%) scale(${s})`;
}

export function ProductReel() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const shot = SHOTS[i];

  // Always open on the full dashboard; only tour while the reel is on screen.
  const [wasInView, setWasInView] = useState(inView);
  if (inView !== wasInView) {
    setWasInView(inView);
    if (!inView) setI(0);
  }

  useEffect(() => {
    if (reduce || paused || !inView) return;
    const t = setTimeout(() => setI((n) => (n + 1) % SHOTS.length), shot.move + shot.hold);
    return () => clearTimeout(t);
  }, [i, paused, reduce, shot, inView]);

  const activeStep = reduce ? null : shot.step;
  const jump = (step: number | null) => setI(step === null ? 0 : 1 + step * 2);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative overflow-hidden rounded-[14px] bg-paper ring-1 ring-ink/10 shadow-[0_40px_80px_-30px_rgba(17,17,19,.35),0_12px_24px_-12px_rgba(17,17,19,.18)]">
        <div className="relative aspect-[2476/2044] w-full">
          <Image
            src="/media/product-dashboard.webp"
            alt="Indilabs.ai dashboard: Step 1 Monitoring & Diagnostics, Step 2 Strategy Optimisation, Step 3 Execution"
            fill
            preload
            sizes="(min-width: 1280px) 2400px, 200vw"
            quality={80}
            className="origin-center will-change-transform"
            style={{
              transform: reduce ? undefined : transformFor(shot),
              transition: reduce ? undefined : `transform ${shot.move}ms cubic-bezier(.65,0,.35,1)`,
            }}
          />
        </div>

        {/* Step caption, Attio-style chip */}
        <div
          aria-live="polite"
          className={`pointer-events-none absolute left-4 top-4 rounded-full bg-ink/85 px-3 py-1.5 font-mono text-[11px] tracking-wide text-white backdrop-blur transition-opacity duration-500 sm:left-6 sm:top-6 sm:text-xs ${
            activeStep === null ? "opacity-0" : "opacity-100"
          }`}
        >
          {activeStep !== null && site.lifecycle.steps[activeStep].label.text}
        </div>
      </div>

      {/* Progress / controls */}
      {!reduce && (
        <div className="mt-5 flex items-center justify-center gap-2" role="group" aria-label="Dashboard tour">
          {[null, 0, 1, 2].map((step) => {
            const on = step === shot.step;
            const label = step === null ? site.brand.name.text : site.lifecycle.steps[step].name.text;
            return (
              <button
                key={String(step)}
                type="button"
                onClick={() => jump(step)}
                aria-pressed={on}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  on ? "bg-ink text-white" : "text-muted hover:bg-sunk hover:text-ink"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
