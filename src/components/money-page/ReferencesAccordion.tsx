"use client";

import { useState } from "react";

type ReferencesAccordionProps = {
    tariffVersionLabel: string;
    tariffEffectiveDate: string;
    sourcePointerShort: string;
};

export function ReferencesAccordion({
    tariffVersionLabel,
    tariffEffectiveDate,
    sourcePointerShort
}: ReferencesAccordionProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <section className="rounded-xl border border-slate-200 bg-white">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between p-4 text-left text-sm font-medium text-slate-900 hover:bg-slate-50"
            >
                <span>Data Sources & References</span>
                <span className="text-slate-400">{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen && (
                <div className="border-t border-slate-200 p-4 text-xs text-slate-600 space-y-3">
                    <div>
                        <p className="font-semibold text-slate-900">Tariff Source</p>
                        <p>
                            Version: {tariffVersionLabel} (Effective: {tariffEffectiveDate})
                        </p>
                        <p>Ref: {sourcePointerShort}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900">Primary Authority</p>
                        <p>South African Revenue Service (SARS) Customs & Excise Act 91 of 1964.</p>
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900">Disclaimer</p>
                        <p>
                            Calculations are estimates for decision support. Final liability is determined by SARS at the port of entry.
                            Rates may change without notice.
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
}
