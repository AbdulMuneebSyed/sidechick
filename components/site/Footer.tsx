import Link from "next/link";
import { site } from "@/content/site";
import { Logo } from "./Logo";

const LINKEDIN = "https://www.linkedin.com/company/indilabs-ai/";

export function Footer() {
  return (
    <footer className="border-t border-line bg-wash">
      <div className="container-x grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="grid content-start gap-4">
          <Logo className="h-7 w-auto" />
          <p className="max-w-xs text-sm text-muted">{site.hero.title.text}</p>
        </div>

        <FooterCol title={site.platform.eyebrow.text}>
          {site.why.pillars.map((p) => (
            <FooterLink key={p.id} href={`/#${p.id}`}>
              {p.title.text}
            </FooterLink>
          ))}
          <FooterLink href="/#platform">{site.platform.engine.text}</FooterLink>
        </FooterCol>

        <FooterCol title={site.segments.eyebrow.text}>
          {site.segments.items.map((s) => (
            <FooterLink key={s.id} href={`/#${s.id}`}>
              {s.label.text}
            </FooterLink>
          ))}
        </FooterCol>

        <FooterCol title={site.closing.cta.text}>
          <FooterLink href="/">{site.footer.home.text}</FooterLink>
          <FooterLink href="/about">{site.footer.about.text}</FooterLink>
          <FooterLink href="/demo">{site.nav.demo.text}</FooterLink>
          <FooterLink href={`mailto:${site.brand.email.text}`}>{site.brand.email.text}</FooterLink>
          <FooterLink href={`tel:${site.brand.phone.text}`}>{site.brand.phone.text}</FooterLink>
          <FooterLink href={LINKEDIN} external>
            {site.brand.linkedin.text}
          </FooterLink>
        </FooterCol>
      </div>
      <div className="border-t border-line">
        <p className="container-x py-6 text-sm text-faint">
          © 2024 {site.brand.name.text}. {site.footer.rights.text}
        </p>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow mb-4 !text-faint">{title}</p>
      <ul className="grid gap-2.5 text-[15px]">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) {
  return (
    <li>
      <Link
        href={href}
        className="text-ink-2 transition hover:text-brand-ink"
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </Link>
    </li>
  );
}
