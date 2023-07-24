import { Baccalaureate } from "./core/Baccalaureate/Baccalaureate";
import { Master } from "./core/Master/Master";
import { ExtraDocs } from "./core/Extra Docs/ExtraDocs";
import { DocumentsGroupType } from "../types/states/Document Type";


export const Documents: DocumentsGroupType[] = [
    Baccalaureate,
    Master,
    ExtraDocs
]