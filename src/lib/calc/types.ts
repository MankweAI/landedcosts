export type Incoterm = "FOB" | "CIF" | "DDP";
export type ConfidenceLabel = "high" | "medium" | "low";

export type CalcInput = {
  hs6: string;
  origin: string;
  dest: string;
  incoterm: Incoterm;
  invoiceValueZar: number;
  freightZar: number;
  insuranceZar: number;
  otherFeesZar: number;
  quantity: number;
  importerIsVatVendor: boolean;
  sellingPricePerUnitZar: number;
  fxRate: number;
  hsConfidence?: number;
  overrideCifFreightInsurance?: boolean;
};

export type WhyDrawer = {
  formula: string;
  valuesUsed: Record<string, number | string>;
  ratesApplied: Record<string, number>;
  tariffVersionLabel: string;
  effectiveDate: string;
  sourcePointerShort: string;
};

export type BreakdownLine = {
  id: "duty" | "vat" | "levies" | "fees";
  label: string;
  amountZar: number;
  why: WhyDrawer;
};

export type CalcOutput = {
  dutyAmountZar: number;
  vatAmountZar: number;
  levyAmountZar: number;
  totalTaxesZar: number;
  landedCostTotalZar: number;
  landedCostPerUnitZar: number;
  grossMarginPercent: number;
  verdict: string;
  confidenceLabel: ConfidenceLabel;
  warnings: string[];
  breakdown: BreakdownLine[];
  tariffVersionLabel: string;
  effectiveDate: string;
  sourcePointerShort: string;
};

export type ScenarioPreset = {
  id: "R10k" | "R50k" | "R250k";
  invoiceValueZar: number;
  output: CalcOutput;
};

