import Link from "next/link";
import { getHsCodes } from "@/lib/data/repository";

export const metadata = {
  title: "HS Codes List",
  robots: "noindex, follow"
};

export default function HsCodesPage() {
  const hsCodes = getHsCodes();
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold">HS Codes</h1>
      <ul className="mt-3 space-y-2">
        {hsCodes.map((code) => (
          <li key={code.hs6} className="rounded border border-slate-200 p-2">
            <p className="font-semibold">{code.hs6}</p>
            <p className="text-sm text-slate-700">{code.descriptionShort}</p>
            <Link href={`/import-duty-vat-landed-cost/hs/${code.hs6}`} className="text-sm text-blue-700 underline">
              Open HS hub
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

