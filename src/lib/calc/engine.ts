import type {
  CalcInput,
  CalcOutput,
  ConfidenceLabel,
  ScenarioPreset,
  WhyDrawer,
  PortOfEntry,
  ShippingMode
} from "@/lib/calc/types";

import { getTariffRate, getTariffVersion } from "@/lib/data/repository";
import { getProductModule } from "@/lib/products/registry";

type Roundable = number;

function round(value: Roundable): number {
  return Math.round(value * 100) / 100;
}

function sumLevies(customsValue: number, levies?: Record<string, number>) {
  if (!levies) {
    return 0;
  }
  return Object.values(levies).reduce((acc, levyRate) => acc + customsValue * levyRate, 0);
}

// --- Moat Logic Helpers ---

const PORT_CHARGES_BASE: Record<ShippingMode, number> = {
  AIR: 850,
  LCL: 2500,
  FCL_20: 4500,
  FCL_40: 6500
};

const DEMURRAGE_RATES: Record<ShippingMode, number> = {
  AIR: 500, // min daily
  LCL: 950,
  FCL_20: 2200,
  FCL_40: 4100
};

function estimatePortCharges(mode: ShippingMode = "LCL", port: PortOfEntry = "DBN"): number {
  let charge = PORT_CHARGES_BASE[mode];
  // Durban Surcharge (Congestion/Differential)
  if (port === "DBN") {
    charge *= 1.1; // +10%
  }
  // Air cargo at JNB is standard, purely weight based usually, but we keep base.
  return round(charge);
}

function estimateAgencyFees(value: number): number {
  // Simple tiered logic: Base R2250 + 0.5% of value > R50k
  const base = 2250;
  const surcharge = value > 50000 ? (value - 50000) * 0.005 : 0;
  return round(base + surcharge);
}

function calculateDemurrage(days: number, mode: ShippingMode = "LCL"): number {
  const freeDays = 3;
  if (days <= freeDays) return 0;
  const rate = DEMURRAGE_RATES[mode];
  return (days - freeDays) * rate;
}

// --------------------------

function confidenceFromInputs(input: CalcInput, hasRate: boolean): ConfidenceLabel {
  if (!hasRate) {
    return "low";
  }
  const hsConfidence = input.hsConfidence ?? 0.8;
  const assumptions = Number(input.freightZar === 0) + Number(input.insuranceZar === 0);
  if (hsConfidence >= 0.9 && assumptions <= 1) {
    return "high";
  }
  if (hsConfidence >= 0.75) {
    return "medium";
  }
  return "low";
}

function verdictFromMargin(grossMarginPercent: number): string {
  if (grossMarginPercent >= 25) {
    return "Likely profitable with headroom";
  }
  if (grossMarginPercent >= 10) {
    return "Potentially viable, monitor cost and compliance risk";
  }
  return "Thin margin: likely not viable without renegotiation";
}

function buildWhyDrawer(params: {
  formula: string;
  valuesUsed: Record<string, number | string>;
  ratesApplied: Record<string, number>;
}): WhyDrawer {
  const version = getTariffVersion();
  return {
    formula: params.formula,
    valuesUsed: params.valuesUsed,
    ratesApplied: params.ratesApplied,
    tariffVersionLabel: version.label,
    effectiveDate: version.effectiveDate,
    sourcePointerShort: version.sourcePointerShort
  };
}

