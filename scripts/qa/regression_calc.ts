import { calculateLandedCost, createBaseInput } from "../../src/lib/calc/engine";

const base = createBaseInput();
const outputA = calculateLandedCost(base);
const outputB = calculateLandedCost(base);

if (!outputA || !outputB) {
  throw new Error("Expected deterministic output for base input.");
}

if (JSON.stringify(outputA) !== JSON.stringify(outputB)) {
  throw new Error("Calculation is non-deterministic for identical inputs.");
}

if (outputA.totalTaxesZar <= 0 || outputA.landedCostPerUnitZar <= 0) {
  throw new Error("Expected positive tax and landed-cost values.");
}

console.info("Calculation regression passed.");

