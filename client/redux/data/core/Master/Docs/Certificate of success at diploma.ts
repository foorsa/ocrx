import { DocumentType } from "@/redux/data/Documents";

export const CertificateOfSuccessAtDiploma: DocumentType = {
    id: "Certificate-of-success-at-diploma",
    name: "Certificate of success at diploma",
    description: "Certificate of success at diploma is a document that certifies that the candidate has successfully completed his studies at a particular institute and has obtained a diploma.",
    state: "Available",
    templateId: "1TFocZylhyKTNXlvZ8Bz-sKJAPOdpIdx1w37-Kyw7rJk",
    fields: [
        {
            name: "Province",
            type: "text",
            description: "Name of the Provincial Leadership",
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
            name: "Student Number",
            type: "text",
            description: "Student's Number",
            required: true,
            value: "",
        },
        {
            name: "Date of birth",
            type: "text",
            description: "Student's  Date of Birth",
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
            name: "Year",
            type: "text",
            description: "Year of the Certificate, e.g: 2019, etc.",
            required: true,
            value: "",
        },
    ]
}