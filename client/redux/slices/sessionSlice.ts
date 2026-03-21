// sessionSlice.js

import { createSlice } from '@reduxjs/toolkit';
import { Session as SessionType } from '@/redux/types/states/Session';
import { processDocument, processDocumentStream, generateDocument } from '@/redux/actions/sessionActions';


export interface sessionState {
    Data: SessionType | null;
    isLoading: boolean;
    Status: "idle" | "loading" | "succeeded" | "failed";
    Error: string | null;
    phase: string;
    streamingFields: Record<string, any>;
};

const initialState: sessionState = {
    Data: null,
    isLoading: false,
    Status: "idle",
    Error: null,
    phase: "idle",
    streamingFields: {},
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
        resetSessionStatus: (state) => {
            state.Status = state.Data ? "succeeded" : "idle";
            state.Error = null;
        },
        setPhase: (state, action) => {
            state.phase = action.payload;
        },
        updateStreamingField: (state, action) => {
            const { field, value } = action.payload;
            state.streamingFields[field] = value;
        },
        resetStreaming: (state) => {
            state.phase = "idle";
            state.streamingFields = {};
        },
    },
    extraReducers(builder) {
        builder.addCase(processDocument.pending, (state) => {
            state.isLoading = true;
            state.Status = "loading";
            state.Error = null;
        });
        builder.addCase(processDocument.fulfilled, (state, action) => {
            console.log("[PROCESSION] Extra Reducers Setting Payload: " + action.payload)

            state.Data = action.payload;
            state.isLoading = false;
            state.Status = "succeeded";
            state.Error = null;

            console.log("[PROCESSION] Extra Reducers has set payload: " + state.Data);
        });
        builder.addCase(processDocument.rejected, (state, action) => {
            state.isLoading = false;
            state.Status = "failed";
            state.Error = (action.payload as string) || action.error.message || "Error processing document.";
        });
        builder.addCase(processDocumentStream.pending, (state) => {
            state.isLoading = true;
            state.Status = "loading";
            state.Error = null;
            state.phase = "starting";
            state.streamingFields = {};
        });
        builder.addCase(processDocumentStream.fulfilled, (state, action) => {
            console.log("[STREAM] Extra Reducers Setting Payload: " + action.payload);

            state.Data = action.payload;
            state.isLoading = false;
            state.Status = "succeeded";
            state.Error = null;
            state.phase = "complete";

            console.log("[STREAM] Extra Reducers has set payload: " + state.Data);
        });
        builder.addCase(processDocumentStream.rejected, (state, action) => {
            state.isLoading = false;
            state.Status = "failed";
            state.Error = (action.payload as string) || action.error.message || "Error processing document via stream.";
            state.phase = "error";
        });
        builder.addCase(generateDocument.pending, (state) => {
            state.isLoading = true;
            state.Status = "loading";
            state.Error = null;
        });
        builder.addCase(generateDocument.fulfilled, (state, action) => {
            console.log("[GENERATION] Extra Reducers Setting Payload: " + action.payload)

            state.Data = action.payload;
            state.isLoading = false;
            state.Status = "succeeded";
            state.Error = null;

            console.log("[GENERATION] Extra Reducers has set payload: " + state.Data);
        });
        builder.addCase(generateDocument.rejected, (state, action) => {
            state.isLoading = false;
            state.Status = "failed";
            state.Error = (action.payload as string) || action.error.message || "Error generating document.";
        });
    },
},
);

export const { clearSession,
    setSession,
    cancelSession,
    resetSessionStatus,
    setPhase,
    updateStreamingField,
    resetStreaming,
} = sessionSlice.actions;

export default sessionSlice.reducer;
