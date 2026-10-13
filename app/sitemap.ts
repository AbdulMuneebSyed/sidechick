import type { MetadataRoute } from "next";

const BASE = "https://indilabs.ai";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/about`, changeFrequency: "yearly", priority: 0.7 },
    { url: `${BASE}/demo`, changeFrequency: "yearly", priority: 0.8 },
  ];
}
