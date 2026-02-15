import type { ScenarioPreset } from "@/lib/calc/types";
import { formatCurrencyZar } from "@/lib/format";

export function ScenarioPresetCard({ presets }: { presets: ScenarioPreset[] }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Preset Snapshot</h2>
      <ul className="mt-2 space-y-1 text-sm text-slate-700">
        {presets.map((preset) => (
          <li key={preset.id} className="flex justify-between">
            <span>{preset.id}</span>
            <span>{formatCurrencyZar(preset.output.landedCostPerUnitZar)} / unit</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

