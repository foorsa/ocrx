"use client";
import { Menu, Transition } from "@headlessui/react";
import {
	Airplane,
	Flash,
	Lock,
	Login,
	LoginCurve,
	Logout,
	Moon,
	Sun1,
} from "iconsax-react";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import React from "react";
import Image from "next/image";

import { useEffect, useState } from "react";

export default function Header() {
	const { data: session, status } = useSession();
	const [isLoading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		if (status && status !== "loading") {
			setLoading(false);
		}
	}, [status]);

	return (
		<nav className="relative w-full">
			<div className="flex flex-wrap items-center justify-between max-w-screen-xl p-10 mx-auto">
				<Link href="/" className="flex items-center">
					<img
						src="/Logo/Lockup.png"
						className="h-8 mr-3 invert dark:invert-0"
						alt="Foorsa Logo"
					/>
				</Link>
				<div className="flex gap-3 md:order-2">
					<ThemeToggle />
					{/* <Link href="/auth/sign-up" className="flex items-center">
                        <button
                            type="button"
                            className="inline-flex text-center justify-center items-center gap-3 rounded-xl p-2.5 text-sm text-zinc-500 ring-0 hover:bg-zinc-100 focus:outline-none dark:text-zinc-400 dark:hover:bg-zinc-700"
                        >
                            <LoginCurve variant="Bulk" color="currentColor" />
                            <span className="hidden text-sm font-semibold md:block">
                                Sign up
                            </span>
                        </button>
                    </Link> */}
					{isLoading ? null : status === "authenticated" ? (
						<UserDropdown />
					) : (
						<Link
							href="/auth/sign-in"
							className="flex items-center"
						>
							<button
								type="button"
								className="inline-flex text-center justify-center items-center gap-3 text-white dark:text-zinc-900 bg-zinc-950 hover:bg-zinc-900 focus:outline-none focus:ring-zinc-300 font-medium rounded-xl text-sm px-5 py-2.5 dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:border-zinc-100"
							>
								<Lock variant="Bulk" color="currentColor" />
								<span className="hidden text-sm font-semibold md:block">
									Sign in
								</span>
							</button>
						</Link>
					)}
				</div>
			</div>
		</nav>
	);
}

export function UserDropdown() {
	const { data: session, status } = useSession();
	const [isLoading, setLoading] = useState<boolean>(true);
	const [userInfo, setUserInfo] = useState<{
		id: string | number; // The unique identifier of the user.
		name: string; // The user's name.
		email: string; // The user's email address.
		image: string | undefined | null; // The user's avatar image URL.
	} | null>(null);

	useEffect(() => {
		if (status && status !== "loading") {
			setLoading(false);
		}
	}, [status]);

	return (
		<React.Fragment>
			{isLoading ? null : (
				<Menu
					as="div"
					className="relative z-50 inline-block gap-4 text-left"
				>
					<Menu.Button
						className={`inline-flex h-full justify-center items-center gap-3 rounded-xl text-zinc-900 px-3.5 py-2.5 text-sm font-semibold dark:text-white relative aspect-square bg-gradient-to-br from-green-500 to-sky-600 hover:from-green-600 hover:to-sky-700 overflow-hidden`}
					></Menu.Button>
					<Transition
						enter="transition duration-100 ease-out"
						enterFrom="transform scale-95 opacity-0"
						enterTo="transform scale-100 opacity-100"
						leave="transition duration-75 ease-out"
						leaveFrom="transform scale-100 opacity-100"
						leaveTo="transform scale-95 opacity-0"
					>
						<Menu.Items
							className={`absolute mt-1 min-w-[200px] max-h-60 top-full w-auto max-w-sm overflow-auto text-base sm:text-sm z-50 p-4 gap-1 origin-top-right bg-zinc-50 rounded-xl shadow-2xl focus:outline-none dark:bg-zinc-900 dark:divide-zinc-700 flex flex-col right-0 border border-zinc-300 dark:border-zinc-600`}
						>
							{/* User Name and Email */}
							<div className="flex flex-row flex-wrap items-center justify-start gap-3">
								<div className="flex flex-row flex-wrap items-center justify-start gap-3 mb-4">
									<div
										className={`inline-flex h-8 w-8 justify-center items-center gap-3 rounded-xl text-zinc-900 px-3.5 py-3.5 text-sm font-semibold dark:text-white relative aspect-square bg-gradient-to-br from-green-500 to-sky-600 hover:from-green-600 hover:to-sky-700 overflow-hidden`}
									></div>
									<div className="relative flex flex-col gap-1 min-w-fit">
										<span className="text-sm font-semibold truncate text-zinc-900 dark:text-white">
											{session?.user?.name}
										</span>
										<span className="text-xs font-medium truncate text-zinc-500 dark:text-zinc-400">
											{session?.user?.email}
										</span>
									</div>
								</div>
							</div>
							<Menu.Item>
								{({ active, close }) => (
									<Link
										href="/auth/sign-out"
										className="flex items-center"
									>
										<button
											type="button"
											onClick={() => {
												signOut({ redirect: false });
												close();
											}}
											className={`inline-flex justify-start items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-red-500 bg-red-100 dark:bg-red-950 hover:bg-red-500 dark:hover:bg-red-500 hover:text-white dark:text-red-200 dark:hover:text-white w-full min-h-fit min-w-max`}
										>
											<Logout
												className={`h-5 w-5 ${
													active
														? "text-white dark:text-white"
														: "text-red-500 dark:text-red-400"
												}`}
												variant="Bulk"
												color="currentColor"
												// size={20}
											/>
											<span className="ml-2 text-sm font-medium">
												Sign out
											</span>
										</button>
									</Link>
								)}
							</Menu.Item>
						</Menu.Items>
					</Transition>
				</Menu>
			)}
		</React.Fragment>
	);
}

export const ThemeToggle = () => {
	const { systemTheme, theme, setTheme } = useTheme();
	const currentTheme = theme === "system" ? systemTheme : theme;

	return (
		<button
			id="theme-toggle"
			type="button"
			title="Toggle Theme"
			onClick={() =>
				theme == "dark" ? setTheme("light") : setTheme("dark")
			}
			className="rounded-xl p-2.5 text-sm text-zinc-500 ring-0 hover:bg-zinc-100 focus:outline-none dark:text-zinc-400 dark:hover:bg-zinc-700"
		>
			<Sun1
				id="theme-toggle-dark-icon"
				className="hidden w-5 h-5 dark:block"
				variant="Bulk"
			/>
			<Moon
				id="theme-toggle-light-icon"
				className="block w-5 h-5 dark:hidden"
				variant="Bulk"
			/>
		</button>
	);
};
