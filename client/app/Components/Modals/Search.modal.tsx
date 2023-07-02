"use client";
import React, { KeyboardEventHandler } from "react";
import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setModal, setSearch } from "@/redux/slices/searchSlice";
import { Hashtag, SearchNormal, TableDocument } from "iconsax-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DocumentType, DocumentsGroupType } from "@/redux/data/Documents";
import { toast } from "react-hot-toast";

const SearchBar = () => {
    const Dispatch = useAppDispatch();
    const Search = useAppSelector((state) => state.search);
    const isOpen = Search.modal.isOpen;
    const SearchBarRef = useRef<HTMLInputElement>(null);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const SearchInput: string = event.target.value as string;
        Dispatch(setSearch(SearchInput));
    };

    const keyDownHandler = (event: any) => {
        if (event.ctrlKey && event.code === "KeyK") {
            event.preventDefault();
            Dispatch(setSearch(""));
            Dispatch(
                setModal({
                    isOpen: false,
                    Document: null,
                })
            );
        }
    };

    useEffect(() => {
        if (isOpen) {
            SearchBarRef?.current?.focus();
        }
    }, []);

    return (
        <div className="flex w-full items-start">
            <label htmlFor="simple-search" className="sr-only">
                Search
            </label>
            <div className="relative w-full">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center p-5 text-zinc-900 dark:text-white">
                    <SearchNormal
                        className="h-5 w-5"
                        color="currentColor"
                        variant="TwoTone"
                    />
                </div>
                <input
                    // type="text"
                    className={`
                        ${Search.term.length > 0 ? "rounded-0" : "rounded-lg"}
                    block w-full border-none bg-zinc-50 p-5 pl-14 text-sm text-zinc-900 shadow-none outline-none focus:border-none focus:shadow-none focus:outline-0 dark:bg-zinc-950 dark:text-white dark:placeholder-zinc-400`}
                    placeholder="Search for a document..."
                    value={Search.term}
                    onChange={handleSearch}
                    onKeyDown={keyDownHandler}
                    ref={SearchBarRef}
                    onBlur={(e) => {
                        e.target.focus();
                    }}
                    required
                />
                {/* KBD */}
                <kbd
                    className="absolute right-5 top-1/2 -translate-y-1/2 transform rounded-lg border border-zinc-200 bg-zinc-100 px-2 py-1.5 text-xs font-semibold text-zinc-800 dark:border-zinc-500 dark:bg-zinc-900 dark:text-zinc-100"
                    onClick={() =>
                        Dispatch(
                            setModal({
                                isOpen: false,
                                Document: null,
                            })
                        )
                    }
                >
                    Esc
                </kbd>
            </div>
        </div>
    );
};

