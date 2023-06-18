import { Doctype } from "@/redux/types/states/Document Type";
import {
    GET_DOCUMENT_TYPE,
    SET_DOCUMENT_TYPE,
    RESET_DOCUMENT_TYPE,
} from "@/redux/actions/documentTypeActions";
import { initialState } from "../initialState";

export const documentTypeReducer = (state = initialState.documentType, action: {
    type: any; payload: Doctype;
}) => {
    switch (action.type) {
        case GET_DOCUMENT_TYPE:
            return state;
        case SET_DOCUMENT_TYPE:
            return action.payload;
        case RESET_DOCUMENT_TYPE:
            return null;
        default:
            return state;
    }
};

export default documentTypeReducer;
