"use client";

import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { ArrowLeft3, ArrowRight3, CloseSquare, Warning2 } from "iconsax-react";
import Heading from "./Core/B. Correct/A. Heading";
import Fields from "./Core/B. Correct/C. Fields";
import Preview from "./Core/B. Correct/B. Preview";
import { resetStep, setStep } from "@/redux/actions/stepActions";
import { toast } from "react-hot-toast";
import { cancelSession, clearSession, resetSessionStatus, setActiveBatchSession, setSession } from "@/redux/slices/sessionSlice";
import { Steps } from "@/redux/types/states/Step";
import { generateDocument } from "@/redux/actions/sessionActions";

// Selection for Document Type
export default function Second_CorrectData() {
	const dispatch = useAppDispatch();
	const Doctype = useAppSelector((state) => state.documentType);
	const Session = useAppSelector((state) => state.session);
	const File = useAppSelector((state) => state.file);
	const isBatch = Session.isBatch;
	const batchResults = Session.batchResults || [];
	const [batchIndex, setBatchIndex] = useState(0);

	// In batch mode, set active session from batch results on mount / index change
	React.useEffect(() => {
		if (isBatch && batchResults.length > 0) {
			dispatch(setActiveBatchSession(batchIndex));
		}
	}, [isBatch, batchIndex, batchResults.length]);

	const handleResetOperation = () => {
		dispatch(clearSession());
		dispatch(resetStep());
	};

	const handleNextStep = async () => {
		var isValid = true;

		if (!Doctype?.fields) {
			isValid = false;
			return toast.error("Please select a document type.");
		}

		const StateFields:
			| {
					[key: string]: string;
			  }
			| undefined = Session?.Data?.Translation?.Text;

		const RequiredFields = Doctype?.fields?.filter(
			(Field) => Field.required
		);

		let MissingFields: string[] = [];

		RequiredFields?.forEach((StateField) => {
			if (!StateFields?.[StateField.name]) {
				MissingFields.push(StateField.name);
				isValid = false;
			}
		});

		if (isValid) {
			if (Session?.Data?.Translation?.Text) {
				const result = await dispatch(
					generateDocument({ CorrectedSession: Session.Data })
				);

				if (generateDocument.fulfilled.match(result)) {
					dispatch(setStep(Steps.Finish));
				}
			} else {
				toast.error("Please fill the required fields.");
			}
		} else {
			toast.error(
				`Please fill the required fields: ${MissingFields.join(", ")}.`,
				{
					id: "MissingFields",
					icon: <Warning2 color="currentColor" variant="Bulk" />,
				}
			);
		}
	};

	const handleRetry = () => {
		dispatch(resetSessionStatus());
		handleNextStep();
	};

	return (
		<div className="relative w-full">
			{/* Batch navigation */}
			{isBatch && batchResults.length > 1 && !Session.isLoading && (
				<div className="flex items-center justify-between mb-3 px-1">
					<button
						type="button"
						disabled={batchIndex === 0}
						onClick={() => setBatchIndex(batchIndex - 1)}
						className="text-xs font-medium text-sky-600 hover:text-sky-700 disabled:text-zinc-400 disabled:cursor-not-allowed"
					>
						Previous
					</button>
					<span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
						Document {batchIndex + 1} of {batchResults.length}
					</span>
					<button
						type="button"
						disabled={batchIndex >= batchResults.length - 1}
						onClick={() => setBatchIndex(batchIndex + 1)}
						className="text-xs font-medium text-sky-600 hover:text-sky-700 disabled:text-zinc-400 disabled:cursor-not-allowed"
					>
						Next
					</button>
				</div>
			)}

			<Heading />
			{File && Array.isArray(File) && File[batchIndex]?.file && <Preview />}
			{File && !Array.isArray(File) && (File as any)?.file && <Preview />}
			<Fields />
			{/* Error State */}
			{!Session.isLoading && Session.Status === "failed" && Session.Error && (
				<div className="flex flex-col gap-2 w-full mb-3 p-3 rounded-xl border border-red-500 bg-red-950/30 text-red-400">
					<div className="flex items-center gap-2">
						<CloseSquare color="currentColor" variant="Bulk" size={18} />
						<p className="text-sm font-medium">{Session.Error}</p>
					</div>
					<button
						type="button"
						onClick={handleRetry}
						className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-red-700 rounded-lg hover:bg-red-600 focus:outline-none transition duration-150 ease-in-out"
					>
						Try Again
					</button>
				</div>
			)}
			{/* Next Step */}
			{!Session.isLoading && (
				<>
					<button
						type="button"
						onClick={handleNextStep}
						className="inline-flex text-center w-full mb-2 gap-1 items-center justify-center px-3 py-2 text-sm font-medium text-white bg-sky-700 rounded-xl hover:bg-sky-800 focus:outline-none dark:bg-sky-600 dark:hover:bg-sky-700 focus:bg-sky-500 active:bg-sky-900 transition duration-150 ease-in-out"
					>
						Generate PDF
						<ArrowRight3 color="currentColor" variant="Bulk" />
					</button>
					<button
						type="button"
						className="inline-flex text-center gap-3 w-full mb-2 justify-center items-center font-medium text-sm px-5 py-2.5 bg-white rounded-xl border border-zinc-200 hover:bg-zinc-100 text-zinc-900 hover:text-sky-700 focus:z-10 dark:bg-zinc-950 dark:text-zinc-400 dark:border-zinc-600 dark:hover:text-white dark:hover:bg-zinc-800"
						onClick={handleResetOperation}
					>
						<ArrowLeft3 color="currentColor" variant="Bulk" />
						Back to Upload
					</button>
				</>
			)}

			{Session.isLoading && (
				<>
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
				</>
			)}
		</div>
	);
}
