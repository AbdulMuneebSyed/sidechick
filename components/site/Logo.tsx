import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";

/** Indilabs.ai wordmark. `tone="dark"` is the original white-text version for dark backgrounds. */
export function Logo({ tone = "light", className = "h-7 w-auto" }: { tone?: "light" | "dark"; className?: string }) {
  return (
    <Link href="/" aria-label={`${site.brand.name.text} home`} className="inline-flex shrink-0 items-center">
      <Image
        src={tone === "light" ? "/media/logo-light.png" : "/media/logo-dark.png"}
        alt={site.brand.name.text}
        width={565}
        height={96}
        preload={tone === "light"}
        className={className}
      />
    </Link>
  );
}
