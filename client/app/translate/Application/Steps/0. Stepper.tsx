import {
    Check,
    DocumentCode2,
    DocumentDownload,
    TextBlock,
} from "iconsax-react";
import React from "react";
import { StepType } from "../Container";

export default function Stepper({ Step }: { Step: StepType }) {
    // Step types are Enumerable: "Upload", "Translate", "Validate"

    return (
        <ol className="flex items-center justify-center w-full mb-4 sm:mb-5">
            <li className="flex w-full items-center text-violet-600 dark:text-violet-500 after:content-[''] after:w-full after:h-1 after:border-b after:border-violet-100 after:border-4 after:inline-block dark:after:border-violet-800 flex-grow-1">
                <div className="flex items-center justify-center w-10 h-10 bg-violet-100 rounded-full lg:h-12 lg:w-12 dark:bg-violet-800 shrink-0">
                    <DocumentCode2
                        color="currentColor"
                        variant="Bulk"
                        className="w-5 h-5 text-violet-600 lg:w-6 lg:h-6 dark:text-violet-300"
                    />
                </div>
            </li>
            <li className="flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-100 after:border-4 after:inline-block dark:after:border-gray-700 flex-grow-1">
                <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full lg:h-12 lg:w-12 dark:bg-gray-700 shrink-0">
                    <Check
                        color="currentColor"
                        variant="Bulk"
                        className="w-5 h-5 text-gray-500 lg:w-6 lg:h-6 dark:text-gray-100"
                    />
                </div>
            </li>
            <li className="flex items-center flex-grow-0 flex-shrink">
                <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full lg:h-12 lg:w-12 dark:bg-gray-700">
                    <DocumentDownload
                        color="currentColor"
                        variant="Bulk"
                        className="w-5 h-5 text-gray-500 lg:w-6 lg:h-6 dark:text-gray-100"
                    />
                </div>
            </li>
        </ol>
    );
}
