import { DocumentType, DocumentsGroupType } from "../../Documents";
import { BaccalaureateCertificate } from "./Docs/Baccalaureate Certificate";
import { SchoolCertificate } from "./Docs/School Certificate";
import { TranscriptOfNotes } from "./Docs/Transcript of notes";

export const Baccalaureate: DocumentsGroupType = {
    name: "Baccalaureate Degrees",
    description: "Examination intended to qualify successful candidates for higher education.",
    id: "Baccalaureate",
    documents: [
        BaccalaureateCertificate,
        SchoolCertificate,
        TranscriptOfNotes
    ]
}