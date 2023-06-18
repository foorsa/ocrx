"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import { ArrowDown2, BoxTick, Code, TableDocument } from "iconsax-react";

import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { Tooltip } from "flowbite-react";
import toast from "react-hot-toast";
import { setDocumentType } from "@/redux/actions/documentTypeActions";
import { BaccalaureateObject } from "@/redux/data/Documents";

const SelectDocType = () => {
    const dispatch = useAppDispatch();
    const DocType = useAppSelector((state) => state.documentType);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleToggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleSelectType = (type: string) => {
        switch (type) {
            case "Baccaulaureate Diploma":
                dispatch(setDocumentType(BaccalaureateObject));
                break;
            default:
                // Coming Soon
                toast.success(`${type} translations are coming soon.`, {
                    icon: (
                        <Code
                            color="currentColor"
                            className="text-violet-600"
                            variant="Bulk"
                        />
                    ),
                    id: type,
                });
                break;
        }
        setDropdownOpen(false);
    };

    return (
        <div className="relative inline-block w-full text-left">
            {/* Label */}
            <label
                className="block tracking-wide text-gray-500 dark:text-gray-300 text-xs font-bold mb-2"
                htmlFor="type"
            >
                Document Type
            </label>
            <button
                data-dropdown-toggle="dropdown-states"
                className="flex-shrink-0 justify-between w-full z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white dark:border-gray-600"
                type="button"
                onClick={handleToggleDropdown}
            >
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
                        .concat(" dark:text-gray-400")}
                />
            </button>
            {dropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white divide-y divide-gray-100 rounded-lg shadow-2xl dark:bg-gray-700 z-50 border-gray-300 dark:border-gray-600">
                    <ul
                        className="p-2 text-sm text-gray-700 dark:text-gray-200 space-y-2"
                        aria-labelledby="document-type"
                    >
                        <li>
                            <label className="block tracking-wide text-gray-300 dark:text-gray-600 text-xs font-bold mb-2">
                                Diplomas
                            </label>
                            <ul>
                                <li>
                                    <button
                                        type="button"
                                        className="inline-flex w-full px-4 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                                        onClick={() =>
                                            handleSelectType(
                                                "Baccaulaureate Diploma"
                                            )
                                        }
                                    >
                                        <div className="inline-flex items-center">
                                            <TableDocument
                                                color="currentColor"
                                                className="text-gray-400 mr-2"
                                                variant="Bulk"
                                            />
                                            Baccaulaureate Diploma
                                        </div>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSelectType("Language Diploma")
                                        }
                                        className="inline-flex w-full px-4 py-2 text-sm rounded-md text-gray-400 cursor-not-allowed hover:bg-gray-100 dark:text-gray-600 dark:hover:bg-gray-600 dark:hover:text-white"
                                    >
                                        <div className="inline-flex items-center">
                                            <BoxTick
                                                color="currentColor"
                                                className="text-gray-400 mr-2"
                                                variant="Bulk"
                                            />
                                            Language Diploma
                                        </div>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        data-tooltip-target="tooltip-animation"
                                        type="button"
                                        onClick={() =>
                                            handleSelectType("Master Diploma")
                                        }
                                        className="inline-flex w-full px-4 py-2 text-sm rounded-md text-gray-400 cursor-not-allowed hover:bg-gray-100 dark:text-gray-600 dark:hover:bg-gray-600 dark:hover:text-white"
                                    >
                                        <div className="inline-flex items-center">
                                            <BoxTick
                                                color="currentColor"
                                                className="text-gray-400 mr-2"
                                                variant="Bulk"
                                            />
                                            Master Diploma
                                        </div>
                                    </button>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};
export default SelectDocType;
