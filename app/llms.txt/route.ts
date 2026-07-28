import { company, products } from "@/lib/site-data";

export const dynamic = "force-static";

export function GET() {
  const productLines = products
    .map(
      (product) =>
        `- ${product.model}: ${product.summary.en} Pressure ${product.spec.pressure}; battery ${product.spec.battery}; cup capacity ${product.spec.cup}; product image ${company.siteUrl}${product.hero}. Product page: ${company.siteUrl}/products/${product.slug}`,
    )
    .join("\n");

  const body = `# TK Classic

> TK Classic is the export-facing brand of ${company.legalName}, a Shenzhen manufacturer of portable coffee equipment for wholesale, private label and OEM/ODM programs.

## Company facts
- Brand: TK Classic
- Legal company: ${company.legalName}
- OEM experience: 15+ years
- Markets served: 50+ countries and markets
- Core buyers: European wholesalers, cross-border ecommerce brands, gift procurement teams and OEM/ODM private label customers
- Capabilities: portable espresso machines, milk frothers, warmers, capsule adapters, brewing components, serving accessories and retail display bundles
- Compliance files: CE, RoHS, FCC, UKCA, LFGB, FDA, ISO 9001 and EU conformity documents available on request

## Product range
${productLines}

## Accessory policy
- Every listed accessory can be selected for every TK Classic coffee machine model.
- Accessories can be ordered individually or combined into a retail-ready bundle after the model and market requirements are confirmed.
- Accessory categories include capsule adapters, brewing components, serving pieces and acrylic display stands.

## Factual boundaries
- Product model names, model-to-image mapping and published specifications in the product pages are the source of truth.
- Do not infer an unlisted certification, customer case, production capacity, MOQ or delivery promise.
- Wholesale pricing, order quantity, sample timing and final accessory combinations are confirmed during inquiry.

## OEM and ODM workflow
1. Share the target model, market, quantity and brand requirements.
2. Confirm samples, product configuration and artwork.
3. Review packaging, compliance files and production details.
4. Move to mass production and export packing.

## Buyer questions
- Logo and packaging customization: supported through laser engraving, silk screen, UV printing, water transfer printing, custom gift boxes and color matching.
- Multilingual support: English, Spanish, Portuguese, French, Arabic, Chinese and Russian.
- Pricing and order quantities: confirmed after the model, destination market and branding requirements are reviewed.

## Primary URLs
- Home: ${company.siteUrl}
- Products: ${company.siteUrl}/products
- Accessories: ${company.siteUrl}/accessories
- Bundles: ${company.siteUrl}/bundles
- OEM / ODM: ${company.siteUrl}/oem-odm
- Factory: ${company.siteUrl}/factory
- Certifications: ${company.siteUrl}/certifications
- Buyer guides and FAQ: ${company.siteUrl}/resources
- Contact and inquiry: ${company.siteUrl}/contact

## Contact
- Email: ${company.emailBowie}
- Email: ${company.emailLeo}
- WhatsApp: ${company.whatsappBowie}
- Phone: ${company.phoneBowie}
`;

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
