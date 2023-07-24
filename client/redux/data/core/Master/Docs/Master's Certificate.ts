import { DocumentType } from "@/redux/data/Documents";

export const MasterCertificate: DocumentType = {
    id: "Master-Certificate",
    name: "Master Certificate",
    description: "Master Certificate is a document that certifies that the candidate has successfully completed his studies at a particular institute and has obtained a Master's degree.",
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
            description: "Name of the Certificate, e.g: Master's Certificate, Licence Certificate, etc.",
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

export default MasterCertificate;