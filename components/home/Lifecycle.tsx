"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, animate, m, useInView, useMotionValue, useReducedMotion, type AnimationPlaybackControls, type MotionValue } from "motion/react";
import { site } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Attio-style stage tabs: Monitor → Optimize → Execute. Tabs auto-advance with a
 * filling progress bar (pausing on hover, off-screen, or in a hidden tab); each
 * opens a large panel built from that step's real dashboard cards at native size.
 */

const STEP_MS = 5500;
const ease = [0.22, 1, 0.36, 1] as const;

// Each step's tint and its three cards from the Indilabs dashboard (public/media/film).
const PANELS: Record<string, { tint: string; alts: [string, string, string] }> = {
  monitor: { tint: "#f2f0fe", alts: ["05 Hotspots, +2 vs last month", "Risk Monitoring by metric, Jul vs Jun", "Hotspots by bucket"] },
  optimize: { tint: "#fff7f1", alts: ["4.3 ROI Value, -10 vs last month", "Return on Investment chart", "Test Pipeline, Champion vs Challenger"] },
  execute: { tint: "#e8f2ed", alts: ["40% STP Rate, -5 vs last month", "Automated Resolutions: STP, FCR, Manual", "Strategy Changes: Deployed, On Track, Delayed"] },
};

// Card placement inside the panel's visual area (% of that box). KPI tile floats over the charts.
const LAYOUT = [
  { w: 685, h: 228, cls: "left-[5%] top-[5%] w-[90%] lg:left-[3%] lg:top-[6%] lg:w-[46%] z-20", sizes: "(min-width: 1024px) 300px, 90vw" },
  { w: 685, h: 704, cls: "left-[5%] top-[33%] w-[90%] lg:left-[9%] lg:top-[27%] lg:w-[50%] z-10", sizes: "(min-width: 1024px) 330px, 90vw" },
  { w: 685, h: 704, cls: "hidden lg:block lg:left-[52%] lg:top-[13%] lg:w-[45%]", sizes: "300px" },
];

const subscribeVisibility = (cb: () => void) => {
  document.addEventListener("visibilitychange", cb);
  return () => document.removeEventListener("visibilitychange", cb);
};

