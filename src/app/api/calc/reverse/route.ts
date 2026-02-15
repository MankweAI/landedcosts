import { NextResponse } from "next/server";
import { z } from "zod";
import { calculateMaxFob } from "@/lib/calc/engine";
import { calcSchema } from "../route";

const reverseSchema = z.object({
    targetSellingPriceZar: z.number().positive(),
    targetMarginPercent: z.number().min(0).max(100),
    baseInput: calcSchema
});

export async function POST(request: Request) {
    const body = await request.json();
    const parsed = reverseSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json({
            error: "Invalid payload",
            details: parsed.error.flatten()
        }, { status: 400 });
    }

    const { targetSellingPriceZar, targetMarginPercent, baseInput } = parsed.data;

    // calculateMaxFob returns the Max FOB (ZAR) to achieve the target margin
    const maxFobZar = calculateMaxFob(targetSellingPriceZar, targetMarginPercent, baseInput);

    return NextResponse.json({ maxFobZar }, { status: 200 });
}
