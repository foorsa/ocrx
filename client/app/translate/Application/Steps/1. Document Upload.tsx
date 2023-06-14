"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import {
    ArrowDown2,
    ArrowRight3,
    BoxTick,
    ChartSuccess,
    Check,
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
import { setDocumentTypes } from "@/redux/actions/documentTypeActions";
import { BaccalaureateObject } from "@/redux/data/Documents";
import SelectDocType from "./Core/A. Upload.tsx/B. SelectDocType";
import Heading from "./Core/A. Upload.tsx/A. Heading";

// Selection for Document Type

export default function First_DocumentUpload() {
    const dispatch = useAppDispatch();
    const Doctype = useAppSelector((state) => state.documentType);
    const UplaodedFile = useAppSelector((state) => state.file);

    return (
        <div className="relative w-full">
            {/* Step Title */}
            <Heading />
            {/* Form Fields */}
            <div className="flex flex-col flex-wrap mb-6 gap-3">
                <SelectDocType />
                <FileUploadService />
            </div>

            <button
                onClick={() => {
                    if (UplaodedFile.length == 0) {
                        toast.error("Please upload a file");
                    } else if (Doctype == "") {
                        toast.error("Please select a document type");
                    } else {
                        toast.success("File uploaded successfully");
                        dispatch(setDocumentTypes(Doctype));
                    }
                }}
                className="inline-flex text-center w-full items-center justify-center px-3 py-2 text-sm font-medium text-white bg-violet-700 rounded-lg hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 dark:bg-violet-600 dark:hover:bg-violet-700 dark:focus:ring-violet-800"
            >
                Process
                <ArrowRight3 color="currentColor" variant="Bulk" />
            </button>
        </div>
    );
}
