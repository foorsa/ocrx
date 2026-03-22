"use client";

import React from "react";
import {
	ArrowRight3,
	TickCircle,
	CloseCircle,
	Timer,
} from "iconsax-react";
import FileUploadService from "./Core/A. Upload/C. FileUploadService";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { Button } from "flowbite-react";
import toast from "react-hot-toast";
import SelectDocType from "./Core/A. Upload/B. SelectDocType";
import Heading from "./Core/A. Upload/A. Heading";
import { setStep } from "@/redux/actions/stepActions";
import { Steps } from "@/redux/types/states/Step";
import { processDocumentStream, processBatch } from "@/redux/actions/sessionActions";
import { BatchFileType } from "@/redux/types/states/File";
import { BatchItemProgress } from "@/redux/slices/sessionSlice";
import LoadingScreens from "./Core/Utilities/Common";

// Selection for Document Type
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
			// Single file: use streaming (existing behavior)
			const result = await Dispatch(processDocumentStream({ Doctype, UploadedFile: UploadedFiles[0] }));

			if (processDocumentStream.fulfilled.match(result) && result.payload) {
				Dispatch(setStep(Steps.Correct));
			} else {
				toast.error("An error occurred while processing your document.");
			}
		} else {
			// Multiple files: use batch processing
			const result = await Dispatch(processBatch({ Doctype, Files: UploadedFiles }));

			if (processBatch.fulfilled.match(result) && result.payload?.length > 0) {
				Dispatch(setStep(Steps.Correct));
			} else {
				toast.error("An error occurred while processing your documents.");
			}
		}
	};

	const progressEntries = Object.values(batchProgress) as BatchItemProgress[];
	const completedCount = progressEntries.filter(p => p.status === "completed").length;
	const failedCount = progressEntries.filter(p => p.status === "failed").length;
	const totalCount = progressEntries.length;

	return (
		<div className="relative w-full">
			{/* Form Fields */}
			<div className="w-full flex flex-col flex-wrap mb-6 gap-3 max-w-full">
				{!Session.isLoading && (
					<>
						<Heading />
						<SelectDocType />
						<FileUploadService />
					</>
				)}

				{Session.isLoading && !Session.isBatch && <LoadingScreens Type="Processing" />}

				{/* Batch progress UI */}
				{Session.isLoading && Session.isBatch && totalCount > 0 && (
					<div className="flex flex-col gap-3 w-full">
						<div className="flex items-center justify-between">
							<h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
								Processing {completedCount + failedCount}/{totalCount} documents
							</h3>
							<span className="text-xs text-zinc-500">
								{completedCount} done{failedCount > 0 ? `, ${failedCount} failed` : ''}
							</span>
						</div>

						{/* Overall progress bar */}
						<div className="w-full bg-zinc-200 rounded-full h-2 dark:bg-zinc-700">
							<div
								className="bg-sky-600 h-2 rounded-full transition-all duration-300"
								style={{ width: `${totalCount > 0 ? ((completedCount + failedCount) / totalCount) * 100 : 0}%` }}
							/>
						</div>

						{/* Per-file progress list */}
						<div className="max-h-64 overflow-y-auto flex flex-col gap-1.5">
							{progressEntries.map((item) => (
								<div
									key={item.fileId}
									className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
								>
									{item.status === "completed" && (
										<TickCircle color="currentColor" variant="Bold" className="w-4 h-4 text-green-500 flex-shrink-0" />
									)}
									{item.status === "failed" && (
										<CloseCircle color="currentColor" variant="Bold" className="w-4 h-4 text-red-500 flex-shrink-0" />
									)}
									{item.status === "processing" && (
										<svg className="w-4 h-4 text-sky-500 animate-spin flex-shrink-0" viewBox="0 0 24 24" fill="none">
											<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
											<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
										</svg>
									)}
									{item.status === "pending" && (
										<Timer color="currentColor" variant="Bulk" className="w-4 h-4 text-zinc-400 flex-shrink-0" />
									)}
									<span className="text-xs truncate flex-1 text-zinc-700 dark:text-zinc-300">
										{item.fileName}
									</span>
									<span className="text-xs text-zinc-500 capitalize flex-shrink-0">
										{item.status === "processing" ? item.phase : item.status}
									</span>
								</div>
							))}
						</div>
					</div>
				)}
			</div>

			{/* Next Step */}
			{!Session.isLoading && (
				<button
					onClick={handleNextStep}
					className="inline-flex text-center w-full items-center justify-center px-3 py-2 text-sm font-medium text-white bg-sky-700 rounded-xl hover:bg-sky-800 focus:outline-none dark:bg-sky-600 dark:hover:bg-sky-700 focus:bg-sky-500 active:bg-sky-900 transition duration-150 ease-in-out"
				>
					Process {UploadedFiles.length > 1 ? `${UploadedFiles.length} Documents` : ''}
					<ArrowRight3 color="currentColor" variant="Bulk" />
				</button>
			)}

			{Session.isLoading && !Session.isBatch && (
				<button
					disabled
					type="button"
					className="text-white w-full bg-black hover:bg-sky-800 focus:outline-none font-medium rounded-xl text-sm px-5 py-2.5 text-center mb-2 dark:bg-sky-600 dark:hover:bg-sky-700 inline-flex items-center justify-center"
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
			)}
		</div>
	);
}
