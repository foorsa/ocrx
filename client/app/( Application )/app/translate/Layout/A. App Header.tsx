"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ThemeToggle, UserDropdown } from "@/app/Components/Layout/Header";
import { ArrowSquareLeft, DirectLeft } from "iconsax-react";
import { useSession } from "next-auth/react";

export default function AppHeader() {
	const { data: session, status } = useSession();
	const [isLoading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		if (status && status !== "loading") {
			setLoading(false);
		}
	}, [status]);

	return (
		<nav className="relative w-full">
			<div className="flex flex-wrap items-center justify-between max-w-screen-xl p-5 mx-auto">
				<Link href="/" className="flex items-center">
					<button
						type="button"
						title="Back"
						className="text-zinc-500 ring-0 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 focus:outline-none rounded-xl text-sm p-2.5"
					>
						<ArrowSquareLeft variant="Bulk" />
					</button>
				</Link>
				<div className="flex gap-3 md:order-2">
					<ThemeToggle />
					{isLoading
						? null
						: status === "authenticated" && <UserDropdown />}
				</div>
			</div>
		</nav>
	);
}
