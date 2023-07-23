import { DocumentType } from "@/redux/data/Documents";

export const SOPIBDOL: DocumentType = {
    id: "SOPIBDOL",
    name: "Statement of penalties issued by deprivation of liberty",
    description: "Statement of penalties issued by deprivation of liberty is a document that contains the penalties issued by deprivation of liberty of the candidate. It is issued by the National Center for Examinations and Evaluations of the Ministry of National Education and Vocational Training of Morocco. It is issued in Arabic and French.",
    "tags": ["Regular"],
    state: "Available",
    templateId: "1G42GpqZrapdmjbinaa6JGeKXK0v2V4wkX4Be2K7RvoI",
    fields: [
        {
            name: "Order Number",
            type: "text",
            description: "Order Number of the penalty issued by deprivation of liberty.",
            required: true,
            value: "",
            example: "K622957, E232456, etc.",
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
            name: "Second Name",
            type: "text",
            description: "Second Name of the Candidate",
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
        {
            name: "Occupation",
            type: "text",
            description: "Occupation of the Candidate",
            required: true,
            value: "",
            example: "Mostly Student.",
        },
        {
            name: "City of issue",
            type: "text",
            description: "City of issue of the Statement of penalties issued by deprivation of liberty.",
            required: true,
            value: "",
        },
        {
            name: "Date of issue",
            type: "text",
            description: "Date of issue of the Statement of penalties issued by deprivation of liberty.",
            required: true,
            value: "",
        },
    ]
}