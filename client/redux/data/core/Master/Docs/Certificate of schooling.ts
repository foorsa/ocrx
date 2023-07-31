import {
    DocumentType,
    DocumentsGroupType,
} from "@/redux/types/states/Document Type";

export const CertificateOfSchooling: DocumentType = {
    id: "Certificate-of-schooling",
    name: "Certificate of schooling",
    description: "Certificate of schooling is a document that contains the schooling data of the candidate.",
    "tags": ["Regular"],
    state: "Available",
    templateId: "1tWVsD9xKxVLYlM4FwnsHsIkEyVLPj0X_hcyqitvFhHM",
    fields: [
        {
            name: "Province",
            type: "text",
            description: "Name of the Provincial Leadership",
            required: true,

        },
        {
            name: "Serial Number",
            type: "text",
            description: "Serial Number of the Certificate, e.g: 123456, etc.",
            required: true,

        },
        {
            name: "Student Name",
            type: "text",
            description: "Student's Full Name",
            required: true,

        },
        {
            name: "University",
            type: "text",
            description: "University of the Candidate",
            required: true,

        },

        {
            name: "City of birth",
            type: "text",
            description: "Student's  City of Birth",
            required: true,

        },
        {
            name: "Date of birth",
            type: "text",
            description: "Student's  Date of Birth",
            required: true,

        },
        {
            name: "Sector Session",
            type: "text",
            description: "Sector Session of the Candidate, e.g: 2019, 2020, etc.",
            required: true,

        },
        {
            name: "Sector Year",
            type: "text",
            description: "Sector Year of the Candidate, e.g: Third Year, Second Year, etc.",
            required: true,

        },
        {
            name: "Sector Name",
            type: "text",
            description: "Sector Name of the Candidate, e.g: Computer Science, etc.",
            required: true,

        },
        {
            name: "Certificate Due Date",
            type: "text",
            description: "Certificate Date, e.g: 2019, etc.",
            required: true,

        },
        {
            name: "Certificate Due City",
            type: "text",
            description: "Certificate City, e.g: Rabat, etc.",
            required: true,

        },
    ]
} 