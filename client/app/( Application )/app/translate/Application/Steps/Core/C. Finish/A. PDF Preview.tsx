import React from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const PDFPreview = () => {
	const Dispatch = useAppDispatch();
	const Session = useAppSelector((state) => state.session);
	const PDFLink = Session?.Data?.Generation?.["Preview Link"];

	console.log("PDFLink", PDFLink);

	return (
		<div className="w-full h-auto relative my-5">
			<div className="relative mx-auto border-zinc-200 dark:border-zinc-800 bg-zinc-200 dark:bg-zinc-800 border-[16px] rounded-t-xl h-[172px] max-w-[301px] md:h-[294px] md:max-w-[512px]">
				<div className="overflow-hidden rounded-xl h-[140px] md:h-[262px] bg-zinc-400 dark:bg-zinc-600">
					{PDFLink && (
						<div className="h-[140px] md:h-[262px] w-full rounded-xl">
							{/* PDF Here */}
							<object
								data={PDFLink}
								type="application/pdf"
								className="w-full h-full flex flex-col justify-center items-center overflow-hidden no-scrollbar"
								title="PDF Preview"
								width="100%"
								height="100%"
							>
								<p>
									Your browser does not support PDFs. Please
									download the PDF to view it:
									<a href={PDFLink}>Download PDF</a>
								</p>
							</object>
						</div>
					)}

					{(!PDFLink || PDFLink == "") && (
						<div className="h-[140px] md:h-[262px] w-full rounded-xl flex flex-col justify-center items-center p-5">
							<h4 className="text-zinc-500 text-lg dark:text-zinc-500 text-center font-bold uppercase">
								{/* Not Generated Yet */}
								PDF Preview
							</h4>
							<p className="text-zinc-500 dark:text-zinc-500 text-center text-sm uppercase">
								{/* Not Generated Yet */}
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
