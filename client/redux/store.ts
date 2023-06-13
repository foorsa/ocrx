import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Define the initial state of our store (Type)

// Enum properties for the Step
enum Steps {
    Upload = "Upload",
    Translate = "Translate",
    Validate = "Validate"
}

export { Steps };

export interface IState {
    File: File | null;
    DocType: string | null;
    Step: Steps;
}

// Define initial state
const initialState: IState = {
    File: null,
    DocType: null,
    Step: Steps.Upload,
};

// Define reducer function
function rootReducer(state = initialState, action: { type: string; payload: any }) {
    switch (action.type) {
        case "SET_FILE":
            return {
                ...state,
                File: action.payload
            };
        case "SET_DOCTYPE":
            return {
                ...state,
                DocType: action.payload
            };
        case "SET_STEP":
            return {
                ...state,
                Step: action.payload
            };
        default:
            return state;
    }
}

// Configure Redux Persist
const persistConfig = {
    key: 'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store
export const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== "production",
    middleware: [thunk],
});

// Initialize Redux Persist
export const persistor = persistStore(store);

// Export the store and persistor
export default { store, persistor };

// Root State 
export type RootState = ReturnType<typeof store.getState>;

// Root Dispatch
export type RootDispatch = ReturnType<typeof store.dispatch>;

// App Dispatch
export type AppDispatch = typeof store.dispatch;
