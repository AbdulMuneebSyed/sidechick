// Derives web-ready files from the extracted indilabs.ai media (public/media).
// Only re-encodes, crops and recolours Indilabs' own files; nothing new is drawn.
import sharp from "sharp";
const M = "public/media";

// Logo: original wordmark is white text + red mark (for dark backgrounds).
// Light variant recolours only the near-white text pixels to ink.
const { data, info } = await sharp("sources/extracted/logonew.png").ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const light = Buffer.from(data);
for (let i = 0; i < light.length; i += 4) {
  const [r, g, b] = [light[i], light[i + 1], light[i + 2]];
  if (r > 200 && g > 200 && b > 200) { light[i] = 30; light[i + 1] = 30; light[i + 2] = 30; }
}
const raw = { raw: { width: info.width, height: info.height, channels: 4 } };
await sharp(light, raw).resize({ height: 96 }).png().toFile(`${M}/logo-light.png`);
await sharp(data, raw).resize({ height: 96 }).png().toFile(`${M}/logo-dark.png`);
await sharp(data, raw).extract({ left: 0, top: 0, width: info.height, height: info.height }).resize(512).png().toFile(`${M}/logo-mark.png`);

// Product screens.
const dash = sharp("sources/extracted/frame-440-1.png");
const meta = await dash.metadata();
await dash.clone().webp({ quality: 88 }).toFile(`${M}/product-dashboard.webp`);
// The dashboard has three equal step columns under the browser chrome; crop each for the stepper.
const top = Math.round(meta.height * 0.085), bottom = Math.round(meta.height * 0.035);
const colW = Math.round(meta.width * 0.329), x0 = Math.round(meta.width * 0.0055);
const names = ["step-monitor", "step-optimize", "step-execute"];
for (let i = 0; i < 3; i++) {
  await sharp("sources/extracted/frame-440-1.png")
    .extract({ left: x0 + i * Math.round(meta.width * 0.3285), top, width: colW, height: meta.height - top - bottom })
    .webp({ quality: 88 }).toFile(`${M}/${names[i]}.webp`);
}
await sharp("sources/extracted/frame-440-2.png").webp({ quality: 88 }).toFile(`${M}/product-treatments.webp`);
await sharp("sources/extracted/frame-440-3.png").webp({ quality: 88 }).toFile(`${M}/product-recovery.webp`);
await sharp("sources/extracted/herosectionimg1.png").webp({ quality: 85 }).toFile(`${M}/lifecycle-loop.webp`);
for (const n of ["image-74", "image-75", "image-76"]) await sharp(`sources/extracted/${n}.png`).resize(96).png().toFile(`${M}/icon-${n}.png`);
console.log("done", meta.width, meta.height);
