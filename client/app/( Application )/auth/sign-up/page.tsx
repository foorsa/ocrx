"use client";

import Particles from "@/app/Components/Layout/Particles";
import { BackSquare, Home } from "iconsax-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export default function Register() {
	const Router = useRouter();
	return (
		<main className="grid min-h-full place-items-center w-full px-6 py-24 sm:py-32 lg:px-8 flex-1">
			<div className="text-center max-w-xs md:max-w-xl">
				<div className="fixed -z-10 top-0 left-0 w-full h-screen pointer-events-none">
					<Particles />
				</div>
				<p className="text-base font-semibold text-green-600 uppercase">
					Coming Soon
				</p>
				<h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
					Not Available !
				</h1>
				{/* <hr className="w-48 h-1 mx-auto my-2 bg-gray-500 border-0 rounded md:my-10 dark:bg-zinc-300/25" /> */}
				<p className="mt-6 text-base leading-7 text-zinc-600 dark:text-zinc-300">
					User registration is not available at the moment, please
					check back later.
				</p>

				<div className="mt-10 flex flex-wrap items-center justify-between gap-3">
					<Link
						href="/"
						className="flex-1 inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-xl bg-green-600 hover:bg-green-800"
					>
						<span className="mr-2 text-md font-semibold whitespace-nowrap">
							Go back home
						</span>
						<Home variant="Bulk" color="currentColor" />
					</Link>
					<div
						onClick={() => {
							Router.back();
						}}
						className="flex-1 md:mt-0 inline-flex justify-center items-center py-3 px-5 text-base font-medium whitespace-nowrap text-center rounded-xl text-green-800 bg-green-600/25 hover:bg-green-600/50 dark:text-green-300 dark:bg-green-600/50 dark:hover:bg-green-600/75"
					>
						<span className="mr-2 text-md font-semibold">
							Go Back
						</span>
						<BackSquare variant="Bulk" color="currentColor" />
					</div>
				</div>
			</div>
		</main>
	);
}
