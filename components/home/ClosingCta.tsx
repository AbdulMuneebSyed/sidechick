import { site } from "@/content/site";
import { Arrow, Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

/** Ramp-style closing band. */
export function ClosingCta() {
  const { closing, brand } = site;
  return (
    <section className="px-4 pb-24 md:pb-32">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-night px-6 py-20 text-center text-white md:py-28">
        <div aria-hidden className="dot-field absolute inset-0 opacity-[.18] invert [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <div aria-hidden className="absolute -bottom-40 left-1/2 h-80 w-[48rem] -translate-x-1/2 rounded-full bg-brand/35 blur-[110px]" />
        <Reveal className="relative mx-auto max-w-2xl">
          <h2 className="text-h2 font-semibold">{closing.title.text}</h2>
          <p className="mt-5 text-lg text-white/70">{closing.body.text}</p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button href="/demo">
              {closing.cta.text} <Arrow />
            </Button>
            <Button href={`mailto:${brand.email.text}`} variant="light">
              {brand.email.text}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
