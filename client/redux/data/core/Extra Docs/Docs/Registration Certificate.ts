import {
    DocumentType,
    DocumentsGroupType,
} from "@/redux/types/states/Document Type";

export const RegistrationCertificate: DocumentType = {
    "id": "Registration-Certificate",
    "name": "Registration Certificate",
    "description": "A Student Registration Certificate from a Moroccan University is an official document that confirms a student's enrollment and active status within the institution. This certificate serves as proof of the student's affiliation with the university and includes essential details about their academic journey.",
    "tags": ["Regular"],
    "state": "Available",
    "templateId": "1O_7KR2t0m4eSPbCsSCu5uhuUasn7e-Vxo3TIfJHmUKA",
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
            name: "Faculty Name",
            type: "text",
            description: "University Name of the Student",
            required: true,
        },
        {
            name: "Faculty City",
            type: "text",
            description: "Faculty City of the Student",
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
            "name": "Academic Year",
            "type": "text",
            "description": "Academic Year of the Candidate",
            "required": true,
            "example": `"2020-2021", "2021-2022", etc.`
        },
        {
            "name": "Diploma Name",
            "type": "text",
            "description": "Name of the Diploma of the Candidate",
            "required": true,
            "example": `"Bachelor", "Master", etc.`,
        },
        {
            "name": "Diploma Grade",
            "type": "text",
            "description": "Diploma Grade of the Candidate",
            "required": true,
            "example": `"Good", "Very Good", etc.`,
        },
        {
            "name": "Diploma Option",
            "type": "text",
            "description": "Diploma Sector of the Candidate",
            "required": true,
            "example": `"Computer Science", "Mathematics", etc.`,
        },
        {
            "name": "Diploma Year",
            "type": "text",
            "description": "Diploma Sector of the Candidate",
            "required": true,
            "example": `"2nd Year Mathemtical Sciences", "3rd Year", etc."`,
        },
        {
            "name": "City of issue",
            "type": "text",
            "description": "City of issue of the Registration Certificate",
            "required": true,
        },
        {
            "name": "Date of issue",
            "type": "text",
            "description": "Date of issue of the Registration Certificate",
            "required": true,
        },
    ],
}
