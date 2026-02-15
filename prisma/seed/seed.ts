import { PrismaClient } from "@prisma/client";
import {
  clusterHsMaps,
  countries,
  docsRequirements,
  productClusters,
  riskRules,
  tariffRates,
  tariffVersion
} from "../../src/lib/data/fixtures";
import { runBuildPass } from "../../src/lib/seo/buildPass";

const prisma = new PrismaClient();

async function seed() {
  for (const country of countries) {
    await prisma.country.upsert({
      where: { id: country.id },
      update: country,
      create: country
    });
  }

  for (const cluster of productClusters) {
    await prisma.productCluster.upsert({
      where: { id: cluster.id },
      update: cluster,
      create: cluster
    });
  }

  for (const map of clusterHsMaps) {
    await prisma.clusterHsMap.upsert({
      where: {
        clusterId_hs6: {
          clusterId: map.clusterId,
          hs6: map.hs6
        }
      },
      update: map,
      create: map
    });
  }

  await prisma.tariffVersion.upsert({
    where: { id: tariffVersion.id },
    update: tariffVersion,
    create: tariffVersion
  });

  for (const rate of tariffRates) {
    await prisma.tariffRate.upsert({
      where: {
        tariffVersionId_hs6_originSlug_destSlug: {
          tariffVersionId: rate.tariffVersionId,
          hs6: rate.hs6,
          originSlug: rate.originSlug,
          destSlug: rate.destSlug
        }
      },
      update: {
        ...rate,
        leviesJson: rate.levies ?? undefined
      },
      create: {
        ...rate,
        leviesJson: rate.levies ?? undefined
      }
    });
  }

  for (const doc of docsRequirements) {
    await prisma.docsRequirement.upsert({
      where: { id: doc.id },
      update: doc,
      create: doc
    });
  }

  for (const risk of riskRules) {
    await prisma.riskRule.upsert({
      where: { id: risk.id },
      update: risk,
      create: risk
    });
  }

  const builtPages = runBuildPass();
  for (const page of builtPages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {
        type: page.type,
        origin: page.origin,
        dest: page.dest,
        indexStatus: page.indexStatus,
        canonicalSlug: page.canonicalSlug,
        duplicateOfSlug: page.duplicateOfSlug ?? null,
        readinessScore: page.readinessScore,
        hasComputedExampleOutputs: page.hasComputedExampleOutputs,
        blockers: page.blockers,
        lastBuiltAt: new Date(page.lastBuiltAt),
        lastIndexStatusChangeAt: new Date(page.lastIndexStatusChangeAt)
      },
      create: {
        slug: page.slug,
        type: page.type,
        origin: page.origin,
        dest: page.dest,
        indexStatus: page.indexStatus,
        canonicalSlug: page.canonicalSlug,
        duplicateOfSlug: page.duplicateOfSlug ?? null,
        readinessScore: page.readinessScore,
        hasComputedExampleOutputs: page.hasComputedExampleOutputs,
        blockers: page.blockers,
        lastBuiltAt: new Date(page.lastBuiltAt),
        lastIndexStatusChangeAt: new Date(page.lastIndexStatusChangeAt)
      }
    });
  }
}

seed()
  .then(async () => {
    await prisma.$disconnect();
    console.info("Seed complete");
  })
  .catch(async (error) => {
    console.error("Seed failed", error);
    await prisma.$disconnect();
    process.exit(1);
  });

