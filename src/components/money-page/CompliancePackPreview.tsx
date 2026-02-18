"use client";

import {
    FileDown,
    Shield,
    FileCheck,
    BookCheck,
    Calculator,
    Link2,
} from "lucide-react";

type Props = {
    onDownload: () => void;
    hasComplianceData: boolean;
};

const PACK_SECTIONS = [
    { icon: Shield, label: "Legality Status & Summary", included: true },
    { icon: FileCheck, label: "Permit & Registration Checklist", included: true },
    { icon: BookCheck, label: "Standards & Certifications Matrix", included: true },
    { icon: Calculator, label: "Landed Cost Breakdown", included: true },
    { icon: Link2, label: "Source References & Citations", included: true },
];

export function CompliancePackPreview({ onDownload, hasComplianceData }: Props) {
    return (
        <section className="rounded-2xl border border-indigo-200 bg-gradient-to-b from-indigo-50 to-white p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
                <div className="rounded-lg bg-indigo-100 p-2">
                    <FileDown className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                    <h2 className="text-base font-bold text-indigo-900">Compliance Pack</h2>
                    <p className="text-xs text-indigo-600/70">Complete import decision report</p>
                </div>
            </div>

            <ul className="space-y-2 mb-4">
                {PACK_SECTIONS.map(({ icon: Icon, label }, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-indigo-800">
                        <Icon className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0" />
                        <span>{label}</span>
                    </li>
                ))}
            </ul>

            <button
                type="button"
                onClick={onDownload}
                disabled={!hasComplianceData}
                className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
                <FileDown className="h-4 w-4" />
                Download Compliance Pack
            </button>

            <p className="mt-3 text-[10px] text-indigo-400 text-center leading-relaxed">
                Generates a print-ready report with all route data.
            </p>
        </section>
    );
}
