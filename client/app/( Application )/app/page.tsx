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
    BoxTime,
    Document,
    DocumentCode,
    DocumentText,
    DocumentText1,
    Dropbox,
    ElementPlus,
} from "iconsax-react";
import { useAppSelector } from "@/redux/hooks";
import { Undulate } from "@/components/SVG";
import Colors from "tailwindcss/colors";
import { useTheme } from "next-themes";
export default function Page() {
    const { theme } = useTheme();
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
                                <>
                                    {document.state !== "Unavailable" ? (
                                        <Link
                                            className="relative group mx-auto flex flex-col w-full gap-3 rounded-lg bg-white overflow-hidden p-5 ring-1 ring-zinc-900/5 hover:bg-purple-500 hover:ring-purple-500
                                    dark:bg-zinc-950 dark:ring-zinc-500/10 dark:hover:bg-purple-500 dark:hover:ring-purple-500 text-purple-500 group-hover:text-white
                                            dark:text-zinc-50 dark:group-hover:text-white
                                    "
                                            key={document.id}
                                            href={`/app/translate?doc=${document.id}`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <DocumentText
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
                                    ) : (
                                        <div
                                            className="relative p-5 group mx-auto flex flex-col w-full gap-3 rounded-lg bg-white overflow-hidden ring-1 ring-zinc-900/5 hover:bg-zinc-500 hover:ring-zinc-500
                                    dark:bg-zinc-950 dark:ring-zinc-500/10 dark:hover:bg-zinc-500 dark:hover:ring-zinc-500 text-zinc-500 group-hover:text-white
                                            dark:text-zinc-50 dark:group-hover:text-white
                                    "
                                        >
                                            {/* Blur */}
                                            <div className="absolute top-0 left-0 bottom-0 right-0 h-full w-full transition duration-300 ease-in-out d-flex items-center align-center p-5 backdrop-blur-[2px] hover:backdrop-blur-0 z-20"></div>
                                            <div
                                                style={{
                                                    background:
                                                        theme == "light"
                                                            ? `linear-gradient(45deg, ${Colors.zinc[200]} 25%, ${Colors.zinc[300]} 25%, ${Colors.zinc[300]} 50%, ${Colors.zinc[200]} 50%, ${Colors.zinc[200]} 75%, ${Colors.zinc[300]} 75%, ${Colors.zinc[300]} 100%)`
                                                            : `linear-gradient(45deg, ${Colors.zinc[700]} 25%, ${Colors.zinc[800]} 25%, ${Colors.zinc[800]} 50%, ${Colors.zinc[700]} 50%, ${Colors.zinc[700]} 75%, ${Colors.zinc[800]} 75%, ${Colors.zinc[800]} 100%)`,
                                                    backgroundSize:
                                                        "56.57px 56.57px !important",
                                                }}
                                                className="absolute top-0 left-0 bottom-0 right-0 h-full w-full transition duration-300 ease-in-out d-flex items-center align-center p-5 bg-[length:56px_56px] z-20"
                                            ></div>
                                            {/* NOT AVAILABE */}

                                            <div className="flex items-center space-x-3 z-30">
                                                <BoxTime
                                                    color="currentColor"
                                                    variant="Bulk"
                                                    className="h-6 w-6 text-purple-500  z-30
                                            dark:text-zinc-50 
                                            "
                                                />
                                                <h3
                                                    className="text-md font-semibold text-zinc-900
                                        dark:text-zinc-50   z-30
                                        "
                                                >
                                                    {document.name}
                                                </h3>
                                            </div>
                                            <p
                                                className="text-sm text-zinc-500  z-30
                                    dark:text-zinc-400
                                    "
                                            >
                                                {document.description}
                                            </p>
                                        </div>
                                    )}
                                </>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
