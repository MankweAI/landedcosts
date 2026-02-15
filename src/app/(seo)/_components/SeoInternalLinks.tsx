import type { InternalLink } from "@/lib/seo/internalLinks";
import { InternalLinkGrid } from "@/components/money-page/InternalLinkGrid";

export function SeoInternalLinks({ links }: { links: InternalLink[] }) {
  return <InternalLinkGrid links={links} />;
}

