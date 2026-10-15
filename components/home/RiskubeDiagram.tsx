import { site } from "@/content/site";

/**
 * The "Platform Capabilities" diagram from indilabs.ai (Capability-Tablet.svg),
 * redrawn as live SVG with real, selectable text:
 * Multiple Data Types → Automated Pipelines → Riskube Engine → Architecture → 7 capabilities.
 * Pulses travel along the paths and each capability lights up in turn.
 */
const P = site.platform;
const ROWS = P.capabilities.map((c, i) => ({ label: c.text, y: 48 + i * 62 }));
const TRUNK_X = 770;
const CHIP_X = 812;
const MID_Y = 234;
// "Riskube Engine" → wordmark "Ris" + red "kube", with "Engine" beneath, as in the original.
const [NAME, SUFFIX] = P.engine.text.split(" ");

function DbIcon({ x, y, color = "currentColor" }: { x: number; y: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y})`} fill="none" stroke={color} strokeWidth="1.4">
      <rect x="0" y="0" width="14" height="14" rx="2" />
      <path d="M0 4.7h14M0 9.3h14" />
      <circle cx="3" cy="2.4" r=".6" fill={color} />
      <circle cx="3" cy="7" r=".6" fill={color} />
      <circle cx="3" cy="11.6" r=".6" fill={color} />
    </g>
  );
}

function Cube({ cx, cy, s = 1 }: { cx: number; cy: number; s?: number }) {
  // Isometric cube, open front like the original illustration.
  const w = 92 * s, h = 52 * s, d = 92 * s;
  const top = `M ${cx} ${cy - h} L ${cx + w} ${cy - h / 2 - 2} L ${cx} ${cy} L ${cx - w} ${cy - h / 2 - 2} Z`;
  return (
    <g className="rk-fade rk-cube" style={{ "--d": "650ms" } as React.CSSProperties}>
      <path d={top} fill="rgba(232,72,85,.10)" stroke="#e84855" strokeWidth="2" strokeLinejoin="round" />
      <path d={`M ${cx - w} ${cy - h / 2 + 6} L ${cx - 6} ${cy + 8} L ${cx - 6} ${cy + d} L ${cx - w} ${cy + d - h / 2 - 6} Z`} fill="rgba(255,255,255,.02)" stroke="#e84855" strokeWidth="2" strokeLinejoin="round" />
      <path d={`M ${cx + w} ${cy - h / 2 + 6} L ${cx + 6} ${cy + 8} L ${cx + 6} ${cy + d} L ${cx + w} ${cy + d - h / 2 - 6} Z`} fill="rgba(255,255,255,.02)" stroke="#e84855" strokeWidth="2" strokeLinejoin="round" />
      <text x={cx} y={cy - h / 2 + 2} textAnchor="middle" className="fill-white text-[19px] font-semibold">
        {NAME.slice(0, 3)}
        <tspan className="fill-brand">{NAME.slice(3)}</tspan>
      </text>
      <text x={cx} y={cy - h / 2 + 18} textAnchor="middle" className="fill-brand text-[10px] italic">
        {SUFFIX}
      </text>
      <text transform={`translate(${cx - w / 2 - 14} ${cy - h + 4}) rotate(-20)`} textAnchor="middle" className="fill-white/70 text-[13px] italic">
        {P.engineTraits[0].text}
      </text>
      <text transform={`translate(${cx + w / 2 + 16} ${cy - h + 4}) rotate(20)`} textAnchor="middle" className="fill-white/70 text-[13px] italic">
        {P.engineTraits[1].text}
      </text>
    </g>
  );
}

export function RiskubeDiagram() {
  const branch = (y: number) => `M ${TRUNK_X} ${MID_Y} L ${TRUNK_X} ${y} L ${CHIP_X} ${y}`;
  return (
    <>
      {/* Desktop: horizontal flow */}
      <div className="hidden lg:block">
        <svg viewBox="0 0 1100 470" className="w-full" role="img" aria-labelledby="riskube-title riskube-desc">
          <title id="riskube-title">{P.engine.text}</title>
          <desc id="riskube-desc">
            {`${P.input.text} flow through ${P.pipelines.text} into the ${P.engine.text}, whose ${P.architecture.text} powers: ${P.capabilities.map((c) => c.text).join(", ")}.`}
          </desc>

          {/* Input box */}
          <g className="rk-fade" style={{ "--d": "0ms" } as React.CSSProperties}>
            <rect x="10" y={MID_Y - 46} width="210" height="92" rx="12" fill="rgba(232,72,85,.08)" stroke="rgba(232,72,85,.55)" />
            <g className="text-white/80">
              <DbIcon x={30} y={MID_Y - 28} />
            </g>
            <text x="30" y={MID_Y + 24} className="fill-white text-[17px] font-medium">
              {P.input.text}
            </text>
          </g>

          {/* Automated Pipelines */}
          <path d={`M 232 ${MID_Y} L 410 ${MID_Y}`} stroke="#e84855" strokeWidth="3" pathLength={1} className="rk-draw" style={{ "--d": "200ms" } as React.CSSProperties} />
          <path d={`M 400 ${MID_Y - 7} L 412 ${MID_Y} L 400 ${MID_Y + 7}`} fill="none" stroke="#e84855" strokeWidth="3" pathLength={1} className="rk-draw" style={{ "--d": "650ms" } as React.CSSProperties} />
          <text x="321" y={MID_Y - 16} textAnchor="middle" className="fill-white/75 text-[14px] italic">
            {P.pipelines.text}
          </text>

          <Cube cx={520} cy={MID_Y - 20} />

          {/* Architecture */}
          <path d={`M 630 ${MID_Y} L ${TRUNK_X} ${MID_Y}`} stroke="#e84855" strokeWidth="3" pathLength={1} className="rk-draw" style={{ "--d": "1100ms" } as React.CSSProperties} />
          <text x="700" y={MID_Y - 16} textAnchor="middle" className="fill-white/75 text-[14px] italic">
            {P.architecture.text}
          </text>

          {/* Trunk + branches */}
          <path d={`M ${TRUNK_X} ${MID_Y} L ${TRUNK_X} ${ROWS[0].y}`} stroke="rgba(255,255,255,.28)" strokeWidth="2.5" pathLength={1} className="rk-draw" style={{ "--d": "1450ms" } as React.CSSProperties} />
          <path d={`M ${TRUNK_X} ${MID_Y} L ${TRUNK_X} ${ROWS.at(-1)!.y}`} stroke="rgba(255,255,255,.28)" strokeWidth="2.5" pathLength={1} className="rk-draw" style={{ "--d": "1450ms" } as React.CSSProperties} />
          {ROWS.map((r, i) => (
            <g key={r.label}>
              <path d={`M ${TRUNK_X} ${r.y} L ${CHIP_X} ${r.y}`} fill="none" stroke="rgba(255,255,255,.28)" strokeWidth="2.5" pathLength={1} className="rk-draw" style={{ "--d": `${1750 + i * 70}ms` } as React.CSSProperties} />
              <g className="riskube-chip rk-fade" style={{ animationDelay: `${i * 0.55}s`, "--d": `${1850 + i * 70}ms` } as React.CSSProperties}>
                <rect x={CHIP_X} y={r.y - 20} width="270" height="40" rx="9" className="riskube-chip-box" />
                <g className="text-white/70">
                  <DbIcon x={CHIP_X + 14} y={r.y - 7} />
                </g>
                <text x={CHIP_X + 42} y={r.y + 5} className="fill-white text-base">
                  {r.label}
                </text>
              </g>
              <circle r="3.5" fill="#ffffff" className="rk-pulse motion-reduce:hidden">
                <animateMotion dur="3.85s" begin={`${i * 0.55}s`} repeatCount="indefinite" keyPoints="0;1;1" keyTimes="0;0.25;1" calcMode="linear" path={branch(r.y)} />
              </circle>
            </g>
          ))}

          {/* Pulses into the engine */}
          {[0, 1.2, 2.4].map((b) => (
            <circle key={b} r="4" fill="#ff8c95" className="rk-pulse motion-reduce:hidden">
              <animateMotion dur="3.6s" begin={`${b}s`} repeatCount="indefinite" path={`M 232 ${MID_Y} L 410 ${MID_Y}`} />
            </circle>
          ))}
          {[0.6, 1.8, 3].map((b) => (
            <circle key={b} r="4" fill="#ff8c95" className="rk-pulse motion-reduce:hidden">
              <animateMotion dur="3.6s" begin={`${b}s`} repeatCount="indefinite" path={`M 630 ${MID_Y} L ${TRUNK_X} ${MID_Y}`} />
            </circle>
          ))}
        </svg>
      </div>

      {/* Mobile: vertical flow */}
      <div className="mx-auto grid max-w-md justify-items-center gap-3 lg:hidden">
        <div className="flex w-full items-center gap-3 rounded-xl bg-brand/15 px-4 py-4 text-white">
          <svg viewBox="0 0 14 14" className="size-4 text-white/80" aria-hidden>
            <DbIcon x={0} y={0} />
          </svg>
          <span className="font-medium">{P.input.text}</span>
        </div>
        <FlowLabel>{P.pipelines.text}</FlowLabel>
        <svg viewBox="410 125 220 195" className="w-48" aria-label={P.engine.text}>
          <Cube cx={520} cy={200} />
        </svg>
        <FlowLabel>{P.architecture.text}</FlowLabel>
        <ul className="grid w-full gap-2">
          {P.capabilities.map((c, i) => (
            <li
              key={c.text}
              className="riskube-chip-m rk-fade flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.04] px-4 py-3 text-base text-white"
              style={{ animationDelay: `${i * 0.55}s`, "--d": `${600 + i * 70}ms` } as React.CSSProperties}
            >
              <svg viewBox="0 0 14 14" className="size-3.5 text-white/60" aria-hidden>
                <DbIcon x={0} y={0} />
              </svg>
              {c.text}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function FlowLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-1 text-sm italic text-white/70">
      <span className="h-5 w-0.5 bg-brand" />
      {children}
      <span className="h-5 w-0.5 bg-brand" />
    </div>
  );
}
