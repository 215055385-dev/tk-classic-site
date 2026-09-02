import { geoGuides } from "@/lib/geo-guides";

export type BuyerGuideSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type BuyerGuide = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  readTime: string;
  publishedAt: string;
  updatedAt: string;
  heroImage: string;
  heroAlt: string;
  keyTakeaways: string[];
  directAnswer?: string;
  directAnswerTitle?: string;
  keywords?: string[];
  relatedLinks?: Array<{ href: string; label: string }>;
  sections: BuyerGuideSection[];
  faq: Array<{ question: string; answer: string }>;
  showModelTable?: boolean;
};

const publicationDate = "2026-08-04";

const sourcingGuides: BuyerGuide[] = [
  {
    slug: "portable-espresso-machine-private-label-buying-guide",
    title: "How to source portable espresso machines for a private label program",
    description:
      "A practical sourcing framework for comparing portable espresso models, approving samples, planning packaging and preparing a clear OEM quotation brief.",
    eyebrow: "Private label sourcing guide",
    readTime: "8 minute read",
    publishedAt: publicationDate,
    updatedAt: publicationDate,
    heroImage: "/optimized/product-scenes/dq-002-1.webp",
    heroAlt: "TK Classic DQ-002 portable espresso machine range in official product photography",
    keyTakeaways: [
      "Choose the buying scenario before comparing individual specifications.",
      "Use the model page as the source of truth for pressure, battery, cup format, adapters and charging information.",
      "Approve the physical sample, configuration and artwork before mass production.",
      "Confirm quantity, payment, timing, Incoterms and destination-market documents in the formal quotation.",
    ],
    sections: [
      {
        title: "1. Start with the retail and use scenario",
        paragraphs: [
          "A wholesale buyer should first define where the machine will be sold and how the end customer will use it. A compact ecommerce launch, a premium gift set and a European retail program can require different cup formats, adapters, packaging and supporting documents.",
          "Write the target market, sales channel, preferred coffee format and intended bundle into the project brief. This prevents a visually attractive model from being selected before its configuration is checked against the actual program.",
        ],
        bullets: [
          "Target country or market",
          "Retail, ecommerce, gift procurement or private label program",
          "Capsule, ground coffee or combined brewing requirement",
          "Machine-only offer or machine-plus-accessory bundle",
        ],
      },
      {
        title: "2. Compare the published model data",
        paragraphs: [
          "TK Classic publishes model-specific pressure, battery, cup capacity, charging, heating, size and adapter information on each product page. Do not assume that one model's specification applies to another model with a similar appearance.",
          "The six current models cover different buying positions: DQ-001 uses capsule and ground-coffee adapters; DQ-002 is a 2-in-1 capsule and ground-coffee format; DQ-005 supports three coffee formats in its revised manual; DQ-008 uses a double-cup format; DQ-010 has a 325 mL cup and supports N-series capsules, Dolce Gusto capsules and ground coffee; and DQ-011 is positioned for premium gift programs.",
        ],
      },
      {
        title: "3. Turn the sample into an approval record",
        paragraphs: [
          "A sample is useful only when the buyer records exactly what has been approved. The approved model, color, adapters, cup, logo method, packaging artwork and included accessories should be listed together so that the quotation and production brief refer to the same configuration.",
        ],
        bullets: [
          "Model and color reference",
          "Included brewing adapters and accessories",
          "Logo position, method and approved artwork version",
          "Gift box, insert, manual and label requirements",
          "Destination-market compliance documents requested for review",
        ],
      },
      {
        title: "4. Ask for a quotation that records the open commercial items",
        paragraphs: [
          "The website intentionally does not publish a universal MOQ, production time, payment split or shipping term. These items depend on the selected model, branding, packaging, quantity and destination. They should be confirmed in the formal quotation rather than inferred from a general product page.",
          "A complete inquiry should include the target model, estimated quantity, destination, branding needs and required accessories. This gives the sales team enough information to return a commercially usable response instead of a generic price message.",
        ],
      },
    ],
    faq: [
      {
        question: "Does every portable espresso model use the same accessories?",
        answer: "Every listed TK Classic accessory can be selected as an optional add-on, but the final combination is confirmed against the chosen model and order brief.",
      },
      {
        question: "Are MOQ and production time fixed for every project?",
        answer: "No universal figure is published. Quantity and timing are confirmed after the model, configuration, branding, packaging and destination are reviewed.",
      },
      {
        question: "When are certification documents supplied?",
        answer: "Certification and test documents are provided after inquiry according to the model and destination market.",
      },
    ],
    showModelTable: true,
  },
  {
    slug: "25-bar-portable-coffee-machine-buying-checklist",
    title: "25 bar portable coffee machines: what wholesalers should verify",
    description:
      "A buyer checklist for assessing published pressure, battery, charging, adapters, cup format, documentation and repeat-order consistency before placing an order.",
    eyebrow: "Technical buying checklist",
    readTime: "7 minute read",
    publishedAt: publicationDate,
    updatedAt: publicationDate,
    heroImage: "/optimized/product-scenes/dq-010-1.webp",
    heroAlt: "Official TK Classic DQ-010 portable coffee machine product image",
    keyTakeaways: [
      "Pressure is one published specification, not a complete measure of product suitability.",
      "Battery, heating, charging, adapters and cup capacity must be checked by model.",
      "Use a controlled sample configuration for approval and repeat orders.",
      "Request the document set that matches the model and destination market.",
    ],
    sections: [
      {
        title: "1. Treat 25 bar as one line in a wider specification",
        paragraphs: [
          "The current TK Classic portable espresso range lists a 25 bar extraction platform, but a wholesale decision should not be based on pressure alone. The relevant comparison also includes battery capacity, heating time, charging format, cup size, machine dimensions and the supported coffee adapters.",
          "Use the exact product page for the model under review. Similar silhouettes do not mean identical batteries, charging times, cups or included components.",
        ],
      },
      {
        title: "2. Verify the power and heating workflow",
        paragraphs: [
          "Ask the supplier to identify the battery and charging specification for the selected model, then check it against the target use case. A travel product, a gift set and a retail demonstration unit can place different demands on charging time and heated-cup output.",
          "During sample review, document the charger requirement, operating sequence and the exact sample configuration. Do not transfer a result from one model or battery option to another without confirmation.",
        ],
      },
      {
        title: "3. Confirm the coffee format and serving system",
        paragraphs: [
          "Adapter compatibility changes the buyer proposition. The revised DQ-001 manual lists capsule and ground-coffee adapters. The revised DQ-010 manual lists N-series capsules, Dolce Gusto capsules and ground coffee, plus a separate portable drip-cup method. Other models have their own published configurations. The order brief should name the required adapters rather than use a broad phrase such as ‘capsule compatible.’",
        ],
        bullets: [
          "Coffee format and adapter names",
          "Cup size and single- or double-cup presentation",
          "Accessories included in the retail box",
          "Optional accessories offered as a separate bundle",
        ],
      },
      {
        title: "4. Build a repeat-order reference",
        paragraphs: [
          "For repeat wholesale orders, retain the approved sample reference, artwork version, packaging structure and accessory list. The aim is to reduce ambiguity when the same SKU is reordered or localized for another market.",
          "Compliance files, labels and manuals should be reviewed for the destination market. TK Classic provides available certification documents after inquiry; buyers should confirm which files apply to the selected model and market before order approval.",
        ],
      },
    ],
    faq: [
      {
        question: "Does 25 bar guarantee the same result across every model?",
        answer: "No. Pressure is one specification. Battery, heating, coffee format, cup design, operating sequence and the approved configuration also need to be reviewed.",
      },
      {
        question: "Should a buyer compare models from marketing images alone?",
        answer: "No. Use the published model page and approved sample because similar product shapes can have different specifications and included components.",
      },
      {
        question: "Which documents should a European buyer request?",
        answer: "Request the available model- and market-specific compliance set. The current evidence library includes CE, RoHS, FCC, UKCA, LFGB, FDA, ISO 9001 and EU conformity documents.",
      },
    ],
    showModelTable: true,
  },
  {
    slug: "oem-packaging-checklist-portable-coffee-gift-sets",
    title: "OEM packaging checklist for portable coffee gift sets",
    description:
      "A practical checklist for defining the machine, accessories, artwork, inserts, labels and approval record for a portable coffee gift-set project.",
    eyebrow: "OEM packaging guide",
    readTime: "6 minute read",
    publishedAt: publicationDate,
    updatedAt: publicationDate,
    heroImage: "/optimized/product-scenes/dq-011-1.webp",
    heroAlt: "Official TK Classic DQ-011 portable espresso machine photography for gift programs",
    keyTakeaways: [
      "Define the bundle contents before the packaging artwork starts.",
      "Record logo method, color reference, inserts, labels and manual requirements.",
      "Approve the sample and artwork version as one project record.",
      "Confirm final price, quantity, timing and shipping terms in the quotation.",
    ],
    sections: [
      {
        title: "1. Freeze the bundle architecture",
        paragraphs: [
          "Packaging should start with an exact product list. Identify the machine model, cup, adapters, charging components and every optional accessory included in the set. This determines the insert structure, box size and the claims that can accurately appear on the packaging.",
        ],
        bullets: [
          "Machine model and approved color",
          "Cup and brewing adapters",
          "Charging component and manual",
          "Optional stand, serving pieces or carry bag",
          "Retail box versus outer export packing",
        ],
      },
      {
        title: "2. Separate brand artwork from technical information",
        paragraphs: [
          "The logo method and decorative artwork should be approved separately from technical labels, instructions and destination-market information. TK Classic supports laser engraving, silk screen printing, UV printing and water transfer printing, together with custom gift boxes and color matching.",
          "Use version numbers on artwork files and record the approved logo position, print method and color reference. This avoids relying on filenames such as ‘final-final’ when the order moves from sampling to production.",
        ],
      },
      {
        title: "3. Review the physical presentation",
        paragraphs: [
          "A digital artwork approval does not replace a physical packing check. Review how the machine and accessories sit in the insert, whether the user can identify each component, and whether the opening sequence matches the intended gift experience.",
        ],
        bullets: [
          "Product orientation and protection",
          "Accessory identification",
          "Manual and quick-start placement",
          "Barcode, importer or market label locations where required",
          "Outer-carton and export-packing confirmation",
        ],
      },
      {
        title: "4. Connect approval to the commercial quotation",
        paragraphs: [
          "The approved bundle affects unit price, packaging cost, quantity planning, sample timing and shipping volume. These commercial points should be recorded in the formal quotation after the physical configuration and artwork scope are understood.",
          "Send the target market, expected quantity, launch timing and required document set with the inquiry. TK Classic can then confirm the available packaging path without publishing a universal MOQ or delivery promise that may not apply to the selected program.",
        ],
      },
    ],
    faq: [
      {
        question: "Can accessories be included in a custom gift set?",
        answer: "Yes. Listed accessories can be selected individually or combined with a machine, subject to confirmation of the final configuration and packaging brief.",
      },
      {
        question: "Which logo methods are available?",
        answer: "The published OEM capabilities include laser engraving, silk screen printing, UV printing and water transfer printing.",
      },
      {
        question: "When is the final packaging price confirmed?",
        answer: "It is confirmed in the quotation after the model, accessories, branding, packaging structure, quantity and destination are reviewed.",
      },
    ],
  },
  {
    slug: "portable-espresso-machine-sample-approval-checklist",
    title: "Portable espresso machine sample approval checklist for US buyers",
    description:
      "A model-specific sample inspection checklist for US importers reviewing DQ-001 or DQ-010 before a wholesale, private-label or OEM order.",
    eyebrow: "US importer sample checklist",
    readTime: "7 minute read",
    publishedAt: "2026-08-31",
    updatedAt: "2026-08-31",
    heroImage: "/optimized/product-scenes/dq-010-1.webp",
    heroAlt: "Official TK Classic DQ-010 portable coffee machine photograph for the sample approval checklist",
    keyTakeaways: [
      "Approve one exact model, color and coffee-format configuration rather than a general product family.",
      "Test DQ-001 and DQ-010 against their own published controls, adapters, cup and charging information.",
      "Record included accessories, artwork versions and requested compliance files with the approved sample.",
      "Use the signed sample record and formal quotation as the reference for the bulk-order configuration.",
    ],
    directAnswerTitle: "How should a US importer approve a portable espresso machine sample?",
    directAnswer:
      "Approve the sample as a complete, model-specific configuration: record the model and color, test every required coffee format using the supplied components, verify the published controls and charging workflow, photograph the included accessories, and attach the approved logo, packaging and document requests. For DQ-001, check the capsule and ground-coffee adapters. For DQ-010, separately check the N-series, Dolce Gusto, ground-coffee and documented portable drip-cup formats, together with the LCD information. Final quantity, MOQ and commercial terms remain part of the written quotation.",
    keywords: [
      "portable espresso machine sample approval checklist",
      "coffee machine sample inspection",
      "OEM coffee machine sample order",
      "DQ-001 sample",
      "DQ-010 sample",
      "portable coffee machine US importer",
    ],
    relatedLinks: [
      { href: "/wholesale/usa", label: "US wholesale sourcing path" },
      { href: "/products/dq-001", label: "Review DQ-001 published data" },
      { href: "/products/dq-010", label: "Review DQ-010 published data" },
      { href: "/tools/inquiry-builder", label: "Prepare a sourcing brief" },
    ],
    sections: [
      {
        title: "1. Freeze the exact sample configuration",
        paragraphs: [
          "Write the model, color, cup, coffee formats, adapters, charging component and optional accessories into one sample record before testing begins. A photograph of the machine alone is not enough because similar-looking configurations can include different components.",
          "The current TK Classic sample policy uses charged samples. The sample fee may be refunded or credited after a bulk order is placed and shipped, subject to the confirmed order terms. Sample orders are planned for dispatch within seven days; courier transit and the exact sample charge are confirmed separately.",
        ],
        bullets: [
          "Model and color reference",
          "Coffee formats and matching components",
          "Cup, charging component and optional accessories",
          "Sample order, dispatch and courier reference",
        ],
      },
      {
        title: "2. Test the published workflow for the selected model",
        paragraphs: [
          "DQ-001 is the value-led starting model. Its current record lists capsule and ground-coffee adapters, a 25 bar platform, a 9600mAh / 30Wh battery and USB Type-C charging. Test both required coffee formats with the components supplied in the sample and record the operating sequence used.",
          "DQ-010 is the premium LCD model. Its current record lists a 325 mL cup, N-series capsules, Dolce Gusto capsules, ground coffee and a documented portable drip-cup format. Review each required format separately and confirm that the LCD presents the published temperature, battery-level and extraction-mode information.",
        ],
      },
      {
        title: "3. Connect the sample to branding and compliance review",
        paragraphs: [
          "If the project includes a logo or custom packaging, identify the artwork version, logo position, application method and packaging files reviewed with the sample. Do not approve the machine and the packaging as unrelated records.",
          "Request the available certification and test documents for the selected model and US destination after inquiry. The website shows a compliance overview, but applicable files are supplied according to the model and market rather than offered as unrestricted public downloads.",
        ],
        bullets: [
          "Approved logo artwork and position",
          "Packaging artwork, inserts, labels and manual",
          "Included accessory list",
          "Model- and market-specific document request",
        ],
      },
      {
        title: "4. Build a bulk-order approval record",
        paragraphs: [
          "Keep dated photographs, the configuration list, test notes, artwork versions and requested document list together. This creates a practical reference for the quotation and reduces ambiguity when the project moves from the sample to a bulk order.",
          "The formal quotation should confirm the selected model, quantity, destination, branding, packaging, accessories, MOQ, payment and production arrangements. The sample checklist supports that quotation; it does not replace it.",
        ],
      },
    ],
    faq: [
      {
        question: "Are TK Classic portable espresso machine samples free?",
        answer: "No. Samples are charged. The sample fee may be refunded or credited after a bulk order is placed and shipped, subject to the confirmed order terms.",
      },
      {
        question: "How quickly is a sample order dispatched?",
        answer: "The current policy plans sample dispatch within seven days of the sample order. Courier transit time, destination charges and the exact sample arrangement are confirmed separately.",
      },
      {
        question: "What should a buyer test on a DQ-001 sample?",
        answer: "Test the capsule and ground-coffee configurations supplied with the sample, then record the operating sequence, cup, charging component and included accessories against the DQ-001 product record.",
      },
      {
        question: "What should a buyer test on a DQ-010 sample?",
        answer: "Review the required N-series, Dolce Gusto, ground-coffee and documented portable drip-cup formats separately, and confirm the published LCD information, cup and charging workflow against the DQ-010 product record.",
      },
      {
        question: "When should a US buyer request compliance documents?",
        answer: "Request the available model- and market-specific documents during the inquiry and sample review so the applicable set can be confirmed for the selected product and destination.",
      },
      {
        question: "How does a sample approval carry into a bulk order?",
        answer: "Keep the approved model, color, components, accessories, artwork versions, packaging and document requests in one dated record, then reference that record in the formal quotation and order confirmation.",
      },
    ],
  },
  {
    slug: "portable-espresso-machine-rfq-checklist-us-importers",
    title: "Portable espresso machine RFQ checklist for US importers",
    description:
      "A practical RFQ checklist for US importers requesting a model-specific portable espresso machine quotation without leaving product, packaging or compliance questions undefined.",
    eyebrow: "US importer RFQ checklist",
    readTime: "7 minute read",
    publishedAt: "2026-09-02",
    updatedAt: "2026-09-02",
    heroImage: "/optimized/product-scenes/dq-001-1.webp",
    heroAlt: "Official TK Classic DQ-001 portable espresso machine photograph for the US importer RFQ checklist",
    keyTakeaways: [
      "Name one model and the required coffee formats before asking for commercial terms.",
      "Include destination, quantity estimate, sales channel, branding, packaging and accessories in the RFQ.",
      "Request model- and market-specific documents instead of treating a general certification overview as the final file set.",
      "Keep price, MOQ, payment, production and shipping terms inside the written quotation for the approved configuration.",
    ],
    directAnswerTitle: "What should a portable espresso machine RFQ include?",
    directAnswer:
      "A useful portable espresso machine RFQ should identify the buyer and company, target market, selected model, estimated quantity, required coffee formats, color, logo, packaging, accessories, sample needs and requested compliance documents. For DQ-001, state whether capsule and ground-coffee configurations are required. For DQ-010, identify the required N-series, Dolce Gusto, ground-coffee or documented portable drip-cup formats. Price, MOQ, payment, production and shipping arrangements should then be confirmed for that exact configuration in the formal quotation.",
    keywords: [
      "portable espresso machine RFQ",
      "coffee machine quotation checklist",
      "OEM coffee machine RFQ",
      "portable coffee machine US importer",
      "DQ-001 wholesale quotation",
      "DQ-010 wholesale quotation",
    ],
    relatedLinks: [
      { href: "/wholesale/usa", label: "US wholesale sourcing path" },
      { href: "/products/dq-001", label: "Review DQ-001 published data" },
      { href: "/products/dq-010", label: "Review DQ-010 published data" },
      { href: "/tools/inquiry-builder", label: "Build a structured inquiry" },
      { href: "/certifications", label: "Review the compliance evidence overview" },
    ],
    sections: [
      {
        title: "1. Identify the exact sourcing project",
        paragraphs: [
          "Start with the company, buyer type, destination market and intended sales channel. A US importer preparing an ecommerce launch may need a different packaging and document brief from a gift distributor or outdoor-products wholesaler.",
          "Add an estimated quantity range for quotation planning, but do not treat that estimate as a published MOQ. TK Classic confirms MOQ and commercial terms after the model, configuration and customization scope are understood.",
        ],
        bullets: [
          "Company and buyer contact",
          "Destination market and delivery location",
          "Import, wholesale, retail, ecommerce or private-label channel",
          "Estimated quantity for the requested quotation",
        ],
      },
      {
        title: "2. Freeze the model and coffee-format configuration",
        paragraphs: [
          "Name the model rather than requesting a general portable coffee machine price. DQ-001 is the value-led starting model with capsule and ground-coffee adapters. DQ-010 is the premium LCD model with a 325 mL cup and published N-series, Dolce Gusto, ground-coffee and portable drip-cup formats.",
          "List every required coffee format and optional accessory. Included components must be confirmed in the quotation because a photograph or general compatibility statement does not define the final retail package.",
        ],
        bullets: [
          "Model and required color",
          "Coffee formats and matching adapters or components",
          "Cup, charging component and optional accessories",
          "Sample configuration to be reviewed before a bulk order",
        ],
      },
      {
        title: "3. Describe branding, packaging and document needs",
        paragraphs: [
          "State whether the project needs a logo, custom color or packaging. If artwork already exists, identify the required application area and attach the current version so the customization discussion refers to a controlled file.",
          "Request the available compliance and test documents for the selected model and US market. The website presents a compliance overview, while the applicable files are provided after inquiry according to the model and destination rather than assumed from the overview image alone.",
        ],
        bullets: [
          "Logo method, position and artwork file",
          "Packaging, insert, manual and label requirements",
          "Optional accessories included in the intended retail offer",
          "Model- and market-specific document request",
        ],
      },
      {
        title: "4. Ask for a quotation that closes the open terms",
        paragraphs: [
          "The formal quotation should connect the model, configuration, quantity, destination, branding, packaging and accessories to the commercial terms. TK Classic supports T/T, PayPal and Western Union; the final payment arrangement is recorded for the actual project.",
          "Samples are charged and are planned for dispatch within seven days of the sample order. The sample fee may be refunded or credited after a bulk order is placed and shipped, subject to the confirmed order terms. Courier transit, final production timing, MOQ and shipping arrangements remain part of the written quotation and order discussion.",
        ],
      },
    ],
    faq: [
      {
        question: "What information does TK Classic need for a portable espresso machine quotation?",
        answer: "Provide the company and buyer contact, target market, selected model, estimated quantity, required coffee formats, color, branding, packaging, accessories, sample needs and requested compliance documents.",
      },
      {
        question: "Are wholesale prices published before an RFQ is reviewed?",
        answer: "No. Price is confirmed privately after the exact model, configuration, estimated quantity, destination, branding, packaging and accessory requirements are reviewed.",
      },
      {
        question: "Is one MOQ published for every portable espresso machine project?",
        answer: "No universal MOQ is published. MOQ is discussed after the selected model, configuration, customization and quantity requirements are understood.",
      },
      {
        question: "Can a US importer request a sample before a bulk order?",
        answer: "Yes. Samples are charged and are planned for dispatch within seven days of the sample order. The sample fee may be refunded or credited after a bulk order is placed and shipped, subject to the confirmed order terms.",
      },
      {
        question: "Which payment methods can be discussed in the quotation?",
        answer: "TK Classic supports T/T, PayPal and Western Union. The final payment arrangement is recorded in the formal quotation for the project.",
      },
      {
        question: "How should a buyer request certification and test documents?",
        answer: "Name the selected model and destination market in the RFQ. TK Classic then confirms the available model- and market-specific document set after inquiry.",
      },
    ],
  },
];

export const buyerGuides: BuyerGuide[] = [...sourcingGuides, ...geoGuides];

export function getBuyerGuide(slug: string) {
  return buyerGuides.find((guide) => guide.slug === slug);
}
