import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/content/site";

// Social card: Indilabs logo, the hero headline and the real dashboard.
export const alt = `${site.brand.name.text}: ${site.hero.title.text}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const dataUri = (buf: Buffer) => `data:image/png;base64,${buf.toString("base64")}`;

export default async function OpenGraphImage() {
  const [logo, dashboard] = (
    await Promise.all([
      readFile(join(process.cwd(), "public/media/logo-dark.png")),
      readFile(join(process.cwd(), "sources/extracted/frame-440-1.png")),
    ])
  ).map(dataUri);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#0e0e12", padding: "56px 64px 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 200, bottom: -260, width: 900, height: 420, borderRadius: 9999, background: "rgba(232,72,85,.35)", filter: "blur(90px)" }} />
        <img src={logo} width={235} height={40} alt="" style={{ flexShrink: 0 }} />
        <div style={{ display: "flex", flexShrink: 0, marginTop: 32, fontSize: 52, fontWeight: 700, color: "white", letterSpacing: -1.5, lineHeight: 1.1, width: 1072 }}>
          {site.hero.title.text}
        </div>
        <div style={{ display: "flex", flexShrink: 0, marginTop: 16, fontSize: 24, lineHeight: 1.35, color: "rgba(255,255,255,.7)", width: 1000 }}>{site.hero.subtitle.text}</div>
        <div style={{ marginTop: 36, display: "flex", borderRadius: 18, overflow: "hidden", border: "1px solid rgba(255,255,255,.15)", width: 1072 }}>
          <img src={dashboard} width={1072} height={885} alt="" />
        </div>
      </div>
    ),
    size,
  );
}
