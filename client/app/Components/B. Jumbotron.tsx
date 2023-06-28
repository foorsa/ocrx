"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight3, Translate, VideoSquare } from "iconsax-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { TypeAnimation } from "react-type-animation";

export default function Jumbotron() {
    const Pathname = usePathname();

    const Variants = {
        Initial: {
            opacity: 0,
            y: 20,
        },
        Enter: {
            opacity: 1,
            y: 0,
        },
        Exit: {
            opacity: 0,
            y: 20,
        },
    };

    return (
        <div className="p-10 mx-auto max-w-screen-xl text-center lg:py-16 flex flex-col justify-center items-center">
            <AnimatePresence mode="wait">
                <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                    <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-zinc-900/25 hover:ring-zinc-900/50 dark:text-gray-100 dark:ring-zinc-100/25 dark:hover:ring-zinc-100/50">
                        {/* Alpha Version */}
                        Web App is currently in{" "}
                        <Link
                            href="/"
                            className="font-semibold text-purple-600 
                            dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-600
                            "
                        >
                            <span
                                className="absolute inset-0"
                                aria-hidden="true"
                            ></span>
                            Alpha
                            <ArrowRight3
                                className="inline-block w-4 h-4 ml-1"
                                color="currentColor"
                                variant="Bulk"
                            />
                        </Link>
                    </div>
                </div>
                <motion.h1
                    initial="Initial"
                    animate="Enter"
                    exit="Exit"
                    variants={Variants}
                    transition={{ delay: 0, type: "spring", bounce: 0 }}
                    className="mb-10 text-4xl font-bold tracking-tight sm:text-6xl mb-4 leading-none text-zinc-900 md:text-6xl lg:text-6xl dark:text-white"
                >
                    The AI-powered successor to <br />
                    <span className="relative inline-block px-2 py-px text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-rose-500 dark:from-purple-400 dark:to-rose-400">
                        Document{" "}
                    </span>
                    <TypeAnimation
                        sequence={["Translation", 3000, "Generation", 2000]}
                        wrapper="span"
                        cursor={true}
                        repeat={Infinity}
                        // className="relative inline-block px-2 py-px text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-rose-500 dark:from-purple-400 dark:to-rose-400"
                    />
                </motion.h1>
                <motion.p
                    initial="Initial"
                    animate="Enter"
                    exit="Exit"
                    variants={Variants}
                    transition={{ delay: 0.25, type: "spring", bounce: 0 }}
                    className="mb-10 text-md leading-6 text-zinc-800 max-w-4xl dark:text-purple-100 text-opacity-75 dark:text-opacity-75"
                >
                    Experience seamless translations and document generation
                    with OCRX. Our AI-driven solution streamlines language
                    conversion and automates document creation, boosting
                    productivity while saving time and costs.
                </motion.p>
                <motion.div
                    initial="Initial"
                    animate="Enter"
                    exit="Exit"
                    variants={Variants}
                    transition={{ delay: 0.5, type: "spring", bounce: 0 }}
                    className="flex flex-wrap items-center justify-center gap-x-6"
                >
                    <Link
                        href="/app"
                        className="w-full md:w-auto inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-purple-600 hover:bg-purple-800"
                    >
                        <span className="mr-2 text-md font-semibold">
                            Translate
                        </span>
                        <Translate variant="Bulk" color="currentColor" />
                    </Link>
                    <Link
                        href="/#Guideline"
                        className="w-full md:w-auto mt-4 md:mt-0 inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center rounded-lg text-purple-800 bg-purple-600/25 hover:bg-purple-600/50 dark:text-purple-800 dark:bg-purple-300/50 dark:hover:bg-purple-300/75"
                    >
                        <span className="mr-2 text-md font-semibold">
                            Guideline
                        </span>
                        <VideoSquare variant="Bulk" color="currentColor" />
                    </Link>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
