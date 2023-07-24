export const MasterDegree = {
    name: "Master Certificate",
    id: "Master-Certificate",
    description: "Master Certificate",
    fields: [
        {
            name: "Serial Number",
            type: "text",
            description: "Serial Number of the Master Certificate",
            required: true,

        },
        {
            name: "Candidate",
            type: "text",
            description: "Candidate Name",
            required: true,

        },
        {
            name: "Date of birth",
            type: "text",
            description: "Candidate Date of Birth",
            required: true,

        },
        {
            name: "City",
            type: "text",
            description: "City of the Candidate",
            required: true,

        },
        {
            name: "Institute",
            type: "text",
            description: "Insitute of the Candidate",
            required: true,

        },
        {
            name: "Province",
            type: "text",
            description: "Name of the Provincial Leadership",
            required: true,

        },
        {
            name: "Session",
            type: "text",
            description: "Year and Month, e.g: July 2020, etc.",
            required: true,

        },
        {
            name: "Series",
            type: "text",
            description: "Speciality Name",
            required: true,

        },
        {
            name: "Mention",
            type: "text",
            description: "Mention of the Candidate",
            required: true,

        },
    ],
}

export default MasterDegree;