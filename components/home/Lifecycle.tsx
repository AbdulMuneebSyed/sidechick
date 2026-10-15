"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { m, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { site } from "@/content/site";
import { useMediaQuery } from "@/components/ui/useMediaQuery";
import { Reveal } from "@/components/ui/Reveal";
import { LoopRing } from "./LoopRing";

const SCREENS = [
  { src: "/media/step-monitor.webp", alt: "Indilabs Step 1, Monitoring & Diagnostics: Hotspots, Risk Monitoring" },
  { src: "/media/step-optimize.webp", alt: "Indilabs Step 2, Strategy Optimisation: ROI Value, Return on Investment, Test Pipeline" },
  { src: "/media/step-execute.webp", alt: "Indilabs Step 3, Execution: STP Rate, Automated Resolutions, Strategy Changes" },
];

/**
 * Attio-style sticky stepper. On desktop, scrolling through the section moves
 * Monitor → Optimize → Execute; on mobile it is a tabbed panel that auto-advances.
 */
export function Lifecycle() {
  const { lifecycle } = site;
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress: sectionProgress } = useScroll({ target: section, offset: ["start 0.75", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (isDesktop) setActive(Math.min(2, Math.floor(v * 3)));
  });

  // Mobile: auto-advance while idle.
  useEffect(() => {
    if (isDesktop || reduceMotion) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % 3), 6000);
    return () => clearTimeout(t);
  }, [active, isDesktop, reduceMotion]);

  const select = (i: number) => {
    if (isDesktop && track.current) {
      const start = track.current.getBoundingClientRect().top + window.scrollY;
      const top = start + (track.current.offsetHeight - window.innerHeight) * ((i + 0.5) / 3);
      window.scrollTo({ top, behavior: "smooth" });
    } else setActive(i);
  };

  const step = lifecycle.steps[active];
  // Animate the label/actions only when the step changes, so the first render is plain visible HTML.
  const [shown, setShown] = useState(active);
  const [changed, setChanged] = useState(false);
  if (active !== shown) {
    setShown(active);
    setChanged(true);
  }

  return (
    <section ref={section} id="lifecycle" className="relative bg-wash">
      <div className="container-x pt-24 md:pt-32">
        <Reveal className="max-w-3xl">
          <h2 className="text-h2 font-semibold">{lifecycle.engineNote.text}</h2>
        </Reveal>

        {/* Lifecycle bar: Origination → Portfolio → Collections → Recoveries, filled as you scroll the section */}
        <ol className="mt-10 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4" aria-label="Lending lifecycle">
          {lifecycle.stages.map((s, i) => (
            <Stage key={s.text} label={s.text} index={i} progress={sectionProgress} />
          ))}
        </ol>
      </div>

      {/* Scroll track: 3 screens tall on desktop, sticky panel inside */}
      <div ref={track} data-track className="lg:h-[300vh]">
        <div className="lg:sticky lg:top-0 lg:flex lg:h-dvh lg:items-center">
          <div className="container-x grid items-center gap-10 py-14 lg:grid-cols-[1fr_1.15fr] lg:gap-16 lg:py-0">
            <div className="grid gap-8">
              <LoopRing active={active} onSelect={select} />
              <div className="mx-auto w-full max-w-md" aria-live="polite">
                <m.p
                  key={step.id}
                  initial={changed ? { opacity: 0, y: 6 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-base font-medium text-brand-ink"
                >
                  {step.label.text}
                </m.p>
                <ul key={`${step.id}-actions`} className="mt-4 grid gap-2.5">
                  {step.actions.map((a, k) => (
                    <m.li
                      key={a.text}
                      initial={changed ? { opacity: 0, y: 10 } : false}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.08 + k * 0.06 }}
                      className="flex items-center gap-3 rounded-xl bg-paper px-4 py-3 text-base font-medium">
                      <span aria-hidden className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-wash text-brand-ink">
                        <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3.5 8.5 6.5 11.5 12.5 5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      {a.text}
                    </m.li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Product screen for the active step, slowly panning down */}
            <div data-ui className="relative mx-auto aspect-[4/5] w-full max-w-lg overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_40px_80px_-40px_rgba(17,17,19,.35)] lg:h-[min(80dvh,46rem)] lg:w-auto lg:max-w-none">
              {SCREENS.map((s, i) => (
                <Image
                  key={s.src}
                  src={s.src}
                  alt={s.alt}
                  width={815}
                  height={1798}
                  sizes="(min-width: 1024px) 560px, 100vw"
                  loading="eager"
                  className="absolute inset-x-0 top-0 h-auto w-full"
                  style={{
                    opacity: i === active ? 1 : 0,
                    transform: i === active && !reduceMotion ? "translateY(-43%)" : "translateY(0)",
                    transition: i === active ? "opacity 600ms ease, transform 9s linear" : "opacity 600ms ease, transform 0s 600ms",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** One lifecycle stage: its bar fills over its quarter of the section's scroll. */
function Stage({ label, index, progress }: { label: string; index: number; progress: MotionValue<number> }) {
  const fill = useTransform(progress, [index / 4, (index + 1) / 4], [0, 1], { clamp: true });
  const ink = useTransform(fill, [0, 0.15], ["#66656d", "#111113"]);
  return (
    <li className="grid gap-3">
      <m.span style={{ color: ink }} className="text-base font-semibold tracking-tight">
        {label}
      </m.span>
      <span aria-hidden className="relative block h-1 overflow-hidden rounded-full bg-line">
        <m.span style={{ scaleX: fill }} className="absolute inset-0 origin-left rounded-full bg-brand" />
      </span>
    </li>
  );
}
