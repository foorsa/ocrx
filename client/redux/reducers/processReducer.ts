// Process Reducer

import { ProcessType } from "../types/states/Process";
import { initialState } from "../initialState";
import { SET_PROCESS, RESET_PROCESS } from "../actions/processActions";

export const processReducer = (state: ProcessType = initialState.process, action: { type: string; payload: any; }) => {
    switch (action.type) {
        case SET_PROCESS:
            return action.payload
        case RESET_PROCESS:
            return initialState.process;
        default:
            return state;
    }
};