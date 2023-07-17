import { DocumentType } from "@/redux/data/Documents";

export const MasterCertificate: DocumentType = {
    id: "Master-Certificate",
    name: "Master Certificate",
    description: "Master Certificate is a document that certifies that the candidate has successfully completed his studies at a particular institute and has obtained a Master's degree.",
    state: "Available",
    templateId: "1gBQowrWKrdR98okjfY8s7rRL3vteY64f6sM3Wx8TzR8",
    fields: [
        {
            name: "Province",
            type: "text",
            description: "Name of the Provincial Leadership",
            required: true,
            value: "",
        },
        {
            name: "Certificate Name",
            type: "text",
            description: "Name of the Certificate, e.g: Master's Certificate, Licence Certificate, etc.",
            required: true,
            value: "",
        },
        {
            name: "University",
            type: "text",
            description: "University of the Candidate",
            required: true,
            value: "",
        },
        {
            name: "Student",
            type: "text",
            description: "Student's Full Name",
            required: true,
            value: "",
        },
        {
            name: "Date of birth",
            type: "text",
            description: "Student's Date of Birth",
            required: true,
            value: "",
        },
        {
            name: "City of birth",
            type: "text",
            description: "Student's City of Birth",
            required: true,
            value: "",
        },
        {
            name: "National Identity Card Number",
            type: "text",
            description: "CIN of the Student, e.g: J123456, etc.",
            required: true,
            value: "",
        },
        {
            name: "Student National Code",
            type: "text",
            description: "CNE of the Student, e.g: J1234567890, etc.",
            required: true,
            value: "",
        },
        {
            name: "Option",
            type: "text",
            description: "Option of the Candidate, e.g: Computer Science, etc.",
            required: true,
            value: "",
        },
        {
            name: "Grade",
            type: "text",
            description: "Grade of the Candidate, e.g: Pass, Very Good, etc.",
            required: true,
            value: "",
        },
        {
            name: "City of Issue",
            type: "text",
            description: "City of Issue of the Certificate.",
            required: true,
            value: "",
        },
        {
            name: "Date of Issue",
            type: "text",
            description: "Date of Issue of the Certificate.",
            required: true,
            value: "",
        },
    ],
}

export default MasterCertificate;