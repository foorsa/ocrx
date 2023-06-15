import { SET_STEP, RESET_STEP, NEXT_STEP, PREVIOUS_STEP } from "@/redux/actions/stepActions";
import { initialState } from "../initialState";
import { Steps } from "../types/states/Step";
import { toast } from "react-hot-toast";


export const stepReducer = (state = initialState.step, action: { type: string; payload: any; }) => {
    switch (action.type) {
        case SET_STEP:
            return action.payload
        case RESET_STEP:
            return Steps.Upload;
        // Logical Step Actions
        case NEXT_STEP:
            // If the current step is the last step, return the first step
            if (state === Steps.Finish) {
                return Steps.Upload;
            }
            // Otherwise, do more logical stuff
            switch (state) {
                case Steps.Upload:
                    return Steps.Correct;
            }


        default:
            return state;
    }
};

export default stepReducer;
