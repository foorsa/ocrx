"use client"; // Error components must be Client Components

import { BackSquare, Home } from "iconsax-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { authErrorCodes } from "./errors/authErrors";

export default function AuthErrorPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const error = searchParams.get("error");

	const [count, setCount] = useState(0);

	const [ErrorInformation, setErrorInformation] = useState({
		message: "Unknown error",
		description: "An unknown error occurred.",
	});

	useEffect(() => {
		if (count === 10) {
			return router.back();
		}

		const interval = setInterval(() => {
			setCount((count) => count + 1);
		}, 1000);

		return () => clearInterval(interval);
	}, [count, router]);

	useEffect(() => {
		// The searchParams are available on the client side only.
		// The Error message is passed as a query parameter.
		// But the Error in the URL is only a string.
		// So we have to make it an Error object again.

		// If the error is not in the authErrorCodes object, then it is an unknown error.
		// If the error is in the authErrorCodes object, then it is a known error.

		const isKnownError = Object.keys(authErrorCodes).includes(
			error as string
		);

		if (isKnownError) {
			setErrorInformation(
				authErrorCodes[error as keyof typeof authErrorCodes]
			);
		} else {
			setErrorInformation(authErrorCodes.UNKNOWN_ERROR);
		}
	}, [error]);

	return (
		<main className="grid w-full min-h-full px-6 py-24 place-items-center sm:py-32 lg:px-8">
			<div className="max-w-xs text-center md:max-w-xl">
				<p className="text-base font-semibold text-green-500">500</p>
				<h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
					{ErrorInformation.message}
				</h1>
				{/* <hr className="w-48 h-1 mx-auto my-2 border-0 rounded bg-zinc-500 md:my-10 dark:bg-zinc-300/25" /> */}
				<p className="mt-6 text-base leading-7 text-zinc-600 dark:text-zinc-300">
					{ErrorInformation.description}
				</p>
				<div className="relative w-full p-4 mt-6 overflow-hidden border bg-zinc-50 dark:bg-zinc-950 rounded-3xl border-zinc-300 dark:border-zinc-700">
					<code className="w-full font-mono text-sm leading-7 break-words text-zinc-900 dark:text-zinc-100 overflow-ellipsis whitespace-prewrap ">
						{/* <span className="text-green-500">{error.name}:</span>{" "}
                        {error.message}
                        {"."} */}
						You will be redirected to the previous page in{" "}
						<span className="text-green-500">
							{10 - count} seconds
						</span>
						.
					</code>
				</div>
				<div className="flex flex-wrap items-center justify-between gap-3 mt-10">
					<Link
						href="/"
						className="inline-flex items-center justify-center flex-1 px-5 py-3 text-base font-medium text-center text-white rounded-3xl bg-green-500 hover:bg-green-800"
					>
						<span className="mr-2 font-semibold text-md whitespace-nowrap">
							Go back home
						</span>
						<Home variant="Bulk" color="currentColor" />
					</Link>
					<Link
						href="/"
						className="inline-flex items-center justify-center flex-1 px-5 py-3 text-base font-medium text-center cursor-pointer md:mt-0 rounded-3xl text-green-800 bg-green-500/25 hover:bg-green-500/50 dark:text-green-300 dark:bg-green-500/50 dark:hover:bg-green-500/75"
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
