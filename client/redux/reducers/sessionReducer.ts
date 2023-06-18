import { Session } from '@/redux/types/states/Session';
import { SessionAction, SET_SESSION, CLEAR_SESSION } from '@/redux/types/actions/sessionActionTypes';


const initialState: Session = {
    sessionId: '',
};

const sessionReducer = (state = initialState, action: SessionAction): Session => {
    switch (action.type) {
        case SET_SESSION:
            return action.payload;
        case CLEAR_SESSION:
            return initialState;
        default:
            return state;
    }
};

export default sessionReducer;
