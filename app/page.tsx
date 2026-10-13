import { Hero } from "@/components/home/Hero";
import { Lifecycle } from "@/components/home/Lifecycle";
import { Pillars } from "@/components/home/Pillars";
import { ProofStrip } from "@/components/home/ProofStrip";

export default function Home() {
  return (
    <>
      <Hero />
      <ProofStrip />
      <Pillars />
      <Lifecycle />
    </>
  );
}
