import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TK Classic Portable Coffee Machines",
    short_name: "TK Classic",
    description:
      "Portable coffee machines and OEM/ODM sourcing support for importers, wholesalers and private-label brands.",
    start_url: "/",
    display: "standalone",
    background_color: "#111817",
    theme_color: "#111817",
    icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
