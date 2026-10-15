import Image from "next/image";
import { site } from "@/content/site";
import { Arrow, Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

const R = 300;
const C = 2 * Math.PI * R;

/**
 * Closing band. Below the copy, the Monitor → Optimize → Execute loop from the
 * lifecycle section rises like a horizon, its active arc travelling round it.
 */
export function ClosingCta() {
  const { closing, brand } = site;
  return (
    <section className="px-4 pb-24 md:pb-32">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-night px-6 pb-36 pt-24 text-center text-white md:pb-52 md:pt-32">
        <svg aria-hidden viewBox="0 0 800 800" className="pointer-events-none absolute left-1/2 top-[72%] w-[40rem] max-w-none -translate-x-1/2 md:top-[55%] md:w-[64rem]">
          <circle cx="400" cy="400" r={R} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="2" />
          <circle cx="400" cy="400" r={R - 70} fill="none" stroke="rgba(255,255,255,.05)" strokeWidth="1.5" />
          <g className="loop-spin">
            <circle cx="400" cy="400" r={R} fill="none" stroke="#e84855" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${C / 3 - 8} ${C}`} />
            <circle cx={400 + R} cy="400" r="6" fill="#ff8c95" />
          </g>
        </svg>

        <Reveal variant="stagger" className="relative mx-auto max-w-2xl">
          <Image src="/media/logo-mark.png" alt="" width={44} height={44} className="mx-auto size-11 rounded-xl bg-white p-1.5" />
          <h2 className="mt-8 text-h2 font-semibold">{closing.title.text}</h2>
          <p className="mt-5 text-xl text-white/75">{closing.body.text}</p>
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
