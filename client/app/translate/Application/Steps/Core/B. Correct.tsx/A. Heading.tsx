import React from "react";

export default function Heading() {
    return (
        <div className="relative w-full">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Correct the Outbound Data
            </h5>

            <p className="mb-6 text-xs font-normal text-gray-700 dark:text-gray-400">
                Please correct the fields values that have been extracted with
                OCR and AI from the document.
            </p>
        </div>
    );
}
