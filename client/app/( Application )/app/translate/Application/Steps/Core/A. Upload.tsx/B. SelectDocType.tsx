"use client";

import React, { Fragment, useCallback, useState } from "react";
import Link from "next/link";
import { ArrowDown2, BoxTick, Code, TableDocument } from "iconsax-react";

import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { Tooltip } from "flowbite-react";
import toast from "react-hot-toast";
import { setDocumentType } from "@/redux/actions/documentTypeActions";
import { Documents, DocumentType } from "@/redux/data/Documents";
import { Menu, Transition } from "@headlessui/react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

const SelectDocType = () => {
    const Router = useRouter();
    const SearchParams = useSearchParams();
    const Pathname = usePathname();
    const dispatch = useAppDispatch();
    const DocType = useAppSelector((state) => state.documentType);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleToggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    // searchParams with a provided key/value pair
    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(SearchParams.toString());
            params.set(name, value);

            return params.toString();
        },
        [SearchParams]
    );

    const handleSelectType = (type: DocumentType) => {
        dispatch(setDocumentType(type));

        // Change URL Search Parameter to the selected document type
        const queryString = createQueryString("doc", type.id);

        // <pathname>?doc=doctype
        Router.push(Pathname + "?" + queryString);

        setDropdownOpen(false);
    };

    return (
        <Menu as="div" className="relative inline-block w-full text-left">
            {/* Label */}
            <label
                className="block tracking-wide text-zinc-500 dark:text-zinc-300 text-xs font-bold mb-2"
                htmlFor="type"
            >
                Document Type
            </label>
            <Menu.Button className="flex-shrink-0 justify-between w-full z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-zinc-500 bg-zinc-100 border border-zinc-300 rounded-lg hover:bg-zinc-200 focus:outline-none dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-white dark:border-zinc-600">
                {DocType
                    ? DocType.name
                        ? DocType.name
                        : "Select Document Type"
                    : "Select Document Type"}
                <ArrowDown2
                    color="currentColor"
                    variant="Bulk"
                    className={"w-4 h-4 ml-1 transition-transform duration-200"
                        .concat(dropdownOpen ? " transform rotate-180" : "")
                        .concat(" dark:text-zinc-400")}
                />
            </Menu.Button>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 origin-top-right left-0 mt-2 w-full bg-white divide-y divide-zinc-100 rounded-lg shadow-2xl dark:bg-zinc-900 z-50 border-zinc-300 dark:border-zinc-600">
                    <ul
                        className="p-5 text-sm text-zinc-700 dark:text-zinc-200 space-y-2 text-left"
                        aria-labelledby="document-type"
                    >
                        {Documents.map((Document) => {
                            return (
                                <li key={Document.id}>
                                    <label className="block tracking-wide text-zinc-300 dark:text-zinc-600 text-xs font-bold mb-2">
                                        {Document.name}
                                    </label>
                                    <ul>
                                        {Document.documents.map(
                                            (InnerDocument) => {
                                                return (
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <button
                                                                type="button"
                                                                className={classNames(
                                                                    active
                                                                        ? "bg-purple-500 text-white"
                                                                        : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-600 dark:hover:text-white",
                                                                    "inline-flex w-full px-4 py-2 text-sm rounded-md"
                                                                )}
                                                                onClick={() =>
                                                                    handleSelectType(
                                                                        InnerDocument
                                                                    )
                                                                }
                                                            >
                                                                <div className="inline-flex items-left justify-center text-left">
                                                                    <TableDocument
                                                                        color="currentColor"
                                                                        className="mr-2"
                                                                        variant="Bulk"
                                                                    />
                                                                    {
                                                                        InnerDocument.name
                                                                    }
                                                                </div>
                                                            </button>
                                                        )}
                                                    </Menu.Item>
                                                );
                                            }
                                        )}
                                    </ul>
                                </li>
                            );
                        })}
                    </ul>
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

export default SelectDocType;
