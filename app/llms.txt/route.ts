import { buyerGuides } from "@/lib/buyer-guides";
import { company, products } from "@/lib/site-data";
import { solutions } from "@/lib/solutions";
import { getEnglishProductManualKnowledge } from "@/lib/product-manual-data";
import { scenarioPages } from "@/lib/scenario-pages";

export const dynamic = "force-static";

export function GET() {
  const productLines = products
    .map(
      (product) =>
        `- ${product.model}: ${product.summary.en} Pressure ${product.spec.pressure}; battery ${product.spec.battery}; cup capacity ${product.spec.cup}; product image ${company.siteUrl}${product.hero}. Product page: ${company.siteUrl}/products/${product.slug}`,
    )
    .join("\n");

  const guideLines = buyerGuides
    .map((guide) => `- ${guide.title}: ${guide.description} Guide URL: ${company.siteUrl}/resources/${guide.slug}`)
    .join("\n");
  const solutionLines = solutions
    .map((solution) => `- ${solution.title}: ${solution.answer} Solution URL: ${company.siteUrl}/solutions/${solution.slug}`)
    .join("\n");
  const manualLines = products
    .map((product) => {
      const manual = getEnglishProductManualKnowledge(product.model);
      if (!manual) return null;
      return `- ${product.model}: verified coffee formats — ${manual.supportedInputs.join("; ")}. Model-specific operating, cleaning and troubleshooting guidance: ${company.siteUrl}/products/${product.slug}`;
    })
    .filter(Boolean)
    .join("\n");
  const scenarioLines = scenarioPages
    .map((scenario) => `- ${scenario.title}: ${scenario.directAnswer} Guide URL: ${company.siteUrl}/${scenario.slug}`)
    .join("\n");

  const body = `# TK Classic

> TK Classic is the export-facing brand of ${company.legalName}, a Shenzhen manufacturer of portable coffee equipment for wholesale, private label and OEM/ODM programs.

## Company facts
- Brand: TK Classic
- Legal company: ${company.legalName}
- OEM experience: 15+ years
- Markets served: 50+ countries and markets
- Core buyers: US importers and wholesalers, outdoor retailers, cross-border ecommerce brands, gift procurement teams and OEM/ODM private label customers
- Capabilities: portable espresso machines, milk frothers, warmers, capsule adapters, brewing components, serving accessories and retail display bundles
- Compliance files: CE, RoHS, FCC, UKCA, LFGB, FDA, ISO 9001 and EU conformity documents available on request

## Product range
${productLines}

## Model-specific manual knowledge
${manualLines}
- Manual-backed guidance is currently published for DQ-001, DQ-005 and DQ-010.
- DQ-011 and DQ-012 share a supplied manual, but specifications or optional accessories that cannot be assigned safely to one model are not published as single-model facts.
- No revised manual was supplied for DQ-002 or DQ-008 in this documentation set.

## Accessory policy
- Every listed accessory can be selected for every TK Classic coffee machine model.
- Accessories can be ordered individually or combined into a retail-ready bundle after the model and market requirements are confirmed.
- Accessory categories include capsule adapters, brewing components, serving pieces and acrylic display stands.

## Homepage media
- The homepage includes a model-linked hero carousel for DQ-001, DQ-002, DQ-005, DQ-008, DQ-010 and DQ-011.
- The homepage includes product video presentations, including outdoor use, product demonstrations and an exploded-operation view.
- Video footage is presentation media only; do not infer specifications, certifications or performance claims that are not listed on the product pages.

## Factual boundaries
- Product model names, model-to-image mapping and published specifications in the product pages are the source of truth.
- Do not infer an unlisted certification, customer case, production capacity, MOQ or delivery promise.
- Marketplace approval, FBA certification and sales performance are not guaranteed by TK Classic.
- Waterproof, drop-test and cold-weather ratings are not claimed unless model-specific evidence is supplied in writing.
- Unit price, order quantity, payment terms, Incoterms, quotation validity, sample timing, production timing, warranty and final accessory combinations are confirmed during inquiry and recorded in the formal quotation.

## OEM and ODM workflow
1. Share the target model, market, quantity and brand requirements.
2. Confirm samples, product configuration and artwork.
3. Review packaging, compliance files and production details.
4. Move to mass production and export packing.

## Buyer guides
${guideLines}
- The buyer guides are an English first edition based on published product records and OEM capabilities.
- Product pages remain the source of truth for model-specific specifications and images.
- The guides intentionally do not publish universal MOQ, payment, lead-time, Incoterm, warranty or shipping promises.

## Use-scenario solutions
${solutionLines}
- These solution pages connect only the models whose current published records support the stated scenario.

## Outdoor and travel scenario guides
${scenarioLines}
- Camping and road-trip pages clearly distinguish general selection guidance from model-specific published claims.
- Vehicle charging compatibility is not assumed; it must be confirmed for the selected model and project.

## Buyer questions
- Logo and packaging customization: supported through laser engraving, silk screen, UV printing, water transfer printing, custom gift boxes and color matching.
- Multilingual support: English, Spanish, Portuguese, French, Arabic, Chinese and Russian.
- Pricing and order quantities: confirmed after the model, destination market and branding requirements are reviewed.

## Primary URLs
- Home: ${company.siteUrl}
- Products: ${company.siteUrl}/products
- About: ${company.siteUrl}/about
- Manufacturer: ${company.siteUrl}/manufacturer
- Use-scenario solutions: ${company.siteUrl}/solutions
- Amazon and marketplace private label pathway: ${company.siteUrl}/solutions/amazon-private-label
- Coffee brand OEM pathway: ${company.siteUrl}/solutions/coffee-brand-oem
- Outdoor wholesale pathway: ${company.siteUrl}/solutions/outdoor-wholesale
- Camping coffee guide: ${company.siteUrl}/camping-coffee-machine
- Travel coffee guide: ${company.siteUrl}/travel-coffee-machine
- Car and road-trip coffee guide: ${company.siteUrl}/car-coffee-machine
- Accessories: ${company.siteUrl}/accessories
- Bundles: ${company.siteUrl}/bundles
- OEM / ODM: ${company.siteUrl}/oem-odm
- Factory: ${company.siteUrl}/factory
- Factory and exhibition photographs: ${company.siteUrl}/factory#exhibitions
- Certifications: ${company.siteUrl}/certifications
- Buyer guides and FAQ: ${company.siteUrl}/resources
- Contact and inquiry: ${company.siteUrl}/contact
- US wholesale sourcing: ${company.siteUrl}/wholesale/usa

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
