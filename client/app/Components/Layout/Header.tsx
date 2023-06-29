"use client";
import { Button } from "flowbite-react";
import { Airplane, Flash, Moon, Sun1 } from "iconsax-react";
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
                    <Link href="/app" className="flex items-center">
                        <button
                            type="button"
                            className="mr-3 inline-flex items-center rounded-lg bg-black px-4 py-2 text-center text-sm font-medium text-white ring-0 hover:bg-purple-800 focus:outline-none dark:bg-purple-600 dark:hover:bg-purple-700 md:mr-0"
                        >
                            <span className="mr-2 hidden text-sm font-semibold md:block">
                                Launch App
                            </span>
                            <Flash variant="Bulk" color="currentColor" />
                        </button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
