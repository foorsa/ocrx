import { setProcess } from "@/redux/actions/processActions";
import { nextStep } from "@/redux/actions/stepActions";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React, { useEffect, useState } from "react";

const ProcessSteps = [
    {
        isLoading: true,
        name: "Finalizing your linguistic masterpiece...",
        description:
            "We're putting the finishing touches on your translated document. Almost there!",
        duration: 1000, // Duration in milliseconds for this step
    },
    {
        isLoading: true,
        name: "Polishing the translation gem...",
        description:
            "We're in the generation phase, adding the final sparkle to your document!",
        duration: 1500,
    },
    {
        isLoading: true,
        name: "Last stop: Generation Station!",
        description:
            "We're wrapping up the translation journey and preparing your document for delivery!",
        duration: 3000,
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
    const [fakeProcess, setFakeProcess] = useState(0);

    useEffect(() => {
        if (Processing.isLoading) {
            if (fakeProcess !== ProcessSteps.length - 1) {
                setTimeout(() => {
                    setFakeProcess((prev) => prev + 1);
                }, ProcessSteps[fakeProcess].duration);
            }
        }
    }, [Processing.isLoading, fakeProcess]);

    return (
        <div className="relative w-full">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                {ProcessSteps[fakeProcess]?.name}
            </h5>

            <p className="mb-6 text-xs font-normal text-zinc-700 dark:text-zinc-400">
                {ProcessSteps[fakeProcess]?.description}
            </p>
        </div>
    );
}
