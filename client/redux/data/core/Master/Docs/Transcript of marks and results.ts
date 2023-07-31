import {
    DocumentType,
    DocumentsGroupType,
} from "@/redux/types/states/Document Type";

export const TranscriptOfMarks: DocumentType = {
    "id": "Master-Transcript-of-Marks",
    "name": "Transcript of Marks",
    "description": " An academic transcript states the candidate name, the institution he studied at, and a list of all courses taken, all grades received and degrees conferred.",
    "tags": ["Regular", "Tabular"],
    "state": "Unavailable",
    "templateId": "",
    "fields": [
        {
            name: "Start Semester",
            type: "text",
            required: true,
            description: "Start Semester of the Transcript",
            example: "S1, S2, S3, S4, S5, S6, etc.",
        },
        {
            name: "End Semester",
            type: "text",
            required: true,
            description: "End Semester of the Transcript",
            example: "S1, S2, S3, S4, S5, S6, etc.",

        },
        {
            name: "University Name",
            type: "text",
            required: true,
            description: "Name of the University",
            example: "University Qadi Ayyad, University Mohamed V, University Mohamed VI, etc.",
        },
        {
            name: "University City",
            type: "text",
            required: true,
            description: "City of the University",
            example: "Rabat, Sale, Temara, Casablanca, etc.",
        },
        {
            name: "Student Name",
            type: "text",
            required: true,
            description: "Name of the Student",
            example: "Salma Hayyani, Yassine Chettouch, etc.",
        },
        {
            name: "City of birth",
            type: "text",
            required: true,
            description: "City of birth of the Student",
        },
        {
            name: "Date of birth",
            type: "text",
            required: true,
            description: "Date of birth of the Student",
        },
        {
            name: "Student National Code",
            type: "text",
            required: true,
            description: "National Code of the Student",
            example: "G132424556, J100033719, etc.",
        },
        {
            name: "Student Number",
            type: "text",
            required: true,
            description: "Number Code of the Student",
            example: "1234567, 3454567, 2425353, etc.",
        },
        {
            name: "Option",
            type: "text",
            required: true,
            description: "Option of the Student",
            example: "Mathematics, Physics, Chemistry, etc.",
        },
        {
            name: "City of issue",
            type: "text",
            required: true,
            description: "City of issue of the Transcript of Marks",
        },
        {
            name: "Date of issue",
            type: "text",
            required: true,
            description: "Date of issue of the Transcript of Marks",
        },
    ],
}