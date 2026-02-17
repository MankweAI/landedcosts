import { NextResponse } from "next/server";
import { calcSchema } from "@/lib/calc/schema";
import { calculateLandedCost } from "@/lib/calc/engine";

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

