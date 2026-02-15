"use client";

import { useState } from "react";
import type { PortOfEntry, ShippingMode } from "@/lib/calc/types";

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
};

type HsSuggestion = {
  hs6: string;
  label: string;
  confidence: number;
  warnings: string[];
};

type CalcCardProps = {
  value: CalcFormState;
  onChange: (next: CalcFormState) => void;
  onSubmit: () => void;
};

export function CalcCard({ value, onChange, onSubmit }: CalcCardProps) {
  const [description, setDescription] = useState("");
  const [suggestions, setSuggestions] = useState<HsSuggestion[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  async function suggestHs() {
    if (description.trim().length < 3) {
      return;
    }
    const response = await fetch("/api/hs/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description })
    });
    if (!response.ok) {
      return;
    }
    const data = (await response.json()) as { suggestions: HsSuggestion[] };
    setSuggestions(data.suggestions);
  }

  function setNumber<K extends keyof CalcFormState>(key: K, raw: string) {
    const parsed = Number(raw);
    onChange({
      ...value,
      [key]: Number.isFinite(parsed) ? parsed : 0
    });
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900">Calculator Inputs</h2>
        <p className="text-sm text-slate-500">Core answer is always available without login.</p>
      </div>

      <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
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

        <label className="text-sm sm:col-span-2">
          <div className="flex items-center justify-between">
            <span className="mb-1.5 block font-medium text-slate-700">HS Code (6-digit)</span>
            <span className="text-xs text-slate-400">Confidence: {Math.round(value.hsConfidence * 100)}%</span>
          </div>
          <input
            value={value.hs6}
            onChange={(event) => onChange({ ...value, hs6: event.target.value })}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="e.g. 854140"
          />
        </label>

        <div className="col-span-2 my-2 border-t border-slate-100" />

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
          <span className="mb-1.5 block font-medium text-slate-700">Freight Cost (ZAR)</span>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">R</span>
            <input
              type="number"
              value={value.freightZar}
              onChange={(event) => setNumber("freightZar", event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-7 pr-3 text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </label>

        <label className="text-sm">
          <span className="mb-1.5 block font-medium text-slate-700">Insurance (ZAR)</span>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">R</span>
            <input
              type="number"
              value={value.insuranceZar}
              onChange={(event) => setNumber("insuranceZar", event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-7 pr-3 text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </label>

        <label className="text-sm">
          <span className="mb-1.5 block font-medium text-slate-700">Other Fees (ZAR)</span>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">R</span>
            <input
              type="number"
              value={value.otherFeesZar}
              onChange={(event) => setNumber("otherFeesZar", event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-7 pr-3 text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </label>

        <div className="col-span-2 my-2 border-t border-slate-100" />

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

        <label className="text-sm">
          <span className="mb-1.5 block font-medium text-slate-700">FX Rate (USD/ZAR)</span>
          <input
            type="number"
            step="0.01"
            value={value.fxRate}
            onChange={(event) => setNumber("fxRate", event.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </label>
      </div>

      <div className="mt-4 flex flex-col gap-2 rounded-lg bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            checked={value.importerIsVatVendor}
            onChange={(event) => onChange({ ...value, importerIsVatVendor: event.target.checked })}
          />
          VAT-registered importer
        </label>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            checked={value.overrideCifFreightInsurance ?? false}
            onChange={(event) => onChange({ ...value, overrideCifFreightInsurance: event.target.checked })}
          />
          Manual freight/ins override
        </label>
      </div>

      {/* Advanced Moat Features Section */}
      <div className="mt-4 border-t border-slate-100 pt-3">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex w-full items-center justify-between text-sm font-semibold text-slate-700 transition-colors hover:text-blue-600"
        >
          <span>Advanced Logistics & Risk</span>
          <span className={`transition-transform ${showAdvanced ? "rotate-180" : ""}`}>▼</span>
        </button>

        {showAdvanced && (
          <div className="mt-4 grid gap-x-4 gap-y-4 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 sm:grid-cols-2">

            <label className="text-sm">
              <span className="mb-1.5 block font-medium text-slate-700">Port of Entry (SA)</span>
              <div className="relative">
                <select
                  value={value.portOfEntry}
                  onChange={(event) => onChange({ ...value, portOfEntry: event.target.value as PortOfEntry })}
                  className="w-full appearance-none rounded-lg border border-indigo-200 bg-white px-3 py-2 text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="DBN">Durban (Sea)</option>
                  <option value="CPT">Cape Town (Sea)</option>
                  <option value="JNB">OR Tambo (Air)</option>
                  <option value="PLZ">Gqeberha (Sea)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </label>

            <label className="text-sm">
              <span className="mb-1.5 block font-medium text-slate-700">Shipping Mode</span>
              <div className="relative">
                <select
                  value={value.shippingMode}
                  onChange={(event) => onChange({ ...value, shippingMode: event.target.value as ShippingMode })}
                  className="w-full appearance-none rounded-lg border border-indigo-200 bg-white px-3 py-2 text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="LCL">LCL (Less than Container)</option>
                  <option value="FCL_20">FCL 20ft Container</option>
                  <option value="FCL_40">FCL 40ft Container</option>
                  <option value="AIR">Air Freight</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </label>

            <label className="text-sm sm:col-span-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
                  checked={value.useAgencyEstimate}
                  onChange={(event) => onChange({ ...value, useAgencyEstimate: event.target.checked })}
                />
                <span className="font-medium text-slate-700">Auto-estimate Clearing Agency Fees</span>
              </div>
              <p className="mt-1 ml-6 text-xs text-slate-500">Includes entry fees and typical disbursements.</p>
            </label>

            <div className="col-span-2 my-2 border-t border-indigo-100/50" />

            <label className="text-sm">
              <span className="mb-1.5 block font-medium text-slate-700">Demurrage Risk</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={value.risk_demurrageDays}
                  onChange={(event) => setNumber("risk_demurrageDays", event.target.value)}
                  className="w-20 rounded-lg border border-indigo-200 bg-white px-3 py-2 text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                <span className="text-slate-600">days delay</span>
              </div>
              <p className="mt-1 text-xs text-slate-500 text-amber-600">Risk: +{(Math.max(0, value.risk_demurrageDays - 3))} days billable</p>
            </label>

            <label className="text-sm">
              <span className="mb-1.5 block font-medium text-slate-700">Forex Volatility Buffer</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={value.risk_forexBuffer}
                  onChange={(event) => setNumber("risk_forexBuffer", event.target.value)}
                  className="w-20 rounded-lg border border-indigo-200 bg-white px-3 py-2 text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                <span className="text-slate-600">% cushion</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">Simulates weaker ZAR.</p>
            </label>

          </div>
        )}
      </div>

      <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50/50 p-4">
        <p className="text-sm font-semibold text-blue-900">AI HS Code Helper</p>
        <div className="mt-2 flex gap-2">
          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe your product (e.g. 'cotton t-shirts')..."
            className="flex-1 rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={suggestHs}
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm ring-1 ring-inset ring-blue-300 hover:bg-blue-50"
          >
            Suggest
          </button>
        </div>
        {suggestions.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {suggestions.slice(0, 5).map((suggestion) => (
              <li key={suggestion.hs6} className="flex items-start justify-between rounded-md bg-white p-2 text-xs shadow-sm ring-1 ring-slate-900/5">
                <span className="text-slate-600">{suggestion.label}</span>
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...value,
                      hs6: suggestion.hs6,
                      hsConfidence: suggestion.confidence
                    })
                  }
                  className="ml-2 shrink-0 font-medium text-blue-600 hover:underline"
                >
                  Apply {suggestion.hs6}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={onSubmit}
          className="w-full rounded-xl bg-blue-600 px-6 py-3 text-base font-bold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-[0.98]"
        >
          Recalculate Costs
        </button>
      </div>
    </section>
  );
}
