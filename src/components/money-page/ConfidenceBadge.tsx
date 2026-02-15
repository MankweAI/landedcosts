import type { ConfidenceLabel } from "@/lib/calc/types";

const styleByLabel: Record<ConfidenceLabel, string> = {
  high: "bg-emerald-100 text-emerald-800",
  medium: "bg-amber-100 text-amber-800",
  low: "bg-rose-100 text-rose-800"
};

export function ConfidenceBadge({ label }: { label: ConfidenceLabel }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${styleByLabel[label]}`}>
      Confidence: {label}
    </span>
  );
}

