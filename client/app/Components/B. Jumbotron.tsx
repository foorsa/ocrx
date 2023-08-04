"use client";

import { motion, useAnimation } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";
import {
    ArrowRight3,
    SearchNormal,
    Translate,
    VideoSquare,
} from "iconsax-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TypeAnimation } from "react-type-animation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setModal } from "@/redux/slices/searchSlice";
import Marquee from "react-fast-marquee";

export default function Jumbotron() {
    const Pathname = usePathname();
    const Dispatch = useAppDispatch();
    const Search = useAppSelector((state) => state.search);

    const textContainerRef = useRef<HTMLDivElement>(null);
    const [textContainerWidth, setTextContainerWidth] = useState(0);

    useEffect(() => {
        if (textContainerRef?.current != null) {
            setTextContainerWidth(textContainerRef?.current?.offsetWidth);
        }
    }, []);

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

    const handleClick = () => {
        Dispatch(
            setModal({
                isOpen: true,
                Document: null,
            })
        );
    };

    return (
        <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-center p-10 text-center lg:py-16">
            {/* <AnimatePresence mode="wait"> */}
            <motion.div
                initial="Initial"
                animate="Enter"
                exit="Exit"
                variants={Variants}
                transition={{ delay: 0, type: "spring", bounce: 0 }}
            >
                <Link
                    href="/app"
                    className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 bg-opacity-25 backdrop-blur-md dark:bg-opacity-25 dark:backdrop-blur-md max-w-full overflow-hidden"
                >
                    <span className="text-xs bg-blue-600 rounded-full text-white px-4 py-1.5 mr-3 h-full">
                        New
                    </span>{" "}
                    <Marquee
                        autoFill={false}
                        gradient={false}
                        speed={10}
                        delay={0.5}
                        className="flex-1 overflow-hidden relative inline-flex justify-start items-center max-w-[150px] md:max-w-[250px] text-sm font-medium whitespace-nowrap"
                    >
                        Tabular Documents Extraction was Launched! 🚀
                    </Marquee>
                    <ArrowRight3
                        className="w-4 h-4"
                        color="currentColor"
                        variant="Bulk"
                    />
                </Link>
            </motion.div>
            <motion.h1
                initial="Initial"
                animate="Enter"
                exit="Exit"
                variants={Variants}
                transition={{ delay: 0, type: "spring", bounce: 0 }}
                className="mb-4 text-4xl font-bold leading-none tracking-tight text-zinc-900 dark:text-white sm:text-6xl md:text-6xl lg:text-6xl"
            >
                The AI-powered successor to <br />
                <span className="relative inline-block bg-gradient-to-r from-blue-500 to-lime-500 bg-clip-text px-2 py-px text-transparent dark:from-blue-400 dark:to-lime-400">
                    Document{" "}
                </span>
                <TypeAnimation
                    sequence={["Translation", 3000, "Generation", 2000]}
                    wrapper="span"
                    cursor={true}
                    repeat={Infinity}
                    // className="relative inline-block px-2 py-px text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-lime-500 dark:from-blue-400 dark:to-lime-400"
                />
            </motion.h1>
            <motion.p
                initial="Initial"
                animate="Enter"
                exit="Exit"
                variants={Variants}
                transition={{ delay: 0.25, type: "spring", bounce: 0 }}
                className="text-md mb-10 max-w-4xl leading-6 text-zinc-800 text-opacity-75 dark:text-blue-100 dark:text-opacity-75"
            >
                Experience seamless translations and document generation with
                OCRX. Our AI-driven solution streamlines language conversion and
                automates document creation, boosting productivity while saving
                time and costs.
            </motion.p>
            <motion.div
                initial="Initial"
                animate="Enter"
                exit="Exit"
                variants={Variants}
                transition={{ delay: 0.5, type: "spring", bounce: 0 }}
                className="flex flex-wrap items-center justify-center gap-x-3 gap-y-3 text-zinc-800 dark:text-zinc-100"
            >
                <Link
                    href="/app"
                    className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-center text-base font-medium text-white hover:bg-blue-800 md:w-auto"
                >
                    <span className="text-md mr-2 font-semibold">
                        Translate
                    </span>
                    <Translate variant="Bulk" color="currentColor" />
                </Link>
                {/* Search Bar */}
                <div
                    className="inline-flex w-full cursor-pointer items-center justify-center md:w-auto"
                    onClick={handleClick}
                >
                    <label htmlFor="simple-search" className="sr-only">
                        Search
                    </label>
                    <div className="relative w-full" onClick={handleClick}>
                        <div className=" absolute inset-y-0 left-0 flex items-center p-5">
                            <SearchNormal
                                className="h-5 w-5"
                                color="currentColor"
                                variant="TwoTone"
                            />
                        </div>
                        <input
                            type="text"
                            className="text-md block w-full rounded-lg border border-zinc-300 bg-zinc-50/75 px-5 py-3 pl-14 text-zinc-900 hover:bg-zinc-50 focus:border-blue-500  focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-950/75 dark:text-white dark:placeholder-zinc-400 dark:hover:bg-zinc-950
                                    dark:focus:border-blue-500 dark:focus:ring-blue-500
                                "
                            placeholder="Quick search..."
                            required
                            onClick={handleClick}
                            value={Search.term}
                        />
                        <kbd
                            onClick={handleClick}
                            className="absolute right-2 top-1/2 -translate-y-1/2 transform rounded-lg border border-zinc-200 bg-zinc-100/50 px-2 py-1 text-xs font-semibold text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-300"
                        >
                            ⌘ K
                        </kbd>
                    </div>
                </div>
            </motion.div>
            {/* </AnimatePresence> */}
        </div>
    );
}
