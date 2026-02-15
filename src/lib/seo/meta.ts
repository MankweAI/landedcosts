import type { Metadata } from "next";
import type { IndexStatus } from "@/lib/data/types";

type MetaInput = {
  title: string;
  description: string;
  canonicalPath: string;
  indexStatus: IndexStatus;
};

function robotsFor(indexStatus: IndexStatus) {
  return indexStatus === "INDEX" ? "index,follow" : "noindex,follow";
}

export function buildSeoMetadata(input: MetaInput): Metadata {
  return {
    title: input.title,
    description: input.description,
    alternates: {
      canonical: input.canonicalPath
    },
    robots: robotsFor(input.indexStatus)
  };
}

export function getRobotsValue(indexStatus: IndexStatus) {
  return robotsFor(indexStatus);
}

