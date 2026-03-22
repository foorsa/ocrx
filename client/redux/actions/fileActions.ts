import { FileType, BatchFileType } from "../types/states/File";

// Action Types
export const SET_FILE = "File/Set";
export const RESET_FILE = "File/Reset";
export const SET_FILES = "File/SetMultiple";
export const REMOVE_FILE = "File/Remove";

// Action creators
export const setFile = (file: FileType) => {
    return {
        type: SET_FILE,
        payload: file,
    };
};

export const resetFile = () => {
    return {
        type: RESET_FILE,
    };
};

export const setFiles = (files: BatchFileType[]) => {
    return {
        type: SET_FILES,
        payload: files,
    };
};

export const removeFile = (id: string) => {
    return {
        type: REMOVE_FILE,
        payload: id,
    };
};
