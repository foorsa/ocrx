// Global Type for the Redux Store

import { Steps } from "@/redux/types/states/Step";


// The IState interface is used to define the shape of the state object in the Redux store.

export interface IState {
    file: File | null;
    step: Steps | null | string;
    documentType: string | null;
}