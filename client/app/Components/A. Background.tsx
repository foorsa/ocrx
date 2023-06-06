"use client";

import React from "react";
import StarsBackground from "./Layout/StarsBackground";

export default function Background() {
    return (
        <div
            className="fixed h-screen w-screen min-h-screen top-0 left-0 right-0 bottom-0 bg-violet-950 dark:bg-gray-900 overflow-hidden bg-opacity-0 dark:bg-opacity-60 -z-50"
            id="Background"
        >
            <StarsBackground />
            {/* Bottom Center - Wide Violet Gradient */}
            {/* Division for Blurry Elements */}
            <div className="absolute h-screen w-screen min-h-screen top-0 left-0 right-0 bottom-0 -z-50 opacity-60 dark:opacity-100">
                <div className="absolute w-3/5 h-3/5 bottom-0 left-1/2 -translate-x-1/2 rounded-full blur-3xl bg-gradient-to-b from-transparent via-violet-800 to-violet-400 -z-50 dark:from-transparent dark:via-violet-800 dark:to-violet-400"></div>

                {/* Bottom Center - Light Violet */}
                <div className="absolute w-1/5 h-2/5 bottom-0 left-1/2 -translate-x-1/2 rounded-full blur-3xl bg-gradient-to-b from-transparent via-violet-500 to-violet-50 -z-50 dark:from-transparent dark:via-violet-500 dark:to-violet-50"></div>

                {/* Bottom Center - Middle White */}
                <div className="absolute w-1/5 h-2/5 -bottom-1/2 -translate-y-full left-1/2 -translate-x-1/2 rounded-full blur-3xl bg-gradient-to-b from-transparent via-gray-200 to-gray-50 -z-50 dark:from-transparent dark:via-gray-200 dark:to-gray-50"></div>

                {/* Top Middle Left */}
                <div className="absolute w-1/2 h-1/5 top-1/4 left-2/4 -translate-x-1/2 rotate-45 blur-3xl bg-blue-500 bg-opacity-60 -z-0 dark:bg-opacity-80 dark:bg-blue-500"></div>

                {/* Bottom Right */}
                <div className="absolute w-1/2 h-1/5 -bottom-0 right-0 blur-3xl bg-violet-500 bg-opacity-60 -z-0 dark:bg-opacity-80 dark:bg-violet-500"></div>
            </div>
        </div>
    );
}
