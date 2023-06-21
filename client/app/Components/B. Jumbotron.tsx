"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Translate, VideoSquare } from "iconsax-react";
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
                <motion.h1
                    key={Pathname}
                    initial="Initial"
                    animate="Enter"
                    exit="Exit"
                    variants={Variants}
                    transition={{ delay: 0, type: "spring", bounce: 0 }}
                    className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-zinc-900 sm:text-6xl md:text-6xl lg:text-6xl dark:text-white"
                >
                    The AI-powered successor to <br />
                    <span className="relative inline-block px-2 py-px text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-sky-500 dark:from-emerald-400 dark:to-sky-400">
                        Document{" "}
                    </span>
                    <TypeAnimation
                        sequence={["Translation", 3000, "Generation", 2000]}
                        wrapper="span"
                        cursor={true}
                        repeat={Infinity}
                        // className="relative inline-block px-2 py-px text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-sky-500 dark:from-emerald-400 dark:to-sky-400"
                    />
                </motion.h1>
                <motion.p
                    key={Pathname}
                    initial="Initial"
                    animate="Enter"
                    exit="Exit"
                    variants={Variants}
                    transition={{ delay: 0.25, type: "spring", bounce: 0 }}
                    className="mb-8 font-normal text-emerald-950 lg:text-lg sm:text-xs max-w-4xl dark:text-emerald-100 text-opacity-75 dark:text-opacity-75"
                >
                    Streamline your document generation process with OCRX - an
                    innovative solution designed to automate the creation of
                    documents. Replace manual efforts with our AI-powered
                    technology that generates accurate and professional
                    documents in seconds. Say goodbye to time-consuming tasks
                    and hello to increased productivity and cost savings.
                </motion.p>
                <motion.div
                    key={Pathname}
                    initial="Initial"
                    animate="Enter"
                    exit="Exit"
                    variants={Variants}
                    transition={{ delay: 0.5, type: "spring", bounce: 0 }}
                    className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4"
                >
                    <Link
                        href="/translate"
                        className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-emerald-600 hover:bg-emerald-800"
                    >
                        <span className="mr-2 text-md font-semibold">
                            Translate
                        </span>
                        <Translate variant="Bulk" color="currentColor" />
                    </Link>
                    <Link
                        href="/#Guideline"
                        className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center rounded-lg text-emerald-800 bg-emerald-600/25 hover:bg-emerald-600/50 dark:text-emerald-600 dark:bg-emerald-50/50 dark:hover:bg-emerald-50/75"
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
