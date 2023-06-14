// Action Types
export const SET_FILE = "File/Set";
export const RESET_FILE = "File/Reset";

// Action creators
export const setFile = (file: File) => {
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
