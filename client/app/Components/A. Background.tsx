"use client";

import React from "react";
import StarsBackground from "./Layout/StarsBackground";

import Colors from "tailwindcss/colors";

interface Props {
    Variant?: "Home" | "App";
}

export default function Background({ Variant }: Props) {
    return (
        <div
            className="absolute h-full w-screen min-h-screen top-0 left-0 right-0 bottom-0 bg-white dark:bg-black bg-opacity-0 dark:bg-opacity-60 -z-50  overflow-hidden"
            id="Background"
        >
            {Variant == "Home" ? (
                <>
                    <StarsBackground />
                    {/* Bottom Center - Wide purple Gradient */}
                    {/* Division for Blurry Elements */}
                    <div className="absolute h-full w-full min-h-full top-0 left-0 right-0 bottom-0 -z-50 opacity-60 dark:opacity-100">
                        <div className="absolute w-3/5 h-3/5 bottom-0 left-1/2 -translate-x-1/2 rounded-full blur-3xl bg-gradient-to-b from-transparent via-purple-800 to-purple-400 -z-50 dark:from-transparent dark:via-purple-800 dark:to-purple-400"></div>

                        {/* Bottom Center - Light purple */}
                        <div className="absolute w-1/5 h-2/5 bottom-0 left-1/2 -translate-x-1/2 rounded-full blur-3xl bg-gradient-to-b from-transparent via-purple-500 to-purple-50 -z-50 dark:from-transparent dark:via-purple-500 dark:to-purple-50"></div>

                        {/* Bottom Center - Middle White */}
                        <div className="absolute w-1/5 h-2/5 -bottom-1/2 -translate-y-full left-1/2 -translate-x-1/2 rounded-full blur-3xl bg-gradient-to-b from-transparent via-zinc-200 to-zinc-50 -z-50 dark:from-transparent dark:via-zinc-200 dark:to-zinc-50"></div>

                        {/* Top Middle Left */}
                        <div className="absolute w-1/2 h-1/5 top-1/4 left-2/4 -translate-x-1/2 rotate-45 blur-3xl bg-rose-500 bg-opacity-60 -z-0 dark:bg-opacity-80 dark:bg-rose-500"></div>

                        {/* Bottom Right */}
                        <div className="absolute w-1/2 h-1/5 -bottom-0 right-0 blur-3xl bg-purple-500 bg-opacity-60 -z-0 dark:bg-opacity-80 dark:bg-purple-500"></div>
                    </div>
                </>
            ) : (
                <>
                    <div className="absolute h-full w-full min-h-full top-0 left-0 right-0 bottom-0 -z-50 opacity-60 dark:opacity-100 max-h-screen">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1440"
                            height="450"
                            className="absolute -top-1/4 -left-1/5 right-0 -z-50 dark:opacity-100 blur-2xl"
                        >
                            <defs>
                                <linearGradient
                                    id="a"
                                    x1="19.609%"
                                    x2="50%"
                                    y1="14.544%"
                                    y2="100%"
                                >
                                    <stop
                                        offset="0%"
                                        stop-color={Colors.rose[500]}
                                    />
                                    <stop
                                        offset="100%"
                                        stop-color={Colors.rose[500]}
                                        stop-opacity="0"
                                    />
                                </linearGradient>
                                <linearGradient
                                    id="b"
                                    x1="50%"
                                    x2="19.609%"
                                    y1="100%"
                                    y2="14.544%"
                                >
                                    <stop
                                        offset="0%"
                                        stop-color={Colors.purple[500]}
                                    />
                                    <stop
                                        offset="100%"
                                        stop-color={Colors.rose[500]}
                                        stop-opacity="0"
                                    />
                                </linearGradient>
                            </defs>
                            <g fill="none" fill-rule="evenodd">
                                <path
                                    fill="url(#a)"
                                    d="m473 23 461 369-284 58z"
                                />
                                <path
                                    fill="url(#b)"
                                    d="m259 0 461 369-284 58z"
                                />
                            </g>
                        </svg>
                    </div>
                </>
            )}
        </div>
    );
}
