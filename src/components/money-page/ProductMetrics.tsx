import type { ProductDefinition } from "@/lib/products/types";
import type { CalcOutput } from "@/lib/calc/types";
import { formatCurrencyZar } from "@/lib/format";
import { Zap } from "lucide-react";

type ProductMetricsProps = {
    module: ProductDefinition;
    output: CalcOutput;
    inputs: Record<string, any>;
};

export function ProductMetrics({ module, output, inputs }: ProductMetricsProps) {
    if (!module.metrics || module.metrics.length === 0) return null;

    return (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <Zap className="text-blue-600" size={20} />
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-500">Efficiency</p>
                    <h3 className="text-sm font-bold text-blue-900">{module.name} Specs</h3>
                </div>
            </div>

            <div className="space-y-4">
                {module.metrics.map((metric) => {
                    const value = metric.calculate(output, inputs);

                    let displayValue = String(value);
                    if (metric.format === "currency") {
                        displayValue = formatCurrencyZar(value);
                    } else if (metric.format === "percent") {
                        displayValue = `${value.toFixed(1)}%`;
                    } else {
                        displayValue = value.toFixed(2);
                    }

                    return (
                        <div key={metric.id} className="flex flex-col border-t border-blue-100/50 pt-2 first:pt-0 first:border-0">
                            <span className="text-xs text-blue-700 mb-0.5">{metric.label}</span>
                            <span className="text-2xl font-extrabold text-blue-900">{displayValue}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
