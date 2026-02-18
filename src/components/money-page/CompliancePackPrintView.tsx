"use client";

import type { ComplianceResult, Requirement, SourceRef } from "@/lib/compliance/types";
import type { CalcOutput } from "@/lib/calc/types";

type Props = {
    complianceResult: ComplianceResult;
    output: CalcOutput;
    headingLabel: string;
    origin: string;
    dest: string;
    generatedDate: string;
};

function SourceRefList({ refs }: { refs: SourceRef[] }) {
    if (refs.length === 0) return null;
    return (
        <ul style={{ fontSize: "10px", color: "#6b7280", paddingLeft: "16px", listStyleType: "disc" }}>
            {refs.map((ref, i) => (
                <li key={i} style={{ marginBottom: "2px" }}>
                    {ref.label} — <em>{ref.citation}</em>
                    {ref.url && (
                        <span style={{ marginLeft: "4px", color: "#3b82f6" }}>({ref.url})</span>
                    )}
                </li>
            ))}
        </ul>
    );
}

function RequirementRow({ req }: { req: Requirement }) {
    return (
        <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
            <td style={{ padding: "6px 8px", fontSize: "11px", fontWeight: 600 }}>{req.name}</td>
            <td style={{ padding: "6px 8px", fontSize: "11px", textTransform: "capitalize" }}>{req.category}</td>
            <td style={{ padding: "6px 8px", fontSize: "11px" }}>{req.authorityId.toUpperCase()}</td>
            <td style={{ padding: "6px 8px", fontSize: "11px" }}>
                {req.required ? (req.conditional ? "Conditional" : "Required") : "Optional"}
            </td>
            <td style={{ padding: "6px 8px", fontSize: "11px" }}>
                {req.leadTimeDays ? `${req.leadTimeDays} days` : "—"}
            </td>
        </tr>
    );
}

