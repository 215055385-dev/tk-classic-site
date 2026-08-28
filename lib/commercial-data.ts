export type PackingSpecification = {
  productSize: string;
  packagingSize: string;
  productWeight: string;
  unitsPerCarton: string;
  masterCartonSize: string;
  masterCartonGrossWeight: string;
};

export const packingSpecifications: Record<string, PackingSpecification | null> = {
  "DQ-001": {
    productSize: "L75 × W75 × H270 mm",
    packagingSize: "L82 × W80.5 × H319 mm",
    productWeight: "949 g / 1 kg",
    unitsPerCarton: "16 pcs",
    masterCartonSize: "L342 × W342 × H315 mm",
    masterCartonGrossWeight: "15.8 kg",
  },
  "DQ-002": {
    productSize: "L77 × W77 × H250.4 mm",
    packagingSize: "L86 × W86 × H300.4 mm",
    productWeight: "763 g / 1 kg",
    unitsPerCarton: "16 pcs",
    masterCartonSize: "L440 × W355 × H318 mm",
    masterCartonGrossWeight: "TBC",
  },
  "DQ-005": {
    productSize: "L75 × W75 × H270 mm",
    packagingSize: "L82 × W80.5 × H319 mm",
    productWeight: "949 g / 1 kg",
    unitsPerCarton: "16 pcs",
    masterCartonSize: "L342 × W342 × H315 mm",
    masterCartonGrossWeight: "15.8 kg",
  },
  "DQ-008": null,
  "DQ-010": {
    productSize: "L85 × W85 × H280 mm",
    packagingSize: "L90 × W90 × H335 mm",
    productWeight: "1046 g / 1 kg",
    unitsPerCarton: "16 pcs",
    masterCartonSize: "L360 × W365 × H360 mm",
    masterCartonGrossWeight: "17.8 kg",
  },
  "DQ-011": {
    productSize: "L80 × W80 × H250 mm",
    packagingSize: "L90 × W90 × H280 mm",
    productWeight: "869 g / 1 kg",
    unitsPerCarton: "16 pcs",
    masterCartonSize: "L375 × W380 × H310 mm",
    masterCartonGrossWeight: "14 kg",
  },
};

export function packingProperties(model: string) {
  const specification = packingSpecifications[model];
  if (!specification) return [];

  return [
    ["Product dimensions", specification.productSize],
    ["Individual packaging dimensions", specification.packagingSize],
    ["Product weight (supplier-provided)", specification.productWeight],
    ["Units per master carton", specification.unitsPerCarton],
    ["Master carton dimensions", specification.masterCartonSize],
    ["Master carton gross weight", specification.masterCartonGrossWeight],
  ].map(([name, value]) => ({ "@type": "PropertyValue", name, value }));
}
