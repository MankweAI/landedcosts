import { createHash } from "node:crypto";

const MAX_SLUG_LENGTH = 60;
const RESERVED = new Set(["hs"]);

function stableSuffix(input: string): string {
  return createHash("sha1").update(input).digest("hex").slice(0, 6);
}

export function slugifyClusterName(raw: string): string {
  const normalized = raw
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  let base = normalized || "item";
  if (base.length > MAX_SLUG_LENGTH) {
    const suffix = stableSuffix(base);
    base = `${base.slice(0, MAX_SLUG_LENGTH - 7)}-${suffix}`;
  }
  if (RESERVED.has(base)) {
    base = `${base}-${stableSuffix(raw).slice(0, 4)}`;
  }
  return base;
}

export function validateHs6(hs6: string): boolean {
  return /^[0-9]{6}$/.test(hs6);
}

export function validateDestinationSlug(destIso: string): boolean {
  return destIso === "south-africa";
}