export function CompliancePackPrintView({
    complianceResult,
    output,
    headingLabel,
    origin,
    dest,
    generatedDate,
}: Props) {
    const allRequirements = [
        ...complianceResult.compliance.permitsRequired,
        ...complianceResult.compliance.certificationsRequired,
        ...complianceResult.compliance.inspectionsRequired,
        ...complianceResult.compliance.labelingRequired,
    ];

    const allSources = [
        ...complianceResult.legality.sourceRefs,
        ...allRequirements.flatMap((r) => r.sourceRefs),
    ];

    // Deduplicate sources by URL
    const uniqueSources = allSources.filter(
        (ref, i, arr) => arr.findIndex((r) => r.url === ref.url) === i
    );

    const statusColor =
        complianceResult.legality.status === "allowed"
            ? "#059669"
            : complianceResult.legality.status === "restricted"
                ? "#d97706"
                : complianceResult.legality.status === "prohibited"
                    ? "#dc2626"
                    : "#6b7280";

    return (
        <div
            id="compliance-pack-print"
            className="hidden print:block"
            style={{
                fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
                color: "#1e293b",
                maxWidth: "800px",
                margin: "0 auto",
                padding: "20px",
                fontSize: "12px",
                lineHeight: 1.5,
            }}
        >
            {/* Header */}
            <div
                style={{
                    borderBottom: "3px solid #1e293b",
                    paddingBottom: "16px",
                    marginBottom: "20px",
                }}
            >
                <h1 style={{ fontSize: "20px", fontWeight: 800, margin: 0 }}>
                    Import Compliance Pack
                </h1>
                <p style={{ fontSize: "14px", color: "#475569", marginTop: "4px" }}>
                    {headingLabel} — {origin} → {dest}
                </p>
                <p style={{ fontSize: "10px", color: "#94a3b8", marginTop: "4px" }}>
                    Generated: {generatedDate} | ImportOS by LandedCostIntelligence
                </p>
            </div>

            {/* Section 1: Legality */}
            <div style={{ marginBottom: "24px" }}>
                <h2 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "8px" }}>
                    1. Legality Status
                </h2>
                <div
                    style={{
                        display: "inline-block",
                        padding: "4px 12px",
                        borderRadius: "4px",
                        backgroundColor: statusColor,
                        color: "white",
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                    }}
                >
                    {complianceResult.legality.status}
                </div>
                <p style={{ marginTop: "8px", fontSize: "12px", color: "#475569" }}>
                    {complianceResult.legality.summary}
                </p>
                <SourceRefList refs={complianceResult.legality.sourceRefs} />
            </div>

            {/* Section 2: Requirements Table */}
            {allRequirements.length > 0 && (
                <div style={{ marginBottom: "24px" }}>
                    <h2 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "8px" }}>
                        2. Compliance Requirements ({allRequirements.length})
                    </h2>
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            border: "1px solid #e5e7eb",
                            fontSize: "11px",
                        }}
                    >
                        <thead>
                            <tr style={{ backgroundColor: "#f8fafc" }}>
                                <th style={{ padding: "6px 8px", textAlign: "left", fontWeight: 600, borderBottom: "2px solid #e5e7eb" }}>
                                    Requirement
                                </th>
                                <th style={{ padding: "6px 8px", textAlign: "left", fontWeight: 600, borderBottom: "2px solid #e5e7eb" }}>
                                    Type
                                </th>
                                <th style={{ padding: "6px 8px", textAlign: "left", fontWeight: 600, borderBottom: "2px solid #e5e7eb" }}>
                                    Authority
                                </th>
                                <th style={{ padding: "6px 8px", textAlign: "left", fontWeight: 600, borderBottom: "2px solid #e5e7eb" }}>
                                    Status
                                </th>
                                <th style={{ padding: "6px 8px", textAlign: "left", fontWeight: 600, borderBottom: "2px solid #e5e7eb" }}>
                                    Lead Time
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {allRequirements.map((req) => (
                                <RequirementRow key={req.requirementId} req={req} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Section 3: Cost Summary */}
            <div style={{ marginBottom: "24px" }}>
                <h2 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "8px" }}>
                    3. Cost Summary
                </h2>
                <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #e5e7eb" }}>
                    <tbody>
                        {[
                            { label: "Import Duty", value: output.dutyAmountZar },
                            { label: "VAT", value: output.vatAmountZar },
                            { label: "Levies", value: output.levyAmountZar },
                            { label: "Total Taxes", value: output.totalTaxesZar },
                        ].map(({ label, value }) => (
                            <tr key={label} style={{ borderBottom: "1px solid #e5e7eb" }}>
                                <td style={{ padding: "6px 8px", fontSize: "11px" }}>{label}</td>
                                <td style={{ padding: "6px 8px", fontSize: "11px", textAlign: "right", fontWeight: 600 }}>
                                    R {value.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                                </td>
                            </tr>
                        ))}
                        <tr style={{ backgroundColor: "#f8fafc" }}>
                            <td style={{ padding: "8px", fontSize: "12px", fontWeight: 700 }}>Landed Cost Total</td>
                            <td style={{ padding: "8px", fontSize: "12px", fontWeight: 700, textAlign: "right" }}>
                                R {output.landedCostTotalZar.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Section 4: Sources */}
            {uniqueSources.length > 0 && (
                <div style={{ marginBottom: "24px" }}>
                    <h2 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "8px" }}>
                        4. Source References
                    </h2>
                    <ol style={{ fontSize: "10px", color: "#475569", paddingLeft: "16px" }}>
                        {uniqueSources.map((ref, i) => (
                            <li key={i} style={{ marginBottom: "4px" }}>
                                <strong>{ref.label}</strong>: {ref.citation}{" "}
                                <span style={{ color: "#3b82f6" }}>[{ref.url}]</span>
                            </li>
                        ))}
                    </ol>
                </div>
            )}

            {/* Disclaimer */}
            <div
                style={{
                    borderTop: "1px solid #e5e7eb",
                    paddingTop: "12px",
                    marginTop: "24px",
                    fontSize: "9px",
                    color: "#94a3b8",
                }}
            >
                <p>
                    <strong>Disclaimer:</strong> This report is for informational purposes only and does
                    not constitute legal, tax, or customs advice. Always verify requirements with the
                    relevant regulatory authority before importing goods. Data accuracy depends on the
                    sources cited above.
                </p>
            </div>
        </div>
    );
}
