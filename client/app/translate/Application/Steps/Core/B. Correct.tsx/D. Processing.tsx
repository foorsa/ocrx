import { setProcess } from "@/redux/actions/processActions";
import { nextStep } from "@/redux/actions/stepActions";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React, { useEffect, useState } from "react";

const ProcessSteps = [
    // Steps for the processing PDF Generation
    {
        isLoading: true,
        name: "Generating PDF",
        description: "Generating PDF from the JSON output...",
        duration: 1000, // Duration in milliseconds for this step
    },
    {
        isLoading: true,
        name: "Downloading PDF",
        description: "Downloading the PDF file...",
        duration: 1500,
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
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {ProcessSteps[FakeProcess]?.name}
            </h5>

            <p className="mb-6 text-xs font-normal text-gray-700 dark:text-gray-400">
                {ProcessSteps[FakeProcess]?.description}
            </p>
        </div>
    );
}
