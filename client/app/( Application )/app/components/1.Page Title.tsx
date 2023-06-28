"use client";

import React from "react";
import { SearchNormal } from "iconsax-react";
import {
    Documents as Data,
    DocumentType,
    DocumentsGroupType,
} from "@/redux/data/Documents";
import Fuse from "fuse.js";

const Title = () => {
    return (
        <>
            <h1
                className="text-4xl font-bold text-purple-600 
                dark:text-zinc-50
                "
            >
                Select Document Type
            </h1>
            <p className="text-md font-medium opacity-50">
                Select the type of document you want to translate.
            </p>
        </>
    );
};

export default function PageTitle({
    Documents,
    setFilteredDocuments,
}: {
    Documents: DocumentsGroupType[];
    setFilteredDocuments: React.Dispatch<
        React.SetStateAction<DocumentsGroupType[]>
    >;
}) {
    const BackupDocuments: DocumentsGroupType[] = Documents;
    const [searchTerm, setSearchTerm] = React.useState<string>("");

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = event.target.value;
        setSearchTerm(searchValue);

        if (searchValue !== "") {
            const fuse = new Fuse(Documents, {
                keys: [
                    "name",
                    "description",
                    "documents",
                    "documents.name",
                    "documents.id",
                    "documents.description",
                ],
                includeScore: true,
                threshold: 0.3,
            });

            const result = fuse.search(searchValue);
            const newFilteredDocuments = result.map(({ item }) => {
                const fuse = new Fuse(item.documents, {
                    keys: ["name", "description", "id"],
                    includeScore: true,
                    threshold: 0.3,
                });

                const result = fuse.search(searchValue);

                return {
                    ...item,
                    documents: result.map(({ item }) => item),
                };
            });

            setFilteredDocuments(newFilteredDocuments);
        } else {
            setFilteredDocuments(BackupDocuments);
        }
    };

    return (
        <div className="flex flex-col w-full h-auto text-left justify-start items-start gap-2">
            {/* Title for the App Selection Page */}
            <Title />

            {/* Search Bar */}
            <form className="flex items-center w-full mt-3">
                <label htmlFor="simple-search" className="sr-only">
                    Search
                </label>
                <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <SearchNormal
                            className="w-5 h-5"
                            color="currentColor"
                            variant="TwoTone"
                        />
                    </div>
                    <input
                        type="text"
                        id="simple-search"
                        className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 p-2.5  dark:bg-zinc-950 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={handleSearch}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="p-2.5 ml-2 text-sm font-medium text-white bg-purple-700 rounded-lg border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
                >
                    <SearchNormal
                        className="w-5 h-5"
                        color="currentColor"
                        variant="TwoTone"
                    />
                    <span className="sr-only">Search</span>
                </button>
            </form>
        </div>
    );
}
