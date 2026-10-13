import { site } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { RiskubeDiagram } from "./RiskubeDiagram";

/** Dark "how it works" band (Attio scale band / Stripe diagrams) for the Riskube Engine. */
export function PlatformBand() {
  const { platform } = site;
  return (
    <section id="platform" className="relative scroll-mt-16 overflow-hidden bg-night py-24 text-white md:py-32">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[.35] [background-image:linear-gradient(to_right,rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
      />
      <div aria-hidden className="absolute -left-40 top-1/3 size-[32rem] rounded-full bg-brand/20 blur-[120px]" />
      <div aria-hidden className="absolute -right-40 bottom-0 size-[28rem] rounded-full bg-[#7b6cf6]/20 blur-[120px]" />

      <div className="container-x relative">
        <Reveal className="max-w-3xl">
          <p className="eyebrow !text-brand">{platform.eyebrow.text}</p>
          <h2 className="mt-4 text-h2 font-semibold">{platform.title.text}</h2>
        </Reveal>
        <Reveal delay={120} className="mt-14 md:mt-16">
          <RiskubeDiagram />
        </Reveal>
      </div>
    </section>
  );
}
