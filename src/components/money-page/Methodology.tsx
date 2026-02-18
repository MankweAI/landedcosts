import { Calculator, Scale, FileText, Anchor, Truck } from "lucide-react";

export function Methodology() {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900">Calculation Methodology</h2>
                <p className="mt-2 text-sm text-slate-600">
                    Our engine follows a strict waterfall model to ensure every cent is accounted for.
                    Here is exactly how we calculate your landed cost.
                </p>
            </div>

            <div className="relative border-l-2 border-slate-100 pl-8 space-y-8">
                {/* Step 1: Customs Value */}
                <div className="relative">
                    <div className="absolute -left-[41px] flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 ring-4 ring-white">
                        <span className="text-xs font-bold text-blue-600">1</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                        <Scale className="h-4 w-4 text-slate-400" />
                        Customs Value (VFD)
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                        The valuation basis for all duties. derived from your <strong>FOB Invoice Value</strong> plus international
                        freight and insurance (if not already included).
                    </p>
                    <div className="mt-2 text-xs font-mono bg-slate-50 border border-slate-200 p-2 rounded text-slate-500">
                        VFD = Goods Value + Freight + Insurance
                    </div>
                </div>

                {/* Step 2: Duty */}
                <div className="relative">
                    <div className="absolute -left-[41px] flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 ring-4 ring-white">
                        <span className="text-xs font-bold text-indigo-600">2</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-slate-400" />
                        Import Duty (Customs Duty)
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                        Calculated as a percentage of the Customs Value, based on the HS Code (8507.60 for Lithium Batteries).
                        We use the <strong>General Rate</strong> unless a Preferential Rate (EU, SADC, etc.) applies.
                    </p>
                    <div className="mt-2 text-xs font-mono bg-slate-50 border border-slate-200 p-2 rounded text-slate-500">
                        Duty = VFD × Duty Rate
                    </div>
                </div>

                {/* Step 3: VAT */}
                <div className="relative">
                    <div className="absolute -left-[41px] flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 ring-4 ring-white">
                        <span className="text-xs font-bold text-purple-600">3</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                        <Calculator className="h-4 w-4 text-slate-400" />
                        Import VAT
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                        South Africa charges 15% VAT on the &quot;Added Tax Value&quot; (ATV). The ATV includes a standard 10% uplift on the Customs Value, plus any duties and levies. Service fees are also subject to VAT.
                    </p>
                    <div className="mt-2 text-xs font-mono bg-slate-50 border border-slate-200 p-2 rounded text-slate-500">
                        ATV = (VFD × 1.1) + Duty + Levies<br />
                        VAT = (ATV + Services) × 15%
                    </div>
                </div>

                {/* Step 4: Local Charges */}
                <div className="relative">
                    <div className="absolute -left-[41px] flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 ring-4 ring-white">
                        <span className="text-xs font-bold text-emerald-600">4</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                        <Truck className="h-4 w-4 text-slate-400" />
                        Landed Charges
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                        The final layer includes Port Authorities (Transnet) charges, Cargo Dues, and Clearing Agency fees.
                        These are estimated based on shipment mode (LCL/FCL/Air).
                    </p>
                </div>
            </div>

            <div className="mt-8 border-t border-slate-100 pt-6">
                <p className="text-xs text-slate-400 flex items-center gap-2">
                    <Anchor className="h-3 w-3" />
                    Sources: Customs and Excise Act 91 of 1964, SARS Tariff Book (Schedule 1).
                </p>
            </div>
        </div>
    );
}
