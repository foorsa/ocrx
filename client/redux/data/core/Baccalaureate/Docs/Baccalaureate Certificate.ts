import { DocumentType } from "@/redux/data/Documents";

export const BaccalaureateCertificate: DocumentType = {
    id: "Baccalaureate-Certificate",
    name: "Baccalaureate Certificate",
    description: "The Baccalaureate Certificate is a document that certifies that the candidate has passed the Baccalaureate Examination.",
    state: "Available",
    templateId: "1X3rr9TPPR7egAZLvDalNBAnkOYizgAmezHwFgRw1rzE",
    fields: [
        {
            name: "Serial Number",
            type: "text",
            description: "Serial Number of the Baccalaureate Certificate",
            required: true,
            value: "",
        },
        {
            name: "Candidate",
            type: "text",
            description: "Candidate Name",
            required: true,
            value: "",
        },
        {
            name: "Date of birth",
            type: "text",
            description: "Candidate Date of Birth",
            required: true,
            value: "",
        },
        {
            name: "City of birth",
            type: "text",
            description: "City of the Candidate",
            required: true,
            value: "",
        },
        {
            name: "Institute",
            type: "text",
            description: "Institute of the Candidate",
            required: true,
            value: "",
        },
        {
            name: "Province",
            type: "text",
            description: "Name of the Provincial Leadership",
            required: true,
            value: "",
        },
        {
            name: "Session",
            type: "text",
            description: "Year and Month, e.g: July 2020, etc.",
            required: true,
            value: "",
        },
        {
            name: "Option",
            type: "text",
            description: "Specialty Name",
            required: true,
            value: "",
        },
        {
            name: "Grade",
            type: "text",
            description: "Mention of the Candidate",
            required: true,
            value: "",
        },
        {
            name: "Date of issue",
            type: "text",
            description: "Date of the Issue of the cerrtificate",
            required: true,
            value: "",
        }
    ],
}

export default BaccalaureateCertificate;