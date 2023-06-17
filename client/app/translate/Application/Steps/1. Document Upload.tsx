"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import {
    ArrowDown2,
    ArrowRight3,
    BoxTick,
    ChartSuccess,
    Check,
    CloseSquare,
    Code,
    Document,
    DocumentUpload,
    LinkSquare,
    Timer,
} from "iconsax-react";
import FileUploadService from "./Core/A. Upload.tsx/C. FileUploadService";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button, Tooltip } from "flowbite-react";
import toast from "react-hot-toast";
import {
    resetDocumentType,
    setDocumentTypes,
} from "@/redux/actions/documentTypeActions";
import { BaccalaureateObject } from "@/redux/data/Documents";
import SelectDocType from "./Core/A. Upload.tsx/B. SelectDocType";
import Heading from "./Core/A. Upload.tsx/A. Heading";
import { nextStep, resetStep } from "@/redux/actions/stepActions";
import axios from "axios";
import { Doctype } from "@/redux/types/states/Document Type";
import Processing from "./Core/A. Upload.tsx/D. Processing";
import { setProcess } from "@/redux/actions/processActions";
import { resetFile } from "@/redux/actions/fileActions";

// Selection for Document Type

export default function First_DocumentUpload() {
    const dispatch = useAppDispatch();
    const Doctype = useAppSelector((state) => state.documentType);
    const UploadedFile = useAppSelector((state) => state.file);
    const Process = useAppSelector((state) => state.process);

    const handleNextStep = async () => {
        if (!UploadedFile) {
            return toast.error("Please upload a file");
        } else if (!Doctype?.name) {
            return toast.error("Please select a document type");
        }

        // Set fake loading
        dispatch(
            setProcess({
                isLoading: true,
                name: "Uploading File",
                description: "Uploading your file to the server...",
            })
        );

        const url = "http://localhost:5000/api/process"; // Replace with your server endpoint

        const formData = new FormData();
        formData.append("file", UploadedFile.file);
        formData.append("document_type", Doctype.name);

        try {
            const response = await axios.post(url, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            // Change the Fields Values in the Redux Store
            const ExtractedData = Doctype.fields.map((field: any) => {
                const value = response.data[field.name];

                // Remove value from field
                delete field.value;

                // Add value to field
                return {
                    ...field,
                    value,
                };
            });

            // Doctype without the fields
            const DoctypeNoFields = {
                id: Doctype.id,
                name: Doctype.name,
                description: Doctype.description,
            };

            // Set the extracted data in the redux store
            dispatch(
                setDocumentTypes({
                    ...DoctypeNoFields,
                    fields: ExtractedData,
                })
            );
        } catch (error: any) {
            // Handle errors
            console.error("Error:", error.message);
            toast.error("Error: " + error.message);
        } finally {
            // Simulate delay before setting isLoading to false
            dispatch(
                setProcess({
                    isLoading: true,
                    name: "Hang on!",
                    description: "We are finishing the operation...",
                })
            );
        }
    };

    const handleCancelOperation = () => {
        // Reset the process
        dispatch(
            setProcess({
                isLoading: false,
                name: "",
                description: "",
            })
        );

        // // Reset the document type
        // dispatch(resetDocumentType());

        // // Reset the file
        // dispatch(resetFile());

        // Reset the step
        dispatch(resetStep());
    };

    return (
        <div className="relative w-full">
            {/* Step Title */}
            {/* Form Fields */}
            <div className="flex flex-col flex-wrap mb-6 gap-3 min-w-fit">
                {!Process.isLoading && (
                    <>
                        <Heading />
                        <SelectDocType />
                        <FileUploadService />
                    </>
                )}
                {Process.isLoading && <Processing />}
            </div>
            {/* Next Step */}

            {!Process.isLoading && (
                <button
                    onClick={handleNextStep}
                    className="inline-flex text-center w-full items-center justify-center px-3 py-2 text-sm font-medium text-white bg-violet-700 rounded-lg hover:bg-violet-800 focus:outline-none dark:bg-violet-600 dark:hover:bg-violet-700 focus:bg-violet-500 active:bg-violet-900 transition duration-150 ease-in-out"
                >
                    Process
                    <ArrowRight3 color="currentColor" variant="Bulk" />
                </button>
            )}

            {Process.isLoading && (
                <>
                    <button
                        disabled
                        type="button"
                        className="text-white w-full bg-black hover:bg-violet-800 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 dark:bg-violet-600 dark:hover:bg-violet-700 inline-flex items-center justify-center"
                    >
                        <svg
                            aria-hidden="true"
                            role="status"
                            className="inline w-4 h-4 mr-3 text-white animate-spin"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="#E5E7EB"
                            />
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentColor"
                            />
                        </svg>
                        Processing...
                    </button>
                    <button
                        type="button"
                        className="inline-flex w-full justify-center items-center font-medium text-sm px-5 py-2.5 text-center bg-white rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-900 hover:text-violet-700 focus:z-10 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                        onClick={handleCancelOperation}
                    >
                        <CloseSquare
                            color="currentColor"
                            variant="Bulk"
                            className="inline w-4 h-4 mr-3"
                        />
                        Cancel Operation
                    </button>
                </>
            )}
        </div>
    );
}
