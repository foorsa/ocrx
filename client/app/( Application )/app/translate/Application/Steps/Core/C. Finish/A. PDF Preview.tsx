import React, { useMemo } from "react";
import { useAppSelector } from "@/redux/hooks";
import { TableDocument } from "iconsax-react";

const PDFPreview = () => {
	const Session = useAppSelector((state) => state.session);
	const PreviewLink = Session?.Data?.Generation?.["Preview Link"];
	const FileData = Session?.Data?.Generation?.["File Data"];
	const FileName = Session?.Data?.Generation?.["File Name"] || "";
	const isPdf = FileName.endsWith(".pdf");

	const pdfDataUrl = useMemo(() => {
		if (FileData && isPdf) {
			return `data:application/pdf;base64,${FileData}`;
		}
		return null;
	}, [FileData, isPdf]);

	return (
		<div className="w-full mb-5">
			{pdfDataUrl ? (
				<iframe
					src={pdfDataUrl}
					className="w-full h-96 bg-white border border-zinc-200 shadow-2xl dark:bg-zinc-800 dark:border-zinc-700 rounded-xl"
					title="PDF Preview"
				/>
			) : PreviewLink && PreviewLink !== "" ? (
				<div className="w-full h-48 rounded-xl flex flex-col justify-center items-center p-5 bg-zinc-100 border border-zinc-300 dark:bg-zinc-700 dark:border-zinc-600">
					<svg
						className="w-10 h-10 text-zinc-400 dark:text-zinc-300 mb-2"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={1.5}
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<h4 className="text-zinc-600 dark:text-zinc-200 text-sm text-center font-bold uppercase">
						Document Ready
					</h4>
					<p className="text-zinc-500 dark:text-zinc-400 text-center text-xs mt-1">
						Click &quot;Download PDF&quot; below to save it.
					</p>
				</div>
			) : (
				<div className="w-full h-48 rounded-xl flex flex-col justify-center items-center p-6 bg-zinc-100 text-zinc-400 dark:text-zinc-400 border border-zinc-300 dark:bg-zinc-700 dark:border-zinc-600">
					<TableDocument size="64" variant="Bulk" color="currentColor" />
				</div>
			)}
		</div>
	);
};

export default PDFPreview;
