import { DocumentsGroupType } from "../types/states/Document Type";
import { Baccalaureate } from "./core/Baccalaureate/Baccalaureate";
import { Bachelor } from "./core/Bachelor/Bachelor";
import { Master } from "./core/Master/Master";
import { ExtraDocs } from "./core/Extra Docs/ExtraDocs";


export const Documents: DocumentsGroupType[] = [
    Baccalaureate,
    Bachelor,
    Master,
    ExtraDocs
]