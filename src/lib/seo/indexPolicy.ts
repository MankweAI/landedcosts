import type { IndexStatus } from "@/lib/data/types";

export const BLOCKER_IDS = [
  "NO_HS_CANDIDATES",
  "MISSING_TARIFF_RATE",
  "VAT_MODULE_FAILED",
  "NO_DOCS_BLOCK",
  "NO_RISK_BLOCK",
  "INSUFFICIENT_UNIQUE_BLOCKS",
  "INSUFFICIENT_INTERNAL_LINKS",
  "MISSING_FRESHNESS_METADATA",
  "MISSING_COMPUTED_EXAMPLES",
  "DUPLICATE_CANONICALIZED"
] as const;

export type BlockerId = (typeof BLOCKER_IDS)[number];

export type IndexPolicyInput = {
  hasHsCandidates: boolean;
  hasAnyTariffRate: boolean;
  vatModuleSucceeded: boolean;
  docsBlockPresent: boolean;
  riskBlockPresent: boolean;
  uniqueBlocksCount: number;
  internalLinksCount: number;
  freshnessMetadataPresent: boolean;
  hasComputedExampleOutputs: boolean;
  hasValidPrefill: boolean;
  hasBreakdownDutyAndVat: boolean;
  isDuplicateCanonicalized: boolean;
  wouldOutputContactBrokerWithoutNumbers: boolean;
};

export type IndexPolicyResult = {
  readinessScore: number;
  indexStatus: IndexStatus;
  blockers: BlockerId[];
};

export function evaluateIndexPolicy(input: IndexPolicyInput): IndexPolicyResult {
  const blockers: BlockerId[] = [];
  let score = 0;

  if (input.hasHsCandidates) score += 20;
  else blockers.push("NO_HS_CANDIDATES");

  if (input.hasAnyTariffRate) score += 25;
  else blockers.push("MISSING_TARIFF_RATE");

  if (input.vatModuleSucceeded) score += 15;
  else blockers.push("VAT_MODULE_FAILED");

  if (input.docsBlockPresent) score += 10;
  else blockers.push("NO_DOCS_BLOCK");

  if (input.riskBlockPresent) score += 10;
  else blockers.push("NO_RISK_BLOCK");

  if (input.uniqueBlocksCount >= 2) score += 10;
  else blockers.push("INSUFFICIENT_UNIQUE_BLOCKS");

  if (input.internalLinksCount >= 6) score += 5;
  else blockers.push("INSUFFICIENT_INTERNAL_LINKS");

  if (input.freshnessMetadataPresent) score += 5;
  else blockers.push("MISSING_FRESHNESS_METADATA");

  if (!input.hasComputedExampleOutputs) {
    blockers.push("MISSING_COMPUTED_EXAMPLES");
    score = 0;
  }

  if (input.isDuplicateCanonicalized) {
    blockers.push("DUPLICATE_CANONICALIZED");
  }

  const hardRules = [
    input.hasValidPrefill,
    input.hasBreakdownDutyAndVat,
    input.uniqueBlocksCount >= 2,
    input.internalLinksCount >= 6,
    input.freshnessMetadataPresent
  ].every(Boolean);

  const autoNoindex = [
    !input.hasHsCandidates,
    !input.hasAnyTariffRate,
    input.wouldOutputContactBrokerWithoutNumbers,
    input.isDuplicateCanonicalized
  ].some(Boolean);

  const indexStatus: IndexStatus =
    score >= 70 && input.hasComputedExampleOutputs && hardRules && !autoNoindex ? "INDEX" : "NOINDEX";

  return { readinessScore: score, indexStatus, blockers };
}

