import { Steps } from "@/redux/types/states/Step";
import { Doctype } from "./types/states/Document Type";
import { FileType } from "./types/states/File";
import { ProcessType } from "./types/states/Process";
import { Session } from "./types/states/Session";
import BaccalaureateDegree from "./data/core/Baccalaureate/Docs/Baccalaureate Certificate";


export const initialState: {
    process: ProcessType;
    file: FileType | null,
    documentType: Doctype | null,
    step: Steps,
    session: Session
} = {
    file: null,
    documentType: BaccalaureateDegree,
    step: Steps.Upload,
    process: {
        isLoading: false,
    },
    session: {
        "Session Id": "",
    }
};
