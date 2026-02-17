"use client";

import { useState, useEffect } from "react";
import type { PortOfEntry, ShippingMode } from "@/lib/calc/types";
import { getProductModule } from "@/lib/products/registry";
import type { ProductDefinition } from "@/lib/products/types";

// Duplicate of CalcFormState from CalcCard for now to ensure self-containment during migration
export type CalcFormState = {
    hs6: string;
    origin: string;
    incoterm: "FOB" | "CIF" | "DDP";
    invoiceValueZar: number;
    freightZar: number;
    insuranceZar: number;
    otherFeesZar: number;
    quantity: number;
    importerIsVatVendor: boolean;
    sellingPricePerUnitZar: number;
    fxRate: number;
    hsConfidence: number;
    overrideCifFreightInsurance?: boolean;

    // Moat Fields
    portOfEntry: PortOfEntry;
    shippingMode: ShippingMode;
    useAgencyEstimate: boolean;
    risk_demurrageDays: number;
    risk_forexBuffer: number;
    customDutyRate?: number;

    // Logistics
    inlandTransportZar?: number;
    productSpecificData?: Record<string, any>;
};

type HsSuggestion = {
    hs6: string;
    label: string;
    confidence: number;
    warnings: string[];
};

type SteppedCalcProps = {
    value: CalcFormState;
    onChange: (next: CalcFormState) => void;
    onSubmit: () => void;
};

