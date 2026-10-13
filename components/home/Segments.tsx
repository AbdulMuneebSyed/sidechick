"use client";

import { useRef, useState, useSyncExternalStore } from "react";
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
      <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal className="min-w-0">
          <p className="eyebrow">{segments.eyebrow.text}</p>
          <h2 className="mt-4 text-h2 font-semibold">{segments.title.text}</h2>
          <div
            ref={tabs}
            role="tablist"
            aria-orientation="vertical"
            aria-label={segments.eyebrow.text}
            onKeyDown={onKey}
            className="mt-10 flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible"
          >
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
                  className={`group relative shrink-0 rounded-xl px-4 py-3 text-left text-[15px] font-medium transition lg:px-5 lg:py-4 lg:text-lg ${
                    on ? "bg-paper text-ink shadow-[0_0_0_1px_var(--color-line),0_8px_20px_-12px_rgba(17,17,19,.25)]" : "text-muted hover:text-ink"
                  }`}
                >
                  <span aria-hidden className={`absolute left-0 top-1/2 hidden h-6 w-[3px] -translate-y-1/2 rounded-full bg-brand transition-opacity lg:block ${on ? "opacity-100" : "opacity-0"}`} />
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
          className="relative isolate flex min-h-[26rem] min-w-0 flex-col justify-end overflow-hidden rounded-3xl border border-line bg-wash p-8 md:p-12"
        >
          <SegmentVideo name={VIDEOS[active]} />
          <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-wash via-wash/85 to-wash/20" />
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={item.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
            >
              <p className="font-mono text-xs uppercase tracking-[0.08em] text-brand-ink">{item.label.text}</p>
              <p className="mt-4 text-xl leading-relaxed text-ink md:text-2xl md:leading-[1.45]">{item.body.text}</p>
            </m.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

const noop = () => () => {};

/** Only the active segment's loop is mounted, client-side, so muted autoplay is allowed. */
function SegmentVideo({ name }: { name: string }) {
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  if (!mounted || reduce) return null;
  return (
    <video
      key={name}
      aria-hidden
      autoPlay
      muted
      loop
      playsInline
      className="absolute inset-0 -z-20 size-full animate-[fadeIn_.8s_ease-out] object-cover opacity-60 mix-blend-multiply"
    >
      <source src={`/media/video/${name}.mp4`} type="video/mp4" />
    </video>
  );
}
