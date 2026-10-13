"use client";

import { useRef } from "react";
import { m, useScroll, useTransform, type MotionValue } from "motion/react";

/**
 * Attio-style statement: each word fills from faint to full colour as the
 * heading scrolls up the screen. `emphasis` words end in ink, the rest in the
 * muted grey, so the lead clause still reads strongest once revealed.
 * Only colour changes per word, driven by one scroll value (no layout work).
 */
export function ScrollWords({ text, emphasis = 0, className = "" }: { text: string; emphasis?: number; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.5"] });
  const words = text.split(" ");
  return (
    <h2 ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1.5) / words.length]} strong={i < emphasis}>
          {w}
        </Word>
      ))}
    </h2>
  );
}

function Word({ progress, range, strong, children }: { progress: MotionValue<number>; range: [number, number]; strong: boolean; children: string }) {
  const color = useTransform(progress, range, ["rgba(30,30,30,0.14)", strong ? "rgba(30,30,30,1)" : "rgba(102,101,109,1)"]);
  return (
    <>
      <m.span style={{ color }}>{children}</m.span>{" "}
    </>
  );
}
