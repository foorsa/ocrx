"use client";

import Link from "next/link";
import React from "react";
import {
    Documents as Data,
    DocumentType,
    DocumentsGroupType,
} from "@/redux/data/Documents";
import PageTitle from "./components/1.Page Title";
import {
    Document,
    DocumentCode,
    DocumentText1,
    Dropbox,
    ElementPlus,
} from "iconsax-react";
import { useAppSelector } from "@/redux/hooks";
import { Undulate } from "@/components/SVG";
import Colors from "tailwindcss/colors";
export default function Page() {
    const Search = useAppSelector((state) => state.search);
    const FilteredDocuments = Search.modal.isOpen
        ? Data
        : Search.filteredDocuments;

    return (
        <div className="relative flex h-full min-h-screen w-full min-w-full flex-1 flex-col items-center justify-start gap-10 p-5 text-center text-zinc-900 dark:text-zinc-100">
            {/* Title of the App Page */}
            <PageTitle />

            {/* Document Type Selection Container */}
            <div className="flex h-auto w-full flex-col items-start justify-start gap-10 text-left">
                {FilteredDocuments.map((docType) => (
                    <div
                        className="flex h-auto w-full flex-col items-start justify-start gap-4"
                        key={docType.id}
                    >
                        <div className="flex h-auto w-full flex-col items-start justify-start gap-2 text-left">
                            <div className="text-xl font-bold">
                                {docType.name}
                            </div>
                            <p className="text-sm font-medium opacity-50">
                                {docType.description}
                            </p>
                        </div>

                        <div className="grid h-auto w-full grid-flow-dense grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                            {docType.documents.map((document) => (
                                <Link
                                    className="relative group mx-auto block w-full space-y-3 rounded-lg bg-white overflow-hidden p-5 ring-1 ring-zinc-900/5 hover:bg-purple-500 hover:ring-purple-500
                                    dark:bg-zinc-950 dark:ring-zinc-500/10 dark:hover:bg-purple-500 dark:hover:ring-purple-500 text-purple-500 group-hover:text-white
                                            dark:text-zinc-50 dark:group-hover:text-white
                                    "
                                    key={document.id}
                                    href={`/app/translate?doc=${document.id}`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <Dropbox
                                            color="currentColor"
                                            variant="Bulk"
                                            className="h-6 w-6 text-purple-500 group-hover:text-white
                                            dark:text-zinc-50 dark:group-hover:text-white
                                            "
                                        />
                                        <h3
                                            className="text-md font-semibold text-zinc-900 group-hover:text-white
                                        dark:text-zinc-50 dark:group-hover:text-white
                                        "
                                        >
                                            {document.name}
                                        </h3>
                                    </div>
                                    <p
                                        className="text-sm text-zinc-500 group-hover:text-white
                                    dark:text-zinc-400 dark:group-hover:text-white
                                    "
                                    >
                                        {document.description}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
