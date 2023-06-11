"use client";
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
            onClick={() =>
                theme == "dark" ? setTheme("light") : setTheme("dark")
            }
            className="text-gray-500 ring-0 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none rounded-lg text-sm p-2.5"
        >
            <Sun1
                id="theme-toggle-dark-icon"
                className="block w-5 h-5 dark:hidden"
                variant="Bulk"
            />
            <Moon
                id="theme-toggle-light-icon"
                className="hidden w-5 h-5 dark:block"
                variant="Bulk"
            />
        </button>
    );
};

export default function Header() {
    return (
        <nav className="relative w-full">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-10">
                <Link href="/" className="flex items-center">
                    <img
                        src="/Logo/Lockup.png"
                        className="h-8 mr-3 invert dark:invert-0"
                        alt="Foorsa Logo"
                    />
                </Link>
                <div className="flex md:order-2 gap-2">
                    <ThemeToggle />
                    <Link href="/translate" className="flex items-center">
                        <button
                            type="button"
                            className="text-white ring-0 bg-violet-700 hover:bg-violet-800 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-violet-600 dark:hover:bg-violet-700 inline-flex items-center"
                        >
                            <span className="mr-2 text-sm font-semibold hidden md:block">
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
