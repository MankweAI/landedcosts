// ─── ImportOS: Compliance Entity Types ───
// Deterministic rules engine – no generative inference.

/** A regulatory body that governs import requirements for a destination. */
export interface Authority {
    authorityId: string;
    authoritySlug: string;
    name: string;
    destination: string;
    domain: string;
    contactUrl: string | null;
}

/** Traceable citation for every compliance output. */
export interface SourceRef {
    label: string;
    url: string;
    citation: string;
    page: string | null;
}

/** Import restriction or prohibition for an HS6/cluster + destination. */
export interface Restriction {
    restrictionId: string;
    destination: string;
    appliesTo: {
        hs6: string | null;
        clusterId: string | null;
    };
    status: "allowed" | "restricted" | "prohibited";
    reason: string;
    sourceRefs: SourceRef[];
}

/** Regulatory category for a requirement. */
export type RequirementCategory =
    | "permit"
    | "registration"
    | "inspection"
    | "standard"
    | "testing"
    | "labeling"
    | "documentation";

/** A specific permit, certification, or compliance requirement. */
export interface Requirement {
    requirementId: string;
    destination: string;
    appliesTo: {
        hs6: string | null;
        clusterId: string | null;
    };
    authorityId: string;
    category: RequirementCategory;
    name: string;
    required: boolean;
    conditional: boolean;
    conditions: string | null;
    leadTimeDays: number | null;
    sourceRefs: SourceRef[];
}

// ─── Output Contracts ───

export type LegalityStatus = "allowed" | "restricted" | "prohibited" | "unknown";

/** The top-level legality verdict for a route. */
export interface LegalityDecision {
    status: LegalityStatus;
    summary: string;
    restrictionReasons: string[];
    sourceRefs: SourceRef[];
}

/** Structured compliance checklist grouped by category. */
export interface ComplianceOutput {
    permitsRequired: Requirement[];
    certificationsRequired: Requirement[];
    inspectionsRequired: Requirement[];
    labelingRequired: Requirement[];
}

/** Combined result from the compliance engine. */
export interface ComplianceResult {
    legality: LegalityDecision;
    compliance: ComplianceOutput;
}
