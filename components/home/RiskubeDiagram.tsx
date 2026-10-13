import Image from "next/image";
import type { CSSProperties } from "react";
import { site } from "@/content/site";

/**
 * Riskube Engine as an animated-beam diagram (the Vercel / Stripe / Attio
 * "Universal Context" pattern): data travels along curved beams from
 * Multiple Data Types into a glowing engine hub, then fans out to the seven
 * capabilities, each lighting up as its beam arrives. All text is HTML; the
 * beams are one SVG. One 4s CSS cycle drives everything, so it costs no JS.
 */
const P = site.platform;
const [NAME] = P.engine.text.split(" "); // "Riskube"

// Desktop canvas: 1200×560. Hub centre (600, 280); capabilities stacked on the right.
const W = 1200;
const H = 560;
const HUB = { x: 600, y: 280, r: 84 };
const SRC_RIGHT = 262;
const CAP_X = 872;
const CAP_Y = P.capabilities.map((_, i) => 64 + i * 72);
const IN_Y = [236, 280, 324];

const inPath = (y: number) => `M ${SRC_RIGHT} ${y} C ${SRC_RIGHT + 130} ${y}, ${HUB.x - HUB.r - 120} ${HUB.y}, ${HUB.x - HUB.r} ${HUB.y}`;
const outPath = (y: number) => `M ${HUB.x + HUB.r} ${HUB.y} C ${HUB.x + HUB.r + 110} ${HUB.y}, ${CAP_X - 120} ${y}, ${CAP_X} ${y}`;

const pct = (v: number, of: number) => `${(v / of) * 100}%`;
const delay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

function DbIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 14 14" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth="1.3">
      <rect x=".65" y=".65" width="12.7" height="12.7" rx="2" />
      <path d="M.65 5h12.7M.65 9.2h12.7" />
    </svg>
  );
}

function Hub({ className = "" }: { className?: string }) {
  return (
    <div className={`beam-hub relative grid place-items-center rounded-[28px] ${className}`}>
      <span aria-hidden className="beam-hub-ring absolute -inset-3 rounded-[34px] border border-brand/40" />
      <div className="relative grid size-full place-items-center rounded-[28px] border border-white/15 bg-[linear-gradient(160deg,#2a1519,#15151b_60%)] shadow-[0_0_60px_-10px_rgba(232,72,85,.55),inset_0_1px_0_rgba(255,255,255,.08)]">
        <div className="grid justify-items-center gap-2 text-center">
          <Image src="/media/logo-mark.png" alt="" width={40} height={40} className="size-9 md:size-10" />
          <p className="text-lg font-semibold leading-none text-white md:text-xl">
            {NAME.slice(0, 3)}
            <span className="text-brand">{NAME.slice(3)}</span>
          </p>
          <p className="text-[11px] italic leading-none text-white/55">{P.engine.text.slice(NAME.length + 1)}</p>
        </div>
      </div>
    </div>
  );
}

