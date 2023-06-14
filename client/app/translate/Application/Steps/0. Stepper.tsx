import React from "react";
import { Check, DocumentCode2, DocumentDownload } from "iconsax-react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { Steps } from "@/redux/types/states/Step";
import { setStep } from "@/redux/actions/stepActions";

export default function Stepper() {
    const dispatch = useAppDispatch();
    const Step = useAppSelector((state) => state.step);
    const getStepClass = (step: Steps) => {
        if (Step === step || Step === Steps.Finish || Step === Steps.Correct) {
            return "text-violet-600 dark:text-violet-500";
        }
        return "";
    };

    const getAfterClass = (step: Steps) => {
        let Apply: boolean = false;

        // Apply the class if the current step is the same as the step passed in or the next step
        if (step === Steps.Upload) {
            if (Step == Steps.Upload) {
                Apply = false;
            } else if (Step == Steps.Correct) {
                Apply = true;
            } else if (Step == Steps.Finish) {
                Apply = true;
            }
        } else if (step === Steps.Correct) {
            if (Step == Steps.Upload) {
                Apply = false;
            } else if (Step == Steps.Correct) {
                Apply = false;
            } else if (Step == Steps.Finish) {
                Apply = true;
            }
        } else if (step === Steps.Finish) {
            if (Step == Steps.Upload) {
                Apply = false;
            } else if (Step == Steps.Correct) {
                Apply = false;
            } else if (Step == Steps.Finish) {
                Apply = true;
            }
        } else {
            Apply = false;
        }

        if (Apply === true) {
            return `after:border-violet-300 after:border-4 after:inline-block dark:after:border-violet-800`;
        }
        return `after:border-gray-100 after:border-4 after:inline-block dark:after:border-gray-700`;
    };

    const handleClick = (step: Steps) => {
        if (step === Steps.Upload) {
            dispatch(setStep(Steps.Upload));
        } else if (step === Steps.Correct) {
            dispatch(setStep(Steps.Correct));
        } else if (step === Steps.Finish) {
            dispatch(setStep(Steps.Finish));
        }
    };

    return (
        <ol className="flex items-center justify-center w-full mb-4 sm:mb-5">
            <li
                className={`flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-4 after:inline-block flex-grow-1 ${getStepClass(
                    Steps.Upload
                )} ${getAfterClass(Steps.Upload)}`}
                onClick={() => handleClick(Steps.Upload)}
            >
                <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${
                        Step === Steps.Upload ||
                        Step === Steps.Correct ||
                        Step === Steps.Finish
                            ? "bg-violet-500 dark:bg-violet-800"
                            : "bg-gray-100 dark:bg-gray-700"
                    }`}
                >
                    <DocumentCode2
                        color="currentColor"
                        variant="Bulk"
                        className={`w-5 h-5 text-${
                            Step === Steps.Upload ||
                            Step === Steps.Correct ||
                            Step === Steps.Finish
                                ? "white"
                                : "violet-600"
                        } lg:w-6 lg:h-6 dark:text-violet-300`}
                    />
                </div>
            </li>
            <li
                className={`flex w-full items-center after:content-[''] after:w-full after:h-1 flex-grow-1 after:border-b ${getStepClass(
                    Steps.Correct
                )} ${getAfterClass(Steps.Correct)}`}
                onClick={() => handleClick(Steps.Correct)}
            >
                <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${
                        Step === Steps.Correct || Step === Steps.Finish
                            ? "bg-violet-500 dark:bg-violet-800"
                            : "bg-gray-100 dark:bg-gray-700"
                    }`}
                >
                    <Check
                        color="currentColor"
                        variant="Bulk"
                        className={`w-5 h-5 text-${
                            Step === Steps.Correct || Step === Steps.Finish
                                ? "white"
                                : "violet-600"
                        } lg:w-6 lg:h-6 dark:text-violet-300`}
                    />
                </div>
            </li>
            <li className="flex items-center flex-grow-0 flex-shrink">
                <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 ${
                        Step === Steps.Finish
                            ? "bg-violet-500 dark:bg-violet-800"
                            : "bg-gray-100 dark:bg-gray-700"
                    }`}
                    onClick={() => handleClick(Steps.Finish)}
                >
                    <DocumentDownload
                        color="currentColor"
                        variant="Bulk"
                        className={`w-5 h-5 text-${
                            Step === Steps.Finish ? "white" : "violet-600"
                        } lg:w-6 lg:h-6 dark:text-violet-300`}
                    />
                </div>
            </li>
        </ol>
    );
}
