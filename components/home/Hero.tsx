import Image from "next/image";
import type { CSSProperties } from "react";
import { site } from "@/content/site";
import { Arrow, Button } from "@/components/ui/Button";
import { LineRise, Rise } from "@/components/ui/Rise";
import { HeroStage } from "./HeroStage";

// Icons for Secure / Scalable / World-Class, from indilabs.ai (image 74/75/76).
const BADGE_ICONS = ["/media/icon-image-74.png", "/media/icon-image-75.png", "/media/icon-image-76.png"];

export function Hero() {
  const { hero } = site;
  // "AI-Powered Risk, Collections & Debt Sale Platform" → two lines, "& Debt Sale" in brand red.
  const [lineOne, rest] = hero.title.text.split(" & ");
  const restWords = rest.split(" ");
  const highlight = `& ${restWords.slice(0, -1).join(" ")}`;
  const tail = restWords.at(-1);
  return (
    <section className="relative overflow-hidden pb-20 pt-14 md:pb-28 md:pt-20">
      <div className="container-x relative">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <h1 className="text-display font-semibold text-ink">
            <LineRise delay={80}>{lineOne}</LineRise>
            <LineRise delay={180}>
              <span className="whitespace-nowrap text-brand">{highlight}</span> {tail}
            </LineRise>
          </h1>

          <Rise delay={320}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">{hero.subtitle.text}</p>
          </Rise>

          <Rise delay={420} className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button href="#why" variant="secondary">
              {hero.secondaryCta.text}
            </Button>
            <Button href="/demo">
              {hero.primaryCta.text} <Arrow />
            </Button>
          </Rise>

          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-base text-ink-2">
            {hero.badges.map((b, i) => (
              <li key={b.text} className="rise inline-flex items-center gap-2" style={{ "--d": `${520 + i * 80}ms` } as CSSProperties}>
                <Image src={BADGE_ICONS[i]} alt="" width={16} height={16} className="size-4" />
                {b.text}
              </li>
            ))}
          </ul>
        </div>

        <div className="shutter-in mt-14 md:mt-16" style={{ "--d": "640ms" } as CSSProperties}>
          <div>
            <HeroStage />
          </div>
        </div>
      </div>
    </section>
  );
}
