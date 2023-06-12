"use client";

import React from "react";
import First_DocumentUpload from "./Steps/1. Document Upload";
import Stepper from "./Steps/0. Stepper";

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

// Enum properties for the Step
enum Steps {
    "Upload",
    "Translate",
    "Validate",
}

export { Steps };

interface StepType {
    Step: Steps;
}

// Export properties
export type { StepType };

export default function Container() {
    // Declare Steps
    const [Progress, setProgress] = React.useState<StepType>({
        Step: Steps.Upload,
    });
    const [isLoading, setIsLoading] = React.useState(false);

    const handleNext = () => {
        if (Progress.Step === Steps.Upload) {
            setProgress({ Step: Steps.Translate });
        } else if (Progress.Step === Steps.Translate) {
            setProgress({ Step: Steps.Validate });
        } else if (Progress.Step === Steps.Validate) {
            setProgress({ Step: Steps.Upload });
        }
    };

    return (
        <div className="relative flex-1 h-full w-full min-w-full flex text-center flex-col justify-center items-center p-5">
            <OCRX_ICON isLoading={false} />
            <div className="flex flex-col justify-center items-center max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-2xl dark:bg-gray-800 dark:border-gray-700">
                <Stepper Progress={Progress} setProgress={setProgress} />
                <First_DocumentUpload />
            </div>
        </div>
    );
}
