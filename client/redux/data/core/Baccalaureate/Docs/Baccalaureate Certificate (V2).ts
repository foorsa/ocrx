import { DocumentType } from "@/redux/types/states/Document Type";

export const BaccalaureateCertificateV2: DocumentType = {
    id: "Baccalaureate-Certificate-V2",
    name: "Baccalaureate Certificate (V2)",
    description:
        "Updated version of the Baccalaureate Certificate template, including the candidate's ID card number and the jury deliberation date.",
    tags: ["Regular"],
    state: "Available",
    templateId: "1kJMRbEAy3c3x0sPuV5kSb9rebgs-ULjV08uj8ow3xlc",
    fields: [
        {
            name: "Province",
            type: "text",
            description: "Name of the Provincial / Regional Academy of Education and Training",
            required: true,
            example: `"Rabat", "Casablanca-Settat", "Fes-Meknes", etc.`,
        },
        {
            name: "Serial Number",
            type: "text",
            description: "Serial number of the Baccalaureate Certificate",
            required: true,
            example: `"C123456789", "K137260939", etc.`,
        },
        {
            name: "Student Name",
            type: "text",
            description: "Full name of the student",
            required: true,
            example: `"Mohamed Ali", "Yassine Chettouch", etc.`,
        },
        {
            name: "Date",
            type: "text",
            description: "Date of the jury's deliberation",
            required: true,
            example: `"12/07/2023", "15/06/2022", etc.`,
        },
        {
            name: "Id Card Number",
            type: "text",
            description: "National identity card number of the candidate",
            required: true,
            example: `"AB123456", "CD789012", etc.`,
        },
        {
            name: "Institute",
            type: "text",
            description: "Name of the high school / institute of the candidate",
            required: true,
            example: `"Mohamed V", "Hassan II", "Ibn Sina", etc.`,
        },
        {
            name: "Session",
            type: "text",
            description: "Session year and month of the baccalaureate exam",
            required: true,
            example: `"July 2023", "June 2022", etc.`,
        },
        {
            name: "Series",
            type: "text",
            description: "Branch / series of the baccalaureate",
            required: true,
            example: `"Economic Sciences", "Mathematics", "Life and Earth Sciences", etc.`,
        },
        {
            name: "Option",
            type: "text",
            description: "Specialty / option within the series",
            required: true,
            example: `"Economics and Management", "Physical Sciences", etc.`,
        },
        {
            name: "Grade",
            type: "text",
            description: "Mention / grade obtained by the candidate",
            required: true,
            example: `"Excellent", "Very Good", "Good", "Passable", etc.`,
        },
        {
            name: "Date of issue",
            type: "text",
            description: "Date the certificate was issued",
            required: true,
            example: `"12/03/2023", "01/11/2022", etc.`,
        },
    ],
};

export default BaccalaureateCertificateV2;
