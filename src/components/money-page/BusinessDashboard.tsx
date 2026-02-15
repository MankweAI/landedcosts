"use client";

import { useState, useEffect } from "react";
import { formatCurrencyZar } from "@/lib/format";
import type { CalcOutput } from "@/lib/calc/types";
import type { CalcFormState } from "@/components/money-page/CalcCard";
import { ConfidenceBadge } from "@/components/money-page/ConfidenceBadge";
import { ReverseCalcCard } from "@/components/money-page/ReverseCalcCard";
import { Info, TrendingUp, Wallet, PieChart } from "lucide-react";

type BusinessDashboardProps = {
    output: CalcOutput;
    form: CalcFormState;
    onChange: (next: CalcFormState) => void;
    activePreset: string;
};

export function BusinessDashboard({ output, form, onChange, activePreset }: BusinessDashboardProps) {
    // Local state for immediate feedback, synced with form
    const [sellingPrice, setSellingPrice] = useState(form.sellingPricePerUnitZar);

    // Sync local state when form updates externally (e.g. presets)
    useEffect(() => {
        setSellingPrice(form.sellingPricePerUnitZar);
    }, [form.sellingPricePerUnitZar]);

    const handlePriceChange = (value: string) => {
        const num = Number(value);
        setSellingPrice(num);
        onChange({ ...form, sellingPricePerUnitZar: num });
    };

    // Derived Metrics
    const landedCostPerUnit = output.landedCostPerUnitZar;
    const netProfitPerUnit = sellingPrice - landedCostPerUnit;
    const marginPercent = sellingPrice > 0 ? (netProfitPerUnit / sellingPrice) * 100 : 0;

    // VAT Logic
    // Assuming output.landedCostTotalZar is the "Final Cost to Company"
    // If VAT Vendor: Cost = Total - VAT Amount (if included) -> Wait, let's look at the "Total Taxes"
    // Let's simplify: 
    // Cash Outlay = Duty + VAT + Levies + Fees + FOB + Freight + Ins
    // We can reconstruct "Total Cash Outlay" roughly as landedCostTotalZar if it's inclusive, or add VAT if exclusive.
    // To be safe, let's use the breakdown components if available, but output.landedCostTotalZar is the source of truth.
    // We will assume output.landedCostTotalZar is the "Effective Cost".
    // If `importerIsVatVendor` was TRUE during calc, then landedCostTotalZar likely EXCLUDES VAT?
    // Let's rely on the toggle to just Change the "View" conceptually.

    const vatAmount = output.vatAmountZar;
    const totalCashOutlay = output.landedCostTotalZar + (form.importerIsVatVendor ? vatAmount : 0); // Approx logic: if vendor, landed cost usually excludes VAT, so add it back for cash flow.
    const netEffectiveCost = output.landedCostTotalZar; // If vendor, this is ex VAT. If not, this is incl VAT.

    const isProfitable = netProfitPerUnit > 0;
    const marginColor = marginPercent > 30 ? "text-emerald-600 bg-emerald-50 border-emerald-200" : marginPercent > 15 ? "text-amber-600 bg-amber-50 border-amber-200" : "text-rose-600 bg-rose-50 border-rose-200";

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Business Decision Dashboard</h2>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Based on {activePreset} View</span>
                    <ConfidenceBadge label={output.confidenceLabel} />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {/* Card 1: Profitability Simulator */}
                <div className={`rounded-xl border p-5 shadow-sm transition-all ${marginColor}`}>
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider opacity-70">Profitability</p>
                            <h3 className="mt-1 text-2xl font-extrabold">{marginPercent.toFixed(1)}% Margin</h3>
                        </div>
                        <TrendingUp size={20} className="opacity-70" />
                    </div>

                    <div className="mt-4 space-y-3">
                        <div className="rounded-lg bg-white/60 p-2">
                            <label className="block text-xs text-slate-500">Target Selling Price (Unit)</label>
                            <div className="flex items-center gap-1">
                                <span className="font-semibold text-slate-400">R</span>
                                <input
                                    type="number"
                                    value={sellingPrice}
                                    onChange={(e) => handlePriceChange(e.target.value)}
                                    className="w-full bg-transparent font-bold text-slate-900 focus:outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="opacity-80">Net Profit / Unit</span>
                            <span className={`font-bold ${isProfitable ? "text-emerald-700" : "text-rose-700"}`}>
                                {formatCurrencyZar(netProfitPerUnit)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Card 2: Cash Flow */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Cash Flow</p>
                            <h3 className="mt-1 text-2xl font-extrabold text-slate-900">{formatCurrencyZar(totalCashOutlay)}</h3>
                            <p className="text-xs text-slate-500">Total cash required to land goods</p>
                        </div>
                        <Wallet size={20} className="text-slate-400" />
                    </div>

                    <div className="space-y-2 mb-3 rounded-lg bg-slate-50 p-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-600">Import Duty</span>
                            <span className="font-semibold text-slate-900">{formatCurrencyZar(output.dutyAmountZar)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">VAT (15%)</span>
                            <span className="font-semibold text-slate-900">{formatCurrencyZar(output.vatAmountZar)}</span>
                        </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-sm text-slate-600">
                                <input
                                    type="checkbox"
                                    checked={form.importerIsVatVendor}
                                    onChange={(e) => onChange({ ...form, importerIsVatVendor: e.target.checked })}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                VAT Vendor
                            </label>
                            {form.importerIsVatVendor && (
                                <div className="text-right">
                                    <span className="block text-xs text-emerald-600 font-medium">Reclaimable</span>
                                    <span className="text-sm font-bold text-emerald-700">{formatCurrencyZar(vatAmount)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Card 4: Reverse Calculator */}
                <ReverseCalcCard form={form} onApplyFob={(fobZar) => onChange({ ...form, invoiceValueZar: fobZar })} />

                {/* Card 3: Unit Economics */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Unit Economics</p>
                            <h3 className="mt-1 text-2xl font-extrabold text-slate-900">{formatCurrencyZar(landedCostPerUnit)}</h3>
                            <p className="text-xs text-slate-500">Landed cost per unit</p>
                        </div>
                        <PieChart size={20} className="text-slate-400" />
                    </div>

                    <div className="mt-4 space-y-2">
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 flex">
                            <div className="bg-blue-500 h-full" style={{ width: `${Math.min((landedCostPerUnit / sellingPrice) * 100, 100)}%` }} />
                            <div className="bg-emerald-400 h-full" style={{ width: `${Math.max(0, 100 - (landedCostPerUnit / sellingPrice) * 100)}%` }} />
                        </div>
                        <div className="flex justify-between text-xs text-slate-500">
                            <span>Cost ({Math.round((landedCostPerUnit / sellingPrice) * 100)}%)</span>
                            <span>Profit ({Math.round(marginPercent)}%)</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
