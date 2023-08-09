// sessionSlice.js

import { createSlice } from '@reduxjs/toolkit';
import { Session as SessionType } from '@/redux/types/states/Session';
import { processDocument, generateDocument } from '@/redux/actions/sessionActions';
import { toast } from 'react-hot-toast';


export interface sessionState {
    Data: SessionType | null;
    isLoading: boolean;
    Status: "idle" | "loading" | "succeeded" | "failed";
    Error: string | null;
};

const initialState: sessionState = {
    Data: null,
    isLoading: false,
    Status: "idle",
    Error: null,
}

const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        clearSession: (state) => initialState,
        setSession: (state, action) => {
            state.Data = action.payload;
            state.isLoading = false;
            state.Status = "succeeded";
            state.Error = null;
        },
        cancelSession: (state) => initialState,
    },
    extraReducers(builder) {
        builder.addCase(processDocument.pending, (state) => {
            state.isLoading = true;
            state.Status = "loading";
        });
        builder.addCase(processDocument.fulfilled, (state, action) => {
            state.isLoading = false;
            state.Status = "succeeded";
            state.Data = action.payload;
        });
        builder.addCase(processDocument.rejected, (state, action) => {
            state.isLoading = false;
            state.Status = "failed";
            state.Error = action.error.message || null;
        });
        builder.addCase(generateDocument.pending, (state) => {
            state.isLoading = true;
            state.Status = "loading";
        }
        );
        builder.addCase(generateDocument.fulfilled, (state, action) => {
            state.isLoading = false;
            state.Status = "succeeded";
            state.Data = action.payload;
        }
        );
        builder.addCase(generateDocument.rejected, (state, action) => {
            state.isLoading = false;
            state.Status = "failed";
            state.Error = action.error.message || null;
        }
        );
    },
},
);

export const { clearSession,
    setSession,
    cancelSession
} = sessionSlice.actions;

export default sessionSlice.reducer;
