"use client";

import { BackSquare, Home } from "iconsax-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export default function Register() {
	const Router = useRouter();
	return (
		<main className="grid flex-1 w-full min-h-full px-6 py-24 place-items-center sm:py-32 lg:px-8">
			<div className="max-w-xs text-center md:max-w-xl">
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

				<div className="flex flex-wrap items-center justify-between gap-3 mt-10">
					<Link
						href="/"
						className="inline-flex items-center justify-center flex-1 px-5 py-3 text-base font-medium text-center text-white bg-green-600 rounded-3xl hover:bg-green-800"
					>
						<span className="mr-2 font-semibold text-md whitespace-nowrap">
							Go back home
						</span>
						<Home variant="Bulk" color="currentColor" />
					</Link>
					<div
						onClick={() => {
							Router.back();
						}}
						className="inline-flex items-center justify-center flex-1 px-5 py-3 text-base font-medium text-center text-green-800 md:mt-0 whitespace-nowrap rounded-3xl bg-green-500/25 hover:bg-green-500/40 dark:text-green-300 dark:bg-green-950/50 dark:hover:bg-green-950/75"
					>
						<span className="mr-2 font-semibold text-md">
							Go Back
						</span>
						<BackSquare variant="Bulk" color="currentColor" />
					</div>
				</div>
			</div>
		</main>
	);
}
