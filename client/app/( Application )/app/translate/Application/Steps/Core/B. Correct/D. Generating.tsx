import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React, { useEffect, useState } from "react";

type GenerationStep = {
    name: string;
    description: string;
};

const GenerationSteps: GenerationStep[] = [
    {
        name: "Unlocking the magic of the Server: Document Generation in progress!",
        description:
            "Witness translations come to life as they evolve into professionally crafted files.",
    },
    {
        name: "From translations to cloud-kissed documents: A fascinating journey!",
        description:
            "Experience the seamless transformation of content into elegant, ready-to-use files.",
    },
    {
        name: "The Cloud's mastery: Document generation like never before!",
        description:
            "Watch as translations evolve into well-crafted documents with a touch of mystique.",
    },
    {
        name: "The art of precision: Document Generation at its finest!",
        description:
            "Discover the seamless process that converts translations into beautifully formatted files.",
    },
    {
        name: "The Cloud's enchantment: Translations brought to life!",
        description:
            "Explore the magic that turns translated content into professionally presented files.",
    },
    {
        name: "Embrace the allure of Server-based document generation!",
        description:
            "Immerse yourself in the beauty of translations transformed into polished files.",
    },
    {
        name: "Experience the enigma: Document Generation like never before!",
        description:
            "Witness the perfect synergy between translation and document creation.",
    },
    {
        name: "Discover the elegance: Document generation in motion!",
        description:
            "Explore the journey of translations evolving into visually appealing, high-quality files.",
    },
    {
        name: "Unveiling the Server's secrets: Document Generation in action!",
        description:
            "See how translations become beautifully presented, ready-to-share files.",
    },
    {
        name: "The Server's finesse: Crafting flawless documents!",
        description:
            "Experience the transformation of content into professionally presented, top-notch files.",
    },
    // Add more phrases as needed...
];

export default function Generating() {
    const dispatch = useAppDispatch();
    const Processing = useAppSelector((state) => state.process);
    const [FakeProcess, setFakeProcess] = useState(0);

    useEffect(() => {
        if (Processing.isLoading) {
            const timer = setTimeout(() => {
                setFakeProcess((prev) => (prev + 1) % GenerationSteps.length);
            }, Math.max(1000, Math.random() * 4000 + 1000)); // Random interval between 1 second and 5 seconds

            return () => clearTimeout(timer);
        }
    }, [Processing.isLoading, FakeProcess]);

    return (
        <div className="relative w-full">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                {GenerationSteps[FakeProcess]?.name}
            </h5>
            <p className="mb-6 text-xs font-normal text-zinc-700 dark:text-zinc-400">
                {GenerationSteps[FakeProcess]?.description}
            </p>
        </div>
    );
}
