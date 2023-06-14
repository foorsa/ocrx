// Actions for Document Types
//

import { Doctype } from "../types/states/Document Type";

// Action Types
export const GET_DOCUMENT_TYPES = "Doctype/Get";
export const SET_DOCUMENT_TYPES = "Doctype/Set";
export const RESET_DOCUMENT_TYPE = "Doctype/Reset";

// Action Creators
export const getDocumentTypes = () => ({
    type: GET_DOCUMENT_TYPES,
});

export const setDocumentTypes = (DocumentType: Doctype) => ({
    type: SET_DOCUMENT_TYPES,
    payload: DocumentType,
});

export const resetDocumentType = () => ({
    type: RESET_DOCUMENT_TYPE,
});