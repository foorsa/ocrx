"use client";
import React, { useState } from "react";

export default function BetaBanner() {
    const [isBannerVisible, setBannerVisible] = useState(true);

    const closeBanner = () => {
        setBannerVisible(false);
    };

    return (
        <>
            <div
                id="sticky-banner"
                className={`sticky top-0 left-0 z-50 flex justify-between w-full p-4 border-b border-zinc-200 bg-zinc-50 dark:bg-black dark:border-zinc-700 ${
                    isBannerVisible ? "opacity-100 visible" : "opacity-0 hidden"
                } transition-opacity duration-500`}
            >
                <div className="flex items-center mx-auto">
                    <p className="flex items-center text-sm font-normal text-zinc-500 dark:text-zinc-600">
                        <span className="inline-flex p-1 mr-3 bg-zinc-200 rounded-full dark:bg-zinc-800">
                            <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                            >
                                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"></path>
                            </svg>
                            <span className="sr-only">Light bulb</span>
                        </span>
                        <span>
                            This BETA version does not represent the final
                            quality of the product.
                        </span>
                    </p>
                </div>
                <div className="flex items-center">
                    <button
                        data-dismiss-target="#sticky-banner"
                        type="button"
                        className="flex-shrink-0 inline-flex justify-center items-center text-zinc-400 hover:bg-zinc-200 hover:text-zinc-900 rounded-lg text-sm p-1.5 dark:hover:bg-zinc-600 dark:hover:text-white"
                        onClick={closeBanner}
                    >
                        <svg
                            aria-hidden="true"
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                        <span className="sr-only">Close banner</span>
                    </button>
                </div>
            </div>
        </>
    );
}
