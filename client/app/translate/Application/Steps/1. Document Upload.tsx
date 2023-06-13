"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import {
    ArrowRight3,
    ChartSuccess,
    Check,
    DocumentUpload,
    LinkSquare,
} from "iconsax-react";
import FileUploadService from "./Core/FileUploadService";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "flowbite-react";
import toast from "react-hot-toast";
const StepTitle = () => {
    return (
        <>
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Translate Your Document
            </h5>

            <p className="mb-6 text-xs font-normal text-gray-700 dark:text-gray-400">
                Begin the translation process by selecting the type of document
                you wish to translate, and then uploading it towards the server
                to be processed.
                <br />
                <Link
                    href="#"
                    className="inline-flex items-center text-violet-600 hover:underline p-2"
                >
                    See our guideline
                    <LinkSquare
                        className="ml-1"
                        color="currentColor"
                        variant="Bulk"
                    />
                </Link>
            </p>
        </>
    );
};

// Selection for Document Type
const SelectDocType = () => {
    const dispatch = useAppDispatch();
    const DocType = useAppSelector((state) => state.DocType);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleToggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleSelectType = (type: string) => {
        dispatch({
            type: "SET_DOCTYPE",
            payload: type,
        });
        setDropdownOpen(false);
    };

    return (
        <div className="relative inline-block w-full text-left">
            {/* Label */}
            <label
                className="block tracking-wide text-gray-500 dark:text-gray-300 text-xs font-bold mb-2"
                htmlFor="type"
            >
                Document Type
            </label>
            <button
                data-dropdown-toggle="dropdown-states"
                className="flex-shrink-0 justify-between w-full z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white dark:border-gray-600"
                type="button"
                onClick={handleToggleDropdown}
            >
                {DocType && DocType != "" ? DocType : "Select Document Type"}
                <svg
                    aria-hidden="true"
                    className="w-4 h-4 ml-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    ></path>
                </svg>
            </button>
            {dropdownOpen && (
                <div className="z-10 absolute top-full left-0 mt-2 w-full bg-white divide-y divide-gray-100 rounded-lg shadow-2xl dark:bg-gray-700">
                    <ul
                        className="py-2 text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="states-button"
                    >
                        <li>
                            <button
                                type="button"
                                className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                                onClick={() =>
                                    handleSelectType("Baccaulaureate")
                                }
                            >
                                <div className="inline-flex items-center">
                                    Baccaulaureate
                                </div>
                            </button>
                        </li>
                        <li>
                            <button
                                data-tooltip-target="tooltip-animation"
                                type="button"
                                className="inline-flex w-full px-4 py-2 text-sm text-gray-400 cursor-not-allowed hover:bg-gray-100 dark:text-gray-600 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                                <div className="inline-flex items-center">
                                    Master
                                </div>
                            </button>
                            <div
                                id="tooltip-animation"
                                role="tooltip"
                                className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
                            >
                                Coming soon...
                                <div
                                    className="tooltip-arrow"
                                    data-popper-arrow
                                ></div>
                            </div>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default function First_DocumentUpload() {
    const Router = useRouter();
    const Pathname = usePathname();
    const searchParams = useSearchParams()!;

    // Get a new searchParams string by merging the current
    // searchParams with a provided key/value pair
    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams as any);
            params.set(name, value);

            return params.toString();
        },
        [searchParams]
    );

    return (
        <div className="relative w-full">
            {/* Step Title */}
            <StepTitle />
            {/* Form Fields */}
            <div className="flex flex-col flex-wrap mb-6 gap-3">
                <SelectDocType />
                <FileUploadService />
            </div>

            <button
                onClick={() => {
                    // <pathname>?sort=asc
                    toast.success("This feature is under development.", {
                        icon: <Check color="green" variant="Bulk" />,
                        id: "Process",
                    });
                }}
                className="inline-flex text-center w-full items-center justify-center px-3 py-2 text-sm font-medium text-white bg-violet-700 rounded-lg hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 dark:bg-violet-600 dark:hover:bg-violet-700 dark:focus:ring-violet-800"
            >
                Process
                <ArrowRight3 color="currentColor" variant="Bulk" />
            </button>
        </div>
    );
}
