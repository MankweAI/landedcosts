"use client";

import { useState, useEffect } from "react";
import { Loader2, TrendingUp, AlertTriangle, ArrowRight } from "lucide-react";
import { formatCurrencyZar } from "@/lib/format";
import type { CalcFormState } from "@/components/money-page/SteppedCalc";
import type { CalcOutput } from "@/lib/calc/types";

type SensitivityGridProps = {
    form: CalcFormState;
    baseOutput: CalcOutput;
};

type ScenarioResult = {
    label: string;
    fxRateChange: number; // e.g. 0.10 for +10%
    freightChange: number; // e.g. 0.20 for +20%
    landedCostTotal: number;
    unitCost: number;
    loading: boolean;
};

export function SensitivityGrid({ form, baseOutput }: SensitivityGridProps) {
    const [scenarios, setScenarios] = useState<ScenarioResult[]>([
        { label: "Base Case", fxRateChange: 0, freightChange: 0, landedCostTotal: 0, unitCost: 0, loading: false },
        { label: "Weak Rand (FX +10%)", fxRateChange: 0.10, freightChange: 0, landedCostTotal: 0, unitCost: 0, loading: true },
        { label: "High Logistics (Freight +20%)", fxRateChange: 0, freightChange: 0.20, landedCostTotal: 0, unitCost: 0, loading: true },
        { label: "Worst Case (Both)", fxRateChange: 0.10, freightChange: 0.20, landedCostTotal: 0, unitCost: 0, loading: true },
    ]);

    useEffect(() => {
        // We only need to simulate the others. Base case is passed in.
        // Update Base Case immediately from props
        setScenarios(prev => {
            const next = [...prev];
            next[0].landedCostTotal = baseOutput.landedCostTotalZar + (form.inlandTransportZar || 0);
            next[0].unitCost = next[0].landedCostTotal / (form.quantity || 1);
            next[0].loading = false;
            return next;
        });

        // Debounce simulation
        const timer = setTimeout(() => {
            simulateScenarios();
        }, 800);

        return () => clearTimeout(timer);
    }, [form, baseOutput]);

    async function simulateScenarios() {
        // We need to run 3 calculations.
        // 1. Weak Rand
        // 2. High Freight
        // 3. Worst Case

        const baseFx = form.fxRate;
        const baseFreight = form.freightZar;
        const baseIns = form.insuranceZar;
        // Assuming Invoice Value also scales with FX if we assume it's a USD source
        const baseInvoice = form.invoiceValueZar;

        const runs = [1, 2, 3]; // indices of the scenarios to run

        const promises = runs.map(async (index) => {
            const scenario = scenarios[index];
            const fxMult = 1 + scenario.fxRateChange; // 1.10
            const freightMult = 1 + scenario.freightChange; // 1.20

            // Simulate Input Changes
            // If FX moves, ZAR Invoice Value moves (assuming sticky USD price)
            const simForm = {
                ...form,
                fxRate: baseFx * fxMult, // Not usually used by backend calc except for informative? backend likely uses fixed rate or provided rate?
                // Actually, if we send ZAR values, we must scale the ZAR values to simulate "Same USD, different FX"
                invoiceValueZar: baseInvoice * fxMult,
                freightZar: baseFreight * fxMult * freightMult, // Freight scales with both FX and specific freight hike
                insuranceZar: baseIns * fxMult, // Ins scales with value/FX
            };

            try {
                const res = await fetch("/api/calc", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(simForm)
                });
                const data = await res.json();
                if (data.output) {
                    const inland = form.inlandTransportZar || 0; // Inland is usually local ZAR, so maybe separate?
                    // Let's assume Inland also inflates with "Inflation"? No, let's keep it fixed for this specific sensitivity.
                    const total = data.output.landedCostTotalZar + inland;
                    return {
                        ...scenario,
                        landedCostTotal: total,
                        unitCost: total / (form.quantity || 1),
                        loading: false
                    };
                }
            } catch (e) {
                console.error(e);
            }
            return { ...scenario, loading: false };
        });

        const results = await Promise.all(promises);

        setScenarios(prev => {
            const next = [...prev];
            results.forEach((res, i) => {
                if (res) next[runs[i]] = res;
            });
            return next;
        });
    }

    const baseCost = scenarios[0].unitCost;

    // Smart Analysis Logic
    const dutyPercent = baseOutput.landedCostTotalZar > 0 ? (baseOutput.dutyAmountZar / baseOutput.landedCostTotalZar) * 100 : 0;
    const freightPercent = baseOutput.landedCostTotalZar > 0 ? (form.freightZar / baseOutput.landedCostTotalZar) * 100 : 0;

    let insight = {
        title: "Balanced Risk Profile",
        text: "Your costs are evenly split between logistics and duties. Monitor both FX and shipping rates.",
        variant: "bg-blue-50 border-blue-200 text-blue-900"
    };

    if (dutyPercent > 30) {
        insight = {
            title: "High Duty Exposure",
            text: `Duties make up ${dutyPercent.toFixed(0)}% of your cost. Because duty is calculated on the FX-converted value, a weakening Rand will disproportionately hurt your margins.`,
            variant: "bg-amber-50 border-amber-200 text-amber-900"
        };
    } else if (freightPercent > 25) {
        insight = {
            title: "High Logistics Exposure",
            text: `Freight accounts for ${freightPercent.toFixed(0)}% of your landed cost. You are highly sensitive to shipping line rate hikes. Consider locking in forward freight agreements.`,
            variant: "bg-orange-50 border-orange-200 text-orange-900"
        };
    } else if (dutyPercent < 5 && freightPercent < 10) {
        insight = {
            title: "Low Sensitivity",
            text: "Your product value (FOB) is the main cost driver. Logistics and duties have minimal impact, so focus purely on getting the best supplier price.",
            variant: "bg-emerald-50 border-emerald-200 text-emerald-900"
        };
    }

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-bold text-slate-900">Volatility Analysis</h2>
                    <TrendingUp className="text-slate-400" size={20} />
                </div>

                <div className={`rounded-lg border p-3 text-sm ${insight.variant}`}>
                    <strong className="block font-semibold mb-1">{insight.title}</strong>
                    {insight.text}
                </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {scenarios.map((scenario, i) => {
                    const isBase = i === 0;
                    const diff = scenario.unitCost - baseCost;
                    const diffPercent = baseCost > 0 ? (diff / baseCost) * 100 : 0;

                    return (
                        <div
                            key={scenario.label}
                            className={`relative flex flex-col justify-between rounded-lg border p-3 transition-all ${isBase
                                ? "border-blue-200 bg-blue-50/50"
                                : "border-slate-100 bg-white hover:border-slate-300"
                                }`}
                        >
                            <div>
                                <span className={`text-xs font-semibold ${isBase ? "text-blue-700" : "text-slate-500"}`}>
                                    {scenario.label}
                                </span>
                                <div className="mt-2 text-xl font-bold text-slate-900">
                                    {scenario.loading ? (
                                        <Loader2 className="animate-spin text-slate-300" size={20} />
                                    ) : (
                                        formatCurrencyZar(scenario.unitCost)
                                    )}
                                </div>
                                <div className="text-xs text-slate-400">per unit</div>
                            </div>

                            {!isBase && !scenario.loading && (
                                <div className="mt-3 flex items-center gap-1 text-xs font-medium text-rose-600">
                                    <ArrowRight size={12} />
                                    +{diffPercent.toFixed(1)}% Impact
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </section>
    );
}
