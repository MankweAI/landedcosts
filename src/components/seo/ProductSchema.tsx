
import type { ProductDefinition } from "@/lib/products/types";

type ProductSchemaProps = {
    module: ProductDefinition;
    origin: string;
    dest: string;
    faqs?: { question: string; answer: string }[];
    template?: "product" | "hs";
    clusterSlug?: string;
    hs6?: string;
};

export function ProductSchema({ module, origin, dest, faqs, template, clusterSlug, hs6 }: ProductSchemaProps) {
    // Construct a "SoftwareApplication" or "WebApplication" schema, 
    // tailored to the specific calculator functionality.
    // Alternatively, "Product" schema if we are describing the *commodity* itself, 
    // but we are a tool. Let's start with WebApplication with featureList.

    const schema = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": `Import Duty Calculator for ${module.name}`,
        "description": `Calculate landed cost for ${module.name} from ${origin} to ${dest}, including duty, VAT, and ${module.id} specific adjustments.`,
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "ZAR"
        },
        "featureList": [
            ...module.fields.map(f => `Calculate based on ${f.label}`),
            ...module.metrics.map(m => `Output ${m.label}`)
        ]
    };

    const faqSchema = faqs ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(f => ({
            "@type": "Question",
            "name": f.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": f.answer
            }
        }))
    } : null;

    const items = [
        {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.landedcostintelligence.com"
        }
    ];

    if (clusterSlug) {
        items.push({
            "@type": "ListItem",
            "position": items.length + 1,
            "name": module.name, // Cluster Name
            "item": `https://www.landedcostintelligence.com/import-duty-vat-landed-cost/${clusterSlug}/from/${origin}/to/${dest}`
        });
    }

    if (template === 'hs' && hs6) {
        items.push({
            "@type": "ListItem",
            "position": items.length + 1,
            "name": `HS ${hs6}`,
            "item": `https://www.landedcostintelligence.com/import-duty-vat-landed-cost/hs/${hs6}/from/${origin}/to/${dest}`
        });
    }

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
            {faqSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
        </>
    );
}
