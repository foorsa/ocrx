import { DocumentType } from "@/redux/types/states/Document Type";

export const DeathCertificate: DocumentType = {
    id: "ExtraDocs-Death-Certificate",
    name: "Death Certificate",
    description:
        "A certified translation of a Moroccan death certificate (Extrait d'Acte de Décès), issued by the Interior Ministry.",
    tags: ["Regular"],
    state: "Available",
    templateId: "1IYNkZ7Cuw0fG44wWnKryjtO17jJEBocihClsv3Yrfrg",
    fields: [
        {
            name: "Death certificate number",
            type: "text",
            description: "Registration number of the death certificate",
            required: true,
            example: `"45/", "128/", etc.`,
        },
        {
            name: "First Name",
            type: "text",
            description: "First name of the deceased",
            required: true,
            example: `"Mohamed", "Fatima", etc.`,
        },
        {
            name: "Last Name",
            type: "text",
            description: "Family name of the deceased",
            required: true,
            example: `"El Alami", "Benali", etc.`,
        },
        {
            name: "Father's Name",
            type: "text",
            description: "Full name of the deceased's father",
            required: true,
            example: `"Ahmed Ben Hassan", "Omar Fils de Youssef", etc.`,
        },
        {
            name: "Mother's Name",
            type: "text",
            description: "Full name of the deceased's mother",
            required: true,
            example: `"Khadija Bint Ali", "Fatima Fille de Driss", etc.`,
        },
        {
            name: "Place of death",
            type: "text",
            description: "Place / city where the person passed away",
            required: true,
            example: `"Casablanca", "Rabat", "Douar Ait Said", etc.`,
        },
        {
            name: "Date of death (Hijri)",
            type: "text",
            description: "Date of death in the Hijri (Islamic) calendar, written in words",
            required: true,
            example: `"Khamsa wa Ishrin min Ramadan 1443", etc.`,
        },
        {
            name: "Date of death (Gregorian)",
            type: "text",
            description: "Date of death in the Gregorian calendar",
            required: true,
            example: `"27/04/2022", "15/09/2019", etc.`,
        },
        {
            name: "City of issue",
            type: "text",
            description: "City where the death certificate was issued",
            required: true,
            example: `"Casablanca", "Rabat", "Fes", etc.`,
        },
        {
            name: "Date of issue",
            type: "text",
            description: "Date the death certificate was officially issued",
            required: true,
            example: `"01/03/2024", "15/07/2023", etc.`,
        },
    ],
};

export default DeathCertificate;
