"use client";
import React, { useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { useAppSelector } from "@/redux/hooks";
import { getApiServerUrl } from "@/utils/getApiServerUrl";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PDFPreview = () => {
	const Session = useAppSelector((state) => state.session);
	const PreviewLink = Session?.Data?.Generation?.["Preview Link"];
	const PYTHON_PUBLIC_URL = getApiServerUrl();
	const containerRef = useRef<HTMLDivElement>(null);
	const [containerWidth, setContainerWidth] = useState<number>(0);

	const resolveLink = (link: string | undefined) => {
		if (!link) return "";
		if (link.startsWith("/")) return PYTHON_PUBLIC_URL + link;
		return link;
	};

	const resolvedLink = resolveLink(PreviewLink);
	const isDocx = PreviewLink?.endsWith(".docx");

	const onContainerRef = (node: HTMLDivElement | null) => {
		if (node) {
			(containerRef as React.MutableRefObject<HTMLDivElement>).current = node;
			setContainerWidth(node.clientWidth);
		}
	};

	return (
		<div className="w-full h-auto relative my-5">
			<div className="relative mx-auto border-zinc-200 dark:border-zinc-800 bg-zinc-200 dark:bg-zinc-800 border-[16px] rounded-t-xl h-[172px] max-w-[301px] md:h-[294px] md:max-w-[512px]">
				<div className="overflow-hidden rounded-xl h-[140px] md:h-[262px] bg-zinc-400 dark:bg-zinc-600">
					{PreviewLink && !isDocx && (
						<div
							ref={onContainerRef}
							className="h-[140px] md:h-[262px] w-full rounded-xl overflow-hidden"
						>
							<Document
								file={resolvedLink}
								loading={
									<div className="h-full w-full flex items-center justify-center">
										<p className="text-zinc-200 text-sm">Loading PDF...</p>
									</div>
								}
								error={
									<div className="h-full w-full flex items-center justify-center p-5">
										<h4 className="text-white text-lg text-center font-bold uppercase">
											Document Ready
										</h4>
									</div>
								}
							>
								<Page
									pageNumber={1}
									width={containerWidth || undefined}
									renderTextLayer={false}
									renderAnnotationLayer={false}
								/>
							</Document>
						</div>
					)}

					{PreviewLink && isDocx && (
						<div className="h-[140px] md:h-[262px] w-full rounded-xl flex flex-col justify-center items-center p-5">
							<h4 className="text-white text-lg text-center font-bold uppercase">
								Document Ready
							</h4>
							<p className="text-zinc-200 dark:text-zinc-300 text-center text-sm mt-2">
								Your translated document has been generated.
							</p>
							<p className="text-zinc-200 dark:text-zinc-300 text-center text-sm mt-1">
								Click &quot;Download Document&quot; below to save it.
							</p>
						</div>
					)}

					{(!PreviewLink || PreviewLink == "") && (
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
