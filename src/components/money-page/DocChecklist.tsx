import type { DocRequirement, DocRequirementGroup } from "@/lib/data/types";

const groupOrder: DocRequirementGroup[] = ["Always required", "Commonly required", "If applicable"];

export function DocChecklist({ docs }: { docs: DocRequirement[] }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900">Document Checklist</h2>
      <p className="mb-4 text-sm text-slate-600">Structured guidance with why-to-prepare context.</p>
      <div className="space-y-4">
        {groupOrder.map((group) => {
          const items = docs.filter((doc) => doc.group === group);
          if (items.length === 0) {
            return null;
          }
          return (
            <div key={group}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-700">{group}</h3>
              <ul className="mt-2 space-y-2">
                {items.map((doc) => (
                  <li key={doc.id} className="rounded-lg border border-slate-100 bg-slate-50 p-2.5 text-sm">
                    <p className="font-semibold text-slate-900">{doc.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{doc.whyShort}</p>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

