import type { CalcOutput } from "@/lib/calc/types";
import { formatCurrencyZar } from "@/lib/format";

export function BreakdownTable({ output }: { output: CalcOutput }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-slate-100 bg-slate-50/50 p-4">
        <h2 className="text-lg font-bold text-slate-900">Cost Breakdown</h2>
        <p className="text-sm text-slate-500"> detailed logic available in drawer.</p>
      </div>
      <div className="divide-y divide-slate-100">
        {output.breakdown.map((line) => (
          <details key={line.id} className="group open:bg-slate-50">
            <summary className="flex cursor-pointer items-center justify-between p-4 text-sm font-medium text-slate-900 hover:bg-slate-50 group-open:bg-slate-50">
              <span className="flex items-center gap-2">
                <span className="text-slate-400 transition-transform group-open:rotate-90">▶</span>
                {line.label}
              </span>
              <span className="font-mono text-slate-700">{formatCurrencyZar(line.amountZar)}</span>
            </summary>
            <div className="px-4 pb-4 pl-9 text-xs text-slate-600">
              <div className="rounded-lg bg-white p-3 shadow-sm ring-1 ring-slate-900/5 space-y-2">
                <p>
                  <strong className="font-semibold text-slate-900">Formula:</strong> <code className="rounded bg-slate-100 px-1 py-0.5">{line.why.formula}</code>
                </p>
                <p>
                  <strong className="font-semibold text-slate-900">Values used:</strong> {JSON.stringify(line.why.valuesUsed)}
                </p>
                <p>
                  <strong className="font-semibold text-slate-900">Rates applied:</strong> {JSON.stringify(line.why.ratesApplied)}
                </p>
                <div className="mt-2 flex gap-2 border-t border-slate-100 pt-2 text-slate-500">
                  <span>Version: {line.why.tariffVersionLabel}</span>
                  <span>•</span>
                  <span>Source: {line.why.sourcePointerShort}</span>
                </div>
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

