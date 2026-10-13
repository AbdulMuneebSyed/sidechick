import type { Metadata } from "next";
import Image from "next/image";
import { ClosingCta } from "@/components/home/ClosingCta";
import { site } from "@/content/site";
import { Arrow, Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: site.nav.about.text,
  description: site.about.title.text,
};

// Value icons from the original About page.
const ICONS = ["/media/about-global.png", "/media/about-performance.png", "/media/about-experiment.png"];

export default function AboutPage() {
  const { about } = site;
  return (
    <>
      <section className="relative overflow-hidden pb-20 pt-16 md:pb-28 md:pt-24">
        <div aria-hidden className="dot-field absolute inset-0 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]" />
        <div className="container-x relative">
          <p className="eyebrow">{site.nav.about.text}</p>
          <h1 className="mt-5 max-w-5xl text-[clamp(2rem,4.6vw,3.75rem)] font-semibold leading-[1.08] tracking-[-0.03em]">
            {about.title.text}
          </h1>
          <div className="mt-10 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <p className="max-w-2xl text-lg leading-relaxed text-muted md:text-xl">{about.body.text}</p>
            <Button href="/demo">
              {about.cta.text} <Arrow />
            </Button>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-wash py-20 md:py-28">
        <div className="container-x grid gap-5 md:grid-cols-3">
          {about.values.map((v, i) => (
            <Reveal key={v.title.text} delay={i * 90}>
              <article className="flex h-full flex-col gap-4 rounded-2xl border border-line bg-paper p-7 md:p-8">
                <span className="grid size-12 place-items-center rounded-xl bg-sunk">
                  <Image src={ICONS[i]} alt="" width={48} height={49} className="size-7" />
                </span>
                <h2 className="text-xl font-semibold tracking-tight">{v.title.text}</h2>
                <p className="leading-relaxed text-muted">{v.body.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="pt-24 md:pt-32">
        <ClosingCta />
      </div>
    </>
  );
}
