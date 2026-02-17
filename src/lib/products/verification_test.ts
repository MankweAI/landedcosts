
import { calculateLandedCost, createBaseInput } from "@/lib/calc/engine";
import { lithiumBatteries } from "@/lib/products/definitions/lithium-batteries";
import { getProductModule } from "@/lib/products/registry";

console.log("Starting Verification for Modular Architecture (Lithium Batteries)...");

// 1. Verify Module Registration
const productModule = getProductModule("850760");
if (productModule?.id === "lithium-batteries") {
    console.log("✅ Module Resolution: Success (Found 'lithium-batteries' for 850760)");
} else {
    console.error("❌ Module Resolution: Failed (Expected 'lithium-batteries')");
}

// 2. Verify Logic Injection (Cost per kWh)
// Scenario: 10 units. 48V 100Ah.
// Total kWh = 10 * 48 * 100 / 1000 = 48 kWh.
// Landed Cost (Mock) = R50,000 (Goods) + Taxes etc. let's say R75,000 total.
// Expected Cost per kWh = R75,000 / 48 = ~R1562.50.

const input = createBaseInput({
    hs6: "850760",
    invoiceValueZar: 50000,
    quantity: 10,
    productSpecificData: {
        voltage: 48,
        amp_hours: 100,
        is_dangerous_goods: true
    }
});

// We need to mock the repository calls if we run this isolated, but we can rely on the engine's behavior
// for a "custom entry" fallback if no rate exists in the DB, OR we assume the engine uses mocked data for tests.
// For now, let's inject a custom duty rate to force calculation success even without DB.
input.customDutyRate = 0.10; // 10% duty

const output = calculateLandedCost(input);

if (output) {
    console.log("✅ Calculation: Success");

    const kwhMetric = lithiumBatteries.metrics.find(m => m.id === "cost_per_kwh");
    if (kwhMetric) {
        const costPerKwh = kwhMetric.calculate(output, input.productSpecificData || {});
        console.log(`ℹ️ Calculated Cost per kWh: R${costPerKwh.toFixed(2)}`);

        // Manual Math Check
        // output.landedCostPerUnitZar is the unit cost.
        // kwh per unit = 4.8.
        // costPerKwh should be unitCost / 4.8.
        const expected = output.landedCostPerUnitZar / 4.8;

        if (Math.abs(costPerKwh - expected) < 0.1) {
            console.log("✅ Metric Logic: Verified (Math matches)");
        } else {
            console.error(`❌ Metric Logic: Failed (Expected ${expected}, got ${costPerKwh})`);
        }

    } else {
        console.error("❌ Metric Definition: Failed (Could not find 'cost_per_kwh')");
    }

} else {
    console.error("❌ Calculation: Failed (Result was null)");
}

console.log("Verification Complete.");
