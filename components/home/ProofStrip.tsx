import { site } from "@/content/site";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";

/** Attio "any scale" / Ramp numbers row: the three published results, in place of a logo wall. */
export function ProofStrip() {
  return (
    <section aria-label="Results" className="border-y border-line bg-wash">
      <div className="container-x">
        <dl className="grid divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0">
          {site.why.pillars.map((p, i) => (
            <Reveal key={p.id} delay={i * 110} y={16} className="flex flex-col gap-2 px-2 py-9 md:px-10 md:py-12 md:first:pl-0">
              <dt className="order-2 text-[15px] text-muted">
                <span className="font-medium text-ink-2">{p.title.text}</span>
                <span className="block">{p.result.text}</span>
              </dt>
              <dd className="order-1 text-[clamp(2.75rem,5vw,4rem)] font-semibold leading-none tracking-[-0.04em] text-ink">
                <CountUp text={p.figure.text} />
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