export function RiskubeDiagram() {
  return (
    <figure aria-label={`${P.input.text} → ${P.pipelines.text} → ${P.engine.text} → ${P.architecture.text}`}>
      {/* Desktop: horizontal beams */}
      <div className="relative hidden lg:block" style={{ aspectRatio: `${W} / ${H}` }}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden className="absolute inset-0 size-full overflow-visible">
          <defs>
            <linearGradient id="beam-in" gradientUnits="userSpaceOnUse" x1={SRC_RIGHT} x2={HUB.x - HUB.r} y1="0" y2="0">
              <stop offset="0" stopColor="#ff8c95" stopOpacity="0" />
              <stop offset="1" stopColor="#ff8c95" />
            </linearGradient>
            <linearGradient id="beam-out" gradientUnits="userSpaceOnUse" x1={HUB.x + HUB.r} x2={CAP_X} y1="0" y2="0">
              <stop offset="0" stopColor="#a99ffb" stopOpacity="0" />
              <stop offset="1" stopColor="#ff8c95" />
            </linearGradient>
          </defs>
          {IN_Y.map((y) => (
            <path key={`ib${y}`} d={inPath(y)} className="beam-track" vectorEffect="non-scaling-stroke" />
          ))}
          {CAP_Y.map((y) => (
            <path key={`ob${y}`} d={outPath(y)} className="beam-track" vectorEffect="non-scaling-stroke" />
          ))}
          {IN_Y.map((y, i) => (
            <path key={`ic${y}`} d={inPath(y)} pathLength={1} stroke="url(#beam-in)" className="beam-comet" style={delay(i * 0.12)} vectorEffect="non-scaling-stroke" />
          ))}
          {CAP_Y.map((y, i) => (
            <path key={`oc${y}`} d={outPath(y)} pathLength={1} stroke="url(#beam-out)" className="beam-comet" style={delay(1.4 + i * 0.2)} vectorEffect="non-scaling-stroke" />
          ))}
        </svg>

        {/* Source */}
        <div className="absolute -translate-y-1/2" style={{ left: 0, top: "50%", width: pct(SRC_RIGHT, W) }}>
          <div className="rounded-2xl border border-white/12 bg-white/[.04] p-5 backdrop-blur-sm">
            <div className="flex gap-1.5 text-white/70">
              <DbIcon className="size-4" />
              <DbIcon className="size-4 opacity-70" />
              <DbIcon className="size-4 opacity-40" />
            </div>
            <p className="mt-4 text-lg font-medium leading-snug text-white">{P.input.text}</p>
          </div>
        </div>
        <p className="absolute -translate-x-1/2 text-sm italic text-white/60" style={{ left: pct(SRC_RIGHT + (HUB.x - HUB.r - SRC_RIGHT) / 2, W), top: pct(IN_Y[0] - 46, H) }}>
          {P.pipelines.text}
        </p>

        {/* Engine hub with its two traits */}
        <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: pct(HUB.x, W), top: pct(HUB.y, H), width: pct(HUB.r * 2, W), aspectRatio: "1" }}>
          <Hub className="size-full" />
          <ul className="absolute inset-x-[-40%] -top-12 flex justify-center gap-2">
            {P.engineTraits.map((t) => (
              <li key={t.text} className="rounded-full border border-white/12 bg-white/[.05] px-3 py-1 text-xs text-white/75">
                {t.text}
              </li>
            ))}
          </ul>
        </div>
        <p className="absolute -translate-x-1/2 text-sm italic text-white/60" style={{ left: pct(HUB.x + HUB.r + 90, W), top: pct(HUB.y - 40, H) }}>
          {P.architecture.text}
        </p>

        {/* Capabilities */}
        <ul>
          {P.capabilities.map((c, i) => (
            <li
              key={c.text}
              className="beam-cap absolute flex -translate-y-1/2 items-center gap-3 rounded-xl border border-white/10 bg-white/[.04] px-4 py-2.5 text-[15px] text-white/85"
              style={{ left: pct(CAP_X, W), top: pct(CAP_Y[i], H), width: pct(W - CAP_X, W), ...delay(1.4 + i * 0.2) }}
            >
              <span aria-hidden className="beam-cap-dot size-1.5 shrink-0 rounded-full bg-white/30" />
              {c.text}
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile / tablet: vertical flow */}
      <div className="mx-auto grid max-w-md justify-items-center lg:hidden">
        <div className="w-full rounded-2xl border border-white/12 bg-white/[.04] p-5">
          <div className="flex gap-1.5 text-white/70">
            <DbIcon className="size-4" />
            <DbIcon className="size-4 opacity-70" />
            <DbIcon className="size-4 opacity-40" />
          </div>
          <p className="mt-3 text-lg font-medium text-white">{P.input.text}</p>
        </div>
        <VBeam label={P.pipelines.text} />
        <ul className="mb-4 flex gap-2">
          {P.engineTraits.map((t) => (
            <li key={t.text} className="rounded-full border border-white/12 bg-white/[.05] px-3 py-1 text-xs text-white/75">
              {t.text}
            </li>
          ))}
        </ul>
        <Hub className="size-40" />
        <VBeam label={P.architecture.text} late />
        <ul className="grid w-full gap-2">
          {P.capabilities.map((c, i) => (
            <li key={c.text} className="beam-cap flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.04] px-4 py-3 text-[15px] text-white/85" style={delay(1.4 + i * 0.2)}>
              <span aria-hidden className="beam-cap-dot size-1.5 shrink-0 rounded-full bg-white/30" />
              {c.text}
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}

function VBeam({ label, late = false }: { label: string; late?: boolean }) {
  return (
    <div className="relative flex h-20 w-full items-center justify-center">
      <span aria-hidden className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 overflow-hidden bg-white/12">
        <span className="beam-vcomet absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-transparent to-[#ff8c95]" style={delay(late ? 1.5 : 0)} />
      </span>
      <span className="relative rounded-full bg-night px-2 text-sm italic text-white/60">{label}</span>
    </div>
  );
}
