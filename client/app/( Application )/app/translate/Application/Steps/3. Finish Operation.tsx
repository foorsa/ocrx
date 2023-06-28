"use client";

import React, { useCallback, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
    ArrowRight3,
    Check,
    CloseSquare,
    DocumentDownload,
    Link,
    LinkSquare,
} from "iconsax-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { clearSession } from "@/redux/actions/sessionActions";
import { resetStep, setStep } from "@/redux/actions/stepActions";
import { resetFile } from "@/redux/actions/fileActions";
import { resetDocumentType } from "@/redux/actions/documentTypeActions";
import { resetProcess } from "@/redux/actions/processActions";
import { getApiServerUrl } from "@/utils/getApiServerUrl";
import { Steps } from "@/redux/types/states/Step";

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

    const handleCorrectDocument = () => {
        dispatch(setStep(Steps.Correct));
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
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Finish the Operation
            </h5>

            <p className="mb-6 text-xs font-normal text-zinc-700 dark:text-zinc-400">
                Please review the document and make sure that all the fields are
                correct, and then click on the button below to finish the
                operation and get your translated document.
            </p>

            <div className="flex flex-col items-center justify-center w-full">
                <button
                    type="button"
                    className="inline-flex text-center gap-3 w-full mb-2 items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-purple-700 rounded-lg hover:bg-purple-800 focus:outline-none dark:bg-purple-600 dark:hover:bg-purple-700 focus:bg-purple-500 active:bg-purple-900 transition duration-150 ease-in-out"
                    onClick={handleDownloadPDF}
                >
                    Download PDF
                    <DocumentDownload
                        color="currentColor"
                        variant="Bulk"
                        className="inline w-5 h-5"
                    />
                </button>
                <button
                    type="button"
                    className="inline-flex text-center gap-3 w-full mb-2 justify-center items-center font-medium text-sm px-5 py-2.5 bg-white rounded-lg border border-zinc-200 hover:bg-zinc-100 text-zinc-900 hover:text-purple-700 focus:z-10 dark:bg-zinc-950 dark:text-zinc-400 dark:border-zinc-600 dark:hover:text-white dark:hover:bg-zinc-800"
                    onClick={handleCorrectDocument}
                >
                    Correct Document
                    <Check
                        color="currentColor"
                        variant="Bulk"
                        className="inline w-5 h-5"
                    />
                </button>
                <button
                    type="button"
                    className="inline-flex w-full gap-3 justify-center items-center font-medium text-sm px-5 py-2.5 text-center bg-white rounded-lg border border-zinc-200 hover:bg-zinc-100 text-zinc-900 hover:text-purple-700 focus:z-10 dark:bg-zinc-950 dark:text-zinc-400 dark:border-zinc-600 dark:hover:text-white dark:hover:bg-zinc-800"
                    onClick={handleFinishOperation}
                >
                    Finish Operation
                    <CloseSquare
                        color="currentColor"
                        variant="Bulk"
                        className="inline w-5 h-5"
                    />
                </button>
            </div>
        </div>
    );
}