export function SteppedCalc({ value, onChange, onSubmit }: SteppedCalcProps) {
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

    // Step 1 Local State (HS Helper)
    const [description, setDescription] = useState("");
    const [suggestions, setSuggestions] = useState<HsSuggestion[]>([]);
    const [hsDescription, setHsDescription] = useState<string | null>(null);

    async function suggestHs() {
        if (description.trim().length < 3) return;
        try {
            const response = await fetch("/api/hs/suggest", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ description })
            });
            if (!response.ok) return;
            const data = (await response.json()) as { suggestions: HsSuggestion[] };
            setSuggestions(data.suggestions);
        } catch (e) {
            console.error("Failed to suggest HS", e);
        }
    }

    // Product Module Resolution
    const activeModule = getProductModule(value.hs6);

    // HS Description Lookup
    useEffect(() => {
        if (value.hs6.length === 6) {
            const suggestion = suggestions.find(s => s.hs6 === value.hs6);
            if (suggestion) {
                setHsDescription(suggestion.label);
                return;
            }
            fetch(`/api/hs/lookup?hs6=${value.hs6}`)
                .then(res => res.ok ? res.json() : null)
                .then(data => setHsDescription(data?.description || null))
                .catch(() => setHsDescription(null));
        } else {
            setHsDescription(null);
        }
    }, [value.hs6, suggestions]);

    function setNumber<K extends keyof CalcFormState>(key: K, raw: string) {
        const parsed = Number(raw);
        // Ensure finite and non-negative
        let final = Number.isFinite(parsed) ? Math.max(0, parsed) : 0;

        // Special case: Quantity must be at least 1
        if (key === "quantity" && final < 1) final = 1;

        onChange({
            ...value,
            [key]: final
        });
    }

    // Progress Calculation
    const progress = currentStep === 1 ? 33 : currentStep === 2 ? 66 : 100;

    return (
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-slate-100">
                <div
                    className="h-full bg-blue-600 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="p-5">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            {currentStep === 1 && "Step 1: Product & Route"}
                            {currentStep === 2 && "Step 2: Values & Logistics"}
                            {currentStep === 3 && "Step 3: Business & Risk"}
                        </h2>
                        <p className="text-sm text-slate-500">
                            {currentStep === 1 && "Start with the basics of what you're importing."}
                            {currentStep === 2 && "Enter invoice values and shipping details."}
                            {currentStep === 3 && "Refine margins and simulate risks."}
                        </p>
                    </div>
                    <div className="text-xs font-semibold text-slate-400">
                        Step {currentStep} of 3
                    </div>
                </div>

                {/* STEP 1: Product & Route */}
                {currentStep === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="text-sm">
                                <span className="mb-1.5 block font-medium text-slate-700">Origin Country</span>
                                <div className="relative">
                                    <select
                                        value={value.origin}
                                        onChange={(event) => onChange({ ...value, origin: event.target.value })}
                                        className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    >
                                        <option value="china">China</option>
                                        <option value="india">India</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                            </label>

                            <label className="text-sm">
                                <span className="mb-1.5 block font-medium text-slate-700">Incoterm</span>
                                <div className="relative">
                                    <select
                                        value={value.incoterm}
                                        onChange={(event) => onChange({ ...value, incoterm: event.target.value as CalcFormState["incoterm"] })}
                                        className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    >
                                        <option value="FOB">FOB (Free on Board)</option>
                                        <option value="CIF">CIF (Cost, Insurance, Freight)</option>
                                        <option value="DDP">DDP (Delivered Duty Paid)</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                            </label>
                        </div>

                        <label className="block text-sm">
                            <div className="flex items-center justify-between">
                                <span className="mb-1.5 block font-medium text-slate-700">HS Code (6-digit)</span>
                                {value.hsConfidence > 0 && <span className="text-xs text-slate-400">Confidence: {Math.round(value.hsConfidence * 100)}%</span>}
                            </div>
                            <input
                                value={value.hs6}
                                onChange={(event) => onChange({ ...value, hs6: event.target.value })}
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="e.g. 854140"
                                maxLength={6}
                            />
                            {hsDescription && (
                                <p className="mt-1.5 text-xs text-slate-500 italic">{hsDescription}</p>
                            )}
                        </label>

                        {/* AI Helper */}
                        <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-4">
                            <p className="text-sm font-semibold text-blue-900">Don't know the HS Code?</p>
                            <div className="mt-2 flex gap-2">
                                <input
                                    value={description}
                                    onChange={(event) => setDescription(event.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && suggestHs()}
                                    placeholder="Describe product (e.g. 'cotton t-shirts')..."
                                    className="flex-1 rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={suggestHs}
                                    className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm ring-1 ring-inset ring-blue-300 hover:bg-blue-50"
                                >
                                    Find
                                </button>
                            </div>
                            {suggestions.length > 0 && (
                                <ul className="mt-3 space-y-2">
                                    {suggestions.slice(0, 3).map((suggestion) => (
                                        <li key={suggestion.hs6} className="flex items-start justify-between rounded-md bg-white p-2 text-xs shadow-sm ring-1 ring-slate-900/5">
                                            <span className="text-slate-600">{suggestion.label}</span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    onChange({ ...value, hs6: suggestion.hs6, hsConfidence: suggestion.confidence });
                                                    setSuggestions([]); // clear after selection
                                                    setDescription("");
                                                }}
                                                className="ml-2 shrink-0 font-medium text-blue-600 hover:underline"
                                            >
                                                Select {suggestion.hs6}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={() => setCurrentStep(2)}
                                disabled={value.hs6.length < 6} // Enforce 6 digits for API
                                className="w-full rounded-xl bg-blue-600 px-6 py-3 text-base font-bold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 disabled:bg-slate-300 disabled:shadow-none"
                            >
                                Next: Values & Logistics
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2: Costs & Logistics */}
                {currentStep === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        {/* Summary of Step 1 */}
                        <div
                            onClick={() => setCurrentStep(1)}
                            className="group flex cursor-pointer items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-600 hover:border-blue-200 hover:bg-blue-50"
                        >
                            <span>{value.origin} &bull; {value.hs6} &bull; {value.incoterm}</span>
                            <span className="text-xs font-semibold text-blue-600 opacity-0 group-hover:opacity-100">Edit</span>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="text-sm">
                                <span className="mb-1.5 block font-medium text-slate-700">Invoice Value (ZAR)</span>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">R</span>
                                    <input
                                        type="number"
                                        value={value.invoiceValueZar}
                                        onChange={(event) => setNumber("invoiceValueZar", event.target.value)}
                                        className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-7 pr-3 text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            </label>

                            <label className="text-sm">
                                <span className="mb-1.5 block font-medium text-slate-700">Port of Entry</span>
                                <select
                                    value={value.portOfEntry}
                                    onChange={(event) => onChange({ ...value, portOfEntry: event.target.value as PortOfEntry })}
                                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="DBN">Durban (Sea)</option>
                                    <option value="CPT">Cape Town (Sea)</option>
                                    <option value="JNB">OR Tambo (Air)</option>
                                    <option value="PLZ">Gqeberha (Sea)</option>
                                </select>
                            </label>

                            <label className="text-sm">
                                <span className="mb-1.5 block font-medium text-slate-700">Shipping Mode</span>
                                <select
                                    value={value.shippingMode}
                                    onChange={(event) => onChange({ ...value, shippingMode: event.target.value as ShippingMode })}
                                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="LCL">LCL (Less than Container)</option>
                                    <option value="FCL_20">FCL 20ft Container</option>
                                    <option value="FCL_40">FCL 40ft Container</option>
                                    <option value="AIR">Air Freight</option>
                                </select>
                            </label>

                            <label className="text-sm">
                                <div className="mb-1.5 flex items-center justify-between">
                                    <span className="font-medium text-slate-700">Freight & Insurance</span>
                                </div>
                                {value.overrideCifFreightInsurance ? (
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-xs text-slate-400">F:R</span>
                                            <input
                                                type="number"
                                                className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-2 text-sm"
                                                value={value.freightZar}
                                                onChange={(e) => setNumber("freightZar", e.target.value)}
                                                placeholder="Freight"
                                            />
                                        </div>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-xs text-slate-400">I:R</span>
                                            <input
                                                type="number"
                                                className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-2 text-sm"
                                                value={value.insuranceZar}
                                                onChange={(e) => setNumber("insuranceZar", e.target.value)}
                                                placeholder="Ins"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-lg border border-slate-100 bg-slate-50 p-2 text-xs text-slate-500">
                                        Auto-calculated based on Incoterm.
                                        <button
                                            type="button"
                                            onClick={() => onChange({ ...value, overrideCifFreightInsurance: true })}
                                            className="ml-1 text-blue-600 underline"
                                        >
                                            Override
                                        </button>
                                    </div>
                                )}
                            </label>

                            <div className="text-sm sm:col-span-2">
                                <span className="mb-2 block font-medium text-slate-700">Final Delivery to Warehouse</span>
                                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <button
                                            type="button"
                                            onClick={() => setNumber("inlandTransportZar", "0")}
                                            className={`rounded-md px-3 py-1.5 text-xs font-medium border ${value.inlandTransportZar === 0 ? "bg-white border-slate-300 text-slate-800 shadow-sm" : "border-transparent text-slate-500 hover:bg-slate-100"}`}
                                        >
                                            None / Self
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setNumber("inlandTransportZar", "150")}
                                            className={`rounded-md px-3 py-1.5 text-xs font-medium border ${value.inlandTransportZar === 150 ? "bg-white border-blue-300 text-blue-700 shadow-sm" : "border-transparent text-slate-500 hover:bg-blue-50 hover:text-blue-600"}`}
                                        >
                                            📦 Courier (~R150)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setNumber("inlandTransportZar", "850")}
                                            className={`rounded-md px-3 py-1.5 text-xs font-medium border ${value.inlandTransportZar === 850 ? "bg-white border-blue-300 text-blue-700 shadow-sm" : "border-transparent text-slate-500 hover:bg-blue-50 hover:text-blue-600"}`}
                                        >
                                            🚛 Local City (~R850)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setNumber("inlandTransportZar", "4500")}
                                            className={`rounded-md px-3 py-1.5 text-xs font-medium border ${value.inlandTransportZar === 4500 ? "bg-white border-blue-300 text-blue-700 shadow-sm" : "border-transparent text-slate-500 hover:bg-blue-50 hover:text-blue-600"}`}
                                        >
                                            🚚 National (~R4.5k)
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">R</span>
                                        <input
                                            type="number"
                                            value={value.inlandTransportZar || 0}
                                            onChange={(event) => setNumber("inlandTransportZar", event.target.value)}
                                            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-7 pr-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <p className="mt-1.5 text-xs text-slate-500">
                                        Estimated cost to move goods from {value.portOfEntry} to your door.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Dynamic Product Fields */}
                        {activeModule && (
                            <div className="mt-6 space-y-4 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                                <h3 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                                    <span className="bg-blue-200 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                                        {activeModule.name} Specs
                                    </span>
                                </h3>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {activeModule.fields.map((field) => (
                                        <label key={field.id} className="block">
                                            <span className="block text-xs font-medium text-slate-500 mb-1">
                                                {field.label}
                                            </span>
                                            {field.type === "boolean" ? (
                                                <div className="flex items-center gap-2 mt-2">
                                                    <input
                                                        type="checkbox"
                                                        className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                        checked={!!value.productSpecificData?.[field.id]}
                                                        onChange={(e) => onChange({
                                                            ...value,
                                                            productSpecificData: {
                                                                ...value.productSpecificData,
                                                                [field.id]: e.target.checked
                                                            }
                                                        })}
                                                    />
                                                    <span className="text-sm text-slate-700">Yes</span>
                                                </div>
                                            ) : (
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                        value={value.productSpecificData?.[field.id] ?? field.defaultValue ?? ""}
                                                        onChange={(e) => onChange({
                                                            ...value,
                                                            productSpecificData: {
                                                                ...value.productSpecificData,
                                                                [field.id]: e.target.value
                                                            }
                                                        })}
                                                    />
                                                    {field.suffix && (
                                                        <span className="absolute right-3 top-2 text-xs text-slate-400">
                                                            {field.suffix}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="pt-2 flex gap-3">
                            <button
                                type="button"
                                onClick={() => setCurrentStep(1)}
                                className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={() => setCurrentStep(3)}
                                className="flex-1 rounded-xl bg-blue-600 px-6 py-3 text-base font-bold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700"
                            >
                                Next: Business & Risk
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3: Business & Risk */}
                {currentStep === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        {/* Summary of Previous Steps */}
                        <div className="flex gap-2">
                            <div
                                onClick={() => setCurrentStep(1)}
                                className="flex-1 cursor-pointer rounded-lg border border-slate-100 bg-slate-50 px-2 py-2 text-xs text-slate-600 hover:border-blue-200 hover:bg-blue-50 text-center truncate"
                            >
                                Step 1: {value.hs6}
                            </div>
                            <div
                                onClick={() => setCurrentStep(2)}
                                className="flex-1 cursor-pointer rounded-lg border border-slate-100 bg-slate-50 px-2 py-2 text-xs text-slate-600 hover:border-blue-200 hover:bg-blue-50 text-center truncate"
                            >
                                Step 2: R{value.invoiceValueZar}
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="text-sm">
                                <span className="mb-1.5 block font-medium text-slate-700">Quantity</span>
                                <input
                                    type="number"
                                    value={value.quantity}
                                    onChange={(event) => setNumber("quantity", event.target.value)}
                                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </label>

                            <label className="text-sm">
                                <span className="mb-1.5 block font-medium text-slate-700">Selling Price / Unit (ZAR)</span>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">R</span>
                                    <input
                                        type="number"
                                        value={value.sellingPricePerUnitZar}
                                        onChange={(event) => setNumber("sellingPricePerUnitZar", event.target.value)}
                                        className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-7 pr-3 text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            </label>

                            <label className="text-sm sm:col-span-2">
                                <div className="flex items-center justify-between mb-1.5 ">
                                    <span className="block font-medium text-slate-700">Risk Simulation</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 rounded-lg border border-indigo-100 bg-indigo-50/50 p-3">
                                    <div>
                                        <span className="text-xs text-slate-500 block mb-1">Delays (Demurrage)</span>
                                        <div className="flex items-center gap-1">
                                            <input
                                                type="number"
                                                className="w-full rounded border border-indigo-200 py-1 px-2 text-sm"
                                                value={value.risk_demurrageDays}
                                                onChange={(e) => setNumber("risk_demurrageDays", e.target.value)}
                                            />
                                            <span className="text-xs text-slate-400">days</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-500 block mb-1">Forex Buffer</span>
                                        <div className="flex items-center gap-1">
                                            <input
                                                type="number"
                                                className="w-full rounded border border-indigo-200 py-1 px-2 text-sm"
                                                value={value.risk_forexBuffer}
                                                onChange={(e) => setNumber("risk_forexBuffer", e.target.value)}
                                            />
                                            <span className="text-xs text-slate-400">%</span>
                                        </div>
                                    </div>
                                </div>
                            </label>

                            <div className="sm:col-span-2 flex items-center justify-between rounded-lg bg-slate-50 p-3">
                                <label className="flex items-center gap-2 text-sm text-slate-700">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        checked={value.importerIsVatVendor}
                                        onChange={(event) => onChange({ ...value, importerIsVatVendor: event.target.checked })}
                                    />
                                    VAT-registered importer
                                </label>
                            </div>
                        </div>

                        <div className="pt-2 flex gap-3">
                            <button
                                type="button"
                                onClick={() => setCurrentStep(2)}
                                className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={() => onSubmit()}
                                className="flex-1 rounded-xl bg-green-600 px-6 py-3 text-base font-bold text-white shadow-md shadow-green-600/20 transition-all hover:bg-green-700 hover:shadow-lg active:scale-[0.98]"
                            >
                                Calculate Results
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </section >
    );
}
