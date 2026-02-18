"use client";

import { AppShell } from "@/components/shell/AppShell";
import { Building2, MapPin, Globe, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    return (
        <AppShell title="About ImportOS">
            <div className="mx-auto max-w-3xl py-12">
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="flex items-start gap-6">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg">
                            <Building2 className="h-8 w-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Built by BigDataQuery</h2>
                            <p className="mt-2 text-lg text-slate-600 leading-relaxed">
                                ImportOS is a specialized trade intelligence tool developed by <strong>BigDataQuery</strong>,
                                a data analytics and software engineering firm dedicated to simplifying complex regulatory environments.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 grid gap-6 md:grid-cols-2">
                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <MapPin className="h-5 w-5 text-blue-600" />
                                <h3 className="font-semibold text-slate-900">Headquarters</h3>
                            </div>
                            <p className="text-sm text-slate-600">
                                Midrand, South Africa.<br />
                                Strategically positioned in the economic hub of Gauteng.
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <Globe className="h-5 w-5 text-blue-600" />
                                <h3 className="font-semibold text-slate-900">Corporate Presence</h3>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">
                                For more information on our enterprise services:
                            </p>
                            <a href="http://www.bigdataquery.co.za" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1">
                                www.bigdataquery.co.za &rarr;
                            </a>
                        </div>
                    </div>

                    <div className="mt-8 border-t border-slate-100 pt-8">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-emerald-600" />
                            Why Trust ImportOS?
                        </h3>
                        <div className="prose prose-slate prose-sm text-slate-600">
                            <p>
                                We combine expert knowledge of the <strong>Customs and Excise Act</strong> with rigorous data validation.
                                Every calculation is backed by weekly audits against the official SARS Tariff Book and Government Gazette amendments.
                            </p>
                            <p>
                                Unlike generic AI tools, our engine uses deterministic logic mapped directly to legal frameworks, ensuring decision-grade accuracy for South African importers.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
