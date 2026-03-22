"use client";

import React from "react";
import {
	ArrowRight3,
} from "iconsax-react";
import FileUploadService from "./Core/A. Upload/C. FileUploadService";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import toast from "react-hot-toast";
import SelectDocType from "./Core/A. Upload/B. SelectDocType";
import Heading from "./Core/A. Upload/A. Heading";
import { setStep } from "@/redux/actions/stepActions";
import { Steps } from "@/redux/types/states/Step";
import { processDocumentStream, processBatch } from "@/redux/actions/sessionActions";
import { BatchFileType } from "@/redux/types/states/File";
import { resetFile } from "@/redux/actions/fileActions";

export default function First_DocumentUpload() {
	const Dispatch = useAppDispatch() as any;
	const Doctype = useAppSelector((state) => state.documentType);
	const UploadedFiles: BatchFileType[] = useAppSelector((state) => state.file) || [];
	const Session = useAppSelector((state) => state.session);
	const batchProgress = Session.batchProgress || {};

	const handleNextStep = async () => {
		if (!UploadedFiles || UploadedFiles.length === 0) {
			return toast.error("Please upload at least one file");
		}

		if (!Doctype?.name) {
			return toast.error("Please select a document type");
		}

		if (UploadedFiles.length === 1) {
			const result = await Dispatch(processDocumentStream({ Doctype, UploadedFile: UploadedFiles[0] }));

			if (processDocumentStream.fulfilled.match(result) && result.payload) {
				Dispatch(setStep(Steps.Correct));
			} else {
				toast.error("An error occurred while processing your document.");
			}
		} else {
			// Clear uploaded files so user can start adding more while batch runs
			const filesToProcess = [...UploadedFiles];
			Dispatch(resetFile());

			const result = await Dispatch(processBatch({ Doctype, Files: filesToProcess }));

			if (processBatch.fulfilled.match(result) && result.payload?.length > 0) {
				Dispatch(setStep(Steps.Correct));
			} else {
				toast.error("An error occurred while processing your documents.");
			}
		}
	};

	const totalCount = Object.keys(batchProgress).length;
	const isProcessing = Session.isLoading;
	const isBatchProcessing = isProcessing && Session.isBatch;

	return (
		<div className="relative w-full">
			{/* Upload form — always visible */}
			<div className="w-full flex flex-col flex-wrap mb-6 gap-3 max-w-full">
				<Heading />
				<SelectDocType />
				<FileUploadService />
			</div>

			{/* Process button — visible when not loading, or during batch (to submit more) */}
			{!isProcessing && (
				<button
					onClick={handleNextStep}
					className="inline-flex text-center w-full items-center justify-center px-3 py-2 text-sm font-medium text-white bg-sky-700 rounded-xl hover:bg-sky-800 focus:outline-none dark:bg-sky-600 dark:hover:bg-sky-700 focus:bg-sky-500 active:bg-sky-900 transition duration-150 ease-in-out"
				>
					Process {UploadedFiles.length > 1 ? `${UploadedFiles.length} Documents` : ''}
					<ArrowRight3 color="currentColor" variant="Bulk" />
				</button>
			)}

			{/* During batch: allow submitting more files */}
			{isBatchProcessing && UploadedFiles.length > 0 && (
				<button
					onClick={handleNextStep}
					className="inline-flex text-center w-full items-center justify-center px-3 py-2 text-sm font-medium text-white bg-sky-700 rounded-xl hover:bg-sky-800 focus:outline-none dark:bg-sky-600 dark:hover:bg-sky-700 focus:bg-sky-500 active:bg-sky-900 transition duration-150 ease-in-out"
				>
					Process {UploadedFiles.length} More
					<ArrowRight3 color="currentColor" variant="Bulk" />
				</button>
			)}

		</div>
	);
}
