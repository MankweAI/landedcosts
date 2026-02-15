import type { CalcOutput } from "@/lib/calc/types";

function sensitivityText(output: CalcOutput) {
  if (output.grossMarginPercent < 10) {
    return "A 5% freight increase likely turns this scenario unprofitable.";
  }
  if (output.grossMarginPercent < 20) {
    return "Margin is moderate; monitor freight and classification changes.";
  }
  return "Scenario has buffer, but still track FX and tariff updates.";
}

export function SensitivityCard({ output }: { output: CalcOutput }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Sensitivity</h2>
      <p className="mt-2 text-sm text-slate-700">{sensitivityText(output)}</p>
      <p className="mt-2 text-xs text-slate-500">Gross margin estimate: {output.grossMarginPercent}%</p>
    </section>
  );
}

