"use client";
import React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/app/Components/Layout/Header";
import { ArrowSquareLeft, DirectLeft } from "iconsax-react";

export default function AppHeader() {
    return (
        <nav className="relative w-full">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-10">
                <Link href="/" className="flex items-center">
                    <button
                        type="button"
                        className="text-gray-500 ring-0 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none rounded-lg text-sm p-2.5"
                    >
                        <ArrowSquareLeft variant="Bulk" />
                    </button>
                </Link>
                <div className="flex md:order-2 gap-2">
                    <ThemeToggle />
                </div>
            </div>
        </nav>
    );
}
