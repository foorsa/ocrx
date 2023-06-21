import React from "react";
import { Check, DocumentCode2, DocumentDownload } from "iconsax-react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { Steps } from "@/redux/types/states/Step";
import { setStep } from "@/redux/actions/stepActions";
import { AnimatePresence, motion } from "framer-motion";

export default function Stepper() {
    const dispatch = useAppDispatch();
    const Step = useAppSelector((state) => state.step);
    const getStepClass = (step: Steps) => {
        if (Step === step || Step === Steps.Finish || Step === Steps.Correct) {
            return "text-emerald-600 dark:text-emerald-500";
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

        return Apply;
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

    const AfterVariant = {
        inactive: {
            width: "0%",
            // visibility: "hidden",
        },
        active: {
            width: "100%",
            // visibility: "visible",
        },
    };

    return (
        <ol className="flex items-center justify-center w-full mb-4 sm:mb-5">
            <li
                className={`flex w-full items-center flex-grow-1 ${getStepClass(
                    Steps.Upload
                )}          
                `}
                onClick={() => handleClick(Steps.Upload)}
            >
                <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${
                        Step === Steps.Upload ||
                        Step === Steps.Correct ||
                        Step === Steps.Finish
                            ? "bg-emerald-500 dark:bg-emerald-800"
                            : "bg-zinc-100 dark:bg-zinc-900"
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
                                : "emerald-600"
                        } lg:w-6 lg:h-6 dark:text-emerald-300`}
                    />
                </div>
                <AnimatePresence initial={false} mode="sync" custom={Step}>
                    {!getAfterClass(Steps.Upload) && (
                        <motion.div
                            variants={AfterVariant}
                            initial={
                                Step === Steps.Upload ? "visible" : "hidden"
                            }
                            animate={
                                Step === Steps.Upload ? "hidden" : "visible"
                            }
                            exit={Step === Steps.Upload ? "visible" : "hidden"}
                            transition={{ duration: 0.5 }}
                            className="relative h-1 border-b border-4 inline-block border-zinc-100 dark:border-zinc-900"
                        />
                    )}
                    {getAfterClass(Steps.Upload) && (
                        <motion.div
                            variants={AfterVariant}
                            initial={
                                Step === Steps.Upload ? "hidden" : "visible"
                            }
                            animate={
                                Step === Steps.Upload ? "hidden" : "visible"
                            }
                            exit={Step === Steps.Upload ? "hidden" : "visible"}
                            transition={{ duration: 0.5 }}
                            className="relative h-1 border-b border-4 inline-block border-emerald-300 dark:border-emerald-800"
                        />
                    )}
                </AnimatePresence>
            </li>
            <li
                className={`flex w-full items-center flex-grow-1 ${getStepClass(
                    Steps.Correct
                )}`}
                onClick={() => handleClick(Steps.Correct)}
            >
                <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${
                        Step === Steps.Correct || Step === Steps.Finish
                            ? "bg-emerald-500 dark:bg-emerald-800"
                            : "bg-zinc-100 dark:bg-zinc-900"
                    }`}
                >
                    <Check
                        color="currentColor"
                        variant="Bulk"
                        className={`w-5 h-5 text-${
                            Step === Steps.Correct || Step === Steps.Finish
                                ? "white"
                                : "emerald-600"
                        } lg:w-6 lg:h-6 dark:text-emerald-300`}
                    />
                </div>
            </li>
            <motion.li className="flex items-center flex-grow-0 flex-shrink">
                <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 ${
                        Step === Steps.Finish
                            ? "bg-emerald-500 dark:bg-emerald-800"
                            : "bg-zinc-100 dark:bg-zinc-900"
                    }`}
                    onClick={() => handleClick(Steps.Finish)}
                >
                    <DocumentDownload
                        color="currentColor"
                        variant="Bulk"
                        className={`w-5 h-5 text-${
                            Step === Steps.Finish ? "white" : "emerald-600"
                        } lg:w-6 lg:h-6 dark:text-emerald-300`}
                    />
                </div>
            </motion.li>
        </ol>
    );
}
