import { SessionAction, SET_SESSION, CLEAR_SESSION } from '@/redux/types/actions/sessionActionTypes';
import { Session } from '@/redux/types/states/Session';

// Set session action creator
export const setSession = (session: Session): SessionAction => ({
    type: SET_SESSION,
    payload: session,
});

// Clear session action creator
export const clearSession = (): SessionAction => ({
    type: CLEAR_SESSION,
});
