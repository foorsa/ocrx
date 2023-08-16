import {
    DocumentType,
    DocumentsGroupType,
} from "@/redux/types/states/Document Type"; import { BaccalaureateCertificate } from "./Docs/Baccalaureate Certificate";
import { SchoolCertificate } from "./Docs/School Certificate";
import { TranscriptOfMarksV1 } from "./Docs/Transcript of Marks (V1)";
import { TranscriptOfMarksV2 } from "./Docs/Transcript of Marks (V2)";

export const Baccalaureate: DocumentsGroupType = {
    name: "Baccalaureate Degrees",
    description: "Examination intended to qualify successful candidates for higher education.",
    id: "Baccalaureate",
    documents: [
        BaccalaureateCertificate,
        SchoolCertificate,
        TranscriptOfMarksV1,
        TranscriptOfMarksV2
    ]
}