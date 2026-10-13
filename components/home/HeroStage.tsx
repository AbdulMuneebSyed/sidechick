"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ProductReel } from "./ProductReel";

/**
 * The product stage under the hero copy: the dashboard reel in a tilted frame
 * that straightens as you scroll (Attio/Ramp), with two of Indilabs' other
 * product screens floating at its corners.
 */
export function HeroStage() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.25"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [14, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  const leftY = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const rightY = useTransform(scrollYProgress, [0, 1], [90, 0]);

  return (
    <div ref={ref} className="relative mx-auto max-w-6xl [perspective:1600px]">
      <motion.div style={reduce ? undefined : { rotateX, scale }} className="relative origin-top">
        <ProductReel />
      </motion.div>

      <motion.figure
        style={reduce ? undefined : { y: leftY }}
        className="pointer-events-none absolute -left-10 bottom-24 hidden w-[34%] xl:block"
        aria-hidden
      >
        <Image
          src="/media/product-treatments.webp"
          alt=""
          width={1386}
          height={832}
          sizes="420px"
          className="h-auto w-full rounded-xl shadow-[0_30px_60px_-25px_rgba(17,17,19,.45)]"
        />
      </motion.figure>
      <motion.figure
        style={reduce ? undefined : { y: rightY }}
        className="pointer-events-none absolute -right-10 bottom-40 hidden w-[30%] xl:block"
        aria-hidden
      >
        <Image
          src="/media/product-recovery.webp"
          alt=""
          width={1178}
          height={706}
          sizes="380px"
          className="h-auto w-full rounded-xl shadow-[0_30px_60px_-25px_rgba(17,17,19,.45)]"
        />
      </motion.figure>
    </div>
  );
}
