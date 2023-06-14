import { SET_STEP, RESET_STEP, NEXT_STEP, PREVIOUS_STEP } from "@/redux/actions/stepActions";
import { initialState } from "../initialState";
import { Steps } from "../types/states/Step";
import { toast } from "react-hot-toast";


export const stepReducer = (state = initialState.step, action: { type: any; payload: any; }) => {
    switch (action.type) {
        case SET_STEP:
            return action.payload
        case RESET_STEP:
            return Steps.Upload;
        // Logical Step Actions
        case NEXT_STEP:
            // If the current step is the last step, return the first step
            if (state === Steps.Finish) {
                return Steps.Upload;
            }
            // Otherwise, do more logical stuff
            switch (state) {
                case Steps.Upload:
                    // If the current step is Upload, check if the user has uploaded a file
                    // And selected a Document Type
                    // If not, return the current step and show an error message
                    // Otherwise, return the next step

                    // TODO: Check if the user has uploaded a file and selected a Document Type

                    const hasSelectedDocumentType = action.payload.documentType !== "";
                    const hasUploadedFile = action.payload.file !== null;

                    // Document Type
                    if (hasSelectedDocumentType) {
                        toast.error("Please select a Document Type.");
                        return state;
                    }

                    // File
                    if (hasUploadedFile === null) {
                        toast.error("Please upload a file.");
                        return state;
                    }

                    return Steps.Correct;
            }


        default:
            return state;
    }
};

export default stepReducer;
