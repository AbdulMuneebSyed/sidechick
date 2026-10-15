"use client";

import Image from "next/image";
import { useState } from "react";
import { m } from "motion/react";
import { site } from "@/content/site";

/**
 * The Monitor → Optimize → Execute loop from the indilabs.ai hero illustration,
 * rebuilt as an animated SVG. Node positions follow the original: Optimize on
 * top, Execute bottom-right, Monitor bottom-left, travelling clockwise.
 */
const R = 140;
const C = 2 * Math.PI * R;
const ANGLES = [150, 270, 390]; // monitor, optimize, execute (degrees, clockwise from +x)

const pos = (deg: number, r = R) => {
  const a = (deg * Math.PI) / 180;
  return { x: 180 + r * Math.cos(a), y: 180 + r * Math.sin(a) };
};

export function LoopRing({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  const steps = site.lifecycle.steps;
  // Rotate the active arc the short way round (Execute → Monitor goes forward, not back).
  const [rotation, setRotation] = useState(ANGLES[active]);
  const [shown, setShown] = useState(active);
  if (active !== shown) {
    setShown(active);
    let t = ANGLES[active];
    while (t - rotation > 180) t -= 360;
    while (rotation - t > 180) t += 360;
    setRotation(t);
  }
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[22rem]">
      <svg viewBox="0 0 360 360" className="absolute inset-0 size-full overflow-visible" aria-hidden>
        {/* The ring draws itself once when it first comes into view */}
        <m.circle
          cx="180"
          cy="180"
          r={R}
          fill="none"
          stroke="#e8e6e3"
          strokeWidth="2"
          initial={{ pathLength: 0, rotate: -90 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
        />
        {/* Active segment: one third of the ring, rotated to start at the active node */}
        <circle
          cx="180"
          cy="180"
          r={R}
          fill="none"
          stroke="#e84855"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${C / 3 - 6} ${C}`}
          style={{
            transformOrigin: "180px 180px",
            transform: `rotate(${rotation + 2}deg)`,
            transition: "transform 900ms cubic-bezier(.65,0,.35,1)",
          }}
        />
        {/* A pulse that keeps travelling round the loop */}
        <circle r="4.5" fill="#e84855" className="motion-reduce:hidden">
          <animateMotion dur="7s" repeatCount="indefinite" path={`M ${pos(150).x} ${pos(150).y} A ${R} ${R} 0 1 1 ${pos(149.9).x} ${pos(149.9).y}`} />
        </circle>
      </svg>

      {/* Centre: the engine */}
      <div className="absolute inset-[26%] flex flex-col items-center justify-center rounded-full bg-paper text-center">
        <Image src="/media/logo-mark.png" alt="" width={44} height={44} className="size-10" />
        <p className="mt-2 px-3 text-sm font-medium leading-tight text-ink-2">{site.lifecycle.engine.text}</p>
      </div>

      {/* Nodes */}
      {steps.map((s, i) => {
        const p = pos(ANGLES[i]);
        const on = i === active;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelect(i)}
            aria-pressed={on}
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-4 py-2 text-sm font-semibold transition-[background-color,color,transform] duration-300 active:scale-[.96] ${
              on ? "bg-brand-ink text-white" : "bg-paper text-ink-2 hover:bg-sunk hover:text-ink"
            }`}
            style={{ left: `${(p.x / 360) * 100}%`, top: `${(p.y / 360) * 100}%` }}
          >
            {s.name.text}
          </button>
        );
      })}
    </div>
  );
}
