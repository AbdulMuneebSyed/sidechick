import Image from "next/image";
import { site } from "@/content/site";
import { Arrow, Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

// Each pillar shows the matching Indilabs product screen, on the tint that step uses in the dashboard.
const VISUALS: Record<string, { src: string; w: number; h: number; tint: string; alt: string; fit: string }> = {
  risk: { src: "/media/step-monitor.webp", w: 815, h: 1798, tint: "bg-[#f4f2fd]", alt: "Indilabs Monitoring & Diagnostics screen: Hotspots and Risk Monitoring", fit: "w-[78%] mx-auto" },
  collections: { src: "/media/product-treatments.webp", w: 1386, h: 832, tint: "bg-[#fdf5ec]", alt: "Indilabs Treatments screen: Champion and Challenger strategies", fit: "w-[118%] -ml-2" },
  recovery: { src: "/media/product-recovery.webp", w: 1178, h: 706, tint: "bg-[#edf6f0]", alt: "Indilabs Vintage Recovery screen", fit: "w-[112%] -ml-2" },
};

export function Pillars() {
  const { why } = site;
  // Statement heading, Attio-style: first clause in ink, the rest muted.
  const [lead, ...restParts] = why.description.text.split(" by ");
  const rest = `by ${restParts.join(" by ")}`;

  return (
    <section id="why" className="scroll-mt-20 py-24 md:py-32">
      <div className="container-x">
        <Reveal className="max-w-4xl">
          <p className="eyebrow">{why.eyebrow.text}</p>
          <h2 className="mt-4 text-h2 font-semibold">
            {lead} <span className="text-faint">{rest}</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {why.pillars.map((p, i) => {
            const v = VISUALS[p.id];
            return (
              <Reveal key={p.id} delay={i * 90}>
                <article id={p.id} className="group flex h-full scroll-mt-24 flex-col overflow-hidden rounded-2xl border border-line bg-paper transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-28px_rgba(17,17,19,.35)]">
                  <div className={`relative h-64 overflow-hidden ${v.tint}`}>
                    <div className={`absolute inset-x-0 top-7 ${v.fit} transition-transform duration-500 group-hover:-translate-y-2`}>
                      <Image src={v.src} alt={v.alt} width={v.w} height={v.h} sizes="(min-width: 768px) 420px, 100vw" className="h-auto w-full rounded-lg shadow-[0_12px_30px_-14px_rgba(17,17,19,.35)]" />
                    </div>
                    <div aria-hidden className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-paper/90 to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-6 md:p-7">
                    <h3 className="text-xl font-semibold tracking-tight">{p.title.text}</h3>
                    <p className="text-[15px] leading-relaxed text-muted">{p.description.text}</p>
                    <p className="mt-auto flex items-baseline gap-2 border-t border-line pt-5">
                      <span className="text-2xl font-semibold tracking-tight text-brand-ink">{p.figure.text}</span>
                      <span className="text-sm text-ink-2">{p.result.text}</span>
                    </p>
                  </div>
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
