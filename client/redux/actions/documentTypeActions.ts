// Actions for Document Types
//

import { Doctype } from "../types/states/Document Type";

// Action Types
export const GET_DOCUMENT_TYPE = "Doctype/Get";
export const SET_DOCUMENT_TYPE = "Doctype/Set";
export const RESET_DOCUMENT_TYPE = "Doctype/Reset";

// Action Creators
export const getDocumentTypes = () => ({
    type: GET_DOCUMENT_TYPE,
});

export const setDocumentType = (DocumentType: Doctype) => ({
    type: SET_DOCUMENT_TYPE,
    payload: DocumentType,
});

export const resetDocumentType = () => ({
    type: RESET_DOCUMENT_TYPE,
});