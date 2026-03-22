import { initialState } from "../initialState";
import { SET_FILE, RESET_FILE, SET_FILES, REMOVE_FILE } from "../actions/fileActions";
import { BatchFileType } from "../types/states/File";

export const fileReducer = (state: BatchFileType[] = initialState.files, action: { type: any; payload: any; }) => {
    switch (action.type) {
        case SET_FILE:
            // Legacy single-file: wrap into array with generated id
            return [{
                ...action.payload,
                id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
            }];
        case SET_FILES:
            return action.payload;
        case REMOVE_FILE:
            return state.filter((f: BatchFileType) => f.id !== action.payload);
        case RESET_FILE:
            return [];
        default:
            return state;
    }
};
