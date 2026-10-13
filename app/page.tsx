import Image from "next/image";

// Phase 1 asset check page; replaced in Phase 3.
const assets = [
  "logo-light.png",
  "product-dashboard.webp",
  "step-monitor.webp",
  "step-optimize.webp",
  "step-execute.webp",
  "product-treatments.webp",
  "product-recovery.webp",
  "lifecycle-loop.webp",
];

export default function Home() {
  return (
    <main className="container-x grid gap-10 py-16">
      <p className="eyebrow">Asset check</p>
      {assets.map((a) => (
        <figure key={a} className="grid gap-2">
          <Image src={`/media/${a}`} alt={a} width={1200} height={800} className="h-auto w-full rounded-xl border border-line" />
          <figcaption className="font-mono text-sm text-muted">{a}</figcaption>
        </figure>
      ))}
    </main>
  );
}
