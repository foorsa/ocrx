import { DocumentType } from "@/redux/data/Documents";

export const BaccalaureateCertificate: DocumentType = {
    id: "Baccalaureate-Certificate",
    name: "Baccalaureate Certificate",
    description: "The Baccalaureate Certificate is a document that certifies that the candidate has passed the Baccalaureate Examination.",
    "tags": ["Regular"],
    state: "Available",
    templateId: "1X3rr9TPPR7egAZLvDalNBAnkOYizgAmezHwFgRw1rzE",
    fields: [
        {
            name: "Province",
            type: "text",
            description: "Name of the Provincial Leadership",
            required: true,

            example: `"Rabat", "Casablanca-Settat", etc.`
        },
        {
            name: "Serial Number",
            type: "text",
            description: "Serial Number of the Baccalaureate Certificate",
            required: true,

            example: `"C123456789", "K137260939", etc.`
        },
        {
            name: "Candidate",
            type: "text",
            description: "Candidate Name",
            required: true,

            example: `"Mohamed Ali", "Yassine Chettouch", etc.`
        },
        {
            name: "Date of birth",
            type: "text",
            description: "Candidate Date of Birth",
            required: true,

        },
        {
            name: "City of birth",
            type: "text",
            description: "City of the Candidate",
            required: true,

        },
        {
            name: "Institute",
            type: "text",
            description: "Institute of the Candidate",
            required: true,

            example: `"Mohamed V", "Hassan II", etc.`
        },
        {
            name: "Session",
            type: "text",
            description: "Year and Month, e.g: July 2020, etc.",
            required: true,

            example: `"July 2020", "June  2023", etc.`
        },
        {
            name: "Series",
            type: "text",
            description: "Series of the Baccalaureate Certificate",
            required: true,

            example: `"Economic Sciences", "Mathematics", etc.`
        },
        {
            name: "Option",
            type: "text",
            description: "Specialty Name",
            required: true,

            example: `"Economics and Management", "Physical Sciences", etc.`,
        },
        {
            name: "Grade",
            type: "text",
            description: "Mention of the Candidate",
            required: true,

            example: `"Excellent", "Very Good", "Good", "Good Enough", 
            "Passable", "Passable Enough", "Insufficient", etc.`,
        },
        {
            name: "Date of issue",
            type: "text",
            description: "Date of the Issue of the cerrtificate",
            required: true,

            example: `"12/03/2002", "01/11/2003", etc.`
        }
    ],
}

export default BaccalaureateCertificate;