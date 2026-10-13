import type { Metadata } from "next";
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: site.form.successTitle.text, robots: { index: false } };

/** Shown after a form post made before JavaScript loaded. */
export default function ThanksPage() {
  return (
    <section className="container-x grid justify-items-center gap-4 py-32 text-center">
      <h1 className="text-h2 font-semibold">{site.form.successTitle.text}</h1>
      <p className="text-lg text-muted">{site.form.successBody.text}</p>
      <Button href="/" variant="secondary" className="mt-4">
        {site.nav.home.text}
      </Button>
    </section>
  );
}
