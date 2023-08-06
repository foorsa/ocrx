// sessionSlice.js

import { createSlice } from '@reduxjs/toolkit';
import { Session as SessionType } from '@/redux/types/states/Session';


export interface sessionState {
    Data: SessionType;
    isLoading: boolean;
    Error: {
        message: string;
        code: number;
    } | null;
};

const initialState = {
    Data: null,
    isLoading: false,
    Error: null,
}

const sessionSlice = createSlice({
    name: 'Session',
    initialState,
    reducers: {
        // Clear the session state (Reset)
        clearSession: (state) => {
            state.Data = null;
            state.isLoading = false;
            state.Error = null;
        },

        // Initialize the session
        initializeSession: (state) => {


        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(initializeSession.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(initializeSession.fulfilled, (state, action) => {
                state.isLoading = false;
                state.sessionData = action.payload;
            })
            .addCase(initializeSession.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
        // Add similar cases for other actions (extractText, extractTable, correctText, correctTable, translateText, translateTable, generateDocument)
    },
});

export const { clearSession } = sessionSlice.actions;

export default sessionSlice.reducer;
