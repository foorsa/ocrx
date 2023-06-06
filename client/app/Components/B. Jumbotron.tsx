import Link from "next/link";
import React from "react";

export default function Jumbotron() {
    return (
        <section className="">
            <div className="p-10 mx-auto max-w-screen-xl text-center lg:py-16">
                <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 sm:text-6xl md:text-6xl lg:text-6xl dark:text-white">
                    The AI-powered successor to{" "}
                    <span className="relative inline-block px-2 py-px text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-blue-500 dark:from-violet-400 dark:to-blue-400">
                        Document Translation
                    </span>
                </h1>
                <p className="mb-8 text-lg font-normal text-violet-950 lg:text-xl sm:px-12 lg:px-48 dark:text-violet-100 text-opacity-75 dark:text-opacity-75">
                    Experience seamless translation with OCRX - Foorsa
                    Translations. Effortlessly translate text from one language
                    to another with accuracy and speed. Join our beta testing
                    phase and be a part of refining this revolutionary
                    translation app.
                </p>
                <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
                    <Link
                        href="/translate"
                        className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:ring-violet-300 dark:focus:ring-violet-900"
                    >
                        Translate
                        <svg
                            aria-hidden="true"
                            className="ml-2 -mr-1 w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                clip-rule="evenodd"
                            ></path>
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
