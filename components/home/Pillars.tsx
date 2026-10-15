import Image from "next/image";
import { site } from "@/content/site";
import { Arrow, Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

// Each pillar shows the matching Indilabs product screen, on the tint that step uses in the dashboard.
const VISUALS: Record<string, { src: string; w: number; h: number; tint: string; alt: string; fit: string }> = {
  risk: { src: "/media/step-monitor.webp", w: 815, h: 1798, tint: "bg-[#f4f2fd]", alt: "Indilabs Monitoring & Diagnostics screen: Hotspots and Risk Monitoring", fit: "inset-x-[12%] top-8" },
  collections: { src: "/media/product-treatments.webp", w: 1386, h: 832, tint: "bg-[#fdf5ec]", alt: "Indilabs Treatments screen: Champion and Challenger strategies", fit: "left-6 top-6 w-[120%] md:left-8 md:top-8" },
  recovery: { src: "/media/product-recovery.webp", w: 1178, h: 706, tint: "bg-[#edf6f0]", alt: "Indilabs Vintage Recovery screen", fit: "left-6 top-6 w-[115%] md:left-8 md:top-8" },
};

/**
 * One tall pillar beside two stacked ones, each with its own product screen.
 * Screens drift slightly with scroll and lift a little under the pointer.
 */
export function Pillars() {
  const { why } = site;
  // Statement heading, Attio-style: first clause in ink, the rest muted.
  const [lead, ...restParts] = why.description.text.split(" by ");
  const rest = `by ${restParts.join(" by ")}`;

  return (
    <section id="why" className="scroll-mt-20 py-24 md:py-36">
      <div className="container-x">
        <Reveal className="max-w-[68rem]">
          <h2 className="text-[clamp(1.5rem,2.6vw,2.25rem)] font-semibold leading-[1.15] tracking-[-0.025em]">
            {lead} <span className="text-faint">{rest}</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 md:mt-20 md:grid-cols-[1.05fr_1fr] md:grid-rows-2">
          {why.pillars.map((p, i) => {
            const v = VISUALS[p.id];
            const tall = i === 0;
            return (
              <Reveal key={p.id} delay={i * 110} className={tall ? "md:row-span-2" : ""}>
                <article
                  id={p.id}
                  className={`group flex h-full scroll-mt-24 overflow-hidden rounded-3xl bg-wash ${tall ? "flex-col" : "flex-col lg:flex-row-reverse"}`}
                >
                  <div className={`relative overflow-hidden ${v.tint} ${tall ? "h-72 md:h-auto md:flex-1" : "h-56 lg:h-auto lg:w-[48%] lg:shrink-0"}`}>
                    <div data-ui className="drift absolute inset-0">
                      <div className={`absolute ${v.fit} transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-y-2`}>
                        <Image
                          src={v.src}
                          alt={v.alt}
                          width={v.w}
                          height={v.h}
                          sizes={tall ? "(min-width: 768px) 460px, 100vw" : "(min-width: 768px) 360px, 100vw"}
                          className="h-auto w-full rounded-lg shadow-[0_12px_30px_-14px_rgba(17,17,19,.3)]"
                        />
                      </div>
                    </div>
                  </div>
                  <Reveal variant="stagger" delay={160 + i * 110} className={`flex flex-col gap-3 p-6 md:p-8 ${tall ? "" : "lg:flex-1"}`}>
                    <h3 className={`font-semibold tracking-tight ${tall ? "text-2xl md:text-[1.75rem]" : "text-xl"}`}>{p.title.text}</h3>
                    <p className="text-base leading-relaxed text-ink-2">{p.description.text}</p>
                    <p className="mt-auto flex flex-wrap items-baseline gap-x-2 pt-4">
                      <span className={`font-semibold tracking-tight text-brand-ink ${tall ? "text-4xl" : "text-2xl"}`}>{p.figure.text}</span>
                      <span className="text-sm text-ink-2">{p.result.text}</span>
                    </p>
                  </Reveal>
                </article>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <Button href="/demo">
            {why.cta.text} <Arrow />
          </Button>
        </div>
      </div>
    </section>
  );
}
