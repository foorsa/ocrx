import {
    DocumentType,
    DocumentsGroupType,
    DEFAULT_TABLE_OPTIONS,
} from "@/redux/types/states/Document Type";

export const TranscriptOfMarksV2: DocumentType = {
    "id": "Baccalaureate-Transcript-of-Marks-V2",
    "name": "Transcript of Marks [V2]",
    "tags": ["Regular", "Tabular"],
    "description": "An academic transcript states the candidate name, the institution he studied at, and a list of all courses taken, all grades received and degrees conferred.",
    "state": "Available",
    "templateId": "1yTkDcROEOUAyMPdfQn09770AQK3iLjaXpWAo7Ad7iMo",
    "tableOptions": DEFAULT_TABLE_OPTIONS,
    "fields": [
        {
            name: "Province",
            type: "text",
            description: "Name of the Provincial Leadership",
            required: true,
            example: `"Rabat", "Casablanca-Settat", etc.`,
        },
        {
            name: "Institute",
            type: "text",
            description: "Institute of the Candidate",
            required: true,
            example: `"Mohamed V", "Hassan II", etc.`,
        },
        {
            name: "Year",
            type: "text",
            description: "Year of the Baccalaureate",
            required: true,
            example: `"2002", "2003", etc.`,
        },
        {
            name: "Student Name",
            type: "text",
            description: "Student Name",
            required: true,
            example: `"Mohamed Ali", "Yassine Chettouch", etc.`,
        },
        {
            name: "Student Option",
            type: "text",
            description: "Student's Option",
            required: true,
            example: `"Mathematics", "Physics", etc.`,
        },
        {
            name: "Student National Code",
            type: "text",
            description: "Student National Code",
            required: true,
            example: `"G123456", "K137260", etc.`,
        },
        {
            name: "Student Level",
            type: "text",
            description: "Student's Level",
            required: true,
            example: `"Baccalaureate in Physical Sciences", "Baccalaureate in Economic Sciences", etc.`,
        },
        {
            name: "City of issue",
            type: "text",
            description: "City of the issue of the certificate",
            required: true,
        },
        {
            name: "Date of issue",
            type: "text",
            description: "Date of the Issue of the cerrtificate",
            required: true,

            example: `"12/03/2002", "01/11/2003", etc.`,
        },
    ],
}