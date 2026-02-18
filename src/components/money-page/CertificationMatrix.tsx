"use client";

import type { Requirement } from "@/lib/compliance/types";
import { BookCheck, ExternalLink, Award } from "lucide-react";

type Props = {
    certifications: Requirement[];
    labeling: Requirement[];
};

function CertRow({ req }: { req: Requirement }) {
    return (
        <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
            <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-teal-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-900">{req.name}</span>
                </div>
            </td>
            <td className="py-3 px-4">
                <span className="text-xs font-medium text-slate-500 capitalize">{req.category}</span>
            </td>
            <td className="py-3 px-4">
                <span className="text-xs text-slate-500">{req.authorityId.toUpperCase()}</span>
            </td>
            <td className="py-3 px-4">
                {req.required ? (
                    <span className="inline-flex items-center rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                        REQUIRED
                    </span>
                ) : (
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                        OPTIONAL
                    </span>
                )}
            </td>
            <td className="py-3 px-4">
                {req.sourceRefs.length > 0 && (
                    <a
                        href={req.sourceRefs[0].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                        title={req.sourceRefs[0].citation}
                    >
                        View <ExternalLink className="h-3 w-3" />
                    </a>
                )}
            </td>
        </tr>
    );
}

export function CertificationMatrix({ certifications, labeling }: Props) {
    const allItems = [...certifications, ...labeling];
    if (allItems.length === 0) return null;

    return (
        <div>
            <div className="mb-4 flex items-center gap-2">
                <BookCheck className="h-5 w-5 text-teal-600" />
                <div>
                    <h2 className="text-lg font-bold text-slate-900">Standards & Certifications</h2>
                    <p className="text-sm text-slate-500">
                        Technical standards, testing, and labeling requirements.
                    </p>
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="py-2.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                Requirement
                            </th>
                            <th className="py-2.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                Type
                            </th>
                            <th className="py-2.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                Authority
                            </th>
                            <th className="py-2.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                Status
                            </th>
                            <th className="py-2.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                Source
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {allItems.map((req) => (
                            <CertRow key={req.requirementId} req={req} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
