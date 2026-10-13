"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import {
  animate,
  m,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type AnimationPlaybackControls,
  type MotionValue,
  type Variants,
} from "motion/react";
import { site } from "@/content/site";
import { ui } from "@/content/ui";

/**
 * Hero film: a short, looping product sequence cut from Indilabs' own dashboard.
 * Overview → Monitor → Optimize → Execute → results. Every card is a native-size
 * crop of the original image moving as its own layer, so nothing is upscaled.
 * Animates transform and opacity only, and pauses off-screen or in a hidden tab.
 */

const STEPS = site.lifecycle.steps;
const [, COLLECTIONS, RECOVERY] = site.why.pillars;

const SHOTS = [
  { chapter: 0, ms: 1800, tint: "#faf9f7" },
  { chapter: 1, ms: 2800, tint: "#f2f0fe" },
  { chapter: 2, ms: 2800, tint: "#fff7f1" },
  { chapter: 3, ms: 2500, tint: "#e8f2ed" },
  { chapter: 3, ms: 2800, tint: "#fdf0f1" },
];
const CHAPTERS = [site.brand.name.text, ...STEPS.map((s) => s.name.text)];
const CHAPTER_MS = CHAPTERS.map((_, c) => SHOTS.filter((s) => s.chapter === c).reduce((a, s) => a + s.ms, 0));
const SHOT_OFFSET = SHOTS.map((s, i) => SHOTS.slice(0, i).filter((p) => p.chapter === s.chapter).reduce((a, p) => a + p.ms, 0));
const RESULTS = 4;

// Placement in % of the wide (1200×720) and narrow (400×520) canvas; null hides it on narrow.
type Box = { x: number; y: number; w: number };
type Place = { wide: Box; narrow: Box | null };
const place = ({ wide, narrow }: Place): CSSProperties =>
  ({
    "--wx": `${wide.x}%`,
    "--wy": `${wide.y}%`,
    "--ww": `${wide.w}%`,
    ...(narrow ? { "--tx": `${narrow.x}%`, "--ty": `${narrow.y}%`, "--tw": `${narrow.w}%` } : { "--td": "none" }),
  }) as Record<`--${string}`, string>;

const OVERVIEW: Place = { wide: { x: 16, y: 5, w: 68 }, narrow: { x: 3, y: 20, w: 94 } };
const CARDS: Place[] = [
  { wide: { x: 39.5, y: 17, w: 27.5 }, narrow: { x: 6, y: 21, w: 88 } },
  { wide: { x: 39.5, y: 34.4, w: 27.5 }, narrow: { x: 6, y: 46, w: 88 } },
  { wide: { x: 69, y: 24, w: 27.5 }, narrow: null },
];
const WINDOWS = [
  { src: "/media/product-treatments.webp", w: 1386, h: 832, place: { wide: { x: 40, y: 11, w: 50 }, narrow: { x: 4, y: 30, w: 86 } }, sizes: "(min-width: 1240px) 590px, (min-width: 640px) 49vw, 86vw" },
  { src: "/media/product-recovery.webp", w: 1178, h: 706, place: { wide: { x: 53, y: 44, w: 43 }, narrow: { x: 14, y: 56, w: 82 } }, sizes: "(min-width: 1240px) 510px, (min-width: 640px) 42vw, 82vw" },
];
const CARD_SIZE = [
  { w: 685, h: 228 },
  { w: 685, h: 704 },
  { w: 685, h: 704 },
];
// Column centres on the dashboard, used to zoom "into" the step that comes next.
const COL_X = [0.17, 0.5, 0.83];

type Phase = "before" | "on" | "after";
const phaseOf = (i: number, active: number): Phase => (i === active ? "on" : i < active ? "after" : "before");

const ease = [0.22, 1, 0.36, 1] as const;
const layer: Variants = {
  before: { opacity: 0, y: 40, scale: 0.97, transition: { duration: 0.35 }, transitionEnd: { visibility: "hidden" } },
  after: { opacity: 0, y: -28, transition: { duration: 0.4, ease }, transitionEnd: { visibility: "hidden" } },
  on: (k: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    visibility: "visible",
    transition: { type: "spring", stiffness: 190, damping: 24, delay: 0.1 + k * 0.08 },
  }),
};
const line: Variants = {
  before: { opacity: 0, y: 16, transition: { duration: 0.25 }, transitionEnd: { visibility: "hidden" } },
  after: { opacity: 0, y: -12, transition: { duration: 0.3 }, transitionEnd: { visibility: "hidden" } },
  on: (k: number) => ({ opacity: 1, y: 0, visibility: "visible", transition: { duration: 0.45, ease, delay: 0.08 + k * 0.05 } }),
};

const shadow = "shadow-[0_18px_40px_-18px_rgba(17,17,19,.35),0_2px_6px_-2px_rgba(17,17,19,.08)]";
const radius = "rounded-[clamp(6px,1.1cqw,14px)]";
const captionBox =
  "absolute left-[6%] right-[6%] top-[5%] @min-[40rem]:right-auto @min-[40rem]:left-[5.5%] @min-[40rem]:top-1/2 @min-[40rem]:w-[31%] @min-[40rem]:-translate-y-1/2";

