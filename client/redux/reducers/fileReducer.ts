import { initialState } from "../initialState";
import { SET_FILE, RESET_FILE } from "../actions/fileActions";

export const fileReducer = (state = initialState.file, action: { type: any; payload: any; }) => {
    switch (action.type) {
        case SET_FILE:
            console.log("fileReducer: SET_FILE: action.payload: ", action.payload);
            return action.payload;
        case RESET_FILE:

            return null;
        default:
            return state;
    }
};
