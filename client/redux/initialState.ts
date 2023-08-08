import { Steps } from "@/redux/types/states/Step";
import { Doctype } from "./types/states/Document Type";
import { FileType } from "./types/states/File";
import { Session } from "./types/states/Session";
import BaccalaureateDegree from "./data/core/Baccalaureate/Docs/Baccalaureate Certificate";
import { sessionState } from './slices/sessionSlice';


export const initialState: {
    file: FileType | null,
    documentType: Doctype | null,
    step: Steps,
    session: sessionState
} = {
    file: null,
    documentType: BaccalaureateDegree,
    step: Steps.Upload,
    session: {
        Data: { "Session Id": "" },
        isLoading: false,
        Status: "idle",
        Error: null,
    }
};
