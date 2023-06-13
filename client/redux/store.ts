import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';

// Define the initial state of our store
enum Steps {
    Upload = 'Upload',
    Translate = 'Translate',
    Validate = 'Validate',
}

// Export
export { Steps };

interface IState {
    File: File | null;
    DocType: string | null;
    Step: Steps;
}

const initialState: IState = {
    File: null,
    DocType: null,
    Step: Steps.Upload,
};

// Define reducer function
function rootReducer(state = initialState, action: { type: string; payload: any }) {
    switch (action.type) {
        case 'SET_FILE':
            return {
                ...state,
                File: action.payload,
            };
        case 'SET_DOCTYPE':
            return {
                ...state,
                DocType: action.payload,
            };
        case 'SET_STEP':
            return {
                ...state,
                Step: action.payload,
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
    devTools: process.env.NODE_ENV !== 'production',
    middleware: [thunk],
});

// Initialize Redux Persist
export const persistor = persistStore(store);
