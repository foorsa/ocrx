import React from "react";
import { StepType, Steps } from "../Container";
import { Check, DocumentCode2, DocumentDownload } from "iconsax-react";

export default function Stepper({
    Progress,
    setProgress,
}: {
    Progress: StepType;
    setProgress: React.Dispatch<React.SetStateAction<StepType>>;
}) {
    const getStepClass = (step: Steps) => {
        if (
            Progress.Step === step ||
            Progress.Step === Steps.Validate ||
            Progress.Step === Steps.Translate
        ) {
            return "text-violet-600 dark:text-violet-500";
        }
        return "";
    };

    const getAfterClass = (step: Steps) => {
        let Apply: boolean = false;

        // Apply the class if the current step is the same as the step passed in or the next step
        if (step === Steps.Upload) {
            if (Progress.Step == Steps.Upload) {
                Apply = false;
            } else if (Progress.Step == Steps.Translate) {
                Apply = true;
            } else if (Progress.Step == Steps.Validate) {
                Apply = true;
            }
        } else if (step === Steps.Translate) {
            if (Progress.Step == Steps.Upload) {
                Apply = false;
            } else if (Progress.Step == Steps.Translate) {
                Apply = false;
            } else if (Progress.Step == Steps.Validate) {
                Apply = true;
            }
        } else if (step === Steps.Validate) {
            if (Progress.Step == Steps.Upload) {
                Apply = false;
            } else if (Progress.Step == Steps.Translate) {
                Apply = false;
            } else if (Progress.Step == Steps.Validate) {
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
        setProgress({ Step: step });
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
                        Progress.Step === Steps.Upload ||
                        Progress.Step === Steps.Translate ||
                        Progress.Step === Steps.Validate
                            ? "bg-violet-500 dark:bg-violet-800"
                            : "bg-gray-100 dark:bg-gray-700"
                    }`}
                >
                    <DocumentCode2
                        color="currentColor"
                        variant="Bulk"
                        className={`w-5 h-5 text-${
                            Progress.Step === Steps.Upload ||
                            Progress.Step === Steps.Translate ||
                            Progress.Step === Steps.Validate
                                ? "white"
                                : "violet-600"
                        } lg:w-6 lg:h-6 dark:text-violet-300`}
                    />
                </div>
            </li>
            <li
                className={`flex w-full items-center after:content-[''] after:w-full after:h-1 flex-grow-1 after:border-b ${getStepClass(
                    Steps.Translate
                )} ${getAfterClass(Steps.Translate)}`}
                onClick={() => handleClick(Steps.Translate)}
            >
                <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${
                        Progress.Step === Steps.Translate ||
                        Progress.Step === Steps.Validate
                            ? "bg-violet-500 dark:bg-violet-800"
                            : "bg-gray-100 dark:bg-gray-700"
                    }`}
                >
                    <Check
                        color="currentColor"
                        variant="Bulk"
                        className={`w-5 h-5 text-${
                            Progress.Step === Steps.Translate ||
                            Progress.Step === Steps.Validate
                                ? "white"
                                : "violet-600"
                        } lg:w-6 lg:h-6 dark:text-violet-300`}
                    />
                </div>
            </li>
            <li className="flex items-center flex-grow-0 flex-shrink">
                <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 ${
                        Progress.Step === Steps.Validate
                            ? "bg-violet-500 dark:bg-violet-800"
                            : "bg-gray-100 dark:bg-gray-700"
                    }`}
                    onClick={() => handleClick(Steps.Validate)}
                >
                    <DocumentDownload
                        color="currentColor"
                        variant="Bulk"
                        className={`w-5 h-5 text-${
                            Progress.Step === Steps.Validate
                                ? "white"
                                : "violet-600"
                        } lg:w-6 lg:h-6 dark:text-violet-300`}
                    />
                </div>
            </li>
        </ol>
    );
}
