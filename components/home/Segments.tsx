"use client";

import { Fragment, useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { AnimatePresence, m } from "motion/react";
import { site } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { useMediaQuery } from "@/components/ui/useMediaQuery";

// The five capability loops that ship with indilabs.ai but were never shown.
const VIDEOS: Record<string, string> = {
  "digital-lenders": "credit_strategy",
  "financial-firms": "portfolio_managment",
  banks: "collection_strategy",
  insurance: "retention",
  agencies: "recoveries",
};

const subscribeHash = (cb: () => void) => {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
};

export function Segments() {
  const { segments } = site;
  const ids = segments.items.map((s) => s.id);
  const hash = useSyncExternalStore(subscribeHash, () => window.location.hash.slice(1), () => "");
  // A tab click wins until the URL hash changes again (e.g. a nav link to /#banks).
  const [picked, setPicked] = useState<{ id: string; hash: string } | null>(null);
  const fromHash = (ids as string[]).includes(hash) ? hash : ids[0];
  const active = picked && picked.hash === hash ? picked.id : fromHash;
  const item = segments.items.find((s) => s.id === active)!;

  const tabs = useRef<HTMLDivElement>(null);
  const indicator = useSlidingIndicator(tabs, active);
  const onKey = (e: React.KeyboardEvent) => {
    const i = ids.indexOf(active as (typeof ids)[number]);
    const next = e.key === "ArrowDown" || e.key === "ArrowRight" ? i + 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? i - 1 : null;
    if (next === null) return;
    e.preventDefault();
    const id = ids[(next + ids.length) % ids.length];
    setPicked({ id, hash });
    tabs.current?.querySelector<HTMLButtonElement>(`[data-id="${id}"]`)?.focus();
  };

  return (
    <section id="segments" className="relative scroll-mt-16 py-24 md:py-32">
      {ids.map((id) => (
        <span key={id} id={id} aria-hidden className="absolute -top-4" />
      ))}
      <Reveal className="container-x">
        <h2 className="max-w-4xl text-h2 font-semibold">{segments.title.text}</h2>
      </Reveal>
      <div className="container-x mt-10 grid gap-8 lg:mt-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal className="min-w-0">
          <div
            ref={tabs}
            role="tablist"
            aria-orientation="vertical"
            aria-label={segments.eyebrow.text}
            onKeyDown={onKey}
            className="relative flex flex-wrap gap-1 lg:flex-col"
          >
            {/* One indicator that slides to the selected tab, instead of each tab switching on its own */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 rounded-xl bg-sunk transition-[transform,width,height,opacity] duration-500 ease-[var(--ease-out)]"
              style={indicator}
            >
              <span className="absolute left-0 top-1/2 hidden h-6 w-[3px] -translate-y-1/2 rounded-full bg-brand lg:block" />
            </span>
            {segments.items.map((s) => {
              const on = s.id === active;
              return (
                <button
                  key={s.id}
                  data-id={s.id}
                  role="tab"
                  id={`tab-${s.id}`}
                  aria-selected={on}
                  aria-controls="segment-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => setPicked({ id: s.id, hash })}
                  className={`relative shrink-0 rounded-xl px-4 py-3 text-left text-base font-medium transition-[color,transform] duration-200 active:scale-[.98] lg:px-5 lg:py-4 lg:text-xl ${
                    on ? "text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {s.label.text}
                </button>
              );
            })}
          </div>
        </Reveal>

        <div
          id="segment-panel"
          role="tabpanel"
          aria-labelledby={`tab-${active}`}
          className="relative isolate flex min-h-[26rem] min-w-0 flex-col justify-end overflow-hidden rounded-3xl bg-wash p-8 md:p-12"
        >
          <SegmentVideo name={VIDEOS[active]} />
          <div aria-hidden className="absolute inset-0 -z-10 bg-wash/75" />
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={item.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
            >
              <p className="text-base font-medium text-brand-ink">{item.label.text}</p>
              <p className="word-rise mt-4 text-xl leading-relaxed text-ink md:text-2xl md:leading-[1.45]">
                {item.body.text.split(" ").map((w, i) => (
                  <Fragment key={i}>
                    <span style={{ "--w": i } as CSSProperties}>{w}</span>{" "}
                  </Fragment>
                ))}
              </p>
            </m.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

const noop = () => () => {};

/** Only the active segment's loop is mounted, client-side, so muted autoplay is allowed. Loops crossfade on change. */
function SegmentVideo({ name }: { name: string }) {
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  if (!mounted || reduce) return null;
  return (
    <AnimatePresence initial={false}>
      <m.video
        key={name}
        aria-hidden
        autoPlay
        muted
        loop
        playsInline
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 0.6, scale: 1, transition: { opacity: { duration: 0.8 }, scale: { duration: 1.6, ease: [0.33, 1, 0.68, 1] } } }}
        exit={{ opacity: 0, transition: { duration: 0.8 } }}
        className="absolute inset-0 -z-20 size-full object-cover mix-blend-multiply"
      >
        <source src={`/media/video/${name}.mp4`} type="video/mp4" />
      </m.video>
    </AnimatePresence>
  );
}

/** Position of the selected tab inside the tab list, kept current on resize. */
function useSlidingIndicator(list: React.RefObject<HTMLDivElement | null>, active: string): CSSProperties {
  const [box, setBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  useLayoutEffect(() => {
    const el = list.current;
    if (!el) return;
    const measure = () => {
      const tab = el.querySelector<HTMLElement>(`[data-id="${active}"]`);
      if (tab) setBox({ x: tab.offsetLeft, y: tab.offsetTop, w: tab.offsetWidth, h: tab.offsetHeight });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [list, active]);
  return box ? { transform: `translate(${box.x}px, ${box.y}px)`, width: box.w, height: box.h } : { opacity: 0 };
}