export function calculateLandedCost(input: CalcInput): CalcOutput | null {
  let rate = getTariffRate(input.hs6, input.origin, input.dest);
  const version = getTariffVersion();

  if (!rate) {
    if (input.customDutyRate !== undefined) {
      rate = {
        tariffVersionId: "custom-entry",
        hs6: input.hs6,
        originSlug: input.origin,
        destSlug: input.dest,
        dutyRate: input.customDutyRate,
        vatRate: 0.15 // Default VAT
      };
    } else {
      return null;
    }
  }

  // 0. Product Module Enrichment
  const productModule = getProductModule(input.hs6);
  let workingInput = { ...input };
  if (productModule?.enrichInputs && input.productSpecificData) {
    workingInput = productModule.enrichInputs(workingInput, input.productSpecificData);
  }

  // 1. Forex Risk Buffer
  const fxBuffer = workingInput.risk_forexBuffer || 0;
  const effectiveFx = workingInput.fxRate * (1 + fxBuffer / 100);
  // Note: input.*Zar fields are already in ZAR. 
  // If we had USD inputs we would use effectiveFx. 
  // Assumption: The calculator UI handles the conversion using this rate, 
  // OR the input is raw ZAR. 
  // *Critical Check*: The types say `invoiceValueZar`. 
  // If the user inputs USD, the conversion happens BEFORE this function or WE do it?
  // Use case: The input interface likely converts. 
  // BUT, to simulate risk, we need to inflate the ZAR value of the goods if they were derived.
  // SINCE `input` has `invoiceValueZar`, we assume it's already converted at `input.fxRate`.
  // To apply buffer, we must inflate it relative to the buffer.
  const riskMultiplier = 1 + fxBuffer / 100;

  // Apply RISK to the value basis (assuming it was FX derived)
  const customsValueBase = input.invoiceValueZar * riskMultiplier;

  const useInlineFreightAndInsurance = input.incoterm !== "CIF" || Boolean(input.overrideCifFreightInsurance);
  // Freight & Insurance also inflate if paid in FX. 
  // We'll assume for "Risk Mode" everything inflates.
  const freight = (useInlineFreightAndInsurance ? input.freightZar : 0) * riskMultiplier;
  const insurance = (useInlineFreightAndInsurance ? input.insuranceZar : 0) * riskMultiplier;

  const customsValue = customsValueBase + freight + insurance;
  const dutyAmount = customsValue * rate.dutyRate;
  const levyAmount = sumLevies(customsValue, rate.levies);

  // Moat: Agency & Port Charges
  const agencyFee = input.useAgencyEstimate
    ? estimateAgencyFees(customsValue)
    : 0; // If explicit input exists, it's in 'otherFeesZar' usually, but we want to break it out?
  // Current design: `otherFeesZar` is for user manual entry. 
  // `agencyFee` is calculated. We add it.

  const portCharges = estimatePortCharges(input.shippingMode, input.portOfEntry);

  // Moat: Demurrage Risk
  const demurrage = calculateDemurrage(input.risk_demurrageDays || 0, input.shippingMode);

  const vatBase = customsValue + dutyAmount + levyAmount + input.otherFeesZar + agencyFee + portCharges + demurrage;
  const vatAmount = vatBase * rate.vatRate;

  const totalTaxes = dutyAmount + vatAmount + levyAmount;

  // Moat: Product Specific Extras (e.g. Hazmat Surcharge)
  const productExtras = productModule?.calculateExtras
    ? productModule.calculateExtras(workingInput.productSpecificData || {})
    : [];

  const productExtrasTotal = productExtras.reduce((sum, item) => sum + item.amountZar, 0);

  const landedCostTotal = customsValue + workingInput.otherFeesZar + totalTaxes + agencyFee + portCharges + demurrage + productExtrasTotal;

  const landedCostPerUnit = landedCostTotal / Math.max(1, input.quantity);
  const revenue = input.sellingPricePerUnitZar * Math.max(1, input.quantity);
  const grossMarginPercent = revenue > 0 ? ((revenue - landedCostTotal) / revenue) * 100 : 0;
  const confidenceLabel = confidenceFromInputs(input, true);
  const warnings: string[] = [];

  if (input.incoterm === "CIF" && !input.overrideCifFreightInsurance) {
    warnings.push("CIF selected: freight and insurance fields ignored to prevent double counting.");
  }
  if (!input.importerIsVatVendor) {
    warnings.push("Non-vendor importer: VAT may be immediate cash outflow.");
  }
  if (fxBuffer > 0) {
    warnings.push(`Risk: Applied ${fxBuffer}% Forex volatility buffer.`);
  }
  if ((input.risk_demurrageDays || 0) > 3) {
    warnings.push(`Risk: Including ${(input.risk_demurrageDays || 0) - 3} days demurrage.`);
  }

  return {
    dutyAmountZar: round(dutyAmount),
    vatAmountZar: round(vatAmount),
    levyAmountZar: round(levyAmount),
    totalTaxesZar: round(totalTaxes),
    landedCostTotalZar: round(landedCostTotal),
    landedCostPerUnitZar: round(landedCostPerUnit),
    grossMarginPercent: round(grossMarginPercent),
    verdict: verdictFromMargin(grossMarginPercent),
    confidenceLabel,
    warnings,
    breakdown: [
      {
        id: "duty",
        label: "Import Duty",
        amountZar: round(dutyAmount),
        why: buildWhyDrawer({
          formula: "customsValue * dutyRate",
          valuesUsed: { customsValue: round(customsValue) },
          ratesApplied: { dutyRate: rate.dutyRate }
        })
      },
      {
        id: "levies",
        label: "Levies",
        amountZar: round(levyAmount),
        why: buildWhyDrawer({
          formula: "sum(customsValue * levyRate_i)",
          valuesUsed: { customsValue: round(customsValue) },
          ratesApplied: rate.levies ?? {}
        })
      },
      {
        id: "vat",
        label: "VAT",
        amountZar: round(vatAmount),
        why: buildWhyDrawer({
          formula: "(CV + Duty + Levies + Fees + Port + Agency) * vatRate",
          valuesUsed: {
            customsValue: round(customsValue),
            duty: round(dutyAmount),
            port: round(portCharges),
            agency: round(agencyFee),
            risk: round(demurrage)
          },
          ratesApplied: { vatRate: rate.vatRate }
        })
      },
      {
        id: "shipping",
        label: "Port & Terminal",
        amountZar: round(portCharges),
        why: buildWhyDrawer({
          formula: "Standard Port Charges + Surcharges",
          valuesUsed: { mode: input.shippingMode || "LCL", port: input.portOfEntry || "DBN" },
          ratesApplied: { base: PORT_CHARGES_BASE[input.shippingMode || "LCL"] }
        })
      },
      ...(agencyFee > 0 ? [{
        id: "agency" as const, // Cast to literal
        label: "Clearing Agency",
        amountZar: round(agencyFee),
        why: buildWhyDrawer({
          formula: "Base Fee + Disbursement %",
          valuesUsed: { value: round(customsValue) },
          ratesApplied: { base: 2250 }
        })
      }] : []),
      ...(demurrage > 0 ? [{
        id: "risk" as const,
        label: "Risk: Demurrage",
        amountZar: round(demurrage),
        why: buildWhyDrawer({
          formula: "(excessDays) * dailyRate",
          valuesUsed: { days: input.risk_demurrageDays || 0 },
          ratesApplied: { daily: DEMURRAGE_RATES[input.shippingMode || "LCL"] }
        })
      }] : []),
      {
        id: "fees",
        label: "Other Manual Fees",
        amountZar: round(workingInput.otherFeesZar),
        why: buildWhyDrawer({
          formula: "user input",
          valuesUsed: { otherFees: round(workingInput.otherFeesZar) },
          ratesApplied: {}
        })
      },
      ...productExtras
    ],
    tariffVersionLabel: version.label,
    effectiveDate: version.effectiveDate,
    sourcePointerShort: version.sourcePointerShort
  };
}

