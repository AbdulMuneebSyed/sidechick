import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "light";

const styles: Record<Variant, string> = {
  primary:
    "brand-gradient text-white shadow-[0_1px_0_rgba(255,255,255,.25)_inset,0_6px_16px_-6px_rgba(172,38,49,.55)] hover:brightness-110",
  secondary: "bg-paper text-ink border border-line hover:border-ink/25 hover:bg-wash",
  ghost: "text-ink hover:bg-sunk",
  light: "bg-white text-ink hover:bg-white/90",
};

type Props = { variant?: Variant; size?: "sm" | "md"; children: ReactNode; className?: string } & (
  | ({ href: string } & Omit<ComponentProps<typeof Link>, "href" | "className">)
  | ({ href?: undefined } & Omit<ComponentProps<"button">, "className">)
);

export function Button({ variant = "primary", size = "md", className = "", children, ...rest }: Props) {
  const cls = [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition duration-200 active:scale-[.98]",
    size === "sm" ? "h-9 px-4 text-sm" : "h-11 px-5 text-[15px]",
    styles[variant],
    className,
  ].join(" ");
  if (rest.href !== undefined) {
    const { href, ...link } = rest;
    return (
      <Link href={href} className={cls} {...link}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...(rest as ComponentProps<"button">)}>
      {children}
    </button>
  );
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className={`size-4 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
