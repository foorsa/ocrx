import { BaccalaureateDegree } from "./Docs/Baccalaureate Degree";
import { SchoolCertificate } from "./Docs/School Cetificate";
import { TranscriptOfNotes } from "./Docs/Transcript of notes";

export const Baccalaureate = {
    name: "Baccalaurerate Degrees",
    description: "Examination intended to qualify successful candidates for higher education.",
    id: "Baccalaureate",
    documents: [
        BaccalaureateDegree,
        SchoolCertificate,
        TranscriptOfNotes
    ]
}