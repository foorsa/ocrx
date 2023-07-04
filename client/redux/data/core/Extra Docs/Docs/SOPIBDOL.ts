import { DocumentType } from "@/redux/data/Documents";

export const SOPIBDOL: DocumentType = {
    id: "SOPIBDOL",
    name: "Statement of penalties issued by deprivation of liberty",
    description: "Statement of penalties issued by deprivation of liberty is a document that contains the penalties issued by deprivation of liberty of the candidate. It is issued by the National Center for Examinations and Evaluations of the Ministry of National Education and Vocational Training of Morocco. It is issued in Arabic and French.",
    state: "Available",
    templateId: "1G42GpqZrapdmjbinaa6JGeKXK0v2V4wkX4Be2K7RvoI",
    fields: [
        {
            name: "City of court",
            type: "text",
            description: "City of court where the penalty was issued.",
            required: true,
            value: "",
        },
        {
            name: "Start Date",
            type: "text",
            description: "Start Date",
            required: true,
            value: "",
        },
        {
            name: "End Date",
            type: "text",
            description: "End Date",
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