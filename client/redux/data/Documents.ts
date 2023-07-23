import { Baccalaureate } from "./core/Baccalaureate/Baccalaureate";
import { Master } from "./core/Master/Master";
import { ExtraDocs } from "./core/Extra Docs/ExtraDocs";

type TagType = "Regular" | "Tabular";


export type DocumentType = {
    name: string;
    id: string;
    description: string;
    tags?: TagType[];
    state: "Available" | "Unavailable";
    templateId: string;
    fields: {
        name: string;
        type: string;
        description: string;
        required: boolean;
        value: string;
        example?: string;
    }[];
}

export type DocumentsGroupType = {
    name: string;
    description: string;
    id: string;
    documents: DocumentType[]
}

export const Documents: DocumentsGroupType[] = [
    Baccalaureate,
    Master,
    ExtraDocs
]