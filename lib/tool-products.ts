import { localizeFeatureLabel } from "@/lib/localized-ui";
import { products, type Lang } from "@/lib/site-data";

export function getInteractiveProducts(lang: Lang) {
  return products.map((product) => ({
    model: product.model,
    summary: product.summary[lang],
    featureLabel: localizeFeatureLabel(product.featureLabel, lang),
    price: product.price,
    spec: {
      pressure: product.spec.pressure,
      battery: product.spec.battery,
      cup: product.spec.cup,
      charging: product.spec.charging,
      adapter: product.spec.adapter,
    },
  }));
}
