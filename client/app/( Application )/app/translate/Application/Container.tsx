"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import First_DocumentUpload from "./Steps/1. Document Upload";
import Stepper from "./Steps/0. Stepper";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Steps } from "@/redux/types/states/Step";
import Second_CorrectData from "./Steps/2. Fields Correction";
import Third_FinishOperation from "./Steps/3. Finish Operation";
import { AnimatePresence, motion } from "framer-motion";
import { Documents } from "@/redux/data/Documents";
import {
	DocumentsGroupType,
	DocumentType,
} from "@/redux/types/states/Document Type";
import { setDocumentType } from "@/redux/actions/documentTypeActions";
import BaccalaureateDegree from "@/redux/data/core/Baccalaureate/Docs/Baccalaureate Certificate";
import { setSearch } from "@/redux/slices/searchSlice";
import { clearBatch, clearSession, setSession, setActiveBatchSession, BatchItemProgress } from "@/redux/slices/sessionSlice";
import { resetFile } from "@/redux/actions/fileActions";
import { resetStep, setStep } from "@/redux/actions/stepActions";
import { useRouter } from "next/navigation";
import {
	ArrowDown2,
	ArrowUp2,
	TickCircle,
	CloseCircle,
	CloseSquare,
	Timer,
	Eye,
} from "iconsax-react";

export default function Container({
	DocId,
}: {
	DocId: string | string[] | undefined;
}) {
	const Step = useAppSelector((state) => state.step);
	const Doctype = useAppSelector((state) => state.documentType);
	const Session = useAppSelector((state) => state.session);
	const Dispatch = useAppDispatch();
	const [expanded, setExpanded] = useState(false);
	const [dismissed, setDismissed] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (DocId !== undefined && DocId != "" && typeof DocId === "string") {
			const Docs: DocumentsGroupType[] = Documents;
			let isFound = false;
			const Doc = Docs.map((Doc) => {
				Doc.documents.map((Doc: DocumentType) => {
					if (Doc.id === DocId && !isFound) {
						isFound = true;

						if (Doctype?.id !== Doc.id) {
							Dispatch(setSearch(""));
							Dispatch(clearSession());
							Dispatch(resetFile());
							Dispatch(resetStep());
						}

						return Dispatch(setDocumentType(Doc));
					}
				});
			});

			if (!isFound) {
				Dispatch(setDocumentType(BaccalaureateDegree));
			}
		}
	}, [DocId]);

	const slideTransition = {
		initial: { opacity: 0, x: 20 },
		animate: { opacity: 1, x: 0 },
		exit: { opacity: 0, x: -20 },
		transition: { duration: 0.3 },
	};

	useEffect(() => {
		Dispatch(setSearch(""));
	}, []);

	// Reset dismissed when a new batch starts
	useEffect(() => {
		if (Session.isLoading && Session.isBatch) {
			setDismissed(false);
			setExpanded(true);
		}
	}, [Session.isLoading, Session.isBatch]);

	// Batch progress data
	const batchProgress = Session.batchProgress || {};
	const progressEntries = Object.values(batchProgress) as BatchItemProgress[];
	const completedCount = progressEntries.filter(p => p.status === "completed").length;
	const failedCount = progressEntries.filter(p => p.status === "failed").length;
	const processingCount = progressEntries.filter(p => p.status === "processing").length;
	const pendingCount = progressEntries.filter(p => p.status === "pending").length;
	const totalCount = progressEntries.length;
	const showBar = Session.isBatch && totalCount > 0 && !dismissed;

	const handleViewDoc = (item: BatchItemProgress) => {
		if (item.session) {
			Dispatch(setSession(item.session));
			Dispatch(setStep(Steps.Correct));
		}
	};

	const handleDismiss = () => {
		setDismissed(true);
		setExpanded(false);
		Dispatch(clearBatch());
	};

	return (
		<>
			<div className="flex flex-col justify-center items-center w-full max-w-lg p-5 bg-white border border-zinc-200 rounded-xl dark:bg-zinc-950 dark:border-zinc-800 overflow-hidden">
				<Stepper />
				<AnimatePresence initial={false} mode="wait">
					{Step === Steps.Upload && (
						<motion.div
							key="upload"
							{...slideTransition}
							className="relative w-full"
						>
							<First_DocumentUpload />
						</motion.div>
					)}
					{Step === Steps.Correct && (
						<motion.div
							key="correct"
							{...slideTransition}
							className="relative w-full"
						>
							<Second_CorrectData />
						</motion.div>
					)}
					{Step === Steps.Finish && (
						<motion.div
							key="finish"
							{...slideTransition}
							className="relative w-full"
						>
							<Third_FinishOperation />
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{/* Batch progress bar — portaled to body, persists across all steps */}
			{mounted && showBar && createPortal(
				<div
					style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999 }}
					className="bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 shadow-2xl"
				>
					{/* Header */}
					<div className="flex items-center">
						<button
							onClick={() => setExpanded(!expanded)}
							className="flex-1 flex items-center justify-between px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
							type="button"
						>
							<div className="flex items-center gap-3">
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
										? `Processing ${completedCount + failedCount}/${totalCount}...`
										: `${completedCount}/${totalCount} documents ready`
									}
								</span>
								{failedCount > 0 && (
									<span className="text-xs text-red-500 font-medium">{failedCount} failed</span>
								)}
							</div>
							<div className="flex items-center gap-2">
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
						{/* Dismiss button — only when all done */}
						{processingCount === 0 && pendingCount === 0 && (
							<button
								onClick={handleDismiss}
								className="px-3 py-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
								type="button"
								title="Dismiss"
							>
								<CloseSquare color="currentColor" variant="Bulk" className="w-4 h-4" />
							</button>
						)}
					</div>

					{/* Expanded file list */}
					{expanded && (
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
									{item.status === "completed" && item.session && (
										<button
											onClick={() => handleViewDoc(item)}
											className="flex items-center gap-1 text-xs text-sky-600 hover:text-sky-700 font-medium flex-shrink-0"
											type="button"
										>
											<Eye color="currentColor" variant="Bulk" className="w-3.5 h-3.5" />
											View
										</button>
									)}
									{item.status !== "completed" && (
										<span className="text-xs text-zinc-500 capitalize flex-shrink-0">
											{item.status === "processing" ? item.phase : item.status}
										</span>
									)}
								</div>
							))}
						</div>
					)}
				</div>,
				document.body
			)}
		</>
	);
}
