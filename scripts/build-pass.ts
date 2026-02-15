import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { runBuildPass } from "../src/lib/seo/buildPass";

const pages = runBuildPass();
const outputDir = join(process.cwd(), "src", "generated");
mkdirSync(outputDir, { recursive: true });
const outputPath = join(outputDir, "page-index.json");

writeFileSync(
  outputPath,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      totals: {
        total: pages.length,
        index: pages.filter((page) => page.indexStatus === "INDEX").length,
        noindex: pages.filter((page) => page.indexStatus === "NOINDEX").length
      },
      pages
    },
    null,
    2
  ),
  "utf8"
);

console.info(`Build pass complete: ${outputPath}`);

