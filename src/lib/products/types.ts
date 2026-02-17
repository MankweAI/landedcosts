import type { CalcInput, CalcOutput, BreakdownLine } from "@/lib/calc/types";

export type ProductFieldType = "number" | "select" | "boolean";

export interface FieldOption {
    label: string;
    value: string;
}

export interface FieldDefinition {
    id: string; // e.g. "voltage"
    label: string; // e.g. "Nominal Voltage"
    type: ProductFieldType;
    options?: FieldOption[];
    defaultValue?: any;
    suffix?: string; // e.g. "V"
    group?: string; // e.g. "Electrical Specs"
    required?: boolean;
}

export interface MetricDefinition {
    id: string; // e.g. "cost_per_kwh"
    label: string; // e.g. "Effective Cost / kWh"
    format: "currency" | "percent" | "number";
    calculate: (output: CalcOutput, inputs: Record<string, any>) => number;
}

export interface ProductDefinition {
    id: string;
    name: string; // Display name for the module
    description?: string;

    /**
     * Returns true if this module should handle the given HS code.
     */
    matches: (hs6: string) => boolean;

    /**
     * Custom UI fields to be rendered in the calculator.
     */
    fields: FieldDefinition[];

    /**
     * Custom metrics to be displayed in the business dashboard.
     */
    metrics: MetricDefinition[];

    /**
     * Hook to transform custom inputs into standard CalcInput.
     * Useful for adjusting generic fields based on specific ones.
     */
    enrichInputs?: (base: CalcInput, custom: Record<string, any>) => CalcInput;

    /**
     * Hook to add extra line items to the cost breakdown.
     * e.g. "Hazmat Surcharge"
     */
    calculateExtras?: (inputs: Record<string, any>) => BreakdownLine[];
}
