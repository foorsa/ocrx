import type { ProcessType } from "../types/states/Process";

// Path: client\redux\actions\processActions.ts


// Action Types
export const SET_PROCESS = "Process/Set";
export const RESET_PROCESS = "Process/Reset";

// Action creators
export const setProcess = (process: ProcessType) => {
    return {
        type: SET_PROCESS,
        payload: process,
    };
};

export const resetProcess = () => {
    return {
        type: RESET_PROCESS,
    };
};
