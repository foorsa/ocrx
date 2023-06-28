import { setProcess } from "@/redux/actions/processActions";
import { nextStep } from "@/redux/actions/stepActions";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React, { useEffect, useState } from "react";

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
        name: "Hang on!",
        description: "We are finishing the operation...",
        duration: 3000,
    },
];

export default function Processing() {
    const dispatch = useAppDispatch();
    const Processing = useAppSelector((state) => state.process);
    const [FakeProcess, setFakeProcess] = useState(0);

    useEffect(() => {
        if (Processing.isLoading) {
            if (FakeProcess !== ProcessSteps.length - 1) {
                setTimeout(() => {
                    setFakeProcess((prev) => prev + 1);
                }, ProcessSteps[FakeProcess].duration);
            }
        }
    }, [Processing.isLoading, FakeProcess]);

    return (
        <div className="relative w-full">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                {ProcessSteps[FakeProcess]?.name}
            </h5>

            <p className="mb-6 text-xs font-normal text-zinc-700 dark:text-zinc-400">
                {ProcessSteps[FakeProcess]?.description}
            </p>
        </div>
    );
}
