import type { Metadata } from "next";
import { site } from "@/content/site";
import { ui } from "@/content/ui";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: site.form.title.text, robots: { index: false } };

/** Shown when a form post made before JavaScript loaded could not be delivered. */
export default function UnsentPage() {
  const { email } = site.brand;
  return (
    <section className="container-x grid justify-items-center gap-4 py-32 text-center">
      <h1 className="text-h2 font-semibold">{site.form.title.text}</h1>
      <p className="text-lg text-muted">
        {ui.failed}{" "}
        <a className="font-medium text-brand-ink underline" href={`mailto:${email.text}`}>
          {email.text}
        </a>
      </p>
      <Button href="/demo" variant="secondary" className="mt-4">
        {site.nav.demo.text}
      </Button>
    </section>
  );
}
