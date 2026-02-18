// ─── ImportOS: Static compliance data for Lithium Batteries → South Africa ───
import type { Authority, Restriction, Requirement } from "../types";

// ─── Authorities ───
export const authorities: Authority[] = [
    {
        authorityId: "nrcs",
        authoritySlug: "nrcs",
        name: "National Regulator for Compulsory Specifications",
        destination: "south-africa",
        domain: "nrcs.org.za",
        contactUrl: "https://www.nrcs.org.za/contact",
    },
    {
        authorityId: "itac",
        authoritySlug: "itac",
        name: "International Trade Administration Commission",
        destination: "south-africa",
        domain: "itac.org.za",
        contactUrl: "https://www.itac.org.za/pages/services/import-and-export-control",
    },
    {
        authorityId: "sabs",
        authoritySlug: "sabs",
        name: "South African Bureau of Standards",
        destination: "south-africa",
        domain: "sabs.co.za",
        contactUrl: "https://www.sabs.co.za",
    },
    {
        authorityId: "dot-un",
        authoritySlug: "dot-un",
        name: "UN Dangerous Goods / IATA DGR",
        destination: "south-africa",
        domain: "unece.org",
        contactUrl: null,
    },
];

// ─── Restrictions ───
export const restrictions: Restriction[] = [
    {
        restrictionId: "li-bat-restricted-za",
        destination: "south-africa",
        appliesTo: { hs6: "850760", clusterId: "lithium-batteries" },
        status: "restricted",
        reason:
            "Lithium-ion batteries are permitted for import into South Africa but are subject to NRCS compulsory specifications, transport regulations (Class 9 Dangerous Goods), and may require an ITAC import permit depending on end-use.",
        sourceRefs: [
            {
                label: "NRCS Compulsory Specifications",
                url: "https://www.nrcs.org.za/siteimgs/VC-Notices/VC8101.pdf",
                citation: "Government Gazette VC 8101 – Compulsory Specification for cells and batteries containing alkaline or other non-acid electrolytes",
                page: null,
            },
            {
                label: "ITAC Import Control Guidelines",
                url: "https://www.itac.org.za/pages/services/import-and-export-control",
                citation: "Import and Export Control Act, 1963 (Act 45 of 1963)",
                page: null,
            },
        ],
    },
];

// ─── Requirements ───
export const requirements: Requirement[] = [
    {
        requirementId: "nrcs-loa-li-bat",
        destination: "south-africa",
        appliesTo: { hs6: "850760", clusterId: "lithium-batteries" },
        authorityId: "nrcs",
        category: "registration",
        name: "NRCS Letter of Authority (LOA)",
        required: true,
        conditional: false,
        conditions: null,
        leadTimeDays: 30,
        sourceRefs: [
            {
                label: "NRCS LOA Application Process",
                url: "https://www.nrcs.org.za/content/letterofauthority",
                citation: "NRCS – Application for Letter of Authority for regulated products",
                page: null,
            },
        ],
    },
    {
        requirementId: "un38-3-testing",
        destination: "south-africa",
        appliesTo: { hs6: "850760", clusterId: "lithium-batteries" },
        authorityId: "dot-un",
        category: "testing",
        name: "UN 38.3 Test Summary Report",
        required: true,
        conditional: false,
        conditions: null,
        leadTimeDays: null,
        sourceRefs: [
            {
                label: "UN Manual of Tests and Criteria",
                url: "https://unece.org/transportdangerous-goods/un-manual-tests-and-criteria",
                citation: "UN Manual of Tests and Criteria, Section 38.3 – Lithium batteries",
                page: "38.3",
            },
        ],
    },
    {
        requirementId: "msds-li-bat",
        destination: "south-africa",
        appliesTo: { hs6: "850760", clusterId: "lithium-batteries" },
        authorityId: "dot-un",
        category: "documentation",
        name: "Material Safety Data Sheet (MSDS/SDS)",
        required: true,
        conditional: false,
        conditions: null,
        leadTimeDays: null,
        sourceRefs: [
            {
                label: "IATA DGR Packing Instructions",
                url: "https://www.iata.org/en/programs/cargo/dgr/",
                citation: "IATA Dangerous Goods Regulations – Packing Instruction 965/966/967",
                page: null,
            },
        ],
    },
    {
        requirementId: "sans-62133-cert",
        destination: "south-africa",
        appliesTo: { hs6: "850760", clusterId: "lithium-batteries" },
        authorityId: "sabs",
        category: "standard",
        name: "SANS 62133 / IEC 62133 Compliance",
        required: true,
        conditional: false,
        conditions: null,
        leadTimeDays: null,
        sourceRefs: [
            {
                label: "SABS Standards Catalogue",
                url: "https://store.sabs.co.za",
                citation: "SANS 62133: Safety of portable sealed secondary cells/batteries",
                page: null,
            },
        ],
    },
    {
        requirementId: "itac-permit-li-bat",
        destination: "south-africa",
        appliesTo: { hs6: "850760", clusterId: "lithium-batteries" },
        authorityId: "itac",
        category: "permit",
        name: "ITAC Import Permit",
        required: false,
        conditional: true,
        conditions: "Required if importing for resale or if shipment exceeds commercial quantities. May be waived for personal-use consignments under de minimis thresholds.",
        leadTimeDays: 45,
        sourceRefs: [
            {
                label: "ITAC Import Permit Requirements",
                url: "https://www.itac.org.za/pages/services/import-and-export-control",
                citation: "Import Control Regulations – Schedule 1, Part 1",
                page: null,
            },
        ],
    },
    {
        requirementId: "dg-class9-labeling",
        destination: "south-africa",
        appliesTo: { hs6: "850760", clusterId: "lithium-batteries" },
        authorityId: "dot-un",
        category: "labeling",
        name: "Class 9 Dangerous Goods Labels & Marks",
        required: true,
        conditional: false,
        conditions: null,
        leadTimeDays: null,
        sourceRefs: [
            {
                label: "UN Dangerous Goods Labels",
                url: "https://unece.org/transportdangerous-goods/ghs-pictograms",
                citation: "UN Model Regulations – Marking and labelling for Class 9 lithium batteries",
                page: null,
            },
        ],
    },
];
