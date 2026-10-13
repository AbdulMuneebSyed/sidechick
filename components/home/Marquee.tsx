import { site } from "@/content/site";

/** The original SMARTER · FASTER · … strip, kept but made thinner, slower and quieter. */
export function Marquee() {
  const words = site.marquee.map((w) => w.text);
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden} className="flex shrink-0 items-center">
      {words.map((w) => (
        <li key={w} className="flex items-center gap-8 pr-8 font-mono text-xs tracking-[0.2em] text-faint">
          {w}
          <span aria-hidden className="size-1 rounded-full bg-brand/60" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="overflow-hidden border-y border-line py-4 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="flex w-max animate-marquee motion-reduce:animate-none">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
