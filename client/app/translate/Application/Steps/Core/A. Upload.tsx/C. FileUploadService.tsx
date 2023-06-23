"use client";

import React, { useState } from "react";
import { DocumentUpload, CloseSquare as XCircle } from "iconsax-react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { toast } from "react-hot-toast";
import { resetFile, setFile } from "@/redux/actions/fileActions";
import { FileType } from "@/redux/types/states/File";
import { AnimatePresence, motion } from "framer-motion";

const FileUploadService = () => {
    const dispatch = useAppDispatch();
    const uploadedFile: FileType = useAppSelector((state) => state.file);

    const handleFileUpload = (event: any) => {
        const files: File[] = event.target.files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (
                (file.type === "image/png" ||
                    file.type === "image/jpeg" ||
                    file.type === "application/pdf") &&
                file.size <= 10 * 1024 * 1024
            ) {
                // Remove the Previous File if there is one
                if (uploadedFile !== null) {
                    dispatch(resetFile());
                }

                // Wait for 300ms to show the loading animation
                setTimeout(() => {
                    //
                    const reader = new FileReader();
                    reader.onload = () => {
                        if (file.type.includes("image")) {
                            dispatch(
                                setFile({
                                    file: file,
                                    name: file.name,
                                    type: file.type,
                                    size: file.size,
                                    preview:
                                        reader.result as FileType["preview"],
                                })
                            );
                        } else {
                            dispatch(
                                setFile({
                                    file: file,
                                    name: file.name,
                                    type: file.type,
                                    size: file.size,
                                    preview: "" as FileType["preview"],
                                } as FileType)
                            );
                        }
                    };
                    reader.readAsDataURL(file);
                }, 200);
            } else {
                // Check where the error is
                if (
                    file.type !== "image/png" &&
                    file.type !== "image/jpeg" &&
                    file.type !== "application/pdf"
                ) {
                    toast.error("Only PNG, JPG, and PDF files are allowed.");
                } else if (file.size > 10 * 1024 * 1024) {
                    toast.error("File size should be less than 10 MB.");
                } else {
                    toast.error("Something went wrong, please try again.");
                }
            }
        }
    };

    const handleFileDrop = (event: any) => {
        event.preventDefault();
        event.stopPropagation();
        const files: any = event.dataTransfer.files;
        const fileInput: any = document.getElementById("dropzone-file");
        fileInput.files = files;
        handleFileUpload({ target: fileInput });
    };

    const handleDeleteFile = () => {
        const fileInput: any = document.getElementById("dropzone-file");
        fileInput.value = "";
        toast.success("File deleted successfully");
        dispatch(resetFile());
    };

    return (
        <div className="flex flex-col gap-2 w-full">
            <label
                className="block tracking-wide text-left text-zinc-500 dark:text-zinc-300 text-xs font-bold"
                htmlFor="dropzone"
            >
                Upload your document
            </label>
            <div
                className="flex items-center justify-center w-full z-20"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                id="dropzone"
            >
                <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-64 border border-zinc-300 border-dashed rounded-lg cursor-pointer bg-zinc-50 dark:hover:bg-bray-800 dark:bg-zinc-900 hover:bg-zinc-100 dark:border-zinc-600 dark:hover:border-zinc-500 dark:hover:bg-zinc-800"
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <DocumentUpload
                            color="currentColor"
                            aria-hidden="true"
                            className="w-10 h-10 mb-3 text-zinc-400"
                            variant="Bulk"
                        />
                        <p className="mb-2 text-sm text-zinc-500 dark:text-zinc-400">
                            <span className="font-semibold">
                                Click to upload
                            </span>{" "}
                            or drag and drop
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            PNG, JPG or PDF (MAX. 10 MB)
                        </p>
                    </div>
                    <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        accept=".png, .jpg, .jpeg, .pdf"
                        onChange={handleFileUpload}
                    />
                </label>
            </div>
            <AnimatePresence>
                {uploadedFile &&
                    typeof uploadedFile !== "undefined" &&
                    uploadedFile !== null && (
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: -10,
                                scale: 0.9,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                y: -10,
                                scale: 0.9,
                            }}
                            className="w-full mt-0 flex flex-col gap-2 z-10"
                        >
                            <div className="flex items-center w-full justify-between gap-2 px-2 py-2 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-700 overflow-hidden">
                                <div className="flex text-left gap-2 flex-1 overflow-hidden">
                                    {uploadedFile.type.includes("image") ? (
                                        <img
                                            src={uploadedFile.preview as string}
                                            alt={uploadedFile.name}
                                            className="w-10 h-10 object-cover rounded-md"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 flex items-center justify-center rounded-md bg-zinc-200 dark:bg-zinc-600">
                                            <DocumentUpload
                                                color="currentColor"
                                                aria-hidden="true"
                                                className="w-5 h-5 text-zinc-400"
                                                variant="Bulk"
                                            />
                                        </div>
                                    )}
                                    <div className="flex w-full truncate flex-col flex-nowrap items-center justify-start space-y-1">
                                        <p className="w-full truncate text-sm font-medium text-zinc-800 dark:text-zinc-200">
                                            {uploadedFile.name}
                                        </p>
                                        <p className="w-full truncate text-xs text-zinc-500 dark:text-zinc-400">
                                            {formatFileSize(uploadedFile.size)}{" "}
                                            - {uploadedFile.type}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    className="p-2 text-zinc-500 hover:text-purple-500"
                                    onClick={() => handleDeleteFile()}
                                    type="button"
                                    title="Remove"
                                >
                                    <XCircle
                                        color="currentColor"
                                        aria-hidden="true"
                                        className="w-5 h-5"
                                    />
                                </button>
                            </div>
                        </motion.div>
                    )}
            </AnimatePresence>
        </div>
    );
};

const formatFileSize = (size: any) => {
    if (size === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export default FileUploadService;
