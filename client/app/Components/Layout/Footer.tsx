import React from "react";

export default function Footer() {
	return (
		<footer className="relative bottom-0 left-0 w-screen px-4 py-3 border-t md:flex md:items-center md:justify-center md:px-6 border-zinc-200 bg-zinc-50/75 text-zinc-600 focus:border-sky-500 focus:ring-sky-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
			<span className="text-sm sm:text-center">
				© 2023{" "}
				<a
					href="https://foorsa.ma/new/"
					className="hover:underline"
					target="_blank"
					rel="noopener noreferrer"
				>
					Foorsa Consulting™
				</a>{" "}
				All Rights Reserved.
			</span>
		</footer>
	);
}
