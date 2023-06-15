"use client";

import React from "react";
import First_DocumentUpload from "./Steps/1. Document Upload";
import Stepper from "./Steps/0. Stepper";
import Debugging from "./Debug/Debugging";
import { useAppSelector } from "@/redux/hooks";
import { Steps } from "@/redux/types/states/Step";
import Second_CorrectData from "./Steps/2. Fields Correction";
import Third_FinishOperation from "./Steps/3. Finish Operation";

const OCRX_ICON = ({ isLoading }: { isLoading: boolean }) => {
    return (
        <div
            className={`${
                isLoading && "animate-bounce"
            } relative flex justify-center items-center h-16 w-16 aspect-square mb-10 p-1 bg-white border border-gray-200 rounded-lg shadow-2xl dark:bg-gray-800 dark:border-gray-700 select-none`}
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
    return (
        <div className="relative flex-1 h-full w-full min-h-screen min-w-full flex text-center flex-col justify-start items-center p-5">
            <OCRX_ICON isLoading={false} />
            <div className="flex flex-col justify-center items-center max-w-xl p-6 bg-white border border-gray-200 rounded-lg shadow-2xl dark:bg-gray-800 dark:border-gray-700">
                <Stepper />
                {}
                {/* <First_DocumentUpload /> */}
                {Step == Steps.Upload && <First_DocumentUpload />}
                {Step == Steps.Correct && <Second_CorrectData />}
                {Step == Steps.Finish && <Third_FinishOperation />}
            </div>
            {/* <Debugging /> */}
        </div>
    );
}
