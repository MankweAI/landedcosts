import { NextResponse } from "next/server";
import { z } from "zod";
import { calculateLandedCost } from "@/lib/calc/engine";

const calcSchema = z.object({
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
  overrideCifFreightInsurance: z.boolean().optional()
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = calcSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  }
  const output = calculateLandedCost(parsed.data);
  if (!output) {
    return NextResponse.json({ output: null, error: "Missing tariff rate for route" }, { status: 200 });
  }
  return NextResponse.json({ output }, { status: 200 });
}

