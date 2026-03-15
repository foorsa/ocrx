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

	const previewSrc = pdfDataUrl || (PreviewLink && PreviewLink !== "" ? PreviewLink : null);

	return (
		<div className="w-full mb-5">
			{previewSrc ? (
				<iframe
					src={previewSrc}
					className="w-full h-96 bg-white border border-zinc-200 shadow-2xl dark:bg-zinc-800 dark:border-zinc-700 rounded-xl"
					title="PDF Preview"
				/>
			) : (
				<div className="w-full h-48 rounded-xl flex flex-col justify-center items-center p-6 bg-zinc-100 text-zinc-400 dark:text-zinc-400 border border-zinc-300 dark:bg-zinc-700 dark:border-zinc-600">
					<TableDocument size="64" variant="Bulk" color="currentColor" />
				</div>
			)}
		</div>
	);
};

export default PDFPreview;
