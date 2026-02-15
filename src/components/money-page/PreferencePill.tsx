type PreferencePillProps = {
  status: "eligible" | "not-eligible" | "unknown";
};

const labels: Record<PreferencePillProps["status"], string> = {
  eligible: "Preference: likely eligible",
  "not-eligible": "Preference: not eligible",
  unknown: "Preference: unknown (manual check required)"
};

const classes: Record<PreferencePillProps["status"], string> = {
  eligible: "bg-emerald-100 text-emerald-800",
  "not-eligible": "bg-rose-100 text-rose-800",
  unknown: "bg-slate-100 text-slate-700"
};

export function PreferencePill({ status }: PreferencePillProps) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${classes[status]}`}>{labels[status]}</span>;
}

