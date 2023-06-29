// Creeate Slice for Search Functionality
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Documents, DocumentsGroupType } from '@/redux/data/Documents';
import Fuse from 'fuse.js';


export interface SearchState {
    term: string;
    filteredDocuments: DocumentsGroupType[];
    modal: {
        isOpen: boolean;
        Document: DocumentsGroupType | null;
    }
}

const initialState: SearchState = {
    term: '',
    filteredDocuments: Documents,
    modal: {
        isOpen: false,
        Document: null,
    },
}

export const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearch: (state, action: PayloadAction<string>) => {
            state.term = action.payload;

            const searchValue = action.payload.toLowerCase();

            if (searchValue !== "") {
                const fuse = new Fuse(Documents, {
                    keys: [
                        "name",
                        "description",
                        "documents",
                        "documents.name",
                        "documents.id",
                        "documents.description",
                    ],
                    includeScore: true,
                    threshold: 0.3,
                });

                const result = fuse.search(searchValue);
                const newFilteredDocuments = result.map(({ item }) => {
                    const fuse = new Fuse(item.documents, {
                        keys: ["name", "description", "id"],
                        includeScore: true,
                        threshold: 0.3,
                    });

                    const result = fuse.search(searchValue);

                    return {
                        ...item,
                        documents: result.map(({ item }) => item),
                    };
                });

                state.filteredDocuments = newFilteredDocuments;
            } else {
                state.filteredDocuments = Documents;
            }
        },
        // Set Modal State
        setModal: (state, action: PayloadAction<{ isOpen: boolean; Document: DocumentsGroupType | null }>) => {
            state.modal = action.payload;
        },
    }
});

export const { setSearch, setModal } = searchSlice.actions;

export default searchSlice.reducer;