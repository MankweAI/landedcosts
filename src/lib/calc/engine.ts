import type { CalcInput, CalcOutput, ConfidenceLabel, ScenarioPreset, WhyDrawer } from "@/lib/calc/types";
import { getTariffRate, getTariffVersion } from "@/lib/data/repository";

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
  const rate = getTariffRate(input.hs6, input.origin, input.dest);
  const version = getTariffVersion();
  if (!rate) {
    return null;
  }

  const useInlineFreightAndInsurance = input.incoterm !== "CIF" || Boolean(input.overrideCifFreightInsurance);
  const freight = useInlineFreightAndInsurance ? input.freightZar : 0;
  const insurance = useInlineFreightAndInsurance ? input.insuranceZar : 0;
  const customsValue = input.invoiceValueZar + freight + insurance;
  const dutyAmount = customsValue * rate.dutyRate;
  const levyAmount = sumLevies(customsValue, rate.levies);
  const vatBase = customsValue + dutyAmount + levyAmount + input.otherFeesZar;
  const vatAmount = vatBase * rate.vatRate;
  const totalTaxes = dutyAmount + vatAmount + levyAmount;
  const landedCostTotal = customsValue + input.otherFeesZar + totalTaxes;
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
        id: "fees",
        label: "Other Fees",
        amountZar: round(input.otherFeesZar),
        why: buildWhyDrawer({
          formula: "declared fees",
          valuesUsed: { otherFees: round(input.otherFeesZar) },
          ratesApplied: {}
        })
      },
      {
        id: "vat",
        label: "VAT",
        amountZar: round(vatAmount),
        why: buildWhyDrawer({
          formula: "(customsValue + duty + levies + otherFees) * vatRate",
          valuesUsed: {
            customsValue: round(customsValue),
            duty: round(dutyAmount),
            levies: round(levyAmount),
            otherFees: round(input.otherFeesZar)
          },
          ratesApplied: { vatRate: rate.vatRate }
        })
      }
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
    otherFeesZar: 1_200,
    quantity: 100,
    importerIsVatVendor: true,
    sellingPricePerUnitZar: 900,
    fxRate: 18.2,
    hsConfidence: 0.9,
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

