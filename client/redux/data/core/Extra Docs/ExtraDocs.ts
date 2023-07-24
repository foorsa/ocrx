import { DocumentsGroupType } from "@/redux/types/states/Document Type";
import { PoliceRecordChecks } from "./Docs/Police Record Checks"
import { SOPIBDOL } from "./Docs/SOPIBDOL"

export const ExtraDocs: DocumentsGroupType = {
    name: "Extra Documents",
    id: "ExtraDocs",
    description: "Extra documents that can be used in the application.",
    documents: [
        PoliceRecordChecks,
        SOPIBDOL
    ]
}