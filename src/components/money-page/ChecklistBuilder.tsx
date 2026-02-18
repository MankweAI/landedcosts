"use client";

import type { Requirement } from "@/lib/compliance/types";
import { Check, Clock } from "lucide-react";
import { useState, useMemo } from "react";

type Props = {
    requirements: Requirement[];
};

export function ChecklistBuilder({ requirements }: Props) {
    const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

    const sortedReqs = useMemo(() => {
        return [...requirements].sort((a, b) => {
            if (a.required && !b.required) return -1;
            if (!a.required && b.required) return 1;
            return 0;
        });
    }, [requirements]);

    const completedCount = checkedIds.size;
    const totalCount = sortedReqs.length;

    function toggleItem(id: string) {
        setCheckedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    if (requirements.length === 0) return null;

    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {/* Card header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
                <h3 className="text-sm font-bold text-slate-900">Import Checklist</h3>
                <span className="text-xs text-slate-400">
                    {completedCount}/{totalCount}
                </span>
            </div>

            {/* To-do items */}
            <ul className="divide-y divide-slate-100">
                {sortedReqs.map((req) => {
                    const done = checkedIds.has(req.requirementId);
                    return (
                        <li key={req.requirementId}>
                            <button
                                type="button"
                                onClick={() => toggleItem(req.requirementId)}
                                className="flex w-full items-start gap-3 px-5 py-3 text-left hover:bg-slate-50 transition-colors"
                            >
                                {/* Tick box */}
                                <span
                                    className={`mt-0.5 flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded border transition-colors ${done
                                            ? "border-emerald-500 bg-emerald-500 text-white"
                                            : "border-slate-300 bg-white"
                                        }`}
                                >
                                    {done && <Check className="h-3 w-3" strokeWidth={3} />}
                                </span>

                                {/* Label */}
                                <div className="flex-1 min-w-0">
                                    <span
                                        className={`text-sm ${done ? "text-slate-400 line-through" : "text-slate-800"
                                            }`}
                                    >
                                        {req.name}
                                    </span>
                                    {req.conditional && (
                                        <span className="ml-2 text-[10px] font-medium text-amber-600">(if required)</span>
                                    )}
                                    {req.leadTimeDays && (
                                        <span className="ml-2 inline-flex items-center gap-0.5 text-[10px] text-slate-400">
                                            <Clock className="h-2.5 w-2.5" />
                                            {req.leadTimeDays}d
                                        </span>
                                    )}
                                </div>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
