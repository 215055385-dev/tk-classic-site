import type { Product } from "@/lib/site-data";

const preferredSpecKeys = ["pressure", "battery", "cup", "capacity", "charging", "material", "size", "adapter"];

export function getProductSpecEntries(product: Pick<Product, "spec">, limit?: number) {
  const entries = Object.entries(product.spec).filter(([, value]) => typeof value === "string" && value.trim());
  const indexed = new Map(entries);
  const ordered = [
    ...preferredSpecKeys.flatMap((key) => indexed.has(key) ? [[key, indexed.get(key)!] as const] : []),
    ...entries.filter(([key]) => !preferredSpecKeys.includes(key)),
  ];
  return typeof limit === "number" ? ordered.slice(0, limit) : ordered;
}
