import { DocumentsGroupType } from "@/redux/types/states/Document Type";
import { BachelorCertificate } from "./Docs/Bachelor Certificate";


export const Bachelor: DocumentsGroupType = {
    name: "Bachelor",
    id: "Bachelor",
    description: "A Bachelor's degree is a prestigious academic achievement that represents the successful completion of an undergraduate program at a recognized educational institution. This degree is a symbol of dedication, hard work, and a commitment to higher learning.",
    documents: [
        BachelorCertificate
    ]
} 