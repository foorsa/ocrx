import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { fileReducer } from "./reducers/fileReducer";
import { stepReducer } from "./reducers/stepReducer";
import { documentTypeReducer } from "./reducers/documentTypeReducer";
import { processReducer } from "./reducers/processReducer";
import sessionReducer from "./reducers/sessionReducer";
import searchReducer from "./slices/searchSlice";

// Configure Redux Persist
const persistConfig = {
    key: 'root',
    storage,
};

const rootReducer = combineReducers({
    file: fileReducer,
    step: stepReducer,
    documentType: documentTypeReducer,
    process: processReducer,
    session: sessionReducer,
    search: searchReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store
export const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
    })
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