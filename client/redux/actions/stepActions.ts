import { Steps } from "@/redux/types/states/Step";
import { Doctype } from "../types/states/Document Type";
import { FileType } from "../types/states/File";

// Step Actions
export const SET_STEP = "Step/Set";
export const RESET_STEP = "Step/Reset";

export const setStep = (step: Steps) => {
    return {
        type: SET_STEP,
        payload: step,
    };
};

export const resetStep = () => {
    return {
        type: RESET_STEP,
        payload: Steps.Upload,
    };
};

// More Logical Step Actions

export const NEXT_STEP = "Step/Next";

export const nextStep = () => {
    return {
        type: NEXT_STEP,
    };
};

export const PREVIOUS_STEP = "Step/Previous";

export const previousStep = () => {
    return {
        type: PREVIOUS_STEP,
    };
}