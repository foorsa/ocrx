import {
    DocumentType,
    DocumentsGroupType,
} from "@/redux/types/states/Document Type";

export const CertificateOfAchievement: DocumentType = {
    "id": "Certificate-of-Achievement",
    "name": "Certificate of Achievement",
    "description": "A certificate of achievement is a valuable tool designed to acknowledge and celebrate a student's successful accomplishment or attainment of a diploma. This document serves as a formal recognition of the individual's dedication, hard work, and commitment to their academic or personal goals.",
    "tags": ["Regular"],
    "state": "Available",
    "templateId": "168Q9wIx0aiGOp6Fco4EDac_867xDNq41JLFW57IJh58",
    "fields": [
        {
            name: "University Name",
            type: "text",
            description: "University Name of the Student",
            required: true,
        },
        {
            name: "University City",
            type: "text",
            description: "University City of the Student",
            required: true,
        },
        {
            "name": "Student Name",
            "type": "text",
            "description": "Name of the Candidate",
            "required": true,
            "example": `"Mohamed Ali", "Yassine Chettouch", etc.`
        },
        {
            "name": "Registration Number",
            "type": "text",
            "description": "Registration Number of the Candidate",
            "required": true,
            "example": `"131240282", "105020120", etc.`
        },
        {
            "name": "National Identity Card",
            "type": "text",
            "description": "National Identity Card of the Candidate",
            "required": true,
            "example": `"AS14457", "FG45458", etc.`
        },
        {
            "name": "Student National Code",
            "type": "text",
            "description": "Code of the student in the National Student Registry",
            "required": true,
            "example": `"R131240282", "J105020120", etc.`
        },
        {
            "name": "Date of birth",
            "type": "text",
            "description": "Candidate Date of Birth",
            "required": true,
            "example": `"01/01/2000", "01/01/2001", etc.`
        },
        {
            "name": "City of birth",
            "type": "text",
            "description": "City of the Candidate",
            "required": true,
            "example": `"Rabat", "Casablanca", etc.`
        },
        {
            "name": "Academic Year",
            "type": "text",
            "description": "Academic Year of the Candidate",
            "required": true,
            "example": `"2019/2020", "2020/2021", etc.`,
        },
        {
            "name": "Diploma Name",
            "type": "text",
            "description": "Name of the Diploma of the Candidate",
            "required": true,
            "example": `"Bachelor", "Master", etc.`,
        },
        {
            "name": "Major",
            "type": "text",
            "description": "Major of the Candidate",
            "required": true,
            "example": `"Mathematical Sciences", "Physical Sciences", etc.`,
        },
        {
            "name": "City of issue",
            "type": "text",
            "description": "City of issue of the School Certificate",
            "required": true,
        },
        {
            "name": "Date of issue",
            "type": "text",
            "description": "Date of issue of the School Certificate",
            "required": true,
        },
    ],
}