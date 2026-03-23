import { DocumentType } from "@/redux/types/states/Document Type";

export const BirthCertificate: DocumentType = {
    id: "ExtraDocs-Birth-Certificate",
    name: "Birth Certificate",
    description:
        "A certified translation of a Moroccan birth certificate (Extrait d'Acte de Naissance), issued by the Interior Ministry.",
    tags: ["Regular"],
    state: "Available",
    templateId: "1aqtqLEQ54UQ2uCOqqSGD5fpC9npjlgVy0QpA_6sZZcQ",
    fields: [
        {
            name: "Birth Certificate No.",
            type: "text",
            description: "Registration number of the birth certificate (Acte N°)",
            required: true,
            example: `"173/", "245/", etc.`,
        },
        {
            name: "Register Year",
            type: "text",
            description: "Gregorian year of registration",
            required: true,
            example: `"2008", "2001", etc.`,
        },
        {
            name: "First Name",
            type: "text",
            description: "First name (Prénom) of the person on the certificate",
            required: true,
            example: `"Kaoutar", "Youssef", etc.`,
        },
        {
            name: "Last Name",
            type: "text",
            description: "Family name (Nom) of the person on the certificate",
            required: true,
            example: `"Hichmine", "El Alami", etc.`,
        },
        {
            name: "Date of birth",
            type: "text",
            description: "Date of birth written in words in Arabic / French (Hijri calendar)",
            required: true,
            example: `"Cinq Chaoual mille quatre cent vingt neuf", etc.`,
        },
        {
            name: "Place of birth",
            type: "text",
            description: "Place of birth (Lieu de Naissance)",
            required: true,
            example: `"Douar Tourtoute Commune Ait Seghrouchen", "Casablanca", etc.`,
        },
        {
            name: "Hijri date",
            type: "text",
            description: "Hijri (Islamic calendar) date corresponding to the date of birth",
            required: true,
            example: `"1429 Hég", "1402 Hég", etc.`,
        },
        {
            name: "Gender",
            type: "text",
            description: "Gender of the person (de Sexe)",
            required: true,
            example: `"Male", "Female"`,
        },
        {
            name: "Father's Name",
            type: "text",
            description: "Full name of the father (Fils/Fille de)",
            required: true,
            example: `"Driss Fils de Belkacem", "Mohamed Ben Ahmed", etc.`,
        },
        {
            name: "Mother's Name",
            type: "text",
            description: "Full name of the mother (Et de)",
            required: true,
            example: `"Hassania Fille de Ali Lamaalem", "Fatima Bint Omar", etc.`,
        },
        {
            name: "City of issue",
            type: "text",
            description: "City where the certificate was issued",
            required: true,
            example: `"Taza", "Rabat", "Fes", etc.`,
        },
        {
            name: "Date of issue",
            type: "text",
            description: "Date the certificate was officially issued",
            required: true,
            example: `"17/09/2025", "01/03/2024", etc.`,
        },
    ],
};

export default BirthCertificate;
