import type { MetadataRoute } from "next";
import { company } from "@/lib/site-data";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
      {
        userAgent: [
          "OAI-SearchBot",
          "ChatGPT-User",
          "GPTBot",
          "Google-Extended",
          "GoogleOther",
          "PerplexityBot",
          "ClaudeBot",
          "Applebot-Extended",
        ],
        allow: "/",
        disallow: ["/admin", "/api"],
      },
    ],
    sitemap: `${company.siteUrl}/sitemap.xml`,
  };
}
