"use client";

import { useRef } from "react";
import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { HeroFilm } from "./HeroFilm";

/**
 * The product stage under the hero copy: the film in a tilted frame that
 * straightens as you scroll into it (Attio/Ramp).
 */
export function HeroStage() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.25"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [12, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);

  return (
    <div ref={ref} className="relative mx-auto max-w-6xl [perspective:1600px]">
      <m.div style={reduce ? undefined : { rotateX, scale }} className="relative origin-top">
        <HeroFilm />
      </m.div>
    </div>
  );
}
