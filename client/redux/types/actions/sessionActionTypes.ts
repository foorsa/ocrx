import { Session } from "../states/Session";

// Set session action types
export const SET_SESSION = 'SET_SESSION';

// Clear session action type
export const CLEAR_SESSION = 'CLEAR_SESSION';

// Set session action interface
export interface SetSessionAction {
    type: typeof SET_SESSION;
    payload: Session;
}

// Clear session action interface
export interface ClearSessionAction {
    type: typeof CLEAR_SESSION;
}

// Combined action type
export type SessionAction = SetSessionAction | ClearSessionAction;
