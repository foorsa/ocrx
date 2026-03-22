// sessionSlice.js

import { createSlice } from '@reduxjs/toolkit';
import { Session as SessionType } from '@/redux/types/states/Session';
import { processDocument, processDocumentStream, generateDocument, processBatch } from '@/redux/actions/sessionActions';


export interface BatchItemProgress {
    fileId: string;
    fileName: string;
    status: "pending" | "processing" | "completed" | "failed";
    phase: string;
    session: SessionType | null;
    error: string | null;
}

export interface sessionState {
    Data: SessionType | null;
    isLoading: boolean;
    Status: "idle" | "loading" | "succeeded" | "failed";
    Error: string | null;
    phase: string;
    streamingFields: Record<string, any>;
    // Batch processing
    batchResults: SessionType[];
    batchProgress: Record<string, BatchItemProgress>;
    isBatch: boolean;
};

const initialState: sessionState = {
    Data: null,
    isLoading: false,
    Status: "idle",
    Error: null,
    phase: "idle",
    streamingFields: {},
    batchResults: [],
    batchProgress: {},
    isBatch: false,
}

const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        clearSession: () => initialState,
        setSession: (state, action) => {
            state.Data = action.payload;
            state.isLoading = false;
            state.Status = "succeeded";
            state.Error = null;
        },
        cancelSession: () => initialState,
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
        // Batch actions
        setBatchProgress: (state, action) => {
            const item: BatchItemProgress = action.payload;
            state.batchProgress[item.fileId] = item;
        },
        addBatchResult: (state, action) => {
            state.batchResults.push(action.payload);
        },
        clearBatch: (state) => {
            state.batchResults = [];
            state.batchProgress = {};
            state.isBatch = false;
        },
        // Set active session from batch results (for correction step)
        setActiveBatchSession: (state, action) => {
            const index = action.payload;
            if (state.batchResults[index]) {
                state.Data = state.batchResults[index];
            }
        },
        updateBatchResult: (state, action) => {
            const { index, session } = action.payload;
            if (state.batchResults[index]) {
                state.batchResults[index] = session;
            }
        },
    },
    extraReducers(builder) {
        builder.addCase(processDocument.pending, (state) => {
            state.isLoading = true;
            state.Status = "loading";
            state.Error = null;
        });
        builder.addCase(processDocument.fulfilled, (state, action) => {
            state.Data = action.payload;
            state.isLoading = false;
            state.Status = "succeeded";
            state.Error = null;
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
            state.Data = action.payload;
            state.isLoading = false;
            state.Status = "succeeded";
            state.Error = null;
            state.phase = "complete";
        });
        builder.addCase(processDocumentStream.rejected, (state, action) => {
            state.isLoading = false;
            state.Status = "failed";
            state.Error = (action.payload as string) || action.error.message || "Error processing document via stream.";
            state.phase = "error";
        });
        // Batch processing
        builder.addCase(processBatch.pending, (state) => {
            state.isLoading = true;
            state.Status = "loading";
            state.Error = null;
            state.isBatch = true;
            state.batchResults = [];
            state.batchProgress = {};
        });
        builder.addCase(processBatch.fulfilled, (state, action) => {
            state.isLoading = false;
            state.Status = "succeeded";
            state.Error = null;
            state.batchResults = action.payload;
        });
        builder.addCase(processBatch.rejected, (state, action) => {
            state.isLoading = false;
            state.Status = "failed";
            state.Error = (action.payload as string) || action.error.message || "Error processing batch.";
        });
        builder.addCase(generateDocument.pending, (state) => {
            state.isLoading = true;
            state.Status = "loading";
            state.Error = null;
        });
        builder.addCase(generateDocument.fulfilled, (state, action) => {
            state.Data = action.payload;
            state.isLoading = false;
            state.Status = "succeeded";
            state.Error = null;
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
    setBatchProgress,
    addBatchResult,
    clearBatch,
    setActiveBatchSession,
    updateBatchResult,
} = sessionSlice.actions;

export default sessionSlice.reducer;
