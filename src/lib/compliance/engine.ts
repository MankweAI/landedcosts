// ─── ImportOS: Deterministic Compliance Rules Engine ───
import type {
    ComplianceResult,
    LegalityDecision,
    ComplianceOutput,
    Restriction,
    Requirement,
    SourceRef,
    LegalityStatus,
} from "./types";

// ─── Rule Registrations ───
// Each vertical registers its static data here at import time.
import {
    restrictions as liBatRestrictions,
    requirements as liBatRequirements,
} from "./rules/za-lithium-batteries";

const ALL_RESTRICTIONS: Restriction[] = [...liBatRestrictions];
const ALL_REQUIREMENTS: Requirement[] = [...liBatRequirements];

// ─── Matching helpers ───

function matchesScope(
    appliesTo: { hs6: string | null; clusterId: string | null },
    hs6: string,
    clusterId?: string
): boolean {
    // HS6-level match is most specific; always wins.
    if (appliesTo.hs6 && appliesTo.hs6 === hs6) return true;
    // Cluster-level match is fallback.
    if (appliesTo.clusterId && clusterId && appliesTo.clusterId === clusterId) return true;
    return false;
}

// ─── Engine ───

/**
 * Evaluate compliance for a given HS6 + destination route.
 *
 * Evaluation order (per spec):
 *   1. Hard prohibitions
 *   2. Restrictions
 *   3. Permits
 *   4. Certifications / standards / testing / labeling / documentation
 *
 * If no data is found for the route, returns status = "unknown".
 */
export function evaluateCompliance(
    hs6: string,
    destination: string,
    clusterId?: string
): ComplianceResult {
    // 1 & 2. Find restrictions that apply
    const matchedRestrictions = ALL_RESTRICTIONS.filter(
        (r) => r.destination === destination && matchesScope(r.appliesTo, hs6, clusterId)
    );

    // 3 & 4. Find requirements that apply
    const matchedRequirements = ALL_REQUIREMENTS.filter(
        (r) => r.destination === destination && matchesScope(r.appliesTo, hs6, clusterId)
    );

    // ── Determine legality status ──
    const hasData = matchedRestrictions.length > 0 || matchedRequirements.length > 0;

    if (!hasData) {
        return unknownResult();
    }

    // Check for hard prohibition first
    const prohibited = matchedRestrictions.find((r) => r.status === "prohibited");
    if (prohibited) {
        return buildResult("prohibited", matchedRestrictions, matchedRequirements);
    }

    // Check for restriction
    const restricted = matchedRestrictions.find((r) => r.status === "restricted");
    if (restricted) {
        return buildResult("restricted", matchedRestrictions, matchedRequirements);
    }

    // All matched restrictions say "allowed"
    return buildResult("allowed", matchedRestrictions, matchedRequirements);
}

// ─── Result Builders ───

function unknownResult(): ComplianceResult {
    return {
        legality: {
            status: "unknown",
            summary: "No structured compliance data available for this route. This page is informational only.",
            restrictionReasons: [],
            sourceRefs: [],
        },
        compliance: emptyCompliance(),
    };
}

function buildResult(
    status: LegalityStatus,
    restrictions: Restriction[],
    requirements: Requirement[]
): ComplianceResult {
    // Collect all source refs for legality
    const allSourceRefs: SourceRef[] = restrictions.flatMap((r) => r.sourceRefs);

    // Build summary
    const summary = buildSummary(status, restrictions);

    // Partition requirements by category
    const permits = requirements.filter((r) => r.category === "permit");
    const certifications = requirements.filter(
        (r) => r.category === "standard" || r.category === "testing" || r.category === "registration"
    );
    const inspections = requirements.filter((r) => r.category === "inspection");
    const labeling = requirements.filter(
        (r) => r.category === "labeling" || r.category === "documentation"
    );

    return {
        legality: {
            status,
            summary,
            restrictionReasons: restrictions.map((r) => r.reason),
            sourceRefs: allSourceRefs,
        },
        compliance: {
            permitsRequired: permits,
            certificationsRequired: certifications,
            inspectionsRequired: inspections,
            labelingRequired: labeling,
        },
    };
}

function buildSummary(status: LegalityStatus, restrictions: Restriction[]): string {
    switch (status) {
        case "prohibited":
            return `Import is PROHIBITED. ${restrictions[0]?.reason ?? ""}`;
        case "restricted":
            return `Import is ALLOWED subject to regulatory requirements. ${restrictions[0]?.reason ?? ""}`;
        case "allowed":
            return "Import is allowed with standard documentation.";
        default:
            return "No structured compliance data available.";
    }
}

function emptyCompliance(): ComplianceOutput {
    return {
        permitsRequired: [],
        certificationsRequired: [],
        inspectionsRequired: [],
        labelingRequired: [],
    };
}
