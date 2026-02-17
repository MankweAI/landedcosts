import type { ProductDefinition } from "./types";
import { lithiumBatteries } from "./definitions/lithium-batteries";

export const productRegistry: ProductDefinition[] = [
    lithiumBatteries,
];

export function getProductModule(hs6: string): ProductDefinition | undefined {
    return productRegistry.find((m) => m.matches(hs6));
}
