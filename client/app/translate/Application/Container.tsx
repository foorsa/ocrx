"use client";

import React from "react";
import First_DocumentUpload from "./Steps/1. Document Upload";
import Stepper from "./Steps/0. Stepper";
import { useAppSelector } from "@/redux/hooks";
import { Steps } from "@/redux/types/states/Step";
import Second_CorrectData from "./Steps/2. Fields Correction";
import Third_FinishOperation from "./Steps/3. Finish Operation";
import { AnimatePresence, motion } from "framer-motion";

const OCRX_ICON = ({ isLoading }: { isLoading: boolean }) => {
    return (
        <div
            className={`${
                isLoading && "animate-bounce"
            } relative flex justify-center items-center h-16 w-16 aspect-square mb-10 p-1 bg-white border border-zinc-200 rounded-lg shadow-2xl dark:bg-zinc-950 dark:border-zinc-700 select-none`}
        >
            <img
                src="/Logo/Gradient.png"
                className="h-2/3 w-2/3 object-fill"
                alt="Foorsa Logo"
            />
        </div>
    );
};

export default function Container() {
    const Step = useAppSelector((state) => state.step);
    const Process = useAppSelector((state) => state.process);

    const SlideToLeft =
        Step === Steps.Upload ? true : Step === Steps.Correct ? true : false;

    const slideTransition = {
        initial: { opacity: 0, x: 100 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -100 },
        transition: { duration: 0.3 },
    };

    return (
        <div className="relative flex-1 h-full w-full min-h-screen min-w-full flex text-center flex-col justify-start items-center p-5">
            <OCRX_ICON isLoading={Process.isLoading} />
            <div className="flex flex-col justify-center items-center w-full max-w-lg p-6 bg-white border border-zinc-200 rounded-lg shadow-2xl dark:bg-zinc-950 dark:border-zinc-800 overflow-hidden">
                <Stepper />
                <AnimatePresence initial={false} mode="wait">
                    {Step === Steps.Upload && (
                        <motion.div
                            key="upload"
                            {...slideTransition}
                            className="relative w-full"
                        >
                            <First_DocumentUpload />
                        </motion.div>
                    )}
                    {Step === Steps.Correct && (
                        <motion.div
                            key="correct"
                            {...slideTransition}
                            className="relative w-full"
                        >
                            <Second_CorrectData />
                        </motion.div>
                    )}
                    {Step === Steps.Finish && (
                        <motion.div
                            key="finish"
                            {...slideTransition}
                            className="relative w-full"
                        >
                            <Third_FinishOperation />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
