import React from "react";
import { Check, DocumentCode2, DocumentDownload } from "iconsax-react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { Steps } from "@/redux/types/states/Step";
import { setStep } from "@/redux/actions/stepActions";
import { AnimatePresence, motion } from "framer-motion";

export default function Stepper() {
    const dispatch = useAppDispatch();
    const step = useAppSelector((state) => state.step);

    const handleClick = (selectedStep: Steps) => {
        dispatch(setStep(selectedStep));
    };

    return (
        <AnimatePresence mode="popLayout">
            <ol className="flex items-center justify-center w-full mb-4 sm:mb-5">
                <li
                    className={`flex w-full items-center flex-grow-1 ${
                        step === Steps.Upload
                            ? "text-emerald-600 dark:text-emerald-500"
                            : ""
                    }`}
                    onClick={() => handleClick(Steps.Upload)}
                >
                    <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${
                            step === Steps.Upload ||
                            step === Steps.Correct ||
                            step === Steps.Finish
                                ? "bg-emerald-500 dark:bg-emerald-800"
                                : "bg-zinc-100 dark:bg-zinc-900"
                        }`}
                    >
                        <DocumentCode2
                            color="currentColor"
                            variant="Bulk"
                            className={`w-5 h-5 text-${
                                step === Steps.Upload ||
                                step === Steps.Correct ||
                                step === Steps.Finish
                                    ? "white"
                                    : "emerald-600"
                            } lg:w-6 lg:h-6 dark:text-emerald-300`}
                        />
                    </div>
                    <div className="relative h-[10px] w-full inline-block bg-zinc-100 dark:bg-zinc-900">
                        {step !== Steps.Upload && (
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                exit={{ width: 0 }}
                                transition={{ duration: 0.5 }}
                                className="absolute top-0 left-0 h-full bg-emerald-500 dark:bg-emerald-800"
                            />
                        )}
                    </div>
                </li>
                <li
                    className={`flex w-full items-center flex-grow-1 ${
                        step === Steps.Correct
                            ? "text-emerald-600 dark:text-emerald-500"
                            : ""
                    }`}
                    onClick={() => handleClick(Steps.Correct)}
                >
                    <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${
                            step === Steps.Correct || step === Steps.Finish
                                ? "bg-emerald-500 dark:bg-emerald-800"
                                : "bg-zinc-100 dark:bg-zinc-900"
                        }`}
                    >
                        <Check
                            color="currentColor"
                            variant="Bulk"
                            className={`w-5 h-5 text-${
                                step === Steps.Correct || step === Steps.Finish
                                    ? "white"
                                    : "emerald-600"
                            } lg:w-6 lg:h-6 dark:text-emerald-300`}
                        />
                    </div>
                    <div className="relative h-[10px] w-full inline-block bg-zinc-100 dark:bg-zinc-900">
                        {step === Steps.Finish && (
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                exit={{ width: 0 }}
                                transition={{ duration: 0.5 }}
                                className="absolute top-0 left-0 h-full bg-emerald-500 dark:bg-emerald-800"
                            />
                        )}
                    </div>
                </li>
                <motion.li className="flex items-center flex-grow-0 flex-shrink">
                    <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 ${
                            step === Steps.Finish
                                ? "bg-emerald-500 dark:bg-emerald-800"
                                : "bg-zinc-100 dark:bg-zinc-900"
                        }`}
                        onClick={() => handleClick(Steps.Finish)}
                    >
                        <DocumentDownload
                            color="currentColor"
                            variant="Bulk"
                            className={`w-5 h-5 text-${
                                step === Steps.Finish ? "white" : "emerald-600"
                            } lg:w-6 lg:h-6 dark:text-emerald-300`}
                        />
                    </div>
                </motion.li>
            </ol>
        </AnimatePresence>
    );
}
