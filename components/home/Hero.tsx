import Image from "next/image";
import { site } from "@/content/site";
import { Arrow, Button } from "@/components/ui/Button";
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
      {/* Background: dotted field fading out, soft brand glow behind the product */}
      <div aria-hidden className="dot-field absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,black,transparent)]" />
      <div
        aria-hidden
        className="absolute left-1/2 top-[38rem] h-[36rem] w-[70rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(232,72,85,.16),transparent)] blur-2xl"
      />

      <div className="container-x relative">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <ul className="mb-7 inline-flex items-center gap-1 rounded-full border border-line bg-paper/80 p-1 pr-1.5 text-[13px] text-ink-2 shadow-sm backdrop-blur">
            {hero.badges.map((b, i) => (
              <li key={b.text} className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 odd:bg-transparent">
                <Image src={BADGE_ICONS[i]} alt="" width={16} height={16} className="size-4 opacity-80" />
                {b.text}
              </li>
            ))}
          </ul>

          <h1 className="text-display font-semibold text-ink">
            <span className="block">{lineOne}</span>
            <span className="block">
              <span className="whitespace-nowrap bg-gradient-to-r from-brand to-brand-deep bg-clip-text text-transparent">{highlight}</span> {tail}
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">{hero.subtitle.text}</p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button href="#why" variant="secondary">
              {hero.secondaryCta.text}
            </Button>
            <Button href="/demo">
              {hero.primaryCta.text} <Arrow />
            </Button>
          </div>
        </div>

        <div className="mt-16 md:mt-20">
          <HeroStage />
        </div>
      </div>
    </section>
  );
}
