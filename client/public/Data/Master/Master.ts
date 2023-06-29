import { CertificateOfSchooling } from "./Docs/Certificate of schooling";
import { CertificateOfSuccessAtDiploma } from "./Docs/Certificate of success at diploma";
import { MasterDegree } from "./Docs/Master's degree";
import { TranscriptOfMarks } from "./Docs/Transcript of marks and results";

export const Master = {
    name: "Master",
    id: "Master",
    description: "A postgraduate degree that follows a Bachelor's degree and precedes a Doctorate degree. The Master's degree is awarded by a university.",
    documents: [
        MasterDegree,
        TranscriptOfMarks,
        CertificateOfSchooling,
        CertificateOfSuccessAtDiploma
    ]
} 