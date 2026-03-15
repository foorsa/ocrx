import React, { useMemo } from "react";
import { useAppSelector } from "@/redux/hooks";

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
		<div className="w-full h-auto relative my-5">
			<div className="relative mx-auto border-zinc-200 dark:border-zinc-800 bg-zinc-200 dark:bg-zinc-800 border-[16px] rounded-t-xl h-[172px] max-w-[301px] md:h-[294px] md:max-w-[512px]">
				<div className="overflow-hidden rounded-xl h-[140px] md:h-[262px] bg-zinc-400 dark:bg-zinc-600">
					{pdfDataUrl ? (
						<iframe
							src={pdfDataUrl}
							className="w-full h-[140px] md:h-[262px] rounded-xl"
							title="PDF Preview"
						/>
					) : PreviewLink && PreviewLink !== "" ? (
						<div className="h-[140px] md:h-[262px] w-full rounded-xl flex flex-col justify-center items-center p-5">
							<svg
								className="w-12 h-12 text-white mb-3"
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
							<h4 className="text-white text-lg text-center font-bold uppercase">
								Document Ready
							</h4>
							<p className="text-zinc-200 dark:text-zinc-300 text-center text-sm mt-2">
								Your translated document has been generated.
							</p>
							<p className="text-zinc-200 dark:text-zinc-300 text-center text-sm mt-1">
								Click &quot;Download PDF&quot; below to save it.
							</p>
						</div>
					) : (
						<div className="h-[140px] md:h-[262px] w-full rounded-xl flex flex-col justify-center items-center p-5">
							<h4 className="text-zinc-500 text-lg dark:text-zinc-500 text-center font-bold uppercase">
								PDF Preview
							</h4>
							<p className="text-zinc-500 dark:text-zinc-500 text-center text-sm uppercase">
								Please generate the PDF to view it.
							</p>
						</div>
					)}
				</div>
			</div>
			<div className="relative mx-auto bg-zinc-100 dark:bg-zinc-900 rounded-b-xl h-[24px] max-w-[301px] md:h-[42px] md:max-w-[512px]"></div>
			<div className="relative mx-auto bg-zinc-200 dark:bg-zinc-800 rounded-b-xl h-[55px] max-w-[83px] md:h-[95px] md:max-w-[142px]"></div>
		</div>
	);
};

export default PDFPreview;
