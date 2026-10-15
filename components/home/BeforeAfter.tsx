import { site } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";

/**
 * "You are here. → Riskube takes you here." with each before/after pair on one row.
 * As a row scrolls in, the old way is struck through and the new one slides in beside it.
 */
export function BeforeAfter() {
  const ba = site.beforeAfter;
  return (
    <section className="py-24 md:py-36">
      <div className="container-x">
        <Reveal variant="stagger" className="mx-auto max-w-3xl text-center">
          <h2 className="text-h2 font-semibold">{ba.title.text}</h2>
          <p className="mt-4 text-lg text-ink-2">{ba.subtitle.text}</p>
        </Reveal>

        {/* Mobile: two stacked lists */}
        <div className="mt-12 grid gap-4 md:hidden">
          <div className="rounded-3xl bg-wash p-6">
            <p className="eyebrow !text-faint">{ba.beforeEyebrow.text}</p>
            <p className="mt-2 text-xl font-semibold text-ink-2">{ba.beforeTitle.text}</p>
            <ul className="mt-5 grid gap-3 text-base text-muted">
              {ba.pairs.map(([before], i) => (
                <Reveal as="li" variant="none" key={before.text} delay={i * 40} className="flex gap-3">
                  <Dot />
                  <span>
                    <span className="strike">{before.text}</span>
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-night p-6 text-white">
            <p className="eyebrow !text-[#ff8c95]">{site.platform.engine.text}</p>
            <p className="mt-2 text-xl font-semibold">{ba.afterTitle.text}</p>
            <ul className="mt-5 grid gap-3 text-base">
              {ba.pairs.map(([, after], i) => (
                <Reveal as="li" variant="none" key={after.text} delay={i * 40 - 300}>
                  <span className="after-in flex gap-3">
                    <Check />
                    {after.text}
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>

        {/* Desktop: aligned pairs */}
        <Reveal variant="settle" className="mt-16 hidden md:block">
          <div className="overflow-hidden rounded-3xl">
            <div className="grid grid-cols-2">
              <div className="bg-sunk px-8 py-7">
                <p className="eyebrow !text-faint">{ba.beforeEyebrow.text}</p>
                <p className="mt-2 text-2xl font-semibold text-ink-2">{ba.beforeTitle.text}</p>
              </div>
              <div className="bg-night px-8 py-7 text-white">
                <p className="eyebrow !text-[#ff8c95]">{site.platform.engine.text}</p>
                <p className="mt-2 text-2xl font-semibold">{ba.afterTitle.text}</p>
              </div>
            </div>

            <ul>
              {ba.pairs.map(([before, after], i) => (
                <Reveal as="li" variant="none" key={before.text} delay={120 + (i % 3) * 60} className="grid grid-cols-2">
                  <div className={`flex items-start gap-3 px-8 py-4 text-base text-muted ${i % 2 ? "bg-sunk" : "bg-wash"}`}>
                    <Dot />
                    <span>
                    <span className="strike">{before.text}</span>
                  </span>
                  </div>
                  <div className={`px-8 py-4 text-base text-white ${i % 2 ? "bg-night-2" : "bg-night"}`}>
                    <div className="after-in flex items-start gap-3">
                      <Check />
                      {after.text}
                    </div>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Dot() {
  return <span aria-hidden className="mt-1.5 size-3 shrink-0 rounded-full border-[1.5px] border-faint" />;
}

function Check() {
  return (
    <span aria-hidden className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand/20 text-[#ff8c95]">
      <svg viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M3.5 8.5 6.5 11.5 12.5 5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