export function createBaseInput(overrides?: Partial<CalcInput>): CalcInput {
  return {
    hs6: "854140",
    origin: "china",
    dest: "south-africa",
    incoterm: "FOB",
    invoiceValueZar: 50_000,
    freightZar: 6_000,
    insuranceZar: 900,
    otherFeesZar: 0, // Default to 0 since we have specific fields now
    quantity: 100,
    importerIsVatVendor: true,
    sellingPricePerUnitZar: 900,
    fxRate: 18.2,
    hsConfidence: 0.9,
    portOfEntry: "DBN",
    shippingMode: "LCL",
    useAgencyEstimate: true,
    risk_demurrageDays: 0,
    risk_forexBuffer: 0,
    ...overrides
  };
}

export function computeScenarioPresets(baseInput: CalcInput): ScenarioPreset[] {
  const presetValues: Array<{ id: ScenarioPreset["id"]; invoiceValueZar: number }> = [
    { id: "R10k", invoiceValueZar: 10_000 },
    { id: "R50k", invoiceValueZar: 50_000 },
    { id: "R250k", invoiceValueZar: 250_000 }
  ];

  return presetValues
    .map((preset) => {
      const output = calculateLandedCost({
        ...baseInput,
        invoiceValueZar: preset.invoiceValueZar
      });
      if (!output) {
        return null;
      }
      return {
        id: preset.id,
        invoiceValueZar: preset.invoiceValueZar,
        output
      };
    })
    .filter((preset): preset is ScenarioPreset => Boolean(preset));
}

export function calculateMaxFob(
  targetSellingPriceZar: number,
  targetMarginPercent: number,
  baseInput: CalcInput
): number {
  let low = 0;
  let high = targetSellingPriceZar;
  let bestFobPerUnit = 0;
  const quantity = Math.max(1, baseInput.quantity);

  // Binary search for Max FOB Per Unit
  for (let i = 0; i < 20; i++) {
    const mid = (low + high) / 2;
    const output = calculateLandedCost({
      ...baseInput,
      invoiceValueZar: mid * quantity,
      sellingPricePerUnitZar: targetSellingPriceZar,
      // quantity is already in baseInput
    });

    if (!output) {
      continue;
    }

    if (output.grossMarginPercent >= targetMarginPercent) {
      bestFobPerUnit = mid;
      low = mid; // We can afford more FOB cost
    } else {
      high = mid; // FOB cost too high, need to reduce
    }
  }

  return round(bestFobPerUnit);
}
