import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "light";

const styles: Record<Variant, string> = {
  primary: "bg-brand-ink text-white hover:bg-brand-deep",
  secondary: "bg-sunk text-ink hover:bg-line",
  ghost: "text-ink hover:bg-sunk",
  light: "bg-white text-ink hover:bg-white/90",
};

type Props = { variant?: Variant; size?: "sm" | "md"; children: ReactNode; className?: string } & (
  | ({ href: string } & Omit<ComponentProps<typeof Link>, "href" | "className">)
  | ({ href?: undefined } & Omit<ComponentProps<"button">, "className">)
);

export function Button({ variant = "primary", size = "md", className = "", children, ...rest }: Props) {
  const cls = [
    "group/btn inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[transform,background-color,color] duration-200 ease-[var(--ease-out)] active:scale-[.97] active:duration-100",
    size === "sm" ? "h-9 px-4 text-sm" : "h-11 px-5 text-base",
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
    <svg viewBox="0 0 16 16" aria-hidden className={`size-4 transition-transform duration-200 group-hover/btn:translate-x-0.5 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
