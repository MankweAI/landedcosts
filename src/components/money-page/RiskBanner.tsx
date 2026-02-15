import type { RiskRule } from "@/lib/data/types";

export function RiskBanner({ risks }: { risks: RiskRule[] }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900">Risk Callouts</h2>
      <ul className="mt-4 space-y-2">
        {risks.map((risk) => (
          <li key={risk.id} className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <strong className="block font-semibold capitalize text-amber-800 mb-1">{risk.riskLevel} Risk</strong>
              {risk.textShort}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

