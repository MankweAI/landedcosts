import { NextResponse } from "next/server";
import { z } from "zod";
import { getAllClusterHsMaps, getClusterById, getHsCodes } from "@/lib/data/repository";

const hsSuggestSchema = z.object({
  description: z.string().min(3)
});

function score(description: string, target: string) {
  const source = description.toLowerCase();
  const terms = target.toLowerCase().split(" ");
  const matchCount = terms.filter((term) => term.length > 2 && source.includes(term)).length;
  return Math.min(0.99, 0.35 + matchCount * 0.12);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = hsSuggestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const description = parsed.data.description;
  const hsCodes = getHsCodes();
  const clusterMaps = getAllClusterHsMaps();

  const suggestions = hsCodes
    .map((hs) => {
      const linkedClusters = clusterMaps.filter((map) => map.hs6 === hs.hs6);
      const clusterNames = linkedClusters
        .map((map) => getClusterById(map.clusterId)?.name)
        .filter((name): name is string => Boolean(name));
      const confidence =
        Math.max(score(description, hs.descriptionShort), ...linkedClusters.map((map) => map.confidence * 0.9));
      return {
        hs6: hs.hs6,
        label: hs.descriptionShort,
        confidence: Math.min(0.99, confidence),
        warnings:
          confidence < 0.6
            ? ["Low confidence. Add specification details and try again."]
            : [`Matched against ${clusterNames.join(", ") || "HS descriptions"}.`]
      };
    })
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5);

  return NextResponse.json({ suggestions }, { status: 200 });
}

