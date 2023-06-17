import { Doctype } from "@/redux/types/states/Document Type";

const Baccalaureate: Doctype = {
    name: "Baccalaureate Diploma",
    id: "baccalaureate",
    description: "Baccalaureate Certificate",
    fields: [
        {
            name: "Serial Number",
            type: "text",
            description: "Serial Number of the Baccalaureate Certificate",
            required: true,
            value: "",
        },
        {
            name: "Candidate",
            type: "text",
            description: "Candidate Name",
            required: true,
            value: "",
        },
        {
            name: "Date of birth",
            type: "text",
            description: "Candidate Date of Birth",
            required: true,
            value: "",
        },
        {
            name: "City",
            type: "text",
            description: "City of the Candidate",
            required: true,
            value: "",
        },
        {
            name: "Insitute",
            type: "text",
            description: "Insitute of the Candidate",
            required: true,
            value: "",
        },
        {
            name: "Province",
            type: "text",
            description: "Name of the Provincial Leadership",
            required: true,
            value: "",
        },
        {
            name: "Session",
            type: "text",
            description: "Year and Month, e.g: July 2020, etc.",
            required: true,
            value: "",
        },
        {
            name: "Series",
            type: "text",
            description: "Speciality Name",
            required: true,
            value: "",
        },
        {
            name: "Mention",
            type: "text",
            description: "Mention of the Candidate",
            required: true,
            value: "",
        },
    ],
}

export default Baccalaureate;