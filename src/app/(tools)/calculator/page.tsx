import Link from "next/link";

export default function CalculatorPage() {
  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold">Universal Calculator</h1>
      <p className="mt-2 text-slate-700">Use money pages for prefilled route-specific scenarios.</p>
      <Link href="/import-duty-vat-landed-cost" className="mt-3 inline-block text-blue-700 underline">
        Browse money pages
      </Link>
    </main>
  );
}

