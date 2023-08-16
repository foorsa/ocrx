import {
    DocumentType,
    DocumentsGroupType,
} from "@/redux/types/states/Document Type";

export const BachelorCertificate: DocumentType = {
    id: "Bachelor-Certificate",
    name: "Bachelor Certificate",
    description: "A Bachelor's Certificate is a formal document that serves as tangible proof of the successful completion of an undergraduate program at a recognized educational institution. This certificate is a testament to the recipient's academic dedication, competence, and commitment to their chosen field of study.",
    "tags": ["Regular"],
    state: "Available",
    templateId: "1gBQowrWKrdR98okjfY8s7rRL3vteY64f6sM3Wx8TzR8",
    fields: [
        {
            name: "University Name",
            type: "text",
            description: "University Name (required)",
            required: true,

            example: "Al Kadi Eiyad, Hassan II, Mohammed V, etc.",
        },
        {
            name: "University City",
            type: "text",
            description: "University City Name",
            required: true,

            example: "Fes, Rabat, Casablanca, etc.",
        },
        {
            name: "Faculty Name",
            type: "text",
            description: "Faculty of the Candidate",
            required: true,

            example: "Al Kadi Eiyad, Hassan II, Mohammed V, etc."
        },
        {
            name: "Faculty City",
            type: "text",
            description: "Faculty of the Candidate",
            required: true,

            example: "Fes, Rabat, Casablanca, etc.",
        },
        {
            name: "Certificate Name",
            type: "text",
            description: "Name of the Certificate, e.g: Bachelor's Certificate, Licence Certificate, etc.",
            required: true,

        },
        {
            name: "Student Name",
            type: "text",
            description: "Student's Full Name",
            required: true,

        },
        {
            name: "Date of birth",
            type: "text",
            description: "Student's Date of Birth",
            required: true,

        },
        {
            name: "City of birth",
            type: "text",
            description: "Student's City of Birth",
            required: true,

        },
        {
            name: "National Identity Card Number",
            type: "text",
            description: "CIN of the Student, e.g: J123456, etc.",
            required: true,

            example: "AS19956, AE34355, EL34432, etc.",
        },
        {
            name: "Student National Code",
            type: "text",
            description: "CNE of the Student, e.g: J1234567890, etc.",
            required: true,

            example: "A199567890, A343556789, E344327890, etc.",
        },
        {
            name: "Department",
            type: "text",
            description: "Departement of the Candidate",
            required: true,

            example: "Computer Science, Mathematics, Physics, etc.",
        },
        {
            name: "Option",
            type: "text",
            description: "Option of the Candidate",
            required: true,

            example: "Computer Science, Mathematics, Physics, etc.",
        },
        {
            name: "Mention",
            type: "text",
            description: "Mention of the Candidate",
            required: true,

            example: "Very Good, Good, Good Enough, etc.",
        },
        {
            name: "City of Issue",
            type: "text",
            description: "City of Issue of the Certificate.",
            required: true,

        },
        {
            name: "Date of Issue",
            type: "text",
            description: "Date of Issue of the Certificate.",
            required: true,

        },
    ],
}