import { Steps } from "@/redux/types/states/Step";
import { Doctype } from "./types/states/Document Type";
import { FileType } from "./types/states/File";


export const initialState: {
    file: FileType | null,
    documentType: Doctype | null,
    step: Steps,
} = {
    file: null,
    documentType: null,
    step: Steps.Upload,
};
