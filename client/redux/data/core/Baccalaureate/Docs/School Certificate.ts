import { DocumentType } from "@/redux/data/Documents";

export const SchoolCertificate: DocumentType = {
    "id": "Baccalaureate-School-Certificate",
    "name": "School Certificate",
    "description": "The School Certificate is a document that certifies that the candidate is continuing his studies at a particular institute.",
    "state": "Available",
    "templateId": "18HyzaYEH9JPbseo_SXebTBZ-O8gjAIP_x-m6XDRVbAU",
    "fields": [
        {
            "name": "Number",
            "type": "text",
            "description": "Number of the School Certificate",
            "required": true,
            "value": "",
        },
        {
            "name": "Candidate",
            "type": "text",
            "description": "Candidate Name",
            "required": true,
            "value": "",
        },
        {
            "name": "Date of birth",
            "type": "text",
            "description": "Candidate Date of Birth",
            "required": true,
            "value": "",
        },
        {
            "name": "City of birth",
            "type": "text",
            "description": "City of the Candidate",
            "required": true,
            "value": "",
        },
        {
            "name": "Candidate Number",
            "type": "text",
            "description": "Candidate Number",
            "required": true,
            "value": "",
        },
        {
            "name": "Secondary Language",
            "type": "text",
            "description": "Secondary Language",
            "required": true,
            "value": "",
        },
        {
            "name": "Institute",
            "type": "text",
            "description": "Institute of the Candidate",
            "required": true,
            "value": "",
        },
        {
            "name": "Province",
            "type": "text",
            "description": "Name of the Provincial Leadership",
            "required": true,
            "value": "",
        },
        {
            "name": "Level",
            "type": "text",
            "description": "Current level of the Candidate at the institution",
            "required": true,
            "value": "",
        },
        {
            "name": "Date of issue",
            "type": "text",
            "description": "Date of issue of the School Certificate",
            "required": true,
            "value": "",
        },
    ]
}

export default SchoolCertificate;