export function Lifecycle() {
  const { lifecycle } = site;
  const steps = lifecycle.steps;
  const root = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const inView = useInView(root, { amount: 0.4 });
  const tabVisible = useSyncExternalStore(subscribeVisibility, () => !document.hidden, () => true);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const running = inView && tabVisible && !hovered && !reduce;

  // progress of the active tab, 0 → 1; drives the tab's fill bar without re-rendering
  const progress = useMotionValue(0);
  const playback = useRef<AnimationPlaybackControls | null>(null);
  const runningRef = useRef(running);

  useEffect(() => {
    runningRef.current = running;
    if (running) playback.current?.play();
    else playback.current?.pause();
  }, [running]);

  useEffect(() => {
    progress.set(0);
    if (reduce) return;
    const c = animate(progress, 1, { duration: STEP_MS / 1000, ease: "linear", onComplete: () => setActive((a) => (a + 1) % steps.length) });
    playback.current = c;
    if (!runningRef.current) c.pause();
    return () => c.stop();
  }, [active, reduce, progress, steps.length]);

  const tabs = useRef<HTMLDivElement>(null);
  const onKey = (e: React.KeyboardEvent) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = (active + d + steps.length) % steps.length;
    setActive(next);
    tabs.current?.querySelectorAll<HTMLButtonElement>("[role=tab]")[next]?.focus();
  };

  const step = steps[active];
  const panel = PANELS[step.id];

  return (
    <section id="lifecycle" className="relative border-t border-line bg-wash py-24 md:py-32">
      <div ref={root} className="container-x">
        <Reveal className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <h2 className="text-h2 font-semibold">{lifecycle.engine.text}</h2>
          <div>
            <p className="text-lg text-muted">{lifecycle.engineNote.text}</p>
            {/* Origination → Portfolio → Collections → Recoveries */}
            <ol className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1.5 font-mono text-xs uppercase tracking-[0.08em] text-ink-2" aria-label="Lending lifecycle">
              {lifecycle.stages.map((s, i) => (
                <li key={s.text} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden className="text-faint">→</span>}
                  <span className="rounded-full border border-line bg-paper px-2.5 py-1">{s.text}</span>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>

        <Reveal delay={100} className="mt-12 md:mt-14">
          <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            {/* Stage tabs */}
            <div ref={tabs} role="tablist" aria-label={lifecycle.engine.text} onKeyDown={onKey} className="grid grid-cols-3 gap-1.5 rounded-2xl border border-line bg-paper p-1.5">
              {steps.map((s, i) => {
                const on = i === active;
                return (
                  <button
                    key={s.id}
                    role="tab"
                    id={`step-tab-${s.id}`}
                    aria-selected={on}
                    aria-controls="step-panel"
                    tabIndex={on ? 0 : -1}
                    onClick={() => setActive(i)}
                    className={`relative overflow-hidden rounded-xl px-3 py-3 text-left transition-colors duration-300 md:px-5 md:py-4 ${on ? "bg-sunk" : "hover:bg-wash"}`}
                  >
                    <span className={`block font-mono text-[11px] tracking-wide transition-colors ${on ? "text-brand-ink" : "text-faint"}`}>0{i + 1}</span>
                    <span className={`mt-0.5 block text-[15px] font-semibold transition-colors md:text-lg ${on ? "text-ink" : "text-muted"}`}>{s.name.text}</span>
                    {on && !reduce && <TabProgress progress={progress} />}
                  </button>
                );
              })}
            </div>

            {/* Panel */}
            <div
              id="step-panel"
              role="tabpanel"
              aria-labelledby={`step-tab-${step.id}`}
              className="mt-3 grid overflow-hidden rounded-3xl border border-line bg-paper lg:min-h-[34rem] lg:grid-cols-[0.8fr_1.2fr]"
            >
              <div className="relative p-7 md:p-10">
                <AnimatePresence mode="popLayout" initial={false}>
                  <m.div key={step.id} initial="out" animate="in" exit="gone">
                    <m.p variants={text(0)} className="font-mono text-xs uppercase tracking-[0.08em] text-brand-ink">
                      {step.label.text}
                    </m.p>
                    <m.h3 variants={text(1)} className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
                      {step.name.text}
                    </m.h3>
                    <ul className="mt-8 grid gap-3">
                      {step.actions.map((a, k) => (
                        <m.li key={a.text} variants={text(2 + k)} className="flex items-center gap-3 rounded-xl border border-line bg-wash px-4 py-3 text-[15px] font-medium text-ink-2">
                          <span aria-hidden className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-wash text-brand-ink">
                            <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3.5 8.5 6.5 11.5 12.5 5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                          {a.text}
                        </m.li>
                      ))}
                    </ul>
                  </m.div>
                </AnimatePresence>
              </div>

              {/* Product visual: the step's three real cards, composed like a dashboard */}
              <m.div
                className="relative aspect-[10/11] overflow-hidden lg:aspect-auto"
                animate={{ backgroundColor: panel.tint }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                style={{ backgroundColor: panel.tint }}
              >
                <div aria-hidden className="dot-field absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
                <AnimatePresence initial={false}>
                  <m.div key={step.id} className="absolute inset-0" initial="out" animate="in" exit="gone">
                    {LAYOUT.map((l, k) => (
                      <m.div key={k} variants={card(k)} className={`absolute ${l.cls}`}>
                        <div className="lifecycle-float" style={{ animationDelay: `${k * -1.3}s` }}>
                          <Image
                            src={`/media/film/${step.id}-${k + 1}.webp`}
                            alt={`Indilabs ${step.label.text}: ${panel.alts[k]}`}
                            width={l.w}
                            height={l.h}
                            quality={80}
                            sizes={l.sizes}
                            className="h-auto w-full rounded-xl shadow-[0_24px_50px_-24px_rgba(17,17,19,.4),0_2px_6px_-2px_rgba(17,17,19,.08)]"
                          />
                        </div>
                      </m.div>
                    ))}
                  </m.div>
                </AnimatePresence>
              </m.div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function TabProgress({ progress }: { progress: MotionValue<number> }) {
  return (
    <span aria-hidden className="absolute inset-x-3 bottom-1.5 h-[2px] overflow-hidden rounded-full bg-ink/10 md:inset-x-5">
      <m.span className="absolute inset-0 origin-left rounded-full bg-brand" style={{ scaleX: progress }} />
    </span>
  );
}

const text = (k: number) => ({
  out: { opacity: 0, y: 14 },
  in: { opacity: 1, y: 0, transition: { duration: 0.55, ease, delay: 0.05 + k * 0.06 } },
  gone: { opacity: 0, y: -8, transition: { duration: 0.2 } },
});

const card = (k: number) => ({
  out: { opacity: 0, y: 36, scale: 0.97 },
  in: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 120, damping: 20, delay: 0.08 + k * 0.1 } },
  gone: { opacity: 0, y: -20, transition: { duration: 0.35, ease } },
});
