"use client";

import Link from "next/link";
import React from "react";
import { Documents as Data } from "@/redux/data/Documents";
import {
	DocumentType,
	DocumentsGroupType,
} from "@/redux/types/states/Document Type";
import PageTitle from "./components/1.Page Title";
import {
	BoxTime,
	Document,
	DocumentCode,
	DocumentText,
	DocumentText1,
	Dropbox,
	ElementPlus,
} from "iconsax-react";
import { useAppSelector } from "@/redux/hooks";
import { Undulate } from "@/components/SVG";
import Colors from "tailwindcss/colors";
import { useTheme } from "next-themes";

export default function AppPage() {
	const { theme } = useTheme();
	const Search = useAppSelector((state) => state.search);
	const FilteredDocuments: DocumentsGroupType[] = Search.modal.isOpen
		? Data
		: Search.filteredDocuments;

	return (
		<div className="relative flex flex-col items-center justify-start flex-1 w-full h-full max-w-screen-xl min-h-screen gap-10 p-5 mx-auto text-center text-zinc-900 dark:text-zinc-100">
			{/* Title of the App Page */}
			<PageTitle />

			{/* Document Type Selection Container */}
			<div className="flex flex-col items-start justify-start w-full h-auto gap-10 text-left">
				{FilteredDocuments.map((docType) => (
					<div
						className="flex flex-col items-start justify-start w-full h-auto gap-4"
						key={docType.id}
					>
						<div className="flex flex-col items-start justify-start w-full h-auto gap-3 text-left">
							<div className="text-xl font-bold">
								{docType.name}
							</div>
							<p className="text-sm font-medium opacity-50">
								{docType.description}
							</p>
						</div>

						<div className="grid w-full h-auto grid-cols-1 gap-5 grid-flow-dense sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
							{docType.documents.map((document) => (
								<>
									{document.state !== "Unavailable" ? (
										<Link
											className="relative flex flex-col w-full gap-3 p-5 mx-auto overflow-hidden text-green-500 bg-white group rounded-xl ring-1 ring-zinc-900/5 hover:bg-green-500 hover:ring-green-500 dark:bg-zinc-950 dark:ring-zinc-500/10 dark:hover:bg-green-500 dark:hover:ring-green-500 group-hover:text-white dark:text-zinc-50 dark:group-hover:text-white"
											key={document.id}
											href={`/app/translate?doc=${document.id}`}
										>
											<div className="flex items-center space-x-3">
												<DocumentText
													color="currentColor"
													variant="Bulk"
													className="w-6 h-6 text-green-500 group-hover:text-white dark:text-zinc-50 dark:group-hover:text-white "
												/>
												<h3 className="font-semibold text-md text-zinc-900 group-hover:text-white dark:text-zinc-50 dark:group-hover:text-white">
													{document.name}
												</h3>
											</div>
											<p className="text-sm text-zinc-500 group-hover:text-white dark:text-zinc-400 dark:group-hover:text-white">
												{document.description}
											</p>

											{/* Badges Footer */}
											<div className="relative flex flex-row items-center justify-start w-full gap-3 mt-5">
												{!!document.tags &&
													document.tags.map((tag) => {
														return (
															<span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-md dark:bg-zinc-900 dark:text-zinc-400 border border-green-400 dark:border-zinc-400 group-hover:bg-white group-hover:text-green-600 group-hover:border-white">
																{tag}
															</span>
														);
													})}
											</div>
										</Link>
									) : (
										<div className="relative flex flex-col w-full gap-3 p-5 mx-auto overflow-hidden bg-white group rounded-xl ring-1 ring-zinc-900/5 hover:bg-zinc-500 hover:ring-zinc-500 dark:bg-zinc-950 dark:ring-zinc-500/10 dark:hover:bg-zinc-500 dark:hover:ring-zinc-500 text-zinc-500 group-hover:text-white dark:text-zinc-50 dark:group-hover:text-white ">
											{/* Blur */}
											<div className="absolute top-0 left-0 bottom-0 right-0 h-full w-full transition duration-300 ease-in-out d-flex items-center align-center p-5 backdrop-blur-[2px] hover:backdrop-blur-0 z-20"></div>
											<div
												style={{
													background:
														theme == "light"
															? `linear-gradient(45deg, ${Colors.zinc[200]} 25%, ${Colors.zinc[300]} 25%, ${Colors.zinc[300]} 50%, ${Colors.zinc[200]} 50%, ${Colors.zinc[200]} 75%, ${Colors.zinc[300]} 75%, ${Colors.zinc[300]} 100%)`
															: `linear-gradient(45deg, ${Colors.zinc[700]} 25%, ${Colors.zinc[800]} 25%, ${Colors.zinc[800]} 50%, ${Colors.zinc[700]} 50%, ${Colors.zinc[700]} 75%, ${Colors.zinc[800]} 75%, ${Colors.zinc[800]} 100%)`,
													backgroundSize:
														"56.57px 56.57px !important",
												}}
												className="absolute top-0 left-0 bottom-0 right-0 h-full w-full transition duration-300 ease-in-out d-flex items-center align-center p-5 bg-[length:56px_56px] z-20"
											></div>
											{/* NOT AVAILABE */}

											<div className="z-30 flex items-center space-x-3">
												<BoxTime
													color="currentColor"
													variant="Bulk"
													className="z-30 w-6 h-6 text-green-zinc dark:text-zinc-50 "
												/>
												<h3 className="z-30 font-semibold text-md text-zinc-900 dark:text-zinc-50 ">
													{document.name}
												</h3>
											</div>
											<p className="z-30 text-sm text-zinc-500 dark:text-zinc-400 ">
												{document.description}
											</p>

											{/* Badges Footer */}
											<div className="relative flex flex-row items-center justify-start w-full gap-3 mt-5">
												{!!document.tags &&
													document.tags.map((tag) => {
														return (
															<span className="bg-zinc-100 text-zinc-800 text-xs font-medium px-2.5 py-0.5 rounded-md dark:bg-zinc-900 dark:text-zinc-400 border border-zinc-400 dark:border-zinc-400 group-hover:bg-white group-hover:text-zinc-600 group-hover:border-white z-30">
																{tag}
															</span>
														);
													})}
											</div>
										</div>
									)}
								</>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
