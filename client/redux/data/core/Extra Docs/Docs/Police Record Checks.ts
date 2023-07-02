import { DocumentType } from "@/redux/data/Documents";

export const PoliceRecordChecks: DocumentType = {
    id: "Police Record Checks",
    name: "ExtraDocs-Police-Record-Checks",
    description: "Police Record Checks is a document that certifies that the candidate has no criminal record. It is issued by the National Center for Examinations and Evaluations of the Ministry of National Education and Vocational Training of Morocco. It is issued in Arabic and French.",
    state: "Available",
    fields: [
        {
            name: "Start Date",
            type: "text",
            description: "Start Date of the Police Record Checks",
            required: true,
            value: "",
        },
        {
            name: "End Date",
            type: "text",
            description: "End Date of the Police Record Checks",
            required: true,
            value: "",
        },
        {
            name: "Identity Card Number",
            type: "text",
            description: "Identity Card Number of the Candidate",
            required: true,
            value: "",
        },
        {
            name: "First Name",
            type: "text",
            description: "First Name of the Candidate",
            required: true,
            value: "",
        },
        {
            name: "Last Name",
            type: "text",
            description: "Last Name of the Candidate",
            required: true,
            value: "",
        },
        {
            name: "Date of Birth",
            type: "text",
            description: "Date of Birth of the Candidate",
            required: true,
            value: "",
        },
        {
            name: "Place of Birth",
            type: "text",
            description: "Place of Birth of the Candidate",
            required: true,
            value: "",
        },
        {
            name: "Address",
            type: "text",
            description: "Address of the Candidate",
            required: true,
            value: "",
        },
    ]
}