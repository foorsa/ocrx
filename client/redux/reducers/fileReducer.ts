import { initialState } from "../initialState";
import { SET_FILE, RESET_FILE } from "../actions/fileActions";
import { FileType } from "../types/states/File";

export const fileReducer = (state: FileType = initialState.file as FileType, action: { type: any; payload: any; }) => {
    switch (action.type) {
        case SET_FILE:
            return action.payload;
        case RESET_FILE:

            return null;
        default:
            return state;
    }
};
