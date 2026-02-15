import type { CalcOutput } from "@/lib/calc/types";
import { ConfidenceBadge } from "@/components/money-page/ConfidenceBadge";
import { formatCurrencyZar } from "@/lib/format";

export function VerdictCard({ output }: { output: CalcOutput }) {
  return (
    <section className="rounded-xl border border-blue-100 bg-gradient-to-br from-white to-blue-50/50 p-5 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Final Verdict</h2>
      <div className="mt-2 flex items-start justify-between gap-4">
        <p className="text-lg font-bold leading-tight text-slate-900">{output.verdict}</p>
        <div className="shrink-0">
          <ConfidenceBadge label={output.confidenceLabel} />
        </div>
      </div>

      <div className="mt-6 space-y-3 border-t border-blue-100 pt-4">
        <div className="flex items-baseline justify-between">
          <dt className="text-sm text-slate-600">Landed / unit</dt>
          <dd className="text-2xl font-bold text-slate-900">{formatCurrencyZar(output.landedCostPerUnitZar)}</dd>
        </div>
        <div className="flex items-baseline justify-between">
          <dt className="text-sm text-slate-600">Total taxes</dt>
          <dd className="text-lg font-semibold text-slate-700">{formatCurrencyZar(output.totalTaxesZar)}</dd>
        </div>
      </div>
    </section>
  );
}

