export type AccessoryItem = {
  slug: string;
  title: string;
  category: string;
  description: string;
  image: string;
  alt: string;
  note: string;
  highlights?: string[];
  modelSelectable?: boolean;
};

/**
 * Accessory photography supplied by TK Classic. Keep descriptions deliberately
 * factual until compatibility matrices and material specs are confirmed.
 */
export const accessories: AccessoryItem[] = [
  {
    slug: "dg-capsule-base",
    title: "DG capsule base",
    category: "Capsule adapters",
    description: "Capsule-format base for portable coffee brewing configurations.",
    image: "/accessories/dg-capsule-base.jpg",
    alt: "Black DG capsule base accessory",
    note: "Optional add-on · DG capsule format",
  },
  {
    slug: "nes-capsule-base",
    title: "Nespresso capsule base",
    category: "Capsule adapters",
    description: "Capsule-format base for Nespresso-style portable brewing configurations.",
    image: "/accessories/nes-capsule-base.jpg",
    alt: "Black Nespresso capsule base accessory",
    note: "Optional add-on · Nespresso capsule format",
  },
  {
    slug: "piercing-needle",
    title: "Piercing needle",
    category: "Brewing components",
    description: "Replacement piercing component for capsule-based extraction assemblies.",
    image: "/accessories/piercing-needle.jpg",
    alt: "Black piercing needle brewing component",
    note: "Optional replacement component",
  },
  {
    slug: "coffee-powder-adapter",
    title: "Coffee powder adapter",
    category: "Brewing components",
    description: "Powder-coffee component for a flexible portable brewing setup.",
    image: "/accessories/coffee-powder-adapter.jpg",
    alt: "Black coffee powder adapter",
    note: "Optional add-on · powder coffee format",
  },
  {
    slug: "american-drip-filter",
    title: "American drip filter",
    category: "Brewing components",
    description: "Drip-style filter component for larger-format coffee preparation.",
    image: "/accessories/american-drip-filter.png",
    alt: "American drip filter accessory",
    note: "Optional add-on · drip coffee format",
  },
  {
    slug: "brew-cup",
    title: "Brew cup",
    category: "Serving accessories",
    description: "Integrated brew cup for a complete portable coffee ritual.",
    image: "/accessories/brew-cup.png",
    alt: "White portable coffee brew cup",
    note: "Optional serving component",
  },
  {
    slug: "acrylic-machine-stand",
    title: "Acrylic machine stand",
    category: "Display accessories",
    description: "Clear stand for elevating the machine and cup in a presentation setup.",
    image: "/accessories/acrylic-machine-stand.webp",
    alt: "Clear acrylic stand for a portable coffee machine",
    note: "Optional bundle display piece",
  },
  {
    slug: "cold-rolled-steel-coffee-stand",
    title: "Cold-rolled steel stand",
    category: "Machine stands",
    description: "Cold-rolled carbon steel stand for holding a portable coffee machine above the serving cup.",
    image: "/accessories/cold-rolled-steel-coffee-stand.webp",
    alt: "Black cold-rolled carbon steel stand for a portable coffee machine",
    note: "Optional coffee machine accessory",
    highlights: ["Stable support", "Space-saving profile", "Anti-slip feet", "Easy setup"],
    modelSelectable: false,
  },
];
