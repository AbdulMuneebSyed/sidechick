import { BeforeAfter } from "@/components/home/BeforeAfter";
import { ClosingCta } from "@/components/home/ClosingCta";
import { Hero } from "@/components/home/Hero";
import { Lifecycle } from "@/components/home/Lifecycle";
import { Marquee } from "@/components/home/Marquee";
import { Pillars } from "@/components/home/Pillars";
import { PlatformBand } from "@/components/home/PlatformBand";
import { ProofStrip } from "@/components/home/ProofStrip";
import { Segments } from "@/components/home/Segments";

export default function Home() {
  return (
    <>
      <Hero />
      <ProofStrip />
      <Pillars />
      <Lifecycle />
      <PlatformBand />
      <Segments />
      <Marquee />
      <BeforeAfter />
      <ClosingCta />
    </>
  );
}
