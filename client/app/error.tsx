"use client"; // Error components must be Client Components

import { useEffect } from "react";
import React from "react";
import { BackSquare, BoxRemove, Home } from "iconsax-react";
import Link from "next/link";
import { resetDocumentType } from "@/redux/actions/documentTypeActions";
import { useAppDispatch } from "@/redux/hooks";
import { resetFile } from "@/redux/actions/fileActions";
import { resetProcess } from "@/redux/actions/processActions";
import { clearSession } from "@/redux/actions/sessionActions";
import { resetStep } from "@/redux/actions/stepActions";
import PageWrapper from "./PageWrapper";

export default function Error({
    error,
    reset,
}: {
    error: Error;
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);
    const dispatch = useAppDispatch();

    const handleClearRedux = () => {
        // Reset the entire states
        dispatch(clearSession());
        dispatch(resetStep());
        dispatch(resetFile());
        dispatch(resetDocumentType());
        dispatch(resetProcess());

        // Reset the error
        reset();
    };

    return (
        <PageWrapper>
            <main className="grid min-h-full place-items-center w-full px-6 py-24 sm:py-32 lg:px-8">
                <div className="text-center">
                    <p className="text-base font-semibold text-emerald-600">
                        500
                    </p>
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
                        Something went wrong!
                    </h1>
                    <p className="mt-6 text-base leading-7 text-zinc-600 dark:text-zinc-500">
                        Please try again later. If the problem persists, please
                        contact us.
                    </p>
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6">
                        <Link
                            href="/"
                            className="w-full md:w-auto inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-emerald-600 hover:bg-emerald-800"
                        >
                            <span className="mr-2 text-md font-semibold">
                                Go back home
                            </span>
                            <Home variant="Bulk" color="currentColor" />
                        </Link>
                        <div
                            onClick={() => reset()}
                            className="w-full md:w-auto mt-4 md:mt-0 inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center rounded-lg text-emerald-800 bg-emerald-600/25 hover:bg-emerald-600/50 dark:text-emerald-600 dark:bg-emerald-600/50 dark:hover:bg-emerald-600/75"
                        >
                            <span className="mr-2 text-md font-semibold">
                                Retry
                            </span>
                            <BackSquare variant="Bulk" color="currentColor" />
                        </div>
                        <div
                            onClick={() => handleClearRedux()}
                            className="w-full md:w-auto mt-4 md:mt-0 inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center rounded-lg text-emerald-800 bg-emerald-600/25 hover:bg-emerald-600/50 dark:text-emerald-600 dark:bg-emerald-600/50 dark:hover:bg-emerald-600/75"
                        >
                            <span className="mr-2 text-md font-semibold">
                                Clear Data
                            </span>
                            <BoxRemove variant="Bulk" color="currentColor" />
                        </div>
                    </div>
                </div>
            </main>
        </PageWrapper>
    );
}
