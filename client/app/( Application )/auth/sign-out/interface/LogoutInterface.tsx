"use client"; // Error components must be Client Components

import { BackSquare, Home } from "iconsax-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function LogoutInterface() {
	const router = useRouter();
	const { data: session, status } = useSession();
	const [count, setCount] = useState(0);

	useEffect(() => {
		if (count === 3) {
			return router.push("/");
		}

		const interval = setInterval(() => {
			setCount((count) => count + 1);
		}, 1000);

		return () => clearInterval(interval);
	}, [count, router]);

	useEffect(() => {
		if (status === "authenticated") {
			signOut();
		}
	}, [status]);

	return (
		<main className="grid w-full min-h-full px-6 py-24 place-items-center sm:py-32 lg:px-8">
			<div className="max-w-xs text-center md:max-w-xl">
				<p className="text-base font-semibold text-sky-600">
					{/* Status Code */}
					200
				</p>
				<h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
					You have been Logged Out!
				</h1>
				<p className="mt-6 text-base leading-7 text-zinc-600 dark:text-zinc-300">
					Thank you for using OCRX.
				</p>
				<div className="relative w-full p-4 mt-6 overflow-hidden border bg-zinc-50 dark:bg-zinc-950 rounded-3xl border-zinc-300 dark:border-zinc-700">
					<code className="w-full font-mono text-sm leading-7 break-words text-zinc-900 dark:text-zinc-100 overflow-ellipsis whitespace-prewrap ">
						You will be redirected to the previous page in{" "}
						<span className="text-sky-500">
							{3 - count} seconds
						</span>
						.
					</code>
				</div>
				<div className="flex flex-wrap items-center justify-between gap-3 mt-10">
					<Link
						href="/"
						className="inline-flex items-center justify-center flex-1 px-5 py-3 text-base font-medium text-center text-white rounded-3xl bg-sky-600 hover:bg-sky-800"
					>
						<span className="mr-2 font-semibold text-md whitespace-nowrap">
							Go back home
						</span>
						<Home variant="Bulk" color="currentColor" />
					</Link>
					<Link
						href="/"
						className="inline-flex items-center justify-center flex-1 px-5 py-3 text-base font-medium text-center cursor-pointer md:mt-0 rounded-3xl text-sky-800 bg-sky-600/25 hover:bg-sky-600/50 dark:text-sky-300 dark:bg-sky-600/50 dark:hover:bg-sky-600/75"
					>
						<span className="mr-2 font-semibold text-md">
							Go back
						</span>
						<BackSquare variant="Bulk" color="currentColor" />
					</Link>
				</div>
			</div>
		</main>
	);
}
