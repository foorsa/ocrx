// sessionSlice.js

import { createSlice } from '@reduxjs/toolkit';
import { Session as SessionType } from '@/redux/types/states/Session';
import { initializeSession } from '@/redux/actions/sessionActions';
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
    name: 'Session',
    initialState,
    reducers: {
        clearSession: (state) => {
            toast.success("Session cleared successfully.");
            console.log("State Before: ", state);

            state = {
                Data: null,
                isLoading: false,
                Status: "idle",
                Error: null,
            };

            return state;
        },
        setSession: (state, action) => {
            toast.success("Session set successfully.");
            console.log("State Before: ", state);

            state = {
                Data: action.payload,
                isLoading: false,
                Status: "succeeded",
                Error: null,
            };

            console.log("State After: ", state);
            return state;
        },
        // Cancel Operation
        cancelSession: (state) => {
            toast.success("Session cancelled successfully.");
            console.log("State Before: ", state);

            // Abort the request
            state = {
                Data: null,
                isLoading: false,
                Status: "idle",
                Error: null,
            };

            console.log("State After: ", state);
            return state;
        },
    },
    extraReducers(builder) {
        builder.addCase(initializeSession.pending, (state) => {
            state.isLoading = true;
            state.Status = "loading";
        });
        builder.addCase(initializeSession.fulfilled, (state, action) => {
            state.isLoading = false;
            state.Status = "succeeded";
            state.Data = action.payload;
        });
        builder.addCase(initializeSession.rejected, (state, action) => {
            state.isLoading = false;
            state.Status = "failed";
            state.Error = action.error.message || null;
        });
    },
},
);

export const { clearSession,
    setSession,
    cancelSession
} = sessionSlice.actions;

export default sessionSlice.reducer;
