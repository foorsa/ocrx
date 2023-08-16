import { DocumentsGroupType } from "@/redux/types/states/Document Type";
import { PoliceRecordChecks } from "./Docs/Police Record Checks"
import { StatementOfPenaltiesIssuesByDeprivationOfLiberty } from "./Docs/Statement of penalties issued by deprivation of liberty"
import { TechnicalUniversityDegree } from "./Docs/Technical University degree";
import { CertificateOfAchievement } from "./Docs/Certificate of achievement";
import { RegistrationCertificate } from "./Docs/Registration Certificate";

export const ExtraDocs: DocumentsGroupType = {
    name: "Extra Documents",
    id: "ExtraDocs",
    description: "Extra documents that can be used in the application.",
    documents: [
        PoliceRecordChecks,
        StatementOfPenaltiesIssuesByDeprivationOfLiberty,
        TechnicalUniversityDegree,
        CertificateOfAchievement,
        RegistrationCertificate
    ]
}