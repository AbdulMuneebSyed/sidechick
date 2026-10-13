import { site } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";

/** "You are here. → Riskube takes you here." with each before/after pair on one row. */
export function BeforeAfter() {
  const ba = site.beforeAfter;
  return (
    <section className="py-24 md:py-32">
      <div className="container-x">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-h2 font-semibold">{ba.title.text}</h2>
          <p className="mt-4 text-lg text-muted">{ba.subtitle.text}</p>
        </Reveal>

        {/* Mobile: two stacked lists */}
        <div className="mt-12 grid gap-4 md:hidden">
          <div className="rounded-3xl border border-line bg-wash p-6">
            <p className="eyebrow !text-faint">{ba.beforeEyebrow.text}</p>
            <p className="mt-2 text-xl font-semibold text-ink-2">{ba.beforeTitle.text}</p>
            <ul className="mt-5 grid gap-3 text-[15px] text-muted">
              {ba.pairs.map(([before]) => (
                <li key={before.text} className="flex gap-3">
                  <span aria-hidden className="mt-1.5 size-3 shrink-0 rounded-full border-[1.5px] border-faint" />
                  {before.text}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-night p-6 text-white">
            <p className="eyebrow !text-brand">{site.platform.engine.text}</p>
            <p className="mt-2 text-xl font-semibold">{ba.afterTitle.text}</p>
            <ul className="mt-5 grid gap-3 text-[15px]">
              {ba.pairs.map(([, after]) => (
                <li key={after.text} className="flex gap-3">
                  <Check />
                  {after.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Desktop: aligned pairs */}
        <Reveal delay={100} className="mt-14 hidden md:block">
          <div className="overflow-hidden rounded-3xl border border-line">
            <div className="grid md:grid-cols-2">
              <div className="border-b border-line bg-wash px-6 py-6 md:border-b-0 md:border-r md:px-8">
                <p className="eyebrow !text-faint">{ba.beforeEyebrow.text}</p>
                <p className="mt-2 text-2xl font-semibold text-ink-2">{ba.beforeTitle.text}</p>
              </div>
              <div className="hidden bg-night px-8 py-6 text-white md:block">
                <p className="eyebrow !text-brand">{site.platform.engine.text}</p>
                <p className="mt-2 text-2xl font-semibold">{ba.afterTitle.text}</p>
              </div>
            </div>

            <ul>
              {ba.pairs.map(([before, after], i) => (
                <li key={i} className="grid border-t border-line md:grid-cols-2">
                  <div className="flex items-start gap-3 bg-wash px-6 py-4 text-[15px] text-muted md:border-r md:border-line md:px-8">
                    <span aria-hidden className="mt-1.5 size-3 shrink-0 rounded-full border-[1.5px] border-faint" />
                    <span>{before.text}</span>
                  </div>
                  <div className="bg-night px-6 py-4 text-[15px] text-white md:border-t-0 md:px-8">
                    <Reveal delay={150 + i * 70} x={-14} y={0} className="flex items-start gap-3">
                      <Check />
                      {after.text}
                    </Reveal>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
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
