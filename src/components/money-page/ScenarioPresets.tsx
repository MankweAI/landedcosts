import type { ScenarioPreset } from "@/lib/calc/types";
import { ScenarioTabs } from "@/components/money-page/ScenarioTabs";

type ScenarioPresetsProps = {
  presets: ScenarioPreset[];
  onApply: (preset: ScenarioPreset) => void;
};

export function ScenarioPresets({ presets, onApply }: ScenarioPresetsProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900">Scenario Presets</h2>
      <p className="mb-4 text-sm text-slate-600">3 server-computed scenarios. Click to apply instantly.</p>
      <ScenarioTabs presets={presets} onApply={onApply} />
    </section>
  );
}

