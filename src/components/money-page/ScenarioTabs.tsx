import type { ScenarioPreset } from "@/lib/calc/types";
import { formatCurrencyZar } from "@/lib/format";

type ScenarioTabsProps = {
  presets: ScenarioPreset[];
  onApply: (preset: ScenarioPreset) => void;
};

export function ScenarioTabs({ presets, onApply }: ScenarioTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {presets.map((preset) => (
        <button
          type="button"
          key={preset.id}
          onClick={() => onApply(preset)}
          className="rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm transition-all hover:bg-blue-50 hover:shadow hover:border-blue-300 active:translate-y-0.5"
        >
          {preset.id} ({formatCurrencyZar(preset.invoiceValueZar)})
        </button>
      ))}
    </div>
  );
}