const subscribeVisibility = (cb: () => void) => {
  document.addEventListener("visibilitychange", cb);
  return () => document.removeEventListener("visibilitychange", cb);
};

export function HeroFilm() {
  const root = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  // Wait until the visitor has scrolled the film well into view; its top edge already peeks in on load.
  const inView = useInView(root, { amount: 0.65 });
  const tabVisible = useSyncExternalStore(subscribeVisibility, () => !document.hidden, () => true);
  const [shot, setShot] = useState(0);
  const [paused, setPaused] = useState(false);
  const running = inView && tabVisible && !paused && !reduce;

  // t = ms elapsed in the current shot; drives the chapter progress bars without re-rendering.
  const t = useMotionValue(0);
  const shotMV = useMotionValue(0);
  const playback = useRef<AnimationPlaybackControls | null>(null);
  const runningRef = useRef(running);

  useEffect(() => {
    runningRef.current = running;
    if (running) playback.current?.play();
    else playback.current?.pause();
  }, [running]);

  useEffect(() => {
    shotMV.set(shot);
    t.set(0);
    if (reduce) return;
    const ms = SHOTS[shot].ms;
    const c = animate(t, ms, { duration: ms / 1000, ease: "linear", onComplete: () => setShot((s) => (s + 1) % SHOTS.length) });
    playback.current = c;
    if (!runningRef.current) c.pause();
    return () => c.stop();
  }, [shot, reduce, t, shotMV]);

  const chapter = SHOTS[shot].chapter;
  const jump = (c: number) => setShot(SHOTS.findIndex((s) => s.chapter === c));

  return (
    <div ref={root} className="film">
      <div
        role="img"
        aria-label="Indilabs.ai dashboard: Step 1 Monitoring & Diagnostics, Step 2 Strategy Optimisation, Step 3 Execution"
        className={`film-canvas relative overflow-hidden rounded-[18px] bg-wash ring-1 ring-ink/10 ${shadow}`}
      >
        {SHOTS.map((s, i) => (
          <m.div
            key={i}
            aria-hidden
            className="absolute inset-0"
            style={{ backgroundColor: s.tint }}
            initial={false}
            animate={{ opacity: i === shot ? 1 : 0 }}
            transition={{ duration: 0.8 }}
          />
        ))}
        <div aria-hidden className="dot-field absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_45%,black,transparent)]" />

        <div aria-hidden className="absolute inset-0 @max-[40rem]:[mask-image:linear-gradient(to_bottom,black_88%,transparent)]">
          {/* Overview: the full dashboard, zooming toward the next step's column as it leaves */}
          <m.div
            className="film-layer"
            style={{ ...place(OVERVIEW), originX: COL_X[Math.min(Math.max(shot - 1, 0), 2)], originY: 0.42 }}
            initial={false}
            animate={shot === 0 ? "on" : "off"}
            variants={{
              on: { opacity: 1, scale: 1, visibility: "visible", transition: { duration: 0.8, ease } },
              off: { opacity: 0, scale: 1.35, transition: { duration: 0.7, ease: [0.65, 0, 0.35, 1] }, transitionEnd: { visibility: "hidden" } },
            }}
          >
            <Image
              src="/media/product-dashboard.webp"
              alt=""
              width={2476}
              height={2044}
              preload
              quality={80}
              sizes="(min-width: 1240px) 800px, (min-width: 640px) 66vw, 92vw"
              className={`block h-auto w-full ${radius} ${shadow}`}
            />
          </m.div>

          {STEPS.map((step, i) => (
            <StepShot key={step.id} index={i} phase={phaseOf(i + 1, shot)} ms={SHOTS[i + 1].ms} />
          ))}

          <ResultsShot phase={phaseOf(RESULTS, shot)} />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-0.5 sm:gap-1.5" role="group" aria-label="Dashboard tour">
        {CHAPTERS.map((label, c) => (
          <ChapterButton key={label} index={c} label={label} on={c === chapter} reduce={reduce} t={t} shot={shotMV} onSelect={() => jump(c)} />
        ))}
        {!reduce && (
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? ui.play : ui.pause}
            className="ml-1 grid size-8 shrink-0 place-items-center rounded-full text-muted transition hover:bg-sunk hover:text-ink"
          >
            <svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor" aria-hidden>
              {paused ? <path d="M4.5 2.8v10.4L13 8z" /> : <path d="M4 3h3v10H4zM9 3h3v10H9z" />}
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

function StepShot({ index, phase, ms }: { index: number; phase: Phase; ms: number }) {
  const step = STEPS[index];
  return (
    <div className="absolute inset-0">
      {/* Slow camera drift while the shot holds */}
      <m.div
        className="absolute inset-0"
        initial={false}
        animate={{ y: phase === "on" ? "-1.5%" : "0%" }}
        transition={{ duration: phase === "on" ? ms / 1000 : 0.4, ease: "linear" }}
      >
        {CARDS.map((p, k) => (
          <m.div key={k} custom={k} variants={layer} initial={false} animate={phase} className="film-layer" style={place(p)}>
            <Image
              src={`/media/film/${step.id}-${k + 1}.webp`}
              alt=""
              width={CARD_SIZE[k].w}
              height={CARD_SIZE[k].h}
              quality={80}
              sizes="(min-width: 1240px) 330px, (min-width: 640px) 28vw, 88vw"
              className={`block h-auto w-full ${radius} ${shadow}`}
            />
          </m.div>
        ))}
      </m.div>

      <div className={captionBox}>
        <m.p custom={0} variants={line} initial={false} animate={phase} className="inline-flex rounded-full bg-paper px-2.5 py-1 font-mono text-[10px] tracking-wide text-ink-2 ring-1 ring-ink/10 @min-[40rem]:text-[clamp(10px,1.05cqw,13px)]">
          {step.label.text}
        </m.p>
        <m.p custom={1} variants={line} initial={false} animate={phase} className="mt-2 text-[9cqw] font-semibold leading-none tracking-[-0.035em] text-ink @min-[40rem]:mt-4 @min-[40rem]:text-[5.2cqw]">
          {step.name.text}
        </m.p>
        <ul className="film-wide mt-[2.2cqw] space-y-[1cqw]">
          {step.actions.map((a, k) => (
            <m.li key={a.text} custom={2 + k} variants={line} initial={false} animate={phase} className="flex items-center gap-2 text-[clamp(12px,1.4cqw,17px)] text-ink-2">
              <Check />
              {a.text}
            </m.li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ResultsShot({ phase }: { phase: Phase }) {
  return (
    <div className="absolute inset-0">
      {WINDOWS.map((win, k) => (
        <m.div key={win.src} custom={k} variants={layer} initial={false} animate={phase} className="film-layer" style={place(win.place)}>
          <Image src={win.src} alt="" width={win.w} height={win.h} quality={80} sizes={win.sizes} className={`block h-auto w-full ${radius} ${shadow}`} />
        </m.div>
      ))}

      <div className={`${captionBox} grid grid-cols-2 gap-4 @min-[40rem]:grid-cols-1 @min-[40rem]:gap-[2.4cqw]`}>
        {[COLLECTIONS, RECOVERY].map((p, k) => (
          <m.div key={p.id} custom={k * 2} variants={line} initial={false} animate={phase}>
            <p className="film-wide font-mono text-[clamp(10px,1cqw,12px)] uppercase tracking-[0.08em] text-muted">{p.title.text}</p>
            <p className="text-[8cqw] font-semibold leading-none tracking-[-0.04em] text-brand-ink @min-[40rem]:mt-[0.8cqw] @min-[40rem]:text-[4.4cqw]">{p.figure.text}</p>
            <p className="mt-1 text-[3.2cqw] leading-snug text-ink-2 @min-[40rem]:mt-[0.6cqw] @min-[40rem]:text-[clamp(12px,1.35cqw,16px)]">{p.result.text}</p>
          </m.div>
        ))}
      </div>
    </div>
  );
}

function ChapterButton({
  index,
  label,
  on,
  reduce,
  t,
  shot,
  onSelect,
}: {
  index: number;
  label: string;
  on: boolean;
  reduce: boolean;
  t: MotionValue<number>;
  shot: MotionValue<number>;
  onSelect: () => void;
}) {
  const fill = useTransform([t, shot], ([ms, s]: number[]) =>
    SHOTS[s].chapter === index ? Math.min(1, (SHOT_OFFSET[s] + ms) / CHAPTER_MS[index]) : 0,
  );
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={on}
      className={`relative shrink-0 overflow-hidden rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-3.5 ${
        on ? (reduce ? "bg-ink text-white" : "bg-ink/[.06] text-ink") : "text-muted hover:bg-sunk hover:text-ink"
      }`}
    >
      {!reduce && <m.span aria-hidden className="absolute inset-0 origin-left bg-ink/10" style={{ scaleX: fill }} />}
      <span className="relative">{label}</span>
    </button>
  );
}

// check_circle icon from indilabs.ai
function Check() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-[1.15em] shrink-0 text-brand-ink" fill="currentColor">
      <path d="M10.6 13.8L8.45 11.65C8.26667 11.4667 8.03333 11.375 7.75 11.375C7.46667 11.375 7.23333 11.4667 7.05 11.65C6.86667 11.8333 6.775 12.0667 6.775 12.35C6.775 12.6333 6.86667 12.8667 7.05 13.05L9.9 15.9C10.1 16.1 10.3333 16.2 10.6 16.2C10.8667 16.2 11.1 16.1 11.3 15.9L16.95 10.25C17.1333 10.0667 17.225 9.83333 17.225 9.55C17.225 9.26667 17.1333 9.03333 16.95 8.85C16.7667 8.66667 16.5333 8.575 16.25 8.575C15.9667 8.575 15.7333 8.66667 15.55 8.85L10.6 13.8ZM12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20Z" />
    </svg>
  );
}
