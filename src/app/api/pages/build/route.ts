import { NextResponse } from "next/server";
import { getBuiltPages } from "@/lib/seo/pageRegistry";

export async function POST() {
  const pages = getBuiltPages(true);
  const summary = {
    total: pages.length,
    indexed: pages.filter((page) => page.indexStatus === "INDEX").length,
    noindex: pages.filter((page) => page.indexStatus === "NOINDEX").length
  };
  return NextResponse.json({ summary, pages }, { status: 200 });
}

