import { Doctype } from "@/redux/types/states/Document Type";

const Baccalaureate: Doctype = {
    name: "Baccalaureate Diploma",
    id: "baccalaureate",
    description: "Baccalaureate Certificate",
    fields: [
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
            name: "Cycle",
            type: "text",
            description: "Cycle of the Candidate",
            required: true,
            value: "",
        },
        {
            name: "Speciality",
            type: "text",
            description: "Speciality of the Candidate",
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