import { createContext, useContext } from "react";

export const LayoutRouterContext = createContext(null);

export function useLayoutRouterContext() {
    return useContext(LayoutRouterContext);
}
