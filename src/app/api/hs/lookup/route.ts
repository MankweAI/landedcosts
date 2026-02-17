import { NextResponse } from "next/server";
import { getHsCodes } from "@/lib/data/repository";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const hs6 = searchParams.get("hs6");

    if (!hs6 || hs6.length !== 6) {
        return NextResponse.json({ error: "Invalid HS code" }, { status: 400 });
    }

    const hsCodes = getHsCodes();
    const found = hsCodes.find((item) => item.hs6 === hs6);

    if (!found) {
        return NextResponse.json({ description: null }, { status: 404 });
    }

    return NextResponse.json({ description: found.descriptionShort }, { status: 200 });
}
