"use client";

import React, { useState } from "react";
import {
	ArrowRight3,
	ArrowDown2,
	ArrowUp2,
	TickCircle,
	CloseCircle,
	Timer,
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
import { BatchItemProgress } from "@/redux/slices/sessionSlice";
import { AnimatePresence, motion } from "framer-motion";
import { resetFile } from "@/redux/actions/fileActions";

export default function First_DocumentUpload() {
	const Dispatch = useAppDispatch() as any;
	const Doctype = useAppSelector((state) => state.documentType);
	const UploadedFiles: BatchFileType[] = useAppSelector((state) => state.file) || [];
	const Session = useAppSelector((state) => state.session);
	const batchProgress = Session.batchProgress || {};
	const [expanded, setExpanded] = useState(true);

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

	const progressEntries = Object.values(batchProgress) as BatchItemProgress[];
	const completedCount = progressEntries.filter(p => p.status === "completed").length;
	const failedCount = progressEntries.filter(p => p.status === "failed").length;
	const processingCount = progressEntries.filter(p => p.status === "processing").length;
	const totalCount = progressEntries.length;
	const isProcessing = Session.isLoading;
	const isBatchProcessing = isProcessing && Session.isBatch;

	return (
		<div className="relative w-full">
			{/* Upload form — always visible, even during batch processing */}
			<div className="w-full flex flex-col flex-wrap mb-6 gap-3 max-w-full">
				{(!isProcessing || isBatchProcessing) && (
					<>
						<Heading />
						<SelectDocType />
						<FileUploadService />
					</>
				)}

				{/* Single-file processing: show inline spinner only */}
				{isProcessing && !Session.isBatch && (
					<div className="flex items-center justify-center gap-3 py-8">
						<svg className="w-5 h-5 text-sky-500 animate-spin" viewBox="0 0 24 24" fill="none">
							<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
							<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
						</svg>
						<span className="text-sm text-zinc-600 dark:text-zinc-400">Processing your document...</span>
					</div>
				)}
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

			{/* Collapsed batch progress bar — fixed to bottom of screen */}
			<AnimatePresence>
				{isBatchProcessing && totalCount > 0 && (
					<motion.div
						initial={{ y: 100, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: 100, opacity: 0 }}
						transition={{ type: "spring", damping: 25, stiffness: 300 }}
						className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 shadow-2xl"
					>
						{/* Collapsed header — always visible */}
						<button
							onClick={() => setExpanded(!expanded)}
							className="w-full flex items-center justify-between px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
							type="button"
						>
							<div className="flex items-center gap-3">
								{/* Spinning indicator */}
								{processingCount > 0 && (
									<svg className="w-4 h-4 text-sky-500 animate-spin flex-shrink-0" viewBox="0 0 24 24" fill="none">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
									</svg>
								)}
								{processingCount === 0 && completedCount > 0 && (
									<TickCircle color="currentColor" variant="Bold" className="w-4 h-4 text-green-500 flex-shrink-0" />
								)}
								<span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
									{processingCount > 0
										? `Processing ${completedCount + failedCount}/${totalCount} documents...`
										: `${completedCount}/${totalCount} documents processed`
									}
								</span>
								{failedCount > 0 && (
									<span className="text-xs text-red-500 font-medium">
										{failedCount} failed
									</span>
								)}
							</div>
							<div className="flex items-center gap-2">
								{/* Mini progress */}
								<div className="w-24 bg-zinc-200 rounded-full h-1.5 dark:bg-zinc-700">
									<div
										className="bg-sky-600 h-1.5 rounded-full transition-all duration-300"
										style={{ width: `${totalCount > 0 ? ((completedCount + failedCount) / totalCount) * 100 : 0}%` }}
									/>
								</div>
								{expanded
									? <ArrowDown2 color="currentColor" className="w-4 h-4 text-zinc-500" />
									: <ArrowUp2 color="currentColor" className="w-4 h-4 text-zinc-500" />
								}
							</div>
						</button>

						{/* Expanded file list */}
						<AnimatePresence>
							{expanded && (
								<motion.div
									initial={{ height: 0, opacity: 0 }}
									animate={{ height: "auto", opacity: 1 }}
									exit={{ height: 0, opacity: 0 }}
									transition={{ duration: 0.2 }}
									className="overflow-hidden"
								>
									<div className="px-4 pb-3 max-h-48 overflow-y-auto flex flex-col gap-1.5">
										{progressEntries.map((item) => (
											<div
												key={item.fileId}
												className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800"
											>
												{item.status === "completed" && (
													<TickCircle color="currentColor" variant="Bold" className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
												)}
												{item.status === "failed" && (
													<CloseCircle color="currentColor" variant="Bold" className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
												)}
												{item.status === "processing" && (
													<svg className="w-3.5 h-3.5 text-sky-500 animate-spin flex-shrink-0" viewBox="0 0 24 24" fill="none">
														<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
														<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
													</svg>
												)}
												{item.status === "pending" && (
													<Timer color="currentColor" variant="Bulk" className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
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
								</motion.div>
							)}
						</AnimatePresence>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
