"use client";
import { Button } from "flowbite-react";
import {
    Airplane,
    Flash,
    Lock,
    Login,
    LoginCurve,
    Moon,
    Sun1,
} from "iconsax-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import React from "react";

import { useEffect, useState } from "react";

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
            className="rounded-lg p-2.5 text-sm text-zinc-500 ring-0 hover:bg-zinc-100 focus:outline-none dark:text-zinc-400 dark:hover:bg-zinc-700"
        >
            <Sun1
                id="theme-toggle-dark-icon"
                className="hidden h-5 w-5 dark:block"
                variant="Bulk"
            />
            <Moon
                id="theme-toggle-light-icon"
                className="block h-5 w-5 dark:hidden"
                variant="Bulk"
            />
        </button>
    );
};

export default function Header() {
    return (
        <nav className="relative w-full">
            <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-10">
                <Link href="/" className="flex items-center">
                    <img
                        src="/Logo/Lockup.png"
                        className="mr-3 h-8 invert dark:invert-0"
                        alt="Foorsa Logo"
                    />
                </Link>
                <div className="flex gap-2 md:order-2">
                    <ThemeToggle />
                    <Link href="/auth/sign-up" className="flex items-center">
                        <button
                            type="button"
                            className="inline-flex text-center justify-center items-center gap-2 rounded-lg p-2.5 text-sm text-zinc-500 ring-0 hover:bg-zinc-100 focus:outline-none dark:text-zinc-400 dark:hover:bg-zinc-700"
                        >
                            <LoginCurve variant="Bulk" color="currentColor" />
                            <span className="hidden text-sm font-semibold md:block">
                                Sign up
                            </span>
                        </button>
                    </Link>
                    <Link href="/auth/sign-in" className="flex items-center">
                        <button
                            type="button"
                            className="inline-flex text-center justify-center items-center gap-2 text-white bg-zinc-800 hover:bg-zinc-900 focus:outline-none focus:ring-4 focus:ring-zinc-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:focus:ring-zinc-700 dark:border-zinc-700"
                        >
                            <Lock variant="Bulk" color="currentColor" />
                            <span className="hidden text-sm font-semibold md:block">
                                Sign in
                            </span>
                        </button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
