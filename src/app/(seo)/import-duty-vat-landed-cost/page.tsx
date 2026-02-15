import Link from "next/link";
import { getBuiltPages } from "@/lib/seo/pageRegistry";

export const dynamic = "force-static";

export default function ImportDutyDirectoryPage() {
  const pages = getBuiltPages()
    .filter((page) => page.type === "product")
    .slice(0, 50);

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-bold text-slate-900">Import Duty & Landed Cost Directory</h1>
      <p className="mt-2 text-slate-700">Money pages with deterministic index gates and server-computed presets.</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {pages.map((page) => (
          <Link key={page.slug} href={page.slug} className="rounded-lg border border-slate-200 p-3 hover:bg-blue-50">
            <p className="text-sm font-semibold text-blue-800">{page.slug}</p>
            <p className="text-xs text-slate-600">
              {page.indexStatus} | readiness {page.readinessScore}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}

