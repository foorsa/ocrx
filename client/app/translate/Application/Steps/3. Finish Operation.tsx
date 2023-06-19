"use client";

import React, { useCallback, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { ArrowRight3, CloseSquare, Link, LinkSquare } from "iconsax-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { clearSession } from "@/redux/actions/sessionActions";
import { resetStep } from "@/redux/actions/stepActions";
import { resetFile } from "@/redux/actions/fileActions";
import { resetDocumentType } from "@/redux/actions/documentTypeActions";
import { resetProcess } from "@/redux/actions/processActions";
import { getApiServerUrl } from "@/utils/getApiServerUrl";

export default function Third_FinishOperation() {
    // Routing
    const Router = useRouter();

    const dispatch = useAppDispatch();
    const Session = useAppSelector((state) => state.session);

    const PYTHON_PUBLIC_URL = getApiServerUrl();

    const handleDownloadPDF = () => {
        // Open the PDF in a new tab
        if (Session.publicPDFPath && Session.publicPDFPath != "") {
            window.open(PYTHON_PUBLIC_URL + Session.publicPDFPath, "_blank");
        } else {
            toast.error("The PDF is not ready yet.");
        }
    };

    const handleFinishOperation = () => {
        // Reset the entire states
        dispatch(clearSession());
        dispatch(resetStep());
        dispatch(resetFile());
        dispatch(resetDocumentType());
        dispatch(resetProcess());
    };

    return (
        <div className="relative w-full">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Finish the Operation
            </h5>

            <p className="mb-6 text-xs font-normal text-gray-700 dark:text-gray-400">
                Please review the document and make sure that all the fields are
                correct, and then click on the button below to finish the
                operation and get your translated document.
            </p>

            <div className="flex flex-col items-center justify-center w-full">
                <button
                    type="button"
                    className="inline-flex text-center w-full mb-2 items-center justify-center px-3 py-2 text-sm font-medium text-white bg-violet-700 rounded-lg hover:bg-violet-800 focus:outline-none dark:bg-violet-600 dark:hover:bg-violet-700 focus:bg-violet-500 active:bg-violet-900 transition duration-150 ease-in-out"
                    onClick={handleDownloadPDF}
                >
                    Download PDF
                    <ArrowRight3 color="currentColor" variant="Bulk" />
                </button>
                <button
                    type="button"
                    className="inline-flex w-full justify-center items-center font-medium text-sm px-5 py-2.5 text-center bg-white rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-900 hover:text-violet-700 focus:z-10 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    onClick={handleFinishOperation}
                >
                    <CloseSquare
                        color="currentColor"
                        variant="Bulk"
                        className="inline w-4 h-4 mr-3"
                    />
                    {/* Retry */}
                    Finish Operation
                </button>
            </div>
        </div>
    );
}
