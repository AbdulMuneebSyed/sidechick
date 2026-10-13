"use client";

import type { ReactNode } from "react";
import { LazyMotion, MotionConfig } from "motion/react";

const loadFeatures = () => import("./motion-features").then((mod) => mod.default);

/**
 * Site-wide Motion setup. LazyMotion + `m` components ship only the animation
 * features we use (no layout/drag engine), fetched after first render so they
 * never delay the page; reducedMotion="user" turns
 * transform animations into plain fades for people who ask for less motion.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadFeatures} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  );
}
