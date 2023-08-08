import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React, { useEffect, useState } from "react";

type ProcessingStep = {
    name: string;
    description: string;
};

const ProcessingSteps: ProcessingStep[] = [
    {
        name: "Translating at warp speed... Prepare for linguistic liftoff!",
        description:
            "Let the magic of translation take your documents to new heights!",
    },
    {
        name: "Did you hear that? It's the sound of language barriers breaking!",
        description:
            "Watch as our AI-powered translators bridge the gap between languages.",
    },
    {
        name: "Get ready for some translation magic! Abra-cadabra-translate!",
        description:
            "See your documents transform with the touch of our linguistic wand.",
    },
    {
        name: "Hold onto your hats! Document translation in progress!",
        description:
            "Our expert translators work tirelessly to deliver accurate results.",
    },
    {
        name: "Our translators don't need wings to fly through languages! Watch them soar!",
        description:
            "Experience the seamless translation process that knows no bounds.",
    },
    {
        name: "Unlocking the power of multilingual communication!",
        description:
            "Breaking barriers and fostering global connections, one document at a time.",
    },
    {
        name: "Translation mastery in motion!",
        description:
            "Witness the art of language conversion performed with precision.",
    },
    {
        name: "From languages to legibility in a blink of an eye!",
        description:
            "Marvel at how our technology turns complexity into clarity effortlessly.",
    },
    {
        name: "Words on a journey of transformation!",
        description:
            "Accurate translation that retains the essence of your documents.",
    },
    {
        name: "Crafting linguistic bridges for a borderless world!",
        description:
            "Join us on a quest to create seamless communication across cultures.",
    },
    // Add more phrases as needed...
];

export default function Processing() {
    const isLoading = useAppSelector((state) => state.session.isLoading);
    const [FakeProcess, setFakeProcess] = useState(0);

    useEffect(() => {
        if (isLoading) {
            const timer = setTimeout(() => {
                setFakeProcess((prev) => (prev + 1) % ProcessingSteps.length);
            }, Math.max(1000, Math.random() * 4000 + 1000)); // Random interval between 1 second and 5 seconds

            return () => clearTimeout(timer);
        }
    }, [isLoading, FakeProcess]);

    return (
        <div className="relative w-full">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                {ProcessingSteps[FakeProcess]?.name}
            </h5>
            <p className="mb-6 text-xs font-normal text-zinc-700 dark:text-zinc-400">
                {ProcessingSteps[FakeProcess]?.description}
            </p>
        </div>
    );
}
