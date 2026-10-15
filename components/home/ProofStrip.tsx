import type { CSSProperties } from "react";
import { site } from "@/content/site";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";

/** Attio "any scale" / Ramp numbers row: the three published results, in place of a logo wall. */
export function ProofStrip() {
  return (
    <section aria-label="Results" className="bg-wash">
      <div className="container-x">
        <dl className="grid gap-x-10 md:grid-cols-3">
          {site.why.pillars.map((p, i) => (
            <Reveal key={p.id} variant="none" delay={i * 120} className="flex flex-col py-9 md:py-14">
              <dt className="order-3 mt-4 text-base text-muted">
                <span className="font-medium text-ink">{p.title.text}</span>
                <span className="block">{p.result.text}</span>
              </dt>
              <dd className="order-1 text-[clamp(2.75rem,5vw,4rem)] font-semibold leading-none tracking-[-0.04em] text-ink">
                <CountUp text={p.figure.text} />
              </dd>
              {/* Brand bar draws in alongside the count */}
              <span
                aria-hidden
                className="draw-x order-2 mt-4 block h-[3px] w-14 rounded-full bg-brand"
                style={{ "--dx": `${200 + i * 120}ms` } as CSSProperties}
              />
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
