"use client";

import LoadingPage from "@/app/loading";
import { persistor, store } from "@/redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <PersistGate loading={<LoadingPage />} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    );
}
