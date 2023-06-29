"use client";

import React from "react";
import { SearchNormal } from "iconsax-react";
import {
    Documents as Data,
    DocumentType,
    DocumentsGroupType,
} from "@/redux/data/Documents";
import Fuse from "fuse.js";
import SearchModal from "@/app/Components/Modals/Search.modal";
import { setSearch, setModal } from "@/redux/slices/searchSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

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

export default function PageTitle() {
    const Dispatch = useAppDispatch();
    const Search = useAppSelector((state) => state.search);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const searchValue = event.target.value;
        Dispatch(setSearch(searchValue));
    };

    const handleClick = () => {
        Dispatch(
            setModal({
                isOpen: true,
                Document: null,
            })
        );
    };

    return (
        <div className="flex h-auto w-full flex-col items-start justify-start gap-2 text-left">
            {/* Search Bar */}
            <div
                className="mb-3 flex w-full items-center"
                onClick={handleClick}
            >
                <label htmlFor="simple-search" className="sr-only">
                    Search
                </label>
                <div className="relative w-full">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center p-5">
                        <SearchNormal
                            className="h-5 w-5"
                            color="currentColor"
                            variant="TwoTone"
                        />
                    </div>
                    <input
                        type="text"
                        className="block w-full rounded-lg border border-zinc-300 bg-zinc-50 px-5 py-2.5 pl-14 text-sm text-zinc-900 focus:border-purple-500 focus:ring-purple-500  dark:border-zinc-600 dark:bg-zinc-950 dark:text-white dark:placeholder-zinc-400 dark:focus:border-purple-500 dark:focus:ring-purple-500"
                        placeholder="Quick search..."
                        value={Search.term}
                        onChange={handleSearch}
                        onClick={handleClick}
                        required
                    />
                    <kbd
                        className="absolute right-2 top-1/2 -translate-y-1/2 transform rounded-lg border border-gray-200 bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100"
                        onClick={handleClick}
                    >
                        ⌘ K
                    </kbd>
                </div>
                <button
                    onClick={handleClick}
                    className="ml-2 rounded-lg border border-purple-700 bg-purple-700 p-2.5 text-sm font-medium text-white hover:bg-purple-800 focus:outline-none dark:bg-purple-600 dark:hover:bg-purple-700"
                >
                    <SearchNormal
                        className="h-5 w-5"
                        color="currentColor"
                        variant="TwoTone"
                    />
                    <span className="sr-only">Search</span>
                </button>
            </div>

            {/* Title for the App Selection Page */}
            <Title />
        </div>
    );
}
