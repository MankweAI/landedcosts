import type { ProductDefinition } from "../types";

export const lithiumBatteries: ProductDefinition = {
    id: "lithium-batteries",
    name: "Lithium Ion Batteries",

    matches: (hs6) => hs6 === "850760",

    fields: [
        {
            id: "voltage",
            label: "System Voltage",
            type: "number",
            defaultValue: 12,
            suffix: "V",
            group: "Battery Specs",
            required: true
        },
        {
            id: "amp_hours",
            label: "Capacity",
            type: "number",
            defaultValue: 100,
            suffix: "Ah",
            group: "Battery Specs",
            required: true
        },
        {
            id: "is_dangerous_goods",
            label: "UN3480 (Class 9 Hazmat)",
            type: "boolean",
            defaultValue: true,
            group: "Compliance"
        }
    ],

    metrics: [
        {
            id: "cost_per_kwh",
            label: "Landed Cost / kWh",
            format: "currency",
            calculate: (output, inputs) => {
                const voltage = Number(inputs.voltage) || 0;
                const ah = Number(inputs.amp_hours) || 0;
                const kwhPerUnit = (voltage * ah) / 1000;

                if (kwhPerUnit <= 0) return 0;
                return output.landedCostPerUnitZar / kwhPerUnit;
            }
        }
    ],

    calculateExtras: (inputs) => {
        const extras: any[] = [];
        if (inputs.is_dangerous_goods) {
            // Simplified example: Flat fee per shipment for Hazmat docs? 
            // Or maybe just a flag for now. 
            // This is where we'd return specific line items if the engine supported custom line items injection strictly from here.
            // For now, let's just return nothing and handle logic in enrichment if needed or display.
        }
        return extras;
    }
};
