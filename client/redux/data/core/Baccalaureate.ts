import { Doctype } from "@/redux/types/states/Document Type";

const Baccalaureate: Doctype = {
    name: "Baccalaureate Diploma",
    id: "baccalaureate",
    description: "Baccalaureate Certificate",
    fields: [
        {
            name: "Candidate",
            type: "string",
            description: "Candidate Name",
            required: true,
            value: "",
        },
        {
            name: "Date of birth",
            type: "date",
            description: "Candidate Date of Birth",
            required: true,
            value: "",
        },
        {
            name: "City",
            type: "string",
            description: "City of the Candidate",
            required: true,
            value: "",
        },
        {
            name: "Insitute",
            type: "string",
            description: "Insitute of the Candidate",
            required: true,
            value: "",
        },
        {
            name: "Cycle",
            type: "string",
            description: "Cycle of the Candidate",
            required: true,
            value: "",
        },
        {
            name: "Speciality",
            type: "string",
            description: "Speciality of the Candidate",
            required: true,

            value: "",
        },
        {
            name: "Mention",
            type: "string",
            description: "Mention of the Candidate",
            required: true,
            value: "",
        },
    ],
}

export default Baccalaureate;