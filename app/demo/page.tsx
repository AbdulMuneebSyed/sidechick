import type { Metadata } from "next";
import Image from "next/image";
import { LeadForm } from "@/components/forms/LeadForm";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: site.nav.demo.text,
  description: `${site.form.intro.text} ${site.form.introEmphasis.text}.`,
};

export default function DemoPage() {
  const { form, brand } = site;
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div aria-hidden className="dot-field absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_20%_20%,black,transparent)]" />
      <div className="container-x relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:pt-6">
          <p className="eyebrow">{site.nav.demo.text}</p>
          <h1 className="mt-4 text-h2 font-semibold">{form.title.text}</h1>
          <p className="mt-5 max-w-md text-lg text-muted">
            {form.intro.text} <span className="font-semibold text-ink">{form.introEmphasis.text}</span>.
          </p>
          <dl className="mt-10 grid gap-4 text-[15px]">
            <div className="flex items-center gap-3">
              <dt className="sr-only">Email</dt>
              <dd>
                <a href={`mailto:${brand.email.text}`} className="font-medium hover:text-brand-ink">
                  {brand.email.text}
                </a>
              </dd>
            </div>
            <div className="flex items-center gap-3">
              <dt className="sr-only">Phone</dt>
              <dd>
                <a href={`tel:${brand.phone.text}`} className="font-medium hover:text-brand-ink">
                  {brand.phone.text}
                </a>
              </dd>
            </div>
          </dl>
          <div className="mt-12 hidden overflow-hidden rounded-2xl border border-line lg:block">
            <Image src="/media/product-treatments.webp" alt="Indilabs Treatments screen: Champion and Challenger strategies" width={1386} height={832} sizes="520px" className="h-auto w-full" />
          </div>
        </div>
        <div className="rounded-3xl border border-line bg-paper p-6 shadow-[0_30px_60px_-40px_rgba(17,17,19,.35)] md:p-10">
          <LeadForm />
        </div>
      </div>
    </section>
  );
}
