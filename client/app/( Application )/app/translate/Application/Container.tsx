"use client";

import React, { useEffect } from "react";
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
import { clearSession } from "@/redux/slices/sessionSlice";
import { resetFile } from "@/redux/actions/fileActions";
import { resetStep } from "@/redux/actions/stepActions";

export default function Container({
	DocId,
}: {
	DocId: string | string[] | undefined;
}) {
	const Step = useAppSelector((state) => state.step);
	const Doctype = useAppSelector((state) => state.documentType);
	const Dispatch = useAppDispatch();

	const slideTransition = {
		initial: { opacity: 0, x: 20 },
		animate: { opacity: 1, x: 0 },
		exit: { opacity: 0, x: -20 },
		transition: { duration: 0.3 },
	};

	useEffect(() => {
		if (DocId !== undefined && DocId != "" && typeof DocId === "string") {
			const Docs: DocumentsGroupType[] = Documents;
			let isFound = false;
			Docs.map((Doc) => {
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

	useEffect(() => {
		Dispatch(setSearch(""));
	}, []);

	return (
		<div className="flex flex-col justify-center items-center w-full max-w-lg p-5 bg-white border border-zinc-200 rounded-xl dark:bg-zinc-950 dark:border-zinc-800 overflow-hidden">
			<Stepper />
			<AnimatePresence initial={false} mode="wait">
				{Step === Steps.Upload && (
					<motion.div key="upload" {...slideTransition} className="relative w-full">
						<First_DocumentUpload />
					</motion.div>
				)}
				{Step === Steps.Correct && (
					<motion.div key="correct" {...slideTransition} className="relative w-full">
						<Second_CorrectData />
					</motion.div>
				)}
				{Step === Steps.Finish && (
					<motion.div key="finish" {...slideTransition} className="relative w-full">
						<Third_FinishOperation />
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
