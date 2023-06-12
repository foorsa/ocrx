"use client";

import React from "react";
import Link from "next/link";
import { LinkSquare } from "iconsax-react";

export default function Container() {
    return (
        <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-2xl dark:bg-gray-800 dark:border-gray-700">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Translate Your Document
            </h5>

            <p className="mb-6 text-xs font-normal text-gray-700 dark:text-gray-400">
                Begin the translation process by selecting the type of document
                you wish to translate, and then uploading it towards the server
                to be processed.
                <Link
                    href="#"
                    className="inline-flex items-center text-violet-600 hover:underline p-2"
                >
                    See our guideline
                    <LinkSquare
                        // size="16"
                        className="ml-1"
                        color="currentColor"
                        variant="Bulk"
                    />
                </Link>
            </p>
            {/* Form Fields */}
            <div className="flex flex-wrap mb-6">
                <button
                    id="states-button"
                    data-dropdown-toggle="dropdown-states"
                    className="flex-shrink-0 w-full z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
                    type="button"
                >
                    USA{" "}
                    <svg
                        aria-hidden="true"
                        className="w-4 h-4 ml-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clip-rule="evenodd"
                        ></path>
                    </svg>
                </button>
                <div
                    id="dropdown-states"
                    className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
                >
                    <ul
                        className="py-2 text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="states-button"
                    >
                        <li>
                            <button
                                type="button"
                                className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                                <div className="inline-flex items-center">
                                    China
                                </div>
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                                <div className="inline-flex items-center">
                                    China
                                </div>
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                                <div className="inline-flex items-center">
                                    China
                                </div>
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                                <div className="inline-flex items-center">
                                    China
                                </div>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            <Link
                href="#"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-violet-700 rounded-lg hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 dark:bg-violet-600 dark:hover:bg-violet-700 dark:focus:ring-violet-800"
            >
                Read more
                <svg
                    aria-hidden="true"
                    className="w-4 h-4 ml-2 -mr-1"
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
    );
}
