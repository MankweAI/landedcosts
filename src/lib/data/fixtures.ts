import type {
  ClusterHsMap,
  Country,
  DocRequirement,
  HsCode,
  ProductCluster,
  RiskRule,
  TariffRate,
  TariffVersion
} from "@/lib/data/types";

export const countries: Country[] = [
  { id: "c-cn", slug: "china", name: "China" },
  { id: "c-za", slug: "south-africa", name: "South Africa" },
  { id: "c-in", slug: "india", name: "India" }
];

export const productClusters: ProductCluster[] = [
  {
    id: "pc-solar-panels",
    slug: "solar-panels",
    name: "Solar Panels",
    category: "energy"
  },
  {
    id: "pc-pv-modules",
    slug: "photovoltaic-modules",
    name: "Photovoltaic Modules",
    category: "energy",
    canonicalClusterId: "pc-solar-panels"
  },
  {
    id: "pc-lithium-batteries",
    slug: "lithium-batteries",
    name: "Lithium Batteries",
    category: "energy-storage",
    isHero: true,
    isActive: true,
    context: {
      intro: "Lithium-ion batteries (UN 3480/3481) are critical components for backup power and solar systems but are classified as Class 9 Dangerous Goods. Importing them requires strict adherence to IATA and IMDG packing instructions.",
      shippingTips: [
        "Ensure MSDS is under 2 years old.",
        "Verify UN38.3 test summary is available.",
        "Check if battery is packed with equipment (UN3481) or standalone (UN3480)."
      ]
    },
    faqs: [
      {
        question: "What is the import duty on Lithium Batteries?",
        answer: "As of 2026, Lithium-ion accumulators (HS 8507.60) generally attract a 15% duty rate in South Africa, plus 15% VAT."
      },
      {
        question: "Do I need an NRCS Letter of Authority (LOA)?",
        answer: "Yes, lithium batteries often fall under compulsory specifications for safety and require an NRCS LOA before customs release."
      },
      {
        question: "Can I air freight lithium batteries?",
        answer: "Yes, but strictly regulated. They must be declared as Dangerous Goods (Cargo Aircraft Only for bulk) and packed by certified personnel."
      }
    ]
  },
  {
    id: "pc-led-lighting",
    slug: "led-lighting",
    name: "LED Lighting",
    category: "electrical"
  },
  {
    id: "pc-electric-motors",
    slug: "electric-motors",
    name: "Electric Motors",
    category: "electrical"
  }
];

export const hsCodes: HsCode[] = [
  {
    hs6: "854140",
    descriptionShort: "Photosensitive semiconductor devices including photovoltaic cells",
    chapter: "85",
    heading: "8541"
  },
  {
    hs6: "850760",
    descriptionShort: "Lithium-ion accumulators",
    chapter: "85",
    heading: "8507"
  },
  {
    hs6: "940540",
    descriptionShort: "Other electric lamps and lighting fittings",
    chapter: "94",
    heading: "9405"
  },
  {
    hs6: "850152",
    descriptionShort: "AC motors, multi-phase, output >750W and <=75kW",
    chapter: "85",
    heading: "8501"
  }
];

export const clusterHsMaps: ClusterHsMap[] = [
  { clusterId: "pc-solar-panels", hs6: "854140", confidence: 0.92 },
  { clusterId: "pc-pv-modules", hs6: "854140", confidence: 0.9, notes: "Alias cluster" },
  { clusterId: "pc-lithium-batteries", hs6: "850760", confidence: 0.9 },
  { clusterId: "pc-led-lighting", hs6: "940540", confidence: 0.88 },
  { clusterId: "pc-electric-motors", hs6: "850152", confidence: 0.87 }
];

export const tariffVersion: TariffVersion = {
  id: "tv-2026-02",
  label: "SARS-TARIFF-2026.02",
  effectiveDate: "2026-02-01",
  sourcePointerShort: "SARS customs schedule + VAT guide"
};

export const tariffRates: TariffRate[] = [
  {
    tariffVersionId: tariffVersion.id,
    hs6: "854140",
    originSlug: "china",
    destSlug: "south-africa",
    dutyRate: 0.1,
    vatRate: 0.15
  },
  {
    tariffVersionId: tariffVersion.id,
    hs6: "850760",
    originSlug: "china",
    destSlug: "south-africa",
    dutyRate: 0.15,
    vatRate: 0.15,
    levies: { environmental: 0.01 }
  },
  {
    tariffVersionId: tariffVersion.id,
    hs6: "940540",
    originSlug: "china",
    destSlug: "south-africa",
    dutyRate: 0.2,
    vatRate: 0.15
  },
  {
    tariffVersionId: tariffVersion.id,
    hs6: "850152",
    originSlug: "china",
    destSlug: "south-africa",
    dutyRate: 0.1,
    vatRate: 0.15
  },
  {
    tariffVersionId: tariffVersion.id,
    hs6: "854140",
    originSlug: "india",
    destSlug: "south-africa",
    dutyRate: 0.1,
    vatRate: 0.15
  }
];

export const docsRequirements: DocRequirement[] = [
  {
    id: "doc-commercial-invoice",
    originSlug: "china",
    destSlug: "south-africa",
    group: "Always required",
    title: "Commercial Invoice",
    whyShort: "Customs uses this as a primary valuation document."
  },
  {
    id: "doc-packing-list",
    originSlug: "china",
    destSlug: "south-africa",
    group: "Always required",
    title: "Packing List",
    whyShort: "Supports quantity and package-level checks."
  },
  {
    id: "doc-bill-of-lading",
    originSlug: "china",
    destSlug: "south-africa",
    group: "Commonly required",
    title: "Bill of Lading / Air Waybill",
    whyShort: "Evidence of shipment and route details."
  },
  {
    id: "doc-nrcs",
    clusterId: "pc-led-lighting",
    originSlug: "china",
    destSlug: "south-africa",
    group: "If applicable",
    title: "NRCS Letter of Authority",
    whyShort: "Certain electrical products need pre-market approval."
  },
  {
    id: "doc-battery-msds",
    hs6: "850760",
    originSlug: "china",
    destSlug: "south-africa",
    group: "If applicable",
    title: "Battery Safety Documentation",
    whyShort: "Dangerous goods handling often requires evidence."
  }
];

export const riskRules: RiskRule[] = [
  {
    id: "risk-hs-ambiguity-solar",
    clusterId: "pc-solar-panels",
    originSlug: "china",
    destSlug: "south-africa",
    riskLevel: "medium",
    textShort: "Confirm module type and mounting configuration to avoid HS misclassification."
  },
  {
    id: "risk-battery-dangerous-goods",
    hs6: "850760",
    originSlug: "china",
    destSlug: "south-africa",
    riskLevel: "high",
    textShort: "Lithium battery transport surcharges and handling constraints can shift final landed cost."
  },
  {
    id: "risk-led-compliance",
    clusterId: "pc-led-lighting",
    originSlug: "china",
    destSlug: "south-africa",
    riskLevel: "medium",
    textShort: "NRCS/SABS compliance checks can delay clearance."
  },
  {
    id: "risk-generic-clearance",
    originSlug: "china",
    destSlug: "south-africa",
    riskLevel: "low",
    textShort: "Missing invoice detail can trigger customs valuation queries."
  }
];

export const defaultOrigins = ["china", "india"] as const;
export const destinations = ["south-africa"] as const;

// Legacy support (to be fully replaced by destinations iteration)
export const destinationSlug = "south-africa";
