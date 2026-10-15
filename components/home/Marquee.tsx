"use client";

import { useRef, useState } from "react";
import {
  m,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  useVelocity,
} from "motion/react";
import { site } from "@/content/site";

// % of the doubled row per second at rest; scrolling speeds it up for a moment.
const SPEED = 1.6;

/**
 * The original SMARTER · FASTER · … strip as one line of large type, edge to edge.
 * It drifts with the reading direction (reversing when you scroll up), speeds up
 * briefly with the scroll, pauses under the pointer and when off screen.
 */
export function Marquee() {
  const words = site.marquee.map((w) => w.text);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reduce = useReducedMotion();
  const [hover, setHover] = useState(false);

  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const direction = useRef(-1);
  const x = useTransform(base, (v) => `${v}%`);

  useAnimationFrame((_, delta) => {
    if (!inView || reduce || hover) return;
    const v = velocity.get();
    if (v < -5) direction.current = 1;
    else if (v > 5) direction.current = -1;
    const boost = 1 + Math.min(Math.abs(v) / 600, 4);
    let next = base.get() + direction.current * SPEED * boost * (delta / 1000);
    if (next <= -50) next += 50;
    if (next > 0) next -= 50;
    base.set(next);
  });

  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden} className="flex shrink-0 items-center">
      {words.map((w) => (
        <li key={w} className="flex items-center gap-[0.35em] pr-[0.35em]">
          {w}
          <span aria-hidden className="size-[0.16em] rounded-[0.03em] bg-brand" />
        </li>
      ))}
    </ul>
  );

  return (
    <div
      ref={ref}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      className="overflow-hidden py-10 text-[clamp(2.75rem,8vw,7rem)] font-semibold leading-none tracking-[-0.045em] text-ink md:py-16"
    >
      <m.div className="flex w-max" style={{ x }}>
        {row(false)}
        {row(true)}
      </m.div>
    </div>
  );
}
