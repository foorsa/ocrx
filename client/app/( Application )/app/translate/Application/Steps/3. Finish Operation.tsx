"use client";

import React, { useCallback, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
    ArrowRight3,
    Check,
    CloseSquare,
    DocumentDownload,
    Google,
    Link,
    LinkSquare,
} from "iconsax-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { clearSession } from "@/redux/slices/sessionSlice";
import { resetStep, setStep } from "@/redux/actions/stepActions";
import { resetFile } from "@/redux/actions/fileActions";
import { resetDocumentType } from "@/redux/actions/documentTypeActions";
import { getApiServerUrl } from "@/utils/getApiServerUrl";
import { Steps } from "@/redux/types/states/Step";
import PDFPreview from "./Core/C. Finish/A. PDF Preview";

export default function Third_FinishOperation() {
    // Routing
    const Router = useRouter();

    const dispatch = useAppDispatch();
    const Session = useAppSelector((state) => state.session.Data);

    const PYTHON_PUBLIC_URL = getApiServerUrl();

    const handleDownloadPDF = () => {
        // Open the PDF in a new tab
        if (
            Session?.Generation?.["PDF Link"] &&
            Session?.Generation["PDF Link"] != ""
        ) {
            window.open(Session.Generation["PDF Link"], "_blank");
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
    };

    const handleEditDocument = () => {
        if (
            Session?.Generation?.["Google Docs Link"] &&
            Session?.Generation["Google Docs Link"] != ""
        ) {
            window.open(Session.Generation["Google Docs Link"], "_blank");
        } else {
            toast.error("The Google Docs link is not ready yet.");
        }
    };

    return (
        <div className="relative w-full">
            {/* PDF Preview Container */}
            <PDFPreview />

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
                    className="inline-flex text-center gap-3 w-full mb-2 items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 focus:bg-blue-500 active:bg-blue-900 transition duration-150 ease-in-out"
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
                    className="inline-flex text-center gap-3 w-full mb-2 justify-center items-center font-medium text-sm px-5 py-2.5 bg-white rounded-lg border border-zinc-200 hover:bg-zinc-100 text-zinc-900 hover:text-blue-700 focus:z-10 dark:bg-zinc-950 dark:text-zinc-400 dark:border-zinc-600 dark:hover:text-white dark:hover:bg-zinc-800"
                    onClick={handleEditDocument}
                >
                    Edit in Google Docs
                    <Google
                        color="currentColor"
                        variant="Bulk"
                        className="inline w-5 h-5"
                    />
                </button>
                <button
                    type="button"
                    className="inline-flex text-center gap-3 w-full mb-2 justify-center items-center font-medium text-sm px-5 py-2.5 bg-white rounded-lg border border-zinc-200 hover:bg-zinc-100 text-zinc-900 hover:text-blue-700 focus:z-10 dark:bg-zinc-950 dark:text-zinc-400 dark:border-zinc-600 dark:hover:text-white dark:hover:bg-zinc-800"
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
                    className="inline-flex w-full gap-3 justify-center items-center font-medium text-sm px-5 py-2.5 text-center bg-white rounded-lg border border-zinc-200 hover:bg-zinc-100 text-zinc-900 hover:text-blue-700 focus:z-10 dark:bg-zinc-950 dark:text-zinc-400 dark:border-zinc-600 dark:hover:text-white dark:hover:bg-zinc-800"
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
