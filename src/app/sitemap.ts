import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["pt", "en"].map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: locale === "pt" ? 1 : 0.8,
    alternates: { languages: { "pt-BR": `${SITE_URL}/pt`, en: `${SITE_URL}/en` } },
  }));
}
