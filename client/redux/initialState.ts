import { Steps } from "@/redux/types/states/Step";
import { Doctype } from "./types/states/Document Type";
import { BatchFileType } from "./types/states/File";
import { Session } from "./types/states/Session";
import BaccalaureateDegree from "./data/core/Baccalaureate/Docs/Baccalaureate Certificate";
import { sessionState } from './slices/sessionSlice';


export const initialState: {
    files: BatchFileType[],
    documentType: Doctype | null,
    step: Steps,
    session: sessionState
} = {
    files: [],
    documentType: BaccalaureateDegree,
    step: Steps.Upload,
    session: {
        Data: { "Session Id": "" },
        isLoading: false,
        Status: "idle",
        Error: null,
        phase: "idle",
        streamingFields: {},
        // Batch state
        batchResults: [],
        batchProgress: {},
        isBatch: false,
    }
};
