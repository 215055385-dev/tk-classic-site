import { company } from "@/lib/site-data";
import { getCmsProducts } from "@/lib/cms-products";

export const runtime = "nodejs";
export const revalidate = 3600;

const staticPaths = [
  "/",
  "/company",
  "/products",
  "/accessories",
  "/bundles",
  "/oem-odm",
  "/factory",
  "/certifications",
  "/resources",
  "/china-oem-guide",
  "/contact",
  "/privacy",
  "/tools/product-selector",
  "/tools/bundle-configurator",
  "/tools/inquiry-builder",
] as const;

function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    "\"": "&quot;",
  })[character] ?? character);
}

function chineseUrl(path: string) {
  return `${company.siteUrl}/zh${path === "/" ? "" : path}`;
}

export async function GET() {
  const products = await getCmsProducts();
  const urls = [
    ...staticPaths.map(chineseUrl),
    ...products.map((product) => chineseUrl(`/products/${product.slug}`)),
  ];
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((url) => `<url><loc>${escapeXml(url)}</loc></url>`),
    "</urlset>",
  ].join("\n");

  return new Response(body, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
