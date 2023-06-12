import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight3, DocumentUpload, LinkSquare } from "iconsax-react";

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
    const [selectedType, setSelectedType] = useState<string>("");
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleToggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleSelectType = (type: string) => {
        setSelectedType(type);
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
                {selectedType && selectedType != ""
                    ? selectedType
                    : "Select Document Type"}
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

const FileUploadService = () => {
    return (
        <>
            <div className="flex items-center justify-center w-full">
                <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <DocumentUpload
                            color="currentColor"
                            aria-hidden="true"
                            className="w-10 h-10 mb-3 text-gray-400"
                            variant="Bulk"
                        />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">
                                Click to upload
                            </span>{" "}
                            or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            PNG, JPG or PDF (MAX. 10 MB)
                        </p>
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" />
                </label>
            </div>
        </>
    );
};

export default function First_DocumentUpload() {
    return (
        <div className="relative w-full">
            {/* Step Title */}
            <StepTitle />
            {/* Form Fields */}
            <div className="flex flex-col flex-wrap mb-6 gap-3">
                <SelectDocType />
                <FileUploadService />
            </div>

            <Link
                href="#"
                className="inline-flex text-center w-full items-center justify-center px-3 py-2 text-sm font-medium text-white bg-violet-700 rounded-lg hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 dark:bg-violet-600 dark:hover:bg-violet-700 dark:focus:ring-violet-800"
            >
                Process
                <ArrowRight3 color="currentColor" variant="Bulk" />
            </Link>
        </div>
    );
}
