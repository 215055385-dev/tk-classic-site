export type ScenarioPageData = {
  slug: "camping-coffee-machine" | "travel-coffee-machine" | "car-coffee-machine";
  eyebrow: string;
  title: string;
  description: string;
  directAnswer: string;
  heroModel: string;
  modelSlugs: string[];
  whyTitle: string;
  whyPoints: Array<{ title: string; description: string }>;
  howTitle: string;
  howSteps: Array<{ title: string; description: string }>;
  typeTitle: string;
  typeAnswer: string;
  buyerChecks: string[];
  caution: string;
  faqs: Array<{ question: string; answer: string }>;
  guideSlug?: string;
};

export const scenarioPages: ScenarioPageData[] = [
  {
    slug: "camping-coffee-machine",
    eyebrow: "Outdoor coffee guide",
    title: "Portable Coffee Machine for Camping",
    description:
      "Learn how to choose and use a portable coffee machine for camping, with verified TK Classic travel-model information and a practical wholesale buyer checklist.",
    directAnswer:
      "A portable coffee machine can simplify espresso preparation at a campsite because it combines the brewing unit and cup-friendly format in a compact product. Buyers still need to plan water, charging, coffee format and safe use on a stable surface. TK Classic currently lists DQ-005 and DQ-010 for travel use; camping suitability and the final package must be confirmed for each project.",
    heroModel: "DQ-005",
    modelSlugs: ["dq-005", "dq-010"],
    guideSlug: "choose-portable-espresso-machine-for-camping",
    whyTitle: "Why use a portable coffee machine while camping?",
    whyPoints: [
      { title: "Less equipment to carry", description: "A portable brewing format reduces the need to transport a full-size countertop espresso machine." },
      { title: "Repeatable preparation", description: "The product manual gives a defined sequence for water, the compatible coffee container, assembly and extraction." },
      { title: "Flexible coffee planning", description: "Coffee-format compatibility varies by model, so buyers can select a model around the capsules or ground coffee intended for the program." },
    ],
    howTitle: "How do you use a portable coffee machine at a campsite?",
    howSteps: [
      { title: "Prepare water and coffee", description: "Use potable water and the coffee format documented for the selected model." },
      { title: "Assemble on a stable surface", description: "Fit the correct coffee container or adapter in the order shown in that model’s manual." },
      { title: "Run the documented cycle", description: "Follow the model-specific control sequence; do not transfer button instructions from another model." },
      { title: "Cool and clean removable parts", description: "After use, follow the model manual for removable-part cleaning and keep the main unit away from immersion." },
    ],
    typeTitle: "What type of portable coffee machine is best for camping?",
    typeAnswer:
      "The right type depends on the planned coffee format, water capacity, charging plan, group size and required accessories. For a wholesale or private-label project, compare published model data first, then confirm the complete package and destination-market documents in the quotation.",
    buyerChecks: ["Coffee format and included adapters", "Water capacity and cup format", "Charging method and charging time", "Carry, packaging and optional accessory requirements", "Destination-market documentation after model selection"],
    caution:
      "Camping is not currently listed as a separate certified product claim. DQ-005 and DQ-010 are shown because their published records include travel use. Confirm the intended outdoor configuration before ordering.",
    faqs: [
      { question: "Why might campers choose a portable coffee machine?", answer: "It can reduce the amount of coffee equipment carried and provide a defined preparation sequence. Water, charging, coffee compatibility and safe placement still need planning." },
      { question: "How should a portable coffee machine be used while camping?", answer: "Use it on a stable surface, follow the selected model’s manual, use the documented coffee container or adapter, and clean only as instructed after the unit has cooled." },
      { question: "Which TK Classic models are currently connected to travel use?", answer: "The current published records explicitly list travel for DQ-005 and DQ-010. Final camping suitability and package contents must be confirmed in the quotation." },
    ],
  },
  {
    slug: "travel-coffee-machine",
    eyebrow: "Travel coffee guide",
    title: "Best Portable Espresso Machine for Travel",
    description:
      "Compare the verified factors that matter when choosing a portable espresso machine for travel, including coffee formats, capacity, charging and accessories.",
    directAnswer:
      "The best portable espresso machine for travel is the model whose verified coffee formats, water capacity, charging method and package contents match the trip. TK Classic currently lists DQ-005 and DQ-010 for travel use. They are not identical, so buyers should use each product page and current manual as the source of truth.",
    heroModel: "DQ-010",
    modelSlugs: ["dq-005", "dq-010"],
    whyTitle: "What matters most in a travel espresso machine?",
    whyPoints: [
      { title: "Coffee-format compatibility", description: "Check which capsules or ground-coffee components are documented for the exact model." },
      { title: "Water and cup format", description: "Compare the published capacity with the intended serving routine and packing space." },
      { title: "Charging plan", description: "Review the documented charging format and time before choosing the travel configuration." },
    ],
    howTitle: "How do you prepare espresso while travelling?",
    howSteps: [
      { title: "Confirm the model setup", description: "Pack the correct coffee container, adapters and accessories for the selected model." },
      { title: "Add coffee and water", description: "Follow the order and capacity guidance in the model-specific manual." },
      { title: "Start the correct cycle", description: "Use the control sequence documented for that model and water condition." },
      { title: "Clean before repacking", description: "Let the unit cool and follow the manual’s cleaning instructions before storage." },
    ],
    typeTitle: "Which TK Classic portable espresso type suits travel?",
    typeAnswer:
      "DQ-005 and DQ-010 are the current models whose published use scenarios include travel. Compare their model-specific coffee formats, cup capacity, battery, charging and physical dimensions; do not assume the specifications are interchangeable.",
    buyerChecks: ["Trip length and charging access", "Preferred capsule or ground-coffee format", "Cup capacity and packed dimensions", "Required carry and retail accessories", "Final package contents in the written quotation"],
    caution:
      "Airline, railway and destination rules for batteries and liquids vary. Buyers and end users should check the applicable carrier and local requirements before travel.",
    faqs: [
      { question: "What is the best portable espresso machine for travel?", answer: "It is the model whose verified charging, coffee-format, capacity and package details match the trip. There is no single model that is best for every travel routine." },
      { question: "Which TK Classic models list travel as a use scenario?", answer: "DQ-005 and DQ-010 currently list travel in their published product records." },
      { question: "Can I take a battery-powered coffee machine on a flight?", answer: "Carrier and destination rules differ. Check the airline’s current battery and baggage requirements before travelling." },
    ],
  },
  {
    slug: "car-coffee-machine",
    eyebrow: "Road-trip coffee guide",
    title: "Coffee Machine for Car and Road Trips",
    description:
      "Understand how to choose and safely plan a portable coffee machine for car and road-trip use without assuming undocumented vehicle-power compatibility.",
    directAnswer:
      "For road trips, choose a portable coffee machine by verified battery, charging, coffee-format, cup and cleaning information. TK Classic currently lists DQ-005 and DQ-010 for travel use, but the published records do not establish universal in-car charging compatibility. Use the machine only when safely parked and confirm the required charging setup before ordering.",
    heroModel: "DQ-010",
    modelSlugs: ["dq-005", "dq-010"],
    whyTitle: "Why plan a portable coffee machine for road trips?",
    whyPoints: [
      { title: "Coffee between destinations", description: "A portable format can support planned coffee stops without carrying a countertop machine." },
      { title: "Known preparation sequence", description: "A model-specific manual makes water, coffee, assembly, operation and cleaning easier to plan." },
      { title: "Bundle flexibility", description: "Compatible accessories can be discussed as part of a retail, gift or private-label road-trip bundle." },
    ],
    howTitle: "How should a portable coffee machine be used on a road trip?",
    howSteps: [
      { title: "Park before preparation", description: "Do not prepare or operate the machine while driving. Choose a safe, stable stopping place." },
      { title: "Use the documented setup", description: "Add water and the compatible coffee container according to the selected model’s manual." },
      { title: "Complete the extraction", description: "Run the model-specific cycle and keep the machine stable while coffee flows into the cup." },
      { title: "Cool, clean and store", description: "Follow the manual before placing the machine back into a bag or vehicle storage area." },
    ],
    typeTitle: "What type of coffee machine works for car and road-trip planning?",
    typeAnswer:
      "Prioritize a portable model with published battery and charging information, compatible coffee formats, a practical cup arrangement and clear cleaning instructions. Confirm any vehicle charging accessory or voltage requirement in writing because it is not universal across models or cars.",
    buyerChecks: ["Written confirmation of charging requirements", "No operation while the vehicle is moving", "Stable cup and machine placement", "Coffee-format and water planning", "Storage and cleaning between stops"],
    caution:
      "TK Classic does not present these models as universally compatible with every vehicle power outlet. Confirm the selected charging arrangement and local safety requirements before the project is approved.",
    faqs: [
      { question: "Can a portable coffee machine be used in a car?", answer: "Use should be planned only while safely parked on a stable surface. Vehicle charging compatibility must be confirmed for the selected model and vehicle." },
      { question: "Which models are relevant to road-trip research?", answer: "DQ-005 and DQ-010 are relevant starting points because their published use scenarios include travel. This does not create a universal vehicle-power claim." },
      { question: "What should a buyer confirm before ordering a car coffee machine?", answer: "Confirm charging requirements, coffee formats, cup arrangement, package contents, cleaning instructions and any intended vehicle accessory in writing." },
    ],
  },
];

export function getScenarioPage(slug: string) {
  return scenarioPages.find((page) => page.slug === slug);
}
