"use client";

import Link from "next/link";
import React from "react";
import {
    Documents as Data,
    DocumentType,
    DocumentsGroupType,
} from "@/redux/data/Documents";
import PageTitle from "./components/1.Page Title";
import { Document } from "iconsax-react";
export default function Page() {
    const [Documents, setDocuments] =
        React.useState<DocumentsGroupType[]>(Data);

    const [FilteredDocuments, setFilteredDocuments] =
        React.useState<DocumentsGroupType[]>(Documents);

    return (
        <div className="relative flex-1 gap-10 h-full w-full min-h-screen min-w-full flex text-center flex-col justify-start items-center p-5 text-zinc-900 dark:text-zinc-100">
            {/* Title of the App Page */}
            <PageTitle
                Documents={Documents}
                setFilteredDocuments={setFilteredDocuments}
            />

            {/* Document Type Selection Container */}
            <div className="flex flex-col w-full h-auto text-left justify-start items-start gap-10">
                {FilteredDocuments.map((docType) => (
                    <div
                        className="flex flex-col justify-start items-start gap-4 w-full h-auto"
                        key={docType.id}
                    >
                        <div className="flex flex-col w-full h-auto text-left justify-start items-start gap-2">
                            <div className="text-xl font-bold">
                                {docType.name}
                            </div>
                            <p className="text-sm font-medium opacity-50">
                                {docType.description}
                            </p>
                        </div>

                        <div className="w-full h-auto grid-flow-dense gap-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                            {docType.documents.map((document) => (
                                <Link
                                    className="block max-w-sm p-6 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-100 dark:bg-zinc-950 dark:border-zinc-700 dark:hover:bg-zinc-900"
                                    key={document.id}
                                    href={`/app/translate?doc=${document.id}`}
                                >
                                    {/* <Document
                                        size="64"
                                        color="currentColor"
                                        variant="Bulk"
                                        className="
                                        text-zinc-900 dark:text-zinc-100
                                        mb-4
                                        "
                                    /> */}
                                    <div className="text-xl font-bold">
                                        {document.name}
                                    </div>
                                    <p className="text-sm font-medium opacity-50">
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
