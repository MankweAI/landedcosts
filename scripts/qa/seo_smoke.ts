import { runBuildPass } from "../../src/lib/seo/buildPass";

const pages = runBuildPass();
const indexed = pages.filter((page) => page.indexStatus === "INDEX");
const noindex = pages.filter((page) => page.indexStatus === "NOINDEX");

const noindexInSitemap = noindex.filter((page) => indexed.some((indexPage) => indexPage.slug === page.slug));
if (noindexInSitemap.length > 0) {
  throw new Error(`NOINDEX pages leaked to sitemap candidates: ${noindexInSitemap.map((page) => page.slug).join(", ")}`);
}

const missingCanonicals = indexed.filter((page) => !page.canonicalSlug);
if (missingCanonicals.length > 0) {
  throw new Error(`INDEX pages missing canonical: ${missingCanonicals.map((page) => page.slug).join(", ")}`);
}

const missingPresets = indexed.filter((page) => page.presets.length !== 3);
if (missingPresets.length > 0) {
  throw new Error(`INDEX pages missing 3 computed presets: ${missingPresets.map((page) => page.slug).join(", ")}`);
}

console.info(`SEO smoke passed. INDEX=${indexed.length}, NOINDEX=${noindex.length}`);

