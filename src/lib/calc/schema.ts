import { z } from "zod";

export const calcSchema = z.object({
    hs6: z.string().length(6),
    origin: z.string().min(2),
    dest: z.string().min(2),
    incoterm: z.enum(["FOB", "CIF", "DDP"]),
    invoiceValueZar: z.number().nonnegative(),
    freightZar: z.number().nonnegative(),
    insuranceZar: z.number().nonnegative(),
    otherFeesZar: z.number().nonnegative(),
    quantity: z.number().positive(),
    importerIsVatVendor: z.boolean(),
    sellingPricePerUnitZar: z.number().nonnegative(),
    fxRate: z.number().positive(),
    hsConfidence: z.number().min(0).max(1).optional(),
    overrideCifFreightInsurance: z.boolean().optional(),
    // Moat Fields
    portOfEntry: z.enum(["DBN", "CPT", "JNB", "PLZ"]).optional(),
    shippingMode: z.enum(["LCL", "FCL_20", "FCL_40", "AIR"]).optional(),
    useAgencyEstimate: z.boolean().optional(),
    risk_demurrageDays: z.number().min(0).optional(),
    risk_forexBuffer: z.number().min(0).optional(),
    customDutyRate: z.number().min(0).max(1).optional()
});

export type CalcInput = z.infer<typeof calcSchema>;
