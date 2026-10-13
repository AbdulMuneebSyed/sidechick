import type { Metadata, Viewport } from "next";
import { DM_Mono, DM_Sans } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"] });
const dmMono = DM_Mono({ variable: "--font-dm-mono", subsets: ["latin"], weight: ["400", "500"] });

const title = `${site.brand.name.text} | ${site.hero.title.text}`;

export const metadata: Metadata = {
  metadataBase: new URL("https://indilabs.ai"),
  title: { default: title, template: `%s | ${site.brand.name.text}` },
  description: site.hero.subtitle.text,
  openGraph: { title, description: site.hero.subtitle.text, siteName: site.brand.name.text, type: "website" },
  twitter: { card: "summary_large_image", title, description: site.hero.subtitle.text },
  icons: { icon: "/media/logo-mark.png" },
};

export const viewport: Viewport = { themeColor: "#ffffff" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmMono.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
