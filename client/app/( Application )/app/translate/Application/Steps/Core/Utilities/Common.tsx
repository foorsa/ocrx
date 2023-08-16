import { useAppSelector } from "@/redux/hooks";
import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import Image from "next/image";

// JSON
import BusinessWomanAnimation from "@/public/animations/Business Woman.json";
import Designer from "@/public/animations/Designer.json";
import FemaleBloggerAnimation from "@/public/animations/Female Blogger.json";
import FindingDocumentsAnimation from "@/public/animations/Finding Documents.json";
import GoogleDocsAnimation from "@/public/animations/Google Docs.json";
import GoogleTranslateAnimation from "@/public/animations/Google Translate.json";
import MeetingAnimation from "@/public/animations/Meeting.json";
import PhotographerAnimation from "@/public/animations/Photographer.json";
import TravelerAnimation from "@/public/animations/Traveler.json";

// SVG
import Beach from "@/public/svg/Beach.svg";
import Eiffel from "@/public/svg/Eiffel.svg";
import Lakes from "@/public/svg/Lakes.svg";
import London from "@/public/svg/London.svg";
import NewYork from "@/public/svg/New York.svg";
import NightCity from "@/public/svg/Night City.svg";
import Presentation from "@/public/svg/Presentation.svg";
import Sunset from "@/public/svg/Sunset.svg";
import Underwater from "@/public/svg/Underwater.svg";

type ScreenType = {
    name: string;
    description: string;
};

type ScreenAssetType = {
    source: any;
    type: "svg" | "json";
};

type ScreensType = ScreenType[];

type ScreensAssetType = ScreenAssetType[];

export default function LoadingScreens({
    Type,
}: {
    Type: "Processing" | "Generating";
}) {
    const isLoading = useAppSelector((state) => state.session.isLoading);
    const [Process, setProcess] = useState<number>(0);
    const [AssetsProcess, setAssetsProcess] = useState<number>(0);

    const Screens =
        Type === "Processing" ? ProcessingScreens : GenerationScreens;

    const ShuffledAssets: ScreensAssetType = Assets.sort(
        () => Math.random() - 0.5
    );

    const ShuffledScreens: ScreensType = Screens.sort(
        () => Math.random() - 0.5
    );
    useEffect(() => {
        if (isLoading) {
            const timer = setTimeout(() => {
                setProcess((prev) => (prev + 1) % Screens.length);
                setAssetsProcess((prev) => (prev + 1) % ShuffledAssets.length);
            }, Math.max(5000)); // Change Screen every 2 seconds

            return () => clearTimeout(timer);
        }
    }, [isLoading, Process]);

    return (
        <div className="relative w-full">
            <div className="relative w-full h-auto flex flex-col justify-center items-center min-h-36 mb-6">
                {ShuffledAssets[AssetsProcess].type === "svg" ? (
                    <Image
                        className="w-2/3 h-auto bg-transparent object-contain"
                        src={ShuffledAssets[AssetsProcess].source}
                        alt="Loading Screen"
                    />
                ) : (
                    <Lottie
                        className="w-2/3 h-auto bg-transparent"
                        animationData={Assets[AssetsProcess].source}
                        loop
                        autoplay
                        allowTransparency={true}
                    />
                )}
            </div>
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                {ShuffledScreens[Process]?.name}
            </h5>
            <p className="mb-6 text-xs font-normal text-zinc-700 dark:text-zinc-400">
                {ShuffledScreens[Process]?.description}
            </p>
        </div>
    );
}

const Assets: ScreensAssetType = [
    {
        source: Beach,
        type: "svg",
    },
    {
        source: Eiffel,
        type: "svg",
    },
    {
        source: Lakes,
        type: "svg",
    },
    {
        source: London,
        type: "svg",
    },
    {
        source: NewYork,
        type: "svg",
    },
    {
        source: NightCity,
        type: "svg",
    },
    {
        source: Presentation,
        type: "svg",
    },
    {
        source: Sunset,
        type: "svg",
    },
    {
        source: Underwater,
        type: "svg",
    },
    {
        source: BusinessWomanAnimation,
        type: "json",
    },
    {
        source: Designer,
        type: "json",
    },
    {
        source: FemaleBloggerAnimation,
        type: "json",
    },
    {
        source: MeetingAnimation,
        type: "json",
    },
    {
        source: PhotographerAnimation,
        type: "json",
    },
    {
        source: TravelerAnimation,
        type: "json",
    },
];

const ProcessingScreens: ScreensType = [
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
];

const GenerationScreens: ScreensType = [
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
];
