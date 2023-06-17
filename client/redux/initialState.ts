import { Steps } from "@/redux/types/states/Step";
import { Doctype } from "./types/states/Document Type";
import { FileType } from "./types/states/File";
import { ProcessType } from "./types/states/Process";


export const initialState: {
    process: ProcessType;
    file: FileType | null,
    documentType: Doctype | null,
    step: Steps,
} = {
    file: null,
    documentType: null,
    step: Steps.Upload,
    process: {
        isLoading: false,
    }
};
