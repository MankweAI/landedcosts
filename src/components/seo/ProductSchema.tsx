
import type { ProductDefinition } from "@/lib/products/types";

type ProductSchemaProps = {
    module: ProductDefinition;
    origin: string;
    dest: string;
};

export function ProductSchema({ module, origin, dest }: ProductSchemaProps) {
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

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
