import {
    DocumentType,
    DocumentsGroupType,
} from "@/redux/types/states/Document Type";

export const SchoolCertificate: DocumentType = {
    "id": "Baccalaureate-School-Certificate",
    "name": "School Certificate",
    "description": "The School Certificate is a document that certifies that the candidate is continuing his studies at a particular institute.",
    "tags": ["Regular"],
    "state": "Available",
    "templateId": "18HyzaYEH9JPbseo_SXebTBZ-O8gjAIP_x-m6XDRVbAU",
    "fields": [
        {
            "name": "Province",
            "type": "text",
            "description": "Name of the Provincial Leadership",
            "required": true,
            "example": `"Rabat", "Casablanca-Settat", etc.`
        },
        {
            "name": "Region",
            "type": "text",
            "description": "Name of the Regional Leadership",
            "required": true,
            "example": `"Rabat Sale Kenitra", "Grand Casablanca", etc.`
        },
        {
            "name": "Year",
            "type": "text",
            "description": "School Year of the Student",
            "required": true,
            "example": `"2020/2021", "2021/2022", etc.`
        },
        {
            "name": "Commune",
            "type": "text",
            "description": "Name of the Commune",
            "required": true,
            "example": `"Rabat", "Casablanca", etc.`
        },
        {
            "name": "Institute",
            "type": "text",
            "description": "Institute of the Candidate",
            "required": true,
            "example": `"Mohamed V", "Hassan II", etc.`
        },
        {
            "name": "Student Name",
            "type": "text",
            "description": "Name of the Candidate",
            "required": true,
            "example": `"Mohamed Ali", "Yassine Chettouch", etc.`
        },
        {
            "name": "Student Code",
            "type": "text",
            "description": "Code of the Candidate",
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
            "name": "Option",
            "type": "text",
            "description": "Option of the Candidate",
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

export default SchoolCertificate;