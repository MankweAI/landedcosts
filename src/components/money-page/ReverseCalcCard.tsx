"use client";

import { useState, useEffect } from "react";
import { Calculator, ArrowRight } from "lucide-react";
import type { CalcFormState } from "@/components/money-page/CalcCard";
import { formatCurrencyZar } from "@/lib/format";

type ReverseCalcCardProps = {
    form: CalcFormState;
    onApplyFob: (fobZar: number) => void;
};

export function ReverseCalcCard({ form, onApplyFob }: ReverseCalcCardProps) {
    const [targetPrice, setTargetPrice] = useState(form.sellingPricePerUnitZar);
    const [targetMargin, setTargetMargin] = useState(30);
    const [maxFobZar, setMaxFobZar] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Debounce the API call
        const timer = setTimeout(async () => {
            if (targetPrice <= 0 || targetMargin < 0) return;

            setLoading(true);
            try {
                const response = await fetch("/api/calc/reverse", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        targetSellingPriceZar: targetPrice,
                        targetMarginPercent: targetMargin,
                        baseInput: form // We pass the whole form, API validates/extracts what it needs
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    setMaxFobZar(data.maxFobZar);
                }
            } catch (error) {
                console.error("Reverse calc failed", error);
            } finally {
                setLoading(false);
            }
        }, 600);

        return () => clearTimeout(timer);
    }, [targetPrice, targetMargin, form.fxRate, form.freightZar, form.portOfEntry, form.shippingMode, form.hs6]);
    // Dependency tracking: recalculate if costs or target changes.
    // Note: 'form' is a big object, might cause render loops if not stable.
    // But strictly, we only care about cost inputs. 
    // To avoid deep diff, we can just rely on the debounce.

    const maxFobUsd = maxFobZar ? maxFobZar / form.fxRate : 0;

    return (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-5 shadow-sm">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-indigo-500">Reverse Calculator</p>
                    <h3 className="mt-1 text-lg font-bold text-slate-900">Target a Profit Margin</h3>
                    <p className="text-xs text-slate-500">Find your maximum purchase price.</p>
                </div>
                <Calculator size={20} className="text-indigo-400" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="block text-xs font-medium text-slate-600">Target Selling Price</label>
                    <div className="mt-1 flex items-center rounded-lg bg-white px-3 py-2 shadow-sm ring-1 ring-slate-200 focus-within:ring-indigo-500">
                        <span className="text-slate-400">R</span>
                        <input
                            type="number"
                            value={targetPrice}
                            onChange={(e) => setTargetPrice(Number(e.target.value))}
                            className="w-full border-none bg-transparent p-0 text-slate-900 focus:ring-0"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-slate-600">Desired Margin %</label>
                    <div className="mt-1 flex items-center rounded-lg bg-white px-3 py-2 shadow-sm ring-1 ring-slate-200 focus-within:ring-indigo-500">
                        <input
                            type="number"
                            value={targetMargin}
                            onChange={(e) => setTargetMargin(Number(e.target.value))}
                            className="w-full border-none bg-transparent p-0 text-slate-900 focus:ring-0"
                        />
                        <span className="text-slate-400">%</span>
                    </div>
                </div>
            </div>

            <div className="mt-4 rounded-lg bg-white p-4 shadow-sm ring-1 ring-indigo-100">
                <div className="flex items-center justify-between">
                    <div>
                        <span className="block text-xs text-slate-500">Max FOB Price (ZAR)</span>
                        <span className="block text-xl font-bold text-slate-900">
                            {loading ? "..." : maxFobZar ? formatCurrencyZar(maxFobZar) : "-"}
                        </span>
                        <span className="text-xs text-slate-400">
                            {loading ? "..." : maxFobUsd ? `$${maxFobUsd.toFixed(2)} USD` : "-"}
                        </span>
                    </div>

                    {maxFobZar ? (
                        <button
                            onClick={() => onApplyFob(maxFobZar)}
                            className="flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors"
                        >
                            Apply <ArrowRight size={14} />
                        </button>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
