import { site } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { RiskubeDiagram } from "./RiskubeDiagram";

/** Dark "how it works" band (Attio scale band / Stripe diagrams) for the Riskube Engine. */
export function PlatformBand() {
  const { platform } = site;
  return (
    <section id="platform" className="relative scroll-mt-16 overflow-hidden bg-night py-24 text-white md:py-32">
      <div className="container-x relative">
        <Reveal className="max-w-3xl">
          <h2 className="text-h2 font-semibold">{platform.title.text}</h2>
        </Reveal>
        <Reveal variant="none" className="mt-14 md:mt-16">
          <RiskubeDiagram />
        </Reveal>
      </div>
    </section>
  );
}
