import { useAppSelector } from "@/redux/hooks";
import { FileType } from "@/redux/types/states/File";
import { TableDocument } from "iconsax-react";
import React from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

export default function Preview() {
	const UploadedFile: FileType = useAppSelector((state) => state.file);

	const isImage = UploadedFile?.type?.includes("image");
	const isPdf = UploadedFile?.type === "application/pdf";
	const hasPreview = (isImage || isPdf) && !!UploadedFile?.preview;

	return (
		<>
			{!hasPreview && (
				<div className="flex flex-col w-full h-48 min-h-none max-h-none justify-center items-center overflow-hidden blocksm p-6 bg-zinc-100 text-zinc-400 dark:text-zinc-400 border border-zinc-300 hover:bg-zinc-200 dark:bg-zinc-700 dark:border-zinc-600 dark:hover:bg-zinc-600 rounded-xl mb-5">
					<TableDocument size="64" variant="Bulk" color="currentColor" />
				</div>
			)}
			{isImage && UploadedFile.preview && (
				<Zoom classDialog="w-full h-full backdrop:blur-3xl bg-zinc-50/50 dark:bg-zinc-800/50">
					<img
						className="flex flex-col w-full h-auto max-h-96 min-h-none justify-center items-center overflow-hidden blocksm bg-white border border-zinc-200 shadow-2xl hover:bg-zinc-100 dark:bg-zinc-800 dark:border-zinc-700 dark:hover:bg-zinc-700 relative rounded-xl mb-5"
						alt="Document preview"
						src={UploadedFile.preview}
						width="500"
					/>
				</Zoom>
			)}
			{isPdf && UploadedFile.preview && (
				<iframe
					src={UploadedFile.preview}
					className="w-full h-96 bg-white border border-zinc-200 shadow-2xl dark:bg-zinc-800 dark:border-zinc-700 rounded-xl mb-5"
					title="PDF Preview"
				/>
			)}
		</>
	);
}
