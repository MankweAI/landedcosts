export type Incoterm = "FOB" | "CIF" | "DDP";
export type ConfidenceLabel = "high" | "medium" | "low";

export type PortOfEntry = "DBN" | "CPT" | "JNB" | "PLZ";
export type ShippingMode = "LCL" | "FCL_20" | "FCL_40" | "AIR";

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

  // Moat / Advanced Inputs
  portOfEntry?: PortOfEntry;
  shippingMode?: ShippingMode;
  useAgencyEstimate?: boolean;
  risk_demurrageDays?: number;
  risk_forexBuffer?: number;
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
  id: "duty" | "vat" | "levies" | "fees" | "shipping" | "agency" | "risk";
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

