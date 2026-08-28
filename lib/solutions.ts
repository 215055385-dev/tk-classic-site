export type SolutionPage = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  answer: string;
  modelSlugs: string[];
  checks: string[];
  faq: Array<{ question: string; answer: string }>;
};

export const solutions: SolutionPage[] = [
  {
    slug: "amazon-private-label",
    title: "Portable Coffee Machine Private Label Guide for Amazon and Marketplace Sellers",
    description: "Build a marketplace sourcing brief using verified model data, packaging decisions, branding requirements and destination-market document checks.",
    eyebrow: "Marketplace seller pathway",
    answer: "TK Classic supports portable coffee machine wholesale and private label inquiries. This pathway helps marketplace sellers compare the six published models and prepare the information needed for a quotation; it does not claim Amazon account management, FBA certification or guaranteed marketplace performance.",
    modelSlugs: ["dq-001", "dq-002", "dq-005", "dq-008", "dq-010", "dq-011"],
    checks: ["Choose the model from its published specifications and coffee formats.", "Record branding, packaging, accessories and destination market.", "Confirm carton, label and documentation requirements before artwork approval.", "Request the applicable compliance documents and commercial terms in writing."],
    faq: [
      { question: "Does TK Classic guarantee Amazon or marketplace approval?", answer: "No. Marketplace listing and account approval are controlled by the platform. TK Classic confirms the available product configuration and applicable documents for the selected model and market." },
      { question: "When are order quantity, sample timing and packaging terms confirmed?", answer: "They are confirmed after the model, branding, packaging, destination and estimated quantity are reviewed in the inquiry." },
    ],
  },
  {
    slug: "coffee-brand-oem",
    title: "Portable Espresso Machine OEM Guide for Coffee Brands",
    description: "Prepare a coffee brand OEM brief around verified coffee formats, model specifications, branding, packaging and sample approval.",
    eyebrow: "Coffee brand pathway",
    answer: "Coffee brands can use the published model pages and supplied manual data to compare coffee formats, cup information, charging details and accessories before requesting an OEM quotation. Final branding, packaging, samples and commercial terms are confirmed for the actual project.",
    modelSlugs: ["dq-001", "dq-002", "dq-005", "dq-008", "dq-010", "dq-011"],
    checks: ["Compare only the coffee formats documented for each model.", "Define logo, color, packaging and included accessory requirements.", "Review the physical product and packaging sample before approval.", "Keep the approved configuration and applicable documents in the written order record."],
    faq: [
      { question: "Can a coffee brand choose any listed coffee format for every model?", answer: "No. Coffee formats and adapters differ by model. The individual product page and final quotation must be used to confirm the selected configuration." },
      { question: "How are branding and packaging approved?", answer: "The project brief, artwork and physical sample are reviewed before production planning. The exact approval scope is recorded for the order." },
    ],
  },
  {
    slug: "outdoor-wholesale",
    title: "Portable Coffee Machine Guide for Outdoor Wholesalers",
    description: "Review verified travel-use models and prepare an outdoor wholesale inquiry without relying on unverified durability or environmental claims.",
    eyebrow: "Outdoor wholesale pathway",
    answer: "DQ-005 and DQ-010 are the current models whose published use scenarios explicitly include travel. Outdoor wholesalers should evaluate their documented specifications, charging information, coffee formats and accessories, then request any required environmental or durability evidence rather than assuming an IP rating or test result.",
    modelSlugs: ["dq-005", "dq-010"],
    checks: ["Compare the published size, cup, battery, charging and coffee-format information.", "Define the intended travel set, carry bag, stand and packaging requirements.", "Do not assume waterproof, drop or cold-weather ratings unless documents are provided.", "Confirm warranty, spare parts and destination-market documents in writing."],
    faq: [
      { question: "Are waterproof, drop-test or low-temperature ratings published for these models?", answer: "No such ratings are claimed on this website. Buyers who require specific test evidence should include it in the inquiry for written confirmation." },
      { question: "Which models currently list travel as a published use scenario?", answer: "DQ-005 and DQ-010 currently list travel in their published use cases." },
    ],
  },
  {
    slug: "travel-coffee",
    title: "Portable Coffee Machines for Travel Programs",
    description: "Compare the published TK Classic models that identify travel as a use scenario, including charging, cup capacity, coffee adapters and inquiry requirements.",
    eyebrow: "Travel coffee solution",
    answer: "DQ-005 and DQ-010 are the current TK Classic models whose published use scenarios explicitly include travel. Buyers should compare their model-specific charging, cup, battery and adapter information before selecting a configuration.",
    modelSlugs: ["dq-005", "dq-010"],
    checks: ["Confirm the charging format and charging time for the selected model.", "Compare cup capacity and the listed coffee adapters.", "Record the required accessories and packaging in the quotation brief.", "Confirm destination-market documents after selecting the model."],
    faq: [
      { question: "Which TK Classic models are listed for travel use?", answer: "The current published use cases explicitly identify DQ-005 and DQ-010 for travel." },
      { question: "Do DQ-005 and DQ-010 have identical specifications?", answer: "No. Their charging, cup capacity, dimensions and adapter information differ. Use each product page as the source of truth." },
    ],
  },
  {
    slug: "office-coffee",
    title: "Portable Coffee Machine for Office Coffee Routines",
    description: "Review DQ-010 as the current TK Classic model explicitly positioned for office coffee, with its published cup, charging and adapter information.",
    eyebrow: "Office coffee solution",
    answer: "DQ-010 is the current TK Classic model whose published use cases explicitly include office coffee. Its revised manual lists a 325 mL cup, 25 bar pressure, a 9600mAh battery, N-series capsules, Dolce Gusto capsules and ground coffee.",
    modelSlugs: ["dq-010"],
    checks: ["Review the 325 mL cup format against the intended routine.", "Confirm the required N-series, Dolce Gusto, ground-coffee or portable drip-cup components.", "Use the real DQ-010 operation video to review the preparation sequence.", "Confirm commercial terms and included accessories in the quotation."],
    faq: [
      { question: "Which published model is positioned for office coffee?", answer: "DQ-010 is the current model whose published use cases explicitly include office coffee." },
      { question: "Which coffee formats are documented for DQ-010?", answer: "The revised DQ-010 manual lists N-series capsules, Dolce Gusto capsules and ground coffee. It also documents a separate portable drip-cup method. Final included components must be confirmed in the quotation." },
    ],
  },
  {
    slug: "gift-programs",
    title: "Portable Coffee Machines for Gift and Private Label Programs",
    description: "Compare current TK Classic portable coffee models positioned for gift sets, promotional gifts, retail bundles and private label programs.",
    eyebrow: "Gift program solution",
    answer: "Several current TK Classic models list gift-related use cases. DQ-011 is specifically positioned for premium gift sets and private label programs, while DQ-001, DQ-002, DQ-005 and DQ-008 also list gift or promotional use scenarios.",
    modelSlugs: ["dq-011", "dq-005", "dq-001", "dq-002", "dq-008"],
    checks: ["Freeze the machine, cup, adapters and optional accessories before artwork starts.", "Confirm the logo method, color reference and approved artwork version.", "Review the physical product and packaging sample together.", "Record quantity, timing, payment and shipping terms in the formal quotation."],
    faq: [
      { question: "Which model is specifically positioned for premium gift sets?", answer: "DQ-011 is the current model specifically described for premium gift sets and private label programs." },
      { question: "Can optional accessories be included in a gift set?", answer: "Yes. Listed accessories can be selected and combined with a machine after the final configuration and packaging brief are confirmed." },
    ],
  },
  {
    slug: "shared-use",
    title: "Double-Cup Portable Coffee Maker for Shared Use",
    description: "Review the published DQ-008 double-cup format for shared-use demonstrations, promotional programs and retail presentation.",
    eyebrow: "Shared-use solution",
    answer: "DQ-008 is the current TK Classic model explicitly described as a double-cup portable coffee maker for shared use. Its published record lists a 250 mL capacity per cup and a double-cup design.",
    modelSlugs: ["dq-008"],
    checks: ["Review the double-cup presentation in the official product images.", "Confirm the selected battery option in the quotation.", "Confirm the required Nespresso pod adapter and ground coffee chamber.", "Record promotional packaging and accessory requirements before approval."],
    faq: [
      { question: "Which TK Classic model has a double-cup design?", answer: "DQ-008 is the current published double-cup model." },
      { question: "What cup information is published for DQ-008?", answer: "The current product record lists 250 mL per cup and a double-cup design." },
    ],
  },
];

export function getSolution(slug: string) { return solutions.find((item) => item.slug === slug); }
