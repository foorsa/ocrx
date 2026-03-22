"use client";

import React from "react";
import { DocumentUpload, CloseSquare as XCircle } from "iconsax-react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { toast } from "react-hot-toast";
import { setFiles, removeFile, resetFile } from "@/redux/actions/fileActions";
import { BatchFileType } from "@/redux/types/states/File";
import { AnimatePresence, motion } from "framer-motion";

const MAX_FILES = 50;

const FileUploadService = () => {
	const dispatch = useAppDispatch();
	const uploadedFiles: BatchFileType[] = useAppSelector((state) => state.file) || [];

	const handleFileUpload = (event: any) => {
		const files: File[] = Array.from(event.target.files || []);
		const newFiles: BatchFileType[] = [];

		const remaining = MAX_FILES - uploadedFiles.length;
		if (files.length > remaining) {
			toast.error(`You can upload up to ${MAX_FILES} files. ${remaining} slots remaining.`);
		}

		const toProcess = files.slice(0, remaining);

		for (const file of toProcess) {
			if (
				!(file.type === "image/png" ||
					file.type === "image/jpeg" ||
					file.type === "application/pdf")
			) {
				toast.error(`${file.name}: Only PNG, JPG, and PDF files are allowed.`);
				continue;
			}
			if (file.size > 10 * 1024 * 1024) {
				toast.error(`${file.name}: File size should be less than 10 MB.`);
				continue;
			}

			newFiles.push({
				file,
				name: file.name,
				type: file.type,
				size: file.size,
				preview: URL.createObjectURL(file),
				id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
			});
		}

		if (newFiles.length > 0) {
			dispatch(setFiles([...uploadedFiles, ...newFiles]));
			toast.success(`${newFiles.length} file${newFiles.length > 1 ? 's' : ''} added`);
		}
	};

	const handleFileDrop = (event: any) => {
		event.preventDefault();
		event.stopPropagation();
		const files = event.dataTransfer.files;
		handleFileUpload({ target: { files } });
	};

	const handleDeleteFile = (id: string) => {
		dispatch(removeFile(id));
	};

	const handleClearAll = () => {
		dispatch(resetFile());
		const fileInput: any = document.getElementById("dropzone-file");
		if (fileInput) fileInput.value = "";
		toast.success("All files removed");
	};

	return (
		<div className="flex flex-col gap-3 w-full">
			<div className="flex items-center justify-between">
				<label
					className="block tracking-wide text-left text-zinc-500 dark:text-zinc-300 text-xs font-bold"
					htmlFor="dropzone"
				>
					Upload your documents {uploadedFiles.length > 0 && `(${uploadedFiles.length}/${MAX_FILES})`}
				</label>
				{uploadedFiles.length > 1 && (
					<button
						onClick={handleClearAll}
						className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
						type="button"
					>
						Clear all
					</button>
				)}
			</div>
			<div
				className="flex items-center justify-center w-full z-20"
				onDragOver={(e) => e.preventDefault()}
				onDrop={handleFileDrop}
				id="dropzone"
			>
				<label
					htmlFor="dropzone-file"
					className="flex flex-col items-center justify-center w-full h-48 border border-zinc-300 border-dashed rounded-xl cursor-pointer bg-zinc-50 dark:hover:bg-bray-800 dark:bg-zinc-900 hover:bg-zinc-100 dark:border-zinc-600 dark:hover:border-zinc-500 dark:hover:bg-zinc-800"
				>
					<div className="flex flex-col items-center justify-center pt-5 pb-6">
						<DocumentUpload
							color="currentColor"
							aria-hidden="true"
							className="w-10 h-10 mb-3 text-zinc-400"
							variant="Bulk"
						/>
						<p className="mb-2 text-sm text-zinc-500 dark:text-zinc-400">
							<span className="font-semibold">
								Click to upload
							</span>{" "}
							or drag and drop
						</p>
						<p className="text-xs text-zinc-500 dark:text-zinc-400">
							PNG, JPG or PDF (MAX. 10 MB each, up to {MAX_FILES} files)
						</p>
					</div>
					<input
						id="dropzone-file"
						type="file"
						className="hidden"
						accept=".png, .jpg, .jpeg, .pdf"
						onChange={handleFileUpload}
						multiple
					/>
				</label>
			</div>
			<AnimatePresence>
				{uploadedFiles.length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: -10, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -10, scale: 0.95 }}
						className="w-full mt-0 flex flex-col gap-2 z-10 max-h-60 overflow-y-auto"
					>
						{uploadedFiles.map((file) => (
							<motion.div
								key={file.id}
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: 10 }}
								className="flex items-center w-full justify-between gap-3 px-2 py-2 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-700 overflow-hidden"
							>
								<div className="flex text-left gap-3 flex-1 overflow-hidden">
									{file.type.includes("image") ? (
										<img
											src={file.preview}
											alt={file.name}
											className="w-10 h-10 object-cover rounded-xl"
										/>
									) : (
										<div className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-200 dark:bg-zinc-600">
											<DocumentUpload
												color="currentColor"
												aria-hidden="true"
												className="w-5 h-5 text-zinc-400"
												variant="Bulk"
											/>
										</div>
									)}
									<div className="flex w-full truncate flex-col flex-nowrap items-center justify-start space-y-1">
										<p className="w-full truncate text-sm font-medium text-zinc-800 dark:text-zinc-200">
											{file.name}
										</p>
										<p className="w-full truncate text-xs text-zinc-500 dark:text-zinc-400">
											{formatFileSize(file.size)}{" "}
											- {file.type}
										</p>
									</div>
								</div>
								<button
									className="p-2 text-zinc-500 hover:text-red-500"
									onClick={() => handleDeleteFile(file.id)}
									type="button"
									title="Remove"
								>
									<XCircle
										color="currentColor"
										aria-hidden="true"
										className="w-5 h-5"
									/>
								</button>
							</motion.div>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

const formatFileSize = (size: any) => {
	if (size === 0) return "0 Bytes";
	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
	const i = Math.floor(Math.log(size) / Math.log(k));
	return parseFloat((size / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export default FileUploadService;