export default function SearchModal() {
    const Router = useRouter();
    const Dispatch: any = useAppDispatch();
    const Search = useAppSelector((state) => state.search);
    const FilteredDocuments = useAppSelector(
        (state) => state.search.filteredDocuments
    );
    const isOpen = Search.modal.isOpen;

    const [SelectedDocument, setSelectedDocument] = useState<{
        id: string;
        index: number;
    } | null>(null);

    const closeModal = () => {
        Dispatch(
            setModal({
                isOpen: false,
                Document: null,
            })
        );

        Dispatch(setSearch(""));
    };
    let Filtered = FilteredDocuments;

    const CombinedDocs = Filtered.map(
        (DocumentsGroup: DocumentsGroupType, Index: number) => {
            return DocumentsGroup.documents;
        }
    );

    const FlattenedDocs = CombinedDocs.flat().map(
        (GroupDocument: DocumentType, Index: number) => {
            return {
                id: GroupDocument.id,
                index: Index,
            };
        }
    );
    useEffect(() => {
        const handleKeyDown = (event: any) => {
            if (event.key === "ArrowDown") {
                event.preventDefault();

                if (SelectedDocument === null) {
                    setSelectedDocument(FlattenedDocs[0]);
                } else {
                    const CurrentIndex = SelectedDocument.index;
                    const NextIndex = CurrentIndex + 1;
                    if (NextIndex <= FlattenedDocs.length - 1) {
                        // Find the index inside the FlattenedDocs
                        const NextDocument = FlattenedDocs.find(
                            (doc) => doc.index === NextIndex
                        );
                        if (
                            NextDocument !== undefined &&
                            NextDocument !== null
                        ) {
                            setSelectedDocument(NextDocument);
                        }
                    }
                }

                // Scroll to the Selected Index
                if (SelectedDocument !== null) {
                    const SelectedElement = document.getElementById(
                        SelectedDocument?.id
                    );
                    if (SelectedElement !== null) {
                        SelectedElement.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                            inline: "center",
                        });
                    }
                }
            } else if (event.key === "ArrowUp") {
                event.preventDefault();

                if (SelectedDocument === null) {
                    setSelectedDocument(FlattenedDocs[0]);
                } else {
                    const CurrentIndex = SelectedDocument.index;
                    const NextIndex = CurrentIndex - 1;
                    if (NextIndex >= 0) {
                        // Find the index inside the FlattenedDocs
                        const NextDocument = FlattenedDocs.find(
                            (doc) => doc.index === NextIndex
                        );
                        if (
                            NextDocument !== undefined &&
                            NextDocument !== null
                        ) {
                            setSelectedDocument(NextDocument);
                        }
                    }
                }
                // Scroll to the Selected Index
                if (SelectedDocument !== null) {
                    const SelectedElement = document.getElementById(
                        SelectedDocument?.id
                    );
                    if (SelectedElement !== null) {
                        SelectedElement.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                            inline: "center",
                        });
                    }
                }
            }

            if (event.key === "Enter" || (event.key === "Return" && isOpen)) {
                event.preventDefault();
                if (SelectedDocument !== null) {
                    const Document = FlattenedDocs.find(
                        (doc) => doc.id === SelectedDocument.id
                    );
                    if (Document !== undefined && Document !== null) {
                        // Trigger Click Event to element with ID of selected Document
                        const SelectedElement = document.getElementById(
                            Document?.id
                        );
                        if (SelectedElement !== null) {
                            SelectedElement.click();
                            // Clear Search
                            Dispatch(setSearch(""));
                            closeModal();
                        }
                    }
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [SelectedDocument, FlattenedDocs]);

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={closeModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-start justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel
                                className={`relative my-8 flex h-96 max-h-full w-full max-w-lg transform flex-col items-center justify-start overflow-hidden rounded-lg`}
                            >
                                <div
                                    className="relative flex h-full w-full flex-col items-center justify-start 
                            
                                "
                                >
                                    {/* Search Input Div */}
                                    <SearchBar />

                                    {Search.term.length > 0 && (
                                        <>
                                            <div className="w-full relative h-full overflow-x-hidden overflow-y-auto bg-zinc-100 dark:bg-zinc-950">
                                                {FilteredDocuments.map(
                                                    (DocumentGroup) => {
                                                        return (
                                                            <React.Fragment
                                                                key={
                                                                    DocumentGroup.name
                                                                }
                                                            >
                                                                <div className="w-full relative h-auto flex flex-col items-center justify-start"></div>
                                                                <h3 className="px-5 py-2 relative text-left h-auto w-full bg-zinc-100 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-200 font-bold text-xs">
                                                                    {
                                                                        DocumentGroup.name
                                                                    }
                                                                </h3>
                                                                <div className="relative h-auto w-full flex flex-col items-center justify-start bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white">
                                                                    {DocumentGroup.documents.map(
                                                                        (
                                                                            DocumentGroupElement,
                                                                            index
                                                                        ) => {
                                                                            return (
                                                                                <Link
                                                                                    key={
                                                                                        DocumentGroupElement.id
                                                                                    }
                                                                                    id={
                                                                                        DocumentGroupElement.id
                                                                                    }
                                                                                    onClick={
                                                                                        closeModal
                                                                                    }
                                                                                    onMouseEnter={() => {
                                                                                        const DocumentWithSameId =
                                                                                            FlattenedDocs.find(
                                                                                                (
                                                                                                    DocumentProbablyWithSameId
                                                                                                ) =>
                                                                                                    DocumentProbablyWithSameId.id ===
                                                                                                    DocumentGroupElement.id
                                                                                            );

                                                                                        if (
                                                                                            DocumentWithSameId !==
                                                                                            undefined
                                                                                        ) {
                                                                                            setSelectedDocument(
                                                                                                DocumentWithSameId
                                                                                            );
                                                                                        }
                                                                                    }}
                                                                                    href={`/app/translate?doc=${DocumentGroupElement.id}`}
                                                                                    className={`group text-sm px-5 py-2 w-full relative h-auto max-h-full bg-none flex gap-2 justify-start items-center
                                                                                    ${
                                                                                        SelectedDocument !==
                                                                                            null &&
                                                                                        SelectedDocument.id ===
                                                                                            DocumentGroupElement.id
                                                                                            ? "bg-purple-500 dark:bg-purple-600 text-purple-50 dark:text-purple-100 hover:bg-purple-500 dark:hover:bg-purple-600 hover:text-purple-50 dark:hover:text-purple-100"
                                                                                            : "odd:bg-white even:bg-zinc-100 odd:dark:bg-zinc-900 even:dark:bg-zinc-950"
                                                                                    }
                                                                                    `}
                                                                                >
                                                                                    <TableDocument
                                                                                        color="currentColor"
                                                                                        className={
                                                                                            "w-5 h-5"
                                                                                        }
                                                                                        variant="TwoTone"
                                                                                    />
                                                                                    {
                                                                                        DocumentGroupElement.name
                                                                                    }
                                                                                </Link>
                                                                            );
                                                                        }
                                                                    )}
                                                                </div>
                                                            </React.Fragment>
                                                        );
                                                    }
                                                )}
                                                {/* Empty state */}
                                                {FilteredDocuments.length ===
                                                    0 && (
                                                    <div className="relative h-full w-full flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white">
                                                        <p className="text-sm text-center text-bold opacity-50">
                                                            Nothing Found.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Bottom Bar */}
                                            <div className="w-full relative h-12 flex justify-between items-center bg-zinc-100 dark:bg-zinc-950 px-5 py-2">
                                                <div
                                                    className="flex w-full justify-center items-center 
                                                text-zinc-700 dark:text-zinc-500 font-bold text-xs text-opacity-50"
                                                >
                                                    {/* Credits to Developer Yassine Chettouch */}
                                                    Search Engine credits to
                                                    <span className="text-purple-500 ml-1 dark:text-purple-600 hover:text-purple-400 dark:hover:text-purple-100">
                                                        <a
                                                            href="https://github.com/yassine-ct"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            {" "}
                                                            Developer{" "}
                                                        </a>
                                                    </span>
                                                    .
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
