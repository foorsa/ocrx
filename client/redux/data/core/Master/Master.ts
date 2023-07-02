import { DocumentsGroupType } from "../../Documents";
import { CertificateOfSchooling } from "./Docs/Certificate of schooling";
import { CertificateOfSuccessAtDiploma } from "./Docs/Certificate of success at diploma";
import { MasterCertificate } from "./Docs/Master's Certificate";
import { TranscriptOfMarks } from "./Docs/Transcript of marks and results";

export const Master: DocumentsGroupType = {
    name: "Master",
    id: "Master",
    description: "A postgraduate degree that follows a Bachelor's degree and precedes a Doctorate degree. The Master's degree is awarded by a university.",
    documents: [
        MasterCertificate,
        TranscriptOfMarks,
        CertificateOfSchooling,
        CertificateOfSuccessAtDiploma
    ]
} 