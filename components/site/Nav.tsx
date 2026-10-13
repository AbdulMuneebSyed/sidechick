"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Logo } from "./Logo";

type MenuId = "platform" | "solutions" | null;

const platformLinks = [
  ...site.why.pillars.map((p) => ({
    href: `/#${p.id}`,
    title: p.title.text,
    note: `${p.figure.text} ${p.result.text}`,
  })),
  { href: "/#platform", title: site.platform.engine.text, note: site.platform.title.text },
];

const solutionLinks = site.segments.items.map((s) => ({ href: `/#${s.id}`, title: s.label.text }));

// Menus stay mounted and fade/slide with CSS; `invisible` keeps a closed menu out of the tab order.
const reveal = (open: boolean) =>
  `transition-[opacity,transform,visibility] duration-200 ease-out ${open ? "visible opacity-100 translate-y-0" : "invisible pointer-events-none -translate-y-2 opacity-0"}`;

function Chevron({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 12 12" aria-hidden className={`size-3 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 4.5 6 7.5l3-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState<MenuId>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && (setMenu(null), setMobileOpen(false));
    const onClick = (e: MouseEvent) => !navRef.current?.contains(e.target as Node) && setMenu(null);
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  const close = () => (setMenu(null), setMobileOpen(false));

  return (
    <header
      ref={navRef}
      className={`sticky top-0 z-50 transition-[background,box-shadow,border-color] duration-300 ${
        scrolled || menu || mobileOpen
          ? "border-b border-line bg-paper/95 backdrop-blur-xl"
          : "border-b border-transparent bg-paper/0"
      }`}
    >
      <nav className="container-x flex h-16 items-center gap-8" aria-label="Main">
        <Logo className="h-6 w-auto md:h-7" />

        <ul className="hidden items-center gap-1 text-[15px] text-ink-2 md:flex">
          {(
            [
              ["platform", site.nav.platformMenu.text],
              ["solutions", site.nav.solutionsMenu.text],
            ] as const
          ).map(([id, label]) => (
            <li key={id}>
              <button
                type="button"
                aria-expanded={menu === id}
                aria-controls={`menu-${id}`}
                onClick={() => setMenu(menu === id ? null : id)}
                className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 hover:bg-sunk hover:text-ink"
              >
                {label} <Chevron open={menu === id} />
              </button>
            </li>
          ))}
          <li>
            <Link href="/about" className="inline-flex h-9 items-center rounded-full px-3 hover:bg-sunk hover:text-ink">
              {site.nav.about.text}
            </Link>
          </li>
        </ul>

        <div className="ml-auto flex items-center gap-2">
          <Button href="/demo" size="sm" className="hidden sm:inline-flex">
            {site.nav.demo.text}
          </Button>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full hover:bg-sunk md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <svg viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              {mobileOpen ? <path d="M5 5l10 10M15 5 5 15" strokeLinecap="round" /> : <path d="M3 6h14M3 10h14M3 14h14" strokeLinecap="round" />}
            </svg>
          </button>
        </div>
      </nav>

      {/* Desktop dropdowns */}
      <div
        id="menu-platform"
        className={`absolute inset-x-0 top-full hidden border-b border-line bg-paper/95 backdrop-blur-xl md:block ${reveal(menu === "platform")}`}
      >
        <div className="container-x grid grid-cols-4 gap-2 py-6">
          {platformLinks.map((l) => (
            <Link key={l.href} href={l.href} onClick={close} className="group rounded-xl p-4 transition hover:bg-sunk">
              <div className="font-medium text-ink">{l.title}</div>
              <div className="mt-1 text-sm text-muted">{l.note}</div>
            </Link>
          ))}
        </div>
      </div>
      <div
        id="menu-solutions"
        className={`absolute inset-x-0 top-full hidden border-b border-line bg-paper/95 backdrop-blur-xl md:block ${reveal(menu === "solutions")}`}
      >
        <div className="container-x grid grid-cols-5 gap-2 py-6">
          {solutionLinks.map((l) => (
            <Link key={l.href} href={l.href} onClick={close} className="rounded-xl p-4 font-medium text-ink transition hover:bg-sunk">
              {l.title}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile sheet */}
      <div className={`absolute inset-x-0 top-full h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-paper md:hidden ${reveal(mobileOpen)}`}>
        <div className="container-x grid gap-8 py-8">
          <div>
            <p className="eyebrow mb-3">{site.nav.platformMenu.text}</p>
            <ul className="grid gap-1">
              {platformLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} onClick={close} className="block rounded-lg py-2 text-lg font-medium">
                    {l.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-3">{site.nav.solutionsMenu.text}</p>
            <ul className="grid gap-1">
              {solutionLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} onClick={close} className="block rounded-lg py-2 text-lg font-medium">
                    {l.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <Link href="/about" onClick={close} className="text-lg font-medium">
            {site.nav.about.text}
          </Link>
          <Button href="/demo" onClick={close}>
            {site.nav.demo.text}
          </Button>
        </div>
      </div>
    </header>
  );
}
