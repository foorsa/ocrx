import { Translate, VideoSquare } from "iconsax-react";
import Link from "next/link";
import React from "react";

export default function Jumbotron() {
    return (
        <div className="p-10 mx-auto max-w-screen-xl text-center lg:py-16">
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 sm:text-6xl md:text-6xl lg:text-6xl dark:text-white">
                The AI-powered successor to{" "}
                <span className="relative inline-block px-2 py-px text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-blue-500 dark:from-violet-400 dark:to-blue-400">
                    Document Translation
                </span>
            </h1>
            <p className="mb-8 text-lg font-normal text-violet-950 lg:text-xl sm:px-12 lg:px-48 dark:text-violet-100 text-opacity-75 dark:text-opacity-75">
                Experience seamless translation with OCRX - Foorsa Translations.
                Effortlessly translate text from one language to another with
                accuracy and speed. Join our beta testing phase and be a part of
                refining this revolutionary translation app.
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
                <Link
                    href="/translate"
                    className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-violet-600 hover:bg-violet-800"
                >
                    <span className="mr-2 text-md font-semibold">
                        Translate
                    </span>
                    <Translate variant="Bulk" color="currentColor" />
                </Link>
                {/* See the Guideline */}
                <Link
                    href="/#Guideline"
                    className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center rounded-lg text-violet-800 bg-violet-600/25 hover:bg-violet-600/50 dark:text-violet-600 dark:bg-violet-50/50 dark:hover:bg-violet-50/75"
                >
                    <span className="mr-2 text-md font-semibold">
                        Guideline
                    </span>
                    <VideoSquare variant="Bulk" color="currentColor" />
                </Link>
            </div>
        </div>
    );
}
