import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-3xl font-bold text-slate-900">LandedCost OS</h1>
      <p className="mt-2 text-slate-700">
        Decision-grade landed cost and import-readiness reports for China to South Africa.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href="/import-duty-vat-landed-cost" className="rounded bg-blue-600 px-4 py-2 text-white">
          Open money pages
        </Link>
        <Link href="/calculator" className="rounded border border-slate-300 px-4 py-2">
          Calculator
        </Link>
      </div>
    </main>
  );
}
