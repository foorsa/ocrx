import { Baccalaureate } from "./core/Baccalaureate/Baccalaureate";
import { Master } from "./core/Master/Master";
import { ExtraDocs } from "./core/Extra Docs/ExtraDocs";

export type DocumentType = {
    name: string;
    id: string;
    description: string;
    fields: {
        name: string;
        type: string;
        description: string;
        required: boolean;
        value: string;
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