"use client";

import { useState, useEffect } from "react";
import { formatCurrencyZar } from "@/lib/format";
import type { CalcFormState } from "@/components/money-page/SteppedCalc";
import { TrendingUp, TrendingDown, AlertCircle, Target } from "lucide-react";

type BusinessOutcomeCardProps = {
    landedCostPerUnit: number;
    quantity: number;
    initialSellingPrice: number;
    onPriceChange: (price: number) => void;
};

export function BusinessOutcomeCard({
    landedCostPerUnit,
    quantity,
    initialSellingPrice,
    onPriceChange,
}: BusinessOutcomeCardProps) {
    const [sellingPrice, setSellingPrice] = useState(initialSellingPrice);

    useEffect(() => {
        setSellingPrice(initialSellingPrice);
    }, [initialSellingPrice]);

    const handlePriceChange = (val: string) => {
        const num = Number(val);
        setSellingPrice(num);
        onPriceChange(num);
    };

    // 1. Core Metrics
    const totalCost = landedCostPerUnit * quantity;
    const totalRevenue = sellingPrice * quantity;
    const totalProfit = totalRevenue - totalCost;
    const marginPercent = sellingPrice > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    // 2. Investment Efficiency (Money Multiplier)
    // ROII = (Revenue - Cost) / Cost
    const roiMultiplier = landedCostPerUnit > 0 ? sellingPrice / landedCostPerUnit : 0;
    const roiPercent = landedCostPerUnit > 0 ? ((sellingPrice - landedCostPerUnit) / landedCostPerUnit) * 100 : 0;

    // 3. Break-even Logic
    const breakEvenPrice = landedCostPerUnit;
    const isLoss = sellingPrice < breakEvenPrice;
    const isHealthy = marginPercent >= 30; // Rule of thumb

    // Styles
    const cardVariant = isLoss
        ? "border-rose-200 bg-rose-50/50"
        : isHealthy
            ? "border-emerald-200 bg-emerald-50/50"
            : "border-amber-200 bg-amber-50/50";

    const textVariant = isLoss ? "text-rose-700" : isHealthy ? "text-emerald-700" : "text-amber-700";

    return (
        <div className={`rounded-xl border shadow-sm transition-all ${cardVariant} p-5`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider opacity-70">
                        Projected Outcome
                        {isHealthy && <Target size={14} className="text-emerald-600" />}
                    </p>
                    <div className="mt-1">
                        <h3 className={`text-3xl font-extrabold ${textVariant}`}>
                            {formatCurrencyZar(totalProfit)}
                        </h3>
                        <p className="text-xs font-medium text-slate-600 opacity-80">
                            Total Net Profit (for {quantity} units)
                        </p>
                        <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white/50 px-2 py-1 text-xs text-slate-600 ring-1 ring-slate-900/5">
                            <span className="font-semibold text-slate-900">{formatCurrencyZar(landedCostPerUnit)}</span>
                            <span>unit cost</span>
                        </div>
                    </div>
                </div>
                <div className={`rounded-lg p-2 ${isLoss ? "bg-rose-100/50" : "bg-white/60"}`}>
                    {isLoss ? <TrendingDown size={24} className="text-rose-500" /> : <TrendingUp size={24} className={textVariant} />}
                </div>
            </div>

            <div className="mt-6 space-y-4">
                {/* Input Section */}
                <div className="rounded-lg bg-white/60 p-3 ring-1 ring-slate-900/5 transition-shadow focus-within:ring-2 focus-within:ring-blue-500/20">
                    <label className="mb-1 block text-xs font-medium text-slate-500">Target Selling Price (per unit)</label>
                    <div className="flex items-center gap-1">
                        <span className="text-lg font-bold text-slate-400">R</span>
                        <input
                            type="number"
                            value={sellingPrice}
                            onChange={(e) => handlePriceChange(e.target.value)}
                            className="w-full bg-transparent text-xl font-bold text-slate-900 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Multiplier / ROI Badge */}
                <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-500">Capital Efficiency</span>
                        <div className="flex items-baseline gap-1">
                            <span className={`text-lg font-bold ${textVariant}`}>{roiMultiplier.toFixed(2)}x</span>
                            <span className="text-xs text-slate-400">({roiPercent.toFixed(0)}% ROI)</span>
                        </div>
                    </div>

                    <div className="flex flex-col text-right">
                        <span className="text-xs text-slate-500">Margin</span>
                        <span className={`text-lg font-bold ${textVariant}`}>{marginPercent.toFixed(1)}%</span>
                    </div>
                </div>

                {/* Break-even Visual */}
                <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-400">
                        <span>Break-even: {formatCurrencyZar(breakEvenPrice)}</span>
                        {isLoss && <span className="flex items-center gap-1 font-bold text-rose-600"><AlertCircle size={12} /> Loss Warning</span>}
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                        {/* 
                    Visualizing the spread. 
                    If cost is 100, and price is 150. 
                    Bar should show Cost portion vs Profit portion.
                 */}
                        <div className="flex h-full w-full">
                            {/* Cost Part */}
                            <div
                                className="bg-slate-400 opacity-30"
                                style={{ width: `${Math.min(100, (landedCostPerUnit / sellingPrice) * 100)}%` }}
                            />
                            {/* Profit Part */}
                            {!isLoss && (
                                <div
                                    className={isHealthy ? "bg-emerald-500" : "bg-amber-500"}
                                    style={{ width: `${100 - ((landedCostPerUnit / sellingPrice) * 100)}%` }}
                                />
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
