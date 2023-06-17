import { setProcess } from "@/redux/actions/processActions";
import { nextStep } from "@/redux/actions/stepActions";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React, { useEffect } from "react";

const ProcessSteps = [
    {
        isLoading: true,
        name: "Uploading File",
        description: "Uploading your file to the server...",
        duration: 1000, // Duration in milliseconds for this step
    },
    {
        isLoading: true,
        name: "Extracting Text",
        description: "Extracting text from your file...",
        duration: 1500,
    },
    {
        isLoading: true,
        name: "Processing Text",
        description: "Processing text from your file...",
        duration: 2000,
    },
    {
        isLoading: true,
        name: "Translating Text",
        description: "Translating text from your file to English...",
        duration: 1000,
    },
    {
        isLoading: true,
        name: "Correcting Output",
        description: "Correcting output from the OCR with AI...",
        duration: 1000,
    },
    {
        isLoading: true,
        name: "Converting to JSON",
        description: "Converting the output to JSON format...",
        duration: 2500,
    },
    {
        isLoading: true,
        name: "Formatting JSON",
        description: "Formatting the JSON output to a readable format...",
        duration: 1000,
    },
    {
        isLoading: true,
        name: "Done!",
        description: "Your file has been processed successfully.",
        duration: 3000,
    },
];

export default function Processing() {
    const dispatch = useAppDispatch();
    const processing = useAppSelector((state) => state.process);

    useEffect(() => {
        if (processing?.name !== "Hang on!") {
            const currentStepIndex = ProcessSteps.findIndex(
                (step) => step.name === processing?.name
            );
            if (
                currentStepIndex !== -1 &&
                currentStepIndex < ProcessSteps.length - 1
            ) {
                const currentStep = ProcessSteps[currentStepIndex];
                const nextStep = ProcessSteps[currentStepIndex + 1];

                setTimeout(() => {
                    dispatch(setProcess(nextStep));
                }, currentStep.duration);
            }
        } else {
            setTimeout(() => {
                dispatch(
                    setProcess({
                        isLoading: true,
                        name: "Hang on!",
                        description: "We are finishing the operation...",
                    })
                );
                setTimeout(() => {
                    dispatch(
                        setProcess({
                            isLoading: false,
                            name: "Hang on!",
                            description: "We are finishing the operation...",
                        })
                    );
                    dispatch(nextStep());
                }, 1000);
            }, 500);
        }
    }, [processing]);

    return (
        <div className="relative w-full">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {processing?.name}
            </h5>

            <p className="mb-6 text-xs font-normal text-gray-700 dark:text-gray-400">
                {processing?.description}
            </p>
        </div>
    );
}
