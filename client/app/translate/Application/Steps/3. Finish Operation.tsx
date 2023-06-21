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
                    className="inline-flex text-center w-full mb-2 items-center justify-center px-3 py-2 text-sm font-medium text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 focus:outline-none dark:bg-emerald-600 dark:hover:bg-emerald-700 focus:bg-emerald-500 active:bg-emerald-900 transition duration-150 ease-in-out"
                    onClick={handleDownloadPDF}
                >
                    Download PDF
                    <ArrowRight3 color="currentColor" variant="Bulk" />
                </button>
                <button
                    type="button"
                    className="inline-flex w-full justify-center items-center font-medium text-sm px-5 py-2.5 text-center bg-white rounded-lg border border-zinc-200 hover:bg-zinc-100 text-zinc-900 hover:text-emerald-700 focus:z-10 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-600 dark:hover:text-white dark:hover:bg-zinc-700"
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
