type Guide = {
  slug: string; title: string; description: string; eyebrow: string; readTime: string; publishedAt: string; updatedAt: string;
  heroImage: string; heroAlt: string; keyTakeaways: string[];
  directAnswer?: string;
  keywords?: string[];
  relatedLinks?: Array<{ href: string; label: string }>;
  sections: Array<{ title: string; paragraphs: string[]; bullets?: string[] }>;
  faq: Array<{ question: string; answer: string }>;
  showModelTable?: boolean;
};

const publicationDate = "2026-08-10";

export const geoGuides: Guide[] = [
  {
    slug: "choose-portable-espresso-machine-for-camping",
    title: "How to choose a portable espresso machine for camping",
    description: "A practical guide to comparing battery, charging, coffee formats, cup capacity and packing needs before choosing a portable espresso machine for a camping setup.",
    eyebrow: "Outdoor coffee guide", readTime: "7 minute read", publishedAt: publicationDate, updatedAt: "2026-08-24",
    heroImage: "/optimized/lifestyle/dq-010-camp.webp", heroAlt: "TK Classic DQ-010 portable coffee machine shown in an outdoor setting",
    directAnswer: "Choose a portable espresso machine for camping by checking access to charging and potable water, the exact capsule or ground-coffee formats, cup and tank capacity, packed components, and model-specific operating instructions. Do not choose by pressure alone. For a wholesale program, confirm the complete model, adapter, accessory and packaging configuration in writing after sample review.",
    keywords: ["how to choose a portable espresso machine for camping", "camping espresso machine buying guide", "battery powered coffee machine for camping", "portable coffee machine wholesale", "outdoor coffee machine OEM"],
    relatedLinks: [
      { href: "/camping-coffee-machine", label: "Portable coffee machine for camping overview" },
      { href: "/products/dq-005", label: "Review DQ-005 published model data" },
      { href: "/products/dq-010", label: "Review DQ-010 published model data" },
      { href: "/wholesale/usa", label: "US wholesale sourcing path" },
    ],
    keyTakeaways: ["Start with access to charging, water and the preferred coffee format.", "Compare exact model data rather than judging from product shape alone.", "Include the cup, adapters and charging components in the packing plan.", "Confirm the selected configuration before ordering."],
    sections: [
      { title: "1. Define the outdoor routine first", paragraphs: ["A camping coffee setup begins with practical constraints: how water will be carried, whether charging is available, which coffee format will be packed and how many drinks are expected between charges. The right portable machine is the one whose published configuration fits that routine.", "Do not assume every portable model has the same battery, cup, charging time or adapters. Build a short checklist before comparing individual models."], bullets: ["Trip length and access to power", "Capsule or ground-coffee preference", "Cup and water requirements", "Machine, adapter and accessory packing space"] },
      { title: "2. Compare battery and charging by model", paragraphs: ["TK Classic publishes battery and charging information on each model page. The revised DQ-005 record lists a 9600mAh battery and about four hours of charging with a 5 V / 3 A supply. Other models publish different charging times or charging formats.", "Battery capacity alone is not a complete estimate of field use. The published heating information, operating sequence and approved sample configuration should be reviewed together."] },
      { title: "3. Check coffee formats and cup design", paragraphs: ["Adapter compatibility affects what must be packed. The revised DQ-001 manual lists capsule and ground-coffee adapters. The revised DQ-010 manual lists N-series capsules, Dolce Gusto capsules and ground coffee, plus a separate portable drip-cup method. Other models have their own records.", "Select the exact coffee format before requesting a quotation, and confirm which adapters and accessories are included rather than assuming that every pictured component is standard."] },
      { title: "4. Treat the product page as the source of truth", paragraphs: ["Outdoor photographs help explain portability, but they do not replace model data. Use the product page for the pressure, battery, charging, heat, cup, dimensions and adapter information.", "For a wholesale or private label project, send the model, estimated quantity, market, branding, packaging and required accessories so the final configuration can be confirmed in writing."] },
    ],
    faq: [
      { question: "What should I check before choosing a camping espresso machine?", answer: "Check charging access, water, coffee format, cup capacity, battery information, the operating sequence and the full packed configuration." },
      { question: "Are all portable espresso machines compatible with the same capsules?", answer: "No. Adapter compatibility is model-specific. Use the selected product page and quotation to confirm the required coffee formats." },
      { question: "Is battery capacity enough to compare camping coffee machines?", answer: "No. Read battery capacity together with the model-specific charging method, charging time, heating information, coffee formats, cup arrangement and operating instructions." },
      { question: "Which product records should a wholesale buyer review for camping programs?", answer: "Start with the models connected to travel in the current TK Classic records, then review each model page and manual separately. DQ-005 and DQ-010 have different charging, cup and coffee-format information, so their specifications should not be combined." },
      { question: "Does an outdoor image prove a model's performance?", answer: "No. Images show the product and use setting; published specifications and an approved sample remain the source of truth for performance and configuration." },
    ], showModelTable: true,
  },
  {
    slug: "how-to-make-espresso-outdoors",
    title: "How to make espresso outdoors with a portable coffee machine",
    description: "A clear outdoor espresso preparation framework based on the real DQ-010 operation sequence, with planning notes for water, coffee, charging and cleanup.",
    eyebrow: "Outdoor preparation guide", readTime: "6 minute read", publishedAt: publicationDate, updatedAt: publicationDate,
    heroImage: "/optimized/product-scenes/dq-010-1.webp", heroAlt: "Official DQ-010 portable coffee machine product photograph used in the outdoor espresso guide",
    keyTakeaways: ["Prepare water, coffee and the correct adapter before assembly.", "Follow the demonstrated sequence for the selected model.", "Keep the machine stable while espresso flows into the cup.", "Clean and dry the removable coffee components after use."],
    sections: [
      { title: "1. Prepare the complete setup", paragraphs: ["Before starting outdoors, place the machine, charged power source, water, coffee, compatible coffee container and cup on a stable surface. Wind, uneven ground and limited water make preparation more important than it is on a kitchen counter.", "Use only the coffee format and adapter listed for the selected model. If the product was supplied as part of a bundle, keep the approved component list with the instructions."] },
      { title: "2. Add coffee and water in the demonstrated order", paragraphs: ["The real DQ-010 operation video shows coffee being loaded into the compatible container, water being added, the components being assembled and the machine being started. Follow the supplied instructions for the selected configuration rather than transferring a sequence from another model.", "Published water-tank and cup information describes capacity; it is not a substitute for the operating instructions supplied with the product."] },
      { title: "3. Start extraction and keep the cup stable", paragraphs: ["Once assembled, place the cup beneath the outlet and start the machine as shown in the model demonstration. Allow the extraction to finish without moving the machine or cup.", "The current product pages publish pressure, heating and battery information by model. Do not infer a temperature, extraction time or drink count that is not listed for the selected machine."] },
      { title: "4. Pack out the complete coffee setup", paragraphs: ["After use, allow the relevant parts to cool, remove used coffee, and clean and dry the removable coffee components according to the supplied instructions. Carry used grounds, capsules and cleaning water out of sensitive outdoor areas.", "For repeat travel, store the adapter, cup and charging component together so the same verified configuration is available next time."] },
    ],
    faq: [
      { question: "Can a portable coffee machine heat water before extraction?", answer: "Current TK Classic product pages publish model-specific heating information. Check the selected model record and operating instructions before use." },
      { question: "Can I use capsules and ground coffee outdoors?", answer: "Use only the formats listed for the selected model and the matching adapter supplied or confirmed for that configuration." },
      { question: "Where can I see a real operating sequence?", answer: "The DQ-010 product page and homepage include real-product preparation and extraction video presentations for DQ-010." },
    ],
  },
  {
    slug: "portable-coffee-machine-buying-guide",
    title: "Portable coffee machine buying guide: battery, pressure, adapters and cup size",
    description: "Learn how to compare published portable coffee machine specifications without treating a single number or marketing image as the complete buying decision.",
    eyebrow: "Product comparison guide", readTime: "8 minute read", publishedAt: publicationDate, updatedAt: publicationDate,
    heroImage: "/optimized/product-scenes/dq-001-1.webp", heroAlt: "Official TK Classic portable espresso machine range used for the buying guide",
    keyTakeaways: ["Compare the intended use before individual numbers.", "Read battery, charging and heated-cup information together.", "Confirm coffee adapters and included accessories.", "Use an approved sample and written quotation for the final decision."],
    sections: [
      { title: "1. Start with the use and buying scenario", paragraphs: ["A travel product, office coffee routine, double-cup demonstration and premium gift set do not need the same presentation or accessories. Define the destination market, channel, coffee format and packaging goal before ranking models.", "TK Classic publishes use-case labels for each current model. These labels help narrow the range but do not replace the full specification and sample review."] },
      { title: "2. Read pressure as one specification", paragraphs: ["The current TK Classic range lists a 25 bar extraction platform, but pressure alone does not identify the best model for a program. Battery, charging, heating, cup design, size, adapters and included components also affect suitability.", "When two models share a pressure figure, compare the remaining fields rather than assuming that their operation or configuration is identical."] },
      { title: "3. Compare battery, charging and cup information", paragraphs: ["A larger battery number does not by itself describe charging time or heated-cup output. The revised DQ-005 manual lists about four hours with 5 V / 3 A charging, while the confirmed DQ-010 record lists about two hours via USB Type-C. Cup formats include the 300 mL DQ-001 and DQ-005, the 325 mL DQ-010 and the separately documented formats of other models.", "Use the model table and individual product pages to keep these figures attached to the correct images and model names."] },
      { title: "4. Confirm adapters, accessories and commercial terms", paragraphs: ["Name the required capsule or ground-coffee format in the inquiry. Confirm the cup, adapter, charging component, optional accessories, branding and packaging together.", "Price, MOQ, payment, lead time, Incoterms, warranty and shipping depend on the selected project and are therefore confirmed in the formal quotation rather than published as universal promises."] },
    ],
    faq: [
      { question: "Is higher pressure the only factor when choosing a portable espresso machine?", answer: "No. Battery, charging, heating, cup design, coffee formats, size, operating sequence and the approved configuration should also be compared." },
      { question: "Why should buyers compare model pages separately?", answer: "Similar product shapes can have different batteries, charging times, cup formats and adapters. Each model page keeps the published data attached to the correct model." },
      { question: "Where are MOQ and final price confirmed?", answer: "They are confirmed in the formal quotation after the model, configuration, quantity, branding, packaging and destination are reviewed." },
    ], showModelTable: true,
  },
  {
    slug: "portable-espresso-machine-vs-traditional-espresso-machine",
    title: "Portable espresso machine vs traditional espresso machine: what changes?",
    description: "A practical comparison of portable and traditional espresso setups for travel, space, power, coffee formats and buying decisions.",
    eyebrow: "Category comparison", readTime: "7 minute read", publishedAt: publicationDate, updatedAt: publicationDate,
    heroImage: "/optimized/product-scenes/dq-005-1.webp", heroAlt: "Official DQ-005 portable espresso machine photograph for the category comparison guide",
    keyTakeaways: ["Portable machines prioritize compact, self-contained preparation.", "Traditional machines usually depend on a fixed countertop and mains-power routine.", "Coffee format, cup output and workflow matter more than category labels alone.", "Compare a portable model using its exact published data."],
    sections: [
      { title: "1. Portability changes the preparation environment", paragraphs: ["A portable espresso machine is designed to move between travel, office, retail demonstration or gifting contexts. A traditional espresso machine is generally planned around a fixed countertop, a stable mains-power connection and a larger preparation area.", "This distinction describes the setup, not a universal guarantee about drink quality. The selected coffee, grind, capsule, water, operating sequence and machine configuration all affect the result."] },
      { title: "2. Power and heating are evaluated differently", paragraphs: ["Battery-powered portable machines publish battery, charging and heated-cup information because buyers need to plan use away from a fixed outlet. Traditional machines are usually evaluated around mains power, warm-up behavior and a stationary workflow.", "For portable models, read battery capacity together with charging time and the published operating information. Do not estimate output from battery capacity alone."] },
      { title: "3. Coffee formats and serving design vary by model", paragraphs: ["Portable models can use capsules, ground coffee or model-specific adapters. The revised DQ-001 manual lists capsule and ground-coffee adapters. The revised DQ-010 manual lists N-series capsules, Dolce Gusto capsules and ground coffee, and separately documents a portable drip-cup method. DQ-008 uses a double-cup presentation.", "Traditional machines also differ widely, so the comparison should be between specific configurations rather than two broad labels."] },
      { title: "4. Choose according to the actual routine", paragraphs: ["A portable model may fit buyers who need compact storage, travel, an office routine, a gift set or a mobile product demonstration. A traditional machine may fit a fixed preparation environment where portability is not required.", "For wholesale sourcing, translate the intended routine into a model, accessory, branding and packaging brief before requesting commercial terms."] },
    ],
    faq: [
      { question: "Is a portable espresso machine simply a smaller traditional machine?", answer: "Not necessarily. Portable models have their own battery, charging, cup and adapter configurations designed around mobile preparation." },
      { question: "Does portable automatically mean suitable for every outdoor setting?", answer: "No. Charging, water, stability, coffee format and the selected model's operating requirements still need to fit the setting." },
      { question: "Which category is better?", answer: "Neither category is universally better. The right choice depends on the actual preparation environment, coffee format, output and product program." },
    ],
  },
  {
    slug: "how-battery-powered-portable-coffee-machine-works",
    title: "How does a battery-powered portable coffee machine work?",
    description: "Understand the verified preparation sequence of a battery-powered portable coffee machine without inferring unlisted internal structures or performance claims.",
    eyebrow: "Technology explained", readTime: "6 minute read", publishedAt: publicationDate, updatedAt: publicationDate,
    heroImage: "/optimized/video-posters/dq-010-extraction-animation.webp", heroAlt: "DQ-010 extraction presentation video cover showing a portable coffee machine and cup",
    keyTakeaways: ["The battery supports the model's published heating and extraction workflow.", "Coffee and water are prepared in the compatible model-specific components.", "The machine heats water and moves it through the coffee during extraction.", "Exact battery, heat, cup and adapter data remain model-specific."],
    sections: [
      { title: "1. Power comes from the published battery configuration", paragraphs: ["A battery-powered portable coffee machine stores electrical energy for the operating sequence described for that model. TK Classic product pages publish battery and charging information separately for each model.", "Battery capacity does not by itself prove charging speed, drink count or heating time. Those fields must be read from the same model record and confirmed against the selected configuration."] },
      { title: "2. Coffee and water are loaded into compatible components", paragraphs: ["Before extraction, the user prepares the listed coffee container or adapter and adds water in the order shown in the operating instructions. Capsule and ground-coffee compatibility differs by model.", "The adapter name matters. A general statement such as capsule compatible is not enough for a wholesale specification or a user guide."] },
      { title: "3. Heating and pressure support extraction", paragraphs: ["In the published DQ-010 presentation, the machine heats the water before pressure moves hot water through the prepared coffee and the extracted coffee flows into the cup. This describes the visible operating sequence, not an unverified claim about hidden internal parts.", "The current TK Classic product records list a 25 bar platform, together with model-specific heating, battery and cup information."] },
      { title: "4. The correct explanation stays model-specific", paragraphs: ["A clear technical explanation names the model, battery, charging, heat, cup and adapter information and links back to the product page. It does not transfer a figure from another machine because the silhouettes appear similar.", "For OEM documentation, the operating sequence, labels, manual and included components should match the approved sample and quotation record."] },
    ],
    faq: [
      { question: "Does the battery both heat water and support extraction?", answer: "The published model workflow uses the battery-powered machine for heating and extraction. Exact battery, heat and output information is model-specific." },
      { question: "Do all battery-powered portable machines use the same adapters?", answer: "No. The listed capsule, ground-coffee and drip components differ by model." },
      { question: "Can an animation prove an internal component design?", answer: "No. Presentation media explains the visible workflow. It should not be used to infer an unlisted internal structure, material or performance claim." },
    ], showModelTable: true,
  },
];
