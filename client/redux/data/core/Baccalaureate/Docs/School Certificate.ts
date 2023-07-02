import { DocumentType } from "@/redux/data/Documents";

export const SchoolCertificate: DocumentType = {
    "id": "Baccalaureate-School-Certificate",
    "name": "School Certificate",
    "description": "The School Certificate is a document that certifies that the candidate is continuing his studies at a particular institute.",
    "state": "Available",
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
            "name": "Session",
            "type": "text",
            "description": "Year and Month, e.g: July 2020, etc.",
            "required": true,
            "value": "",
        },
        {
            "name": "Series",
            "type": "text",
            "description": "Specialty Name",
            "required": true,
            "value": "",
        },
    ]
}

export default SchoolCertificate;